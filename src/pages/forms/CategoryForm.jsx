import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createCategory, getCategoryById, updateCategory } from '../../services/api';

const CategoryForm = () => {
  const { id } = useParams(); // If ID exists, it's edit mode
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', description: '', imageUrl: '', isActive: true });

  useEffect(() => {
    if (id) {
      getCategoryById(id).then(res => setFormData(res.data));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) await updateCategory(id, formData);
      else await createCategory(formData);
      navigate('/admin');
    } catch (err) { alert('Operation Failed'); }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-6">{id ? 'Edit Category' : 'Create Category'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold mb-1">Name</label>
          <input className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none" 
            required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Description</label>
          <textarea className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none" 
            required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Image URL</label>
          <input className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none" 
            required value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
        </div>
        <button type="submit" className="w-full bg-green-700 text-white py-3 rounded-lg font-bold hover:bg-green-800 cursor-pointer">
          {id ? 'Update Category' : 'Create Category'}
        </button>
      </form>
    </div>
  );
};
export default CategoryForm;