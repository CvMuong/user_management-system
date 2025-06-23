const User = require('../models/user.model');
const { createError } = require('../utils/error');
const cloudinary = require('../config/cloudinary');
const buildUserQuery = require('../utils/queryBuilder');
const mongoose = require('mongoose');

exports.getAllUsers = async (req, res, next) => {
    try {
        const {
            limit = 10,
            page = 1,
            keyword,
            role,
            sortBy = 'createdAt',
            orderBy = 'desc'
        } = req.query;
        const parsedLimit = Math.max(parseInt(limit) || 10, 1);
        const parsedPage = Math.max(parseInt(page) || 1, 1);
        const filter = buildUserQuery({ keyword, role });
        const ALLOWED_SORT_FIELDS = ['name', 'email', 'createdAt'];
        const safeSortBy = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'createdAt';
        const sortOption = {};
        sortOption[safeSortBy] = orderBy === 'desc' ? -1 : 1;
        const users = await User.find(filter)
            .select('-password')
            .sort(sortOption)
            .skip((parsedPage - 1) * parsedLimit)
            .limit(parsedLimit)
            .lean();
        const total = await User.countDocuments(filter);
        return res.status(200).json({
            success: true,
            message: 'Users fetched successfully',
            total,
            totalPage: Math.ceil(total / parsedLimit),
            currentPage: parsedPage,
            data: users
        });
    } catch (error) {
        next(error);
    }
};

exports.getUserById = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(createError('Invalid user ID', 400));
        }
        const user = await User.findById(id).select('-password').lean();
        if (!user) {
             return next(createError('User not found', 404));
        }
        return res.status(200).json({
            success: true,
            message: 'User fetched successfully',
            data: user
        });
    } catch (error) {
        next(error);
    }
};

exports.createUserByAdmin = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(createError('Email already exists', 400));
        }
        const ALLOWED_ROLES = ['admin', 'user'];
        if (!ALLOWED_ROLES.includes(role)) {
            return next(createError('Invalid role', 400));
        }
        const user = await User.create({ name, email, password, role, isVerified: true });
        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            email
        });
    } catch (error) {
        next(error);
    }
};

exports.updateUserByAdmin = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const ALLOWED_UPDATE_FIELDS = ['name', 'email', 'avatar', 'isVerify'];
        const updates = {};
        for (let key of ALLOWED_UPDATE_FIELDS) {
            if (req.body[key] !== undefined) {
                updates[key] = req.body[key];
            }
        }
        if (req.file && req.file.path) {
            updates.avatar = req.file.path;
        }
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updates,
            {
                new: true,
                runValidators: true
            }
        ).select('-password').lean();
        if (!updatedUser) {
            return next(createError('User not found', 404));
        }
        return res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: updatedUser
        })
    } catch (error) {
        next(error);
    }
};

exports.changeRoleUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(
            userId,
            { role },
            {
                new: true,
                runValidators: true
            }
        ).select('-password');
        if (!user) {
            return next(createError('User not found', 404));
        }
        return res.status(200).json({
            success: true,
            message: 'Update user role successfully',
            data: user
        });
    } catch (error) {
        next(error);
    }
}