const express = require("express");
const nodemailer = require("nodemailer");
const multer = require("multer");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

const app = express();
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const upload = multer({ dest: "uploads/" });

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.post("/send-inquiry", upload.single("attachment"), async (req, res) => {
    try {
        const { name, company, email, phone, subject, message, recaptchaToken } = req.body;
        let attachment = req.file ? fs.readFileSync(req.file.path) : null;

        // 1️⃣ Verifikasi reCAPTCHA
        const recaptchaResponse = await axios.post(
            "https://www.google.com/recaptcha/api/siteverify",
            null,
            {
                params: {
                    secret: process.env.RECAPTCHA_SECRET,
                    response: recaptchaToken
                }
            }
        );

        if (!recaptchaResponse.data.success) {
            return res.status(400).json({ error: "reCAPTCHA verification failed" });
        }

        // 2️⃣ Kirim Email jika reCAPTCHA lolos
        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: "yaskawamakmurabadi@gmail.com",
            subject: `Inquiry: Leads From Web`,
            text: `Nama: ${name}\nPerusahaan: ${company}\nEmail: ${email}\nNo. HP: ${phone}\n\nPesan:\n${message}`,
            attachments: attachment
                ? [{ filename: req.file.originalname, content: attachment }]
                : []
        };

        await transporter.sendMail(mailOptions);

        if (req.file) fs.unlinkSync(req.file.path);

        res.json({ message: "Email berhasil dikirim!" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Gagal mengirim email." });
    }
});

app.listen(port, () => {
    console.log(`🔥 Server berjalan di http://localhost:${port}`);
});