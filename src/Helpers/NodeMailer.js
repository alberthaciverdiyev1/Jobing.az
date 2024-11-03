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

async function sendEmail(data) {

    const info = await transporter.sendMail({
        from: `Contact US <${data.title}>`,
        to: process.env.MAIL_TO,
        subject: data.title,
        text: data.text,
        // html: "<b>Hello world?</b>", // HTML body
    });

    return {
        status: 200,
        message: "Mail Sent Successfully",
    };
}

export default sendEmail;