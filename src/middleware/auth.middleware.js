const jwt = require('jsonwebtoken');
const { createError } = require('../utils/error');
const config = require('../config/env');

const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || ! authHeader.startsWith('Bearer ')) {
        return next(createError('No token provided', 401));
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, config.jwt_secret);
        req.user = decoded;
        next();
    } catch (error) {
        if (config.node_env === 'development') console.error(error);

        const errorMap = {
            TokenExpiredError: 'Expired token',
            JsonWebTokenError: 'Invalid token',
            NotBeforeError: 'Token not active yet'
        }
        let message = errorMap[error.name] || 'Authentication failed';
        return next(createError(message, 401));
    }
};

module.exports = protect;