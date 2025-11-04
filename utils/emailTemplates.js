// utils/emailTemplates.js
export const buildHtmlTemplate = ({ websiteUrl = "#", message = "", senderName = "Khatauli Gud" }) => {
  // Keep CSS inline for best compatibility with email clients.
  // Replace images and links with your real assets.
  return `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
  </head>
  <body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background:#f5f5f7">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="padding:24px 0;">
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,0.06)">
            <tr>
              <td style="padding:20px 28px;text-align:center;background:linear-gradient(90deg,#4C9A2A,#6CC24A);color:#fff;">
                <h1 style="margin:0;font-size:22px;">Order Khatauli Gud — Pure, Traditional Jaggery</h1>
                <p style="margin:6px 0 0;font-size:14px;opacity:0.95;">From <a href="${websiteUrl}" style="color:#fff;text-decoration:underline">${websiteUrl.replace(/^https?:\/\//,'')}</a></p>
              </td>
            </tr>

            <tr>
              <td style="padding:22px 28px 12px 28px;color:#333;">
                <p style="font-size:15px;line-height:1.5;margin:0 0 12px;">Hello,</p>

                <div style="font-size:14px;color:#444;line-height:1.6;border-left:4px solid #f0c36d;padding:12px 16px;background:#fff7e6;border-radius:4px;margin-bottom:14px;">
                  ${message}
                </div>

                <p style="margin:0 0 14px;font-size:14px;color:#333">
                  <strong>Why Khatauli Gud?</strong><br/>
                  Traditionally made, high mineral content, and a flavor loved across India. Perfect for cooking, sweets, and healthy daily use.
                </p>

                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 18px;">
                  <tr>
                    <td>
                      <a href="${websiteUrl}" style="display:inline-block;padding:12px 20px;border-radius:6px;background:#4C9A2A;color:#fff;text-decoration:none;font-weight:600;">Order Now</a>
                    </td>
                    <td style="width:10px;"></td>
                    <td>
                      <a href="${websiteUrl}#products" style="display:inline-block;padding:12px 20px;border-radius:6px;background:#eee;color:#333;text-decoration:none;font-weight:600;">View Products</a>
                    </td>
                  </tr>
                </table>

                <p style="font-size:13px;color:#666;margin:0 0 6px;">
                  If you have any questions reply to this email and we’ll get back to you soon.
                </p>
                <p style="font-size:12px;color:#999;margin:8px 0 0;">
                  Regards,<br/>${senderName}
                </p>
              </td>
            </tr>

            <tr>
              <td style="background:#fafafa;padding:14px 28px;font-size:12px;color:#777;text-align:center;">
                <div style="margin-bottom:8px;">
                  <a href="${websiteUrl}" style="color:#4C9A2A;text-decoration:none;font-weight:600;">${websiteUrl.replace(/^https?:\/\//,'')}</a> &nbsp;|&nbsp; Call: +91-XXXXXXXXXX
                </div>
                <div style="color:#999;margin-top:6px;">You received this email because you subscribed at our website.</div>
                <div style="margin-top:8px;">
                  <a href="${websiteUrl}/unsubscribe" style="color:#999;text-decoration:underline;">Unsubscribe</a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};
