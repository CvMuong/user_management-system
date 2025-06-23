const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');
const { validateRegister, validateUserQuery, validateChangeRole } = require("../middleware/validator.middleware");
const handleValidation = require('../middleware/validate.middleware');
const userController = require('../controllers/user.controller');

router.get('/', validateUserQuery, handleValidation, protect, authorize('admin'), userController.getAllUsers);
router.get('/:id', protect, authorize('admin'), userController.getUserById);
router.post('/', validateRegister, handleValidation, protect, authorize('admin'), userController.createUserByAdmin);
router.patch('/:id', protect, authorize('admin'), userController.updateUserByAdmin);
router.patch('/:id/change-role', validateChangeRole, handleValidation, protect, authorize('admin'), userController.changeRoleUser)

module.exports = router;