// sendEmail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const processedHtml = (html || "").replace(
      /cid:cropImage/g,
      "https://saadify.vercel.app/logo.jpg"
    );

    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL || `"Saadify" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: processedHtml,
      replyTo: process.env.EMAIL_USER,
    });

    console.log("✅ Email sent:", to, "messageId:", info.messageId || info);
    return info;
  } catch (err) {
    console.error("❌ sendEmail error (Gmail SMTP):", err);
    throw err;
  }
};
