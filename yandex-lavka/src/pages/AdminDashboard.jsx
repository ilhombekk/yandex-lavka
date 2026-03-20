import React, { useMemo } from "react";
import AdminLayout from "../components/AdminLayout";
import { useProducts } from "../context/ProductContext";
import { useOrders } from "../context/OrderContext";

function formatPrice(price) {
    return Number(price).toLocaleString("ru-RU");
}

export default function AdminDashboard() {
    const { products } = useProducts();
    const { orders, loadingOrders } = useOrders();
    
    const stats = useMemo(() => {
        const totalProducts = products.length;
        const totalOrders = orders.length;
        const pendingOrders = orders.filter((o) => o.status === "pending").length;
        const acceptedOrders = orders.filter((o) => o.status === "accepted").length;
        const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
        const cancelledOrders = orders.filter((o) => o.status === "cancelled").length;
        
        const totalRevenue = orders
        .filter((o) => o.status === "delivered")
        .reduce((sum, o) => sum + Number(o.totalPrice || 0), 0);
        
        const todayOrders = orders.filter((o) => {
            const d = new Date(o.createdAt);
            const now = new Date();
            return d.toDateString() === now.toDateString();
        }).length;
        
        return {
            totalProducts,
            totalOrders,
            pendingOrders,
            acceptedOrders,
            deliveredOrders,
            cancelledOrders,
            totalRevenue,
            todayOrders,
        };
    }, [products, orders]);
    
    return (
        <AdminLayout title="Dashboard">
        {loadingOrders ? (
            <div className="empty-orders">Yuklanmoqda...</div>
        ) : (
            <div className="stats-grid">
            <div className="stat-card"><p>Bugungi buyurtmalar</p><h3>{stats.todayOrders}</h3></div>
            <div className="stat-card"><p>Jami mahsulotlar</p><h3>{stats.totalProducts}</h3></div>
            <div className="stat-card"><p>Jami buyurtmalar</p><h3>{stats.totalOrders}</h3></div>
            <div className="stat-card"><p>Kutilmoqda</p><h3>{stats.pendingOrders}</h3></div>
            <div className="stat-card"><p>Qabul qilindi</p><h3>{stats.acceptedOrders}</h3></div>
            <div className="stat-card"><p>Yetkazildi</p><h3>{stats.deliveredOrders}</h3></div>
            <div className="stat-card"><p>Bekor qilindi</p><h3>{stats.cancelledOrders}</h3></div>
            <div className="stat-card revenue-card">
            <p>Umumiy tushum</p>
            <h3>{formatPrice(stats.totalRevenue)} so'm</h3>
            </div>
            </div>
        )}
        </AdminLayout>
    );
}