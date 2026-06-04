import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logoSweEpn from '../assets/logo_swes_epn.png';
import { getAll } from '../services/crudService';

function Landing() {
  const [emprendimientos, setEmprendimientos] = useState([]);

  useEffect(() => {
    const cargarEmprendimientos = async () => {
      try {
        const data = await getAll('products');
        setEmprendimientos(data || []);
      } catch (error) {
        console.error(error);
      }
    };
    cargarEmprendimientos();
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* HEADER */}
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 md:py-6">
        <Link to="/" className="flex items-center gap-2 select-none">
          <img src={logoSweEpn} alt="SWES EPN" className="h-10 md:h-12 object-contain" />
        </Link>
        

        <nav className="flex items-center gap-2 md:gap-3">
          <Link
            to="/login"
            className="rounded-full border border-slate-300 px-3 md:px-5 py-2 text-xs md:text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Iniciar sesión
          </Link>
          <Link
            to="/register"
            className="rounded-full bg-brand-primary px-3 md:px-5 py-2 text-xs md:text-sm font-semibold text-white transition hover:bg-brand-hover"
          >
            Registrarse
          </Link>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 pb-20">
        {/* HERO SECTION */}
        <section className="py-12 md:py-20 text-center">
          <span className="inline-flex rounded-full bg-brand-accent/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-brand-primary font-semibold mb-6">
            Plataforma de emprendimientos
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-slate-900">
            Impulsa tu emprendimiento y llega a más personas
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 mb-10 px-4">
            SWES es la plataforma que conecta emprendedores con clientes. Crea tu perfil promociona tus productos y haz crecer tu negocio.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
            <Link
              to="/register"
              className="rounded-full border border-slate-300 px-6 md:px-7 py-2 md:py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
            >
              Publicar mi emprendimiento
            </Link>
            <Link
              to="/login"
              className="rounded-full border border-slate-300 px-6 md:px-7 py-2 md:py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
            >
              Explorar emprendimientos
            </Link>
          </div>
        </section>

        {/* FUNCIONALIDADES */}
        <section className="py-12 md:py-20">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-primary font-semibold mb-4">Funcionalidades</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-slate-900">Todo lo que necesita tu emprendimiento</h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mb-8 md:mb-12">
            Herramientas pensadas para que emprendedores puedan crecer y los visitantes encuentren lo que buscan.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6">
            {[
              { icon: '📝', title: 'Perfil de emprendimiento', desc: 'Crea tu emprendimiento con su nombre, descripción,imagen, precio, categoría y datos de contacto.' },
              { icon: '🔍', title: 'Descubrimiento fácil', desc: 'Los visitantes pueden explorar y encontrar emprendimientos por categoría.' },
              { icon: '📊', title: 'Panel de estadísticas', desc: 'Visualiza vistas, interacciones y el rendimiento de tu perfil.' },
              { icon: '👥', title: 'Gestión de roles', desc: 'Acceso diferenciado para administradores, emprendedores y visitantes.' }
            ].map((item, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:p-6">
                <div className="text-2xl md:text-3xl mb-4">{item.icon}</div>
                <h3 className="font-semibold text-sm md:text-base text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs md:text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ROLES */}
        <section className="py-12 md:py-20 border-t border-slate-200">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-primary font-semibold mb-4">Roles</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-slate-900">¿Quién puede usar SWES?</h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mb-8 md:mb-12">Tres tipos de acceso diseñados para cada tipo de usuario.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                title: 'Visitante',
                color: 'border-slate-300',
                items: [
                  'Ver emprendimientos disponibles',
                  'Buscar emprendimientos por categoría',
                  'Contactar emprendedores',
                  'Registrarse en la plataforma'
                ]
              },
              {
                title: 'Emprendedor',
                color: 'border-brand-primary',
                highlight: true,
                items: [
                  'Crear perfil de emprendedor',
                  'Publicar emprendimientos',
                  'Gestionar mis emprendimientos'
                ]
              },
              {
                title: 'Administrador',
                color: 'border-slate-300',
                items: [
                  'Gestionar todos los emprendimientos disponibles',
                  'Ver reportes globales',
                  'Administrar la plataforma'
                ]
              }
            ].map((role, idx) => (
              <div key={idx} className={`rounded-2xl border-2 ${role.color} p-4 md:p-6 ${role.highlight ? 'bg-brand-primary/10' : 'bg-white'}`}>
                <h3 className={`font-bold mb-4 text-sm md:text-base ${role.highlight ? 'text-brand-primary' : 'text-slate-900'}`}>{role.title}</h3>
                <ul className="space-y-2 md:space-y-3">
                  {role.items.map((item, i) => (
                    <li key={i} className="text-xs md:text-sm text-slate-600 flex items-start">
                      <span className="mr-3">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CÓMO FUNCIONA */}
        <section className="py-12 md:py-20 border-t border-slate-200">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-primary font-semibold mb-4">¿Cómo funciona?</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-slate-900">Empieza en 3 pasos</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                step: '1',
                title: 'Crea tu cuenta',
                desc: 'Registrate como emprendedor en menos de 2 minutos.'
              },
              {
                step: '2',
                title: 'Publica tu emprendimiento',
                desc: 'Agrega tu logo, descripción, productos y contacto.'
              },
              {
                step: '3',
                title: 'Llega a más clientes',
                desc: 'Visitantes descubren tu negocio y te contactan directamente.'
              }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-slate-900 font-bold mb-4 md:mb-6">
                  {item.step}
                </div>
                <h3 className="font-bold text-slate-900 mb-3 text-sm md:text-base">{item.title}</h3>
                <p className="text-xs md:text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-10 md:py-16 rounded-3xl bg-gradient-to-r from-brand-primary/20 to-brand-accent/20 px-6 md:px-10 text-center border border-brand-accent/30">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">¿Listo para impulsar tu emprendimiento?</h2>
          <p className="text-sm sm:text-base text-slate-600 mb-6 md:mb-8">Únete a cientos de emprendedores que ya usan SWES para crecer.</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-6 md:px-8 py-2 md:py-3 text-sm font-semibold text-white transition hover:bg-brand-hover"
          >
            Comenzar gratis
            <span>→</span>
          </Link>
        </section>

        {/* EMPRENDIMIENTOS SECTION */}
        <section className="py-12 md:py-20 border-t border-slate-200">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-primary font-semibold mb-4">Emprendimientos</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-slate-900">Todos los emprendimientos de nuestra comunidad</h2>

          {emprendimientos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {emprendimientos.map((emp) => (
                <div key={emp.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {/* Imagen */}
                  <div className="w-full h-48 md:h-56 bg-gradient-to-br from-brand-primary/20 to-brand-accent/20 flex items-center justify-center overflow-hidden">
                    {emp.image ? (
                      <img src={emp.image} alt={emp.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-4xl">📦</div>
                    )}
                  </div>

                  {/* Contenido */}
                  <div className="p-4 md:p-5">
                    {/* Categoría */}
                    <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">{emp.category}</p>

                    {/* Nombre */}
                    <h3 className="font-bold text-slate-900 text-base md:text-lg mb-2 line-clamp-2">{emp.name}</h3>

                    {/* Precio o destacado */}
                    {emp.price && (
                      <p className="text-brand-primary font-bold text-lg mb-3">${emp.price}</p>
                    )}

                    {/* Descripción */}
                    <p className="text-xs md:text-sm text-slate-600 mb-4 line-clamp-2">{emp.description}</p>

                    {/* Vendedor */}
                    <div className="mb-4">
                      <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Vendedor</p>
                      <p className="text-sm text-slate-900 font-medium">{emp.seller || 'Emprendedor'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-50 p-8 md:p-12 text-center border border-slate-200">
              <p className="text-sm md:text-base text-slate-600">Aún no hay emprendimientos registrados. ¡Sé el primero en registrar tu idea!</p>
            </div>
          )}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-50 border-t border-slate-200 mt-12 md:mt-20">
        <div className="mx-auto max-w-7xl px-6 py-8 md:py-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoSweEpn} alt="SWES EPN" className="h-6 md:h-8 object-contain" />
          </Link>
          <p className="text-xs md:text-sm text-slate-600 text-center md:text-right">Sistema web de emprendimientos — proyecto universitario</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
