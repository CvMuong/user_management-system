const mongoose = require('mongoose');

const verificationCodeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    code: {
        type: String,
        required: true,
        trim: true
    },
    purpose: {
        type: String,
        enum: ['email_verify', 'forgot_password', 'change_email'],
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
});

verificationCodeSchema.index({ expiresAt: 1}, { expireAfterSeconds: 0 });

module.exports = mongoose.model('VerificationCode', verificationCodeSchema); 
