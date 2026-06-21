import { useEffect, useState } from 'react';
import { getAll, updateResource, deleteResource } from '../services/crudService';
import { AlertTriangle, CheckCircle2, Trash2 } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ mostrar: false, texto: '', tipo: '' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalEliminar, setModalEliminar] = useState({ abierto: false, usuarioId: null });

  const mostrarToast = (texto, tipo = 'success') => {
    setToast({ mostrar: true, texto, tipo });
    setTimeout(() => setToast({ mostrar: false, texto: '', tipo: '' }), 3000);
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getAll('users');
      setUsers(data || []);
    } catch (err) {
      console.error(err);
      mostrarToast('Error cargando usuarios', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleEditClick = (user) => {
    setSelectedUser({ ...user });
  };

  const handleDeleteClick = (userId) => {
    setModalEliminar({ abierto: true, usuarioId: userId });
  };

  const handleConfirmDelete = async () => {
    const id = modalEliminar.usuarioId;
    setModalEliminar({ abierto: false, usuarioId: null });
    try {
      await deleteResource('users', id);
      mostrarToast('Usuario eliminado correctamente', 'success');
      await loadUsers();
    } catch (err) {
      console.error(err);
      mostrarToast('No se pudo eliminar el usuario', 'error');
    }
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;
    const updates = {
      nombre: selectedUser.nombre,
      role: selectedUser.role,
      phone: selectedUser.phone,
    };

    try {
      await updateResource('users', selectedUser.id, updates);
      mostrarToast('Usuario actualizado correctamente', 'success');
      setSelectedUser(null);
      await loadUsers();
    } catch (err) {
      console.error(err);
      mostrarToast('No se pudo actualizar el usuario', 'error');
    }
  };

  if (loading) return <div className="p-6">Cargando usuarios...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {toast.mostrar && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border transition-all duration-300 ${toast.tipo === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
          {toast.tipo === 'error' ? <AlertTriangle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
          <p className="text-sm font-semibold">{toast.texto}</p>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">Usuarios</h2>

      {/* TARJETAS - Mobile y tablet */}
      <div className="md:hidden flex flex-col gap-3">
        {users.map((u) => (
          <div key={u.id} className="bg-white rounded-xl border shadow-sm p-4 flex flex-col gap-3">
            <p className="text-sm font-semibold text-gray-900 break-all">{u.email}</p>

            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
              <p><span className="text-gray-400">Nombre:</span> <span className="text-gray-700">{u.nombre || '-'}</span></p>
              <p><span className="text-gray-400">Rol:</span> <span className="text-gray-700">{u.role || '-'}</span></p>
              <p className="col-span-2"><span className="text-gray-400">Teléfono:</span> <span className="text-gray-700">{u.phone || '-'}</span></p>
            </div>

            <div className="flex gap-2 mt-1">
              <button
                onClick={() => handleEditClick(u)}
                className="flex-1 px-3 py-2 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition"
              >
                Editar
              </button>
              <button
                onClick={() => handleDeleteClick(u.id)}
                className="flex-1 px-3 py-2 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* TABLA - Desktop */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full min-w-[640px] table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left text-xs text-gray-500">Email</th>
              <th className="p-3 text-left text-xs text-gray-500">Nombre</th>
              <th className="p-3 text-left text-xs text-gray-500">Rol</th>
              <th className="p-3 text-left text-xs text-gray-500">Teléfono</th>
              <th className="p-3 text-left text-xs text-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t hover:bg-gray-50 transition-colors">
                <td className="p-3 text-sm">{u.email}</td>
                <td className="p-3 text-sm">{u.nombre || '-'}</td>
                <td className="p-3 text-sm">{u.role || '-'}</td>
                <td className="p-3 text-sm">{u.phone || '-'}</td>
                <td className="p-3 text-sm flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleEditClick(u)}
                    className="px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteClick(u.id)}
                    className="px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 transition"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Editar usuario</h3>
                <p className="text-sm text-gray-500">Modifica nombre, rol o teléfono.</p>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600">Cerrar</button>
            </div>

            <div className="grid gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email</label>
                <input type="text" value={selectedUser.email || ''} disabled className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm bg-gray-50 text-gray-500" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nombre</label>
                <input
                  type="text"
                  value={selectedUser.nombre || ''}
                  onChange={(e) => setSelectedUser((prev) => ({ ...prev, nombre: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Rol</label>
                <select
                  value={selectedUser.role || 'visitante'}
                  onChange={(e) => setSelectedUser((prev) => ({ ...prev, role: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
                >
                  <option value="visitante">visitante</option>
                  <option value="emprendedor">emprendedor</option>
                  <option value="administrador">administrador</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Teléfono</label>
                <input
                  type="text"
                  value={selectedUser.phone || ''}
                  onChange={(e) => setSelectedUser((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="px-4 py-3 rounded-xl border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveUser}
                className="px-4 py-3 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-brand-hover transition"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {modalEliminar.abierto && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 border border-gray-100 text-center">
            <div className="flex justify-center">
              <Trash2 className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mt-4">Confirmar eliminación</h3>
            <p className="text-sm text-gray-500 mt-2">¿Estás seguro de que quieres eliminar este usuario?</p>
            <div className="mt-6 flex justify-center gap-3">
              <button onClick={() => setModalEliminar({ abierto: false, usuarioId: null })} className="px-4 py-3 rounded-xl border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition">
                Cancelar
              </button>
              <button onClick={handleConfirmDelete} className="px-4 py-3 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}