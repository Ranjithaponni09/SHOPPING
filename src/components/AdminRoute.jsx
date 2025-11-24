import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const token = useSelector(s => s.auth.token);
  const user = useSelector(s => s.auth.user);
  if (!token) return <Navigate to="/login" replace />;
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}
