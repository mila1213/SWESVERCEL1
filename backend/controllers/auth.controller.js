const { auth, db } = require("../firebase");

const API_KEY = process.env.FIREBASE_API_KEY;
const FRONTEND_VERIFY_URL = process.env.FRONTEND_VERIFY_URL || "http://localhost:5173/verify";
const FRONTEND_RESET_URL = process.env.FRONTEND_RESET_URL || "http://localhost:5173/reset-password";

const ADMIN_EMAILS = [
  "leonor.yumi@epn.edu.ec",
  "camila.bueno@epn.edu.ec",
  "concepcion.arequipa@epn.edu.ec",
].map((email) => email.toLowerCase());

const getRoleByEmail = (email) => {
  if (!email) return "visitante";
  const normalized = email.toLowerCase().trim();
  if (ADMIN_EMAILS.includes(normalized)) return "administrador";
  if (normalized.endsWith("@epn.edu.ec")) return "emprendedor";
  return "visitante";
};

const normalizePhone = (phone) => {
  if (!phone) return "";
  return String(phone).replace(/\D/g, "");
};

const createFirebaseRequest = async (pathSuffix, body) => {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/${pathSuffix}?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  const data = await response.json();
  return { ok: response.ok, data };
};

const saveUserProfile = async (uid, profile) => {
  await db.collection("users").doc(uid).set(profile, { merge: true });
};

const loadUserProfile = async (uid) => {
  const doc = await db.collection("users").doc(uid).get();
  return doc.exists ? doc.data() : null;
};

const register = async (req, res) => {
  try {
    const { email, password, nombre, role, phone } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();
    const normalizedPhone = normalizePhone(phone);
    const selectedRole = role || "visitante";

    if (!normalizedEmail || !password || !nombre) {
      return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
    }
    if (!normalizedEmail.endsWith("@epn.edu.ec")) {
      return res.status(400).json({ mensaje: "Debes usar un correo institucional" });
    }
    if (password.length < 6) {
      return res.status(400).json({ mensaje: "La contraseña debe tener mínimo 6 caracteres" });
    }
    if (selectedRole === "emprendedor" && !normalizedPhone) {
      return res.status(400).json({ mensaje: "El teléfono es obligatorio para emprendedores" });
    }
    if (selectedRole === "administrador") {
      return res.status(403).json({ mensaje: "No puedes registrar administradores" });
    }

    const { ok, data } = await createFirebaseRequest("accounts:signUp", {
      email: normalizedEmail,
      password,
      returnSecureToken: true,
    });

    if (!ok) {
      const errorCode = data.error?.message;
      if (errorCode === "EMAIL_EXISTS") {
        return res.status(400).json({ mensaje: "El correo ya está registrado" });
      }
      return res.status(500).json({ mensaje: "Error al registrar usuario", detalle: data });
    }

    await saveUserProfile(data.localId, {
      email: normalizedEmail,
      role: selectedRole,
      nombre: nombre.trim(),
      phone: normalizedPhone,
      createdAt: new Date().toISOString(),
    });

    await createFirebaseRequest("accounts:sendOobCode", {
      requestType: "VERIFY_EMAIL",
      idToken: data.idToken,
      continueUrl: FRONTEND_VERIFY_URL,
    });

    res.status(201).json({ mensaje: "Usuario registrado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error interno del servidor", detalle: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ mensaje: "Correo y contraseña requeridos" });
    }

    const { ok, data } = await createFirebaseRequest("accounts:signInWithPassword", {
      email: normalizedEmail,
      password,
      returnSecureToken: true,
    });

    if (!ok) {
      return res.status(401).json({ mensaje: data.error?.message || "Credenciales inválidas" });
    }

    let role = "visitante";
    let phone = "";
    let nombre = "";
    const profile = await loadUserProfile(data.localId);

    if (profile) {
      role = profile.role || getRoleByEmail(normalizedEmail);
      phone = profile.phone || "";
      nombre = profile.nombre || "";
    } else {
      role = getRoleByEmail(normalizedEmail);
      await saveUserProfile(data.localId, {
        email: normalizedEmail,
        role,
        nombre: "",
        phone: "",
        createdAt: new Date().toISOString(),
      });
    }

    res.json({
      mensaje: "Login exitoso",
      token: data.idToken,
      uid: data.localId,
      email: data.email,
      role,
      phone,
      name: nombre,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

const verifyAccount = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) return res.status(400).json({ mensaje: "Falta el token de verificación" });

    const { ok, data } = await createFirebaseRequest("accounts:update", {
      oobCode: token,
    });

    if (!ok) {
      return res.status(400).json({ mensaje: data.error?.message || "Token inválido o expirado" });
    }

    res.json({ mensaje: "Cuenta verificada correctamente", email: data.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al verificar la cuenta" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ mensaje: "El correo es obligatorio" });

    const { ok, data } = await createFirebaseRequest("accounts:sendOobCode", {
      requestType: "PASSWORD_RESET",
      email: email.toLowerCase().trim(),
      continueUrl: FRONTEND_RESET_URL,
    });

    if (!ok) {
      return res.status(400).json({ mensaje: data.error?.message || "Error al solicitar recuperación de contraseña" });
    }

    res.json({ mensaje: "Correo de recuperación enviado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al solicitar recuperación de contraseña" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!token) return res.status(400).json({ mensaje: "Falta el token de restablecimiento" });
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ mensaje: "La contraseña debe tener mínimo 6 caracteres" });
    }

    const { ok, data } = await createFirebaseRequest("accounts:resetPassword", {
      oobCode: token,
      newPassword,
    });

    if (!ok) {
      return res.status(400).json({ mensaje: data.error?.message || "Token inválido o expirado" });
    }

    res.json({ mensaje: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al restablecer contraseña" });
  }
};

const googleSignIn = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ mensaje: "Falta idToken" });

    const decoded = await auth.verifyIdToken(idToken);
    const { uid, email, name, picture } = decoded;
    const normalizedEmail = email?.toLowerCase().trim();

    try {
      await auth.getUser(uid);
    } catch {
      await auth.createUser({
        uid,
        email: normalizedEmail,
        displayName: name || "",
        photoURL: picture || null,
      });
    }

    const role = getRoleByEmail(normalizedEmail);
    const existingProfile = await loadUserProfile(uid);
    if (!existingProfile) {
      await saveUserProfile(uid, {
        email: normalizedEmail,
        role,
        nombre: name || "",
        phone: "",
        createdAt: new Date().toISOString(),
      });
    }

    const customToken = await auth.createCustomToken(uid);
    res.json({ mensaje: "Google login exitoso", uid, email: normalizedEmail, role, customToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error en Google Sign-In", detalle: error.message });
  }
};

module.exports = { register, verifyAccount, forgotPassword, resetPassword, login, googleSignIn };