import React from 'react';
import { Globe, Cpu, ShoppingBag, BookOpen, MoreHorizontal, RefreshCw } from 'lucide-react';

function SidebarFilters({ categoriaActiva, setCategoriaActiva, alLimpiarFiltros }) {
  const categorias = [
    { id: 'Comida', label: 'Comida y Snacks', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'Tecnología', label: 'Tecnología / Software', icon: <Cpu className="w-4 h-4" /> },
    { id: 'Ropa', label: 'Ropa y Accesorios', icon: <MoreHorizontal className="w-4 h-4" /> },
    { id: 'Servicios', label: 'Servicios Académicos / Tutorías', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'Otros', label: 'Otros', icon: <Globe className="w-4 h-4" /> },
  ];

  return (
    <div className="w-full flex items-center gap-2 overflow-x-auto pb-2 select-none">
      <button
        onClick={() => setCategoriaActiva('todas')}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap shrink-0 transition-all border ${categoriaActiva === 'todas' ? 'border-blue-200 bg-blue-50 text-blue-900 font-bold' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
      >
        <Globe className="w-4 h-4" />
        Todas las Categorías
      </button>

      {categorias.map((cat) => {
        const isActive = categoriaActiva === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => setCategoriaActiva(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap shrink-0 transition-all border ${isActive ? 'border-blue-200 bg-blue-50 text-blue-900 font-bold' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
          >
            {cat.icon}
            {cat.label}
          </button>
        );
      })}

    </div>
  );
}

export default SidebarFilters;