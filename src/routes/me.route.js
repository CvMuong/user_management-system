const express = require('express');
const router = express.Router();
const meController = require('../controllers/me.controller');
const protect = require('../middleware/auth.middleware');

router.get('/', protect, meController.getMe);
router.put('/', meController.updateMe);

module.exports = router;