import React from "react";

function formatPrice(price) {
    return Number(price).toLocaleString("ru-RU");
}

export default function CartDrawer({
    isOpen,
    closeCart,
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    totalPrice,
    onCheckout,
}) {
    return (
        <>
        <aside className={`cart ${isOpen ? "open" : ""}`}>
        <div className="cart-header">
        <h2>Savatcha</h2>
        <button className="close-btn" onClick={closeCart}>
        ✕
        </button>
        </div>
        
        <div className="cart-items">
        {cart.length === 0 ? (
            <p className="empty-cart">Savatcha bo'sh</p>
        ) : (
            cart.map((item) => (
                <div className="cart-item" key={item.id}>
                <div className="cart-item-top">
                <div>
                <h4>{item.name}</h4>
                <p>{formatPrice(item.price)} so'm</p>
                </div>
                <strong>{formatPrice(item.price * item.quantity)} so'm</strong>
                </div>
                
                <div className="cart-controls">
                <div className="qty-controls">
                <button onClick={() => decreaseQuantity(item.id)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => increaseQuantity(item.id)}>+</button>
                </div>
                
                <button
                className="remove-btn"
                onClick={() => removeFromCart(item.id)}
                >
                O'chirish
                </button>
                </div>
                </div>
            ))
        )}
        </div>
        
        <div className="cart-footer">
        <h3>Jami: {formatPrice(totalPrice)} so'm</h3>
        
        {cart.length > 0 && (
            <button className="checkout-btn" onClick={onCheckout}>
            Sotib olish
            </button>
        )}
        </div>
        </aside>
        
        <div
        className={`overlay ${isOpen ? "show" : ""}`}
        onClick={closeCart}
        />
        </>
    );
}