import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductContext";
import { useOrders } from "../context/OrderContext";

function formatPrice(price) {
    return Number(price).toLocaleString("ru-RU");
}

export default function AdminDashboard() {
    const { logout } = useAuth();
    const { products } = useProducts();
    const { orders, loadingOrders } = useOrders();
    
    const stats = useMemo(() => {
        const totalProducts = products.length;
        const totalOrders = orders.length;
        const pendingOrders = orders.filter((order) => order.status === "pending").length;
        const acceptedOrders = orders.filter((order) => order.status === "accepted").length;
        const deliveredOrders = orders.filter((order) => order.status === "delivered").length;
        const cancelledOrders = orders.filter((order) => order.status === "cancelled").length;
        
        const totalRevenue = orders
        .filter((order) => order.status === "delivered")
        .reduce((sum, order) => sum + Number(order.totalPrice || 0), 0);
        
        return {
            totalProducts,
            totalOrders,
            pendingOrders,
            acceptedOrders,
            deliveredOrders,
            cancelledOrders,
            totalRevenue,
        };
    }, [products, orders]);
    
    function handleLogout() {
        logout();
    }
    
    return (
        <div className="admin-page">
        <div className="container">
        <div className="admin-top">
        <h2 className="admin-title">Admin Dashboard</h2>
        
        <div className="admin-top-actions">
        <Link to="/" className="back-link">
        User sahifa
        </Link>
        
        <button className="logout-btn" onClick={handleLogout}>
        Chiqish
        </button>
        </div>
        </div>
        
        {loadingOrders ? (
            <div className="empty-orders">Yuklanmoqda...</div>
        ) : (
            <>
            <div className="stats-grid">
            <div className="stat-card">
            <p>Jami mahsulotlar</p>
            <h3>{stats.totalProducts}</h3>
            </div>
            
            <div className="stat-card">
            <p>Jami buyurtmalar</p>
            <h3>{stats.totalOrders}</h3>
            </div>
            
            <div className="stat-card">
            <p>Kutilmoqda</p>
            <h3>{stats.pendingOrders}</h3>
            </div>
            
            <div className="stat-card">
            <p>Qabul qilindi</p>
            <h3>{stats.acceptedOrders}</h3>
            </div>
            
            <div className="stat-card">
            <p>Yetkazildi</p>
            <h3>{stats.deliveredOrders}</h3>
            </div>
            
            <div className="stat-card">
            <p>Bekor qilindi</p>
            <h3>{stats.cancelledOrders}</h3>
            </div>
            
            <div className="stat-card revenue-card">
            <p>Umumiy tushum</p>
            <h3>{formatPrice(stats.totalRevenue)} so'm</h3>
            </div>
            </div>
            
            <div className="admin-section">
            <h3 className="section-title-admin">Tezkor bo‘limlar</h3>
            
            <div className="quick-links">
            <Link to="/admin/products" className="quick-link-card">
            <h4>Mahsulotlar</h4>
            <p>Mahsulot qo‘shish, tahrirlash va o‘chirish</p>
            </Link>
            
            <Link to="/admin/orders" className="quick-link-card">
            <h4>Faol buyurtmalar</h4>
            <p>Jarayondagi buyurtmalarni boshqarish</p>
            </Link>
            
            <Link to="/admin/history" className="quick-link-card">
            <h4>Buyurtmalar tarixi</h4>
            <p>Yetkazilgan buyurtmalarni ko‘rish</p>
            </Link>
            </div>
            </div>
            </>
        )}
        </div>
        </div>
    );
}