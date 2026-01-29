import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createProduct, getProductById, updateProduct, getAllCategories } from '../../services/api';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');
  
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', quantity: '', unit: '', imageUrl: '', isActive: true
  });

  useEffect(() => {
    // Load categories for the dropdown
    getAllCategories(0, 100).then(res => setCategories(res.data.content || []));
    
    // If Edit mode, load product data
    if (id) {
      getProductById(id).then(res => setFormData(res.data));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateProduct(id, formData);
      } else {
        if(!selectedCat) return alert("Select a Category");
        await createProduct(selectedCat, formData);
      }
      navigate('/admin');
    } catch (err) { alert('Operation Failed'); }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-6">{id ? 'Edit Product' : 'Create Product'}</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Only show Category Dropdown in Create Mode */}
        {!id && (
          <div className="col-span-full">
            <label className="block text-sm font-bold mb-1">Category</label>
            <select className="w-full border p-2 rounded outline-none" required 
              onChange={e => setSelectedCat(e.target.value)} value={selectedCat}>
              <option value="">-- Select Category --</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        )}

        <div className="col-span-full">
          <label className="block text-sm font-bold mb-1">Product Name</label>
          <input className="w-full border p-2 rounded outline-none" required 
            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        </div>
        
        <div>
          <label className="block text-sm font-bold mb-1">Price</label>
          <input type="number" className="w-full border p-2 rounded outline-none" required 
            value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
        </div>
        
        <div>
          <label className="block text-sm font-bold mb-1">Quantity & Unit</label>
          <div className="flex gap-2">
            <input type="number" placeholder="Qty" className="w-1/2 border p-2 rounded outline-none" required 
              value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
            <input type="text" placeholder="Unit (e.g. kg)" className="w-1/2 border p-2 rounded outline-none" required 
              value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} />
          </div>
        </div>

        <div className="col-span-full">
          <label className="block text-sm font-bold mb-1">Description</label>
          <textarea className="w-full border p-2 rounded outline-none" required rows="3"
            value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        </div>

        <div className="col-span-full">
          <label className="block text-sm font-bold mb-1">Image URL</label>
          <input className="w-full border p-2 rounded outline-none" required 
            value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
        </div>

        <div className="col-span-full mt-4">
          <button type="submit" className="w-full bg-green-700 text-white py-3 rounded-lg font-bold hover:bg-green-800 cursor-pointer">
            {id ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};
export default ProductForm;