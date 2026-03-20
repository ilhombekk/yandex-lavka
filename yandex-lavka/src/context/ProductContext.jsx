import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    
    function normalizeProducts(data) {
        return (data || []).map((item) => ({
            id: item.id,
            name: item.name,
            category: item.category,
            type: item.type || "",
            price: Number(item.price),
            image: item.image || "",
            createdAt: item.created_at,
        }));
    }
    
    async function fetchProducts() {
        setLoadingProducts(true);
        
        const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
        
        if (error) {
            console.error("Products fetch error:", error.message);
            setLoadingProducts(false);
            return;
        }
        
        setProducts(normalizeProducts(data));
        setLoadingProducts(false);
    }
    
    useEffect(() => {
        fetchProducts();
    }, []);
    
    async function addProduct(product) {
        const { error } = await supabase.from("products").insert([
            {
                name: product.name,
                category: product.category,
                type: product.type || "",
                price: Number(product.price),
                image: product.image,
            },
        ]);
        
        if (error) {
            console.error("Add product error:", error.message);
            return { success: false, message: error.message };
        }
        
        await fetchProducts();
        return { success: true };
    }
    
    async function updateProduct(updatedProduct) {
        const { error } = await supabase
        .from("products")
        .update({
            name: updatedProduct.name,
            category: updatedProduct.category,
            type: updatedProduct.type || "",
            price: Number(updatedProduct.price),
            image: updatedProduct.image,
        })
        .eq("id", updatedProduct.id);
        
        if (error) {
            console.error("Update product error:", error.message);
            return { success: false, message: error.message };
        }
        
        await fetchProducts();
        return { success: true };
    }
    
    async function deleteProduct(id) {
        const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);
        
        if (error) {
            console.error("Delete product error:", error.message);
            return { success: false, message: error.message };
        }
        
        await fetchProducts();
        return { success: true };
    }
    
    const value = useMemo(
        () => ({
            products,
            loadingProducts,
            fetchProducts,
            addProduct,
            updateProduct,
            deleteProduct,
        }),
        [products, loadingProducts]
    );
    
    return (
        <ProductContext.Provider value={value}>
        {children}
        </ProductContext.Provider>
    );
}

export function useProducts() {
    return useContext(ProductContext);
}