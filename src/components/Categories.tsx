import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCategories } from '../context/CategoryContext';
import { FaArrowRight, FaSparkles } from 'react-icons/fa';

const Categories: React.FC = () => {
  const { getProductsByCategory } = useProducts();
  const { categories } = useCategories();
  const [showAll, setShowAll] = useState(false);
  const [visibleCategories, setVisibleCategories] = useState<number[]>([]);

  const displayedCategories = showAll ? categories : categories.slice(0, 9);
  const hasMoreCategories = categories.length > 9;

  useEffect(() => {
    // Animate categories in sequence
    displayedCategories.forEach((_, index) => {
      setTimeout(() => {
        setVisibleCategories(prev => [...prev, index]);
      }, index * 100);
    });
  }, [displayedCategories]);

  return (
    <section id="products" className="relative py-24 bg-gradient-to-b from-white via-orange-50/30 to-white overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 text-8xl animate-float">🎆</div>
        <div className="absolute bottom-20 right-10 text-7xl animate-float" style={{ animationDelay: '2s' }}>🎇</div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="inline-flex items-center bg-gradient-to-r from-red-100 to-orange-100 text-red-700 px-6 py-3 rounded-full text-sm font-semibold mb-6">
            <FaSparkles className="mr-2 animate-spin" style={{ animationDuration: '3s' }} />
            <span>Explore Our Collection</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6">
            <span className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              Our Product Categories
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our wide range of premium quality crackers, carefully crafted in Sivakasi 
            to make your celebrations spectacular and memorable.
          </p>
          
          <p className="text-sm text-gray-500 mt-4 font-semibold">
            {categories.length} Categories Available
          </p>
        </div>

        {/* Enhanced 3x3 Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayedCategories.map((category, index) => {
            const categoryProducts = getProductsByCategory(category.id);
            const productCount = categoryProducts.length;
            const isVisible = visibleCategories.includes(index);

            return (
              <Link
                key={category.id}
                to={`/products/${category.id}`}
                className={`group relative overflow-hidden bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border border-gray-100 ${
                  isVisible ? 'animate-scale-in' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 via-orange-500/0 to-yellow-500/0 group-hover:from-red-500/10 group-hover:via-orange-500/10 group-hover:to-yellow-500/10 transition-all duration-500"></div>
                
                {/* Top Border Gradient */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

                {/* Image Container */}
                <div className="relative overflow-hidden rounded-t-3xl h-56">
                  <img
                    src={category.heroImage}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop';
                    }}
                  />
                  
                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Icon Badge */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-2xl p-3 text-3xl shadow-xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    {category.icon}
                  </div>
                  
                  {/* Product Count Badge */}
                  <div className="absolute bottom-4 right-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    {productCount} items
                  </div>

                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </div>
                
                {/* Content */}
                <div className="p-6 relative z-10">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-red-600 transition-colors duration-300">
                    {category.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {category.description}
                  </p>
                  
                  {/* CTA Button */}
                  <div className="flex items-center justify-between bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 px-6 rounded-xl font-semibold group-hover:from-red-600 group-hover:to-orange-600 transition-all duration-300 transform group-hover:scale-105 shadow-lg">
                    <span>View Products</span>
                    <FaArrowRight className="transform group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>

                {/* Decorative Corner Element */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Link>
            );
          })}
        </div>

        {/* Enhanced View All Button */}
        {hasMoreCategories && !showAll && (
          <div className="text-center animate-slide-up">
            <button
              onClick={() => setShowAll(true)}
              className="group relative overflow-hidden inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white font-bold text-lg rounded-2xl hover:from-red-600 hover:via-orange-600 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-red-500/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative z-10 flex items-center space-x-2">
                <span>View All Categories</span>
                <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
              </span>
            </button>
          </div>
        )}

        {/* Show Less Button */}
        {showAll && hasMoreCategories && (
          <div className="text-center animate-slide-up">
            <button
              onClick={() => {
                setShowAll(false);
                setVisibleCategories([]);
              }}
              className="inline-flex items-center justify-center px-10 py-5 bg-gray-600 text-white font-bold text-lg rounded-2xl hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Show Less Categories
            </button>
          </div>
        )}

        {/* Empty State */}
        {categories.length === 0 && (
          <div className="text-center py-20 animate-scale-in">
            <div className="text-gray-400 mb-6">
              <div className="text-8xl mb-4 animate-bounce">📦</div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No categories available</h3>
            <p className="text-gray-600 text-lg">
              Categories will appear here once they are added by the admin.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;
