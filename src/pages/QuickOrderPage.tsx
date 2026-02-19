import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBars, FaTimes, FaBox, FaShoppingCart, FaSearch } from 'react-icons/fa';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useCategories } from '../context/CategoryContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Dropdown from '../components/Dropdown';
import { formatPriceSimple, calculateDiscount } from '../utils/formatPrice';
import LoadingSpinner from '../components/LoadingSpinner';

const QuickOrderPage: React.FC = () => {
  const { products, isLoading: productsLoading, error: productsError } = useProducts();
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  const { addToCart, error: cartError } = useCart();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [soundLevel, setSoundLevel] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price_low' | 'price_high' | 'rating'>('name');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    if (productsLoading || categoriesLoading) return [];
    let filtered = products.filter(product => {
      const matchesCategory = selectedCategoryId ?
        (typeof product.categoryId === 'object' && product.categoryId !== null && '_id' in product.categoryId
          ? (product.categoryId as { _id: string })._id === selectedCategoryId
          : product.categoryId === selectedCategoryId
        ) : true;
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

  const handleQuantityChange = (productId: string, value: number) => {
     const numValue = Number(value);
     if (!isNaN(numValue)) {
       setQuantities(prev => ({ ...prev, [productId]: Math.max(1, numValue) }));
     }
  };

  const handleAddToCart = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    if (product.stock === 0) {
      alert('Sorry, this product is out of stock.');
      return;
    }
    const qty = quantities[productId] ?? 1;
    const addQty = Math.min(qty, product.stock);
    const finalAddQty = Math.max(1, addQty);

    const success = await addToCart(product, finalAddQty);

    if (!success && cartError === "Please log in to add items.") {
      alert("Please log in to add items to your cart.");
    } else if (!success) {
      alert(`Failed to add item: ${cartError || 'Unknown error'}`);
    }
  };

  const navigateToProduct = (productId: string) => {
    navigate(`/product/${productId}`);
    window.scrollTo(0, 0);
  };

  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    setDrawerOpen(false);
  };

  if (categoriesLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-surface-900 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner text="Loading quick order..." />
        </main>
        <Footer />
      </div>
    );
  }

  if (categoriesError || productsError) {
    return (
      <div className="min-h-screen bg-surface-900 flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-6 py-24 text-center text-accent">
          Error: {categoriesError || productsError}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-900 flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-6 pt-28 pb-20">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <p className="text-[11px] font-semibold text-accent tracking-[0.2em] uppercase mb-4">
            Quick Order
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-[-0.02em] leading-[1.05] mb-4">
            Order in bulk,<br />
            <span className="bg-gradient-to-r from-accent to-gold bg-clip-text text-transparent">save time.</span>
          </h1>
          <p className="text-lg text-surface-400 max-w-xl">
            Add multiple products to your cart quickly with our streamlined bulk ordering interface.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <section className="flex-1">
            {/* Filters Bar */}
            <div className="mb-6 flex flex-col md:flex-row gap-4">
              {/* Mobile Category Button */}
              <div className="lg:hidden">
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white font-medium hover:bg-white/[0.05] transition-all"
                >
                  <FaBars />
                  <span>{selectedCategoryId ? (categories.find(c => c.id === selectedCategoryId)?.name ?? 'Category') : 'All Categories'}</span>
                </button>
              </div>

              {/* Search */}
              <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" size={16} />
                <input
                  type="search"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-surface-500 focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                />
              </div>

              {/* Sound Level */}
              <div className="w-full md:w-48">
                <Dropdown
                  value={soundLevel}
                  onChange={setSoundLevel}
                  options={[
                    { value: '', label: 'All Sounds' },
                    { value: 'Low', label: 'Low' },
                    { value: 'Medium', label: 'Medium' },
                    { value: 'High', label: 'High' },
                    { value: 'Mixed', label: 'Mixed' }
                  ]}
                  placeholder="All Sounds"
                />
              </div>

              {/* Sort */}
              <div className="w-full md:w-56">
                <Dropdown
                  value={sortBy}
                  onChange={(value) => setSortBy(value as any)}
                  options={[
                    { value: 'name', label: 'Name' },
                    { value: 'price_low', label: 'Price: Low to High' },
                    { value: 'price_high', label: 'Price: High to Low' },
                    { value: 'rating', label: 'Rating' }
                  ]}
                  placeholder="Sort by"
                />
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-24 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                  <FaBox className="text-4xl text-surface-600" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No products found</h3>
                <p className="text-surface-400">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProducts.map((product, index) => {
                  const discount = calculateDiscount(product.mrp, product.price);
                  const qty = quantities[product.id] || 1;
                  const availableStock = product.stock;

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] overflow-hidden transition-all duration-300 flex flex-col"
                    >
                      {/* Image */}
                      <div
                        onClick={() => navigateToProduct(product.id)}
                        className="relative h-48 cursor-pointer overflow-hidden bg-surface-800"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Product'}
                        />
                        {discount > 0 && (
                          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-accent text-white text-xs font-bold">
                            {discount}% OFF
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4 flex-1 flex flex-col">
                        <h2
                          onClick={() => navigateToProduct(product.id)}
                          className="font-semibold text-white mb-2 line-clamp-2 cursor-pointer hover:text-accent transition-colors"
                        >
                          {product.name}
                        </h2>
                        <p className="text-sm text-surface-400 line-clamp-2 mb-3">{product.shortDescription}</p>

                        {/* Price */}
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-xl font-bold text-accent">{formatPriceSimple(product.price)}</span>
                          {discount > 0 && (
                            <span className="text-sm text-surface-500 line-through">{formatPriceSimple(product.mrp)}</span>
                          )}
                        </div>

                        {/* Stock & Actions */}
                        <div className="mt-auto">
                          <div className="mb-3">
                            {availableStock === 0 ? (
                              <span className="text-sm font-semibold text-red-400">Out of stock</span>
                            ) : availableStock < 10 ? (
                              <span className="text-sm font-semibold text-yellow-400">Only {availableStock} left</span>
                            ) : (
                              <span className="text-sm font-semibold text-green-400">In stock</span>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            <input
                              type="number"
                              min={1}
                              max={availableStock > 0 ? availableStock : 1}
                              value={qty}
                              onChange={e => handleQuantityChange(product.id, Number(e.target.value))}
                              className="w-20 text-center px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50 transition-all"
                              disabled={availableStock === 0}
                            />
                            <button
                              onClick={() => handleAddToCart(product.id)}
                              disabled={availableStock === 0}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-accent text-white font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(230,57,70,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <FaShoppingCart size={14} />
                              <span>Add</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Desktop Sidebar */}
          <aside className="w-full lg:w-64 hidden lg:block">
            <div className="sticky top-28 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <h2 className="text-lg font-semibold text-white mb-4">Categories</h2>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setSelectedCategoryId(null)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl font-medium transition-all ${
                      selectedCategoryId === null
                        ? 'bg-accent text-white shadow-[0_0_20px_rgba(230,57,70,0.2)]'
                        : 'text-surface-300 hover:bg-white/[0.05] hover:text-white'
                    }`}
                  >
                    All Categories
                  </button>
                </li>
                {categories.map(category => (
                  <li key={category.id}>
                    <button
                      onClick={() => setSelectedCategoryId(category.id)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl font-medium transition-all ${
                        selectedCategoryId === category.id
                          ? 'bg-accent text-white shadow-[0_0_20px_rgba(230,57,70,0.2)]'
                          : 'text-surface-300 hover:bg-white/[0.05] hover:text-white'
                      }`}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="fixed top-0 left-0 h-full w-64 bg-surface-800 border-r border-white/[0.12] shadow-xl z-10 p-6 flex flex-col">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Categories</h2>
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-white/[0.05] flex items-center justify-center transition-colors"
              >
                <FaTimes className="text-surface-400" />
              </button>
            </div>
            <ul className="space-y-2 flex-1 overflow-y-auto">
              <li>
                <button
                  onClick={() => handleCategoryClick(null)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-medium transition-all ${
                    selectedCategoryId === null
                      ? 'bg-accent text-white'
                      : 'text-surface-300 hover:bg-white/[0.05] hover:text-white'
                  }`}
                >
                  All Categories
                </button>
              </li>
              {categories.map(category => (
                <li key={category.id}>
                  <button
                    onClick={() => handleCategoryClick(category.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl font-medium transition-all ${
                      selectedCategoryId === category.id
                        ? 'bg-accent text-white'
                        : 'text-surface-300 hover:bg-white/[0.05] hover:text-white'
                    }`}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default QuickOrderPage;
