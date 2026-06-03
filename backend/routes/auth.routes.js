const express = require("express");
const router = express.Router();

const {
  register,
  verifyAccount,
  forgotPassword,
  resetPassword,
  login,
  googleSignIn,
} = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/auth/register", register);
router.post("/login", login);
router.post("/google", googleSignIn);
router.get("/verify/:token", verifyAccount);
router.get("/auth/verify/:token", verifyAccount);
router.post("/forgot-password", forgotPassword);
router.post("/auth/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/auth/reset-password/:token", resetPassword);

module.exports = router;