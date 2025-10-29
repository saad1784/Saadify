export const getResetPasswordTemplate = (userfirst, userlast, resetUrl) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <style>
    /* Prevent dark mode color inversion in most clients */
    :root {
      color-scheme: only light;
      supported-color-schemes: light;
    }

    html, body {
      margin: 0;
      padding: 0;
      height: 100%;
      background-color: #ffffff !important;
      color: #000000 !important;
      font-family: Arial, sans-serif;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }

    .active {
      width: 80%;
      background-color: #ffffff !important;
      color: #000000 !important;
      margin: 5vh auto;
      display: flex;
      border: 1px solid #e6e6e6;
      border-radius: 10px;
      overflow: hidden;
      text-align: left;
    }

    @media (max-width: 768px) {
      .active {
        width: 95%;
        margin: 2vh auto;
      }
    }

    #text {
      padding: 30px;
      width: 100%;
      background-color: #ffffff !important;
      color: #000000 !important;
    }

    h2, p, a, b {
      color: #000000 !important;
    }

    #btn {
      display: block;
      margin: 20px auto;
      padding: 12px 24px;
      background-color: #0041DC;
      border: none;
      border-radius: 25px;
      cursor: pointer;
    }

    #btn a {
      color: #ffffff !important;
      text-decoration: none;
      font-weight: bold;
      font-size: 16px;
    }

    a.link {
      color: #0041DC !important;
      text-decoration: underline;
      word-break: break-all;
    }

    hr {
      border: none;
      border-top: 1px solid #ddd;
      margin: 20px 0;
    }
  </style>
</head>

<body>
  <div class="active">
    <div id="text">
      <h2>Hi ${userfirst} ${userlast},</h2>

      <p>
        You recently requested to reset the password for your Saadify account.
        Use the button below to reset it.
        <b>This password reset is only valid for the next 30 minutes.</b>
      </p>

      <button id="btn">
        <a href="${resetUrl}">RESET YOUR PASSWORD</a>
      </button>

      <p>If you did not request a password reset, please ignore this email.</p>

      <p>Thanks,<br>The Saadify Team</p>

      <hr>

      <p>
        If you're having trouble clicking the button above,
        copy and paste this URL into your web browser:
      </p>

      <a href="${resetUrl}" class="link">${resetUrl}</a>
      <br><br>
    </div>
  </div>
</body>
</html>
`;
