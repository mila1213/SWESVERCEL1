import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import SidebarFilters from './SidebarFilters';
import { getAll } from '../services/crudService';

function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  const role = localStorage.getItem('role') || 'visitante';
  const uid = localStorage.getItem('uid');
  const userName = localStorage.getItem('name') || 'Visitante';

  useEffect(() => {
    const cargarProductos = async () => {
      setLoading(true);
      try {
        // Todos ven TODOS los productos en el tablero
        const data = await getAll('products');
        setItems(data || []);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarProductos();
  }, []);

  const productosFiltrados = items.filter((it) => {
    const busquedaLower = busqueda.toLowerCase();
    const coincideCat = categoriaActiva === 'todas' || it.category?.toLowerCase() === categoriaActiva.toLowerCase();
    const coincideBusq = it.name?.toLowerCase().includes(busquedaLower) || it.description?.toLowerCase().includes(busquedaLower);
    return coincideCat && coincideBusq;
  });

  return (
    <div className="min-h-screen bg-[#f4f6f8]">
      <div className="max-w-[1500px] mx-auto px-5 py-6">
        {/* HEADER */}
        <div className="bg-white border border-gray-200 rounded-2xl px-8 py-6 mb-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">Tablero de Emprendimientos</h1>
            <p className="text-lg text-slate-500 mt-1 font-medium">Rol: <span className="capitalize text-blue-900 font-semibold">{role}</span></p>            
          </div>
          {(role === 'emprendedor' || role === 'administrador') && (
            
            <button 
            onClick={() => navigate('/admin/products/new')} 
            className="bg-blue-900 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm hover:shadow transition-all duration-200 shrink-0"
            >
            + Publicar Emprendimiento
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">
          <aside className="bg-white p-6 rounded-2xl shadow-sm">
            <SidebarFilters categoriaActiva={categoriaActiva} setCategoriaActiva={setCategoriaActiva} />
          </aside>

          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              <p className="text-center col-span-full text-gray-500">Cargando emprendimientos...</p>
            ) : productosFiltrados.length === 0 ? (
              <p className="text-center col-span-full text-gray-500">No hay emprendimientos disponibles</p>
            ) : (
              productosFiltrados.map((it) => (
                <div key={it.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col h-full">
                  <img src={it.image} alt={it.name} className="h-40 w-full object-cover rounded-xl mb-4" />
                  <h2 className="text-lg font-bold">{it.name}</h2>
                  <p className="text-sm text-gray-600 mt-1 mb-2 line-clamp-3 leading-relaxed">{it.description}</p>
                  <p className="font-bold text-blue-900 mb-3">${it.price}</p>

                  <div className="mt-auto">

                  
                  {/* INFO DEL VENDEDOR */}
                  <div className="bg-gray-50 p-3 rounded-lg mb-3 text-sm text-gray-700">
                    <p><strong>Vendedor:</strong> {it.sellerName || it.sellername || 'No disponible'}</p>
                    <p><strong>Teléfono:</strong> {it.sellerPhone || it.sellerphone || 'No disponible'}</p>
                  </div>

                  {/* SOLO BOTÓN DE CONTACTO - SIN EDITAR/ELIMINAR */}
                  <a 
                    href={`https://wa.me/${it.sellerPhone?.replace(/\D/g, '') || it.sellerphone?.replace(/\D/g, '')}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="block w-full text-center bg-blue-900 hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold transition"
                  >
                    Contactar por WhatsApp
                  </a>

                  </div>
                </div>
              ))
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;