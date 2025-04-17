const nodemailer = require("nodemailer");
require('dotenv').config({ path: '../dotenv/.env' });

const sendEmail = async (to, subject, text) => {
    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,  
                pass: process.env.EMAIL_PASS,  
            },
        });

        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            text: text,
        };

        let info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${to} - Message ID: ${info.messageId}`);
    } catch (error) {
        console.error("❌ Error sending email:", error);
        
        if (error.response) {
            console.error("📩 SMTP Response:", error.response);
        }

        if (error.code) {
            console.error("⚠️ Error Code:", error.code);
        }
    }
};

module.exports = sendEmail;


