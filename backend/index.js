const express = require("express");
const cors = require("cors");
// Asegúrate de que en ./firebase estés exportando 'admin' y 'auth' correctamente
const { auth } = require("./firebase");

const app = express();


app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("API Firebase funcionando"));

//REGISTRO -
app.post("/api/register", async (req, res) => {
  try {
    const { email, password, nombre } = req.body; // Añadimos nombre por tu formulario anterior

    if (!email || !password) {
      return res.status(400).json({ message: "Faltan datos obligatorios", mensaje: "Faltan datos obligatorios" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres", mensaje: "La contraseña debe tener al menos 6 caracteres" });
    }

    // Crear el usuario mediante la REST API para obtener idToken y poder enviar correo de verificación
    const signUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
    const signUpRes = await fetch(signUpUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    });
    const signUpData = await signUpRes.json();

    if (!signUpRes.ok) {
      const err = signUpData.error?.message || 'ERROR_SIGNUP';
      console.error('Error en signUp:', err);
      if (err === 'EMAIL_EXISTS') {
        return res.status(400).json({ message: 'El correo ya está registrado', mensaje: 'El correo ya está registrado' });
      }
      return res.status(500).json({ message: 'Error al registrar usuario', mensaje: 'Error al registrar usuario', detalle: signUpData });
    }

    const idToken = signUpData.idToken;

    // Enviar correo de verificación usando sendOobCode con idToken
    const sendVerifyUrl = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${API_KEY}`;
    const FRONTEND_VERIFY = process.env.FRONTEND_VERIFY_URL || 'http://localhost:5173/verify';
    const sendVerifyRes = await fetch(sendVerifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestType: 'VERIFY_EMAIL', idToken, continueUrl: FRONTEND_VERIFY }),
    });
    const sendVerifyData = await sendVerifyRes.json();

    if (!sendVerifyRes.ok) {
      console.error('Error enviando correo verificación:', sendVerifyData);
      // No hacemos rollback; devolvemos que el registro fue creado pero el correo no se envió
      return res.status(201).json({ message: 'Usuario creado, pero no se pudo enviar correo de verificación', mensaje: 'Usuario creado, pero no se pudo enviar correo de verificación', detalle: sendVerifyData, uid: signUpData.localId });
    }

    res.status(201).json({ message: 'Usuario registrado con éxito. Revisa tu correo para verificar cuenta.', mensaje: 'Usuario registrado con éxito. Revisa tu correo para verificar cuenta.', uid: signUpData.localId });
  } catch (error) {
    console.error("Error en Registro:", error);
    res.status(500).json({ message: "Error interno al registrar", mensaje: "Error interno al registrar", detalle: error.message });
  }
});

// LOGIN 
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ mensaje: "Correo y contraseña requeridos" });
    }

  
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.error ? data.error.message : "Error desconocido";
      console.log("Fallo de login:", errorMsg);
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    res.json({ message: 'Login exitoso', mensaje: 'Login exitoso', token: data.idToken, uid: data.localId, email: data.email });
  } catch (error) {
    console.error("Error en Login:", error);
    res.status(500).json({ mensaje: "Error en el servidor al iniciar sesión" });
  }
});

// GOOGLE SIGN-IN (cliente envía idToken que proviene de Firebase client SDK)
app.post('/api/google', async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ mensaje: 'Falta idToken' });

    const decoded = await auth.verifyIdToken(idToken);
    const { uid, email, name, picture } = decoded;

    // Intentar obtener el usuario; si no existe, crearlo en Auth
    let userRecord;
    try {
      userRecord = await auth.getUser(uid);
    } catch (err) {
      // Crear usuario con los datos mínimos
      userRecord = await auth.createUser({
        uid,
        email,
        displayName: name || '',
        photoURL: picture || null,
      });
    }

    // Crear un custom token si se desea para sesiones seguras en el cliente
    const customToken = await auth.createCustomToken(uid);

    res.json({ message: 'Google sign-in verificado', mensaje: 'Google sign-in verificado', uid: userRecord.uid, email: userRecord.email, customToken });
  } catch (error) {
    console.error('Error en Google sign-in:', error);
    res.status(500).json({ message: 'Error verificando Google token', mensaje: 'Error verificando Google token', detalle: error.message });
  }
});

// RECUPERAR CONTRASEÑA (envía correo de restablecimiento mediante la API REST de Firebase)
app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ mensaje: 'Falta el email' });

    const url = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestType: 'PASSWORD_RESET', email }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Error sendOobCode:', data);
      return res.status(400).json({ mensaje: 'No se pudo enviar el correo de recuperación', detalle: data.error || data });
    }

    res.json({ message: 'Correo de recuperación enviado', mensaje: 'Correo de recuperación enviado' });
  } catch (error) {
    console.error('Error en forgot-password:', error);
    res.status(500).json({ message: 'Error interno al generar recuperación', mensaje: 'Error interno al generar recuperación', detalle: error.message });
  }
});

// VERIFICAR EMAIL usando oobCode (código obtenido desde el enlace que envía Firebase)
app.get('/api/verify/:oobCode', async (req, res) => {
  try {
    const { oobCode } = req.params;
    if (!oobCode) return res.status(400).json({ message: 'Falta oobCode', mensaje: 'Falta oobCode' });

    const url = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oobCode }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Error verificando email:', data);
      return res.status(400).json({ message: 'No se pudo verificar el email', mensaje: 'No se pudo verificar el email', detalle: data });
    }

    res.json({ message: 'Email verificado correctamente', mensaje: 'Email verificado correctamente', email: data.email });
  } catch (error) {
    console.error('Error en verify:', error);
    res.status(500).json({ message: 'Error interno al verificar', mensaje: 'Error interno al verificar', detalle: error.message });
  }
});

const PORT = 8000;
app.listen(PORT, () => console.log(`➜ Servidor corriendo en: http://localhost:${PORT}/`));