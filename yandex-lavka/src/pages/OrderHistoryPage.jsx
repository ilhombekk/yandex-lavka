import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import AdminLayout from "../components/AdminLayout";
import { useOrders } from "../context/OrderContext";

function formatPrice(price) {
    return Number(price).toLocaleString("ru-RU");
}

export default function OrderHistoryPage() {
    const { orders, deleteOrder, loadingOrders } = useOrders();
    const [search, setSearch] = useState("");
    
    const deliveredOrders = useMemo(() => {
        let data = orders.filter((order) => order.status === "delivered");
        
        if (search.trim()) {
            data = data.filter((order) =>
                order.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
            order.customer?.phone?.includes(search)
        );
    }
    
    return data;
}, [orders, search]);

async function handleDeleteOrder(orderId) {
    if (!window.confirm("Tarixdan o‘chirmoqchimisiz?")) return;
    
    const result = await deleteOrder(orderId);
    
    if (result && result.success === false) {
        toast.error("O‘chirishda xatolik");
        return;
    }
    
    toast.success("Tarixdan o‘chirildi");
}

return (
    <AdminLayout title="Buyurtmalar tarixi">
    <div className="admin-toolbar">
    <input
    type="text"
    placeholder="Ism yoki telefon bo‘yicha qidirish"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    />
    </div>
    
    {loadingOrders ? (
        <div className="empty-orders">Yuklanmoqda...</div>
    ) : deliveredOrders.length === 0 ? (
        <div className="empty-orders">Yetkazilgan buyurtmalar yo‘q</div>
    ) : (
        <div className="orders-list">
        {deliveredOrders.map((order) => (
            <div className="order-card history-card" key={order.id}>
            <div className="order-top">
            <h4>Buyurtma #{order.id}</h4>
            <span className="order-status status-delivered">Yetkazildi</span>
            </div>
            
            <div className="order-info">
            <p><strong>Ism:</strong> {order.customer?.name}</p>
            <p><strong>Telefon:</strong> {order.customer?.phone}</p>
            <p><strong>Manzil:</strong> {order.customer?.address}</p>
            <p><strong>Sana:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Jami:</strong> {formatPrice(order.totalPrice)} so'm</p>
            </div>
            
            <div className="order-actions">
            <button className="delete-order-btn" onClick={() => handleDeleteOrder(order.id)}>
            Tarixdan o‘chirish
            </button>
            </div>
            </div>
        ))}
        </div>
    )}
    </AdminLayout>
);
}