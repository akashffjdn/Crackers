import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaStar, FaShoppingCart, FaHeart, FaShare, FaShieldAlt,
  FaTruck, FaPhoneAlt, FaCheck, FaArrowLeft, FaRegHeart,
  FaClock, FaFire
} from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useProducts } from '../context/ProductContext';
import { useCategories } from '../context/CategoryContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPriceSimple, calculateDiscount } from '../utils/formatPrice';
import LoadingSpinner from '../components/LoadingSpinner';

const ProductDetails: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { addToCart, error: cartError } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { getProductById, isLoading: isProductsLoading } = useProducts();
  const { getCategoryById, isLoading: isCategoriesLoading } = useCategories();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const navigate = useNavigate();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const product = productId ? getProductById(productId) : null;
  const category = product ? getCategoryById(product.categoryId) : null;

  // Auto-slide product images every 3 seconds
  useEffect(() => {
    if (product && product.images.length > 1) {
      const interval = setInterval(() => {
        setSelectedImage(prev => (prev + 1) % product.images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [product]);

  useEffect(() => {
    if (!isProductsLoading && productId && !product) {
      console.error(`Product with ID ${productId} not found.`);
    }
  }, [isProductsLoading, product, productId, navigate]);

  if (isProductsLoading || isCategoriesLoading) {
    return (
      <div className="min-h-screen bg-surface-900">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh] pt-16">
          <LoadingSpinner text="Loading product..." fullScreen />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-surface-900">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh] pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
              <span className="text-4xl">📦</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Product not found</h1>
            <Link to="/shop" className="text-accent hover:text-accent/80 transition-colors">
              Go back to shop
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = async (): Promise<boolean> => {
    if (!product) return false;
    setIsAddingToCart(true);
    const success = await addToCart(product, quantity);
    if (!success && cartError === "Please log in to add items.") {
      alert("Please log in to add items to your cart.");
    } else if (!success) {
      alert(`Failed to add item: ${cartError || 'Unknown error'}`);
    }
    setIsAddingToCart(false);
    return success;
  };

  const handleBuyNow = async () => {
    const success = await handleAddToCart();
    if (success) navigate('/checkout');
  };

  const handleWishlistToggle = async () => {
    const wasInWishlist = isInWishlist(product.id);
    if (wasInWishlist) {
      alert(`${product.name} is already in your wishlist!`);
    } else {
      const success = await addToWishlist(product);
      if (success) alert(`${product.name} added to wishlist!`);
    }
  };

  const discount = calculateDiscount(product.mrp, product.price);
  const inWishlist = isInWishlist(product.id);

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
              <span className="text-surface-600">/</span>
              <Link
                to={`/products/${category?.id || 'all'}`}
                className="text-surface-400 hover:text-white transition-colors"
              >
                {category?.name || 'Category'}
              </Link>
              <span className="text-surface-600">/</span>
              <span className="text-white">{product.name}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left - Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {/* Main Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-800 border border-surface-700">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {discount > 0 && (
                  <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                    {discount}% OFF
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto no-scrollbar">
                  {product.images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-accent shadow-[0_0_20px_rgba(230,57,70,0.3)]'
                          : 'border-surface-700 hover:border-surface-600'
                      }`}
                    >
                      <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Right - Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Title */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{product.name}</h1>

                {/* Rating & Sound Level */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          size={16}
                          className={i < Math.floor(product.rating) ? 'text-gold' : 'text-surface-700'}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-surface-400">({product.reviewCount} reviews)</span>
                  </div>

                  <div
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                      product.soundLevel === 'Low'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : product.soundLevel === 'Medium'
                        ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                        : 'bg-accent/10 border-accent/30 text-accent'
                    }`}
                  >
                    <FaFire className="inline mr-1" />
                    {product.soundLevel} Sound
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="bg-surface-800/50 border border-surface-700 rounded-xl p-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-white">{formatPriceSimple(product.price)}</span>
                  {product.mrp > product.price && (
                    <span className="text-xl text-surface-500 line-through">{formatPriceSimple(product.mrp)}</span>
                  )}
                </div>
                <p className="text-surface-400 text-sm">{product.shortDescription}</p>
              </div>

              {/* Quantity & Stock */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-white">Quantity</span>
                    <div className="flex items-center rounded-lg border border-surface-700 bg-surface-800">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 text-white hover:bg-surface-700 transition-colors rounded-l-lg"
                      >
                        −
                      </button>
                      <span className="px-6 py-2 text-white font-semibold border-x border-surface-700 min-w-[60px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(prev => Math.min(prev + 1, product.stock))}
                        disabled={quantity >= product.stock}
                        className="px-4 py-2 text-white hover:bg-surface-700 transition-colors rounded-r-lg disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      product.stock > 10 ? 'text-emerald-400' : product.stock > 0 ? 'text-yellow-400' : 'text-accent'
                    }`}
                  >
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || product.stock === 0}
                    className="flex-1 py-4 rounded-xl bg-surface-800 border-2 border-surface-700 text-white font-semibold hover:border-accent hover:bg-surface-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAddingToCart ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <FaShoppingCart size={18} />
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={isAddingToCart || product.stock === 0}
                    className="flex-1 py-4 rounded-xl bg-accent text-white font-semibold hover:bg-accent/90 hover:shadow-[0_0_30px_rgba(230,57,70,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Buy Now'}
                  </button>
                </div>

                {/* Wishlist & Share */}
                <div className="flex gap-4 pt-2">
                  <button
                    onClick={handleWishlistToggle}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                      inWishlist ? 'text-accent' : 'text-surface-400 hover:text-accent'
                    }`}
                  >
                    {inWishlist ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
                    {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                  </button>
                  <button className="flex items-center gap-2 text-sm font-medium text-surface-400 hover:text-white transition-colors">
                    <FaShare size={14} />
                    Share
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-surface-700">
                {[
                  { icon: FaShieldAlt, label: 'Safe & Certified', color: 'text-emerald-500' },
                  { icon: FaTruck, label: 'Free Delivery', color: 'text-blue-400' },
                  { icon: FaPhoneAlt, label: '24/7 Support', color: 'text-accent' },
                ].map((badge, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-surface-800/50 border border-surface-700"
                  >
                    <badge.icon className={`text-2xl ${badge.color}`} />
                    <span className="text-xs text-surface-400 font-medium text-center">{badge.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Tabs Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16"
          >
            <div className="border-b border-surface-700">
              <nav className="flex gap-8">
                {['description', 'features', 'specifications'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 text-sm font-semibold capitalize transition-all border-b-2 ${
                      activeTab === tab
                        ? 'border-accent text-accent'
                        : 'border-transparent text-surface-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            <div className="py-8">
              {activeTab === 'description' && (
                <div className="prose prose-invert max-w-none">
                  <p className="text-surface-300 leading-relaxed text-base">{product.description}</p>
                </div>
              )}

              {activeTab === 'features' && (
                <div className="space-y-3">
                  {product.features && product.features.length > 0 ? (
                    product.features.map((feature: string, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3 p-4 rounded-lg bg-surface-800/50 border border-surface-700"
                      >
                        <FaCheck className="text-accent mt-1 flex-shrink-0" size={14} />
                        <span className="text-surface-300">{feature}</span>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-surface-500 text-center py-8">No specific features listed.</p>
                  )}
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="bg-surface-800/50 border border-surface-700 rounded-xl overflow-hidden">
                  {product.specifications && Object.keys(product.specifications).length > 0 ? (
                    <div className="divide-y divide-surface-700">
                      {Object.entries(product.specifications).map(([key, value], i) => (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="grid grid-cols-2 gap-4 p-4 hover:bg-surface-800 transition-colors"
                        >
                          <span className="text-sm font-semibold text-white capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className="text-sm text-surface-400">{value as string}</span>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-surface-500 text-center py-8">No specifications available.</p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetails;
