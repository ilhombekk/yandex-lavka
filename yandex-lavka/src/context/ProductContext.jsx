import React, { createContext, useContext, useState, useEffect } from "react";
import { initialProducts } from "../data/products"; // Agar boshlang‘ich mahsulotlar bo‘lsa

const ProductContext = createContext();

export function ProductProvider({ children }) {
    const [products, setProducts] = useState(() => {
        const saved = localStorage.getItem("products");
        return saved ? JSON.parse(saved) : initialProducts || [];
    });
    
    useEffect(() => {
        localStorage.setItem("products", JSON.stringify(products));
    }, [products]);
    
    const addProduct = (product) => {
        const newProduct = { ...product, id: Date.now() };
        setProducts((prev) => [...prev, newProduct]);
    };
    
    const updateProduct = (updatedProduct) => {
        setProducts((prev) =>
            prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
};

const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
};

return (
    <ProductContext.Provider
    value={{ products, addProduct, updateProduct, deleteProduct }}
    >
    {children}
    </ProductContext.Provider>
);
}

export function useProducts() {
    return useContext(ProductContext);
}