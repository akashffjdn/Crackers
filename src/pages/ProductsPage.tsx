// src/pages/ProductsPage.tsx
import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom'; // Added Link
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
import { useCategories } from '../context/CategoryContext';
import LoadingSpinner from '../components/LoadingSpinner'; // Import spinner
import { FaBox } from 'react-icons/fa'; // Import icon for empty state

const ProductsPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  // Destructure isLoading and error
  const { products, isLoading: productsLoading, error: productsError } = useProducts();
  const { categories, isLoading: categoriesLoading, error: categoriesError, getCategoryById } = useCategories();
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [soundLevel, setSoundLevel] = useState('');

  // Get category only after categories have loaded
  const category = !categoriesLoading && categoryId ? getCategoryById(categoryId) : null;
  // Use products directly, filter in useMemo
  const allProducts = products;

  const filteredAndSortedProducts = useMemo(() => {
    // Return empty array if products haven't loaded yet
    if (productsLoading) return [];

    let categoryProducts = categoryId
        ? allProducts.filter(p => {
            // Handle both populated object and string ID from backend potentially
            if (typeof p.categoryId === 'object' && p.categoryId !== null && '_id' in p.categoryId) {
                 return (p.categoryId as { _id: string })._id === categoryId;
             }
             return p.categoryId === categoryId;
        })
        : allProducts;

    let filtered = categoryProducts.filter(product => {
      const withinPriceRange = product.price >= priceRange.min && product.price <= priceRange.max;
      const matchesSoundLevel = !soundLevel || product.soundLevel === soundLevel;
      return withinPriceRange && matchesSoundLevel;
    });

    // Sort
    filtered.sort((a, b) => {
       switch (sortBy) {
         case 'name': return a.name.localeCompare(b.name);
         case 'price': return a.price - b.price;
         case 'price-desc': return b.price - a.price;
         case 'rating': return b.rating - a.rating;
         // Add case for newest if needed (requires createdAt field from backend)
         // case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
         default: return 0;
       }
    });

    return filtered;
  }, [allProducts, categoryId, sortBy, priceRange, soundLevel, productsLoading]); // Added productsLoading dependency


  // --- LOADING AND ERROR HANDLING ---
  if (productsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner text="Loading products..." />
        </div>
        <Footer />
      </div>
    );
  }

  if (productsError || categoriesError) {
       return (
         <div className="min-h-screen bg-gray-50 flex flex-col">
           <Header />
           <div className="flex-1 container mx-auto px-4 py-16 text-center text-red-600">
             Error loading data: {productsError || categoriesError}
           </div>
           <Footer />
         </div>
       );
  }
   // --- END LOADING AND ERROR HANDLING ---


  // Handle case where category ID is invalid after loading
   if (categoryId && !category && !categoriesLoading) {
     return (
       <div className="min-h-screen bg-gray-50 flex flex-col">
         <Header />
         <div className="flex-1 container mx-auto px-4 py-16 text-center">
           <FaBox className="text-6xl text-gray-400 mx-auto mb-4" />
           <h1 className="text-2xl font-bold text-gray-900 mb-2">Category Not Found</h1>
           <p className="text-gray-600 mb-6">The category you requested does not exist.</p>
           <Link to="/shop" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Back to Shop</Link> {/* Added styling */}
         </div>
         <Footer />
       </div>
     );
   }

  // Determine if the category exists but just has no products matching filters
  const categoryHasNoProducts = categoryId && category && filteredAndSortedProducts.length === 0 && allProducts.some(p => {
       // Consistent check for categoryId matching
       if (typeof p.categoryId === 'object' && p.categoryId !== null && '_id' in p.categoryId) {
           return (p.categoryId as { _id: string })._id === categoryId;
       }
       return p.categoryId === categoryId;
   });
  const allProductsEmpty = !categoryId && filteredAndSortedProducts.length === 0 && allProducts.length > 0; // Check if filters resulted in empty, but products exist


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/30 flex flex-col">
      <Header />
      <div className="flex-1 container-custom px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block relative mb-6">
            <div className="absolute inset-0 bg-yellow-400 rounded-full blur-2xl opacity-30"></div>
            <div className="relative text-7xl mb-4">{category?.icon || '🎇'}</div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold font-display gradient-text mb-4">
            {category?.name || 'All Products'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6 leading-relaxed">
            {category?.description || 'Browse all available fireworks.'}
          </p>
          <div className="flex items-center justify-center space-x-4">
            <span className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg">
              {filteredAndSortedProducts.length} Products Found
            </span>
          </div>
        </div>

        {/* Filters and Products */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 sticky top-28 border border-gray-100 animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold font-display text-gray-900">Filters</h3>
                <button
                  onClick={() => { setSortBy('name'); setPriceRange({ min: 0, max: 1000 }); setSoundLevel(''); }}
                  className="text-sm text-red-600 hover:text-red-700 font-semibold transition-colors"
                >
                  Reset
                </button>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white transition-all font-medium"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Max Price: ₹{priceRange.max}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                  className="w-full h-3 bg-gradient-to-r from-red-200 to-orange-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>₹0</span>
                  <span>₹1000</span>
                </div>
              </div>

              {/* Sound Level */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Sound Level</label>
                <select
                  value={soundLevel}
                  onChange={(e) => setSoundLevel(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white transition-all font-medium"
                >
                  <option value="">All Levels</option>
                  <option value="Low">Low Sound</option>
                  <option value="Medium">Medium Sound</option>
                  <option value="High">High Sound</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>

              {/* Clear Filters Button */}
              <button
                onClick={() => { setSortBy('name'); setPriceRange({ min: 0, max: 1000 }); setSoundLevel(''); }}
                className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all transform hover:scale-105"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {filteredAndSortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
                {filteredAndSortedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-100 animate-scale-in">
                <div className="inline-block relative mb-6">
                  <div className="absolute inset-0 bg-gray-200 rounded-full blur-2xl opacity-50"></div>
                  <FaBox className="relative text-7xl text-gray-300 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold font-display text-gray-900 mb-3">
                  {categoryHasNoProducts
                    ? `No Products in ${category?.name}`
                    : allProductsEmpty
                    ? 'No Products Available'
                    : 'No Products Match Filters'}
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {categoryHasNoProducts || allProductsEmpty
                    ? 'Check back later or browse other categories.'
                    : 'Try adjusting your filters to find what you\'re looking for.'}
                </p>
                {!(categoryHasNoProducts || allProductsEmpty) ? (
                  <button
                    onClick={() => {
                      setSortBy('name');
                      setPriceRange({ min: 0, max: 1000 });
                      setSoundLevel('');
                    }}
                    className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:from-red-700 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Clear All Filters
                  </button>
                ) : (
                  <Link
                    to="/shop"
                    className="inline-block bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:from-red-700 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Browse Other Categories
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductsPage;