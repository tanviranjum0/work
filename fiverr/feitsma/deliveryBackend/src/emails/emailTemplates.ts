export const get2FATemplate = (code: string): string => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Feitsma Verhuizingen Verification Code</title>
  </head>
  <body style="margin:0; padding:0; font-family:Arial, sans-serif; background:#f4f6f8;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8; padding:20px;">
      <tr>
        <td align="center">
          
          <table width="100%" max-width="500px" style="background:#ffffff; border-radius:10px; padding:30px;">
            
            <tr>
              <td align="center">
                <h2 style="margin:0; color:#333;">Verify Your Account</h2>
              </td>
            </tr>

            <tr>
              <td style="padding:20px 0; text-align:center; color:#555;">
                Use the code below to complete your login. This code will expire in <b>1 minute</b>.
              </td>
            </tr>

            <tr>
              <td align="center">
                <div style="
                  font-size:32px;
                  letter-spacing:8px;
                  font-weight:bold;
                  color:#111;
                  background:#f1f3f5;
                  padding:15px 25px;
                  border-radius:8px;
                  display:inline-block;
                ">
                  ${code}
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding-top:25px; text-align:center; color:#888; font-size:14px;">
                If you didn’t request this, you can safely ignore this email.
              </td>
            </tr>

            <tr>
              <td style="padding-top:20px; text-align:center; font-size:12px; color:#aaa;">
                © ${new Date().getFullYear()} Feitsma Verhuizingen. All rights reserved.
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
