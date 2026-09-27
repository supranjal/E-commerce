import { Resend } from "resend";
import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";
import { generateOrderConfirmedEmail } from "./templates/order-confirmed";
import { generateOrderProcessingEmail } from "./templates/order-processing";
import { generateOrderShippedEmail } from "./templates/order-shipped";
import { generateOrderDeliveredEmail } from "./templates/order-delivered";
import { sendOrderConfirmationWhatsApp } from "@/lib/whatsapp/whatsapp.service";

export type OrderNotificationType =
  | "ORDER_CONFIRMED"
  | "ORDER_PROCESSING"
  | "ORDER_SHIPPED"
  | "ORDER_DELIVERED";

export interface SendOrderNotificationParams {
  order: {
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    city: string;
    country: string;
    total: number;
    currency: string;
    paymentMethod: string;
    status: string;
    trackingNumber?: string | null;
    createdAt?: Date | string;
    items?: {
      product?: { name: string } | null;
      quantity: number;
      price: number;
    }[];
  };
  previousStatus?: string;
  newStatus: string;
  expectedNextStep?: string;
}

export interface EmailDispatchResult {
  success: boolean;
  notificationType: OrderNotificationType;
  mode: "development" | "production";
  provider?: "gmail" | "resend" | "console_simulated";
  messageId?: string;
  isDuplicate?: boolean;
  recipientEmail?: string;
  error?: string;
}

// In-memory duplicate tracker for mock/ephemeral orders
const inMemoryEmailLogs = new Set<string>();

/**
 * Server-side order email dispatch service supporting:
 * 1. Genuine Gmail delivery via Google SMTP (GMAIL_USER + GMAIL_APP_PASSWORD)
 * 2. Resend API delivery (RESEND_API_KEY)
 * 3. Safe development mode console logging with duplicate protection
 */
