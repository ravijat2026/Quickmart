import React, { useState, useEffect } from 'react';
import { getCategories, createProduct } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  
  // Stores the ID selected in the dropdown
  const [selectedCatId, setSelectedCatId] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    unit: '',
    imageUrl: '',
    isActive: true,
  });

  // Fetch categories on load to populate dropdown
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data.content || res.data);
      } catch (err) {
        console.error("Couldn't load categories for dropdown", err);
      }
    };
    fetchCats();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCatId) {
      alert("Please select a category");
      return;
    }

    try {
      // 1. Prepare data (convert price/qty to numbers if needed)
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        // We include categoryId in body too if your backend expects it there as well, 
        // but primarily we use the query param as requested.
        categoryId: parseInt(selectedCatId) 
      };

      // 2. Call API passing Category ID separately
      await createProduct(selectedCatId, payload);
      
      alert('Product Added Successfully!');
      navigate('/');
    } catch (error) {
      alert('Error adding product');
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Product</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
        
        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Category</label>
          <select 
            value={selectedCatId} 
            onChange={(e) => setSelectedCatId(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 shadow-sm bg-white focus:ring-green-500 focus:border-green-500"
            required
          >
            <option value="">-- Choose a Category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input name="name" onChange={handleChange} required className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
            <input name="price" type="number" onChange={handleChange} required className="input-field" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" onChange={handleChange} required className="input-field" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input name="quantity" type="number" onChange={handleChange} required className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Unit (e.g., L, kg, pcs)</label>
            <input name="unit" onChange={handleChange} required className="input-field" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Image URL</label>
          <input name="imageUrl" onChange={handleChange} placeholder="https://..." required className="input-field" />
        </div>

        <button type="submit" className="w-full bg-green-600 text-white p-3 rounded-md font-bold hover:bg-green-700 transition">
          Add Product
        </button>
      </form>

      {/* Helper styles for inputs */}
      <style>{`
        .input-field {
          margin-top: 0.25rem;
          display: block;
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          padding: 0.5rem;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        .input-field:focus {
          outline: none;
          border-color: #22c55e;
          ring: 2px solid #22c55e;
        }
      `}</style>
    </div>
  );
};

export default AddProduct;