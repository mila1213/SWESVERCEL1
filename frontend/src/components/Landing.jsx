import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logoSweEpn from '../assets/logo_swes_epn.png';
import { getAll } from '../services/crudService';
import { IconIdBadge, IconSearch, IconChartBar, IconUsers, IconBriefcase, IconUser} from '@tabler/icons-react';
import fondoCompras from '../assets/fondo_compras.jpg';
import carroCompras from '../assets/carrito_compras.jpg';
import comprador from '../assets/comprador.jpg';
import vendedor from '../assets/vendedor.jpg';


function Landing() {
  const [emprendimientos, setEmprendimientos] = useState([]);
  const features = [
  { Icon: IconIdBadge,  color: 'bg-violet-50 text-violet-700',  title: 'Perfil de emprendimiento', desc: 'Crea tu emprendimiento con nombre, descripción, imagen, precio, categoría y datos de contacto.' },
  { Icon: IconSearch,   color: 'bg-teal-50 text-teal-700',      title: 'Descubrimiento fácil',      desc: 'Los visitantes pueden explorar y encontrar emprendimientos filtrando por categoría.' },
  { Icon: IconChartBar, color: 'bg-amber-50 text-amber-700',    title: 'Panel de estadísticas',     desc: 'Visualiza vistas, interacciones y el rendimiento de tu perfil en tiempo real.' },
  { Icon: IconUsers,    color: 'bg-blue-50 text-blue-700',      title: 'Gestión de roles',          desc: 'Acceso diferenciado para administradores, emprendedores y visitantes.' },
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

      <main className="mx-auto w-full max-w-7xl px-6">
        {/* HERO SECTION */}
        
        <section className="relative w-full rounded-3xl overflow-hidden mb-16" style={{ minHeight: '520px' }}>
          {/* Imagen de fondo */}
          <img
          src={fondoCompras}
          alt="Fondo SWES"
          className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Contenido centrado encima */}
          
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-6 pb-27 md:pt-10 md:pb-32">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 border border-white/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white mb-6">
            Plataforma de emprendimientos
            </span>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] mb-6 text-white max-w-3xl">
              Impulsa tu negocio y conecta con la comunidad universitaria
            </h1>
            
            <p className="max-w-xl text-base sm:text-lg text-white/80 mb-10 leading-relaxed">
            SWES conecta emprendedores con clientes. Crea tu perfil, promociona tus productos y haz crecer tu negocio.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
              to="/register"
              className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-brand-primary hover:bg-slate-100 transition">Publicar mi emprendimiento
              </Link>
              
              <Link
              to="/login"
              className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-brand-primary hover:bg-slate-100 transition">Explorar emprendimientos
              </Link>

            </div>

          </div>
        </section>

        {/* SECCIÓN DEL PROBLEMA */}
        
        <section className="py-12 md:py-20 bg-slate-100/50 rounded-3xl px-6 md:px-12 mb-16">
        <div className="max-w-5xl mx-auto text-center">
         <h2 className="text-2xl sm:text-3xl font-black text-brand-primary tracking-tight mb-6">
          ¿Cansado de perder ventas{' '}
          <span className="text-brand-primary">y tiempo</span>
          <br />
          dentro del campus?
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-28 max-w-5xl mx-auto">
            
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              
              <div className="p-4">
                
                <span className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wide bg-violet-50 text-violet-800 px-3 py-1 rounded-full mb-2">
                  
                  <IconBriefcase size={12} /> Emprendedor
                  </span>
                  
                  <h4 className="font-semibold text-slate-900 text-xl mb-1">Invisible para tus clientes</h4>
                  
                  <p className="text-xm text-slate-500 leading-relaxed">Pierdes entre 3 a 5 clientes por semana porque tus publicaciones desaparecen entre mensajes de WhatsApp.</p>
                  
              </div>
              
              <img src={vendedor} alt="Vendedor" className="w-full h-40 object-cover" />
            
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              
              <div className="p-4">
                
                <span className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wide bg-teal-50 text-teal-800 px-3 py-1 rounded-full mb-2">
                  
                  <IconUser size={12} /> Comprador
                  
                </span>
                
                <h4 className="font-semibold text-slate-900 text-xl mb-1">No encuentras lo que buscas</h4>
                
                <p className="text-xm text-slate-500 leading-relaxed">El 72% intentó comprar dentro del campus pero no pudo contactar al vendedor a tiempo.</p>
              </div>
              
              <img src={comprador} alt="Comprador" className="w-full h-40 object-cover" />
            </div>
          </div>
        </div>
        
        </section>

        {/* FUNCIONALIDADES */}
        
        <section className="py-16 md:py-24 border-t border-slate-200/60">
        
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-primary mb-4">
          Funcionalidades
          
          </span>
          
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            Todo lo que necesita tu emprendimiento
            
          </h2>
          
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            
            Herramientas pensadas estratégicamente para que los emprendedores puedan escalar sus negocios y la comunidad universitaria encuentre lo que busca en segundos.
          </p>
         </div>
         
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
          
          {features.map((f, i) => (
            <div 
            key={i} 
            className="group relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-slate-300">
              
              <div className="flex flex-col sm:flex-row items-start gap-4">
                {/* Contenedor del Icono con animación en hover */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-sm ${f.color}`}>
                  <f.Icon size={24} stroke={1.75} aria-hidden="true" />
                </div>
                
                {/* Textos */}
                
                <div className="space-y-1.5">
                  <h3 className="font-bold text-slate-900 text-base tracking-tight transition-colors group-hover:text-brand-primary">
                    {f.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {f.desc}
                  </p>
                  
                </div>
              </div>
            </div>
          ))}
        </div>
        </section>

        {/* ROLES */}
        
        <section className="py-16 md:py-24 border-t border-slate-200/60 bg-gradient-to-b from-transparent to-slate-50/30">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-primary mb-4">
          Roles
          </span>
          
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            
            ¿Quién puede usar SWES?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            Tres tipos de acceso diseñados estratégicamente para interactuar con el ecosistema universitario de forma segura y eficiente.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch">
          
          {[
            {
              title: 'Visitante',
              desc: 'Para la comunidad que busca apoyar y descubrir negocios.',
              color: 'border-slate-200 hover:border-slate-300',
              iconColor: 'text-slate-500 bg-slate-100',
              items: [
                'Ver emprendimientos disponibles',
                'Buscar emprendimientos por categoría',
                'Contactar emprendedores de forma directa',
                'Registrarse en la plataforma en segundos'
              ]
            },
            {
              title: 'Emprendedor',
              desc: 'El motor de la plataforma. Diseñado para potenciar tus ventas.',
              color: 'border-brand-primary shadow-md md:-translate-y-2 ring-4 ring-brand-primary/5',
              highlight: true,
              iconColor: 'text-brand-primary bg-brand-primary/10',
              items: [
                'Crear y personalizar tu perfil de negocio',
                'Publicar productos con fotos, precios y descripción',
                'Gestionar y actualizar tus publicaciones activas',
                'Acceder al panel de analíticas e interacciones']
            },
            {
              title: 'Administrador',
              desc: 'Control total para garantizar un entorno seguro y confiable.',
              color: 'border-slate-200 hover:border-slate-300',
              iconColor: 'text-slate-600 bg-slate-100',
              items: [
                'Gestionar todos los emprendimientos del campus',
                'Monitorear reportes globales y estadísticas',
                'Moderar y administrar accesos de la plataforma'
              ]}
            
            ].map((role, idx) => (
            <div 
            key={idx} 
            className={`relative flex flex-col justify-between rounded-2xl border bg-white p-6 lg:p-8 transition-all duration-300 hover:shadow-xl ${role.color}`}
            >
              {role.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                  Recomendado
                </span>
              )}

        <div>
          {/* Encabezado de Tarjeta */}
          <div className="mb-6">
            <h3 className="font-black text-xl text-slate-900 tracking-tight mb-2">
              {role.title}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {role.desc}
            </p>
          </div>

          {/* Lista de características con Checkmarks */}
          <ul className="space-y-3.5">
            {role.items.map((item, i) => (
              <li key={i} className="text-xs sm:text-sm text-slate-600 flex items-start gap-3">
                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 mt-0.5 ${role.highlight ? 'text-brand-primary bg-brand-primary/10' : 'text-slate-600 bg-slate-100'}`}>
                  <svg className="w-3 h-3 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="leading-tight">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    ))}
  </div>
</section>

        {/* CÓMO FUNCIONA */}
<section className="py-16 md:py-24 border-t border-slate-200/60">
  <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 md:mb-16">
    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-primary mb-4">
      ¿Cómo funciona?
    </span>
    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
      Empieza en 3 simples pasos
    </h2>
    <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
      Diseñamos un proceso rápido y directo para que puedas registrarte y empezar a conectar con la comunidad en cuestión de minutos.
    </p>
  </div>

  {/* Contenedor relativo para poder dibujar las líneas conectoras */}
  <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto isolation-auto">
    
    {/* Línea conectora horizontal de fondo (Solo visible desde md:) */}
    <div className="absolute top-12 left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-slate-200 -z-10 hidden md:block" aria-hidden="true" />

    {[
      {
        step: '01',
        title: 'Crea tu cuenta',
        desc: 'Regístrate en la plataforma adaptando tu perfil en menos de 2 minutos.'
      },
      {
        step: '02',
        title: 'Publica tu emprendimiento',
        desc: 'Sube tus productos con fotos, precios detallados y tus canales de contacto directo.'
      },
      {
        step: '03',
        title: 'Llega a más clientes',
        desc: 'Toda la comunidad universitaria descubre tu negocio y te contactará de inmediato.'
      }
    ].map((item, idx) => (
      <div 
        key={idx} 
        className="group flex flex-col items-center md:items-start text-center md:text-left bg-white rounded-2xl border border-slate-200/70 p-6 shadow-sm transition-all duration-300 hover:shadow-md"
      >
        {/* Burbuja del número del paso */}
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-900 font-black text-sm border border-slate-200 shadow-sm mb-5 transition-colors duration-300 group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary">
          {item.step}
        </div>
        
        {/* Título y Descripción */}
        <div className="space-y-2">
          <h3 className="font-bold text-slate-900 text-base md:text-lg tracking-tight transition-colors group-hover:text-brand-primary">
            {item.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            {item.desc}
          </p>
        </div>
      </div>
    ))}
  </div>
</section>

        {/* PREGUNTAS FRECUENTES */}
<section className="py-16 md:py-24 border-t border-slate-200/60 bg-slate-50/30">
  <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-primary mb-4">
      Soporte
    </span>
    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
      Preguntas Frecuentes
    </h2>
    <p className="text-sm text-slate-600 max-w-xl">
      ¿Tienes alguna duda sobre cómo funciona la plataforma? Aquí te respondemos de forma rápida.
    </p>
  </div>

  <div className="max-w-3xl mx-auto space-y-3 px-4">
    {[
      { 
        q: "¿La plataforma tiene algún costo?", 
        a: "No, SWES es un proyecto completamente gratuito para la comunidad universitaria. Puedes registrarte, publicar tu negocio y gestionar tu perfil sin pagar ninguna comisión por venta." 
      },
      { 
        q: "¿Cómo se coordinan las entregas y los pagos?", 
        a: "SWES funciona como una vitrina digital interactiva. El comprador explora el catálogo y se contacta directamente contigo vía WhatsApp para acordar el método de pago (efectivo, transferencia) y el punto de entrega seguro dentro del campus." 
      },
      { 
        q: "¿Necesito obligatoriamente un correo institucional para registrarme?", 
        a: "La plataforma está optimizada prioritariamente para la comunidad universitaria, pero el sistema cuenta con un sistema de gestión flexible que adapta los accesos y validaciones de seguridad de acuerdo al rol que elijas." 
      }
    ].map((faq, i) => {
      // Estado local para manejar qué acordeón está abierto
      const [isOpen, setIsOpen] = useState(false);

      return (
        <div 
          key={i} 
          className={`overflow-hidden rounded-2xl border transition-all duration-300 bg-white ${
            isOpen 
              ? 'border-brand-primary/40 shadow-md ring-4 ring-brand-primary/5' 
              : 'border-slate-200 shadow-sm hover:border-slate-300'
          }`}
        >
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors"
          >
            <h4 className={`font-bold text-sm md:text-base tracking-tight transition-colors ${
              isOpen ? 'text-brand-primary' : 'text-slate-900'
            }`}>
              {faq.q}
            </h4>
            
            {/* Flecha indicadora que rota según el estado */}
            <span className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-50 border border-slate-200 text-slate-500 transition-transform duration-300 ${
              isOpen ? 'rotate-180 bg-brand-primary/10 text-brand-primary border-brand-primary/20' : ''
            }`}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>

          {/* Contenedor colapsable con animación suave de altura */}
          <div 
            className={`transition-all duration-300 ease-in-out ${
              isOpen ? 'max-h-40 border-t border-slate-100' : 'max-h-0'
            }`}
          >
            <div className="p-5 bg-slate-50/50">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {faq.a}
              </p>
            </div>
          </div>
        </div>
      );
    })}
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
<section className="pt-12 md:pt-16 border-t border-slate-200/60 bg-gradient-to-b from-transparent to-slate-50/50">
  <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 md:mb-16">
    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-primary mb-4">
      Destacados
    </span>
    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
      Emprendimientos de nuestra comunidad
    </h2>
    <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
      Explora algunas de las propuestas y productos innovadores creados por estudiantes dentro del campus.
    </p>
  </div>

  {emprendimientos.length > 0 ? (
    <div className="space-y-12">
      {/* Grid limitado estrictamente a un máximo de 3 elementos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
        {emprendimientos.slice(0, 3).map((emp) => (
          <div 
            key={emp.id} 
            className="group rounded-2xl border border-slate-200/80 bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-slate-300/60"
          >
            {/* Contenedor de la Imagen con Posición Relativa */}
            <div className="relative w-full h-52 md:h-56 bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 overflow-hidden">
              {emp.image ? (
                <img 
                  src={emp.image} 
                  alt={emp.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl bg-slate-50">📦</div>
              )}

              {/* Badge/Etiqueta de Categoría Flotante */}
              {emp.category && (
                <span className="absolute top-3 left-3 rounded-xl bg-white/80 backdrop-blur-md px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-800 shadow-sm border border-white/40">
                  {emp.category}
                </span>
              )}
            </div>

            {/* Contenido de la Tarjeta */}
            <div className="p-5 md:p-6 flex flex-col justify-between space-y-4">
              <div>
                {/* Nombre del Producto */}
                <h3 className="font-black text-slate-900 text-base md:text-lg mb-2 tracking-tight line-clamp-1 group-hover:text-brand-primary transition-colors">
                  {emp.name}
                </h3>

                {/* Precio Estilizado */}
                {emp.price && (
                  <p className="text-brand-primary font-black text-xl mb-3 tracking-tight">
                    ${Number(emp.price).toFixed(2)}
                  </p>
                )}

                {/* Descripción Corta */}
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4">
                  {emp.description}
                </p>
              </div>

              {/* Separador y Datos del Vendedor */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-0.5">Vendedor</p>
                  <p className="text-xs sm:text-sm text-slate-700 font-semibold truncate max-w-[150px]">
                    {emp.seller || 'Emprendedor'}
                  </p>
                </div>
                
                {/* Botón visual de acción simulado */}
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 text-slate-600 border border-slate-200 transition-colors group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botón secundario para ver el catálogo completo si hay más */}
      {emprendimientos.length > 3 && (
        <div className="text-center mt-4">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-400"
          >
            Ver todos los emprendimientos
          </Link>
        </div>
      )}
    </div>
  ) : (
    <div className="rounded-2xl bg-white p-8 md:p-12 text-center border border-slate-200/80 shadow-sm max-w-xl mx-auto">
      <div className="text-4xl mb-3">✨</div>
      <p className="text-sm md:text-base text-slate-600 font-medium">
        Aún no hay emprendimientos registrados. ¡Sé el primero en registrar tu idea!
      </p>
    </div>
  )}
</section>
      </main>

      {/* FOOTER */}
<footer className="border-t border-slate-200 mt-12 md:mt-20">
  <div className="mx-auto max-w-7xl px-6 py-10 md:py-14">

    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
      
      {/* Logo + descripción */}
      <div className="flex flex-col items-center md:items-start gap-2">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoSweEpn} alt="SWES EPN" className="h-8 object-contain" />
        </Link>
        <p className="text-xs text-slate-500 leading-relaxed text-center md:text-left">
          Plataforma de emprendimientos universitarios de la Escuela Politécnica Nacional.
        </p>
      </div>

      {/* Copyright */}
      <div className="flex flex-col items-center md:items-end gap-1">
        <p className="text-xs text-slate-400">© 2026 SWES — Proyecto universitario EPN</p>
        <p className="text-xs text-slate-400">Desarrollado por estudiantes de la EPN</p>
      </div>

    </div>
  </div>
</footer>
    </div>
  );
}

export default Landing;
