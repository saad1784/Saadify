// utils/sendEmail.js
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
  try {
    // optional: replace any inline cid image references
    const processedHtml = html.replace(
      /cid:cropImage/g,
      "https://saadify.vercel.app/logo.jpg"
    );

    const info = await resend.emails.send({
      from: process.env.FROM_EMAIL || "Saadify <sh3738905@gmail.com>",
      to,
      subject,
      html: processedHtml,
      reply_to: "sh3738905@gmail.com",
    });

    console.log("✅ Email sent successfully to:", to);
    return info;
  } catch (error) {
    console.error("❌ sendEmail error (Resend):", error);
    throw error;
  }
};
