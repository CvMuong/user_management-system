const express = require('express');
const router = express.Router();
const meController = require('../controllers/me.controller');
const protect = require('../middleware/auth.middleware');
const uploadCLoud = require('../middleware/uploadCloud.middleware');

router.get('/', protect, meController.getMe);
router.put('/', protect, uploadCLoud.single('avatar'), meController.updateMe);

module.exports = router;