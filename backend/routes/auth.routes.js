const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/authMiddleware");

const register = authController.register;
const login = authController.login;
const googleSignIn = authController.googleSignIn;
const verifyAccount = authController.verifyAccount;
const forgotPassword = authController.forgotPassword;
const changePassword = authController.changePassword;

router.post("/register", register);
router.post("/auth/register", register);
router.post("/login", login);
router.post("/google", googleSignIn);
router.get("/verify/:token", verifyAccount);
router.get("/auth/verify/:token", verifyAccount);
router.post("/forgot-password", forgotPassword);
router.post("/auth/forgot-password", forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/auth/reset-password", authController.resetPassword);
router.post("/reset-password-code", authController.resetPasswordWithCode);
router.post("/auth/reset-password-code", authController.resetPasswordWithCode);
router.post("/change-password", verifyToken, changePassword);

module.exports = router;