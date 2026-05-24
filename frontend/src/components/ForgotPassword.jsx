import { useState } from "react";
import { Link } from 'react-router-dom';
import { forgotPassword } from "../services/authService";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await forgotPassword(email);
      setMessage(data.message || data.mensaje || 'Correo enviado si el usuario existe.');
    } catch (error) {
      setMessage(error.response?.data?.message || error.response?.data?.mensaje || "Error al solicitar recuperación");
    }
  };

  return (
    <div>
      <h2>Recuperar contraseña</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Correo
          <input placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <button>Solicitar recuperación</button>
      </form>
      <p>{message}</p>
      <p className="mt-4">¿Recordaste tu contraseña? <Link to="/login" className="text-blue-600 hover:underline">Volver a iniciar sesión</Link></p>
    </div>
  );
}

export default ForgotPassword;