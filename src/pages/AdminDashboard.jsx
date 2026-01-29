import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllCategories, deleteCategory, getAllProducts, deleteProduct } from '../services/api';
import { FaEdit, FaTrash, FaPlus, FaBoxOpen, FaTags } from 'react-icons/fa';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('categories'); // 'categories' | 'products'
  
  // Data
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [refresh, setRefresh] = useState(false); // To trigger reload after delete

  const PAGE_SIZE = 10;

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, [activeTab, page, refresh]);

  const loadData = async () => {
    try {
      let res;
      if (activeTab === 'categories') {
        res = await getAllCategories(page, PAGE_SIZE);
      } else {
        res = await getAllProducts(page, PAGE_SIZE);
      }
      setData(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      if (activeTab === 'categories') await deleteCategory(id);
      else await deleteProduct(id);
      setRefresh(!refresh); // Reload list
    } catch (err) { alert("Failed to delete. It might be linked to other data."); }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg min-h-[80vh]">
      {/* Sidebar / Tabs */}
      <div className="border-b flex">
        <button 
          onClick={() => { setActiveTab('categories'); setPage(0); }}
          className={`flex-1 py-4 font-bold text-center cursor-pointer transition flex items-center justify-center gap-2
            ${activeTab === 'categories' ? 'bg-green-50 text-green-700 border-b-4 border-green-600' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <FaTags /> Categories
        </button>
        <button 
          onClick={() => { setActiveTab('products'); setPage(0); }}
          className={`flex-1 py-4 font-bold text-center cursor-pointer transition flex items-center justify-center gap-2
            ${activeTab === 'products' ? 'bg-green-50 text-green-700 border-b-4 border-green-600' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <FaBoxOpen /> Products
        </button>
      </div>

      <div className="p-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold capitalize">{activeTab} Management</h2>
          <Link 
            to={activeTab === 'categories' ? "/admin/category/new" : "/admin/product/new"}
            className="bg-brand-yellow hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-bold flex items-center gap-2 cursor-pointer shadow-md transition"
          >
            <FaPlus /> Add New {activeTab === 'categories' ? 'Category' : 'Product'}
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 border-b">ID</th>
                <th className="p-4 border-b">Image</th>
                <th className="p-4 border-b">Name</th>
                {activeTab === 'products' && <th className="p-4 border-b">Price</th>}
                <th className="p-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 transition border-b last:border-0">
                  <td className="p-4 font-mono text-sm text-gray-500">#{item.id}</td>
                  <td className="p-4">
                    <img src={item.imageUrl} alt="" className="w-12 h-12 object-contain rounded bg-white border" />
                  </td>
                  <td className="p-4 font-bold text-gray-800">{item.name}</td>
                  {activeTab === 'products' && <td className="p-4">₹{item.price}</td>}
                  <td className="p-4 flex justify-center gap-3">
                    <Link 
                      to={activeTab === 'categories' ? `/admin/category/edit/${item.id}` : `/admin/product/edit/${item.id}`}
                      className="text-blue-600 hover:bg-blue-100 p-2 rounded cursor-pointer" title="Edit"
                    >
                      <FaEdit size={18} />
                    </Link>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:bg-red-100 p-2 rounded cursor-pointer" title="Delete"
                    >
                      <FaTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.length === 0 && <div className="p-8 text-center text-gray-500">No records found.</div>}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <button 
              disabled={page === 0} onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
            >
              Previous
            </button>
            <span className="font-bold text-gray-600">Page {page + 1} of {totalPages}</span>
            <button 
              disabled={page === totalPages - 1} onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;