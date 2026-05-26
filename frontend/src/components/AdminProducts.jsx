import { useEffect, useState } from 'react';
import {
  getAll,
  getByUserId,
  deleteResource
} from '../services/crudService';

import {
  Link,
  useNavigate
} from 'react-router-dom';

function AdminProducts() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const role =
    localStorage.getItem('role') || 'visitante';

  const miUid =
    localStorage.getItem('uid');

  const load = async () => {

    setLoading(true);

    try {

      let data = [];

      // ADMINISTRADOR
      if (role === 'administrador') {

        data = await getAll('products');

      }

      // EMPRENDEDOR
      else if (role === 'emprendedor') {

        data = await getByUserId(miUid);

      }

      setProducts(data || []);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    load();

  }, []);

  const handleDelete = async (id) => {

    const confirmacion = confirm(
      '¿Seguro que deseas eliminar este producto?'
    );

    if (!confirmacion) return;

    try {

      await deleteResource('products', id);

      await load();

    } catch (err) {

      console.error(err);

      alert('Error al eliminar');

    }
  };

  return (

    <div className="min-h-screen bg-neutral-bg">

      <div className="max-w-6xl mx-auto px-6 py-10">

        <div className="flex items-center justify-between mb-8">

          <div>

            <h1 className="text-2xl font-bold text-neutral-text">

              {role === 'administrador'
                ? 'Panel Administrativo'
                : 'Mis Emprendimientos'}

            </h1>

            <p className="text-sm text-neutral-muted mt-1">

              {role === 'administrador'
                ? 'Gestiona todos los productos del sistema'
                : 'Gestiona tus productos publicados'}

            </p>

          </div>

          {role !== 'visitante' && (

            <button
              onClick={() => navigate('/admin/products/new')}
              className="bg-brand-primary hover:bg-brand-hover
                         text-white px-5 py-2.5 rounded-btn"
            >
              Nuevo Producto
            </button>

          )}

        </div>

        {loading ? (

          <div className="text-center py-20">
            Cargando productos...
          </div>

        ) : products.length === 0 ? (

          <div className="bg-white border rounded-2xl p-10 text-center">

            <p className="text-lg font-semibold text-gray-700">
              No existen productos
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {products.map((p) => (

              <div
                key={p.id}
                className="bg-white border rounded-2xl overflow-hidden shadow-sm"
              >

                <div className="h-52 bg-gray-200">

                  {p.image ? (

                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />

                  ) : (

                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Sin imagen
                    </div>

                  )}

                </div>

                <div className="p-5">

                  <div className="flex justify-between items-start mb-3">

                    <div>

                      <h2 className="font-bold text-lg text-gray-800">
                        {p.name}
                      </h2>

                      <p className="text-sm text-gray-500">
                        ${p.price}
                      </p>

                    </div>

                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                      {p.category}
                    </span>

                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {p.description || 'Sin descripción'}
                  </p>

                  <div className="text-sm text-gray-500 mb-5">

                    <p>
                      <strong>Vendedor:</strong>{' '}
                      {p.sellerName || 'No disponible'}
                    </p>

                    <p>
                      <strong>Teléfono:</strong>{' '}
                      {p.sellerPhone || 'No disponible'}
                    </p>

                  </div>

                  <div className="flex gap-2">

                    <Link
                      to={`/admin/products/edit/${p.id}`}
                      className="flex-1 text-center border border-gray-300
                                 py-2 rounded-xl hover:bg-gray-50"
                    >
                      Editar
                    </Link>

                    <button
                      onClick={() => handleDelete(p.id)}
                      className="flex-1 bg-red-500 hover:bg-red-600
                                 text-white py-2 rounded-xl"
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