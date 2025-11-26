import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import ProductsAdmin from './components/ProductsAdmin';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import UserProductList from './components/UserProductList';


export default function App(){
  return (
    <>
     
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/admin" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/products" element={<AdminRoute><ProductsAdmin /></AdminRoute>} />
          <Route path="/products" element={<UserProductList />} />
          <Route path="*" element={<div style={{padding:20}}>Not Found</div>} />
        </Routes>
      </div>
    </>
  );
}
