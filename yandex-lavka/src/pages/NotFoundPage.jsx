import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <div className="notfound-page">
        <h1>404</h1>
        <p>Sahifa topilmadi</p>
        <Link to="/">Bosh sahifaga qaytish</Link>
        </div>
    );
}