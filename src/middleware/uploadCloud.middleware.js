const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'user_management_system',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        public_id: (req, file) => {
            const fileName = (file.originalname).split('.')[0];
            return Date.now() + '-' + fileName;
        },
    },
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;