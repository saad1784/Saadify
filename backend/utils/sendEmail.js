import { Resend } from "resend";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
  try {
    // Optional image attachment (if used in your email templates)
    const attachments = [];
    if (html.includes("cid:cropImage")) {
      const imagePath = path.join("backend/assets/logo.jpg");
      if (fs.existsSync(imagePath)) {
        const imageBuffer = fs.readFileSync(imagePath);
        attachments.push({
          filename: "logo.jpg",
          content: imageBuffer,
          content_id: "cropImage", // must match <img src="cid:cropImage">
        });
      }
    }

    // Send email via Resend
    const info = await resend.emails.send({
      from: process.env.FROM_EMAIL || "Saadify",
      to,
      subject,
      html,
      attachments,
    });

    console.log("✅ Email sent via Resend:", info?.id || info);
    return info;
  } catch (err) {
    console.error("❌ sendEmail error (Resend):", err);
    throw err;
  }
};
