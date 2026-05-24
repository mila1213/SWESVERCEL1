import React, { useEffect, useState } from 'react';
import { getAll, deleteResource } from '../services/crudService';
import { Link, useNavigate } from 'react-router-dom';

 function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAll('products');
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
    if (!confirm('¿Eliminar este producto?')) return;
    try {
      await deleteResource('products', id);
      await load();
    } catch (err) {
      console.error(err);
      alert('Error al eliminar');
    }
  };

  return (
    <div>
      <header>
        <h2>Productos</h2>
        <button onClick={() => navigate('/admin/products/new')}>Publicar</button>
      </header>

      <main>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <ul>
            {products.map((p) => (
                <li key={p.id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  {p.image && <img src={p.image} alt={p.title} style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 6 }} />}
                  <div style={{ flex: 1 }}>
                    <strong>{p.title}</strong> - {p.price}
                    <div>{p.description}</div>
                  </div>
                  <div>
                    <Link to={`/admin/products/edit/${p.id}`}>Editar</Link>
                    <button onClick={() => handleDelete(p.id)}>Eliminar</button>
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