import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FaShoppingCart, FaUserShield, FaStore } from 'react-icons/fa';
import { CartProvider, useCart } from './context/CartContext';

// Pages
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/CartPage';
import AdminDashboard from './pages/AdminDashboard';
import CategoryForm from './pages/forms/CategoryForm';
import ProductForm from './pages/forms/ProductForm';

const Navbar = () => {
  const { cartCount } = useCart();
  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-green-700 tracking-tighter">
          <FaStore /> QuickMart
        </Link>
        
        <div className="flex gap-6 items-center">
          <Link to="/admin" className="flex items-center gap-1 text-sm font-bold text-gray-600 hover:text-green-700 transition">
            <FaUserShield size={18} /> Admin
          </Link>

          <Link to="/cart" className="relative text-gray-700 hover:text-green-700 transition">
            <FaShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-white font-sans text-gray-800">
          <Navbar />
          <div className="container mx-auto p-4 md:p-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/category/new" element={<CategoryForm />} />
              <Route path="/admin/category/edit/:id" element={<CategoryForm />} />
              <Route path="/admin/product/new" element={<ProductForm />} />
              <Route path="/admin/product/edit/:id" element={<ProductForm />} />
            </Routes>
          </div>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;