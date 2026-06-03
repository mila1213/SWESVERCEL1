const { db } = require("../firebase");

const getAllUsers = async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();
    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ mensaje: "Error al obtener usuarios" });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection("users").doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ mensaje: "Error al obtener usuario" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ mensaje: "No hay datos para actualizar" });
    }

    const userRef = db.collection("users").doc(id);
    const doc = await userRef.get();
    if (!doc.exists) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    await userRef.set(updates, { merge: true });
    const updatedDoc = await userRef.get();
    res.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ mensaje: "Error al actualizar usuario" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userRef = db.collection("users").doc(id);
    const doc = await userRef.get();
    if (!doc.exists) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    await userRef.delete();
    res.json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ mensaje: "Error al eliminar usuario" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
