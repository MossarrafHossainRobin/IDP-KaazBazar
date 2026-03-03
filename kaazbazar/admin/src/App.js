import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/UsersPage';
import WorkersPage from './pages/WorkersPage';
import BookingsPage from './pages/BookingsPage';
import MessagesPage from './pages/MessagesPage';
import Sidebar from './components/Sidebar';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  return token ? children : <Navigate to="/login" />;
};

const AdminLayout = ({ children }) => (
  <div style={{ display:'flex', minHeight:'100vh' }}>
    <Sidebar />
    <main style={{ flex:1, marginLeft:240, padding:28, background:'#f1f5f9', minHeight:'100vh' }}>
      {children}
    </main>
    <style>{`@media(max-width:768px){ main{marginLeft:0!important;padding:16px!important} }`}</style>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><AdminLayout><UsersPage /></AdminLayout></ProtectedRoute>} />
        <Route path="/workers" element={<ProtectedRoute><AdminLayout><WorkersPage /></AdminLayout></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><AdminLayout><BookingsPage /></AdminLayout></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><AdminLayout><MessagesPage /></AdminLayout></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
