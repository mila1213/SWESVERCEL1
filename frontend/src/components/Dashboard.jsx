import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAll } from '../services/crudService';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  return (
    <div>
      <header>
        <h2>Dashboard</h2>
      </header>

      <main>
        <p>Productos y servicios ofrecidos por estudiantes:</p>
        <button onClick={() => navigate('/admin/products/new')}>Añadir publicación</button>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <ul>
              {items.length === 0 && <li>No hay publicaciones aún.</li>}
              {items.map((it) => (
                <li key={it.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
                  {it.image && <img src={it.image} alt={it.title} style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 6 }} />}
                  <div>
                    <strong>{it.title}</strong> — {it.price}
                    <div>{it.description}</div>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </main>
    </div>
  );
}
