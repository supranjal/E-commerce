export interface OrderProcessingTemplateData {
  customerName: string;
  orderNumber: string;
  orderStatus: string;
  expectedNextStep?: string;
}

export function generateOrderProcessingEmail(data: OrderProcessingTemplateData) {
  const nextStep =
    data.expectedNextStep ||
    "Optical & digital X-ray inspection in the Kathmandu authenticity laboratory, followed by traditional sacred energization.";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Order Processing — RudraKart</title>
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
                Order Status Update
              </p>
            </td>
          </tr>

          <!-- Status Badge -->
          <tr>
            <td style="padding: 28px 28px 12px 28px; text-align: center;">
              <div style="display: inline-block; background-color: #f3e8ff; border: 1px solid #d8b4fe; border-radius: 20px; padding: 6px 16px; margin-bottom: 12px;">
                <span style="color: #6b21a8; font-size: 12px; font-weight: bold; letter-spacing: 0.5px;">
                  ⚙ ORDER PROCESSING
                </span>
              </div>
              <h2 style="margin: 0 0 8px 0; color: #2d1810; font-size: 22px;">
                Your RudraKart order is being processed.
              </h2>
              <p style="margin: 0; color: #6b584e; font-size: 14px; line-height: 1.5;">
                Hello ${data.customerName}, our laboratory artisans and curators are actively preparing your sacred parcel.
              </p>
            </td>
          </tr>

          <!-- Details Card -->
          <tr>
            <td style="padding: 16px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fdfbf7; border: 1px solid #f1e5d1; border-radius: 8px; padding: 18px;">
                <tr>
                  <td style="font-size: 13px; line-height: 1.8; color: #6b584e;">
                    <strong style="color: #2d1810;">Order Reference:</strong> <span style="font-family: monospace; font-weight: bold; color: #9c4221;">${data.orderNumber}</span><br>
                    <strong style="color: #2d1810;">Current Status:</strong> <span style="color: #6b21a8; font-weight: bold;">PROCESSING</span><br>
                    <strong style="color: #2d1810;">Expected Next Step:</strong> ${nextStep}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Next Steps Note -->
          <tr>
            <td style="padding: 0 28px 28px 28px;">
              <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 14px; font-size: 12px; color: #92400e; line-height: 1.5;">
                <strong>What happens next?</strong> As soon as laboratory inspection and consecrated sealing are complete, your tracking identifier will be generated and dispatched via courier.
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
Your RudraKart order is being processed.

Hello ${data.customerName},

Order Number: ${data.orderNumber}
Current Status: ${data.orderStatus}
Expected Next Step: ${nextStep}

Our laboratory curators are preparing your sacred parcel. You will receive tracking details once dispatched.

RudraKart Himalayan Organics
Kathmandu, Nepal
  `.trim();

  return {
    subject: `Your RudraKart order is being processed: ${data.orderNumber}`,
    html,
    text,
  };
}
