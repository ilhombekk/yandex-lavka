import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { CategoryProvider } from "./context/CategoryContext";
import { ProductProvider } from "./context/ProductContext";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
  <BrowserRouter>
  <AuthProvider>
  <CategoryProvider>
  <ProductProvider>
  <CartProvider>
  <OrderProvider>
  <App />
  <Toaster position="top-right" />
  </OrderProvider>
  </CartProvider>
  </ProductProvider>
  </CategoryProvider>
  </AuthProvider>
  </BrowserRouter>
  </React.StrictMode>
);