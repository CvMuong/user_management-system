const express = require('express');
const app = express();
const config = require('./config/env');
const connectDB = require('./config/db');
const userRoutes = require('./routes/user.route');
const errorHandler = require('./middleware/errorHandler.middleware');

connectDB();

if (config.node_env === 'development') {
    const morgan = require('morgan');
}

app.use(express.json());

app.use('/api', userRoutes);

app.use(errorHandler);

module.exports = app;
