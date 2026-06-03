const express = require("express");
const { db } = require("../firebase");

const router = express.Router();
const getProductCollection = () => db.collection("products");

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

router.get("/products/user/:userId", async (req, res) => {
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

router.post("/products", async (req, res) => {
  try {
    const productCollection = getProductCollection();
    const product = {
      ...req.body,
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

router.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const productCollection = getProductCollection();
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

router.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const productCollection = getProductCollection();
    await productCollection.doc(id).delete();
    res.json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ mensaje: "Error al eliminar producto" });
  }
});

module.exports = router;
