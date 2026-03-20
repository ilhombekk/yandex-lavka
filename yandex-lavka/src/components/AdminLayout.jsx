import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout({ title, children }) {
    const { logout } = useAuth();
    
    return (
        <div className="admin-shell">
        <aside className="admin-sidebar">
        <h2 className="admin-brand">Shovot Lavka</h2>
        
        <nav className="admin-nav">
        <NavLink to="/admin" end className="admin-nav-link">
        Dashboard
        </NavLink>
        <NavLink to="/admin/products" className="admin-nav-link">
        Mahsulotlar
        </NavLink>
        <NavLink to="/admin/orders" className="admin-nav-link">
        Faol buyurtmalar
        </NavLink>
        <NavLink to="/admin/history" className="admin-nav-link">
        Buyurtmalar tarixi
        </NavLink>
        </nav>
        
        <div className="admin-sidebar-bottom">
        <NavLink to="/" className="admin-nav-link">
        User sahifa
        </NavLink>
        <button className="logout-btn" onClick={logout}>
        Chiqish
        </button>
        </div>
        </aside>
        
        <main className="admin-content">
        <div className="admin-page-header">
        <h1>{title}</h1>
        </div>
        {children}
        </main>
        </div>
    );
}