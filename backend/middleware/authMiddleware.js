const admin = require("firebase-admin");

// Verifica el token JWT de Firebase
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Obtener datos del usuario desde Firestore (incluye el campo role)
    const userDoc = await admin
      .firestore()
      .collection("users")
      .doc(decodedToken.uid)
      .get();

    if (!userDoc.exists) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const userData = userDoc.data();

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: userData.role || "guest", // Por defecto guest si no tiene rol
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado", error: error.message });
  }
};

// Verifica que el usuario tenga uno de los roles permitidos
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Acceso denegado. Se requiere rol: ${roles.join(" o ")}. Tu rol: ${req.user.role}`,
      });
    }

    next();
  };
};

// Verifica que el usuario solo acceda a sus propios recursos (o sea admin)
const authorizeSelfOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "No autenticado" });
  }

  const isAdmin = req.user.role === "admin";
  const isSelf = req.user.uid === req.params.id;

  if (!isAdmin && !isSelf) {
    return res.status(403).json({
      message: "Acceso denegado. Solo puedes acceder a tu propio recurso.",
    });
  }

  next();
};

module.exports = { verifyToken, authorizeRoles, authorizeSelfOrAdmin };
