const nodemailer = require('nodemailer');
const config = require('../config/env');

const sendEmail = async ({ to, subject, html }) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.email_sender,
            pass: config.app_password
        }
    });

    const mailOptions = {
        from: `"USER MANAGEMENT SYSTEM" <${config.email_sender}>`,
        to,
        subject,
        html
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;