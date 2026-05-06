import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
        navigate('/'); 
      } else {
        alert("Credenciales incorrectas");
      }
    } catch {
      alert("Error de conexión");
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
        
      </form>
      <p className="mt-8 text-center text-gray-600 text-sm text-[19px]">¿No tienes cuenta? <Link to="/register" className='text-[oklch(28.2%_0.091_267.935)] hover:underline font-bold transition-all text-[19px]'>Regístrate</Link></p>

      </div>

    </div>
  );
};

export default Login;