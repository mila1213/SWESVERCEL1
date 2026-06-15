import { useEffect, useState } from 'react';
import { changePassword } from '../services/authService';

function Settings() {
  const [name, setName] = useState('Usuario');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('visitante');
  const [alerta, setAlerta] = useState({ mostrar: false, texto: '', tipo: '' });
  const [loading, setLoading] = useState(false);
  
  // Estados para cambio de contraseña
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [passwordNuevaConfirm, setPasswordNuevaConfirm] = useState('');
  const [erroresPassword, setErroresPassword] = useState({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setName(window.localStorage.getItem('name') || 'Usuario');
      setEmail(window.localStorage.getItem('email') || 'No disponible');
      setRole(window.localStorage.getItem('role') || 'visitante');
    }
  }, []);

  const validarPassword = () => {
    const errores = {};
    
    if (!passwordActual.trim()) {
      errores.passwordActual = 'La contraseña actual es obligatoria';
    }
    
    if (!passwordNueva.trim()) {
      errores.passwordNueva = 'La nueva contraseña es obligatoria';
    } else if (passwordNueva.length < 6) {
      errores.passwordNueva = 'Mínimo 6 caracteres';
    }
    
    if (!passwordNuevaConfirm.trim()) {
      errores.passwordNuevaConfirm = 'Confirma la nueva contraseña';
    } else if (passwordNueva !== passwordNuevaConfirm) {
      errores.passwordNuevaConfirm = 'Las contraseñas no coinciden';
    }
    
    if (passwordActual === passwordNueva) {
      errores.passwordNueva = 'La nueva contraseña debe ser diferente';
    }
    
    setErroresPassword(errores);
    return Object.keys(errores).length === 0;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (!validarPassword()) return;
    
    setLoading(true);
    setAlerta({ mostrar: false, texto: '', tipo: '' });

    try {
      const data = await changePassword(passwordNueva);
      setAlerta({
        mostrar: true,
        texto: data.message || 'Contraseña cambiada correctamente',
        tipo: 'success'
      });
      
      // Limpiar formulario
      setPasswordActual('');
      setPasswordNueva('');
      setPasswordNuevaConfirm('');
      setMostrarFormulario(false);
      setErroresPassword({});
    } catch (error) {
      console.error(error);
      setAlerta({
        mostrar: true,
        texto: error.response?.data?.message || error.message || 'No se pudo cambiar la contraseña',
        tipo: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto my-12 p-6 sm:p-8 rounded-2xl bg-white text-slate-800 border border-gray-100 shadow-sm">

      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Configuración</p>
          <h2 className="text-3xl font-extrabold sm:text-4xl">Seguridad de la cuenta</h2>
          <p className="max-w-2xl text-sm text-slate-500 sm:text-base">
            Revisa tu perfil y cambia tu contraseña de forma segura.
          </p>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/60 to-blue-50/10 px-5 py-4 shadow-sm backdrop-blur-xs self-start lg:self-center flex items-center gap-4 min-w-[200px]">

  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-200">
    <span className="text-base">🛡️</span>
    <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
    </span>
  </div>

  {/* Textos con jerarquía limpia */}
  <div className="flex flex-col">
    <p className="text-[11px] font-bold uppercase tracking-wider text-blue-500/90">Estado de cuenta</p>
    <p className="text-sm font-extrabold text-blue-950 tracking-tight mt-0.5">Protección activa</p>
  </div>
</div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <section className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6 shadow-3xs">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Tu perfil</h3>
              <p className="mt-2 text-sm text-slate-500">Aquí ves tu información personal y tu rol asignado.</p>
            </div>
            <div className="inline-flex items-center justify-center rounded-3xl bg-white px-4 py-3 shadow-sm">
              <span className="text-lg">👤</span>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-3xs transition-shadow">
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">Nombre de usuario</p>
              <p className="mt-3 text-sm font-semibold text-slate-950">{name}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-3xs transition-shadow">
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">Correo</p>
              <p className="mt-3 text-sm font-semibold text-slate-950 break-words">{email}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-3xs transition-shadow">
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">Rol</p>
              <p className="mt-3 text-sm font-semibold text-slate-950">{role}</p>
              <p className="mt-2 text-xs text-slate-500">No se puede cambiar desde aquí.</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-3xs">
          <div>
            <h3 className="text-xl font-semibold text-slate-950">Contraseña</h3>
            <p className="mt-2 text-sm text-slate-500">Cambia tu contraseña de forma segura.</p>
          </div>

          {!mostrarFormulario ? (
            <button
              type="button"
              onClick={() => setMostrarFormulario(true)}
              className="mt-8 w-full rounded-xl bg-blue-900 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-blue-800 transition-all duration-200"
            >
              Cambiar contraseña
            </button>
          ) : (
            <form onSubmit={handleChangePassword} className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Contraseña Actual</label>
                <input 
                  type="password" 
                  placeholder="Tu contraseña actual" 
                  value={passwordActual}
                  onChange={(e) => setPasswordActual(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm font-medium focus:border-blue-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-900/10 transition-all"
                />
                {erroresPassword.passwordActual && (
                  <p className="mt-1 text-xs text-red-600">{erroresPassword.passwordActual}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Nueva Contraseña</label>
                <input 
                  type="password" 
                  placeholder="Nueva contraseña (mín. 6 caracteres)" 
                  value={passwordNueva}
                  onChange={(e) => setPasswordNueva(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm font-medium focus:border-blue-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-900/10 transition-all"
                />
                {erroresPassword.passwordNueva && (
                  <p className="mt-1 text-xs text-red-600">{erroresPassword.passwordNueva}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Confirmar Nueva Contraseña</label>
                <input 
                  type="password" 
                  placeholder="Confirma la nueva contraseña" 
                  value={passwordNuevaConfirm}
                  onChange={(e) => setPasswordNuevaConfirm(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm font-medium focus:border-blue-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-900/10 transition-all"
                />
                {erroresPassword.passwordNuevaConfirm && (
                  <p className="mt-1 text-xs text-red-600">{erroresPassword.passwordNuevaConfirm}</p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMostrarFormulario(false);
                    setPasswordActual('');
                    setPasswordNueva('');
                    setPasswordNuevaConfirm('');
                    setErroresPassword({});
                  }}
                  className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-lg bg-blue-900 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          )}

          {alerta.mostrar && (
            <div className={`mt-4 rounded-lg p-3 text-sm ${
              alerta.tipo === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {alerta.texto}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Settings;