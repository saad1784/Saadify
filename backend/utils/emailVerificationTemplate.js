export const getEmailVerificationTemplate = (verificationCode) => {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Email Verification</title>
<style>
  body {
    margin:0;
    padding:0;
    background:#ffffff;
    color:#000;
    font-family: Arial, Helvetica, sans-serif;
    -webkit-text-size-adjust:100%;
    -ms-text-size-adjust:100%;
  }
  img {
    border:0;
    outline:none;
    text-decoration:none;
    display:block;
    margin:0 auto;
  }
  a {
    color:#0041DC;
    text-decoration:none;
  }
  @media only screen and (max-width:600px) {
    .container {
      width:100% !important;
      padding:16px !important;
    }
    .code {
      font-size:1.6rem !important;
      letter-spacing:6px !important;
    }
  }
</style>
</head>
<body>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
    <tr>
      <td align="center" style="padding:20px;">
        <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:600px; border:1px solid #e6e6e6; border-radius:10px; padding:30px; text-align:center;">
          
          <tr>
            <td style="padding-bottom:18px;" align="center">
              <!-- Centered image -->
              <img src="cid:cropImage" alt="SaadShop" width="180" style="width:180px; max-width:100%; height:auto;" />
            </td>
          </tr>

          <tr>
            <td style="padding:8px 0 4px 0; font-size:16px; color:#000;">
              Your email verification code is:
            </td>
          </tr>

          <tr>
            <td style="padding:8px 0 18px 0;">
              <!-- Verification code -->
              <div class="code" style="display:inline-block; padding:12px 18px; font-weight:700; font-size:24px; letter-spacing:8px; border-radius:6px; color:#000;">
                ${verificationCode}
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:8px 0 18px 0; font-size:14px; color:#000;">
              This verification code will only be used once. It expires in 30 minutes.
            </td>
          </tr>

          <tr>
            <td style="padding-top:18px; font-size:13px; color:#666;">
              &copy; ${new Date().getFullYear()} <a href="">Saadify.com</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};
