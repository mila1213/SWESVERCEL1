import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const role = typeof window !== 'undefined' ? (localStorage.getItem('role') || 'visitante').toLowerCase() : 'visitante';

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Solo admin puede acceder a usuarios y estadísticas
  const adminOnlyPaths = ['/admin/users', '/admin/stats'];
  const isAdminOnly = adminOnlyPaths.some((path) => location.pathname.startsWith(path));
  if (isAdminOnly && role !== 'administrador') {
    return <Navigate to="/dashboard" replace />;
  }

  // Visitantes no pueden acceder a nada de /admin
  if (role === 'visitante' && location.pathname.startsWith('/admin')) {
    return <Navigate to="/dashboard" replace />;
  }

  // Emprendedor puede acceder a /admin/products (crear, editar, ver sus productos)
  // Admin puede acceder a todo

  return children;
}

export default ProtectedRoute;