const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
} = require("../controllers/user.controller");
const { verifyToken, authorizeRoles, authorizeSelfOrAdmin } = require("../middleware/authMiddleware");

// Crear usuario (solo administrador)
router.post("/users", verifyToken, authorizeRoles("administrador"), createUser);

// Obtener todos los usuarios (solo administrador)
router.get("/users", verifyToken, authorizeRoles("administrador"), getAllUsers);

// Obtener usuario por ID (solo el usuario mismo o administrador)
router.get("/users/:id", verifyToken, authorizeSelfOrAdmin, getUserById);

// Actualizar usuario (solo el usuario mismo o administrador)
router.put("/users/:id", verifyToken, authorizeSelfOrAdmin, updateUser);

// Eliminar usuario (solo administrador)
router.delete("/users/:id", verifyToken, authorizeRoles("administrador"), deleteUser);

module.exports = router;
