const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { auth, db } = require("./firebase"); 
const API_KEY = process.env.FIREBASE_API_KEY || "AIzaSyDgoX5bD9EOMxRwTe1lN1yRIg9lBiNR7So";

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get("/", (req, res) => res.send("API Firebase funcionando"));

// REGISTRO
app.post("/api/register", async (req, res) => {
  try {
    const { email, password, nombre } = req.body; 

    if (!email || !password) {
      return res.status(400).json({ message: "Faltan datos obligatorios", mensaje: "Faltan datos obligatorios" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres", mensaje: "La contraseña debe tener al menos 6 caracteres" });
    }

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

    const sendVerifyUrl = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${API_KEY}`;
    const FRONTEND_VERIFY = process.env.FRONTEND_VERIFY_URL || 'http://localhost:5173/verify';
    const sendVerifyRes = await fetch(sendVerifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestType: 'VERIFY_EMAIL', idToken, continueUrl: FRONTEND_VERIFY }),
    });
    const sendVerifyData = await sendVerifyRes.json();

    if (!sendVerifyRes.ok) {
      console.error('Error sending email verification:', sendVerifyData);
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
      console.log("Fallo de login:", errorMsg, data);
      return res.status(401).json({ mensaje: errorMsg || "Credenciales inválidas", error: data });
    }

    res.json({ message: 'Login exitoso', mensaje: 'Login exitoso', token: data.idToken, uid: data.localId, email: data.email });
  } catch (error) {
    console.error("Error en Login:", error);
    res.status(500).json({ mensaje: "Error en el servidor al iniciar sesión" });
  }
});

// GOOGLE SIGN-IN
app.post('/api/google', async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ mensaje: 'Falta idToken' });

    const decoded = await auth.verifyIdToken(idToken);
    const { uid, email, name, picture } = decoded;

    let userRecord;
    try {
      userRecord = await auth.getUser(uid);
    } catch (err) {
      userRecord = await auth.createUser({
        uid,
        email,
        displayName: name || '',
        photoURL: picture || null,
      });
    }

    const customToken = await auth.createCustomToken(uid);

    res.json({ message: 'Google sign-in verificado', mensaje: 'Google sign-in verificado', uid: userRecord.uid, email: userRecord.email, customToken });
  } catch (error) {
    console.error('Error en Google sign-in:', error);
    res.status(500).json({ message: 'Error verifying Google token', mensaje: 'Error verifying Google token', detalle: error.message });
  }
});

// RECUPERAR CONTRASEÑA
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

// VERIFICAR EMAIL 
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

//CRUD

// 1. OBTENER TODOS LOS PRODUCTOS (Vitrina pública)
app.get("/api/products", async (req, res) => {
  try {
    const snapshot = await db.collection("products").orderBy("createdAt", "desc").get();
    const products = [];
    
    snapshot.forEach(doc => {
      products.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ mensaje: "Error al obtener productos de la base de datos", detalle: error.message });
  }
});

// 2. OBTENER UN PRODUCTO POR ID
app.get("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection("products").doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ mensaje: "El producto solicitado no existe" });
    }

    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).json({ mensaje: "Error interno del servidor", detalle: error.message });
  }
});

// 2.5 NUEVA RUTA: OBTENER SOLO LOS PRODUCTOS DE UN USUARIO (Sección "Mis Productos")
app.get("/api/products/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Filtramos en Firestore los documentos donde el campo 'userId' coincida
    const snapshot = await db.collection("products")
      .where("userId", "==", userId)
      .get();
      
    const misProductos = [];
    snapshot.forEach(doc => {
      misProductos.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(misProductos);
  } catch (error) {
    console.error("Error al obtener productos del usuario:", error);
    res.status(500).json({ mensaje: "Error al obtener tus productos", detalle: error.message });
  }
});

// 3. CREAR UN NUEVO PRODUCTO
app.post("/api/products", async (req, res) => {
  try {
    const { name, price, description, category, userId, image, imagen } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ mensaje: "Nombre, precio y categoría son campos obligatorios" });
    }

    if (isNaN(price) || parseFloat(price) <= 0) {
      return res.status(400).json({ mensaje: "El precio debe ser un número mayor a 0" });
    }

    const nuevoProducto = {
      name: name.trim(),
      price: parseFloat(price),
      description: description ? description.trim() : "",
      category,
      userId: userId || "anonimo", 
      image: image || imagen || "", 
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection("products").add(nuevoProducto);
    
    res.status(201).json({ 
      id: docRef.id, 
      mensaje: "Producto registrado y guardado con éxito en Firestore", 
      ...nuevoProducto 
    });
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ mensaje: "Error al guardar el producto", detalle: error.message });
  }
});

// 4. ACTUALIZAR UN PRODUCTO
app.put("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, category, image, imagen } = req.body;

    const docRef = db.collection("products").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ mensaje: "El producto que intentas actualizar no existe" });
    }

    const datosActualizados = {};
    if (name) datosActualizados.name = name.trim();
    if (price) {
      if (isNaN(price) || parseFloat(price) <= 0) {
        return res.status(400).json({ mensaje: "El precio debe ser un número válido mayor a 0" });
      }
      datosActualizados.price = parseFloat(price);
    }
    if (description !== undefined) datosActualizados.description = description.trim();
    if (category) datosActualizados.category = category;
    
    if (image !== undefined || imagen !== undefined) {
      datosActualizados.image = image || imagen || "";
    }
    
    datosActualizados.updatedAt = new Date().toISOString();

    await docRef.update(datosActualizados);

    res.status(200).json({ mensaje: "Producto actualizado correctamente en la base de datos" });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ mensaje: "Error interno al actualizar", detalle: error.message });
  }
});

// 5. ELIMINAR UN PRODUCTO
app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection("products").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ mensaje: "El producto que intentas eliminar no existe" });
    }

    await docRef.delete();
    res.status(200).json({ mensaje: "Producto eliminado definitivamente de Firestore" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ mensaje: "Error interno al eliminar el producto", detalle: error.message });
  }
});

// INICIAR SERVIDOR
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});