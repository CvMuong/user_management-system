const User = require('../models/user.model');
const Token = require('../models/token.model');
const VerificationCode = require('../models/verification_codes.model');
const { createError } = require('../utils/error');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const sendEmail = require('../config/email');
const generateToken = require('../utils/generateToken');

const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        config.jwt_secret,
        { expiresIn: '15m' }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id },
        config.jwt_refresh_secret,
        { expiresIn: '7d' }
    );
};

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return next(createError('Email already exists', 409));
        const avatar = req.file?.path || undefined;
        const user = await User.create({ name, email, password, role, avatar });
        const code = generateToken();
        const verifyLink = `http://localhost:${config.port}/api/verify-email?email=${email}&token=${code}`;
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
        await VerificationCode.create({
            userId: user._id,
            code,
            purpose: 'email_verify',
            expiresAt,
        });
        const html = `
                <h2>Chào ${name}</h2>
                <p>Nhấn vào link dưới đây để xác minh email:</p>
                <a href="${verifyLink}">${verifyLink}</a>
            `;
        await sendEmail({
            to: email,
            subject: 'Verify your email',
            html
        });

        return res.status(201).json({
            success: true,
            message: 'Registered successfully. Please check your email to verify account'
        });
    } catch (error) {
        next(error);
    }
};

exports.verifyEmail = async (req, res, next) => {
    try {
        const { email, token } = req.query;
        const user = await User.findOne({ email });
        if (!user) return next(createError('Email does not exist', 404));
        const record = await VerificationCode.findOne({
            userId: user._id,
            code: token,
            purpose: 'email_verify',
            expiresAt: { $gt: new Date() }
        });
        if (!record) return next(createError('Invalid token or token expired', 400));
        user.isVerified = true;
        await user.save();
        await VerificationCode.deleteMany({ userId: user._id, purpose: 'email_verify' });
        return res.status(200).json({
            success: true,
            message: 'Email verified successfully'
        });
    } catch (error) {
        next(error);
    }
}