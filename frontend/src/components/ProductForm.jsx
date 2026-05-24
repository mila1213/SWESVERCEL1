import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createResource, getById, updateResource } from '../services/crudService';
// Simple client-side image handling (File -> data URL)

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', price: '', image: '' });
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const item = await getById('products', id);
          setForm({ title: item.title || '', description: item.description || '', price: item.price || '', image: item.image || '' });
        } catch (err) {
          console.error(err);
        }
      })();
    }
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({ ...f, image: reader.result }));
    };
    reader.onerror = (err) => {
      console.error('Error leyendo archivo:', err);
      alert('Error al leer la imagen');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await updateResource('products', id, form);
      } else {
        await createResource('products', form);
      }
      navigate('/admin/products');
    } catch (err) {
      console.error(err);
      alert('Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>{id ? 'Editar producto' : 'Nuevo producto'}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Título
          <input name="title" value={form.title} onChange={handleChange} required />
        </label>
        <label>
          Descripción
          <textarea name="description" value={form.description} onChange={handleChange} />
        </label>
        <label>
          Precio
          <input name="price" value={form.price} onChange={handleChange} />
        </label>
        <label>
          Imagen (archivo)
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>
        <label>
          O Imagen (URL)
          <input name="image" value={form.image} onChange={handleChange} placeholder="https://..." />
        </label>
        
        {form.image && (
          <div style={{ marginTop: 8 }}>
            <img src={form.image} alt="preview" style={{ maxWidth: 220, maxHeight: 160, objectFit: 'cover' }} />
          </div>
        )}
        <button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
      </form>
    </div>
  );
}
export default  ProductForm;