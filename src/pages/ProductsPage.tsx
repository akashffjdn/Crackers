import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
import { useCategories } from '../context/CategoryContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaFilter, FaTimes } from 'react-icons/fa';

const ProductsPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { products, isLoading: productsLoading, error: productsError } = useProducts();
  const { categories, isLoading: categoriesLoading, error: categoriesError, getCategoryById } = useCategories();
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [soundLevel, setSoundLevel] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const category = !categoriesLoading && categoryId ? getCategoryById(categoryId) : null;
  const allProducts = products;

  const filteredAndSortedProducts = useMemo(() => {
    if (productsLoading) return [];

    let categoryProducts = categoryId
      ? allProducts.filter(p => {
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

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'price': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        default: return 0;
      }
    });

    return filtered;
  }, [allProducts, categoryId, sortBy, priceRange, soundLevel, productsLoading]);

  const clearFilters = () => {
    setSortBy('name');
    setPriceRange({ min: 0, max: 1000 });
    setSoundLevel('');
  };

  if (productsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-surface-900 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center pt-16">
          <LoadingSpinner text="Loading products..." fullScreen />
        </div>
      </div>
    );
  }

  if (productsError || categoriesError) {
    return (
      <div className="min-h-screen bg-surface-900 flex flex-col">
        <Header />
        <div className="flex-1 max-w-7xl mx-auto px-6 pt-28 text-center">
          <p className="text-accent">{productsError || categoriesError}</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (categoryId && !category && !categoriesLoading) {
    return (
      <div className="min-h-screen bg-surface-900 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-6 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
              <span className="text-4xl">📦</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Category Not Found</h1>
            <p className="text-surface-400 text-sm mb-8">The category you requested does not exist.</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-white font-semibold hover:shadow-[0_0_30px_rgba(230,57,70,0.4)] transition-all duration-300 hover:scale-105"
            >
              Back to Shop
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  const categoryHasNoProducts = categoryId && category && filteredAndSortedProducts.length === 0 && allProducts.some(p => {
    if (typeof p.categoryId === 'object' && p.categoryId !== null && '_id' in p.categoryId) {
      return (p.categoryId as { _id: string })._id === categoryId;
    }
    return p.categoryId === categoryId;
  });
  const allProductsEmpty = !categoryId && filteredAndSortedProducts.length === 0 && allProducts.length > 0;

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'price', label: 'Price ↑' },
    { value: 'price-desc', label: 'Price ↓' },
    { value: 'rating', label: 'Top Rated' },
  ];

  const soundOptions = [
    { value: '', label: 'All Sounds' },
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
  ];

  return (
    <div className="min-h-screen bg-surface-900">
      <Header />
      <main className="pt-20 pb-16">
        {/* Breadcrumb */}
        <div className="border-b border-surface-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-surface-400 hover:text-white transition-colors">
                Home
              </Link>
              <span className="text-surface-600">/</span>
              <Link to="/shop" className="text-surface-400 hover:text-white transition-colors">
                Shop
              </Link>
              {category && (
                <>
                  <span className="text-surface-600">/</span>
                  <span className="text-white">{category.name}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {category?.name || 'All Products'}
            </h1>
            <p className="text-surface-400">
              {category?.description || 'Multi-shot fireworks that launch effects repeatedly into the sky from a single box.'}
            </p>
          </motion.div>

          {/* Results Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center justify-between mb-8"
          >
            <span className="text-surface-400">
              <span className="text-white font-semibold">{filteredAndSortedProducts.length}</span> product
              {filteredAndSortedProducts.length !== 1 ? 's' : ''} found
            </span>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-800 border border-surface-700 text-white hover:border-accent transition-colors"
            >
              <FaFilter size={14} />
              Filters
            </button>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}
            >
              <div className="sticky top-24 bg-surface-800/50 border border-surface-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <FaFilter size={16} />
                    Filters
                  </h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden text-surface-400 hover:text-white"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>

                {/* Sort By */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-surface-400 mb-3">SORT BY</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-800 border border-surface-700 text-white text-sm focus:border-accent focus:outline-none"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-surface-400 mb-3">MAX PRICE</label>
                  <p className="text-white font-semibold mb-3">₹0 — ₹{priceRange.max}</p>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-surface-700 rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>

                {/* Sound Level */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-surface-400 mb-3">SOUND LEVEL</label>
                  <select
                    value={soundLevel}
                    onChange={(e) => setSoundLevel(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-800 border border-surface-700 text-white text-sm focus:border-accent focus:outline-none"
                  >
                    {soundOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={clearFilters}
                  className="w-full py-2.5 rounded-lg text-sm font-semibold text-surface-400 border border-surface-700 hover:text-white hover:border-accent transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            </motion.div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {filteredAndSortedProducts.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredAndSortedProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
                    <span className="text-4xl">📦</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {categoryHasNoProducts
                      ? `No Products in ${category?.name}`
                      : allProductsEmpty
                      ? 'No Products'
                      : 'No matches found'}
                  </h3>
                  <p className="text-surface-400 mb-8">
                    {categoryHasNoProducts || allProductsEmpty
                      ? 'Check back later or browse other categories.'
                      : 'Try adjusting your filters to find what you\'re looking for.'}
                  </p>
                  {!(categoryHasNoProducts || allProductsEmpty) ? (
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-white font-semibold hover:shadow-[0_0_30px_rgba(230,57,70,0.4)] transition-all duration-300 hover:scale-105"
                    >
                      Clear Filters
                    </button>
                  ) : (
                    <Link
                      to="/shop"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-white font-semibold hover:shadow-[0_0_30px_rgba(230,57,70,0.4)] transition-all duration-300 hover:scale-105"
                    >
                      Browse Categories
                    </Link>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;
