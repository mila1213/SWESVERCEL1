import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, googleSignIn } from '../services/authService';
import { supabase } from '../../supabaseClient';

const Login = () => {
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [verPassword, setVerPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje({ texto: '', tipo: '' });
    const { email, password } = Object.fromEntries(new FormData(e.target));

    if (!email || !password) {
      setMensaje({ texto: 'Ingrese correo y contraseña.', tipo: 'error' });
      return;
    }

    if (!email.toLowerCase().endsWith('@epn.edu.ec')) {
      setMensaje({ texto: 'Solo se permiten correos institucionales @epn.edu.ec. Si eres visitante, usa "Ingresar con Google".', tipo: 'error' });
      return;
    }

    try {
      const data = await loginUser(email, password);
      if (data?.token && data?.uid) {
        localStorage.setItem('uid', data.uid);
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', (data.role || 'visitante').toLowerCase());
        if (data.phone) localStorage.setItem('phone', data.phone);
        localStorage.setItem('email', data.email || email);
        localStorage.setItem('name', data.name || '');

        setMensaje({ texto: '¡Bienvenido!', tipo: 'success' });
        setTimeout(() => navigate('/dashboard'), 800);
      } else {
        setMensaje({ texto: data?.message || 'Error en la respuesta del servidor.', tipo: 'error' });
      }
    } catch (error) {
      console.error('Error en el login:', error);
      const mensajeError = error?.response?.data?.message || error?.message || 'Correo o contraseña incorrectos';
      setMensaje({ texto: mensajeError, tipo: 'error' });
    }
  };

  const handleGoogleLogin = async () => {
    setMensaje({ texto: 'Redirigiendo a Google...', tipo: 'success' });
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/login` },
      });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (err) {
      console.error('Error Google OAuth:', err);
      setMensaje({ texto: err?.message || 'No se pudo iniciar sesión con Google.', tipo: 'error' });
    }
  };

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.access_token) {
        try {
          const accessToken = session.access_token;
          const googleData = await googleSignIn(accessToken);
          if (googleData?.uid) {
            localStorage.setItem('uid', googleData.uid);
            localStorage.setItem('token', accessToken);
            localStorage.setItem('role', (googleData.role || 'visitante').toLowerCase());
            localStorage.setItem('email', googleData.email || '');
            localStorage.setItem('name', googleData.name || '');
            setMensaje({ texto: 'Inicio de sesión con Google exitoso.', tipo: 'success' });
            setTimeout(() => navigate('/dashboard'), 800);
          }
        } catch (err) {
          console.error('Error al finalizar Google login (onAuthStateChange):', err);
          setMensaje({ texto: err?.response?.data?.message || 'Error al completar inicio con Google.', tipo: 'error' });
        }
      }
    });

    return () => {
      // unsubscribe listener on unmount
      try { listener?.subscription?.unsubscribe?.(); } catch {}
      try { if (listener && typeof listener?.unsubscribe === 'function') listener.unsubscribe(); } catch {}
    };
  }, [navigate]);

  return (
    <div className="h-screen w-full flex overflow-hidden">
      <div className="hidden md:flex w-1/2 bg-brand-panel flex-col justify-center px-10 py-12 gap-8">
        <div className="flex flex-col gap-8 items-start w-full">
          <div className="w-full bg-brand-panel-card border border-brand-panel-border rounded-card px-10 py-8 text-center">
            <h1 className="text-white text-7xl font-bold tracking-tight mb-4">SWES</h1>
            <p className="text-white/50 text-sm font-semibold tracking-widest uppercase leading-relaxed mb-3">Plataforma de Gestión<br/>de Emprendimientos</p>
            <p className="text-brand-accent text-xs font-medium">Impulsando la Innovación y el Talento Politécnico</p>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="bg-brand-panel-card border border-brand-panel-border rounded-card p-4">
              <p className="text-white text-sm font-semibold mb-1">Venture Tracker</p>
              <p className="text-white/40 text-xs leading-relaxed">Monitoreo de startups universitarias en tiempo real.</p>
            </div>
            <div className="bg-brand-panel-card border border-brand-panel-border rounded-card p-4">
              <p className="text-white text-sm font-semibold mb-1">Fondeo</p>
              <p className="text-white/40 text-xs leading-relaxed">Gestión eficiente de recursos y capital semilla.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center bg-neutral-bg px-16 py-6">
        <form onSubmit={handleLogin} className="max-w-sm w-full flex flex-col gap-3">
          <div className="mb-1">
            <h2 className="text-2xl font-bold text-neutral-text leading-tight">Sistema de Emprendimientos<br/>Estudiantiles EPN</h2>
            <p className="text-sm text-neutral-muted mt-1">Bienvenido de vuelta. Por favor ingrese sus credenciales.</p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-text">Correo electrónico</label>
            <div className="flex items-center border border-neutral-border rounded-input px-3 gap-2 bg-white focus-within:border-brand-primary focus-within:shadow-input transition-all">
              <input name="email" type="email" placeholder="usuario@epn.edu.ec" required className="flex-1 py-2.5 text-sm text-neutral-text placeholder:text-neutral-muted outline-none bg-transparent" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-neutral-text">Contraseña</label>
              <Link to="/forgot-password" className="text-xs text-neutral-muted hover:text-brand-primary transition-colors">¿Olvidó su contraseña?</Link>
            </div>
            <div className="flex items-center border border-neutral-border rounded-input px-3 gap-2 bg-white focus-within:border-brand-primary focus-within:shadow-input transition-all">
              <input name="password" type={verPassword ? 'text' : 'password'} placeholder="••••••••" required className="flex-1 py-2.5 text-sm text-neutral-text placeholder:text-neutral-muted outline-none bg-transparent" />
              <button type="button" onClick={() => setVerPassword(!verPassword)} className="text-neutral-muted hover:text-neutral-text transition-colors focus:outline-none shrink-0">
                {verPassword ? 'Ocultar' : 'Ver'}
              </button>
            </div>
          </div>

          {mensaje.texto && (
            <div className={`text-sm px-4 py-3 rounded-xl text-center font-medium ${mensaje.tipo === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
              {mensaje.texto}
            </div>
          )}

          <button type="submit" className="w-full bg-brand-primary hover:bg-brand-hover text-white font-semibold py-3 rounded-btn text-sm transition-all">Ingresar al Sistema →</button>

          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-neutral-border" />
            <span className="text-xs text-neutral-muted">o</span>
            <div className="flex-1 h-px bg-neutral-border" />
          </div>

          <button type="button" onClick={handleGoogleLogin} className="w-full border border-neutral-border bg-white hover:bg-gray-50 py-3 rounded-btn font-medium flex items-center justify-center gap-3 transition text-sm text-neutral-text">Ingresar con Google</button>

          <p className="text-center text-sm text-neutral-muted">¿No tienes una cuenta? <Link to="/register" className="text-brand-accent font-semibold">Registrarse</Link></p>
          <p className="text-center text-xs text-neutral-subtle">© 2026 Escuela Politécnica Nacional</p>
        </form>
      </div>
    </div>
  );
};

export default Login;
