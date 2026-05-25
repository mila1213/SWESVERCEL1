import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { auth } from '../../firebase';

import {
  updateProfile,
  verifyBeforeUpdateEmail
} from 'firebase/auth';


function EditProfile() {

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
  // CARGAR DATOS
  // =========================

  useEffect(() => {

    const user = auth.currentUser;

    if (user) {

      setUsername(user.displayName || '');
      setEmail(user.email || '');
    }

  }, []);

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

        throw new Error(
          'Usuario no autenticado'
        );
      }

      // ACTUALIZAR NOMBRE

      // ACTUALIZAR NOMBRE

await updateProfile(user, {
  displayName: username
});

// CAMBIAR EMAIL

if (email !== user.email) {

  await verifyBeforeUpdateEmail(
    user,
    email
  );

  setSuccessMessage(
    'Revisa tu correo actual para confirmar el cambio de email.'
  );

} else {

  setSuccessMessage(
    'Perfil actualizado correctamente.'
  );
}


    } catch (error) {

      console.error(error);

      const errores = {
        'auth/email-already-in-use':'Ese correo ya está en uso.',
        'auth/invalid-email':'Correo inválido.',
        'auth/requires-recent-login':'Debes volver a iniciar sesión para cambiar el correo.',
        'auth/operation-not-allowed':'Debes verificar el nuevo correo antes de usarlo.'
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

      <div className="mb-8">

        <h2 className="text-2xl font-bold text-gray-950">
          Editar Perfil
        </h2>

        <p className="text-sm text-gray-400 mt-1">
          Actualiza tu información personal.
        </p>

      </div>

      {/* ALERTA ÉXITO */}

      {successMessage && (

        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-semibold">

          ✅ {successMessage}

        </div>
      )}

      {/* ALERTA ERROR */}

      {errorMessage && (

        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm font-semibold">

          ⚠️ {errorMessage}

        </div>
      )}

      {/* FORM */}

      <form
        onSubmit={handleUpdateProfile}
        className="flex flex-col gap-6"
      >

        {/* NOMBRE */}

        <div className="flex flex-col gap-2">

          <label className="text-xs uppercase tracking-wider font-bold text-gray-400">

            Nombre
          </label>

          <input
            type="text"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#00665c] focus:ring-4 focus:ring-[#00665c]/10"
          />

        </div>

        {/* EMAIL */}

        <div className="flex flex-col gap-2">

          <label className="text-xs uppercase tracking-wider font-bold text-gray-400">

            Correo Electrónico
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#00665c] focus:ring-4 focus:ring-[#00665c]/10"
          />

        </div>

        {/* BOTONES */}

        <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-4">

          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="w-full sm:w-auto px-5 py-3 border border-gray-200 text-gray-500 text-xs font-bold rounded-xl hover:bg-gray-50 transition-all uppercase tracking-wider"
          >

            Cancelar

          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 bg-[#00665c] hover:bg-[#004d45] text-white text-xs font-bold rounded-xl transition-all uppercase tracking-wider disabled:bg-gray-100 disabled:text-gray-400"
          >

            {loading
              ? 'Guardando...'
              : 'Guardar Cambios'}

          </button>

        </div>

      </form>

    </div>
  );
}

export default EditProfile;