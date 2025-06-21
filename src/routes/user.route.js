const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');
const { validateRegister } = require("../middleware/validator.middleware");
const handleValidation = require('../middleware/validate.middleware');
const userController = require('../controllers/user.controller');

router.get('/', protect, authorize('admin'), userController.getAllUsers);
router.get('/:id', protect, authorize('admin'), userController.getUserById);

module.exports = router;