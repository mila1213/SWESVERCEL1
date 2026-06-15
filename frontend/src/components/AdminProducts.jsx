import { useEffect, useState } from 'react';
import {
  getAll,
  getByUserId,
  deleteResource
} from '../services/crudService';

import {
  Link,
  useNavigate,
  useLocation
} from 'react-router-dom';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ mostrar: false, texto: '', tipo: '' });
  const [modalEliminar, setModalEliminar] = useState({ abierto: false, productoId: null });

  const navigate = useNavigate();
  const location = useLocation();
  const role = (localStorage.getItem('role') || 'visitante').toLowerCase();
  const miUid = localStorage.getItem('uid') || '';
  const token = localStorage.getItem('token') || '';

  const mostrarToast = (texto, tipo = 'success') => {
    setToast({ mostrar: true, texto, tipo });
    setTimeout(() => {
      setToast({ mostrar: false, texto: '', tipo: '' });
    }, 3000);
  };

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) {
        throw new Error('No hay token. Por favor inicia sesión.');
      }

      if (!miUid) {
        throw new Error('No hay UID. Por favor inicia sesión nuevamente.');
      }

      let data = [];

      if (role === 'administrador') {
        // Admin: ver TODOS los productos
        data = await getAll('products');
      } else if (role === 'emprendedor') {
        // Emprendedor: ver solo SUS productos
        data = await getByUserId('products', miUid);
      } else {
        throw new Error(`Rol no permitido: ${role}`);
      }

      setProducts(data || []);

    } catch (err) {
      console.error('Error al cargar productos:', err);
      let mensaje = err.message || 'Error desconocido';
      if (err.response?.status === 401) {
        mensaje = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
      } else if (err.response?.status === 403) {
        mensaje = 'No tienes permisos para ver estos productos.';
      }
      setError(mensaje);
      mostrarToast(mensaje, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Se ejecuta cada vez que la ruta cambia a /admin/products
    if (location.pathname === '/admin/products') {
      console.log('Navegando a AdminProducts, recargando productos...');
      load();
    }
  }, [location.pathname]);

  const confirmarEliminar = (id) => {
    setModalEliminar({ abierto: true, productoId: id });
  };

  const handleExecuteDelete = async () => {
    const id = modalEliminar.productoId;
    setModalEliminar({ abierto: false, productoId: null });

    try {
      await deleteResource('products', id);
      mostrarToast('Producto eliminado correctamente', 'success');
      await load();
    } catch (err) {
      console.error(err);
      mostrarToast('No se pudo eliminar el producto', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8]">
      {/* TOAST */}
      {toast.mostrar && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border transition-all duration-300 ${
            toast.tipo === 'error'
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-green-50 border-green-200 text-green-700'
          }`}
        >
          <p className="text-sm font-semibold">{toast.texto}</p>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN */}
      {modalEliminar.abierto && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center flex flex-col gap-4">
            <h3 className="text-lg font-bold text-gray-800">Confirmar eliminación</h3>
            <p className="text-sm text-gray-600">¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setModalEliminar({ abierto: false, productoId: null })}
                className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleExecuteDelete}
                className="flex-1 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* HEADER */}
        <div className="bg-white border border-gray-200 rounded-2xl px-8 py-7 mb-6 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Emprendimientos</h1>
            <p className="text-sm text-gray-600 mt-1">
              {role === 'administrador' ? 'Gestiona todos los productos del sistema' : 'Gestiona y edita tus emprendimientos'}
            </p>
          </div>

          {role !== 'visitante' && (
            <button
              onClick={() => navigate('/admin/products/new')}
              className="bg-blue-900 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:shadow transition-all duration-200"
            >
              Publicar Emprendimiento
            </button>
          )}
        </div>

        {/* CONTENIDO PRINCIPAL */}
        {loading ? (
          <div className="bg-white border rounded-2xl p-16 text-center">
            <p className="text-gray-500 font-medium">Cargando emprendimientos...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
            <p className="text-red-700 font-bold text-lg mb-4">Error al cargar</p>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={() => {
                setError(null);
                load();
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Reintentar
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-16 text-center">
            <p className="text-gray-700 font-semibold text-lg">No hay emprendimientos</p>
            <p className="text-gray-500 mt-2">Crea tu primer emprendimiento haciendo clic en el botón de arriba</p>
            {role !== 'visitante' && (
              <button
                onClick={() => navigate('/admin/products/new')}
                className="mt-6 bg-blue-900 hover:bg-blue-800 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:shadow transition-all duration-200"
              >
                Crear Primer Emprendimiento
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col h-full">
                {/* IMAGEN */}
                <img src={p.image} alt={p.name} className="h-40 w-full object-cover rounded-xl mb-4" />
                
                {/* CONTENIDO */}
                <h2 className="text-lg font-bold text-gray-800">{p.name}</h2>
                <p className="text-sm text-gray-600 mt-1 mb-2 line-clamp-3 leading-relaxed">{p.description}</p>
                <p className="font-semibold text-lg text-blue-900 mb-3">${p.price}</p>

                <div className="mt-auto">

                {/* INFO DEL VENDEDOR */}
                <div className="bg-gray-50 p-3 rounded-lg mb-3 text-sm text-gray-700">
                  <p><strong>Vendedor:</strong> {p.sellerName || p.sellername || 'No disponible'}</p>
                  <p><strong>Teléfono:</strong> {p.sellerPhone || p.sellerphone || 'No disponible'}</p>
                </div>

                {/* BOTONES - Siempre aparecen (emprendedor solo ve sus productos, admin ve todos) */}
                <div className="flex gap-2 mt-4">
                  <Link
                    to={`/admin/products/edit/${p.id}`}
                    className="flex-1 text-center bg-blue-50 text-blue-600 py-2 rounded-lg text-xs font-bold hover:bg-blue-100 transition"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => confirmarEliminar(p.id)}
                    className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-xs font-bold hover:bg-red-100 transition"
                  >
                    Eliminar
                  </button>
                </div>
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
