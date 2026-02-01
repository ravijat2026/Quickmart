import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  getAllCategories, searchCategories, 
  getAllProducts, getProductsByCategory, searchProducts 
} from '../services/api';
import { useCart } from '../context/CartContext';
import { FaChevronLeft, FaChevronRight, FaSearch, FaSpinner } from 'react-icons/fa';

// --- Skeleton Component for Categories ---
const CategorySkeleton = () => (
  <div className="flex-shrink-0 w-32 md:w-40 p-4 border border-gray-100 rounded-xl bg-white">
    <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-3 rounded-full bg-gray-200 animate-pulse"></div>
    <div className="h-4 w-20 mx-auto bg-gray-200 rounded animate-pulse"></div>
  </div>
);

const Home = () => {
  const { addToCart } = useCart();
  const scrollRef = useRef(null);
  const observerTarget = useRef(null);

  // --- States ---
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Data States
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  
  // Loading States
  const [catLoading, setCatLoading] = useState(true); // Starts true to hide "No found"
  const [prodLoading, setProdLoading] = useState(false);
  
  // Pagination States
  const [prodPage, setProdPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCatId, setSelectedCatId] = useState(null); 
  
  const PRODUCT_PAGE_SIZE = 12;
  const CATEGORY_FETCH_SIZE = 50; 

  const getOptimizedImageUrl = (url, width = 300) => {
    if (!url) return 'https://via.placeholder.com/300?text=No+Image';
    if (url.includes('unsplash.com')) return `${url}&w=${width}&q=80`;
    if (url.includes('images.pexels.com')) return `${url}?auto=compress&cs=tinysrgb&w=${width}`;
    return url;
  };

  // --- 1. Load Categories ---
  useEffect(() => {
    const fetchCategories = async () => {
      setCatLoading(true); // Start Loading
      try {
        const res = isSearching 
          ? await searchCategories(searchQuery, 0, CATEGORY_FETCH_SIZE)
          : await getAllCategories(0, CATEGORY_FETCH_SIZE);
        setCategories(res.data.content || []);
      } catch (err) { 
        console.error("Cat Error", err); 
      } finally {
        setCatLoading(false); // Stop Loading
      }
    };
    fetchCategories();
  }, [searchQuery, isSearching]);

  // --- 2. Load Products ---
  useEffect(() => {
    const fetchProducts = async () => {
      setProdLoading(true);
      try {
        let res;
        if (isSearching) {
          res = await searchProducts(searchQuery, prodPage, PRODUCT_PAGE_SIZE);
        } else if (selectedCatId) {
          res = await getProductsByCategory(selectedCatId, prodPage, PRODUCT_PAGE_SIZE);
        } else {
          res = await getAllProducts(prodPage, PRODUCT_PAGE_SIZE);
        }

        const newProducts = res.data.content || [];
        const totalPages = res.data.totalPages || 0;

        if (prodPage === 0) {
          setProducts(newProducts);
        } else {
          setProducts(prev => [...prev, ...newProducts]);
        }
        setHasMore(prodPage < totalPages - 1);

      } catch (err) { console.error("Prod Error", err); } 
      finally { setProdLoading(false); }
    };

    fetchProducts();
    if (prodPage === 0) window.scrollTo({ top: 0, behavior: 'smooth' });
    // eslint-disable-next-line
  }, [searchQuery, isSearching, prodPage, selectedCatId]);

  // --- 3. Infinite Scroll ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !prodLoading) {
          setProdPage(prev => prev + 1);
        }
      }, { threshold: 1.0 }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => { if (observerTarget.current) observer.unobserve(observerTarget.current); };
  }, [hasMore, prodLoading]);


  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) {
      setIsSearching(false);
      setSearchQuery('');
      setSelectedCatId(null);
      setProducts([]);
    } else {
      setIsSearching(true);
      setSearchQuery(inputText);
      setSelectedCatId(null);
      setProdPage(0);
      setProducts([]); 
    }
  };

  const handleCategorySelect = (id) => {
    setIsSearching(false);
    setInputText('');
    setSearchQuery('');
    setSelectedCatId(id);
    setProdPage(0);
    setProducts([]); 
  };

  const scroll = (direction) => {
    if(scrollRef.current) {
      const { current } = scrollRef;
      const amount = 300;
      direction === 'left' ? current.scrollBy({ left: -amount, behavior: 'smooth' }) : current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="pb-12 bg-white min-h-screen">
      
      {/* --- Search Bar --- */}
      <div className="sticky top-0 z-40 bg-white py-4 shadow-sm">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSearchSubmit} className="max-w-4xl mx-auto flex gap-2">
            <div className="flex-1 relative group">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-lg focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all placeholder-gray-500 font-medium border border-transparent focus:border-green-500"
                placeholder="Search for 'Milk', 'Vegetables', 'Chips'..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>
            <button type="submit" className="bg-green-700 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-800 transition shadow-sm cursor-pointer">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="container mx-auto pt-6 px-4">
        
        {/* --- Category Slider --- */}
        <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isSearching ? `Categories: "${searchQuery}"` : "Shop by Category"}
                </h2>
                <div className="flex gap-2">
                    <button onClick={() => scroll('left')} className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition cursor-pointer">
                        <FaChevronLeft className="text-gray-600" size={12}/>
                    </button>
                    <button onClick={() => scroll('right')} className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition cursor-pointer">
                        <FaChevronRight className="text-gray-600" size={12}/>
                    </button>
                </div>
            </div>

            <div 
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {/* --- LOGIC: Loading vs Data vs Empty --- */}
                
                {catLoading ? (
                  // 1. LOADING STATE (Show 6 Skeletons)
                  [...Array(6)].map((_, i) => <CategorySkeleton key={i} />)
                ) : categories.length > 0 ? (
                  // 2. DATA STATE
                  categories.map(cat => (
                    <div key={cat.id} onClick={() => handleCategorySelect(cat.id)}
                        className={`flex-shrink-0 w-32 md:w-40 p-4 rounded-xl cursor-pointer transition-all border
                        ${selectedCatId === cat.id ? 'border-green-600 bg-green-50 shadow-sm' : 'border-gray-100 bg-white hover:shadow-md'}`}>
                        <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-3 relative flex items-center justify-center">
                           <img loading="lazy" decoding="async" src={getOptimizedImageUrl(cat.imageUrl, 200)} alt={cat.name} className="w-full h-full object-contain" />
                        </div>
                        <p className={`text-center font-bold text-sm truncate ${selectedCatId === cat.id ? 'text-green-700' : 'text-gray-700'}`}>
                            {cat.name}
                        </p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-gray-500 italic w-full text-center">No categories found.</div>
                )}
            </div>
        </div>

        {/* --- Product Grid --- */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            {isSearching ? `Products: "${searchQuery}"` : (selectedCatId ? "Category Products" : "All Products")}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white border border-gray-100 rounded-xl p-3 hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full group">
                <Link to={`/product/${product.id}`} className="block">
                  <div className="h-32 flex items-center justify-center mb-3 bg-gray-50 rounded-lg">
                    <img loading="lazy" decoding="async" src={getOptimizedImageUrl(product.imageUrl, 300)} alt={product.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                  </div>
                  <h3 className="text-gray-800 font-semibold text-sm leading-tight line-clamp-2 h-9">{product.name}</h3>
                  <p className="text-xs text-gray-400 mt-1">{product.quantity} {product.unit}</p>
                </Link>

                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50">
                  <span className="text-sm font-bold text-gray-900">₹{product.price}</span>
                  <button onClick={() => addToCart(product)} className="text-green-700 border border-green-200 bg-green-50 px-3 py-1 rounded text-xs font-bold hover:bg-green-600 hover:text-white transition-colors cursor-pointer">
                    ADD
                  </button>
                </div>
              </div>
            ))}
          </div>

          {products.length === 0 && !prodLoading && (
            <div className="text-center py-20 text-gray-400">
              <h3 className="text-xl">No products found.</h3>
            </div>
          )}

          {/* Infinite Scroll Loader */}
          <div ref={observerTarget} className="h-20 flex items-center justify-center w-full mt-8">
             {prodLoading && (
                <div className="flex items-center gap-2 text-green-700 font-bold">
                    <FaSpinner className="animate-spin" /> Loading...
                </div>
             )}
             {!hasMore && products.length > 0 && (
                <p className="text-gray-400 text-sm">You've reached the end of the list</p>
             )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;
