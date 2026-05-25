import { useState } from "react";
import { Link } from 'react-router-dom';
import { forgotPassword } from "../services/authService";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await forgotPassword(email);
      setMessage(data.message || data.mensaje || 'Correo enviado si el usuario existe.');
      setSent(true);
    } catch (error) {
      setMessage(error.response?.data?.message || error.response?.data?.mensaje || "Error al solicitar recuperación");
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-brand-panel">
      <div className="max-w-sm w-full flex flex-col gap-4 bg-neutral-bg rounded-card px-8 py-10 shadow-form">

        {/* Encabezado */}
        <div>
          <h2 className="text-2xl font-bold text-neutral-text leading-tight">
            Recuperar contraseña
          </h2>
          <p className="text-sm text-neutral-muted mt-1">
            Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
          </p>
        </div>

        {/* Formulario o confirmación */}
        {!sent ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-neutral-text">Correo electrónico</label>
              <div className="flex items-center border border-neutral-border rounded-input px-3 gap-2 bg-white
                              focus-within:border-brand-primary focus-within:shadow-input transition-all">
                <svg className="w-4 h-4 text-neutral-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 6.75L2.25 6.75" />
                </svg>
                <input
                  type="email"
                  placeholder="usuario@epn.edu.ec"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 py-2.5 text-sm text-neutral-text placeholder:text-neutral-muted outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Error */}
            {message && (
              <p className="text-xs text-red-500">{message}</p>
            )}

            <button
              type="submit"
              className="w-full bg-brand-primary hover:bg-brand-hover text-white font-semibold
                         py-3 rounded-btn text-sm transition-all flex items-center justify-center gap-2 mt-1">
              Enviar enlace de recuperación →
            </button>
          </form>

        ) : (
          /* Estado: correo enviado */
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm text-neutral-text text-center font-medium">{message}</p>
            <p className="text-xs text-neutral-muted text-center">
              Revisa tu bandeja de entrada y sigue el enlace para restablecer tu contraseña.
            </p>
          </div>
        )}

        {/* Link volver */}
        <p className="text-center text-sm text-neutral-muted">
          ¿Recordaste tu contraseña?{' '}
          <Link to="/login" className="text-brand-accent font-semibold hover:opacity-80 transition-opacity">
            Iniciar sesión
          </Link>
        </p>

        <p className="text-center text-xs text-neutral-subtle">© 2026 Escuela Politécnica Nacional</p>

      </div>
    </div>
  );
}

export default ForgotPassword;