import { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Aquí luego conectarás con Firebase o Supabase
    console.log("Intentando iniciar sesión con:", { email, password });
    alert(`Iniciando sesión como: ${email}`);
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2 style={styles.title}>Iniciar Sesión</h2>
        
        <div style={styles.inputGroup}>
          <label>Correo Electrónico:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={styles.input}
            placeholder="ejemplo@epn.edu.ec"
          />
        </div>

        <div style={styles.inputGroup}>
          <label>Contraseña:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={styles.input}
            placeholder="********"
          />
        </div>

        <button type="submit" style={styles.button}>Entrar</button>
      </form>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' },
  form: { padding: '2rem', border: '1px solid #ccc', borderRadius: '8px', background: '#f9f9f9', width: '300px' },
  title: { textAlign: 'center', marginBottom: '1rem', color: '#333' },
  inputGroup: { marginBottom: '1rem' },
  input: { width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ddd' },
  button: { width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

export default Login;