import React from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { useOrders } from "../context/OrderContext";

function formatPrice(price) {
    return Number(price).toLocaleString("ru-RU");
}

export default function OrderDetailsPage() {
    const { id } = useParams();
    const { orders } = useOrders();
    
    const order = orders.find((item) => String(item.id) === String(id));
    
    if (!order) {
        return (
            <AdminLayout title="Buyurtma tafsiloti">
            <div className="empty-orders">Buyurtma topilmadi</div>
            </AdminLayout>
        );
    }
    
    return (
        <AdminLayout title={`Buyurtma #${order.id}`}>
        <div className="order-card">
        <div className="order-info">
        <p><strong>Ism:</strong> {order.customer?.name}</p>
        <p><strong>Telefon:</strong> {order.customer?.phone}</p>
        <p><strong>Manzil:</strong> {order.customer?.address}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Sana:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        <p><strong>Jami:</strong> {formatPrice(order.totalPrice)} so'm</p>
        </div>
        
        <div className="order-products">
        <h5>Mahsulotlar:</h5>
        {order.items?.map((item, index) => (
            <div className="order-product-item" key={`${item.id}-${index}`}>
            <span>{item.name} x {item.quantity}</span>
            <strong>{formatPrice(item.price * item.quantity)} so'm</strong>
            </div>
        ))}
        </div>
        </div>
        </AdminLayout>
    );
}