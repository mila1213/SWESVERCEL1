import { useEffect, useState } from 'react';
import { getByUserId, deleteResource } from '../services/crudService';
import { Link, useNavigate } from 'react-router-dom';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    // Recuperamos el ID que guardamos en el login
    const miUid = localStorage.getItem('uid');
    
    try {
      if (miUid) {
        const data = await getByUserId(miUid);
        setProducts(data || []);
      } else {
        console.warn("No hay usuario logueado");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar este emprendimiento?')) return;
    try {
      await deleteResource('products', id);
      await load();
    } catch (err) { alert('Error al eliminar'); }
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md text-gray-800">
      <header className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-700">Mis Emprendimientos</h2>
        <button onClick={() => navigate('/admin/products/new')} className="px-4 py-2 bg-blue-600 text-white rounded">+ Publicar Nuevo</button>
      </header>

      <main>
        {loading ? <p>Cargando...</p> : products.length === 0 ? (
          <p>No tienes productos publicados.</p>
        ) : (
          <ul>
            {products.map((p) => (
              <li key={p.id} className="p-4 border-b flex justify-between items-center">
                <div>
                  <strong>{p.name}</strong> - ${p.price}
                </div>
                <div className="flex gap-2">
                  <Link to={`/admin/products/edit/${p.id}`} className="bg-amber-500 text-white px-3 py-1 rounded">Editar</Link>
                  <button onClick={() => handleDelete(p.id)} className="bg-red-600 text-white px-3 py-1 rounded">Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
export default AdminProducts;