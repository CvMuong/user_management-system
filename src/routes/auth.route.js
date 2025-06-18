const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const uploadCloud = require('../middleware/uploadCloud.middleware');

router.post('/register', uploadCloud.single('avatar'), authController.register);
router.get('/verify-email', authController.verifyEmail);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

module.exports = router;