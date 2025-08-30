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
      subject: "IGNATION has chosen you. Stay ready.",
      html: `
        <h2 style="color:#ff00ff;">Ignation Wear 👕</h2>
        <p>"WELCOME IGNITER.

You’ve officially stepped into IGNATION — not just a brand, but a Nation where rebels, icons, and legends unite.

From this moment, you’re part of something bigger:
	•	Exclusive drops that won’t touch the mainstream.
	•	Designs that carry persona, not just prints.
	•	Offers and perks only the Nation will ever see.

But here’s the thing — greatness takes time.
The fire is brewing. The drops are loading.
And when it all lands, you’ll be the first to know.

Stay lit. Stay ready.
Your vibe. Your Nation. IGNATION." </p>
      `
    });

    res.status(200).json({ message: `✅ Confirmation mail sent to ${email}` });
  } catch (err) {
    console.error("Mail error:", err);
    res.status(500).json({ message: "❌ Failed to send email. Try again later." });
  }
}
