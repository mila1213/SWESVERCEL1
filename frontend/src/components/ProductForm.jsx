import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createResource, getById, updateResource } from '../services/crudService';

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', image: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const item = await getById('products', id);
          setForm({ 
            name: item.name || item.title || '', 
            description: item.description || '', 
            price: item.price || '', 
            category: item.category || '',
            image: item.image || item.imagen || '' 
          });
        } catch (err) {
          console.error(err);
        }
      })();
    }
  }, [id]);

  const validateField = (name, value) => {
    let errorMsg = '';
    if (name === 'name' && !value.trim()) {
      errorMsg = 'El nombre del producto/servicio es obligatorio.';
    }
    if (name === 'price') {
      if (!value) {
        errorMsg = 'El precio es obligatorio.';
      } else if (isNaN(value) || parseFloat(value) <= 0) {
        errorMsg = 'Ingresa un precio válido y mayor a 0.';
      }
    }
    if (name === 'category' && !value) {
      errorMsg = 'Debes seleccionar una categoría para tu emprendimiento.';
    }

    // Solo actualiza errores si el campo requiere validación activa
    if (['name', 'price', 'category'].includes(name)) {
      setErrors(prev => ({ ...prev, [name]: errorMsg }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (file.size > 1500000) {
      setErrors(prev => ({ ...prev, image: 'La imagen es muy pesada. Máximo 1.5MB o usa un enlace URL.' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({ ...f, image: reader.result }));
      setErrors(prev => ({ ...prev, image: '' }));
    };
    reader.onerror = (err) => {
      console.error('Error leyendo archivo:', err);
      alert('Error al leer la imagen');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const tempErrors = {};
    if (!form.name.trim()) tempErrors.name = 'El nombre es obligatorio.';
    if (!form.price || isNaN(form.price) || parseFloat(form.price) <= 0) tempErrors.price = 'El precio debe ser mayor a 0.';
    if (!form.category) tempErrors.category = 'La categoría es obligatoria.';

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    setLoading(true);
    try {
      const userId = localStorage.getItem('uid') || 'anonimo';
      
      // Armamos el objeto final asegurando que envíe tanto 'image' como 'imagen' por compatibilidad con tu BD
      const payload = { 
        ...form, 
        userId,
        imagen: form.image // Duplicamos el campo temporalmente para asegurar el tiro en el backend
      };

      // 👁️ TRUCO DE ESPÍA: Mira tu consola del navegador al dar click en Publicar
      console.log("🚀 ¡REVISANDO PAYLOAD JUSTO ANTES DE MANDAR AL BACKEND!", payload);

      if (id) {
        await updateResource('products', id, payload);
      } else {
        await createResource('products', payload);
      }
      navigate('/admin/products');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.mensaje || 'Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto my-8 p-6 bg-white rounded-lg shadow-md text-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
        {id ? 'Editar Producto / Servicio' : 'Nuevo Emprendimiento'}
      </h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-sm">Nombre del Emprendimiento / Producto</label>
          <input 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            placeholder="Ej. Delivery de Almuerzos Poli" 
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-semibold text-sm">Categoría</label>
          <select 
            name="category" 
            value={form.category} 
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">-- Selecciona una categoría --</option>
            <option value="Comida">Comida y Snacks</option>
            <option value="Tecnología">Tecnología / Software</option>
            <option value="Ropa">Ropa y Accesorios</option>
            <option value="Servicios">Servicios Académicos / Tutorías</option>
            <option value="Otros">Otros</option>
          </select>
          {errors.category && <span className="text-red-500 text-xs mt-1">{errors.category}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-semibold text-sm">Precio ($)</label>
          <input 
            name="price" 
            type="number" 
            step="0.01" 
            value={form.price} 
            onChange={handleChange} 
            placeholder="0.00" 
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.price && <span className="text-red-500 text-xs mt-1">{errors.price}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-semibold text-sm">Descripción</label>
          <textarea 
            name="description" 
            value={form.description} 
            onChange={handleChange} 
            placeholder="Cuéntales a tus compañeros de qué trata..." 
            rows="3" 
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="p-4 border border-dashed border-gray-300 rounded-lg flex flex-col gap-3 bg-gray-50">
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm">Imagen del producto (Archivo)</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm">O pega la URL de la imagen</label>
            <input 
              name="image" 
              value={form.image} 
              onChange={handleChange} 
              placeholder="https://ejemplo.com/imagen.jpg" 
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            />
          </div>
          {errors.image && <span className="text-red-500 text-xs mt-1">{errors.image}</span>}
        </div>
        
        {form.image && (
          <div className="text-center mt-2 p-2 border border-gray-200 rounded bg-gray-50">
            <p className="text-xs text-gray-500 mb-1">Vista previa:</p>
            <img src={form.image} alt="preview" className="max-w-full h-40 mx-auto object-contain rounded shadow-sm" />
          </div>
        )}

        {/* CONTENEDOR DE BOTONES DOBLES */}
        <div className="flex gap-3 mt-2">
          <button 
            type="button"
            onClick={() => navigate('/admin/products')}
            className="flex-1 p-3 border border-gray-300 text-gray-700 font-bold rounded hover:bg-gray-50 transition text-center"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={loading} 
            className="flex-1 p-3 bg-blue-600 text-white font-bold rounded shadow hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando...' : 'Publicar Emprendimiento'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;