export async function sendOrderNotification(
  params: SendOrderNotificationParams
): Promise<EmailDispatchResult> {
  const { order, previousStatus, newStatus, expectedNextStep } = params;

  // Determine appropriate notification type based on new status
  let notificationType: OrderNotificationType | null = null;
  if (newStatus === "CONFIRMED") {
    notificationType = "ORDER_CONFIRMED";
  } else if (newStatus === "PROCESSING") {
    notificationType = "ORDER_PROCESSING";
  } else if (newStatus === "SHIPPED") {
    notificationType = "ORDER_SHIPPED";
  } else if (newStatus === "DELIVERED") {
    notificationType = "ORDER_DELIVERED";
  }

  // If status is not one of the notification milestones, skip
  if (!notificationType) {
    return {
      success: true,
      notificationType: "ORDER_CONFIRMED",
      mode: "development",
      isDuplicate: true,
    };
  }

  // Target recipient: Allows optional TEST_EMAIL_RECIPIENT env override or uses order.customerEmail
  const recipientEmail =
    process.env.TEST_EMAIL_RECIPIENT?.trim() || order.customerEmail;

  const logKey = `${order.id}:${notificationType}`;

  // 1. In-memory check (works for demo orders and instant repeat triggers)
  if (inMemoryEmailLogs.has(logKey)) {
    console.log(
      `[EMAIL DUPLICATE BLOCKED] Order ${order.orderNumber} already received notification '${notificationType}'. Skipping duplicate email.`
    );
    return {
      success: true,
      notificationType,
      mode: "development",
      isDuplicate: true,
      recipientEmail,
    };
  }

  // 2. Duplicate Protection Check in PostgreSQL (Requirement 4)
  try {
    const existingLog = await prisma.orderEmailLog.findFirst({
      where: {
        orderId: order.id,
        notificationType,
        status: { in: ["SENT", "DEV_LOGGED"] },
      },
    });

    if (existingLog) {
      inMemoryEmailLogs.add(logKey);
      console.log(
        `[EMAIL DUPLICATE BLOCKED] Order ${order.orderNumber} already received notification '${notificationType}' on ${existingLog.sentAt.toISOString()}. Skipping duplicate email.`
      );
      return {
        success: true,
        notificationType,
        mode: "development",
        isDuplicate: true,
        recipientEmail,
      };
    }
  } catch (dbErr) {
    console.warn("Could not query OrderEmailLog for duplicate check:", dbErr);
  }

  if (notificationType === "ORDER_CONFIRMED") {
    try {
      await sendOrderConfirmationWhatsApp(order);
    } catch (whatsappError) {
      console.warn("Order confirmation WhatsApp dispatch failed:", whatsappError);
    }
  }

  // 3. Generate email content based on notification type
  let emailContent: { subject: string; html: string; text: string };

  switch (notificationType) {
    case "ORDER_CONFIRMED": {
      const itemsList =
        order.items && order.items.length > 0
          ? order.items.map((i) => ({
              name: i.product?.name || "Sacred Rudraksha Item",
              quantity: i.quantity,
              price: i.price,
            }))
          : [
              {
                name: "Authentic Consecrated Himalayan Specimen",
                quantity: 1,
                price: order.total,
              },
            ];

      emailContent = generateOrderConfirmedEmail({
        customerName: order.customerName,
        orderNumber: order.orderNumber,
        orderDate: new Date(order.createdAt || Date.now()).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        ),
        items: itemsList,
        totalAmount: order.total,
        currency: order.currency || "NPR",
        paymentMethod: order.paymentMethod,
        shippingAddress: order.shippingAddress,
        city: order.city,
        country: order.country,
        orderStatus: newStatus,
      });
      break;
    }

    case "ORDER_PROCESSING": {
      emailContent = generateOrderProcessingEmail({
        customerName: order.customerName,
        orderNumber: order.orderNumber,
        orderStatus: newStatus,
        expectedNextStep,
      });
      break;
    }

    case "ORDER_SHIPPED": {
      emailContent = generateOrderShippedEmail({
        customerName: order.customerName,
        orderNumber: order.orderNumber,
        shippingStatus: newStatus,
        shippingAddress: order.shippingAddress,
        city: order.city,
        country: order.country,
        trackingNumber: order.trackingNumber,
      });
      break;
    }

    case "ORDER_DELIVERED": {
      const summary =
        order.items && order.items.length > 0
          ? order.items
              .map((i) => `${i.product?.name || "Sacred Rudraksha"} (x${i.quantity})`)
              .join(", ")
          : "Certified Himalayan Rudraksha Package";

      emailContent = generateOrderDeliveredEmail({
        customerName: order.customerName,
        orderNumber: order.orderNumber,
        deliveryStatus: newStatus,
        itemsSummary: summary,
      });
      break;
    }
  }

  // 4. Determine Delivery Channel
  const gmailUser = process.env.GMAIL_USER?.trim();
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD?.trim();
  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  const shippingPartnerEmail = process.env.SHIPPING_PARTNER_EMAIL?.trim();
  const confirmationBcc =
    notificationType === "ORDER_CONFIRMED" && shippingPartnerEmail
      ? [shippingPartnerEmail]
      : undefined;
  const emailFrom =
    process.env.EMAIL_FROM ||
    (gmailUser ? `"RudraKart" <${gmailUser}>` : "RudraKart Orders <orders@rudrakart.com>");

  // Always mark duplicate log tracker
  inMemoryEmailLogs.add(logKey);

  // OPTION A: Genuine Gmail SMTP Delivery via Google
  if (gmailUser && gmailAppPassword) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: gmailUser,
          pass: gmailAppPassword,
        },
      });

      const info = await transporter.sendMail({
        from: emailFrom,
        to: recipientEmail,
        bcc: confirmationBcc,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      });

      console.log(`
┌──────────────────────────────────────────────────────────┐
│      GENUINE GMAIL DELIVERED SUCCESSFULLY! ✉️           │
├──────────────────────────────────────────────────────────┤
│ Recipient Inbox:  ${recipientEmail.padEnd(38)} │
│ Notification:     ${notificationType.padEnd(38)} │
│ Order Number:     ${order.orderNumber.padEnd(38)} │
│ Message ID:       ${info.messageId.slice(0, 38).padEnd(38)} │
└──────────────────────────────────────────────────────────┘
`);

      // Write to DB
      try {
        const orderExists = await prisma.order.findUnique({
          where: { id: order.id },
          select: { id: true },
        });
        if (orderExists) {
          await prisma.orderEmailLog.create({
            data: {
              orderId: order.id,
              email: recipientEmail,
              notificationType,
              status: "SENT",
              sentAt: new Date(),
            },
          });
        }
      } catch {}

      return {
        success: true,
        notificationType,
        mode: "production",
        provider: "gmail",
        messageId: info.messageId,
        recipientEmail,
        isDuplicate: false,
      };
    } catch (gmailErr: any) {
      console.error("[GMAIL SMTP ERROR]:", gmailErr.message);
      // Fallback to recording failure
      try {
        await prisma.orderEmailLog.create({
          data: {
            orderId: order.id,
            email: recipientEmail,
            notificationType,
            status: "FAILED",
            errorMessage: gmailErr.message,
          },
        });
      } catch {}

      return {
        success: false,
        notificationType,
        mode: "production",
        provider: "gmail",
        error: gmailErr.message,
      };
    }
  }

  // OPTION B: Resend API Delivery
  if (resendApiKey && resendApiKey.startsWith("re_")) {
    try {
      const resend = new Resend(resendApiKey);
      const { data: resendData, error: resendError } = await resend.emails.send({
        from: emailFrom,
        to: [recipientEmail],
        bcc: confirmationBcc,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      });

      if (resendError) {
        console.error("[RESEND ERROR]:", resendError);
        return {
          success: false,
          notificationType,
          mode: "production",
          provider: "resend",
          error: resendError.message,
        };
      }

      console.log(`[RESEND EMAIL DELIVERED] To: ${recipientEmail}, ID: ${resendData?.id}`);

      try {
        const orderExists = await prisma.order.findUnique({
          where: { id: order.id },
          select: { id: true },
        });
        if (orderExists) {
          await prisma.orderEmailLog.create({
            data: {
              orderId: order.id,
              email: recipientEmail,
              notificationType,
              status: "SENT",
              sentAt: new Date(),
            },
          });
        }
      } catch {}

      return {
        success: true,
        notificationType,
        mode: "production",
        provider: "resend",
        messageId: resendData?.id,
        recipientEmail,
        isDuplicate: false,
      };
    } catch (resendErr: any) {
      console.error("[RESEND EXCEPTION]:", resendErr);
      return {
        success: false,
        notificationType,
        mode: "production",
        provider: "resend",
        error: resendErr.message,
      };
    }
  }

  // OPTION C: Development Mode (Simulated Console Delivery)
  console.log(`
┌──────────────────────────────────────────────────────────┐
│        RUDRAKART EMAIL NOTIFICATION (DEV MODE)           │
├──────────────────────────────────────────────────────────┤
│ Mode:             Console Simulated (To send to real     │
│                   Gmail, set GMAIL_USER & APP_PASSWORD)  │
│ Recipient:        ${recipientEmail.padEnd(38)} │
│ Notification:     ${notificationType.padEnd(38)} │
│ Order Number:     ${order.orderNumber.padEnd(38)} │
│ Subject:          ${emailContent.subject.slice(0, 38).padEnd(38)} │
│ Date:             ${new Date().toISOString().padEnd(38)} │
├──────────────────────────────────────────────────────────┤
│ Status Transition: ${(previousStatus || "INIT") + " -> " + newStatus}
└──────────────────────────────────────────────────────────┘
`);

  try {
    const orderExists = await prisma.order.findUnique({
      where: { id: order.id },
      select: { id: true },
    });

    if (orderExists) {
      await prisma.orderEmailLog.create({
        data: {
          orderId: order.id,
          email: recipientEmail,
          notificationType,
          status: "DEV_LOGGED",
          sentAt: new Date(),
        },
      });
    }
  } catch {}

  return {
    success: true,
    notificationType,
    mode: "development",
    provider: "console_simulated",
    messageId: `dev-sim-${Date.now()}`,
    recipientEmail,
    isDuplicate: false,
  };
}

