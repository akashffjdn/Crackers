import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
import { useCategories } from '../context/CategoryContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaFilter, FaTimes, FaSlidersH } from 'react-icons/fa';

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
          <LoadingSpinner text="Loading products..." />
        </div>
        <Footer />
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
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
              <span className="text-4xl opacity-30">📦</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Category Not Found</h1>
            <p className="text-surface-400 text-sm mb-8">The category you requested does not exist.</p>
            <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-accent text-white text-sm font-semibold hover:shadow-[0_0_30px_rgba(230,57,70,0.25)] transition-all duration-300">
              Back to Shop
            </Link>
          </div>
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

  const soundOptions = ['', 'Low', 'Medium', 'High'];

  return (
    <div className="min-h-screen bg-surface-900 flex flex-col">
      <Header />
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 pt-28 pb-16">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-surface-500 mb-5">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-white transition-colors">Shop</Link>
            {category && (
              <>
                <span>/</span>
                <span className="text-surface-300">{category.name}</span>
              </>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-[-0.02em] mb-2">
                {category?.name || 'All Products'}
              </h1>
              <p className="text-surface-400 text-[15px]">
                {category?.description || 'Browse our complete collection of premium crackers.'}
              </p>
            </div>
            <span className="text-sm text-surface-500 flex-shrink-0">
              {filteredAndSortedProducts.length} product{filteredAndSortedProducts.length !== 1 ? 's' : ''}
            </span>
          </div>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-8 border-b border-white/[0.04]"
        >
          {/* Sort pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold text-surface-500 uppercase tracking-wider mr-1">Sort:</span>
            {sortOptions.map((s) => (
              <button
                key={s.value}
                onClick={() => setSortBy(s.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${sortBy === s.value
                    ? 'bg-white text-surface-900'
                    : 'bg-white/[0.03] text-surface-400 border border-white/[0.06] hover:bg-white/[0.06] hover:text-white'
                  }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Sound + filter toggle */}
          <div className="flex items-center gap-2">
            {soundOptions.map((level) => (
              <button
                key={level}
                onClick={() => setSoundLevel(level)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${soundLevel === level
                    ? 'bg-white text-surface-900'
                    : 'bg-white/[0.03] text-surface-400 border border-white/[0.06] hover:bg-white/[0.06] hover:text-white'
                  }`}
              >
                {level || 'All Sounds'}
              </button>
            ))}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden ml-2 w-9 h-9 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-surface-400 hover:text-white transition-colors"
            >
              <FaSlidersH size={12} />
            </button>
          </div>
        </motion.div>

        <div className="flex gap-8">
          {/* Desktop Sidebar Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden lg:block w-60 flex-shrink-0"
          >
            <div className="sticky top-28 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <h3 className="text-sm font-semibold text-white mb-6 flex items-center gap-2">
                <FaSlidersH size={12} className="text-surface-400" /> Filters
              </h3>

              {/* Sort */}
              <div className="mb-6">
                <label className="block text-[11px] font-semibold text-surface-400 uppercase tracking-[0.15em] mb-2.5">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:border-accent/40 focus:outline-none transition-all appearance-none"
                >
                  <option value="name">Name</option>
                  <option value="price">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>

              {/* Price */}
              <div className="mb-6">
                <label className="block text-[11px] font-semibold text-surface-400 uppercase tracking-[0.15em] mb-2.5">Max Price</label>
                <p className="text-sm text-white font-medium mb-3">₹0 — ₹{priceRange.max}</p>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                  className="w-full accent-accent"
                />
              </div>

              {/* Sound Level */}
              <div className="mb-6">
                <label className="block text-[11px] font-semibold text-surface-400 uppercase tracking-[0.15em] mb-2.5">Sound Level</label>
                <select
                  value={soundLevel}
                  onChange={(e) => setSoundLevel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:border-accent/40 focus:outline-none transition-all appearance-none"
                >
                  <option value="">All Levels</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>

              <button
                onClick={clearFilters}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-surface-400 border border-white/[0.06] hover:text-white hover:border-white/[0.12] transition-all duration-300"
              >
                Clear All Filters
              </button>
            </div>
          </motion.div>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {filteredAndSortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredAndSortedProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                  <span className="text-4xl opacity-30">📦</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {categoryHasNoProducts ? `No Products in ${category?.name}` : (allProductsEmpty ? 'No Products' : 'No matches found')}
                </h3>
                <p className="text-surface-400 text-sm mb-8">
                  {(categoryHasNoProducts || allProductsEmpty)
                    ? 'Check back later or browse other categories.'
                    : 'Try adjusting your filters to find what you\'re looking for.'}
                </p>
                {!(categoryHasNoProducts || allProductsEmpty) ? (
                  <button onClick={clearFilters} className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-accent text-white text-sm font-semibold hover:shadow-[0_0_30px_rgba(230,57,70,0.25)] transition-all duration-300">
                    Clear Filters
                  </button>
                ) : (
                  <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-accent text-white text-sm font-semibold hover:shadow-[0_0_30px_rgba(230,57,70,0.25)] transition-all duration-300">
                    Browse Categories
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