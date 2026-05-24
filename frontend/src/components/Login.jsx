import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { googleSignIn } from '../services/authService';
import logoSwes from '../assets/icono_sistema.png';
const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = Object.fromEntries(new FormData(e.target));

    try {
      const res = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        alert("Bienvenido!");
        navigate('/dashboard'); 
      } else {
        alert("Credenciales incorrectas");
      }
    } catch {
      alert("Error de conexión");
    }
  };

  const handleGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const res = await googleSignIn(idToken);
      if (res && (res.message || res.mensaje)) {
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
    
    <div className='min-h-screen bg-[oklch(28.2%_0.091_267.935)] flex items-center justify-center p-4'>
      <div className='bg-white w-full max-w-md p-8 shadow-2xl rounded-3xl'>
        <div className="flex items-center justify-center mb-4 select-none">
          <img src={logoSwes} alt="Logo SWES" className="w-10 h-10 mr-4 object-contain"/>
          <h1 className="text-3xl tracking-normal font-sans">
          <span className=" font-bold text-[oklch(28.2%_0.091_267.935)]">SWES</span>
          <span className="font-bold text-[oklch(82.8%_0.189_84.429)] ml-2">EPN</span>
          </h1>
        </div>
        <h2 className='font-bold text-center text-gray-800 mb-8 text-[30px]'>Iniciar Sesión</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-7">
        <input 
        name="email" 
        type="email" 
        placeholder="Correo electrónico" 
        required
        className="w-full p-3 border border-gray-300 rounded-xl outline-none transition-all
             focus:ring-2 
             focus:ring-[oklch(90.5%_0.182_98.111)] 
             focus:border-[oklch(90.5%_0.182_98.111)] text-[19px]"
        />
        <input 
        name="password" 
        type="password" 
        placeholder="Contraseña" 
        required 
        className="w-full p-3 border border-gray-300 rounded-xl outline-none transition-all
             focus:ring-2 
             focus:ring-[oklch(90.5%_0.182_98.111)] 
             focus:border-[oklch(90.5%_0.182_98.111)] text-[19px]"
        />

        <button 
        type="submit"
        className="w-full bg-[oklch(82.8%_0.189_84.429)] hover:brightness-110 hover:shadow-lg text-gray-900 font-bold py-3 text-[21px] rounded-full transition-all shadow-md mt-2"
        >Entrar
        </button>
        <button type="button" onClick={handleGoogle} className="w-full bg-white border border-gray-300 text-gray-800 font-medium py-3 rounded-xl mt-2">Entrar con Google</button>
        
      </form>
      <p className="mt-6 text-center text-gray-600 text-sm text-[19px]"><Link to="/forgot-password" className='text-gray-600 hover:underline'>Recuperar contraseña</Link></p>
      <p className="mt-4 text-center text-gray-600 text-sm text-[19px]">¿No tienes cuenta? <Link to="/register" className='text-[oklch(28.2%_0.091_267.935)] hover:underline font-bold transition-all text-[19px]'>Regístrate</Link></p>

      </div>

    </div>
  );
};

export default Login;
