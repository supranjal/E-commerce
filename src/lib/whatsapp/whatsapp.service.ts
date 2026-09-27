interface WhatsAppOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  total: number;
  currency: string;
}

const inMemoryWhatsAppLogs = new Set<string>();

function getOrderConfirmationMessage(order: WhatsAppOrder) {
  return [
    `Hello ${order.customerName}, your RudraKart order is confirmed.`,
    `Order: ${order.orderNumber}`,
    `Total: ${order.currency} ${order.total.toLocaleString()}`,
    "We will notify you when your order is processed and shipped.",
  ].join("\n");
}

export async function sendOrderConfirmationWhatsApp(order: WhatsAppOrder) {
  const logKey = `${order.id}:ORDER_CONFIRMED`;
  const phoneNumber = order.customerPhone.trim();

  if (!phoneNumber || inMemoryWhatsAppLogs.has(logKey)) {
    return { success: true, isDuplicate: true };
  }

  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN?.trim();
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();
  const apiVersion = process.env.WHATSAPP_API_VERSION?.trim() || "v20.0";

  inMemoryWhatsAppLogs.add(logKey);

  if (!accessToken || !phoneNumberId) {
    console.log(
      `[WHATSAPP DEV SIMULATED] To: ${phoneNumber}, Order: ${order.orderNumber}`
    );
    return { success: true, mode: "development" as const };
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: phoneNumber.replace(/[^\d]/g, ""),
          type: "text",
          text: { preview_url: false, body: getOrderConfirmationMessage(order) },
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`WhatsApp API ${response.status}: ${errorBody}`);
    }

    const result = (await response.json()) as { messages?: { id?: string }[] };
    console.log(`[WHATSAPP DELIVERED] To: ${phoneNumber}, Order: ${order.orderNumber}`);
    return {
      success: true,
      mode: "production" as const,
      messageId: result.messages?.[0]?.id,
    };
  } catch (error: any) {
    console.error("[WHATSAPP ERROR]:", error.message);
    return { success: false, error: error.message };
  }
}