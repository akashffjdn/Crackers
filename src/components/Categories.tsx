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
    <section id="products" className="section-padding bg-gradient-to-b from-white to-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-bold font-display gradient-text mb-6">
            Our Product Categories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our wide range of premium quality crackers, carefully crafted in Sivakasi 
            to make your celebrations spectacular and memorable.
          </p>
          <div className="mt-4">
            <span className="inline-block bg-gradient-to-r from-red-100 to-orange-100 text-red-700 px-4 py-2 rounded-full font-semibold text-sm">
              {categories.length} Categories Available
            </span>
          </div>
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
                className="group card card-hover p-6 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden rounded-2xl mb-4">
                  <img
                    src={category.heroImage}
                    alt={category.name}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md rounded-full p-3 text-3xl shadow-lg transform group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    {productCount} items
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold font-display text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-600 mb-5 line-clamp-3 leading-relaxed">
                  {category.description}
                </p>
                
                <div className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-3.5 rounded-xl font-bold hover:from-red-700 hover:to-orange-700 transition-all text-center shadow-lg group-hover:shadow-xl">
                  View Products →
                </div>
              </Link>
            );
          })}
        </div>

        {/* ✅ View All Categories Button */}
        {hasMoreCategories && !showAll && (
          <div className="text-center mt-12 animate-fade-in">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold text-lg rounded-2xl hover:from-red-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              View All Categories ({categories.length} total)
            </button>
          </div>
        )}

        {/* ✅ Show Less Button when all categories are displayed */}
        {showAll && hasMoreCategories && (
          <div className="text-center mt-12 animate-fade-in">
            <button
              onClick={() => setShowAll(false)}
              className="inline-flex items-center justify-center px-10 py-4 bg-gray-600 text-white font-bold text-lg rounded-2xl hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
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