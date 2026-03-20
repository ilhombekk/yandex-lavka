import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { useAuth } from "../context/AuthContext";
import { useCategories } from "../context/CategoryContext";

const emptyForm = {
    name: "",
    category: "",
    type: "",
    price: "",
    image: "",
};

function formatPrice(price) {
    return Number(price).toLocaleString("ru-RU");
}

export default function ProductsPage() {
    const { products, addProduct, updateProduct, deleteProduct } = useProducts();
    const { logout } = useAuth();
    const { categories, addCategory, deleteCategory, getCategoryLabel } = useCategories();
    
    const [form, setForm] = useState({
        ...emptyForm,
        category: categories[0]?.key || "",
    });
    
    const [editingId, setEditingId] = useState(null);
    const [newCategory, setNewCategory] = useState("");
    
    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }
    
    function handleSubmit(e) {
        e.preventDefault();
        
        if (
            !form.name.trim() ||
            !form.category ||
            !form.type.trim() ||
            !form.price ||
            !form.image.trim()
        ) {
            alert("Iltimos, barcha maydonlarni to'ldiring");
            return;
        }
        
        if (editingId) {
            updateProduct({
                id: editingId,
                ...form,
            });
        } else {
            addProduct(form);
        }
        
        setForm({
            ...emptyForm,
            category: categories[0]?.key || "",
        });
        setEditingId(null);
    }
    
    function handleEdit(product) {
        setEditingId(product.id);
        setForm({
            name: product.name,
            category: product.category,
            type: product.type || "",
            price: product.price,
            image: product.image,
        });
    }
    
    function handleDelete(id) {
        const isConfirmed = window.confirm("Mahsulotni o‘chirmoqchimisiz?");
        if (isConfirmed) {
            deleteProduct(id);
            
            if (editingId === id) {
                setEditingId(null);
                setForm({
                    ...emptyForm,
                    category: categories[0]?.key || "",
                });
            }
        }
    }
    
    function cancelEdit() {
        setEditingId(null);
        setForm({
            ...emptyForm,
            category: categories[0]?.key || "",
        });
    }
    
    function handleLogout() {
        logout();
    }
    
    function handleAddCategory(e) {
        e.preventDefault();
        
        const result = addCategory(newCategory);
        
        if (!result.success) {
            alert(result.message);
            return;
        }
        
        setNewCategory("");
    }
    
    function handleDeleteCategory(categoryId, categoryKey) {
        const usedInProducts = products.some((item) => item.category === categoryKey);
        
        if (usedInProducts) {
            alert("Bu kategoriya mahsulotlarda ishlatilgan. Avval mahsulotlarni o‘zgartiring.");
            return;
        }
        
        const isConfirmed = window.confirm("Kategoriyani o‘chirmoqchimisiz?");
        if (isConfirmed) {
            deleteCategory(categoryId);
            
            setForm((prev) => {
                if (prev.category === categoryKey) {
                    return {
                        ...prev,
                        category: "",
                    };
                }
                return prev;
            });
        }
    }
    
    return (
        <div className="admin-page">
        <div className="container">
        <div className="admin-top">
        <h2 className="admin-title">Mahsulotlar</h2>
        
        <div className="admin-top-actions">
        <Link to="/admin" className="back-link">
        Dashboard
        </Link>
        
        <button className="logout-btn" onClick={handleLogout}>
        Chiqish
        </button>
        </div>
        </div>
        
        <div className="category-manager">
        <h3 className="section-title-admin">Kategoriyalar</h3>
        
        <form className="category-form" onSubmit={handleAddCategory}>
        <input
        type="text"
        placeholder="Yangi kategoriya nomi"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        />
        
        <button type="submit">Kategoriya qo‘shish</button>
        </form>
        
        <div className="category-list-admin">
        {categories.map((item) => (
            <div className="category-item-admin" key={item.id}>
            <span>{item.label}</span>
            <button
            className="delete-category-btn"
            onClick={() => handleDeleteCategory(item.id, item.key)}
            >
            O‘chirish
            </button>
            </div>
        ))}
        </div>
        </div>
        
        <form className="admin-form" onSubmit={handleSubmit}>
        <input
        type="text"
        name="name"
        placeholder="Mahsulot nomi"
        value={form.name}
        onChange={handleChange}
        />
        
        <select
        name="category"
        value={form.category}
        onChange={handleChange}
        >
        <option value="">Kategoriyani tanlang</option>
        {categories.map((item) => (
            <option key={item.id} value={item.key}>
            {item.label}
            </option>
        ))}
        </select>
        
        <input
        type="text"
        name="type"
        placeholder="Mahsulot turi"
        value={form.type}
        onChange={handleChange}
        />
        
        <input
        type="number"
        name="price"
        placeholder="Narxi"
        value={form.price}
        onChange={handleChange}
        />
        
        <input
        type="text"
        name="image"
        placeholder="Rasm URL"
        value={form.image}
        onChange={handleChange}
        />
        
        <div className="admin-actions">
        <button type="submit">
        {editingId ? "Saqlash" : "Qo‘shish"}
        </button>
        
        {editingId && (
            <button
            type="button"
            className="cancel-btn"
            onClick={cancelEdit}
            >
            Bekor qilish
            </button>
        )}
        </div>
        </form>
        
        {products.length === 0 ? (
            <div className="empty-orders">Hozircha mahsulotlar yo‘q</div>
        ) : (
            <div className="admin-list">
            {products.map((item) => (
                <div className="admin-card" key={item.id}>
                <img src={item.image} alt={item.name} />
                
                <div className="admin-card-info">
                <h3>{item.name}</h3>
                <p>
                <strong>Kategoriya:</strong> {getCategoryLabel(item.category)}
                </p>
                <p>
                <strong>Turi:</strong> {item.type}
                </p>
                <p>
                <strong>Narxi:</strong> {formatPrice(item.price)} so'm
                </p>
                </div>
                
                <div className="admin-card-actions">
                <button onClick={() => handleEdit(item)}>Edit</button>
                
                <button
                className="delete-btn"
                onClick={() => handleDelete(item.id)}
                >
                Delete
                </button>
                </div>
                </div>
            ))}
            </div>
        )}
        </div>
        </div>
    );
}