import { useEffect, useState } from 'react';
import {
  getAll,
  getByUserId,
  deleteResource
} from '../services/crudService';
import { auth } from '../../firebase';

import {
  Link,
  useNavigate
} from 'react-router-dom';

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ESTADOS PARA ALERTAS INTUITIVAS
  const [toast, setToast] = useState({ mostrar: false, texto: '', tipo: '' });
  const [modalEliminar, setModalEliminar] = useState({ abierto: false, productoId: null });

  
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  

  const navigate = useNavigate();
  const role = localStorage.getItem('role') || 'visitante';
  const miUid = localStorage.getItem('uid') || auth.currentUser?.uid || '';

  // Función para disparar notificaciones que desaparecen solas
  const mostrarToast = (texto, tipo = 'success') => {
    setToast({ mostrar: true, texto, tipo });
    setTimeout(() => {
      setToast({ mostrar: false, texto: '', tipo: '' });
    }, 3000);
  };

  const load = async () => {
    setLoading(true);
    try {
      let data = [];
      if (role === 'administrador') {
        data = await getAll('products');
      } else if (role === 'emprendedor') {
        if (!miUid) {
          console.warn('UID de usuario no disponible en localStorage ni auth.currentUser.');
          throw new Error('No se encontró el identificador de usuario. Inicia sesión de nuevo.');
        }
        data = await getByUserId('products', miUid);
      }
      setProducts(data || []);
    } catch (err) {
      console.error(err);
      mostrarToast('Error al cargar los productos', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INICIO EJEMPLO: Función y efecto para cargar stats del back
  // ==========================================================
  const loadStats = async () => {
    if (role !== 'administrador') return;
    setLoadingStats(true);
    try {
      // Usamos el token guardado para pasar la seguridad del backend
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/admin/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Error al cargar métricas de simulación:', err);
    } finally {
      setLoadingStats(false);
    }
  };
  // ==========================================================
  // FIN EJEMPLO

  useEffect(() => {
    load();
    // ==========================================================
    // INICIO EJEMPLO: Ejecutar la carga al montar el componente
    // ==========================================================
    loadStats();
    // ==========================================================
    // FIN EJEMPLO
  }, []);

  // Abre el modal moderno en vez del "confirm" nativo
  const confirmarEliminar = (id) => {
    setModalEliminar({ abierto: true, productoId: id });
  };

  // Ejecuta la eliminación real si acepta en el modal
  const handleExecuteDelete = async () => {
    const id = modalEliminar.productoId;
    setModalEliminar({ abierto: false, productoId: null });

    try {
      await deleteResource('products', id);
      mostrarToast('Producto eliminado correctamente', 'success');
      await load();
      // ==========================================================
      // INICIO EJEMPLO: Recargar métricas si se borra un producto
      // ==========================================================
      await loadStats();
      // ==========================================================
      // FIN EJEMPLO
    } catch (err) {
      console.error(err);
      mostrarToast('No se pudo eliminar el producto', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-bg relative">
      
      {/* TOAST NOTIFICACIÓN FLOTANTE (INTUITIVO) */}
      {toast.mostrar && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border transition-all duration-300 animate-bounce ${
          toast.tipo === 'error' 
            ? 'bg-red-50 border-red-200 text-red-700' 
            : 'bg-green-50 border-green-200 text-green-700'
        }`}>
          <span>{toast.tipo === 'error' ? '⚠️' : '✅'}</span>
          <p className="text-sm font-semibold">{toast.texto}</p>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN MODERNO (REEMPLAZA AL CONFIRM) */}
      {modalEliminar.abierto && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center flex flex-col gap-4 border border-gray-100">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-2xl mx-auto">
              🗑️
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">¿Eliminar producto?</h3>
              <p className="text-sm text-gray-500 mt-1">
                Esta acción no se puede deshacer. El producto desaparecerá del sistema.
              </p>
            </div>
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setModalEliminar({ abierto: false, productoId: null })}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleExecuteDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition text-sm"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-neutral-text">
              {role === 'administrador' ? 'Panel Administrativo' : 'Mis Emprendimientos'}
            </h1>
            <p className="text-sm text-neutral-muted mt-1">
              {role === 'administrador' ? 'Gestiona todos los productos del sistema' : 'Gestiona tus productos publicados'}
            </p>
          </div>

          {role !== 'visitante' && (
            <button
              onClick={() => navigate('/admin/products/new')}
              className="bg-brand-primary hover:bg-brand-hover text-white px-5 py-2.5 rounded-btn transition-colors"
            >
              Nuevo Producto
            </button>
          )}
        </div>

        
       {role === 'administrador' && !loadingStats && stats && (
        
        <div className="flex flex-col gap-6 mb-8">
          
          {/* Fila superior — 3 tarjetas */}
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between min-h-[140px] border-l-4 border-l-violet-500">
              <div>
                <p className="text-md font-bold text-black uppercase tracking-wider mb-2">Total usuarios</p>
                <p className="text-md text-slate-400 font-semibold">Cuentas registradas en SWES</p>
              </div>
              <h3 className="text-3xl font-black text-slate-800 mt-4">{stats.totalUsers}</h3>
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between min-h-[140px] border-l-4 border-l-teal-500">
              <div>
                <p className="text-md font-bold text-black uppercase tracking-wider mb-2">Emprendimientos activos</p>
                <p className="text-md text-slate-400 font-semibold">Visibles en el catálogo público</p>
              </div>
              <h3 className="text-3xl font-black text-slate-800 mt-4">{stats.totalProducts}</h3>
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between min-h-[140px] border-l-4 border-l-amber-500">
              <div>
                <p className="text-md font-bold text-black uppercase tracking-wider mb-2">Valor del catálogo</p>
                <p className="text-md text-slate-400 font-semibold">Métricas comerciales SWES</p>
              </div>
              <h3 className="text-3xl font-black text-slate-800 mt-4">${stats.totalValue}</h3>
            </div>
          </div>
          
          {/* Fila inferior — Donut grande */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-xl font-bold text-slate-700 mb-6">Distribución general de SWES</h3>
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="w-90 h-90 shrink-0 ml-20">
                <Doughnut
                data={{
                  labels: ['Usuarios', 'Productos', 'Valor'],
                  datasets: [{
                    data: [stats.totalUsers, stats.totalProducts, stats.totalValue],
                    backgroundColor: ['#534AB7', '#1D9E75', '#EF9F27'],
                    borderWidth: 0,
                    hoverOffset: 6,
                  }]
                }}
                
                options={{
                  cutout: '72%',
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.raw}` }
                    }
                  }
                }}
                />
              </div>
              <div className="flex flex-col gap-8 flex-1 w-full">
                {[
                  { label: 'Total usuarios', value: stats.totalUsers, color: '#534AB7', bg: 'bg-violet-50', text: 'text-violet-700' },
                  { label: 'Productos activos', value: stats.totalProducts, color: '#1D9E75', bg: 'bg-teal-50', text: 'text-teal-700' },
                  { label: 'Valor catálogo', value: `$${stats.totalValue}`, color: '#EF9F27', bg: 'bg-amber-50', text: 'text-amber-700' },
                
                ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <p className="text-lg text-slate-500">{item.label}</p>
                    
                  </div>
                  <span className={`text-lg font-black px-3 py-1 rounded-lg ${item.bg} ${item.text}`}>
                    {item.value}
                  </span>
                </div>))}
              </div>
              
            </div>
          </div>
        </div>
      )}
        

        {loading ? (
          <div className="text-center py-20 text-gray-500 font-medium">
            Cargando productos...
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white border rounded-2xl p-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-gray-500">No existen productos registrados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p.id} className="bg-white border rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                <div>
                  <div className="h-52 bg-gray-100 border-b">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Sin imagen</div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <div>
                        <h2 className="font-bold text-lg text-gray-800 line-clamp-1">{p.name}</h2>
                        <p className="text-base font-semibold text-[#00665c] mt-0.5">${Number(p.price).toFixed(2)}</p>
                      </div>
                      <span className="bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                        {p.category}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px]">
                      {p.description || 'Sin descripción'}
                    </p>

                    <div className="text-xs bg-gray-50 p-3 rounded-xl text-gray-600 flex flex-col gap-1 mb-2">
                      <p><strong className="text-gray-700">Vendedor:</strong> {p.sellerName || 'No disponible'}</p>
                      <p><strong className="text-gray-700">Celular:</strong> {p.sellerPhone || 'No disponible'}</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex gap-3">
                  <Link
                    to={`/admin/products/edit/${p.id}`}
                    className="flex-1 text-center border border-gray-300 text-gray-700 font-medium py-2 rounded-xl hover:bg-gray-50 transition text-sm"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => confirmarEliminar(p.id)} // Llama al modal moderno
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-xl transition text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProducts;