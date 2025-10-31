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
      "https://saadify.vercel.app/logo.jpg"
    );

    const info = await resend.emails.send({
      from: process.env.FROM_EMAIL || "Saadify <onboarding@resend.dev>",
      to,
      subject,
      html: processedHtml,
      reply_to: "sh3738905@gmail.com",
    });

    console.log("✅ Email sent to user:", to, "→ ID:", info?.id || info);
    return info;
  } catch (err) {
    console.error("❌ sendEmail error (Resend):", err);
    throw err;
  }
};
