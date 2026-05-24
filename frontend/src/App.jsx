import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import VerifyAccount from "./components/VerifyAccount";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Dashboard from "./components/Dashboard";
import AdminProducts from "./components/AdminProducts";
import ProductForm from "./components/ProductForm";
import "./index.css";
import "./App.css";

function AppInner() {
  const location = useLocation();
  const hideNav = ["/", "/login", "/register", "/verify", "/forgot-password", "/reset-password"].some((p) => location.pathname.startsWith(p));

  return (
    <main>
      {!hideNav && (
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/admin/products">Productos</Link>
        </nav>
      )}

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

