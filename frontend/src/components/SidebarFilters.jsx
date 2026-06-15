import React from 'react';
import { FiGlobe, FiCpu, FiShoppingBag, FiBookOpen, FiMoreHorizontal, FiRefreshCw } from 'react-icons/fi';

function SidebarFilters({ categoriaActiva, setCategoriaActiva, alLimpiarFiltros }) {
  const categorias = [
    { id: 'Comida', label: 'Comida y Snacks', icon: <FiShoppingBag className="w-5 h-5" /> },
    { id: 'Tecnología', label: 'Tecnología / Software', icon: <FiCpu className="w-5 h-5" /> },
    { id: 'Ropa', label: 'Ropa y Accesorios', icon: <FiMoreHorizontal className="w-5 h-5" /> },
    { id: 'Servicios', label: 'Servicios Académicos / Tutorías', icon: <FiBookOpen className="w-5 h-5" /> },
    { id: 'Otros', label: 'Otros', icon: <FiGlobe className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-full bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-6 select-none h-fit shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">Filtros</h2>
        <button onClick={alLimpiarFiltros} className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-2">
          <FiRefreshCw className="w-4 h-4" />
          Limpiar
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">Categorías</span>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setCategoriaActiva('todas')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left border ${categoriaActiva === 'todas' ? 'border-blue-200 bg-blue-50 text-blue-900 font-bold' : 'border-transparent hover:border-gray-100 text-gray-600'}`}
          >
            <FiGlobe className="w-5 h-5 text-gray-500" />
            <span className="truncate">Todas las Categorías</span>
          </button>

          {categorias.map((cat) => {
            const isActive = categoriaActiva === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategoriaActiva(cat.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left border ${isActive ? 'border-blue-200 bg-blue-50 text-blue-900 font-bold' : 'border-transparent hover:border-gray-100 text-gray-600'}`}
              >
                <span className="text-gray-600">{cat.icon}</span>
                <span className="truncate">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

    </aside>
  );
}

export default SidebarFilters;