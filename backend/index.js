const express = require("express");
const cors = require("cors");
const { auth } = require("./firebase");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("API Firebase funcionando"));

app.post("/api/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
    }
    const user = await auth.createUser({
      email,
      password
    });
    res.status(201).json({
      mensaje: "Usuario registrado",
      uid: user.uid
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ mensaje: "Correo y contraseña requeridos" });
    }
    const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDgoX5bD9EOMxRwTe1lN1yRIg9lBiNR7So', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(400).json({ mensaje: "Correo o contraseña incorrectos" });
    }
    res.json({
      mensaje: "Login exitoso",
      uid: data.localId,
      email: data.email
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al iniciar sesión" });
  }
});

app.listen(8000, () => console.log(`➜  Local:   http://localhost:8000/`));
