import { Resend } from "resend";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
  try {
    // Optional image attachment
    const attachments = [];
    if (html.includes("cid:cropImage")) {
      const imagePath = path.join("backend/assets/logo.jpg");
      if (fs.existsSync(imagePath)) {
        const imageBuffer = fs.readFileSync(imagePath);
        attachments.push({
          filename: "logo.jpg",
          content: imageBuffer,
          content_id: "cropImage",
        });
      }
    }

    // ✅ Use verified Resend sender (free tier ready)
    const info = await resend.emails.send({
      from: process.env.FROM_EMAIL || "Saadify <onboarding@resend.dev>", // ✅ Verified sender
      to, // user email
      subject,
      html,
      attachments,
      reply_to: "kanwalsamra8@gmail.com", // ✅ so user replies go to you
    });

    console.log("✅ Email sent to user:", to, "→ ID:", info?.id || info);
    return info;
  } catch (err) {
    console.error("❌ sendEmail error (Resend):", err);
    throw err;
  }
};
