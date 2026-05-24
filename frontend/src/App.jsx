import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import VerifyAccount from "./components/VerifyAccount";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Dashboard from "./components/Dashboard";
import AdminProducts from "./components/AdminProducts";
import ProductForm from "./components/ProductForm";
import Header from "./components/Header"; // <-- Importamos tu Header
import "./index.css";
import "./App.css";

function AppInner() {
  const location = useLocation();
  
  // Rutas exactas de autenticación donde NO queremos ver el Header
  const authRoutes = ["/", "/login", "/register", "/verify", "/forgot-password"];
  
  // Ocultamos si es una ruta de auth o si empieza con el token de reset
  const hideNav = authRoutes.includes(location.pathname) || location.pathname.startsWith("/reset-password/");

  return (
    <main>
      {/* Si el usuario está logueado, el Header se pintará hermoso arriba */}
      {!hideNav && <Header />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<VerifyAccount />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/products/new" element={<ProductForm />} />
        <Route path="/admin/products/edit/:id" element={<ProductForm />} />
      </Routes>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}