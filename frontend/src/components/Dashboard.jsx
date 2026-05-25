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

  const role =
    typeof window !== 'undefined'
      ? localStorage.getItem('role') || 'visitante'
      : 'visitante';

  const fallbackWhatsApp = '593998887765';

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await getAll('products');
        setItems(data || []);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const alLimpiarFiltros = () => {
    setCategoriaActiva('todas');
    setBusqueda('');
  };

  // FILTRAR PRODUCTOS
  const itemsFiltrados = items.filter((it) => {
    const cumpleCategoria =
      categoriaActiva === 'todas' ||
      (it.category || '').toLowerCase() ===
        categoriaActiva.toLowerCase();

    const textoNombre = (it.name || it.title || '').toLowerCase();
    const textoDesc = (it.description || '').toLowerCase();

    const cumpleBusqueda =
      textoNombre.includes(busqueda.toLowerCase()) ||
      textoDesc.includes(busqueda.toLowerCase());

    return cumpleCategoria && cumpleBusqueda;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* CONTENEDOR */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* SIDEBAR */}
          <SidebarFilters
            categoriaActiva={categoriaActiva}
            setCategoriaActiva={setCategoriaActiva}
            alLimpiarFiltros={alLimpiarFiltros}
          />

          {/* CONTENIDO */}
          <main className="flex-1">

            {/* HEADER */}
            <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Emprendimientos SWES
                    
                  </h1>

                  <p className="text-sm text-gray-500 mt-1">
                    Explora productos y servicios de estudiantes
                  </p>
                </div>

                {role !== 'visitante' ? (
                  <button
                    onClick={() => navigate('/admin/products/new')}
                    className="bg-[#00665c] hover:bg-[#004d45] text-white px-5 py-2 rounded-lg transition"
                  >
                    + Registrar
                  </button>
                ) : (
                  <div className="text-sm bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-lg">
                    Modo visitante
                  </div>
                )}
              </div>
            </div>

            {/* BUSCADOR */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Buscar emprendimientos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#00665c]"
              />
            </div>

            {/* LOADING */}
            {loading ? (
              <div className="text-center py-10 text-gray-500">
                Cargando emprendimientos...
              </div>
            ) : itemsFiltrados.length === 0 ? (
              <div className="bg-white rounded-xl border p-10 text-center text-gray-500">
                No se encontraron resultados.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {itemsFiltrados.map((it) => {
                  const rawPhone =
                    it.sellerPhone ||
                    it.phone ||
                    it.telefono ||
                    fallbackWhatsApp;

                  const phoneNumber = rawPhone.replace(/\D/g, '');

                  return (
                    <div
                      key={it.id}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm border hover:shadow-lg transition"
                    >
                      {/* IMAGEN */}
                      <div className="h-52 bg-gray-200 overflow-hidden">
                        {it.image || it.imagen ? (
                          <img
                            src={it.image || it.imagen}
                            alt={it.name || it.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            Sin imagen
                          </div>
                        )}
                      </div>

                      {/* INFO */}
                      <div className="p-5 flex flex-col gap-3">

                        {/* TITULO */}
                        <div className="flex justify-between items-start gap-2">
                          <h2 className="font-bold text-lg text-gray-800">
                            {it.name || it.title}
                          </h2>

                          {it.category && (
                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                              {it.category}
                            </span>
                          )}
                        </div>

                        {/* DESCRIPCION */}
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {it.description ||
                            'Sin descripción disponible'}
                        </p>

                        {/* VENDEDOR */}
                        <div className="text-sm text-gray-500">
                          <span className="font-semibold text-gray-700">
                            Vendedor:
                          </span>{' '}
                          {it.sellerName || it.nombre || 'Anónimo'}
                        </div>

                        {/* WHATSAPP */}
                        <a
                          href={`https://wa.me/${phoneNumber}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
                        >
                          <FaWhatsapp className="text-2xl" />

                          <span>
                            {rawPhone}
                          </span>
                        </a>

                        {/* PRECIO */}
                        <div className="border-t pt-3 flex justify-between items-center mt-2">
                          <span className="text-gray-500 text-sm">
                            Precio
                          </span>

                          <span className="text-xl font-bold text-[#00665c]">
                            ${parseFloat(it.price || 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
