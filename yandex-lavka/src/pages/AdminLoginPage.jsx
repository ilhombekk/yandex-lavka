import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminLoginPage() {
    const { isAdmin, login } = useAuth();
    const navigate = useNavigate();
    
    const [form, setForm] = useState({
        username: "",
        password: "",
    });
    const [error, setError] = useState("");
    
    if (isAdmin) {
        return <Navigate to="/admin" replace />;
    }
    
    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }
    
    function handleSubmit(e) {
        e.preventDefault();
        const result = login(form.username, form.password);
        
        if (result.success) {
            navigate("/admin");
        } else {
            setError(result.message);
        }
    }
    
    return (
        <div className="login-page">
        <form className="login-form" onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        
        <input
        type="text"
        name="username"
        placeholder="Login"
        value={form.username}
        onChange={handleChange}
        />
        
        <input
        type="password"
        name="password"
        placeholder="Parol"
        value={form.password}
        onChange={handleChange}
        />
        
        {error && <p className="error-text">{error}</p>}
        
        <button type="submit">Kirish</button>
        
        <p className="demo-text">
        Demo: <strong>admin</strong> / <strong>12345</strong>
        </p>
        </form>
        </div>
    );
}