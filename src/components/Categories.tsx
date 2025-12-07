import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCategories } from '../context/CategoryContext'; // ✅ Add this import

const Categories: React.FC = () => {
  const { getProductsByCategory } = useProducts();
  const { categories } = useCategories(); // ✅ Use dynamic categories instead of static import
  const [showAll, setShowAll] = useState(false);

  // ✅ Limit to 9 categories (3x3) unless "Show All" is clicked
  const displayedCategories = showAll ? categories : categories.slice(0, 9);
  const hasMoreCategories = categories.length > 9;

  return (
    <section id="products" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Our Product Categories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our wide range of premium quality crackers, carefully crafted in Sivakasi 
            to make your celebrations spectacular and memorable.
          </p>
          {/* ✅ Show total category count */}
          <p className="text-sm text-gray-500 mt-2">
            {categories.length} Categories Available
          </p>
        </div>

        {/* ✅ 3x3 Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedCategories.map((category, index) => {
            // ✅ Get dynamic product count for this category
            const categoryProducts = getProductsByCategory(category.id);
            const productCount = categoryProducts.length;

            return (
              <Link
                key={category.id}
                to={`/products/${category.id}`}
                className="group bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-orange-100"
              >
                <div className="relative overflow-hidden rounded-xl mb-4">
                  <img
                    src={category.heroImage}
                    alt={category.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      // ✅ Fallback image if hero image fails to load
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop';
                    }}
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full p-2 text-2xl">
                    {category.icon}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                    {productCount} items {/* ✅ Dynamic product count */}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {category.description}
                </p>
                
                <div className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-red-600 hover:to-orange-600 transition-all text-center">
                  View Products
                </div>
              </Link>
            );
          })}
        </div>

        {/* ✅ View All Categories Button */}
        {hasMoreCategories && !showAll && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-lg rounded-2xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              View All Categories 
              {/* ({categories.length} total) */}
            </button>
          </div>
        )}

        {/* ✅ Show Less Button when all categories are displayed */}
        {showAll && hasMoreCategories && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowAll(false)}
              className="inline-flex items-center justify-center px-8 py-4 bg-gray-600 text-white font-bold text-lg rounded-2xl hover:bg-gray-700 transition-all duration-300"
            >
              Show Less Categories
            </button>
          </div>
        )}

        {/* ✅ Empty State when no categories exist */}
        {categories.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <div className="text-6xl mb-4">📦</div>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No categories available</h3>
            <p className="text-gray-600">
              Categories will appear here once they are added by the admin.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;