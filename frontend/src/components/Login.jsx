import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import {
  signInWithEmailAndPassword
} from "firebase/auth";
import logoSwes from '../assets/icono_sistema.png';

const Login = () => {
  const navigate = useNavigate();

const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = Object.fromEntries(new FormData(e.target));

    try {
      // LOGIN FIREBASE
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
      const res = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // LEEMOS LA RESPUESTA UNA SOLA VEZ
      const data = await res.json();
      console.log("DEBUG - Datos recibidos del servidor:", data);

      if (res.ok) {
        if (data.uid) {
          localStorage.setItem('uid', data.uid); 
          localStorage.setItem('token', data.token);
          localStorage.setItem('role', data.role || 'visitante');
          if (data.phone) localStorage.setItem('phone', data.phone);
          localStorage.setItem('email', data.email);
          localStorage.setItem('name', data.name || '');

          alert("Bienvenido!");
          navigate('/dashboard'); 
        } else {
          console.error("DEBUG - El servidor no devolvió UID");
          alert("Error: El servidor no envió el ID de usuario.");
        }
      } else {
        alert(data.mensaje || "Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error en el login:", error);
      alert("Error de conexión con el servidor");
    }
};

  return (
  
  <div className="h-screen w-full flex overflow-hidden">
    
    {/* ── Panel izquierdo oscuro ── */}
    
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
      
      {/* Cards de features (Venture Tracker y Fondeo) */}
      
      <div className="grid grid-cols-2 gap-4 w-full">
        
        {/* Venture Tracker */}
        
        <div className="bg-brand-panel-card border border-brand-panel-border rounded-card p-4">
          
          <div className="text-brand-accent mb-2">
            
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          
          </div>
          
          <p className="text-white text-sm font-semibold mb-1">Venture Tracker</p>
          <p className="text-white/40 text-xs leading-relaxed">
          Monitoreo de startups universitarias en tiempo real.
          </p>
      </div>

      {/* Fondeo */}
      <div className="bg-brand-panel-card border border-brand-panel-border rounded-card p-4">
        <div className="text-brand-accent mb-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75" />
          </svg>
        </div>
        <p className="text-white text-sm font-semibold mb-1">Fondeo</p>
        <p className="text-white/40 text-xs leading-relaxed">
          Gestión eficiente de recursos y capital semilla.
        </p>
      </div>

    </div>
  </div>


</div>

  
    {/* ── Lado derecho: formulario ── */}
<div className="flex-1 flex flex-col items-center justify-center bg-neutral-bg px-16 py-6">

  {/* Cambiamos el <div> contenedor por un <form> y le asignamos el onSubmit */}
  <form onSubmit={handleLogin} className="max-w-sm w-full flex flex-col gap-3">
    
    {/* Encabezado */}
    <div className="mb-1">
      <h2 className="text-2xl font-bold text-neutral-text leading-tight">
        Sistema de Emprendimientos<br />Estudiantiles EPN
      </h2>
      <p className="text-sm text-neutral-muted mt-1">
        Bienvenido de vuelta. Por favor ingrese sus credenciales.
      </p>
    </div>

    {/* Correo */}
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-neutral-text">Correo electrónico</label>
      <div className="flex items-center border border-neutral-border rounded-input px-3 gap-2 bg-white focus-within:border-brand-primary focus-within:shadow-input transition-all">
        <svg className="w-4 h-4 text-neutral-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 6.75L2.25 6.75" />
        </svg>
        <input 
          name="email" 
          type="email" 
          placeholder="usuario@epn.edu.ec" 
          required
          className="flex-1 py-2.5 text-sm text-neutral-text placeholder:text-neutral-muted outline-none bg-transparent" 
        />
      </div>
    </div>

    {/* Contraseña */}
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-neutral-text">Contraseña</label>
        <Link to="/forgot-password" className="text-xs text-neutral-muted hover:text-brand-primary transition-colors">
          ¿Olvidó su contraseña?
        </Link>
      </div>
      <div className="flex items-center border border-neutral-border rounded-input px-3 gap-2 bg-white focus-within:border-brand-primary focus-within:shadow-input transition-all">
        <svg className="w-4 h-4 text-neutral-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
        <input name="password" type="password" placeholder="••••••••" required
          className="flex-1 py-2.5 text-sm text-neutral-text placeholder:text-neutral-muted outline-none bg-transparent" />
      </div>
    </div>

    {/* Checkbox */}
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <input type="checkbox" className="w-4 h-4 rounded border-neutral-border accent-brand-primary cursor-pointer" />
      <span className="text-sm text-neutral-subtle">Recordar mi sesión en este equipo</span>
    </label>

    {/* Botón principal (Le quitamos el onClick ya que el <form onSubmit> se encarga) */}
    <button type="submit"
      className="w-full bg-brand-primary hover:bg-brand-hover text-white font-semibold py-3 rounded-btn text-sm transition-all flex items-center justify-center gap-2">
      Ingresar al Sistema →
    </button>

    {/* Registrarse + footer */}
    <p className="text-center text-sm text-neutral-muted">
      ¿No tienes una cuenta?{' '}
      <Link to="/register" className="text-brand-accent font-semibold hover:opacity-80 transition-opacity">
        Registrarse
      </Link>
    </p>

    <p className="text-center text-xs text-neutral-subtle">© 2026 Escuela Politécnica Nacional</p>
  </form> 

</div>

  </div>
);
  
};


export default Login;