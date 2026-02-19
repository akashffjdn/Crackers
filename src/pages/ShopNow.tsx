import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useProducts } from '../context/ProductContext';
import { useCategories } from '../context/CategoryContext';
import LoadingSpinner from '../components/LoadingSpinner';

const ShopNow: React.FC = () => {
  const { products, isLoading: productsLoading, error: productsError, getProductsByCategory } = useProducts();
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  const [showAll, setShowAll] = useState(false);

  const displayedCategories = showAll ? categories : categories.slice(0, 9);
  const hasMoreCategories = categories.length > 9;

  if (categoriesLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-surface-900 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-16">
          <LoadingSpinner text="Loading collections..." />
        </main>
        <Footer />
      </div>
    );
  }

  if (categoriesError || productsError) {
    return (
      <div className="min-h-screen bg-surface-900 flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-6 pt-28 text-center">
          <p className="text-accent">{categoriesError || productsError}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-900">
      <Header />
      <main className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Hero header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-16"
          >
            <p className="text-[11px] font-semibold text-accent tracking-[0.2em] uppercase mb-4">Shop</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-[-0.02em] leading-[1.05] mb-4">
              Explore our<br />
              <span className="bg-gradient-to-r from-accent to-gold bg-clip-text text-transparent">collections.</span>
            </h1>
            <p className="text-lg text-surface-400 max-w-xl">
              Premium crackers crafted in Sivakasi — {categories.length} collections, {products.length}+ products.
            </p>
          </motion.div>

          {/* Categories Grid */}
          {categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedCategories.map((category: any, index: number) => {
                const productCount = getProductsByCategory(category.id).length;

                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                  >
                    <Link
                      to={`/products/${category.id}`}
                      className="group block relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.1] transition-all duration-500 h-full"
                    >
                      {/* Image */}
                      <div className="relative overflow-hidden h-56">
                        <img
                          src={category.heroImage}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-surface-900/30 to-transparent" />

                        {/* Product count */}
                        <span className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-semibold text-white border border-white/[0.1]">
                          {productCount} items
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-accent transition-colors duration-300">
                          {category.name}
                        </h3>
                        <p className="text-sm text-surface-400 line-clamp-2 mb-4 leading-relaxed">
                          {category.description}
                        </p>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent group-hover:gap-2.5 transition-all duration-300">
                          View Products <FaArrowRight size={10} />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                <span className="text-4xl opacity-30">📦</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No collections available</h3>
              <p className="text-surface-400 text-sm">Collections will appear here once added.</p>
            </div>
          )}

          {/* View All / Show Less */}
          {hasMoreCategories && (
            <div className="text-center mt-12">
              <button
                onClick={() => setShowAll(!showAll)}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-white/[0.1] text-white text-sm font-semibold hover:bg-white/[0.04] transition-all duration-300"
              >
                {showAll ? 'Show Less' : 'View All Collections'}
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShopNow;