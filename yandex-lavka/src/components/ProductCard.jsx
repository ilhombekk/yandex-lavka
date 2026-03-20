import React from "react";

function formatPrice(price) {
    return Number(price).toLocaleString("ru-RU");
}

export default function ProductCard({ product, addToCart }) {
    return (
        <div className="product-card">
        <div className="product-image-wrap">
        <img src={product.image} alt={product.name} className="product-image" />
        <span className="product-badge">{product.type || "Mahsulot"}</span>
        </div>
        
        <div className="product-content">
        <div className="product-head">
        <h3>{product.name}</h3>
        <p>{product.category}</p>
        </div>
        
        <div className="product-footer">
        <strong>{formatPrice(product.price)} so'm</strong>
        <button onClick={() => addToCart(product.id)}>Qo‘shish</button>
        </div>
        </div>
        </div>
    );
}