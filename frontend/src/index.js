import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';

import Home from './HomePage/Home';
import SearchResults from './Pages/SearchResults';
import RestaurantDetail from './Pages/RestaurantDetail';
import SignUp from './Pages/SignUp';
import SignIn from './Pages/SignIn';
import AdminDashboard from './Pages/AdminDashboard';
import ShopkeeperDashboard from './Pages/ShopkeeperDashboard';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/restaurant/:id" element={<RestaurantDetail />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />

          {/* Admin only */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Shopkeeper only */}
          <Route path="/shopkeeper" element={
            <ProtectedRoute roles={['shopkeeper']}>
              <ShopkeeperDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
