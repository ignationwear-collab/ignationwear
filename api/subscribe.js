import { google } from "googleapis";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // === Google Sheets API — store email ===
    const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_KEY);
    const auth = new google.auth.JWT(
      serviceAccount.client_email,
      null,
      serviceAccount.private_key,
      ["https://www.googleapis.com/auth/spreadsheets"]
    );
    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: "Sheet1!A:A",
      valueInputOption: "RAW",
      requestBody: {
        values: [[email, new Date().toISOString()]]
      }
    });

    // === Nodemailer — send confirmation email ===
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Ignation Wear 👕" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔥 Welcome to IGNATION Nation!",
      html: `
        <div style="background:#000; color:#fff; font-family:Arial,sans-serif; padding:20px; text-align:center; border-radius:10px;">
          <h1 style="color:#0ff; text-shadow:0 0 10px #0ff;">IGNATION WEAR</h1>
          <h3 style="color:#ff00ff;">WELCOME IGNITER 🚀</h3>
          <p>Thanks for subscribing! You're now part of the IGNATION Nation.</p>
          <p>Stay tuned for exclusive drops, epic designs, and perks only for the Nation.</p>
          <h3 style="color:#0ff;">Your vibe. Your Nation. IGNATION.</h3>
          <hr style="margin-top:30px; border:1px solid #444;">
          <p style="font-size:12px; color:#666;">© ${new Date().getFullYear()} Ignation Wear</p>
        </div>
      `
    });

    return res.status(200).json({ message: `✅ ${email} saved & confirmation sent!` });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ message: "Something went wrong. Try again later." });
  }
}
