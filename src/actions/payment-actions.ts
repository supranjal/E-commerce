"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendOrderNotification } from "@/lib/email/email.service";
import { createSecureTransactionRecord } from "@/lib/security/transaction-crypto";
import {
  verifyEsewaSandboxCredentials,
  verifyKhaltiSandboxCredentials,
  type WalletGateway,
} from "@/lib/payments/sandbox";

async function requireCustomerId() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { userId: null as string | null, userEmail: null as string | null, error: "Sign in to continue payment." };
  }
  const sessionUser = session.user as any;
  if (sessionUser.id) {
    return { userId: sessionUser.id as string, userEmail: sessionUser.email as string | null, error: null };
  }
  if (sessionUser.email) {
    const user = await prisma.user.findUnique({
      where: { email: sessionUser.email.toLowerCase().trim() },
    });
    if (user) {
      return { userId: user.id, userEmail: user.email, error: null };
    }
  }
  return { userId: null as string | null, userEmail: null as string | null, error: "Sign in to continue payment." };
}

export async function getSandboxPaymentOrder(orderNumber: string) {
  const { userId, userEmail, error } = await requireCustomerId();
  if (!userId) return { success: false as const, error };

  const order = await prisma.order.findFirst({
    where: {
      orderNumber,
      OR: [
        { userId },
        userEmail ? { customerEmail: userEmail } : undefined,
      ].filter(Boolean) as any,
    },
    select: {
      orderNumber: true,
      total: true,
      currency: true,
      status: true,
      paymentStatus: true,
      paymentMethod: true,
      customerName: true,
    },
  });

  if (!order) {
    return { success: false as const, error: "Order was not found for this account." };
  }

  if (
    order.paymentMethod !== "ESEWA" &&
    order.paymentMethod !== "KHALTI" &&
    order.paymentMethod !== "CARD"
  ) {
    return {
      success: false as const,
      error: "This order is not a recognized online payment.",
    };
  }

  return { success: true as const, order };
}

export async function confirmSandboxWalletPayment(input: {
  orderNumber: string;
  gateway: WalletGateway;
  esewaId?: string;
  password?: string;
  mpin?: string;
  token?: string;
  mobile?: string;
  otp?: string;
}) {
  const { userId, error } = await requireCustomerId();
  if (!userId) return { success: false, error };

  const credentialsValid =
    input.gateway === "ESEWA"
      ? verifyEsewaSandboxCredentials({
          esewaId: input.esewaId || "",
          password: input.password || "",
          mpin: input.mpin || "",
          token: input.token || "",
        })
      : verifyKhaltiSandboxCredentials({
          mobile: input.mobile || "",
          mpin: input.mpin || "",
          otp: input.otp || "",
        });

  if (!credentialsValid) {
    await prisma.order.updateMany({
      where: {
        orderNumber: input.orderNumber,
        userId,
        paymentStatus: "PENDING",
        status: "PENDING",
      },
      data: { paymentStatus: "FAILED" },
    });
    return {
      success: false,
      error:
        "Sandbox credentials were rejected. Payment status is marked as FAILED. Check the published test credentials on this page and try again.",
    };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findFirst({
        where: { orderNumber: input.orderNumber, userId },
        include: { items: { include: { product: true } } },
      });

      if (!order) {
        throw new Error("Order was not found for this account.");
      }
      if (order.paymentMethod !== input.gateway) {
        throw new Error("Payment method does not match this sandbox.");
      }
      if (order.status === "CANCELLED") {
        throw new Error("This order was cancelled.");
      }
      if (order.paymentStatus === "PAID") {
        return { alreadyPaid: true, order };
      }
      if (
        order.paymentStatus !== "PENDING" &&
        order.paymentStatus !== "FAILED"
      ) {
        throw new Error("This order is not waiting for wallet payment.");
      }

      const transactionId = `TXN-${input.gateway}-${Math.floor(
        10000000 + Math.random() * 90000000,
      )}`;
      const signed = createSecureTransactionRecord({
        transactionId,
        orderId: order.id,
        orderNumber: order.orderNumber,
        amount: order.total,
        currency: order.currency,
        paymentMethod: input.gateway,
      });

      const updatedCount = await tx.order.updateMany({
        where: {
          id: order.id,
          paymentStatus: { in: ["PENDING", "FAILED"] },
          status: "PENDING",
        },
        data: {
          paymentStatus: "PAID",
          status: "CONFIRMED",
          transactionId,
        },
      });
      if (updatedCount.count !== 1) {
        throw new Error("Payment was already processed. Refresh and continue.");
      }

      await tx.paymentTransaction.create({
        data: {
          transactionId,
          orderId: order.id,
          amount: order.total,
          currency: order.currency,
          paymentMethod: input.gateway,
          paymentStatus: "PAID",
          transactionHash: signed.transactionHash,
          digitalSignature: signed.digitalSignature,
          signatureAlgorithm: signed.signatureAlgorithm,
          canonicalPayload: signed.canonicalPayload,
        },
      });

      const confirmed = await tx.order.findUniqueOrThrow({
        where: { id: order.id },
        include: { items: { include: { product: true } } },
      });

      return { alreadyPaid: false, order: confirmed };
    });

    if (!result.alreadyPaid) {
      try {
        await sendOrderNotification({
          order: result.order,
          previousStatus: "PENDING",
          newStatus: "CONFIRMED",
        });
      } catch (emailError) {
        console.warn("Wallet payment confirmation email failed:", emailError);
      }
    }

    return {
      success: true,
      alreadyPaid: result.alreadyPaid,
      orderNumber: result.order.orderNumber,
      transactionId: result.order.transactionId,
    };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Sandbox payment could not be completed.";
    return { success: false, error: message };
  }
}

