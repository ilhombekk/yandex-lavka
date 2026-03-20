import React, { useMemo, useState } from "react";
import Header from "../components/Header";
import Categories from "../components/Categories";
import ProductCard from "../components/ProductCard";
import CartDrawer from "../components/CartDrawer";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";

export default function HomePage() {
    const { products, loadingProducts } = useProducts();
    
    const {
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        totalPrice,
    } = useCart();
    
    const { createOrder } = useOrders();
    
    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    const [customer, setCustomer] = useState({
        name: "",
        phone: "",
        address: "",
    });
    
    const filteredProducts = useMemo(() => {
        let filtered = [...products];
        
        if (selectedCategory !== "all") {
            filtered = filtered.filter((item) => item.category === selectedCategory);
        }
        
        if (searchText.trim()) {
            filtered = filtered.filter((item) =>
                item.name.toLowerCase().includes(searchText.toLowerCase())
        );
    }
    
    return filtered;
}, [products, selectedCategory, searchText]);

const featuredProducts = useMemo(() => {
    return [...products].slice(0, 4);
}, [products]);

function handleCheckoutOpen() {
    setShowCheckout(true);
}

function handleCheckoutClose() {
    setShowCheckout(false);
}

function handleCustomerChange(e) {
    const { name, value } = e.target;
    setCustomer((prev) => ({
        ...prev,
        [name]: value,
    }));
}

async function handleOrderSubmit(e) {
    e.preventDefault();
    
    if (!customer.name || !customer.phone || !customer.address) {
        alert("Iltimos, barcha maydonlarni to'ldiring");
        return;
    }
    
    if (cart.length === 0) {
        alert("Savatcha bo'sh");
        return;
    }
    
    const result = await createOrder({
        customer,
        items: cart,
        totalPrice,
    });
    
    if (result && result.success === false) {
        alert("Buyurtma yuborishda xatolik bo‘ldi");
        return;
    }
    
    clearCart();
    setShowCheckout(false);
    setIsCartOpen(false);
    setCustomer({
        name: "",
        phone: "",
        address: "",
    });
    
    alert("Buyurtma muvaffaqiyatli qabul qilindi");
}

return (
    <>
    <Header
    searchText={searchText}
    setSearchText={setSearchText}
    cartCount={cartCount}
    openCart={() => setIsCartOpen(true)}
    />
    
    <main className="container">
    <section className="hero">
    <div className="hero-content">
    <span className="hero-badge">Tez yetkazib berish</span>
    <h1>Shovot Lavka — mahsulotlar bir necha daqiqada</h1>
    <p>
    Kundalik kerakli mahsulotlarni tez toping, savatga qo‘shing va
    buyurtma bering.
    </p>
    
    <div className="hero-actions">
    <button
    className="hero-primary-btn"
    onClick={() => window.scrollTo({ top: 520, behavior: "smooth" })}
    >
    Xaridni boshlash
    </button>
    
    <button
    className="hero-secondary-btn"
    onClick={() => setIsCartOpen(true)}
    >
    Savatchani ochish
    </button>
    </div>
    </div>
    
    <div className="hero-card">
    <div className="hero-stat">
    <strong>{products.length}+</strong>
    <span>Mahsulot</span>
    </div>
    <div className="hero-stat">
    <strong>{cartCount}</strong>
    <span>Savatchada</span>
    </div>
    <div className="hero-stat">
    <strong>24/7</strong>
    <span>Qulay buyurtma</span>
    </div>
    </div>
    </section>
    
    {featuredProducts.length > 0 && (
        <section className="featured-section">
        <div className="section-header">
        <h2>Mashhur mahsulotlar</h2>
        <p>Eng ko‘p tanlanayotgan mahsulotlar</p>
        </div>
        
        <div className="featured-grid">
        {featuredProducts.map((product) => (
            <ProductCard
            key={`featured-${product.id}`}
            product={product}
            addToCart={addToCart}
            />
        ))}
        </div>
        </section>
    )}
    
    <section className="catalog-section">
    <div className="section-header">
    <h2>Barcha mahsulotlar</h2>
    <p>Qidiruv va kategoriya orqali tez toping</p>
    </div>
    
    <Categories
    selectedCategory={selectedCategory}
    setSelectedCategory={setSelectedCategory}
    />
    
    <section className="products">
    {loadingProducts ? (
        <div className="not-found">Mahsulotlar yuklanmoqda...</div>
    ) : filteredProducts.length === 0 ? (
        <div className="not-found">
        <h3>Mahsulot topilmadi</h3>
        <p>Boshqa kategoriya yoki qidiruv so‘zini sinab ko‘ring.</p>
        </div>
    ) : (
        filteredProducts.map((product) => (
            <ProductCard
            key={product.id}
            product={product}
            addToCart={addToCart}
            />
        ))
    )}
    </section>
    </section>
    </main>
    
    <CartDrawer
    isOpen={isCartOpen}
    closeCart={() => setIsCartOpen(false)}
    cart={cart}
    increaseQuantity={increaseQuantity}
    decreaseQuantity={decreaseQuantity}
    removeFromCart={removeFromCart}
    totalPrice={totalPrice}
    onCheckout={handleCheckoutOpen}
    />
    
    {showCheckout && (
        <div className="checkout-modal">
        <div className="checkout-box">
        <div className="checkout-top">
        <h2>Buyurtma berish</h2>
        <button className="checkout-close" onClick={handleCheckoutClose}>
        ✕
        </button>
        </div>
        
        <form className="checkout-form" onSubmit={handleOrderSubmit}>
        <input
        type="text"
        name="name"
        placeholder="Ismingiz"
        value={customer.name}
        onChange={handleCustomerChange}
        />
        
        <input
        type="text"
        name="phone"
        placeholder="Telefon raqamingiz"
        value={customer.phone}
        onChange={handleCustomerChange}
        />
        
        <input
        type="text"
        name="address"
        placeholder="Manzil"
        value={customer.address}
        onChange={handleCustomerChange}
        />
        
        <button type="submit" className="confirm-order-btn">
        Buyurtmani tasdiqlash
        </button>
        </form>
        </div>
        </div>
    )}
    </>
);
}