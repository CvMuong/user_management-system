const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const uploadCloud = require('../middleware/uploadCloud.middleware');

router.post('/register', uploadCloud.single('avatar'), userController.register);
router.get('/verify-email', userController.verifyEmail);

module.exports = router;