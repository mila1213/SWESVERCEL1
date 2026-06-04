const express = require("express");
const { db } = require("../firebase");
const { verifyToken, authorizeRoles, authorizeSelfOrAdmin } = require("../middleware/authMiddleware");

const router = express.Router();
const getProductCollection = () => db.collection("products");

// Obtener todos los productos (público)
router.get("/products", async (req, res) => {
  try {
    const productCollection = getProductCollection();
    const snapshot = await productCollection.get();
    const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ mensaje: "Error al obtener productos" });
  }
});

// Obtener productos por usuario (solo usuario autenticado) - DEBE ESTAR ANTES QUE /:id
router.get("/products/user/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const productCollection = getProductCollection();
    const snapshot = await productCollection.where("userId", "==", userId).get();
    const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(products);
  } catch (error) {
    console.error("Error al obtener productos por usuario:", error);
    res.status(500).json({ mensaje: "Error al obtener productos del usuario" });
  }
});

// Obtener producto por ID (público)
router.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const productCollection = getProductCollection();
    const doc = await productCollection.doc(id).get();
    if (!doc.exists) return res.status(404).json({ mensaje: "Producto no encontrado" });
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ mensaje: "Error al obtener producto" });
  }
});

// Crear producto (solo emprendedor o administrador)
router.post("/products", verifyToken, authorizeRoles("emprendedor", "administrador"), async (req, res) => {
  try {
    const productCollection = getProductCollection();
    const product = {
      ...req.body,
      userId: req.user.uid,
      price: req.body.price ? Number(req.body.price) : 0,
      createdAt: new Date().toISOString(),
    };
    const docRef = await productCollection.add(product);
    res.status(201).json({ id: docRef.id, ...product });
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ mensaje: "Error al crear producto" });
  }
});

// Actualizar producto (solo dueño o administrador)
router.put("/products/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const productCollection = getProductCollection();
    const doc = await productCollection.doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    const isOwner = doc.data().userId === req.user.uid;
    const isAdmin = req.user.role === "administrador";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ mensaje: "No tienes permiso para actualizar este producto" });
    }

    const product = {
      ...req.body,
      price: req.body.price ? Number(req.body.price) : 0,
      updatedAt: new Date().toISOString(),
    };
    await productCollection.doc(id).update(product);
    res.json({ id, ...product });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ mensaje: "Error al actualizar producto" });
  }
});

// Eliminar producto (solo dueño o administrador)
router.delete("/products/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const productCollection = getProductCollection();
    const doc = await productCollection.doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    const isOwner = doc.data().userId === req.user.uid;
    const isAdmin = req.user.role === "administrador";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ mensaje: "No tienes permiso para eliminar este producto" });
    }

    await productCollection.doc(id).delete();
    res.json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ mensaje: "Error al eliminar producto" });
  }
});

module.exports = router;
