import React, { useState } from 'react';
import { auth } from '../../firebase'; 
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("¡Bienvenido!");
      navigate('/inventory'); 

    } catch (err) {
      if (
        err.code === 'auth/user-not-found' || 
        err.code === 'auth/wrong-password' || 
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/invalid-email'
      ) {
        setError("Correo o contraseña incorrectos.");
      } else {
        setError("Error al intentar iniciar sesión.");
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <h2>Iniciar Sesión</h2>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div>
          <label>Correo Electrónico</label>
          <input 
            type="email" 
            placeholder="ejemplo@correo.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <br />

        <div>
          <label>Contraseña</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <br />

        <button type="submit">Entrar</button>
      </form>

      <div>
        <p>
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;