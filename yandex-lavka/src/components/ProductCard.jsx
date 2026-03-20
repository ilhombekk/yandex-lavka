import React from "react";

function formatPrice(price) {
    return Number(price).toLocaleString("ru-RU");
}

function getCategoryName(category) {
    switch (category) {
        case "fruit":
        return "Mevalar";
        case "drink":
        return "Ichimliklar";
        case "sweet":
        return "Shirinliklar";
        default:
        return category;
    }
}

export default function ProductCard({ product, addToCart }) {
    return (
        <div className="card">
        <img src={product.image} alt={product.name} />
        <h3>{product.name}</h3>
        <p>{getCategoryName(product.category)}</p>
        
        <div className="card-bottom">
        <strong>{formatPrice(product.price)} so'm</strong>
        <button onClick={() => addToCart(product.id)}>Qo'shish</button>
        </div>
        </div>
    );
}