import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // use TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Attach image ONLY if the email template contains "cid:cropImage"
    const attachments = [];
    if (html.includes("cid:cropImage")) {
      attachments.push({
        filename: "logo.jpg",
        path: path.join("backend/assets/logo.jpg"), // adjust if your folder differs
        cid: "cropImage", // must match <img src="cid:cropImage">
      });
    }

    const info = await transporter.sendMail({
      from: `"Saadify" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments,
    });

    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ sendEmail error:", err);
    throw err;
  }
};
