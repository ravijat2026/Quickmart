import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/api';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    getProductById(id)
      .then(res => setProduct(res.data))
      .catch(() => alert("Product not found"));
  }, [id]);

  if (!product) return <div className="p-10 text-center">Loading Details...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mt-6 flex flex-col md:flex-row gap-8">
      {/* Image Section */}
      <div className="w-full md:w-1/2 flex justify-center bg-gray-50 rounded-lg p-4">
        <img 
          src={product.imageUrl} 
          onError={(e) => e.target.src='https://via.placeholder.com/300?text=No+Image'} 
          alt={product.name} 
          className="max-h-96 object-contain" 
        />
      </div>

      {/* Info Section */}
      <div className="w-full md:w-1/2 space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
        <p className="text-gray-500 text-lg">{product.quantity} {product.unit}</p>
        <hr />
        <p className="text-gray-600">{product.description}</p>
        
        <div className="flex items-center gap-4 mt-6">
          <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
        </div>

        <div className="flex gap-4 mt-6">
          <button 
            onClick={() => addToCart(product)} 
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
          >
            Add to Cart
          </button>
          <button 
            onClick={() => navigate('/')} 
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-100"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;