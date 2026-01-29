import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-400">Your cart is empty</h2>
        <Link to="/" className="mt-4 inline-block text-green-600 font-bold">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow mt-6">
      <h2 className="text-2xl font-bold mb-6">My Cart</h2>
      {cartItems.map(item => (
        <div key={item.id} className="flex justify-between items-center border-b py-4">
          <div className="flex gap-4 items-center">
            <img src={item.imageUrl} className="w-16 h-16 object-contain" alt="" />
            <div>
              <h3 className="font-bold">{item.name}</h3>
              <p className="text-sm text-gray-500">₹{item.price} / {item.unit}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded bg-green-50">
              <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 text-green-700 font-bold">-</button>
              <span className="px-2 font-medium">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 text-green-700 font-bold">+</button>
            </div>
            <p className="font-bold w-16 text-right">₹{item.price * item.quantity}</p>
            <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700"><FaTrash/></button>
          </div>
        </div>
      ))}
      
      <div className="mt-6 flex justify-between items-center">
        <h3 className="text-xl font-bold">Total: ₹{cartTotal.toFixed(2)}</h3>
        <button className="bg-green-700 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-800">
          Checkout (Demo)
        </button>
      </div>
    </div>
  );
};

export default CartPage;