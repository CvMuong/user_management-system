const User = require("../models/user.model");
const Token = require("../models/token.model");
const VerificationCode = require("../models/verification_codes.model");
const { createError } = require("../utils/error");
const jwt = require("jsonwebtoken");
const config = require("../config/env");
const generateToken = require("../utils/generateToken");
const {
  sendVerificationEmail,
  sendPasswordResetCode,
} = require("../services/email.service");

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, config.jwt_secret, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    config.jwt_refresh_secret,
    { expiresIn: "7d" }
  );
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return next(createError("Email already exists", 409));
    const avatar = req.file && req.file.path ? req.file.path : undefined;
    const user = await User.create({ name, email, password, role, avatar });
    const code = generateToken();
    const verifyLink = `http://localhost:${config.port}/api/auth/verify-email?email=${email}&token=${code}`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await VerificationCode.create({
      userId: user._id,
      code,
      purpose: "email_verify",
      expiresAt,
    });
    res.status(201).json({
      success: true,
      message:
        "Registered successfully. Please check your email to verify account",
      email,
    });
    setImmediate(() =>
      sendVerificationEmail({ email, name, link: verifyLink })
    );
  } catch (error) {
    next(error);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, token } = req.query;
    const user = await User.findOne({ email });
    if (!user) return next(createError("Email does not exist", 404));
    const record = await VerificationCode.findOne({
      userId: user._id,
      code: token,
      purpose: "email_verify",
      expiresAt: { $gt: new Date() },
    });
    if (!record)
      return next(createError("Invalid token or token expired", 400));
    user.isVerified = true;
    await user.save();
    await VerificationCode.deleteMany({
      userId: user._id,
      purpose: "email_verify",
    });
    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(createError("Email does not exist", 404));
    if (!(await user.comparePassword(password)))
      return next(createError("Invalid password", 400));
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await Token.create({ userId: user._id, token: refreshToken });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.node_env === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 69 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      accessToken,
      expiresIn: "15m",
    });
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return next(createError("No refresh token in cookie", 401));
    const decoded = jwt.verify(refreshToken, config.jwt_refresh_secret);
    const existingToken = await Token.findOne({
      userId: decoded.id,
      token: refreshToken,
    });
    if (!existingToken) return next(createError("Invalid refresh token", 403));
    const accessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      config.jwt_secret,
      { expiresIn: "15m" }
    );
    await existingToken.deleteOne();
    const newRefreshTOken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      config.jwt_refresh_secret,
      { expiresIn: "7d" }
    );
    await Token.create({ userId: decoded.id, token: newRefreshTOken });
    res.cookie("refreshToken", newRefreshTOken, {
      httpOnly: true,
      secure: config.node_env === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 69 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      message: "Refresh token successfully",
      accessToken,
      expiresIn: "15m",
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return next(createError("No refresh token in cookie", 401));
    await Token.deleteOne({ token: refreshToken });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: config.node_env === "production",
      sameSite: "Strict",
    });
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(createError("Email does not exist", 404));
    await VerificationCode.deleteMany({ userId: user._id, purpose: 'forgot_password' });
    const userName = user.name;
    console.log('name: ', userName);
    const token = generateToken();
    const link = `http://localhost:${config.port}/api/auth/reset-password?email=${email}&token=${token}`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await VerificationCode.create({
      userId: user._id,
      code: token,
      purpose: "forgot_password",
      expiresAt,
    });
    res.status(200).json({
      success: true,
      message: "Password reset code has been sent to your email.",
    });
    console.log(typeof userName);
    setImmediate(() => sendPasswordResetCode({ email, name: userName, link }));
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const { email, token, newPassword } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return next(createError("Email does not exist", 404));
        }
        const record = await VerificationCode.findOne({
            userId: user._id,
            code: token,
            purpose: 'forgot_password',
            expiresAt: { $gt: new Date() }
        });
        if (!record) {
            return next(createError('Invalid or expired token', 400));
        }
        user.password = newPassword;
        await user.save();
        await VerificationCode.deleteMany({ userId: user._id, purpose: 'forgot_password' });
        return res.status(200).json({
            success: true,
            message: 'Password has been reset successfully.'
        })
    } catch (error) {
        next(error)
    }
}