import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    
    function normalizeOrders(data) {
        return (data || []).map((order) => ({
            id: order.id,
            createdAt: order.created_at,
            status: order.status,
            totalPrice: Number(order.total_price),
            customer: {
                name: order.customer_name,
                phone: order.customer_phone,
                address: order.customer_address,
            },
            items: order.items || [],
        }));
    }
    
    async function fetchOrders() {
        setLoadingOrders(true);
        
        const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
        
        if (error) {
            console.error("Orders fetch error:", error.message);
            setLoadingOrders(false);
            return;
        }
        
        setOrders(normalizeOrders(data));
        setLoadingOrders(false);
    }
    
    useEffect(() => {
        fetchOrders();
    }, []);
    
    async function createOrder(orderData) {
        const { error } = await supabase.from("orders").insert([
            {
                customer_name: orderData.customer.name,
                customer_phone: orderData.customer.phone,
                customer_address: orderData.customer.address,
                items: orderData.items,
                total_price: orderData.totalPrice,
                status: "pending",
            },
        ]);
        
        if (error) {
            console.error("Create order error:", error.message);
            return { success: false, message: error.message };
        }
        
        await fetchOrders();
        return { success: true };
    }
    
    async function updateOrderStatus(orderId, newStatus) {
        const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);
        
        if (error) {
            console.error("Update order status error:", error.message);
            return { success: false, message: error.message };
        }
        
        await fetchOrders();
        return { success: true };
    }
    
    async function deleteOrder(orderId) {
        const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);
        
        if (error) {
            console.error("Delete order error:", error.message);
            return { success: false, message: error.message };
        }
        
        await fetchOrders();
        return { success: true };
    }
    
    const value = useMemo(
        () => ({
            orders,
            loadingOrders,
            fetchOrders,
            createOrder,
            updateOrderStatus,
            deleteOrder,
        }),
        [orders, loadingOrders]
    );
    
    return (
        <OrderContext.Provider value={value}>
        {children}
        </OrderContext.Provider>
    );
}

export function useOrders() {
    return useContext(OrderContext);
}