export async function cancelSandboxWalletPayment(orderNumber: string) {
  const { userId, error } = await requireCustomerId();
  if (!userId) return { success: false, error };

  try {
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findFirst({
        where: { orderNumber, userId },
        include: { items: true },
      });
      if (!order) {
        throw new Error("Order was not found for this account.");
      }
      if (order.paymentStatus === "PAID") {
        throw new Error("Paid orders cannot be cancelled from the sandbox.");
      }
      if (order.status === "CANCELLED") {
        return;
      }
      if (order.paymentMethod !== "ESEWA" && order.paymentMethod !== "KHALTI") {
        throw new Error("Only wallet sandbox orders can be cancelled here.");
      }

      const cancelled = await tx.order.updateMany({
        where: {
          id: order.id,
          status: { in: ["PENDING"] },
          paymentStatus: { in: ["PENDING", "UNPAID", "FAILED"] },
        },
        data: {
          status: "CANCELLED",
          paymentStatus: "FAILED",
        },
      });
      if (cancelled.count !== 1) {
        throw new Error("This order can no longer be cancelled.");
      }

      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
    });

    return { success: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Payment could not be cancelled.";
    return { success: false, error: message };
  }
}

export async function failSandboxWalletPayment(orderNumber: string) {
  const { userId, error } = await requireCustomerId();
  if (!userId) return { success: false, error };

  try {
    const updated = await prisma.order.updateMany({
      where: {
        orderNumber,
        userId,
        status: "PENDING",
        paymentStatus: { in: ["PENDING", "FAILED"] },
      },
      data: {
        paymentStatus: "FAILED",
      },
    });

    if (updated.count !== 1) {
      return {
        success: false,
        error: "Order is not in a pending payment state.",
      };
    }

    return { success: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Could not update payment status.";
    return { success: false, error: message };
  }
}

export async function confirmDummyCardPayment(input: {
  orderNumber: string;
  cardNumber: string;
  cardholderName: string;
  expiry: string;
  cvv: string;
}) {
  const { userId, error } = await requireCustomerId();
  if (!userId) return { success: false, error };

  const cleanCardNumber = input.cardNumber.replace(/\s+/g, "");
  if (!cleanCardNumber || cleanCardNumber.length < 15 || cleanCardNumber.length > 19) {
    return {
      success: false,
      error: "Please enter a valid 16-digit card number (e.g. 4242 4242 4242 4242).",
    };
  }
  if (!input.cardholderName?.trim()) {
    return { success: false, error: "Please enter the cardholder's name." };
  }
  if (!input.expiry?.trim() || !input.expiry.includes("/")) {
    return { success: false, error: "Please enter a valid expiry date (MM/YY)." };
  }
  if (!input.cvv?.trim() || input.cvv.length < 3) {
    return {
      success: false,
      error: "Please enter a valid 3 or 4 digit CVC/CVV security code.",
    };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findFirst({
        where: { orderNumber: input.orderNumber, userId },
        include: { items: { include: { product: true } } },
      });

      if (!order) {
        throw new Error("Order was not found for this account.");
      }
      if (order.paymentMethod !== "CARD") {
        throw new Error("Payment method does not match International Card.");
      }
      if (order.status === "CANCELLED") {
        throw new Error("This order was cancelled.");
      }
      if (order.paymentStatus === "PAID") {
        return { alreadyPaid: true, order };
      }
      if (
        order.paymentStatus !== "PENDING" &&
        order.paymentStatus !== "FAILED"
      ) {
        throw new Error("This order is not waiting for payment.");
      }

      const transactionId = `TXN-CARD-${Math.floor(
        10000000 + Math.random() * 90000000,
      )}`;
      const signed = createSecureTransactionRecord({
        transactionId,
        orderId: order.id,
        orderNumber: order.orderNumber,
        amount: order.total,
        currency: order.currency,
        paymentMethod: "CARD",
      });

      const updatedCount = await tx.order.updateMany({
        where: {
          id: order.id,
          paymentStatus: { in: ["PENDING", "FAILED"] },
          status: "PENDING",
        },
        data: {
          paymentStatus: "PAID",
          status: "CONFIRMED",
          transactionId,
        },
      });
      if (updatedCount.count !== 1) {
        throw new Error("Payment was already processed. Refresh and continue.");
      }

      await tx.paymentTransaction.create({
        data: {
          transactionId,
          orderId: order.id,
          amount: order.total,
          currency: order.currency,
          paymentMethod: "CARD",
          paymentStatus: "PAID",
          transactionHash: signed.transactionHash,
          digitalSignature: signed.digitalSignature,
          signatureAlgorithm: signed.signatureAlgorithm,
          canonicalPayload: signed.canonicalPayload,
        },
      });

      const confirmed = await tx.order.findUniqueOrThrow({
        where: { id: order.id },
        include: { items: { include: { product: true } } },
      });

      return { alreadyPaid: false, order: confirmed };
    });

    if (!result.alreadyPaid) {
      try {
        await sendOrderNotification({
          order: result.order,
          previousStatus: "PENDING",
          newStatus: "CONFIRMED",
        });
      } catch (notifyErr) {
        console.warn("Order confirmation email failed:", notifyErr);
      }
    }

    return { success: true, orderNumber: result.order.orderNumber };
  } catch (err: any) {
    return {
      success: false,
      error:
        err?.message ||
        "Card transaction processing failed. Please try again.",
    };
  }
}

