import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaHeart, FaShare, FaShieldAlt, FaTruck, FaPhoneAlt } from 'react-icons/fa';
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
          <LoadingSpinner text="Loading product..." />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-surface-900">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh] pt-16">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/[0.04] flex items-center justify-center">
              <span className="text-3xl">📦</span>
            </div>
            <h1 className="text-xl font-semibold text-white mb-2">Product not found</h1>
            <Link to="/shop" className="text-accent hover:text-accent-light transition-colors">Go back to shop</Link>
          </div>
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
      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="border-b border-white/[0.04]">
          <div className="section-container px-6 py-3">
            <nav className="text-xs text-surface-500 flex items-center gap-2">
              <Link to="/" className="hover:text-accent transition-colors">Home</Link>
              <span>/</span>
              <Link to="/shop" className="hover:text-accent transition-colors">Shop</Link>
              <span>/</span>
              <Link to={`/products/${category?.id || 'all'}`} className="hover:text-accent transition-colors">
                {category?.name || 'Category'}
              </Link>
              <span>/</span>
              <span className="text-surface-300">{product.name}</span>
            </nav>
          </div>
        </div>

        <div className="section-container px-6 py-10">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-2xl overflow-hidden card">
                <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex gap-3 overflow-x-auto no-scrollbar">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 ${selectedImage === index ? 'border-accent' : 'border-white/[0.08] hover:border-white/[0.15]'
                      }`}
                  >
                    <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white mb-4">{product.name}</h1>

                {/* Rating + Sound */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} size={12} className={i < Math.floor(product.rating) ? 'text-gold' : 'text-surface-700'} />
                    ))}
                    <span className="text-xs text-surface-500 ml-1.5">({product.reviewCount})</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-2xs font-medium ${product.soundLevel === 'Low' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      product.soundLevel === 'Medium' ? 'bg-gold/10 text-gold border border-gold/20' :
                        'bg-accent/10 text-accent border border-accent/20'
                    }`}>
                    {product.soundLevel} Sound
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-4 mb-5">
                  <span className="text-3xl font-bold text-white">{formatPriceSimple(product.price)}</span>
                  <span className="text-lg text-surface-500 line-through">{formatPriceSimple(product.mrp)}</span>
                  {discount > 0 && (
                    <span className="badge-accent text-xs">{discount}% OFF</span>
                  )}
                </div>

                <p className="body-md leading-relaxed">{product.shortDescription}</p>
              </div>

              {/* Quantity + Actions */}
              <div className="border-t border-b border-white/[0.06] py-6 space-y-5">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Qty</span>
                  <div className="flex items-center rounded-xl border border-white/[0.08] overflow-hidden">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-surface-400 hover:text-white hover:bg-white/[0.06] transition-all">−</button>
                    <span className="px-4 py-2 text-sm font-medium text-white border-x border-white/[0.08] min-w-[44px] text-center">{quantity}</span>
                    <button onClick={() => setQuantity(prev => Math.min(prev + 1, product.stock))} disabled={quantity >= product.stock} className="px-3 py-2 text-surface-400 hover:text-white hover:bg-white/[0.06] transition-all disabled:opacity-30">+</button>
                  </div>
                  <span className={`text-xs ${product.stock > 0 ? 'text-surface-500' : 'text-accent font-semibold'}`}>
                    ({product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'})
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || product.stock === 0}
                    className="flex-1 btn-primary py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAddingToCart ? <LoadingSpinner size="sm" /> : <><FaShoppingCart size={14} /> {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</>}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={isAddingToCart || product.stock === 0}
                    className="flex-1 btn-secondary py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Buy Now'}
                  </button>
                </div>

                <div className="flex gap-5">
                  <button
                    onClick={handleWishlistToggle}
                    className={`flex items-center gap-2 text-sm transition-colors ${inWishlist ? 'text-accent' : 'text-surface-500 hover:text-accent'
                      }`}
                  >
                    <FaHeart size={14} /> {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                  </button>
                  <button className="flex items-center gap-2 text-sm text-surface-500 hover:text-white transition-colors">
                    <FaShare size={14} /> Share
                  </button>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { icon: FaShieldAlt, label: 'Safe & Certified', color: 'text-emerald-500' },
                  { icon: FaTruck, label: 'Free Delivery', color: 'text-blue-400' },
                  { icon: FaPhoneAlt, label: '24/7 Support', color: 'text-accent' },
                ].map((trust, i) => (
                  <div key={i} className="space-y-2">
                    <trust.icon className={`text-lg mx-auto ${trust.color}`} />
                    <div className="text-2xs text-surface-400 font-medium">{trust.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-16">
            <div className="border-b border-white/[0.06]">
              <nav className="flex gap-8">
                {['description', 'features', 'specifications'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 text-sm font-medium capitalize transition-all duration-300 border-b-2 ${activeTab === tab ? 'border-accent text-accent' : 'border-transparent text-surface-500 hover:text-surface-300'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>
            <div className="py-8">
              {activeTab === 'description' && (
                <p className="body-md leading-relaxed">{product.description}</p>
              )}
              {activeTab === 'features' && (
                product.features?.length > 0 ? (
                  <ul className="space-y-2">
                    {product.features.map((feature: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-surface-400">
                        <span className="text-accent mt-1">•</span> {feature}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="body-sm">No specific features listed.</p>
                )
              )}
              {activeTab === 'specifications' && (
                product.specifications && Object.keys(product.specifications).length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-x-8 gap-y-0">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-3 border-b border-white/[0.04]">
                        <span className="text-sm font-medium text-surface-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-sm text-surface-500">{value as string}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="body-sm">No specifications available.</p>
                )
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetails;