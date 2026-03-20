import React from "react";
import { useCategories } from "../context/CategoryContext";

export default function Categories({ selectedCategory, setSelectedCategory }) {
    const { categories } = useCategories();
    
    return (
        <section className="categories">
        <button
        className={`category-btn ${selectedCategory === "all" ? "active" : ""}`}
        onClick={() => setSelectedCategory("all")}
        >
        Barchasi
        </button>
        
        {categories.map((item) => (
            <button
            key={item.id}
            className={`category-btn ${
                selectedCategory === item.key ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(item.key)}
            >
            {item.label}
            </button>
        ))}
        </section>
    );
}