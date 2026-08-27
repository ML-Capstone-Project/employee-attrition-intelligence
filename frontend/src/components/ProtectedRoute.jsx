import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function ProtectedRoute({ role }) { const { session } = useAuth(); return session?.role === role ? <Outlet /> : <Navigate to={`/${role}/login`} replace />; }
