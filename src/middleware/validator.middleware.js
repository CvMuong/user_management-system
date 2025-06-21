const { body, query } = require('express-validator');

const validateLogin = [
    body('email')
        .isEmail().withMessage('Invalid email')
        .notEmpty().withMessage('Email is required'),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const validateRegister = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isString().withMessage('Name must be a string'),
    body('email')
        .isEmail().withMessage('Invalid email')
        .notEmpty().withMessage('Email is required'),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role')
        .optional()
        .isIn(['user', 'admin']).withMessage('Role must be either user or admin'),
];

const validateVerifyEmail = [
    body('email')
        .isEmail().withMessage('Invalid email')
        .notEmpty().withMessage('Email is required'),
    body('token')
        .notEmpty().withMessage('Token is required')
];

const validateUserQuery = [
    query('limit').optional().isInt({ min: 1 }).toInt(),
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('orderBy').optional().isIn(['asc', 'desc']),
    query('sortBy').optional().isIn(['name', 'email', 'createdAt'])
];

module.exports = {
    validateRegister,
    validateLogin,
    validateVerifyEmail,
    validateUserQuery
};