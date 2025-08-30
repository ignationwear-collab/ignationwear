const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Serve static frontend files
app.use(express.static(path.join(__dirname, "public")));

// 📩 Subscribe route
app.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ message: "❌ Please enter a valid email address." });
  }

  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "Ignationwear@gmail.com ",  // replace
        pass: "xvzf klaf izob piws"    // replace
      }
    });

    await transporter.sendMail({
      from: '"Ignation Wear 👕" <yourmail@gmail.com>',
      to: email,
      subject: "Thanks for subscribing to Ignation Wear!",
      html: `<h2 style="color:#ff00ff;">Ignation Wear 👕</h2>
             <p>🔥 Thanks for subscribing! We’ll notify you when we launch.</p>`
    });

    res.json({ message: "✅ Confirmation mail sent to " + email });

  } catch (error) {
    console.error("Mail error:", error);
    res.json({ message: "❌ Failed to send email. Try again later." });
  }
});

// 🚀 Start backend
app.listen(5000, () => console.log("Server running at http://localhost:5000"));
