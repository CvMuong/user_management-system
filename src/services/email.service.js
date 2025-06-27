const escapeHtml = require('../utils/escapeHtml');
const sendEmail = require('../config/email')

exports.sendVerificationEmail = ({ email, name, link }) => {
    const html = `
                <h2>Chào ${escapeHtml(name)}</h2>
                <p>Nhấn vào link dưới đây để xác minh email:</p>
                <a href="${link}">${link}</a>
            `;
    return sendEmail({ to: email, subject: 'Verify your email', html });   
};  

exports.sendPasswordResetCode = ({ email, name, link }) => {
    console.log(typeof name);
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #333;">Hello, ${escapeHtml(name)}</h2>
        <p>You requested to reset your password.</p>
        <p>Click the button below to reset it. This link will expire in 15 minutes.</p>
        <div style="text-align: center; margin: 20px 0;">
            <a href="${link}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">
            Reset Password
            </a>
        </div>
        <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
        <p><a href="${link}">${link}</a></p>
        <hr />
        <p style="font-size: 12px; color: #888;">If you did not request a password reset, please ignore this email.</p>
        </div>
    `;

    return sendEmail({
        to: email,
        subject: 'Reset your password',
        html
    });
};