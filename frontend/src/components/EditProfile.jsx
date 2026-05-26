import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { updatePassword, updateProfile } from 'firebase/auth';

function EditProfile() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUsername(user.displayName || '');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (newPassword && newPassword !== confirmPassword) {
      setMessage('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Usuario no autenticado');

      if (username.trim()) {
        await updateProfile(user, { displayName: username.trim() });
      }

      if (newPassword) {
        await updatePassword(user, newPassword);
      }

      setMessage('Información actualizada correctamente.');
    } catch (error) {
      const errors = {
        'auth/requires-recent-login':
          'Debes iniciar sesión de nuevo para cambiar la contraseña.',
        'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
      };
      setMessage(errors[error.code] || 'Error al guardar los cambios.');
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

      {message && (
        <div className="mb-6 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700">
          {message}
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
