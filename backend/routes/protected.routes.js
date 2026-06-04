const express = require("express");
const router = express.Router();

const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

// Perfil - Accesible para visitante, emprendedor y administrador
router.get("/profile", verifyToken, authorizeRoles("visitante", "emprendedor", "administrador"), (req, res) => {
  res.json({
    message: "Perfil privado",
    user: req.user,
  });
});

// Dashboard - Accesible para emprendedor y administrador
router.get("/dashboard", verifyToken, authorizeRoles("emprendedor", "administrador"), (req, res) => {
  res.json({
    message: "Dashboard privado",
    user: req.user,
  });
});

// Panel administrativo - Solo administrador
router.get("/admin", verifyToken, authorizeRoles("administrador"), (req, res) => {
  res.json({
    message: "Panel administrativo",
    user: req.user,
  });
});

module.exports = router;