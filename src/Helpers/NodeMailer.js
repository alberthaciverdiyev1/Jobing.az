import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_USER_PASSWD,
    },
});

export { transporter, sendEmail };

let lastEmailError = 0;
const EMAIL_COOLDOWN = 60000; // 1 minute between error emails

async function sendEmail(data, send_to = null, title = "Contact Us") {
    try {
        const info = await transporter.sendMail({
            from: `${title} <${process.env.MAIL_FROM}>`,
            to: send_to ?? process.env.MAIL_TO,
            subject: data?.title?.toString() || "",
            text: data?.text?.toString() || "",
            html: data?.html ?? null,
        });
        return { status: 200, message: "Mail Sent Successfully" };
    } catch (err) {
        // Rate-limit email error logging to prevent cascade loops
        const now = Date.now();
        if (now - lastEmailError > EMAIL_COOLDOWN) {
            lastEmailError = now;
            console.error('[Mailer Error]', err.message);
        }
        return { status: 500, message: "Mail sending failed" };
    }
}

export default sendEmail;
