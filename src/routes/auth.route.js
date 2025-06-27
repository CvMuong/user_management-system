const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const uploadCloud = require("../middleware/uploadCloud.middleware");
const {
  validateRegister,
  validateLogin,
  validateVerifyEmail,
  validateForgotPassword,
  validateResetPassword,
} = require("../middleware/validator.middleware");
const handleValidation = require("../middleware/validate.middleware");

router.post(
  "/register",
  validateRegister,
  handleValidation,
  uploadCloud.single("avatar"),
  authController.register
);
router.get(
  "/verify-email",
  validateLogin,
  handleValidation,
  authController.verifyEmail
);
router.post("/login", validateLogin, handleValidation, authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);
router.post(
  "/forgot-password",
  validateForgotPassword,
  handleValidation,
  authController.forgotPassword
);
router.post(
  "/reset-password",
  validateResetPassword,
  handleValidation,
  authController.resetPassword
);

module.exports = router;
