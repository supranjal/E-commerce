export interface OrderShippedTemplateData {
  customerName: string;
  orderNumber: string;
  shippingStatus: string;
  shippingAddress: string;
  city: string;
  country: string;
  trackingNumber?: string | null;
}

export function generateOrderShippedEmail(data: OrderShippedTemplateData) {
  const trackingDisplay = data.trackingNumber
    ? `<span style="font-family: monospace; font-weight: bold; color: #1e40af;">${data.trackingNumber}</span>`
    : `<span style="color: #6b7280; font-style: italic;">Assigned upon regional transit hub entry</span>`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Order Shipped — RudraKart</title>
</head>
<body style="margin: 0; padding: 0; background-color: #faf6f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2d1810;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #faf6f0; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #ecd8bd; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #261710; padding: 28px 24px; text-align: center; border-bottom: 3px solid #c28830;">
              <h1 style="margin: 0; color: #fdfaf4; font-size: 24px; font-weight: 700; letter-spacing: 1px;">
                RUDRAKART
              </h1>
              <p style="margin: 6px 0 0 0; color: #e5b367; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">
                Dispatch & Logistics Notification
              </p>
            </td>
          </tr>

          <!-- Status Badge -->
          <tr>
            <td style="padding: 28px 28px 12px 28px; text-align: center;">
              <div style="display: inline-block; background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 20px; padding: 6px 16px; margin-bottom: 12px;">
                <span style="color: #1e40af; font-size: 12px; font-weight: bold; letter-spacing: 0.5px;">
                  ✈ ORDER ON THE WAY
                </span>
              </div>
              <h2 style="margin: 0 0 8px 0; color: #2d1810; font-size: 22px;">
                Your RudraKart order is on the way.
              </h2>
              <p style="margin: 0; color: #6b584e; font-size: 14px; line-height: 1.5;">
                Hello ${data.customerName}, your consecrated parcel has cleared Kathmandu dispatch and is en route to your shipping destination.
              </p>
            </td>
          </tr>

          <!-- Dispatch Meta Card -->
          <tr>
            <td style="padding: 16px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fdfbf7; border: 1px solid #f1e5d1; border-radius: 8px; padding: 18px;">
                <tr>
                  <td style="font-size: 13px; line-height: 1.8; color: #6b584e;">
                    <strong style="color: #2d1810;">Order Number:</strong> <span style="font-family: monospace; font-weight: bold; color: #9c4221;">${data.orderNumber}</span><br>
                    <strong style="color: #2d1810;">Shipping Status:</strong> <span style="color: #1e40af; font-weight: bold;">${data.shippingStatus}</span><br>
                    <strong style="color: #2d1810;">Tracking Number:</strong> ${trackingDisplay}<br>
                    <strong style="color: #2d1810;">Dispatch Courier:</strong> Himalayan Express Insured Courier
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Delivery Address Box -->
          <tr>
            <td style="padding: 0 28px 24px 28px;">
              <div style="background-color: #fdfbf7; border: 1px solid #f1e5d1; border-radius: 8px; padding: 14px; font-size: 12px; color: #6b584e; line-height: 1.5;">
                <strong style="color: #2d1810; font-size: 13px; display: block; margin-bottom: 4px;">Destination Shipping Address:</strong>
                ${data.customerName}<br>
                ${data.shippingAddress}<br>
                ${data.city}, ${data.country}
              </div>
            </td>
          </tr>

          <!-- Tamper-evident packaging assurance -->
          <tr>
            <td style="padding: 0 28px 28px 28px;">
              <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px; font-size: 12px; color: #166534; line-height: 1.5;">
                <strong>Security Guarantee:</strong> Your package has been sealed with a tamper-evident holographic warranty sticker. Please inspect the seal upon delivery before accepting.
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f7eee1; padding: 18px 28px; text-align: center; border-top: 1px solid #ecd8bd; font-size: 11px; color: #78645a; line-height: 1.5;">
              © ${new Date().getFullYear()} RudraKart Himalayan Organics. Kathmandu, Nepal.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const text = `
Your RudraKart order is on the way.

Hello ${data.customerName},

Order Number: ${data.orderNumber}
Shipping Status: ${data.shippingStatus}
Tracking Number: ${data.trackingNumber || "Assigned upon regional hub entry"}

Destination Shipping Address:
${data.customerName}
${data.shippingAddress}
${data.city}, ${data.country}

Your package is protected with tamper-evident holographic seal.

RudraKart Himalayan Organics
Kathmandu, Nepal
  `.trim();

  return {
    subject: `Your RudraKart order is on the way: ${data.orderNumber}`,
    html,
    text,
  };
}
