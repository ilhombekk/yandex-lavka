import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header({
    searchText,
    setSearchText,
    cartCount,
    openCart,
}) {
    const navigate = useNavigate();
    
    return (
        <header className="site-header">
        <div className="container header-inner">
        
        {/* LOGO */}
        <div className="brand-block">
        <div className="brand-logo">SL</div>
        <div>
        <h1 className="brand-title">Shovot Lavka</h1>
        <p className="brand-subtitle">Tezkor market</p>
        </div>
        </div>
        
        {/* SEARCH */}
        <div className="header-search">
        <input
        type="text"
        placeholder="Mahsulot qidirish..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        />
        </div>
        
        {/* BUTTONS */}
        <div className="header-actions">
        <button
        className="admin-btn"
        onClick={() => navigate("/admin-login")}
        >
        Admin
        </button>
        
        <button className="cart-button" onClick={openCart}>
        <span>Savatcha</span>
        <span className="cart-badge">{cartCount}</span>
        </button>
        </div>
        </div>
        </header>
    );
}