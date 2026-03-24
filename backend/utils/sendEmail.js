const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1. Create a transporter using our SMTP settings (e.g., Gmail)
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    // 2. Define the email options (who is it from, who is it to, and the HTML design)
    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    // 3. Command Nodemailer to actually shoot the email
    const info = await transporter.sendMail(message);
    console.log('Email sent: %s', info.messageId);
};

module.exports = sendEmail;