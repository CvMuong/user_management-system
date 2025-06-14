require('dotenv').config();

const env = {
    port: process.env.PORT || 3000,
    mongodb_uri: process.env.MONGODB_URI,
    node_env: process.env.NODE_ENV,
    jwt_secret: process.env.JWT_SECRET,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
    email_sender: process.env.EMAIL_SENDER,
    app_password: process.env.APP_PASSWORD,
};

module.exports = env;