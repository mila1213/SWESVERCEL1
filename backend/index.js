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
      return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
    }

    if (password.length < 6) {
      return res.status(400).json({ mensaje: "La contraseña debe tener al menos 6 caracteres" });
    }

    const user = await auth.createUser({
      email,
      password,
      displayName: nombre || "" 
    });

    res.status(201).json({
      mensaje: "Usuario registrado con éxito",
      uid: user.uid
    });
  } catch (error) {
    console.error("Error en Registro:", error);
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }
    res.status(500).json({ mensaje: "Error interno al registrar", detalle: error.message });
  }
});

// LOGIN 
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ mensaje: "Correo y contraseña requeridos" });
    }

  
    const API_KEY = "AIzaSyDgoX5bD9EOMxRwTe1lN1yRIg9lBiNR7So"; 
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Diferenciamos si es error de credenciales o de la API
      const errorMsg = data.error ? data.error.message : "Error desconocido";
      console.log("Fallo de login:", errorMsg);
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    res.json({
      mensaje: "Login exitoso",
      token: data.idToken, 
      uid: data.localId,
      email: data.email
    });
  } catch (error) {
    console.error("Error en Login:", error);
    res.status(500).json({ mensaje: "Error en el servidor al iniciar sesión" });
  }
});

const PORT = 8000;
app.listen(PORT, () => console.log(`➜ Servidor corriendo en: http://localhost:${PORT}/`));