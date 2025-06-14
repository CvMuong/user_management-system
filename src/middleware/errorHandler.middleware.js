const config = require('../config/env');

module.exports = (err, req, res, next) => {
    const message = err.message || 'Internal Server Error';
    const status = err.status || 500;

    if (config.node_env === 'development') {
        console.error("Detail error: ", err.stack);
    }

    return res.status(status).json({
        success: false,
        message,
        ...(config.node_env === ' development' ? { error: error.stack } : {})
    })
};