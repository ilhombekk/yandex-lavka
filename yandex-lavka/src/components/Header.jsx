import React from "react";
import { Link } from "react-router-dom";

export default function Header({
    searchText,
    setSearchText,
    cartCount,
    openCart,
}) {
    return (
        <header className="header">
        <div className="container header-wrapper">
        <Link to="/" className="logo-link">
        <h1 className="logo">Shovot Lavka</h1>
        </Link>
        
        <input
        type="text"
        placeholder="Mahsulot qidirish..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        />
        
        <div className="header-actions">
        <Link to="/admin-login" className="admin-link">
        Admin
        </Link>
        
        <button className="cart-btn" onClick={openCart}>
        Savatcha ({cartCount})
        </button>
        </div>
        </div>
        </header>
    );
}