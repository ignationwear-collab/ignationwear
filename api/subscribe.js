import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "❌ Please provide an email." });
  }

  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Vercel env
        pass: process.env.EMAIL_PASS  // App Password
      }
    });

    await transporter.sendMail({
      from: `"Ignation Wear 👕" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔥 Welcome to IGNATION Nation!",
      html: `
        <div style="background:#000; color:#fff; font-family:Arial, sans-serif; padding:20px; text-align:center; border-radius:10px;">
          <h1 style="color:#0ff; text-shadow:0 0 10px #0ff, 0 0 20px #0ff;">IGNATION WEAR 👕</h1>
          <h3 style="color:#ff00ff;">WELCOME IGNITER 🚀</h3>

          <p style="font-size:16px; line-height:1.6; color:#ccc;">
            You’ve officially stepped into <b>IGNATION</b> — not just a brand, but a 
            <span style="color:#ff00ff;">Nation</span> where rebels, icons, and legends unite.
          </p>

          <p style="margin:20px 0; font-size:15px; line-height:1.5;">
            From this moment, you’re part of something bigger:
          </p>
          <ul style="list-style:none; padding:0; font-size:14px; color:#0ff;">
            <li>🔥 Exclusive drops that won’t touch the mainstream</li>
            <li>⚡ Designs that carry persona, not just prints</li>
            <li>🎁 Offers and perks only the Nation will ever see</li>
          </ul>

          <p style="margin-top:20px; font-size:15px; color:#ccc;">
            But here’s the thing — greatness takes time.<br>
            The fire is brewing. The drops are loading.<br>
            And when it all lands, you’ll be the first to know. 
          </p>

          <h3 style="color:#0ff; margin-top:30px;">Stay lit. Stay ready.<br>Your vibe. Your Nation. <span style="color:#ff00ff;">IGNATION</span>.</h3>

          <hr style="border:0; height:1px; background:#444; margin:30px 0;">
          <p style="font-size:12px; color:#666;">© ${new Date().getFullYear()} Ignation Wear. All rights reserved.</p>
        </div>
      `
    });

    res.status(200).json({ message: `✅ Confirmation mail sent to ${email}` });
  } catch (err) {
    console.error("Mail error:", err);
    res.status(500).json({ message: "❌ Failed to send email. Try again later." });
  }
}
