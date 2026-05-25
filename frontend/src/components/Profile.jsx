import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { auth } from '../../firebase';

function Profile() {

  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {

    const user = auth.currentUser;

    if (user) {

      setUsername(user.displayName || 'Usuario');
      setEmail(user.email || '');
    }

  }, []);

  return (

    <div className="max-w-2xl mx-auto my-12 p-10 bg-white rounded-2xl border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] text-gray-800">

      {/* HEADER */}

      <div className="flex items-center gap-5 pb-6 border-b border-gray-100 mb-8">

        <div className="w-14 h-14 rounded-full bg-[#00665c] text-white flex items-center justify-center text-xl font-bold">

          {username?.charAt(0)?.toUpperCase()}

        </div>

        <div>

          <h2 className="text-xl font-bold text-gray-950">
            Mi Perfil
          </h2>

          <p className="text-gray-400 text-xs font-medium">
            Información personal de la cuenta
          </p>

        </div>

      </div>

      {/* DATOS */}

      <div className="flex flex-col gap-6">

        {/* NOMBRE */}

        <div>

          <p className="text-xs uppercase text-gray-400 font-bold mb-2">
            Nombre
          </p>

          <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-medium">

            {username}

          </div>

        </div>

        {/* EMAIL */}

        <div>

          <p className="text-xs uppercase text-gray-400 font-bold mb-2">
            Correo Electrónico
          </p>

          <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-medium">

            {email}

          </div>

        </div>

        {/* INSTITUCIÓN */}

        <div>

          <p className="text-xs uppercase text-gray-400 font-bold mb-2">
            Institución Asociada
          </p>

          <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold text-[#00665c]">

            Escuela Politécnica Nacional

          </div>

        </div>

      </div>

      {/* BOTONES */}

      <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mt-10">

        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="w-full sm:w-auto px-5 py-2.5 border border-gray-200 text-gray-500 text-xs font-bold rounded-xl hover:bg-gray-50 transition-all uppercase tracking-wider"
        >
          Volver al Tablero
        </button>

        <button
          type="button"
          onClick={() => navigate('/profile/edit')}
          className="w-full sm:w-auto px-6 py-2.5 bg-[#00665c] hover:bg-[#004d45] text-white text-xs font-bold rounded-xl transition-all uppercase tracking-wider"
        >
          Editar Perfil
        </button>

      </div>

    </div>
  );
}

export default Profile;