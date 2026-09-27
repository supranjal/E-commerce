export interface OrderDeliveredTemplateData {
  customerName: string;
  orderNumber: string;
  deliveryStatus: string;
  itemsSummary: string;
}

export function generateOrderDeliveredEmail(data: OrderDeliveredTemplateData) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Order Delivered — RudraKart</title>
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
                Delivery Fulfillment Confirmation
              </p>
            </td>
          </tr>

          <!-- Status Badge -->
          <tr>
            <td style="padding: 28px 28px 12px 28px; text-align: center;">
              <div style="display: inline-block; background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 20px; padding: 6px 16px; margin-bottom: 12px;">
                <span style="color: #065f46; font-size: 12px; font-weight: bold; letter-spacing: 0.5px;">
                  ✓ DELIVERED
                </span>
              </div>
              <h2 style="margin: 0 0 8px 0; color: #2d1810; font-size: 22px;">
                Your RudraKart order has been delivered.
              </h2>
              <p style="margin: 0; color: #6b584e; font-size: 14px; line-height: 1.5;">
                Hello ${data.customerName}, your consecrated Himalayan shipment has arrived. May the spiritual energies of your authentic Rudraksha bring clarity, harmony, and prosperity.
              </p>
            </td>
          </tr>

          <!-- Delivery Meta Card -->
          <tr>
            <td style="padding: 16px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fdfbf7; border: 1px solid #f1e5d1; border-radius: 8px; padding: 18px;">
                <tr>
                  <td style="font-size: 13px; line-height: 1.8; color: #6b584e;">
                    <strong style="color: #2d1810;">Order Number:</strong> <span style="font-family: monospace; font-weight: bold; color: #9c4221;">${data.orderNumber}</span><br>
                    <strong style="color: #2d1810;">Delivery Status:</strong> <span style="color: #065f46; font-weight: bold;">DELIVERED</span><br>
                    <strong style="color: #2d1810;">Delivered Specimens:</strong> ${data.itemsSummary}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Certificate Verification Note -->
          <tr>
            <td style="padding: 0 28px 28px 28px;">
              <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; font-size: 12px; color: #92400e; line-height: 1.6;">
                <strong>Verify Your Certificate Card:</strong> Your package contains an authenticity certificate card with an individualized serial number. You can verify its digital record in our laboratory registry anytime at <a href="https://rudrakart.vercel.app/certificate-verification" style="color: #9c4221; font-weight: bold; text-decoration: underline;">rudrakart.vercel.app/certificate-verification</a>.
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
Your RudraKart order has been delivered.

Hello ${data.customerName},

Order Number: ${data.orderNumber}
Delivery Status: ${data.deliveryStatus}
Delivered Specimens: ${data.itemsSummary}

Verify Your Certificate Card:
Your package contains an authenticity certificate card with an individualized serial number. You can verify its digital record in our laboratory registry at rudrakart.vercel.app/certificate-verification.

RudraKart Himalayan Organics
Kathmandu, Nepal
  `.trim();

  return {
    subject: `Your RudraKart order has been delivered: ${data.orderNumber}`,
    html,
    text,
  };
}
