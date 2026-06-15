import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logoSwes from '../assets/icono_sistema.png';
import { getAll } from '../services/crudService';
import { IconIdBadge, IconSearch, IconChartBar, IconUsers, IconBrandWhatsapp, IconBrandFacebook, IconBrandInstagram } from '@tabler/icons-react';
import fondoCompras from '../assets/imagen_landing.png';

function Landing() {
  const [emprendimientos, setEmprendimientos] = useState([]);

  const features = [
    { Icon: IconIdBadge,  color: 'bg-violet-50 text-violet-700', title: 'Perfil de emprendimiento', desc: 'Crea y personaliza tu perfil de negocio' },
    { Icon: IconSearch,   color: 'bg-teal-50 text-teal-700',     title: 'Descubrimiento fácil',      desc: 'Explora y filtra emprendimientos por categoría.' },
    { Icon: IconChartBar, color: 'bg-amber-50 text-amber-700',   title: 'Panel de estadísticas',     desc: 'Visualiza como admistrador las métricas de los emprendimientos.' },
    
  ];

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
    <div className="min-h-screen bg-slate-50/50 text-slate-900 selection:bg-brand-primary selection:text-white antialiased">

      {/* HEADER */}
      <header className="bg-neutral-surface border-b border-neutral-border h-16 flex items-center px-8 relative z-50">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 select-none">
            <img src={logoSwes} alt="SWES" className="w-7 h-7 object-contain" />
            <span className="font-bold text-neutral-text text-xl">SWES</span>
            <span className="font-bold text-brand-primary text-xl gap-1">EPN</span>
          </Link>

          {/* Acciones derecha */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-1.5 rounded-input text-sm font-semibold text-neutral-subtle hover:text-neutral-text hover:bg-neutral-bg transition-all"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/register"
              className="px-4 py-1.5 rounded-input text-sm font-semibold bg-brand-primary text-white hover:bg-brand-hover transition-all"
            >
              Registrarse
            </Link>
          </div>

        </div>
      </header>


      <main className="mx-auto w-full max-w-7xl px-6">

        {/* HERO: Texto izquierda + Imagen derecha */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-16 min-h-[420px]">

          {/* TEXTO */}
          <div className="flex flex-col items-start text-left lg:pl-12">

            <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-slate-900 mb-6">
              Impulsa tu negocio y conecta con la <span className="text-brand-primary">comunidad universitaria</span>
            </h1>

            {/* BOTONES */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-10">
              <Link
                to="/register"
                className="rounded-full bg-brand-primary px-7 py-3.5 text-sm font-bold text-white hover:bg-brand-hover hover:shadow-lg hover:shadow-brand-primary/20 transition-all text-center"
              >
                Publicar mi emprendimiento
              </Link>
              <Link
                to="/login"
                className="rounded-full border border-slate-300 bg-white px-7 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all text-center"
              >
                Explorar emprendimientos
              </Link>
            </div>
          </div>

          {/* IMAGEN */}
          <div className="flex items-center justify-center">
            <img
              src={fondoCompras}
              alt="Fondo SWES"
              className="max-w-full max-h-[420px] object-contain"
            />
          </div>
        </section>
        
        {/* (ROLES / CTA / CAMPAIGN) */}
        
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          {/* ROLES: ¿Quién puede usar SWES? */}
          
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm border-t-4 border-t-blue-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <h3 className="font-bold text-slate-900 text-xl mb-5 pb-3 border-b border-slate-100">¿Quién puede usar SWES?</h3>
            
            <div className="space-y-7">
              
              {[
                
                { role: 'Visitante', desc: 'Explora y contacta emprendimientos.', color: 'bg-blue-50 text-blue-600' },
                { role: 'Emprendedor', desc: 'Publica y gestiona tu negocio.', color: 'bg-blue-50 text-blue-600' },
                { role: 'Administrador', desc: 'Controla y modera la plataforma.', color: 'bg-blue-50 text-blue-600' },
              ].map((r, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl shrink-0 font-bold text-sm ${r.color}`}>
                    {r.role.charAt(0)}
                  </div>
                  
                  <div>
                    <p className="font-semibold text-slate-900 text-md">{r.role}</p>
                    <p className="text-sm text-slate-500 leading-relaxed">{r.desc}</p>
                  </div>
                </div>
              ))}
              
            </div>
          </div>
          
          {/* FAQ */}
          
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm border-t-4 border-t-blue-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <h3 className="font-bold text-slate-900 text-xl mb-5 pb-3 border-b border-slate-100">Preguntas Frecuentes</h3>
            
            <div className="space-y-3">
              
              {[
                { q: '¿La plataforma tiene algún costo?', a: 'No, SWES es gratuito para la comunidad universitaria.' },
        { q: '¿Cómo se coordinan pagos y entregas?', a: 'Te contactas directamente con el vendedor vía WhatsApp.' },
        { q: '¿Necesito correo institucional?', a: 'No es obligatorio, el sistema adapta los accesos según tu rol.' },
      ].map((faq, i) => {
        const [open, setOpen] = useState(false);
        return (
          <div key={i} className={`border rounded-xl overflow-hidden transition-colors ${open ? 'border-blue-200 bg-blue-50/40' : 'border-slate-100'}`}>
            <button
              onClick={() => setOpen(!open)}
              className="w-full flex items-center justify-between gap-2 p-3 text-left"
            >
              <span className="text-md font-semibold text-slate-900">{faq.q}</span>
              <span className={`text-slate-400 transition-transform shrink-0 ${open ? 'rotate-180 text-blue-500' : ''}`}>▾</span>
            </button>
            {open && (
              <div className="px-3 pb-3">
                <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>

  {/* CAMPAIGN: Funcionalidades destacadas */}
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm border-t-4 border-t-blue-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
    <h3 className="font-bold text-slate-900 text-xl mb-5 pb-3 border-b border-slate-100">Lo que ofrece SWES</h3>
    <div className="space-y-7">
      {features.map((f, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl shrink-0 ${f.color}`}>
            <f.Icon size={18} stroke={1.75} aria-hidden="true" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 text-md">{f.title}</p>
            <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

        
        {/* EMPRENDIMIENTOS DESTACADOS */}
        <section className="py-8 md:py-10 border-t border-slate-200/60 mb-5">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-primary tracking-tight">
              Emprendimientos destacados
            </h2>
            <p className="text-md sm:text-sm text-slate-600 mt-4 font-semibold">
              Descubre los proyectos más populares de nuestra comunidad universitaria
            </p>
          </div>

          {/* Lista de Emprendimientos */}
          {emprendimientos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto px-4">
              {emprendimientos.slice(0, 2).map((emp) => (
                <div
                  key={emp.id}
                  className="group rounded-2xl border border-slate-200/80 bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl cursor-pointer"
                >
                  {/* CONTENEDOR DE IMAGEN */}
                  <div className="relative w-full h-48 bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 overflow-hidden">
                    {emp.image ? (
                      <img 
                        src={emp.image} 
                        alt={emp.name} 
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl bg-slate-50">📦</div>
                    )}
                    
                    {/* CATEGORÍA ESTILIZADA */}
                    {emp.category && (
                      <span className="absolute top-3 left-3 rounded-lg bg-white/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-slate-800 shadow-sm border border-white/40">
                        {emp.category}
                      </span>
                    )}
                  </div>

                  {/* CUERPO DE LA TARJETA */}
                  <div className="p-5">
                    <div className="flex items-baseline justify-between gap-4 mb-2">
                      <h3 className="font-bold text-slate-900 text-xl line-clamp-1 group-hover:text-brand-primary transition-colors duration-200">
                        {emp.name}
                      </h3>
                      {emp.price && (
                        <span className="text-brand-primary font-black text-sm shrink-0">
                          ${Number(emp.price).toFixed(2)}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
                      {emp.description || 'Sin descripción disponible actualmente.'}
                    </p>

                    {/* ENLACE DE ACCIÓN SUTIL */}
                    <div className="flex items-center gap-1 text-xs font-bold text-brand-primary/80 group-hover:text-brand-primary transition-colors">
                      <span>Ver detalles del negocio</span>
                      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SEGUNDA LLAMADA A LA ACCIÓN */}
        <section className="py-10 md:py-14 rounded-3xl bg-gradient-to-r from-brand-primary/20 to-brand-accent/20 px-6 md:px-10 text-center border border-brand-accent/30 mb-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">¿Listo para impulsar tu emprendimiento?</h2>
          <p className="text-sm sm:text-base text-slate-600 mb-6">Únete a cientos de emprendedores que ya usan SWES para crecer.</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-6 md:px-8 py-2.5 md:py-3 text-sm font-semibold text-white transition hover:bg-brand-hover"
          >
            Comenzar gratis
            <span>→</span>
          </Link>
        </section>
      </main>

      {/* DATOS DE CONTACTO */}
      <footer className="border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link to="/" className="flex items-center gap-2">
              <img src={logoSwes} alt="SWES" className="w-6 h-6 object-contain" />
              <span className="font-bold text-neutral-text text-sm">SWES EPN</span>
            </Link>
            <p className="text-xs text-slate-500 text-center md:text-left">
              Plataforma de emprendimientos universitarios de la Escuela Politécnica Nacional.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-1">
            <p className="text-xs text-slate-400">© 2026 SWES — Proyecto universitario EPN</p>
            <p className="text-xs text-slate-400">Desarrollado por estudiantes de la EPN</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
