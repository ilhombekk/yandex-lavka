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
        <aside className={`cart-drawer ${isOpen ? "open" : ""}`}>
        <div className="cart-header">
        <div>
        <h2>Savatcha</h2>
        <p>{cart.length} ta mahsulot</p>
        </div>
        <button className="close-btn" onClick={closeCart}>
        ✕
        </button>
        </div>
        
        <div className="cart-body">
        {cart.length === 0 ? (
            <div className="empty-cart-state">
            <h3>Savatcha bo‘sh</h3>
            <p>Mahsulot qo‘shsangiz shu yerda ko‘rinadi.</p>
            </div>
        ) : (
            cart.map((item) => (
                <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} />
                
                <div className="cart-item-info">
                <h4>{item.name}</h4>
                <p>{formatPrice(item.price)} so'm</p>
                
                <div className="cart-item-actions">
                <div className="qty-controls">
                <button onClick={() => decreaseQuantity(item.id)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => increaseQuantity(item.id)}>+</button>
                </div>
                
                <button
                className="remove-btn"
                onClick={() => removeFromCart(item.id)}
                >
                O‘chirish
                </button>
                </div>
                </div>
                </div>
            ))
        )}
        </div>
        
        <div className="cart-footer">
        <div className="cart-total">
        <span>Jami</span>
        <strong>{formatPrice(totalPrice)} so'm</strong>
        </div>
        
        <button
        className="checkout-btn"
        onClick={onCheckout}
        disabled={cart.length === 0}
        >
        Buyurtma berish
        </button>
        </div>
        </aside>
        
        <div
        className={`cart-overlay ${isOpen ? "show" : ""}`}
        onClick={closeCart}
        />
        </>
    );
}