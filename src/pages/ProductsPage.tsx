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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Category Header */}
        <div className="text-center mb-12">
           <div className="text-6xl mb-4">{category?.icon || '🎇'}</div> {/* Default icon */}
           <h1 className="text-4xl font-bold text-gray-900 mb-4">{category?.name || 'All Products'}</h1>
           <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
             {category?.description || 'Browse all available fireworks.'}
           </p>
           <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
             <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full font-semibold">
               {filteredAndSortedProducts.length} Products Found
             </span>
             {/* You can add more badges here if needed */}
           </div>
        </div>

        {/* Filters and Products */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Bar */}
          <div className="lg:w-1/4">
             <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24"> {/* Adjusted top */}
               <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
               {/* Sort By */}
               <div className="mb-6">
                 <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                 <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white">
                   <option value="name">Name</option>
                   <option value="price">Price: Low to High</option>
                   <option value="price-desc">Price: High to Low</option>
                   <option value="rating">Rating</option>
                 </select>
               </div>
               {/* Price Range */}
               <div className="mb-6">
                 <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                 <input type="range" min="0" max="1000" step="10" value={priceRange.max} onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"/> {/* Added accent color */}
                 <div className="text-sm text-gray-600 mt-1">₹0 - ₹{priceRange.max}</div>
               </div>
               {/* Sound Level */}
               <div className="mb-6">
                 <label className="block text-sm font-medium text-gray-700 mb-2">Sound Level</label>
                 <select value={soundLevel} onChange={(e) => setSoundLevel(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white">
                   <option value="">All Levels</option>
                   <option value="Low">Low</option>
                   <option value="Medium">Medium</option>
                   <option value="High">High</option>
                   <option value="Mixed">Mixed</option>
                 </select>
               </div>
               {/* Clear Filters */}
               <button onClick={() => { setSortBy('name'); setPriceRange({ min: 0, max: 1000 }); setSoundLevel(''); }} className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                 Clear Filters
               </button>
             </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {filteredAndSortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              // Empty State - More specific messages
              <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
                <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    { categoryHasNoProducts ? `No Products in ${category?.name}` : (allProductsEmpty ? 'No Products Available' : 'No Products Match Filters') }
                </h3>
                <p className="text-gray-600 mb-6">
                  { (categoryHasNoProducts || allProductsEmpty)
                    ? `Check back later or browse other categories.`
                    : 'Try adjusting your filters to find what you\'re looking for.'
                  }
                </p>
                { !(categoryHasNoProducts || allProductsEmpty) && ( // Show clear filters only if filters caused empty state
                    <button
                      onClick={() => { setSortBy('name'); setPriceRange({ min: 0, max: 1000 }); setSoundLevel(''); }}
                      className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    >
                      Clear All Filters
                    </button>
                )}
                 { (categoryHasNoProducts || allProductsEmpty) && ( // Show browse button if category/all is empty
                    <Link
                      to="/shop"
                      className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
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