
import { useEffect, useState } from 'react';
import { getByUserId, deleteResource } from '../services/crudService';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Header';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
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
    <div className="min-h-screen bg-neutral-bg">
      

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-neutral-text">Mis Emprendimientos</h1>
            <p className="text-sm text-neutral-muted mt-1">Gestiona y publica tus proyectos</p>
          </div>
          <button
            onClick={() => navigate('/admin/products/new')}
            className="flex items-center gap-2 bg-brand-primary hover:bg-brand-hover text-white
                       font-semibold text-sm px-4 py-2.5 rounded-btn transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Publicar Nuevo
          </button>
        </div>

        {/* Contenido */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-neutral-muted">Cargando emprendimientos...</p>
            </div>
          </div>

        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-full bg-brand-panel flex items-center justify-center">
              <svg className="w-8 h-8 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72M6.75 18h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .414.336.75.75.75z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-neutral-text font-semibold">Aún no tienes emprendimientos</p>
              <p className="text-sm text-neutral-muted mt-1">Publica tu primer proyecto y empieza a crecer</p>
            </div>
            <button
              onClick={() => navigate('/admin/products/new')}
              className="flex items-center gap-2 bg-brand-primary hover:bg-brand-hover text-white
                         font-semibold text-sm px-4 py-2.5 rounded-btn transition-all mt-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Publicar ahora
            </button>
          </div>

        ) : (
          <div className="flex flex-col gap-3">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-neutral-surface border border-neutral-border rounded-card px-6 py-4
                           flex items-center justify-between hover:shadow-form transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-input bg-brand-panel flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-text">{p.name}</p>
                    <p className="text-xs text-neutral-muted mt-0.5">${p.price}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin/products/edit/${p.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
                               border border-neutral-border text-neutral-subtle rounded-input
                               hover:bg-neutral-bg hover:text-neutral-text transition-all"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                    </svg>
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
                               border border-red-200 text-red-500 rounded-input
                               hover:bg-red-50 transition-all"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
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
