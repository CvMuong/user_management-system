const mongoose = require('mongoose');
const config = require('./env');

async function connectDB() {
    try {
        await mongoose.connect(config.mongodb_uri);
        console.log('Connected to DB');
    } catch (error) {
        console.error('Error connecting to DB: ', error);
        process.exit(1);
    }
}

module.exports = connectDB;