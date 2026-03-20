import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useProducts } from "./ProductContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const { products } = useProducts();
    
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem("cart");
        return saved ? JSON.parse(saved) : [];
    });
    
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);
    
    function addToCart(id) {
        const numericId = Number(id);
        
        const product = products.find((item) => Number(item.id) === numericId);
        
        if (!product) {
            return;
        }
        
        setCart((prev) => {
            const existing = prev.find((item) => Number(item.id) === numericId);
            
            if (existing) {
                return prev.map((item) =>
                    Number(item.id) === numericId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
        }
        
        return [...prev, { ...product, quantity: 1 }];
    });
}

function increaseQuantity(id) {
    const numericId = Number(id);
    
    setCart((prev) =>
        prev.map((item) =>
            Number(item.id) === numericId
    ? { ...item, quantity: item.quantity + 1 }
    : item
)
);
}

function decreaseQuantity(id) {
    const numericId = Number(id);
    
    setCart((prev) =>
        prev
    .map((item) =>
        Number(item.id) === numericId
    ? { ...item, quantity: item.quantity - 1 }
    : item
)
.filter((item) => item.quantity > 0)
);
}

function removeFromCart(id) {
    const numericId = Number(id);
    
    setCart((prev) =>
        prev.filter((item) => Number(item.id) !== numericId)
);
}

function clearCart() {
    setCart([]);
}

const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
);

const totalPrice = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0),
    [cart]
);

const value = useMemo(
    () => ({
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        totalPrice,
    }),
    [cart, cartCount, totalPrice, products]
);

return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    return useContext(CartContext);
}