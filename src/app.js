const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const config = require('./config/env');
const connectDB = require('./config/db');
const indexRoutes = require('./routes/index.route');
const errorHandler = require('./middleware/errorHandler.middleware');

connectDB();

if (config.node_env === 'development') {
    const morgan = require('morgan');
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api', indexRoutes);

app.use(errorHandler);

module.exports = app;
