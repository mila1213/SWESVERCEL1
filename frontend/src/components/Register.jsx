import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nombre, email, password } = Object.fromEntries(new FormData(e.target));

    try {
      const res = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password }),
      });

      if (res.ok) {
        alert("¡Éxito!");
        navigate('/login');
      } else {
        alert("Error en el registro");
      }
    } catch {
      alert("Error de conexión");
    }
  };

  return (
    <div>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <input name="nombre" placeholder="Nombre" required />
        <br />
        <input name="email" type="email" placeholder="Correo" required />
        <br />
        <input name="password" type="password" placeholder="Contraseña" required />
        <br />
        <button type="submit">Registrarse</button>
      </form>
      <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
    </div>
  );
};

export default Register;