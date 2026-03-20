import React, { createContext, useContext, useMemo, useState } from "react";
import { useProducts } from "./ProductContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const { products } = useProducts();
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem("cart");
        return saved ? JSON.parse(saved) : [];
    });
    
    React.useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);
    
    function addToCart(id) {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === id);
            
            if (existing) {
                return prev.map((item) =>
                    item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            );
        }
        
        const product = products.find((item) => item.id === id);
        if (!product) return prev;
        
        return [...prev, { ...product, quantity: 1 }];
    });
}

function increaseQuantity(id) {
    setCart((prev) =>
        prev.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
)
);
}

function decreaseQuantity(id) {
    setCart((prev) =>
        prev
    .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
)
.filter((item) => item.quantity > 0)
);
}

function removeFromCart(id) {
    setCart((prev) => prev.filter((item) => item.id !== id));
}

function clearCart() {
    setCart([]);
}

const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
);

const totalPrice = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
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
    [cart, cartCount, totalPrice]
);

return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    return useContext(CartContext);
}