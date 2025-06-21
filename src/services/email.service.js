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