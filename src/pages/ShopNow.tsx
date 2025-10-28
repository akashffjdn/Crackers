import React , { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header'; //
import Footer from '../components/Footer'; //
// Remove static import: import categories from '../data/categories';
import { useProducts } from '../context/ProductContext'; //
import { useCategories } from '../context/CategoryContext'; //
import LoadingSpinner from '../components/LoadingSpinner'; //
import { FaBox } from 'react-icons/fa'; // Import icon for empty state

const ShopNow: React.FC = () => {
  // Get products, categories, AND their loading/error states
  const { products, isLoading: productsLoading, error: productsError, getProductsByCategory } = useProducts();
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  const [showAll, setShowAll] = useState(false);

  // Limit categories displayed
  const displayedCategories = showAll ? categories : categories.slice(0, 9);
  const hasMoreCategories = categories.length > 9;

  // --- LOADING & ERROR HANDLING ---
  // Show spinner if either categories or products are still loading
  if (categoriesLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner text="Loading categories and products..." />
        </main>
        <Footer />
      </div>
    );
  }

  // Show error message if loading failed for either
  if (categoriesError || productsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center text-red-600">
          Error loading data: {categoriesError || productsError}
        </main>
        <Footer />
      </div>
    );
  }
  // --- END LOADING & ERROR HANDLING ---

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
         <section id="products" className="py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold text-gray-800 mb-4">
                       Explore Our Crackers Categories
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                     Choose from our wide range of premium quality crackers, carefully crafted in Sivakasi
              to make your celebrations spectacular and memorable.
                  </p>
                  {/* Show total category count */}
                  <p className="text-sm text-gray-500 mt-2">
                    {categories.length} Categories Available
                  </p>
                </div>

                {/* Grid Layout */}
                {/* Render only if categories have loaded AND are not empty */}
                {categories.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayedCategories.map((category) => {
                      // **Use the FIXED getProductsByCategory function**
                      // This now correctly counts products even with populated categoryId
                      const productCount = getProductsByCategory(category.id).length;

                      return (
                        <Link
                          key={category.id}
                          to={`/products/${category.id}`}
                          className="group bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-orange-100 flex flex-col" // Added flex flex-col for consistent button position
                        >
                          <div className="relative overflow-hidden rounded-xl mb-4">
                            <img
                              src={category.heroImage}
                              alt={category.name}
                              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop';
                              }}
                            />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full p-2 text-2xl">
                              {category.icon}
                            </div>
                            <div className="absolute bottom-4 right-4 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                              {/* Display the calculated count */}
                              {productCount} items
                            </div>
                          </div>

                          <div className="flex-grow"> {/* Added flex-grow to push button down */}
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                              {category.name}
                            </h3>
                            <p className="text-gray-600 mb-4 line-clamp-3">
                              {category.description}
                            </p>
                          </div>

                          <div className="mt-auto w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-red-600 hover:to-orange-600 transition-all text-center">
                            View Products
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                 ) : (
                   // Empty State when categories array is empty AFTER loading
                   <div className="text-center py-16">
                     <FaBox className="text-6xl text-gray-400 mx-auto mb-4" /> {/* Use FaBox */}
                     <h3 className="text-xl font-medium text-gray-900 mb-2">No categories available</h3>
                     <p className="text-gray-600">
                       Categories will appear here once they are added by the admin.
                     </p>
                   </div>
                 )}

                {/* View All / Show Less Buttons */}
                {/* (Keep this section as it was, it depends on categories.length) */}
                 {hasMoreCategories && !showAll && (
                   <div className="text-center mt-12">
                     <button onClick={() => setShowAll(true)} className="...">
                       View All Categories
                     </button>
                   </div>
                 )}
                 {showAll && hasMoreCategories && (
                   <div className="text-center mt-12">
                     <button onClick={() => setShowAll(false)} className="...">
                       Show Less Categories
                     </button>
                   </div>
                 )}
              </div>
            </section>
      </main>
      <Footer />
    </div>
  );
};

export default ShopNow;