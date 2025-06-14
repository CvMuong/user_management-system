const cloudinary = require('cloudinary').v2;
const config = require('../config/env');

cloudinary.config({
    cloud_name: config.cloudinary_cloud_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret,
});

module.exports = cloudinary;