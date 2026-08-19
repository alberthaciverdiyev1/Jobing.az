import nodemailer from "nodemailer";
import dotenv from 'dotenv';

dotenv.config();

let transporter = null;

function getTransporter() {
    if (transporter) return transporter;
    try {
        transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST, port: process.env.MAIL_PORT, secure: true, auth: {
                user: process.env.MAIL_USER, pass: process.env.MAIL_USER_PASSWD,
            },
        });
        transporter.on('error', () => {
        });
    } catch (e) {
        console.error('[Mailer] Transport creation failed:', e.message);
        transporter = null;
    }
    return transporter;
}

export {transporter, sendEmail};

let lastEmailError = 0;
const EMAIL_COOLDOWN = 60000;

async function sendEmail(data, send_to = null, title = "Contact Us") {
    const t = getTransporter();
    if (!t) return {status: 500, message: "Mailer not configured"};
    try {
        await t.sendMail({
            from: `${title} <${process.env.MAIL_FROM}>`,
            to: send_to ?? process.env.MAIL_TO,
            subject: data?.title?.toString() || "",
            text: data?.text?.toString() || "",
            html: data?.html ?? null,
        });
        return {status: 200, message: "Mail Sent Successfully"};
    } catch (err) {
        const now = Date.now();
        if (now - lastEmailError > EMAIL_COOLDOWN) {
            lastEmailError = now;
            console.error('[Mailer Error]', err.message);
        }
        return {status: 500, message: "Mail sending failed"};
    }
}

export default sendEmail;
