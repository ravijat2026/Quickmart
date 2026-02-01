import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllCategories, deleteCategory, getAllProducts, deleteProduct } from '../services/api';
import { FaEdit, FaTrash, FaPlus, FaBoxOpen, FaTags, FaSpinner } from 'react-icons/fa';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('categories'); // 'categories' | 'products'
  
  // Data
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);

  const PAGE_SIZE = 12; // Fetch more items since we use a grid

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, [activeTab, page, refresh]);

  const loadData = async () => {
    setLoading(true);
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
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      if (activeTab === 'categories') await deleteCategory(id);
      else await deleteProduct(id);
      setRefresh(!refresh); // Trigger reload
    } catch (err) { alert("Failed to delete. It might be linked to other data."); }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg min-h-[80vh] border border-gray-100">
      
      {/* --- Sidebar / Tabs --- */}
      <div className="border-b flex">
        <button 
          onClick={() => { setActiveTab('categories'); setPage(0); }}
          className={`flex-1 py-5 font-bold text-center cursor-pointer transition flex items-center justify-center gap-2 text-lg
            ${activeTab === 'categories' ? 'bg-green-50 text-green-700 border-b-4 border-green-600' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <FaTags /> Categories
        </button>
        <button 
          onClick={() => { setActiveTab('products'); setPage(0); }}
          className={`flex-1 py-5 font-bold text-center cursor-pointer transition flex items-center justify-center gap-2 text-lg
            ${activeTab === 'products' ? 'bg-green-50 text-green-700 border-b-4 border-green-600' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <FaBoxOpen /> Products
        </button>
      </div>

      <div className="p-6 md:p-8">
        
        {/* --- Header Actions --- */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold capitalize text-gray-800">{activeTab} Inventory</h2>
          <Link 
            to={activeTab === 'categories' ? "/admin/category/new" : "/admin/product/new"}
            className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <FaPlus /> Add New {activeTab === 'categories' ? 'Category' : 'Product'}
          </Link>
        </div>

        {/* --- Loading State --- */}
        {loading ? (
           <div className="flex justify-center py-20 text-gray-400">
              <FaSpinner className="animate-spin text-4xl" />
           </div>
        ) : (
          /* --- CARD GRID --- */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.map(item => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group">
                
                {/* Image Area */}
                <div className="h-40 w-full bg-gray-50 rounded-lg flex items-center justify-center mb-4 overflow-hidden relative">
                   <img 
                      src={item.imageUrl || 'https://via.placeholder.com/150'} 
                      alt={item.name} 
                      className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-110" 
                   />
                   {/* ID Badge */}
                   <span className="absolute top-2 left-2 bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded">
                     ID: {item.id}
                   </span>
                </div>

                {/* Content Area */}
                <div className="mb-4">
                  <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{item.name}</h3>
                  {activeTab === 'products' ? (
                     <div className="flex items-center gap-2 mt-1">
                        <span className="text-green-700 font-extrabold text-lg">₹{item.price}</span>
                        <span className="text-gray-400 text-sm">/ {item.unit}</span>
                     </div>
                  ) : (
                     <p className="text-gray-500 text-sm mt-1 line-clamp-2 h-10">{item.description}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
                  <Link 
                    to={activeTab === 'categories' ? `/admin/category/edit/${item.id}` : `/admin/product/edit/${item.id}`}
                    className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <FaEdit /> Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && data.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <h3 className="text-xl text-gray-400 font-bold">No {activeTab} found</h3>
            <p className="text-gray-400 mt-2">Click "Add New" to get started.</p>
          </div>
        )}

        {/* --- Pagination --- */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-10">
            <button 
              disabled={page === 0} 
              onClick={() => setPage(p => p - 1)}
              className="px-5 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition cursor-pointer"
            >
              Previous
            </button>
            <span className="font-bold text-gray-600">
              Page <span className="text-black">{page + 1}</span> of {totalPages}
            </span>
            <button 
              disabled={page === totalPages - 1} 
              onClick={() => setPage(p => p + 1)}
              className="px-5 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition cursor-pointer"
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
