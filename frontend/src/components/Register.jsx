import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data), 
      });

      const result = await res.json();

      if (res.ok) {
        alert("¡Registro exitoso!");
        navigate('/login');
      } else {
        
        alert("Error: " + (result.message || "No se pudo registrar"));
      }
    } catch (error) {
      console.error("Error en el fetch:", error);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <input name="nombre" placeholder="Nombre completo" required style={inputStyle} />
        <br />
        <input name="email" type="email" placeholder="Correo electrónico" required style={inputStyle} />
        <br />
        <input name="password" type="password" placeholder="Contraseña (mín. 6 caracteres)" required style={inputStyle} />
        <br />
        <button type="submit" style={buttonStyle}>Registrarse</button>
      </form>
      <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
    </div>
  );
};


const inputStyle = { padding: '10px', margin: '10px 0', width: '100%' };
const buttonStyle = { padding: '10px 20px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none' };

export default Register;