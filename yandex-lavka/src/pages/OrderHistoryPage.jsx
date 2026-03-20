import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useOrders } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext";

function formatPrice(price) {
    return Number(price).toLocaleString("ru-RU");
}

export default function OrderHistoryPage() {
    const { orders, deleteOrder, loadingOrders } = useOrders();
    const { logout } = useAuth();
    
    const deliveredOrders = useMemo(() => {
        return orders.filter((order) => order.status === "delivered");
    }, [orders]);
    
    function handleLogout() {
        logout();
    }
    
    async function handleDeleteOrder(orderId) {
        const isConfirmed = window.confirm("Tarixdan o‘chirmoqchimisiz?");
        if (!isConfirmed) return;
        
        const result = await deleteOrder(orderId);
        
        if (result && result.success === false) {
            alert("Buyurtmani o‘chirishda xatolik bo‘ldi");
        }
    }
    
    return (
        <div className="admin-page">
        <div className="container">
        <div className="admin-top">
        <h2 className="admin-title">Buyurtmalar tarixi</h2>
        
        <div className="admin-top-actions">
        <Link to="/admin" className="back-link">
        Dashboard
        </Link>
        
        <Link to="/admin/products" className="back-link">
        Mahsulotlar
        </Link>
        
        <Link to="/admin/orders" className="back-link">
        Faol buyurtmalar
        </Link>
        
        <button className="logout-btn" onClick={handleLogout}>
        Chiqish
        </button>
        </div>
        </div>
        
        {loadingOrders ? (
            <div className="empty-orders">Yuklanmoqda...</div>
        ) : deliveredOrders.length === 0 ? (
            <div className="empty-orders">
            Hozircha yetkazilgan buyurtmalar yo‘q
            </div>
        ) : (
            <div className="orders-list">
            {deliveredOrders.map((order) => (
                <div className="order-card history-card" key={order.id}>
                <div className="order-top">
                <h4>Buyurtma #{order.id}</h4>
                <span className="order-status status-delivered">
                Yetkazildi
                </span>
                </div>
                
                <div className="order-info">
                <p>
                <strong>Ism:</strong> {order.customer?.name}
                </p>
                <p>
                <strong>Telefon:</strong> {order.customer?.phone}
                </p>
                <p>
                <strong>Manzil:</strong> {order.customer?.address}
                </p>
                <p>
                <strong>Sana:</strong> {new Date(order.createdAt).toLocaleString()}
                </p>
                <p>
                <strong>Jami:</strong> {formatPrice(order.totalPrice)} so'm
                </p>
                </div>
                
                <div className="order-products">
                <h5>Mahsulotlar:</h5>
                
                {order.items?.map((item, index) => (
                    <div className="order-product-item" key={`${item.id}-${index}`}>
                    <span>
                    {item.name} x {item.quantity}
                    </span>
                    <strong>
                    {formatPrice(item.price * item.quantity)} so'm
                    </strong>
                    </div>
                ))}
                </div>
                
                <div className="order-actions">
                <button
                className="delete-order-btn"
                onClick={() => handleDeleteOrder(order.id)}
                >
                Tarixdan o‘chirish
                </button>
                </div>
                </div>
            ))}
            </div>
        )}
        </div>
        </div>
    );
}