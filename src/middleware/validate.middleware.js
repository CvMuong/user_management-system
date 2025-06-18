const { validationResult } = require('express-validator');
const { createError } = require('../utils/error');
const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const message = errors.array()[0].msg;
        return next(createError(message, 400))
    }
    return next();
}

module.exports = handleValidation;