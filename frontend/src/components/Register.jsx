import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { googleSignIn } from '../services/authService';
import logoSwes from '../assets/icono_sistema.png';

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
        body: JSON.stringify({ email: data.email, password: data.password, nombre: data.nombre }),
      });

      const result = await res.json();

      if (res.ok) {
        alert(result.message || result.mensaje || 'Registro exitoso. Revisa tu correo.');
        navigate('/login');
      } else {
        alert(result.message || result.mensaje || 'No se pudo registrar');
      }
    } catch (error) {
      console.error('Error en el fetch:', error);
      alert('Error de conexión con el servidor');
    }
  };

  const handleGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const res = await googleSignIn(idToken);
      if (res && res.message) {
        alert('Inicio con Google exitoso');
        navigate('/dashboard');
      } else {
        alert('No se pudo iniciar con Google');
      }
    } catch (err) {
      console.error(err);
      alert('Error en Google Sign-In');
    }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden">
      
      

      {/* ── Lado derecho: Formulario de Registro ── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-neutral-bg px-24 py-6">

        <form onSubmit={handleSubmit} className="max-w-sm w-full flex flex-col gap-3">
          
          {/* Encabezado */}
          <div className="mb-1">
            <div className="flex items-center gap-2 mb-2 md:hidden">
              <img src={logoSwes} alt="Logo SWES" className="w-6 h-6 object-contain"/>
              <span className="font-bold text-neutral-text text-lg">SWES EPN</span>
            </div>
            <h2 className="text-2xl font-bold text-neutral-text leading-tight">
              Crear cuenta
            </h2>
            <p className="text-sm text-neutral-muted mt-1">
              Registrate para comenzar tu viaje emprendedor de la EPN.
            </p>
          </div>

          {/* Input: Nombre Completo */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-text">Nombre completo</label>
            <div className="flex items-center border border-neutral-border rounded-input px-3 gap-2 bg-white
                            focus-within:border-brand-primary focus-within:shadow-input transition-all">
              <svg className="w-4 h-4 text-neutral-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <input 
                name="nombre" 
                type="text" 
                placeholder="Nombre completo del estudiante" 
                required 
                className="flex-1 py-2.5 text-sm text-neutral-text placeholder:text-neutral-muted outline-none bg-transparent" 
              />
            </div>
          </div>

          {/* Input: Correo Electrónico */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-text">Correo electrónico</label>
            <div className="flex items-center border border-neutral-border rounded-input px-3 gap-2 bg-white
                            focus-within:border-brand-primary focus-within:shadow-input transition-all">
              <svg className="w-4 h-4 text-neutral-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 6.75L2.25 6.75" />
              </svg>
              <input 
                name="email" 
                type="email" 
                placeholder="usuario@correo.com" 
                required 
                className="flex-1 py-2.5 text-sm text-neutral-text placeholder:text-neutral-muted outline-none bg-transparent" 
              />
            </div>
          </div>

          {/* Input: Contraseña */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-text">Contraseña</label>
            <div className="flex items-center border border-neutral-border rounded-input px-3 gap-2 bg-white
                            focus-within:border-brand-primary focus-within:shadow-input transition-all">
              <svg className="w-4 h-4 text-neutral-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <input 
                name="password" 
                type="password" 
                placeholder="Mínimo 6 caracteres" 
                required 
                minLength={6} 
                className="flex-1 py-2.5 text-sm text-neutral-text placeholder:text-neutral-muted outline-none bg-transparent" 
              />
            </div>
          </div>

          {/* Botón Principal de Registro */}
          <button type="submit"
            className="w-full bg-brand-primary hover:bg-brand-hover text-white font-semibold
                       py-3 rounded-btn text-sm transition-all flex items-center justify-center gap-2 mt-2">
            Registrarse en el Sistema →
          </button>

          {/* Divisor Google */}
          <div className="flex items-center text-xs text-neutral-muted my-1">
            <div className="flex-1 border-t border-neutral-border"></div>
            <span className="px-3 uppercase tracking-wider text-[10px] font-medium">O regístrate con</span>
            <div className="flex-1 border-t border-neutral-border"></div>
          </div>

          {/* Botón Google */}
          <button type="button" onClick={handleGoogle}
            className="w-full border border-neutral-border hover:bg-neutral-50 text-neutral-text font-medium
                       py-2.5 rounded-btn text-sm transition-all flex items-center justify-center gap-2.5 bg-white shadow-sm">
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.94 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.77 2.93c.9-2.69 3.42-4.45 6.84-4.45z"/>
              <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.43h6.44c-.28 1.47-1.11 2.71-2.36 3.55l3.67 2.84c2.15-1.98 3.38-4.89 3.38-8.48z"/>
              <path fill="#FBBC05" d="M5.16 14.51c-.23-.69-.36-1.43-.36-2.2s.13-1.51.36-2.2L1.39 7.56C.5 9.35 0 11.33 0 12.4c0 1.07.5 3.05 1.39 4.84l3.77-2.73z"/>
              <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.67-2.84c-1.1.74-2.51 1.18-4.29 1.18-3.42 0-5.94-1.76-6.84-4.45L1.39 16.91C3.37 20.33 7.35 23 12 23z"/>
            </svg>
            Registrarse con Google
          </button>

          {/* Enlace para volver al Login */}
          <p className="text-center text-sm text-neutral-muted mt-2">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-brand-accent font-semibold hover:opacity-80 transition-opacity">
              Inicia sesión
            </Link>
          </p>

          <p className="text-center text-xs text-neutral-subtle mt-1">© 2026 Escuela Politécnica Nacional</p>
        </form>

      </div>

      {/* ── Panel izquierdo oscuro (Consistente con Login) ── */}
      <div className="hidden md:flex w-1/2 bg-brand-panel flex-col justify-center px-10 py-12 gap-8">
        
        {/* Contenedor superior agrupado en el centro del espacio restante */}
        <div className="flex flex-col gap-8 items-start w-full">
          
          {/* Card SWES */}
          <div className="w-full bg-brand-panel-card border border-brand-panel-border rounded-card px-10 py-8 text-center">
            <h1 className="text-white text-7xl font-bold tracking-tight mb-4">SWES</h1>
            <p className="text-white/50 text-sm font-semibold tracking-widest uppercase leading-relaxed mb-3">
              Plataforma de Gestión<br />de Emprendimientos
            </p>
            <p className="text-brand-accent text-xs font-medium">
              Impulsando la Innovación y el Talento Politécnico
            </p>
          </div>
          
          
        </div>
      </div>

    </div>
  );
};

export default Register;
