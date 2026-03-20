import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

const OrderContext = createContext(null);

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

export function OrderProvider({ children }) {
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    
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
        
        const channel = supabase
        .channel("orders-realtime")
        .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "orders" },
            () => {
                fetchOrders();
            }
        )
        .subscribe();
        
        return () => {
            supabase.removeChannel(channel);
        };
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
            return { success: false, message: error.message };
        }
        
        return { success: true };
    }
    
    async function updateOrderStatus(orderId, newStatus) {
        const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);
        
        if (error) {
            return { success: false, message: error.message };
        }
        
        return { success: true };
    }
    
    async function deleteOrder(orderId) {
        const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);
        
        if (error) {
            return { success: false, message: error.message };
        }
        
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
    
    return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrders() {
    return useContext(OrderContext);
}