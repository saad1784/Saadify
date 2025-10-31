import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
  try {
    // ✅ Replace cid references with hosted image URL
    const processedHtml = html.replace(
      /cid:cropImage/g,
      "https://saadify-production.up.railway.app/api/assets/logo.png"
    );

    const info = await resend.emails.send({
      from: process.env.FROM_EMAIL || "Saadify <onboarding@resend.dev>",
      to, // user's email
      subject,
      html: processedHtml, // ✅ updated HTML with hosted image
      reply_to: "kanwalsamra8@gmail.com", // for replies
    });

    console.log("✅ Email sent to user:", to, "→ ID:", info?.id || info);
    return info;
  } catch (err) {
    console.error("❌ sendEmail error (Resend):", err);
    throw err;
  }
};
