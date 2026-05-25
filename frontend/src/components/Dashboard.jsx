import { useEffect, useState } from 'react';
import SidebarFilters from './SidebarFilters';
import { useNavigate } from 'react-router-dom';
import { getAll } from '../services/crudService';

function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [categoriaActiva, setCategoriaActiva] = useState('todas');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await getAll('products');
        setItems(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const alLimpiarFiltros = () => {
    setCategoriaActiva('todas');
    setBusqueda('');
  };

  // 👇 LÓGICA DE FILTRADO: Filtra en tiempo real los items cargados
  const itemsFiltrados = items.filter((it) => {
    // 1. Validar filtro por categoría
    const cumpleCategoria = 
      categoriaActiva === 'todas' || 
      it.category?.toLowerCase() === categoriaActiva.toLowerCase();

    // 2. Validar filtro por buscador (nombre o descripción)
    const textoNombre = (it.name || it.title || '').toLowerCase();
    const textoDesc = (it.description || '').toLowerCase();
    const cumpleBusqueda = 
      textoNombre.includes(busqueda.toLowerCase()) || 
      textoDesc.includes(busqueda.toLowerCase());

    return cumpleCategoria && cumpleBusqueda;
  });

  return (
    // Max-w aumentado a 7xl para dar espacio al menú lateral de forma cómoda
    <div className="max-w-7xl mx-auto my-8 p-6 text-gray-800">
      
      {/* 1. Contenedor del Layout: Flex coloca Filtros e Información lado a lado */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* MENÚ DE FILTROS (Lado Izquierdo) */}
        <SidebarFilters 
          categoriaActiva={categoriaActiva}
          setCategoriaActiva={setCategoriaActiva}
          alLimpiarFiltros={alLimpiarFiltros}
        />

        {/* SECCIÓN DE CONTENIDO (Lado Derecho) */}
        <main className="flex-1 w-full">
          
          {/* Encabezado Principal */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b pb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Explorador de Emprendimientos SEWS</h2>
              <p className="text-gray-500 text-sm mt-1">Productos y servicios ofrecidos por estudiantes</p>
            </div>
            <button 
              onClick={() => navigate('/admin/products/new')}
              className="px-5 py-2.5 bg-[#00665c] text-white font-semibold rounded-lg shadow hover:bg-[#004d45] transition whitespace-nowrap"
            >
              + Registrar Emprendimiento
            </button>
          </header>

          {/* Barra de Búsqueda */}
          <div className="mb-6 relative">
            <span className="absolute left-4 top-3.5 text-gray-400">🔍</span>
            <input 
              type="text" 
              placeholder="Buscar por nombre, fundador o palabra clave..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-gray-400 transition-colors shadow-sm"
            />
          </div>

          {/* Renderizado Condicional de Tarjetas */}
          {loading ? (
            <p className="text-center text-gray-500 font-medium py-12">Cargando la vitrina de emprendimientos...</p>
          ) : itemsFiltrados.length === 0 ? (
            <div className="text-center text-gray-500 py-12 border border-dashed border-gray-300 rounded-lg bg-gray-50">
              No se encontraron publicaciones que coincidan con los filtros seleccionados.
            </div>
          ) : (
            /* Cuadrícula de Tarjetas (Grid) - Usando ya el array filtrado */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {itemsFiltrados.map((it) => (
                <div 
                  key={it.id} 
                  className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
                >
                  {/* Imagen de la Tarjeta */}
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center border-b border-gray-200 overflow-hidden">
                    {(it.image || it.imagen) ? (
                      <img 
                        src={it.image || it.imagen} 
                        alt={it.name || it.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">Sin imagen</span>
                    )}
                  </div>

                  {/* Detalles de la Tarjeta */}
                  <div className="p-4 flex flex-col flex-1 gap-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{it.name || it.title}</h3>
                      {it.category && (
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded border border-blue-100 whitespace-nowrap">
                          {it.category}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-3 flex-1">
                      {it.description || "Sin descripción disponible."}
                    </p>

                    <div className="pt-2 border-t border-gray-100 mt-2 flex justify-between items-center">
                      <span className="text-xs text-gray-400">Precio</span>
                      <strong className="text-xl text-blue-600">${parseFloat(it.price || 0).toFixed(2)}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

    </div>
  );
}

export default Dashboard;