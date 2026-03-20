import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import ActiveOrdersPage from "./pages/ActiveOrdersPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import ProductsPage from "./pages/ProductsPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/admin-login" element={<AdminLoginPage />} />
    
    <Route
    path="/admin"
    element={
      <ProtectedRoute>
      <AdminDashboard />
      </ProtectedRoute>
    }
    />
    
    <Route
    path="/admin/products"
    element={
      <ProtectedRoute>
      <ProductsPage />
      </ProtectedRoute>
    }
    />
    
    <Route
    path="/admin/orders"
    element={
      <ProtectedRoute>
      <ActiveOrdersPage />
      </ProtectedRoute>
    }
    />
    
    <Route
    path="/admin/history"
    element={
      <ProtectedRoute>
      <OrderHistoryPage />
      </ProtectedRoute>
    }
    />
    
    <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}