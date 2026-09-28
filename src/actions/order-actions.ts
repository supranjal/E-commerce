"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions, isAdmin } from "@/lib/auth";
import { OrderStatus, PaymentMethod } from "@/types";
import { sendOrderNotification } from "@/lib/email/email.service";

export interface CreateOrderInput {
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  country: string;
  postalCode?: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  currency: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
}

export interface UpdateOrderStatusInput {
  orderId: string;
  newStatus: OrderStatus;
  trackingNumber?: string;
}

export async function createOrder(data: CreateOrderInput) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    if (!userId) {
      return { success: false, error: "Sign in before placing an order." };
    }
    if (data.paymentMethod !== "CASH_ON_DELIVERY") {
      return {
        success: false,
        error: "Online payment is unavailable. Select Cash on Delivery.",
      };
    }
    if (
      !data.customerName?.trim() ||
      !data.customerEmail?.includes("@") ||
      !data.customerPhone?.trim() ||
      !data.shippingAddress?.trim() ||
      !data.city?.trim() ||
      !Array.isArray(data.items) ||
      data.items.length === 0 ||
      data.items.length > 50
    ) {
      return {
        success: false,
        error: "Enter valid shipping details and at least one item.",
      };
    }

    const quantities = new Map<string, number>();
    for (const item of data.items) {
      if (
        !item.productId ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 99
      ) {
        return {
          success: false,
          error: "Cart contains an invalid product or quantity.",
        };
      }
      quantities.set(
        item.productId,
        (quantities.get(item.productId) || 0) + item.quantity,
      );
    }

    const orderNumber = `RK-${new Date().getFullYear()}-${Math.floor(
      100000 + Math.random() * 900000,
    )}`;
    const order = await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: { id: { in: Array.from(quantities.keys()) } },
      });
      if (products.length !== quantities.size) {
        throw new Error("One or more products are no longer available.");
      }

      let total = 0;
      for (const product of products) {
        const quantity = quantities.get(product.id)!;
        const stockUpdate = await tx.product.updateMany({
          where: { id: product.id, stock: { gte: quantity } },
          data: { stock: { decrement: quantity } },
        });
        if (stockUpdate.count !== 1) {
          throw new Error(`${product.name} does not have enough stock.`);
        }
        total += product.price * quantity;
      }

      return tx.order.create({
        data: {
          orderNumber,
          userId,
          customerName: data.customerName.trim(),
          customerEmail: data.customerEmail.trim().toLowerCase(),
          customerPhone: data.customerPhone.trim(),
          shippingAddress: data.shippingAddress.trim(),
          city: data.city.trim(),
          country: data.country?.trim() || "Nepal",
          postalCode: data.postalCode?.trim(),
          notes: data.notes?.trim(),
          paymentMethod: "CASH_ON_DELIVERY",
          paymentStatus: "UNPAID",
          status: "CONFIRMED",
          total,
          currency: "NPR",
          items: {
            create: products.map((product) => ({
              productId: product.id,
              quantity: quantities.get(product.id)!,
              price: product.price,
            })),
          },
        },
      });
    });

    try {
      await sendOrderNotification({
        order,
        previousStatus: "PENDING",
        newStatus: "CONFIRMED",
      });
    } catch (error) {
      console.warn("Order confirmation email dispatch failed:", error);
    }

    return {
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      total: order.total,
      currency: order.currency,
      paymentMethod: order.paymentMethod,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Order could not be saved. Please try again.",
    };
  }
}

export async function updateOrderStatus(input: UpdateOrderStatusInput) {
  if (!(await isAdmin())) {
    return { success: false, error: "Admin access required." };
  }

  try {
    const { orderId, newStatus, trackingNumber } = input;
    if (
      !orderId ||
      ![
        "PENDING",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
      ].includes(newStatus)
    ) {
      return { success: false, error: "Invalid order status update." };
    }

    // Fetch order first to check for duplicate/no-op status transition
    const existing = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!existing) {
      return {
        success: false,
        error: `Order with ID ${orderId} not found.`,
      };
    }

    const previousStatus = existing.status;

    if (previousStatus === "CANCELLED" && newStatus !== "CANCELLED") {
      return {
        success: false,
        error: "Cancelled orders cannot be reopened.",
      };
    }

    // Duplicate protection: Do not trigger if status hasn't changed
    if (
      previousStatus === newStatus &&
      (!trackingNumber || trackingNumber === existing.trackingNumber)
    ) {
      return {
        success: true,
        message: `Order is already in ${newStatus} status. Duplicate transition ignored.`,
        isDuplicate: true,
        order: existing,
        previousStatus,
        newStatus,
      };
    }

    const updated = await prisma.$transaction(async (tx) => {
      const statusUpdate = await tx.order.updateMany({
        where: { id: orderId, status: previousStatus },
        data: {
          status: newStatus as any,
          ...(trackingNumber ? { trackingNumber } : {}),
        },
      });
      if (statusUpdate.count !== 1) {
        throw new Error(
          "Order status changed concurrently. Refresh and try again.",
        );
      }

      if (newStatus === "CANCELLED") {
        for (const item of existing.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }

      return tx.order.findUniqueOrThrow({
        where: { id: orderId },
        include: {
          items: { include: { product: true } },
        },
      });
    });

    // Trigger lifecycle email notification (CONFIRMED -> PROCESSING -> SHIPPED -> DELIVERED)
    try {
      await sendOrderNotification({
        order: updated,
        previousStatus,
        newStatus,
      });
    } catch (emailErr) {
      console.warn("Order status update email dispatch failed:", emailErr);
    }

    return {
      success: true,
      order: updated,
      previousStatus,
      newStatus,
      isDuplicate: false,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to update order status.",
    };
  }
}

export async function getAdminOrders() {
  if (!(await isAdmin())) {
    return { success: false, orders: [], error: "Admin access required." };
  }

  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        paymentTransactions: true,
        emailLogs: true,
      },
    });

    return {
      success: true,
      orders,
    };
  } catch (error: any) {
    console.warn(
      "Could not fetch DB orders for admin, returning empty array:",
      error.message,
    );
    return {
      success: false,
      orders: [],
      error: error.message,
    };
  }
}
