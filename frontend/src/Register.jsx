import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom'; 

const Register = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      alert("Usuario registrado exitosamente");

      try {
        await setDoc(doc(db, 'usuarios', user.uid), {
          nombre: nombre,
          email: email
        });

        alert("Registrado exitosamente");

      } catch (firestoreError) {
        console.error("Error Firestore:", firestoreError);
        alert("Usuario creado, pero error al guardar en Firestore");
      }

      setNombre('');
      setEmail('');
      setPassword('');

    } catch (authError) {
      console.error("Error Auth:", authError);

      if (authError.code === 'auth/email-already-in-use') {
        alert("El correo ya está registrado");
      } else {
        alert("Error: " + authError.message);
      }
    }
  };

  return (
    <div>
      <h2>Registro</h2>

      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        <br /><br />
        <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <br /><br />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required/>
        <br /><br />
        <button type="submit">
          Registrarse
        </button>
      </form>
      <p>
        ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
      </p>
    </div>
  );
};

export default Register;