import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { useOrders } from "../context/OrderContext";

function formatPrice(price) {
    return Number(price).toLocaleString("ru-RU");
}

function getStatusLabel(status) {
    switch (status) {
        case "pending":
        return "Kutilmoqda";
        case "accepted":
        return "Qabul qilindi";
        case "delivered":
        return "Yetkazildi";
        case "cancelled":
        return "Bekor qilindi";
        default:
        return status;
    }
}

export default function ActiveOrdersPage() {
    const { orders, updateOrderStatus, deleteOrder, loadingOrders } = useOrders();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    
    const filteredOrders = useMemo(() => {
        let data = orders.filter((order) => order.status !== "delivered");
        
        if (statusFilter !== "all") {
            data = data.filter((order) => order.status === statusFilter);
        }
        
        if (search.trim()) {
            data = data.filter((order) =>
                order.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
            order.customer?.phone?.includes(search)
        );
    }
    
    return data;
}, [orders, search, statusFilter]);

async function handleStatusChange(orderId, newStatus) {
    const result = await updateOrderStatus(orderId, newStatus);
    
    if (result && result.success === false) {
        toast.error("Statusni o‘zgartirishda xatolik");
        return;
    }
    
    toast.success("Status yangilandi");
}

async function handleDeleteOrder(orderId) {
    if (!window.confirm("Buyurtmani o‘chirmoqchimisiz?")) return;
    
    const result = await deleteOrder(orderId);
    
    if (result && result.success === false) {
        toast.error("Buyurtmani o‘chirishda xatolik");
        return;
    }
    
    toast.success("Buyurtma o‘chirildi");
}

return (
    <AdminLayout title="Faol buyurtmalar">
    <div className="admin-toolbar">
    <input
    type="text"
    placeholder="Ism yoki telefon bo‘yicha qidirish"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    />
    
    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
    <option value="all">Barcha statuslar</option>
    <option value="pending">Kutilmoqda</option>
    <option value="accepted">Qabul qilindi</option>
    <option value="cancelled">Bekor qilindi</option>
    </select>
    </div>
    
    {loadingOrders ? (
        <div className="empty-orders">Yuklanmoqda...</div>
    ) : filteredOrders.length === 0 ? (
        <div className="empty-orders">Faol buyurtmalar yo‘q</div>
    ) : (
        <div className="orders-list">
        {filteredOrders.map((order) => (
            <div className="order-card" key={order.id}>
            <div className="order-top">
            <h4>
            <Link to={`/admin/orders/${order.id}`}>Buyurtma #{order.id}</Link>
            </h4>
            <span className={`order-status status-${order.status}`}>
            {getStatusLabel(order.status)}
            </span>
            </div>
            
            <div className="order-info">
            <p><strong>Ism:</strong> {order.customer?.name}</p>
            <p><strong>Telefon:</strong> {order.customer?.phone}</p>
            <p><strong>Manzil:</strong> {order.customer?.address}</p>
            <p><strong>Sana:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Jami:</strong> {formatPrice(order.totalPrice)} so'm</p>
            </div>
            
            <div className="order-actions">
            <select
            className="order-select"
            value={order.status}
            onChange={(e) => handleStatusChange(order.id, e.target.value)}
            >
            <option value="pending">Kutilmoqda</option>
            <option value="accepted">Qabul qilindi</option>
            <option value="delivered">Yetkazildi</option>
            <option value="cancelled">Bekor qilindi</option>
            </select>
            
            <button className="delete-order-btn" onClick={() => handleDeleteOrder(order.id)}>
            O‘chirish
            </button>
            </div>
            </div>
        ))}
        </div>
    )}
    </AdminLayout>
);
}