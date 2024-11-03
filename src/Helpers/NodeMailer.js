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

async function sendEmail(data, send_to = null) {
console.log({data,send_to});

    const info = await transporter.sendMail({
        from: `Contact US <${data.title}>`,
        to: send_to ?? process.env.MAIL_TO,
        subject: data.title.toString(),
        text: data.text.toString(),        
        // html: "<b>Hello world?</b>", // HTML body
    });
console.log({info});

    return {
        status: 200,
        message: "Mail Sent Successfully",
    };
}

export default sendEmail;