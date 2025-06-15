const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const uploadCloud = require('../middleware/uploadCloud.middleware');

router.post('/register', uploadCloud.single('avatar'), userController.register);
router.get('/verify-email', userController.verifyEmail);
router.post('/login', userController.login);
router.post('/refresh-token', userController.refreshToken);

module.exports = router;