import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import AdminLayout from "../components/AdminLayout";
import { useProducts } from "../context/ProductContext";
import { useCategories } from "../context/CategoryContext";
import { uploadImage } from "../lib/uploadImage";

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
    const {
        products,
        loadingProducts,
        addProduct,
        updateProduct,
        deleteProduct,
    } = useProducts();
    
    const {
        categories,
        addCategory,
        deleteCategory,
        getCategoryLabel,
    } = useCategories();
    
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [newCategory, setNewCategory] = useState("");
    const [uploadingImage, setUploadingImage] = useState(false);
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    
    useEffect(() => {
        if (!editingId && categories.length > 0 && !form.category) {
            setForm((prev) => ({ ...prev, category: categories[0].key }));
        }
    }, [categories, editingId, form.category]);
    
    const filteredProducts = useMemo(() => {
        let data = [...products];
        
        if (filterCategory !== "all") {
            data = data.filter((item) => item.category === filterCategory);
        }
        
        if (search.trim()) {
            data = data.filter((item) =>
                item.name.toLowerCase().includes(search.toLowerCase())
        );
    }
    
    return data;
}, [products, search, filterCategory]);

function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
}

async function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingImage(true);
    const imageUrl = await uploadImage(file);
    
    if (!imageUrl) {
        toast.error("Rasm yuklashda xatolik");
        setUploadingImage(false);
        return;
    }
    
    setForm((prev) => ({ ...prev, image: imageUrl }));
    setUploadingImage(false);
    toast.success("Rasm yuklandi");
}

async function handleSubmit(e) {
    e.preventDefault();
    
    if (
        !form.name.trim() ||
        !form.category ||
        !form.type.trim() ||
        !form.price ||
        !form.image.trim()
    ) {
        toast.error("Barcha maydonlarni to‘ldiring");
        return;
    }
    
    let result;
    
    if (editingId) {
        result = await updateProduct({ id: editingId, ...form });
    } else {
        result = await addProduct(form);
    }
    
    if (result && result.success === false) {
        toast.error(result.message || "Xatolik");
        return;
    }
    
    toast.success(editingId ? "Mahsulot yangilandi" : "Mahsulot qo‘shildi");
    setEditingId(null);
    setForm({ ...emptyForm, category: categories[0]?.key || "" });
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

async function handleDelete(id) {
    if (!window.confirm("Mahsulotni o‘chirmoqchimisiz?")) return;
    
    const result = await deleteProduct(id);
    
    if (result && result.success === false) {
        toast.error(result.message || "O‘chirishda xatolik");
        return;
    }
    
    toast.success("Mahsulot o‘chirildi");
}

function cancelEdit() {
    setEditingId(null);
    setForm({ ...emptyForm, category: categories[0]?.key || "" });
}

async function handleAddCategory(e) {
    e.preventDefault();
    
    const result = await addCategory(newCategory);
    
    if (!result.success) {
        toast.error(result.message || "Kategoriya qo‘shilmadi");
        return;
    }
    
    toast.success("Kategoriya qo‘shildi");
    setNewCategory("");
}

async function handleDeleteCategory(categoryId, categoryKey) {
    const usedInProducts = products.some((item) => item.category === categoryKey);
    
    if (usedInProducts) {
        toast.error("Bu kategoriya mahsulotlarda ishlatilgan");
        return;
    }
    
    if (!window.confirm("Kategoriyani o‘chirmoqchimisiz?")) return;
    
    const result = await deleteCategory(categoryId);
    
    if (result && result.success === false) {
        toast.error(result.message || "Kategoriya o‘chirilmadi");
        return;
    }
    
    toast.success("Kategoriya o‘chirildi");
}

return (
    <AdminLayout title="Mahsulotlar">
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
    <input type="text" name="name" placeholder="Mahsulot nomi" value={form.name} onChange={handleChange} />
    
    <select name="category" value={form.category} onChange={handleChange}>
    <option value="">Kategoriyani tanlang</option>
    {categories.map((item) => (
        <option key={item.id} value={item.key}>{item.label}</option>
    ))}
    </select>
    
    <input type="text" name="type" placeholder="Mahsulot turi" value={form.type} onChange={handleChange} />
    <input type="number" name="price" placeholder="Narxi" value={form.price} onChange={handleChange} />
    <input type="text" name="image" placeholder="Rasm URL" value={form.image} onChange={handleChange} />
    <input type="file" accept="image/*" onChange={handleImageChange} />
    
    {uploadingImage && <p>Rasm yuklanmoqda...</p>}
    
    {form.image && (
        <img
        src={form.image}
        alt="preview"
        style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "12px" }}
        />
    )}
    
    <div className="admin-actions">
    <button type="submit" disabled={uploadingImage}>
    {editingId ? "Saqlash" : "Qo‘shish"}
    </button>
    
    {editingId && (
        <button type="button" className="cancel-btn" onClick={cancelEdit}>
        Bekor qilish
        </button>
    )}
    </div>
    </form>
    
    <div className="admin-toolbar">
    <input
    type="text"
    placeholder="Mahsulot qidirish..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    />
    
    <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
    <option value="all">Barchasi</option>
    {categories.map((item) => (
        <option key={item.id} value={item.key}>{item.label}</option>
    ))}
    </select>
    </div>
    
    {loadingProducts ? (
        <div className="empty-orders">Yuklanmoqda...</div>
    ) : filteredProducts.length === 0 ? (
        <div className="empty-orders">Mahsulot topilmadi</div>
    ) : (
        <div className="admin-list">
        {filteredProducts.map((item) => (
            <div className="admin-card" key={item.id}>
            <img src={item.image} alt={item.name} />
            
            <div className="admin-card-info">
            <h3>{item.name}</h3>
            <p><strong>Kategoriya:</strong> {getCategoryLabel(item.category)}</p>
            <p><strong>Turi:</strong> {item.type}</p>
            <p><strong>Narxi:</strong> {formatPrice(item.price)} so'm</p>
            </div>
            
            <div className="admin-card-actions">
            <button onClick={() => handleEdit(item)}>Edit</button>
            <button className="delete-btn" onClick={() => handleDelete(item.id)}>
            Delete
            </button>
            </div>
            </div>
        ))}
        </div>
    )}
    </AdminLayout>
);
}