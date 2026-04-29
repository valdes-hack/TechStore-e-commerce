import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PrivateRoute, AdminRoute } from './ProtectedRoute';

// --- PAGES PUBLIQUES ---
import Home from '../pages/public/Home'; 
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Catalog from '../pages/public/Catalog';
import ProductDetail from '../pages/public/ProductDetail';

// --- PAGES CLIENTS (Privées) ---
import Profile from '../pages/client/Profile';
import MyOrders from '../pages/client/MyOrders';

// --- PAGES ADMINISTRATION (Privées ROLE_ADMIN) ---
import AdminProducts from '../pages/admin/Products';
import AdminUsers from '../pages/admin/Users';
import AdminOrders from '../pages/admin/Orders';
import AdminCategories from '../pages/admin/Categories';

const AppRouter = () => {
    return (
        <Routes>
            {/* 1. ROUTES PUBLIQUES */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/category/:slug" element={<Catalog />} />
            <Route path="/product/:slug" element={<ProductDetail />} />

            {/* 2. ESPACE CLIENT (Nécessite connexion) */}
            <Route path="/profile" element={
                <PrivateRoute>
                    <Profile />
                </PrivateRoute>
            } />
            <Route path="/my-orders" element={
                <PrivateRoute>
                    <MyOrders />
                </PrivateRoute>
            } />

            {/* 3. CENTRE DE CONTRÔLE ADMIN (Nécessite ROLE_ADMIN) */}
            {/* Route par défaut /admin : on arrive sur l'inventaire produits */}
            <Route path="/admin" element={
                <AdminRoute>
                    <AdminProducts /> 
                </AdminRoute>
            } />
            
            <Route path="/admin/products" element={
                <AdminRoute>
                    <AdminProducts />
                </AdminRoute>
            } />

            <Route path="/admin/users" element={
                <AdminRoute>
                    <AdminUsers />
                </AdminRoute>
            } />

            <Route path="/admin/orders" element={
                <AdminRoute>
                    <AdminOrders />
                </AdminRoute>
            } />

            <Route path="/admin/categories" element={
                <AdminRoute>
                    <AdminCategories />
                </AdminRoute>
            } />

            {/* 4. LE FILET DE SÉCURITÉ (Toujours en dernier !) */}
            <Route path="*" element={
                <div className="pt-60 text-center select-none">
                    <h1 className="text-9xl font-black italic text-apple-dark opacity-5 tracking-tighter">404</h1>
                    <p className="text-xl font-bold text-slate-400 mt-[-40px]">Perdu dans la tech, mon Valdes ? 🍎</p>
                </div>
            } />
        </Routes>
    );
};

export default AppRouter;