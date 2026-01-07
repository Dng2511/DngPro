import React from 'react';
import AdminLayout from './shared/components/Layout';
import 'antd/dist/reset.css'; // cần cài Ant Design
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Categories from './pages/Categories';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import RequireAuth from './shared/components/RequireAuth';
import { AuthProvider } from './shared/context/AuthContext';
import Products from './pages/Products';
import Users from './pages/Users';
import Orders from './pages/Orders';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<RequireAuth><AdminLayout /></RequireAuth>}>
            <Route index element={<Dashboard />} />
            <Route path="categories" element={<Categories />} />
            <Route path="products" element={<Products />} />
            <Route path="customers" element={<Users />} />
            <Route path="orders" element={<Orders />} />
          </Route>

        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
