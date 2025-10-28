import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaBox } from 'react-icons/fa';
import { useProducts } from '../context/ProductContext'; //
import { useCart } from '../context/CartContext'; //
import { useCategories } from '../context/CategoryContext'; //
import Header from '../components/Header'; //
import Footer from '../components/Footer'; //
import { formatPriceSimple, calculateDiscount } from '../utils/formatPrice'; //
import LoadingSpinner from '../components/LoadingSpinner'; //

const QuickOrderPage: React.FC = () => {
  // Destructure isLoading/error states from contexts
  const { products, isLoading: productsLoading, error: productsError } = useProducts();
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  // Get cart error state
  const { addToCart, error: cartError } = useCart(); // Destructure error
  const navigate = useNavigate();

  // State remains the same
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [soundLevel, setSoundLevel] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price_low' | 'price_high' | 'rating'>('name');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Filtered products logic (remains the same)
  const filteredProducts = useMemo(() => {
    if (productsLoading || categoriesLoading) return [];
    let filtered = products.filter(product => {
      const matchesCategory = selectedCategoryId ?
        (typeof product.categoryId === 'object' && product.categoryId !== null && '_id' in product.categoryId
          ? (product.categoryId as { _id: string })._id === selectedCategoryId
          : product.categoryId === selectedCategoryId
        )
        : true;
      const matchesSound = soundLevel ? product.soundLevel === soundLevel : true;
      const lowerSearchTerm = searchTerm.toLowerCase();
      const matchesSearch = product.name.toLowerCase().includes(lowerSearchTerm) ||
                            (product.shortDescription && product.shortDescription.toLowerCase().includes(lowerSearchTerm));
      return matchesCategory && matchesSound && matchesSearch;
    });
    switch (sortBy) {
      case 'name': filtered = filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'price_low': filtered = filtered.sort((a, b) => a.price - b.price); break;
      case 'price_high': filtered = filtered.sort((a, b) => b.price - a.price); break;
      case 'rating': filtered = filtered.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }
    return filtered;
  }, [products, selectedCategoryId, soundLevel, searchTerm, sortBy, productsLoading, categoriesLoading]);

  // useEffect to initialize quantities (remains the same)
  useEffect(() => {
    if (!productsLoading) {
      setQuantities(prev => {
        const q: Record<string, number> = {};
        filteredProducts.forEach(p => {
           q[p.id] = prev[p.id] || 1;
        });
        return q;
      });
    }
  }, [filteredProducts, productsLoading]);

  // Handle quantity change (remains the same)
  const handleQuantityChange = (productId: string, value: number) => {
     const numValue = Number(value);
     if (!isNaN(numValue)) {
       setQuantities(prev => ({ ...prev, [productId]: Math.max(1, numValue) }));
     }
  };

  // *** UPDATED handleAddToCart ***
  const handleAddToCart = async (productId: string) => { // Make async
    const product = products.find(p => p.id === productId);
    if (!product) return;
    if (product.stock === 0) {
      alert('Sorry, this product is out of stock.');
      return;
    }
    const qty = quantities[productId] ?? 1;
    const addQty = Math.min(qty, product.stock);
    const finalAddQty = Math.max(1, addQty); // Ensure at least 1 if stock exists

    // Call addToCart once with the final quantity
    const success = await addToCart(product, finalAddQty); // Pass quantity and await

    if (!success && cartError === "Please log in to add items.") { // Check exact error message
      alert("Please log in to add items to your cart.");
      // Optionally redirect: navigate('/login');
    } else if (!success) {
      alert(`Failed to add item: ${cartError || 'Unknown error'}`);
    } else {
      // Optional: Only show success if needed
      // alert(`Added ${finalAddQty} × ${product.name} to your cart.`);
    }
  };

  // Other handlers (remain the same)
  const navigateToProduct = (productId: string) => { navigate(`/product/${productId}`); window.scrollTo(0, 0); };
  const handleCategoryClick = (categoryId: string | null) => { setSelectedCategoryId(categoryId); setDrawerOpen(false); };

  // LOADING & ERROR HANDLING (remains the same)
  if (categoriesLoading || productsLoading) {
    return (
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner text="Loading quick order..." />
        </main>
        <Footer />
      </>
    );
  }
  if (categoriesError || productsError) {
    return (
      <>
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center text-red-600">
          Error loading data: {categoriesError || productsError}
        </main>
        <Footer />
      </>
    );
  }

  // --- Main Render ---
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-center mb-8">Quick Order</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Filters, search, grid */}
          <section className="flex-1">
            {/* Mobile Hamburger for Category Filter */}
            <div className="lg:hidden mb-4 flex items-center justify-between">
              <div className="flex-1 flex items-center space-x-3">
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold shadow hover:bg-gray-200 transition"
                  aria-label="Open categories menu"
                >
                  <FaBars className="mr-2" />
                  Categories
                </button>
                <span className="text-gray-700">
                  {selectedCategoryId
                    ? (categories.find(c => c.id === selectedCategoryId)?.name ?? 'Category')
                    : 'All Categories'
                  }
                </span>
              </div>
            </div>

            {/* Top filter bar */}
            <div className="mb-4 flex flex-col md:flex-row md:space-x-4">
              <input type="search" placeholder="Search products..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="flex-grow rounded-full border border-gray-300 px-5 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600" aria-label="Product search" />
              <select className="mt-3 md:mt-0 rounded-full border border-gray-300 px-4 py-3 text-gray-700 bg-white" value={soundLevel} onChange={e => setSoundLevel(e.target.value)} aria-label="Filter by sound level">
                <option value="">All Sound Levels</option><option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option><option value="Mixed">Mixed</option>
              </select>
              <select className="mt-3 md:mt-0 rounded-full border border-gray-300 px-4 py-3 text-gray-700 bg-white" value={sortBy} onChange={e => setSortBy(e.target.value as any)} aria-label="Sort products">
                <option value="name">Sort by Name</option><option value="price_low">Price: Low to High</option><option value="price_high">Price: High to Low</option><option value="rating">Sort by Rating</option>
              </select>
            </div>

            {/* Grid */}
            {filteredProducts.length === 0 ? (
               <div className="text-center text-gray-500 mt-20 py-10 border border-dashed rounded-lg">
                   <FaBox className="mx-auto text-4xl text-gray-300 mb-4" />
                   <p>No products found matching your criteria.</p>
               </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => {
                  const discount = calculateDiscount(product.mrp, product.price);
                  const qty = quantities[product.id] || 1;
                  const availableStock = product.stock;
                  return (
                    <div key={product.id} className="border rounded-lg p-5 shadow-sm flex flex-col bg-white">
                      {/* Product Image and Name (Clickable) */}
                      <div role="button" tabIndex={0} className="cursor-pointer" onClick={() => navigateToProduct(product.id)} onKeyDown={e => e.key === 'Enter' && navigateToProduct(product.id)} aria-label={`View ${product.name}`}>
                        <img src={product.images[0]} alt={product.name} className="w-full h-44 object-cover rounded-md mb-4" loading="lazy" onError={(e)=>(e.target as HTMLImageElement).src='fallback-image.png'} />
                        <h2 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">{product.name}</h2>
                      </div>
                      {/* Description and Price */}
                      <p className="text-gray-600 text-sm line-clamp-2 mb-2">{product.shortDescription}</p>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-red-600 font-bold text-xl">{formatPriceSimple(product.price)}</span>
                        {discount > 0 && (<> <span className="line-through text-gray-400 text-sm">{formatPriceSimple(product.mrp)}</span> <span className="bg-green-100 text-green-800 text-xs rounded px-2 py-0.5">{discount}% OFF</span> </>)}
                      </div>
                      {/* Stock, Quantity, Add Button */}
                      <div className="mt-auto flex items-center justify-between space-x-3">
                        <div>
                          {availableStock === 0 ? (<span className="text-red-600 font-semibold text-sm">Out of stock</span>) : availableStock < 10 ? (<span className="text-yellow-600 font-semibold text-sm">Only {availableStock} left</span>) : (<span className="text-green-600 font-semibold text-sm">In stock</span>)}
                        </div>
                        <input
                          type="number"
                          min={1}
                          max={availableStock > 0 ? availableStock : 1}
                          value={qty}
                          onChange={e => handleQuantityChange(product.id, Number(e.target.value))}
                          className="w-16 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                          disabled={availableStock === 0}
                          aria-label={`Quantity for ${product.name}`}
                        />
                        <button
                          onClick={() => handleAddToCart(product.id)} // Use updated handler
                          disabled={availableStock === 0}
                          className="bg-red-600 text-white px-4 rounded py-2 font-semibold hover:bg-red-700 transition disabled:cursor-not-allowed disabled:bg-gray-400"
                          aria-label={`Add ${qty} of ${product.name} to cart`}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Category sidebar - desktop only */}
          <aside className="w-full lg:w-64 hidden lg:block">
             <div className="sticky top-24 p-6 bg-white border rounded-xl shadow-sm">
               <h2 className="text-lg font-semibold mb-4">Categories</h2>
               <ul role="list" className="space-y-2">
                 <li> <button type="button" onClick={() => setSelectedCategoryId(null)} className={`block w-full text-left px-4 py-2 rounded-full font-semibold transition ${selectedCategoryId === null ? 'bg-red-600 text-white shadow' : 'text-gray-700 hover:bg-red-100'}`} aria-pressed={selectedCategoryId === null}> All Categories </button> </li>
                 {categories.map(category => ( <li key={category.id}> <button type="button" onClick={() => setSelectedCategoryId(category.id)} className={`block w-full text-left px-4 py-2 rounded-full font-semibold transition ${selectedCategoryId === category.id ? 'bg-red-600 text-white shadow' : 'text-gray-700 hover:bg-red-100'}`} aria-pressed={selectedCategoryId === category.id}> {category.name} </button> </li> ))}
               </ul>
             </div>
          </aside>
        </div>
      </main>

      {/* Hamburger Drawer for mobile category filter */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50">
           <div className="fixed inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} aria-label="Close categories" />
           <aside className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-10 p-6 flex flex-col">
             <div className="mb-6 flex items-center justify-between">
               <h2 className="text-lg font-bold">Categories</h2>
               <button onClick={() => setDrawerOpen(false)} aria-label="Close categories"> <FaTimes className="text-xl" /> </button>
             </div>
             <ul className="space-y-2 flex-1 overflow-y-auto">
               <li>
                 <button type="button" onClick={() => handleCategoryClick(null)} className={`block w-full text-left px-4 py-2 rounded-full font-semibold transition ${selectedCategoryId === null ? 'bg-red-600 text-white shadow' : 'text-gray-700 hover:bg-red-100'}`} aria-pressed={selectedCategoryId === null}> All Categories </button>
               </li>
               {categories.map(category => (
                 <li key={category.id}>
                   <button type="button" onClick={() => handleCategoryClick(category.id)} className={`block w-full text-left px-4 py-2 rounded-full font-semibold transition ${selectedCategoryId === category.id ? 'bg-red-600 text-white shadow' : 'text-gray-700 hover:bg-red-100'}`} aria-pressed={selectedCategoryId === category.id}> {category.name} </button>
                 </li>
               ))}
             </ul>
           </aside>
        </div>
      )}

      <Footer />
    </>
  );
};

export default QuickOrderPage;