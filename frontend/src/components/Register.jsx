import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { registerUser } from '../services/authService';
import icono from '../assets/icono_sistema.png';
import imgLogin from '../assets/imagen_login.jpeg';
import { User, Mail, Lock, Phone, Eye, EyeOff, ChevronDown } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [role, setRole] = useState('visitante');
  const [verPassword, setVerPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ texto: '', tipo: '' });

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    const normalizedEmail = data.email?.toLowerCase().trim();

    if (!normalizedEmail?.endsWith('@epn.edu.ec')) {
      setMensaje({
        texto: 'Solo se permiten correos institucionales @epn.edu.ec. Si eres visitante, usa "Registrarse con Google".',
        tipo: 'error'
      });
      return;
    }

    if (role === 'emprendedor') {
      const phoneClean = data.phone?.trim();

      if (!phoneClean) {
        setMensaje({ texto: 'El número de celular es obligatorio.', tipo: 'error' });
        return;
      }

      const phoneRegex = /^0\d{9}$/;
      if (!phoneRegex.test(phoneClean)) {
        setMensaje({
          texto: 'El número de celular debe tener exactamente 10 dígitos y empezar con 0 (Ej: 09XXXXXXXX).',
          tipo: 'error'
        });
        return;
      }
    }

    try {
      const result = await registerUser({
        nombre: data.nombre,
        email: normalizedEmail,
        password: data.password,
        role: role,
        phone: data.phone || '',
      });

      setMensaje({ texto: result.message || '¡Registro exitoso!', tipo: 'success' });
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || error.response?.data?.mensaje || 'Error de conexión con el servidor.';
      setMensaje({ texto: message, tipo: 'error' });
    }
  };

  // GOOGLE
  const handleGoogle = () => {
    setMensaje({ texto: 'Redirigiendo a Google...', tipo: 'success' });
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/login`,
      },
    }).then(({ error, data }) => {
      if (error) {
        console.error('Error Google OAuth Register:', error);
        setMensaje({ texto: error.message || 'No se pudo iniciar sesión con Google.', tipo: 'error' });
      } else if (data?.url) {
        window.location.href = data.url;
      } else {
        setMensaje({ texto: 'No se pudo redirigir a Google. Revisa la configuración de OAuth en Supabase.', tipo: 'error' });
      }
    });
  };

  return (
    <div className="h-screen w-full flex overflow-hidden">
      {/* Panel izquierdo: formulario */}
      <div className="flex-1 flex flex-col items-center bg-white px-8 md:px-16 py-12 overflow-y-auto">
        <div className="max-w-sm w-full mx-auto flex flex-col gap-3">

          <div className="mb-1">
            <h2 className="text-2xl font-bold text-neutral-text leading-tight">Crea tu cuenta</h2>
            <p className="text-sm text-neutral-muted mt-1">Únete a la plataforma de emprendimientos de la EPN.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-neutral-text">Tipo de usuario</label>
              <div className="relative flex items-center border border-neutral-border rounded-input px-3 gap-2 bg-white focus-within:border-brand-primary focus-within:shadow-input transition-all">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-3 pr-10 py-2.5 text-sm text-neutral-text outline-none bg-transparent appearance-none cursor-pointer z-10"
                >
                  <option value="visitante">Visitante</option>
                  <option value="emprendedor">Emprendedor</option>
                </select>
                <div className="absolute right-3 pointer-events-none z-0">
                  <ChevronDown className="w-4 h-4 text-neutral-muted" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-neutral-text">Nombre completo</label>
              <div className="flex items-center border border-neutral-border rounded-input px-3 gap-2 bg-white focus-within:border-brand-primary focus-within:shadow-input transition-all">
                <User className="w-4 h-4 text-neutral-muted shrink-0" />
                <input name="nombre" type="text" placeholder="Ingresa tu nombre" required className="flex-1 py-2.5 text-sm text-neutral-text placeholder:text-neutral-muted outline-none bg-transparent" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-neutral-text">Correo institucional</label>
              <div className="flex items-center border border-neutral-border rounded-input px-3 gap-2 bg-white focus-within:border-brand-primary focus-within:shadow-input transition-all">
                <Mail className="w-4 h-4 text-neutral-muted shrink-0" />
                <input name="email" type="email" placeholder="usuario@epn.edu.ec" required className="flex-1 py-2.5 text-sm text-neutral-text placeholder:text-neutral-muted outline-none bg-transparent" />
              </div>
            </div>

            {role === 'emprendedor' && (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-neutral-text">Número celular</label>
                <div className="flex items-center border border-neutral-border rounded-input px-3 gap-2 bg-white focus-within:border-brand-primary focus-within:shadow-input transition-all">
                  <Phone className="w-4 h-4 text-neutral-muted shrink-0" />
                  <input name="phone" type="tel" maxLength={10} placeholder="09XXXXXXXX" required className="flex-1 py-2.5 text-sm text-neutral-text placeholder:text-neutral-muted outline-none bg-transparent" />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-neutral-text">Contraseña</label>
              <div className="flex items-center border border-neutral-border rounded-input px-3 gap-2 bg-white focus-within:border-brand-primary focus-within:shadow-input transition-all">
                <Lock className="w-4 h-4 text-neutral-muted shrink-0" />
                <input name="password" type={verPassword ? 'text' : 'password'} placeholder="Mínimo 6 caracteres" minLength={6} required className="flex-1 py-2.5 text-sm text-neutral-text placeholder:text-neutral-muted outline-none bg-transparent" />
                <button
                  type="button"
                  onClick={() => setVerPassword(!verPassword)}
                  aria-label={verPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="text-neutral-muted hover:text-neutral-text transition-colors focus:outline-none shrink-0"
                >
                  {verPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mensaje.texto && (
              <div className={`text-sm px-4 py-3 rounded-xl text-center font-medium ${mensaje.tipo === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-blue-50 text-blue-600 border border-blue-200'}`}>
                {mensaje.texto}
              </div>
            )}

            <button type="submit" className="w-full bg-brand-primary hover:bg-brand-hover text-white font-semibold py-3 rounded-btn text-sm transition-all">Registrarse</button>

            {role === 'visitante' && (
              <>
                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-px bg-neutral-border" />
                  <span className="text-xs text-neutral-muted whitespace-nowrap">O regístrate con</span>
                  <div className="flex-1 h-px bg-neutral-border" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogle}
                  className="w-full border border-neutral-border bg-white hover:bg-gray-50 py-2.5 rounded-btn font-medium flex items-center justify-center gap-2 transition text-sm text-neutral-text"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.54-5.17 3.54-8.66z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3a7.4 7.4 0 0 1-11-3.9H1.07v3.09A12 12 0 0 0 12 24z"/>
                    <path fill="#FBBC05" d="M5.05 14.19a7.2 7.2 0 0 1 0-4.38V6.72H1.07a12 12 0 0 0 0 10.56z"/>
                    <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.59 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.07 6.72l3.98 3.09A7.16 7.16 0 0 1 12 4.77z"/>
                  </svg>
                  Google
                </button>
              </>
            )}

            <p className="text-center text-xs text-neutral-muted">
              {role === 'emprendedor'
                ? 'Los emprendedores deben ingresar su número celular.'
                : 'Los visitantes pueden registrarse con correo institucional o Google.'}
            </p>
          </form>

          <p className="text-center text-sm text-neutral-muted">¿Ya tienes una cuenta? <Link to="/login" className="text-brand-accent font-semibold">Inicia sesión</Link></p>
          <p className="text-center text-xs text-neutral-subtle">© 2026 Escuela Politécnica Nacional</p>
        </div>
      </div>

      {/* Panel derecho: imagen */}
      <div className="hidden md:block w-1/2 relative bg-brand-panel">
        <img src={imgLogin} alt="SWES" className="absolute inset-0 w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default Register;