import React, { createContext, useContext, useMemo, useState } from "react";

const CategoryContext = createContext(null);

const initialCategories = [
    { id: 1, key: "fruit", label: "Mevalar" },
    { id: 2, key: "drink", label: "Ichimliklar" },
    { id: 3, key: "sweet", label: "Shirinliklar" },
];

function slugifyCategory(text) {
    return text
    .toLowerCase()
    .trim()
    .replace(/g‘/g, "g")
    .replace(/g'/g, "g")
    .replace(/o‘/g, "o")
    .replace(/o'/g, "o")
    .replace(/sh/g, "sh")
    .replace(/ch/g, "ch")
    .replace(/ng/g, "ng")
    .replace(/['`’"]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function CategoryProvider({ children }) {
    const [categories, setCategories] = useState(() => {
        const saved = localStorage.getItem("categories");
        return saved ? JSON.parse(saved) : initialCategories;
    });
    
    React.useEffect(() => {
        localStorage.setItem("categories", JSON.stringify(categories));
    }, [categories]);
    
    function addCategory(label) {
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
        
        const newCategory = {
            id: Date.now(),
            key,
            label: trimmed,
        };
        
        setCategories((prev) => [...prev, newCategory]);
        return { success: true };
    }
    
    function deleteCategory(id) {
        setCategories((prev) => prev.filter((item) => item.id !== id));
    }
    
    function getCategoryLabel(categoryKey) {
        const found = categories.find((item) => item.key === categoryKey);
        return found ? found.label : categoryKey;
    }
    
    const value = useMemo(
        () => ({
            categories,
            addCategory,
            deleteCategory,
            getCategoryLabel,
        }),
        [categories]
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