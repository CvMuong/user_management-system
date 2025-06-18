const { createError } = require('../utils/error');

const authorize = (...roles) => (req, res, next) => {
    if (!req.user) {
        return next(createError('Unauthorized: No user information found', 401));
    }
    if (!roles.includes(req.user.role)) {
        return next(createError('Forbidden', 403));
    }
    return next();
};

module.exports = authorize;