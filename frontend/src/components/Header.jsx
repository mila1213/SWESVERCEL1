import { useNavigate, Link } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('uid');
    localStorage.removeItem('token'); 
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm text-gray-700">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo / Nombre de la plataforma */}
        <Link to="/dashboard" className="text-xl font-bold text-blue-600 hover:text-blue-700 transition">
          SWES 
        </Link>

        {/* Enlaces para moverse entre módulos */}
        <div className="flex items-center gap-6">
          <Link 
            to="/dashboard" 
            className="text-sm font-medium hover:text-blue-600 transition"
          >
            Inicio
          </Link>
          
          <Link 
            to="/admin/products" 
            className="text-sm font-medium hover:text-blue-600 transition"
          >
            Mis Productos
          </Link>

          <button 
            onClick={handleLogout}
            className="ml-2 px-3 py-1.5 border border-red-200 text-red-600 rounded text-xs font-semibold hover:bg-red-50 transition"
          >
            Cerrar Sesión
          </button>
        </div>

      </div>
    </nav>
  );
}

export default Header;