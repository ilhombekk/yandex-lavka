import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

const CategoryContext = createContext(null);

function slugifyCategory(text) {
    return text
    .toLowerCase()
    .trim()
    .replace(/g‘/g, "g")
    .replace(/g'/g, "g")
    .replace(/o‘/g, "o")
    .replace(/o'/g, "o")
    .replace(/['`’"]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function CategoryProvider({ children }) {
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    
    async function fetchCategories() {
        setLoadingCategories(true);
        
        const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: true });
        
        if (error) {
            console.error("Categories fetch error:", error.message);
            setLoadingCategories(false);
            return;
        }
        
        setCategories(data || []);
        setLoadingCategories(false);
    }
    
    useEffect(() => {
        fetchCategories();
    }, []);
    
    async function addCategory(label) {
        const trimmed = label.trim();
        
        if (!trimmed) {
            return { success: false, message: "Kategoriya nomi bo‘sh bo‘lmasin" };
        }
        
        const key = slugifyCategory(trimmed);
        
        if (!key) {
            return { success: false, message: "Kategoriya nomi noto‘g‘ri" };
        }
        
        const exists = categories.some(
            (item) =>
                item.label.toLowerCase() === trimmed.toLowerCase() || item.key === key
        );
        
        if (exists) {
            return { success: false, message: "Bu kategoriya allaqachon mavjud" };
        }
        
        const { error } = await supabase.from("categories").insert([
            {
                key,
                label: trimmed,
            },
        ]);
        
        if (error) {
            console.error("Add category error:", error.message);
            return { success: false, message: error.message };
        }
        
        await fetchCategories();
        return { success: true };
    }
    
    async function deleteCategory(id) {
        const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);
        
        if (error) {
            console.error("Delete category error:", error.message);
            return { success: false, message: error.message };
        }
        
        await fetchCategories();
        return { success: true };
    }
    
    function getCategoryLabel(categoryKey) {
        const found = categories.find((item) => item.key === categoryKey);
        return found ? found.label : categoryKey;
    }
    
    const value = useMemo(
        () => ({
            categories,
            loadingCategories,
            fetchCategories,
            addCategory,
            deleteCategory,
            getCategoryLabel,
        }),
        [categories, loadingCategories]
    );
    
    return (
        <CategoryContext.Provider value={value}>
        {children}
        </CategoryContext.Provider>
    );
}

export function useCategories() {
    return useContext(CategoryContext);
}