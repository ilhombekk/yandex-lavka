import React, { createContext, useContext, useMemo, useState } from "react";

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
    const [orders, setOrders] = useState(() => {
        const savedOrders = localStorage.getItem("orders");
        return savedOrders ? JSON.parse(savedOrders) : [];
    });
    
    React.useEffect(() => {
        localStorage.setItem("orders", JSON.stringify(orders));
    }, [orders]);
    
    function createOrder(orderData) {
        const newOrder = {
            id: Date.now(),
            createdAt: new Date().toLocaleString(),
            status: "pending",
            ...orderData,
        };
        
        setOrders((prev) => [newOrder, ...prev]);
    }
    
    function updateOrderStatus(orderId, newStatus) {
        setOrders((prev) =>
            prev.map((order) =>
                order.id === orderId ? { ...order, status: newStatus } : order
    )
);
}

function deleteOrder(orderId) {
    setOrders((prev) => prev.filter((order) => order.id !== orderId));
}

const value = useMemo(
    () => ({
        orders,
        createOrder,
        updateOrderStatus,
        deleteOrder,
    }),
    [orders]
);

return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
);
}

export function useOrders() {
    return useContext(OrderContext);
}