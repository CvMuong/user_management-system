const User = require('../models/user.model');
const { createError } = require('../utils/error');
const cloudinary = require('../config/cloudinary');

exports.getMe = async (req, res, next) => {
    try {
        const id = req.user.id;
        const user = await User.findById(id).select('-password');
        if (!user) return next(createError('Not found user', 404));
        return res.status(200).json({
            success: true,
            message: 'Fetched user profile successfully',
            data: user
        })
    } catch (error) {
        next(error);
    }
};

exports.updateMe = async (req, res, next) => {
    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.role || req.body.password || req.body.email) {
        return next(createError('You can not update role, password or email here', 400));
    }
    if (req.file && req.file.path) {
        updates.avatar = req.file.path
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
            new: true,
            runValidators: true
        });

        return res.status(200).json({
            success: true,
            message: 'Updated user successfully',
            data: updatedUser
        });
    } catch (error) {
        if (req.file && req.file.filename) {
            await cloudinary.uploader.destroy(req.file.filename)
        }
        next(error);
    }
}