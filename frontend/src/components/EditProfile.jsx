import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../services/authService';

function EditProfile() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // ESTADO PARA ALERTAS INTUITIVAS
  const [alerta, setAlerta] = useState({ mostrar: false, texto: '', tipo: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUsername(localStorage.getItem('name') || localStorage.getItem('email') || '');
    }
  }, []);

  // Función interna para disparar la alerta dinámica
  const dispararAlerta = (texto, tipo = 'success') => {
    setAlerta({ mostrar: true, texto, tipo });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlerta({ mostrar: false, texto: '', tipo: '' });

    if (newPassword && newPassword !== confirmPassword) {
      dispararAlerta('Las contraseñas no coinciden. Por favor, verifícalas.', 'error');
      return;
    }

    setLoading(true);

    try {
      const userId = localStorage.getItem('uid');
      if (!userId) throw new Error('Usuario no autenticado');

      const payload = { nombre: username.trim() };
      if (newPassword) {
        // Password changes should be handled via the forgot/reset flow.
        throw new Error('Para cambiar la contraseña, usa la opción de restablecimiento en Configuración.');
      }

      await updateUser(userId, payload);
      localStorage.setItem('name', username.trim());
      dispararAlerta('¡Tus cambios se han guardado con éxito!', 'success');
      
      // Limpieza de los campos de contraseña después de un cambio exitoso
      setNewPassword('');
      setConfirmPassword('');

      // Redirección para que el usuario aprecie el mensaje de éxito
      setTimeout(() => {
        navigate('/profile');
      }, 1500);

    } catch (error) {
      console.error(error);
      dispararAlerta(error.message || 'Ocurrió un inconveniente al intentar guardar los cambios.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-12 rounded-3xl bg-white px-8 py-10 shadow-xl shadow-slate-200">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-slate-900">Editar perfil</h2>
        <p className="mt-2 text-sm text-slate-500">
          Cambia tu nombre o contraseña; el correo se mantiene fijo.
        </p>
      </div>

      {/* ALERTAS INTUITIVAS*/}
      {alerta.mostrar && (
        <div
          className={`mb-6 border-l-4 p-4 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-3 ${
            alerta.tipo === 'error'
              ? 'bg-red-50 border-red-500 text-red-700'
              : 'bg-green-50 border-green-500 text-green-700'
          }`}
        >
          <span className="text-base">{alerta.tipo === 'error' ? '⚠️' : '✅'}</span>
          <p>{alerta.texto}</p>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-600">Nombre completo</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#00665c] focus:ring-2 focus:ring-[#00665c]/10"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-600">Nueva contraseña</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Dejar vacío para mantener la misma"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#00665c] focus:ring-2 focus:ring-[#00665c]/10"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-600">Confirmar contraseña</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repite la contraseña"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#00665c] focus:ring-2 focus:ring-[#00665c]/10"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="w-full rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:w-auto"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#00665c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#004d45] disabled:bg-slate-300 sm:w-auto"
          >
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;