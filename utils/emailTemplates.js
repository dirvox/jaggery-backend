// utils/emailTemplates.js
export const buildHtmlTemplate = ({
  websiteUrl = "https://khatauligud.com/",
  message = "",
  senderName = "Khatauli Gud",
}) => {
  const domainName = websiteUrl.replace(/^https?:\/\//, "");
  return `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
  </head>
  <body style="margin:0;padding:0;background:#f9f9f9;font-family:'Segoe UI',Arial,Helvetica,sans-serif;color:#333;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="padding:24px;">
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e5e5e5;">
            
            <!-- Header -->
            <tr>
              <td style="background:#fff3e8;padding:20px 28px;text-align:center;">
                <h1 style="margin:0;font-size:22px;color:#C19A6B;">Khatauli Gud</h1>
                <p style="margin:6px 0 0;font-size:13px;color:#8c7456;">Pure & Traditional Jaggery from India</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:24px 28px;">
                <p style="font-size:15px;margin:0 0 12px;">Hello,</p>

                <div style="font-size:14px;line-height:1.6;color:#444;margin:0 0 18px;">
                  ${message}
                </div>

                <p style="font-size:14px;margin:0 0 18px;">
                  Khatauli Gud is made using traditional methods that preserve its natural sweetness, minerals, and earthy flavor. Perfect for cooking, desserts, or daily health use.
                </p>

                <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:12px;">
                  <tr>
                    <td>
                      <a href="${websiteUrl}" 
                        style="display:inline-block;padding:10px 18px;border-radius:6px;background:#C19A6B;color:#fff;text-decoration:none;font-weight:600;">
                        Visit Website
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="font-size:13px;color:#666;margin:18px 0 0;">
                  If you have any questions, simply reply to this email — we’re happy to help.
                </p>
                <p style="font-size:12px;color:#999;margin:8px 0 0;">
                  Best regards,<br/>${senderName}
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#fafafa;padding:14px 28px;text-align:center;font-size:12px;color:#888;">
                <div style="margin-bottom:6px;">
                  <a href="${websiteUrl}" style="color:#C19A6B;text-decoration:none;font-weight:600;">${domainName}</a> &nbsp;|&nbsp; Call: +91-XXXXXXXXXX
                </div>
                <div style="color:#999;margin-top:6px;">You received this email because you interacted with our website.</div>
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
