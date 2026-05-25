import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { auth } from '../../firebase';

import {
  updateProfile,
  updateEmail,
  onAuthStateChanged
} from 'firebase/auth';

function Profile() {

  const navigate = useNavigate();

  // =========================
  // ESTADOS
  // =========================

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const [loading, setLoading] = useState(false);

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // =========================
  // CARGAR DATOS DEL USUARIO
  // =========================

 useEffect(() => {

  const unsubscribe =
    onAuthStateChanged(auth, (user) => {

      if (!user) {

        navigate('/login');
        return;
      }

      setUsername(
        user.displayName || 'Usuario'
      );

      setEmail(
        user.email || ''
      );
    });

  return () => unsubscribe();

}, [navigate]);

  // =========================
  // ACTUALIZAR PERFIL
  // =========================

  const handleUpdateProfile = async (e) => {

    e.preventDefault();

    setLoading(true);

    setSuccessMessage('');
    setErrorMessage('');

    try {

      const user = auth.currentUser;

      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      // =====================
      // ACTUALIZAR NOMBRE
      // =====================

      await updateProfile(user, {
        displayName: username
      });

      // =====================
      // ACTUALIZAR EMAIL
      // =====================

      if (email !== user.email) {

        await updateEmail(
          user,
          email
        );
      }

      // =====================
      // MENSAJE ÉXITO
      // =====================

      setSuccessMessage(
        'Perfil actualizado correctamente'
      );

      setTimeout(() => {

        setSuccessMessage('');

      }, 3000);

    } catch (error) {

      console.error(error);

      const errores = {

        'auth/email-already-in-use':
          'Ese correo ya está en uso.',

        'auth/invalid-email':
          'Correo inválido.',

        'auth/requires-recent-login':
          'Debes volver a iniciar sesión para cambiar el correo.'
      };

      setErrorMessage(
        errores[error.code] ||
        'Error al actualizar perfil'
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="max-w-2xl mx-auto my-12 p-10 bg-white rounded-2xl border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] text-gray-800">

      {/* HEADER */}

      <div className="flex items-center gap-5 pb-6 border-b border-gray-100 mb-8">

        <div className="w-14 h-14 rounded-full bg-[#00665c] text-white flex items-center justify-center text-xl font-bold shrink-0 select-none">

          {username.charAt(0).toUpperCase()}

        </div>

        <div>

          <h2 className="text-xl font-bold text-gray-950 tracking-tight">
            Mi Perfil
          </h2>

          <p className="text-gray-400 text-xs font-medium">
            Gestiona y actualiza tus datos personales.
          </p>

        </div>

      </div>

      {/* ALERTA ÉXITO */}

      {successMessage && (

        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-semibold flex items-center gap-2">

          ✅ {successMessage}

        </div>
      )}

      {/* ALERTA ERROR */}

      {errorMessage && (

        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm font-semibold flex items-center gap-2">

          ⚠️ {errorMessage}

        </div>
      )}

      {/* FORM */}

      <form
        onSubmit={handleUpdateProfile}
        className="flex flex-col gap-6"
      >

        {/* DATOS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* NOMBRE */}

          <div className="flex flex-col gap-1.5">

            <label className="font-semibold text-xs text-gray-400 uppercase tracking-wider">

              Nombre

            </label>

            <input
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white font-medium transition-all outline-none focus:border-[#00665c] focus:ring-4 focus:ring-[#00665c]/10"
            />

          </div>

          {/* INSTITUCIÓN */}

          <div className="flex flex-col gap-1.5">

            <label className="font-semibold text-xs text-gray-400 uppercase tracking-wider">

              Institución Asociada

            </label>

            <div className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 text-[#00665c] font-bold flex items-center gap-2 select-none">

              <span className="w-2 h-2 rounded-full bg-[#00665c] animate-pulse" />

              Escuela Politécnica Nacional

            </div>

          </div>

          {/* EMAIL */}

          <div className="flex flex-col gap-1.5 sm:col-span-2">

            <label className="font-semibold text-xs text-gray-400 uppercase tracking-wider">

              Correo Electrónico

            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
              placeholder="usuario@epn.edu.ec"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white font-medium transition-all outline-none focus:border-[#00665c] focus:ring-4 focus:ring-[#00665c]/10"
            />

          </div>

        </div>

        {/* SEPARADOR */}

        <div className="h-px bg-gray-100 my-2" />

        {/* BOTONES */}

        <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4">

          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto px-5 py-2.5 border border-gray-200 text-gray-500 text-xs font-bold rounded-xl hover:bg-gray-50 transition-all uppercase tracking-wider"
          >

            Volver al Tablero

          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#00665c] hover:bg-[#004d45] text-white text-xs font-bold rounded-xl shadow-xs transition-all uppercase tracking-wider disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >

            {loading
              ? 'Guardando...'
              : 'Actualizar Perfil'}

          </button>

        </div>

      </form>

    </div>
  );
}

export default Profile;