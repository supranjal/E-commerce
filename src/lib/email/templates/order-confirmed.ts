export interface OrderConfirmedTemplateData {
  customerName: string;
  orderNumber: string;
  orderDate: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  currency: string;
  paymentMethod: string;
  shippingAddress: string;
  city: string;
  country: string;
  orderStatus: string;
}

export function generateOrderConfirmedEmail(data: OrderConfirmedTemplateData) {
  const itemsHtml = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px 12px; border-bottom: 1px solid #f1e5d1; font-size: 13px; color: #2d1810;">
          <strong>${item.name}</strong>
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #f1e5d1; text-align: center; font-size: 13px; color: #6b584e;">
          ${item.quantity}
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #f1e5d1; text-align: right; font-size: 13px; font-weight: bold; color: #9c4221;">
          ${data.currency} ${(item.price * item.quantity).toLocaleString()}
        </td>
      </tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Order Confirmed — RudraKart</title>
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
                Certified Himalayan Rudraksha Quality Lab
              </p>
            </td>
          </tr>

          <!-- Confirmation Badge -->
          <tr>
            <td style="padding: 24px 28px 10px 28px; text-align: center;">
              <div style="display: inline-block; background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 20px; padding: 6px 16px; margin-bottom: 12px;">
                <span style="color: #065f46; font-size: 12px; font-weight: bold; letter-spacing: 0.5px;">
                  ✓ ORDER CONFIRMED
                </span>
              </div>
              <h2 style="margin: 0 0 8px 0; color: #2d1810; font-size: 20px;">
                Thank you for your order, ${data.customerName}!
              </h2>
              <p style="margin: 0; color: #6b584e; font-size: 13px; line-height: 1.5;">
                Your sacred acquisition has been verified and registered in the Kathmandu laboratory queue for consecration and secure dispatch.
              </p>
            </td>
          </tr>

          <!-- Order Summary Meta Card -->
          <tr>
            <td style="padding: 16px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fdfbf7; border: 1px solid #f1e5d1; border-radius: 8px; padding: 16px;">
                <tr>
                  <td width="50%" style="font-size: 12px; line-height: 1.6; color: #6b584e; vertical-align: top;">
                    <strong style="color: #2d1810;">Order Number:</strong> <span style="font-family: monospace; font-weight: bold; color: #9c4221;">${data.orderNumber}</span><br>
                    <strong style="color: #2d1810;">Order Date:</strong> ${data.orderDate}<br>
                    <strong style="color: #2d1810;">Order Status:</strong> <span style="color: #065f46; font-weight: bold;">${data.orderStatus}</span>
                  </td>
                  <td width="50%" style="font-size: 12px; line-height: 1.6; color: #6b584e; vertical-align: top;">
                    <strong style="color: #2d1810;">Payment Method:</strong> ${data.paymentMethod}<br>
                    <strong style="color: #2d1810;">Payment Status:</strong> <span style="color: #065f46; font-weight: bold;">PAID & VERIFIED</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Product Details -->
          <tr>
            <td style="padding: 10px 28px 20px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #f7eee1; border-bottom: 2px solid #e2cfb7;">
                    <th align="left" style="padding: 10px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b584e;">Product Specimen</th>
                    <th align="center" style="padding: 10px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b584e;">Qty</th>
                    <th align="right" style="padding: 10px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b584e;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="2" align="right" style="padding: 14px 12px; font-size: 13px; font-weight: bold; color: #2d1810;">
                      Total Payable:
                    </td>
                    <td align="right" style="padding: 14px 12px; font-size: 18px; font-weight: bold; color: #9c4221;">
                      ${data.currency} ${data.totalAmount.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </td>
          </tr>

          <!-- Shipping Address -->
          <tr>
            <td style="padding: 0 28px 24px 28px;">
              <div style="background-color: #fdfbf7; border: 1px solid #f1e5d1; border-radius: 8px; padding: 14px; font-size: 12px; color: #6b584e; line-height: 1.5;">
                <strong style="color: #2d1810; font-size: 13px; display: block; margin-bottom: 4px;">Shipping Address:</strong>
                ${data.customerName}<br>
                ${data.shippingAddress}<br>
                ${data.city}, ${data.country}
              </div>
            </td>
          </tr>

          <!-- Authenticity Guarantee Footer -->
          <tr>
            <td style="background-color: #f7eee1; padding: 18px 28px; text-align: center; border-top: 1px solid #ecd8bd; font-size: 11px; color: #78645a; line-height: 1.5;">
              <strong style="color: #4a382e;">100% Certified Himalayan Authenticity</strong><br>
              Each sacred specimen includes optical and X-ray authenticity verification and a serial-tracked certificate.<br>
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
Order Confirmed — RudraKart

Thank you for your order, ${data.customerName}!

Order Number: ${data.orderNumber}
Order Date: ${data.orderDate}
Order Status: ${data.orderStatus}
Payment Method: ${data.paymentMethod}
Total Amount: ${data.currency} ${data.totalAmount.toLocaleString()}

Shipping Address:
${data.customerName}
${data.shippingAddress}
${data.city}, ${data.country}

Items:
${data.items.map((i) => `- ${i.name} (x${i.quantity}): ${data.currency} ${(i.price * i.quantity).toLocaleString()}`).join("\n")}

RudraKart Himalayan Organics
Kathmandu, Nepal
  `.trim();

  return {
    subject: `Order Confirmed: ${data.orderNumber} — RudraKart`,
    html,
    text,
  };
}
