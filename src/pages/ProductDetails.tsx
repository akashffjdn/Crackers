// src/pages/ProductDetails.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaHeart, FaShare, FaShieldAlt, FaTruck, FaPhoneAlt, FaBox, FaTimesCircle } from 'react-icons/fa';
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
  // Destructure error state from CartContext
  const { addToCart, error: cartError } = useCart(); // Destructure error
  const { addToWishlist, isInWishlist } = useWishlist();
  const { getProductById, isLoading: isProductsLoading, error: productsError } = useProducts();
  const { getCategoryById, isLoading: isCategoriesLoading, error: categoriesError } = useCategories();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const navigate = useNavigate();
  const [isAddingToCart, setIsAddingToCart] = useState(false); // Local state for button feedback

  const product = productId ? getProductById(productId) : null;
  const category = product ? getCategoryById(product.categoryId) : null;

  // Handle Loading
  useEffect(() => {
    if (!isProductsLoading && productId && !product) {
      console.error(`Product with ID ${productId} not found after loading.`);
      // Optional: navigate('/not-found');
    }
  }, [isProductsLoading, product, productId, navigate]);

  if (isProductsLoading || isCategoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner text="Loading product details..." />
        </div>
        <Footer />
      </div>
    );
  }

  // Handle Product Not Found after loading
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <FaBox className="text-6xl text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800">Product not found</h1>
            <Link to="/shop" className="text-red-600 hover:underline mt-4 inline-block">Go back to shop</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // *** UPDATED handleAddToCart ***
  const handleAddToCart = async (): Promise<boolean> => {
    if (!product) return false;
    setIsAddingToCart(true);
    // Call context's addToCart only ONCE with the selected quantity
    const success = await addToCart(product, quantity);
    if (!success && cartError === "Please log in to add items.") { // Check exact error message
      alert("Please log in to add items to your cart.");
      // Optionally redirect: navigate('/login');
    } else if (!success) {
      // Handle other potential errors
      alert(`Failed to add item: ${cartError || 'Unknown error'}`);
    } else {
        // Optional: Show success message only if needed (context might handle it)
        // alert(`${quantity} × ${product.name} added to cart!`);
    }
    setIsAddingToCart(false);
    return success; // Return the success status
  };

  // handleBuyNow uses the updated handleAddToCart
  const handleBuyNow = async () => {
    const success = await handleAddToCart(); // Wait for add to finish
    if (success) {
      navigate('/checkout'); // Navigate only if add was successful
    }
  };

  const handleWishlistToggle = async () => {
      const wasInWishlist = isInWishlist(product.id);
      if (wasInWishlist) {
          alert(`${product.name} is already in your wishlist!`);
      } else {
          const success = await addToWishlist(product);
          if (success) {
            alert(`${product.name} added to wishlist!`);
          } // Error handling likely inside useWishlist hook
      }
  };

  const discount = calculateDiscount(product.mrp, product.price);
  const inWishlist = isInWishlist(product.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <nav className="text-sm text-gray-500">
              <Link to="/" className="hover:text-red-600">Home</Link> <span className="mx-2">/</span>
              <Link to="/shop" className="hover:text-red-600">Shop</Link> <span className="mx-2">/</span>
              {/* Ensure category object exists before accessing its properties */}
              <Link to={`/products/${category?.id || 'all'}`} className="hover:text-red-600">
                {category?.name || 'Category'}
              </Link> <span className="mx-2">/</span>
              <span className="text-gray-800">{product.name}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
                <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover"/>
              </div>
              <div className="flex space-x-3 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-red-500' : 'border-gray-200'
                    }`}
                  >
                    <img src={image} alt={`Product view ${index + 1}`} className="w-full h-full object-cover"/>
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={`${ i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300' }`}/>
                    ))}
                    <span className="ml-2 text-gray-600">({product.reviewCount} reviews)</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    product.soundLevel === 'Low' ? 'bg-green-100 text-green-800' :
                    product.soundLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {product.soundLevel} Sound
                  </span>
                </div>
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-3xl font-bold text-red-600">{formatPriceSimple(product.price)}</span>
                  <span className="text-xl text-gray-500 line-through">{formatPriceSimple(product.mrp)}</span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    {discount}% OFF
                  </span>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">{product.shortDescription}</p>
              </div>

              {/* Quantity and Actions */}
              <div className="border-t border-b py-6 space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="font-medium text-gray-700">Quantity:</label>
                  <div className="flex items-center border rounded-lg">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-gray-100">-</button>
                    <span className="px-4 py-2 border-x">{quantity}</span>
                    <button onClick={() => setQuantity(prev => Math.min(prev + 1, product.stock))} disabled={quantity >= product.stock} className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">+</button>
                  </div>
                  <span className={`text-sm ${product.stock > 0 ? 'text-gray-500' : 'text-red-600 font-semibold'}`}>
                    ({product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'})
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart} // Use updated handler
                    disabled={isAddingToCart || product.stock === 0}
                    className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-red-700 hover:to-orange-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     {isAddingToCart ? <LoadingSpinner size="sm" color="text-white"/> : <FaShoppingCart />}
                     <span>{product.stock === 0 ? 'Out of Stock' : (isAddingToCart ? 'Adding...' : 'Add to Cart')}</span>
                  </button>
                   {/* Buy Now Button */}
                  <button
                    onClick={handleBuyNow} // Use updated handler
                    disabled={isAddingToCart || product.stock === 0}
                    className="flex-1 bg-yellow-500 text-red-800 py-3 px-6 rounded-lg font-semibold hover:bg-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     {product.stock === 0 ? 'Out of Stock' : 'Buy Now'}
                  </button>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleWishlistToggle}
                    className={`flex items-center space-x-2 transition-colors ${
                      inWishlist ? 'text-red-600 hover:text-red-700' : 'text-gray-600 hover:text-red-600'
                    }`}
                  >
                    <FaHeart className={inWishlist ? 'fill-current' : ''} />
                    <span>{inWishlist ? 'In Wishlist' : 'Add to Wishlist'}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-red-600">
                    <FaShare />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <FaShieldAlt className="text-2xl text-green-600 mx-auto" />
                  <div className="text-sm font-medium">Safe & Certified</div>
                </div>
                <div className="space-y-2">
                  <FaTruck className="text-2xl text-blue-600 mx-auto" />
                  <div className="text-sm font-medium">Free Delivery</div>
                </div>
                <div className="space-y-2">
                  <FaPhoneAlt className="text-2xl text-red-600 mx-auto" />
                  <div className="text-sm font-medium">24/7 Support</div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16">
            <div className="border-b">
              <nav className="flex space-x-8">
                {['description', 'features', 'specifications'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                      activeTab === tab ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>
            <div className="py-8">
              {activeTab === 'description' && (
                <div className="prose max-w-none prose-p:text-gray-700 prose-li:text-gray-700">
                  <p className="text-lg">{product.description}</p>
                </div>
              )}
              {activeTab === 'features' && (
                product.features?.length > 0 ? (
                  <ul className="list-disc list-inside space-y-2 text-gray-700 pl-4">
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">No specific features listed.</p>
                )
              )}
              {activeTab === 'specifications' && (
                product.specifications && Object.keys(product.specifications).length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-start py-2 border-b border-gray-200">
                        <span className="font-medium text-gray-800 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-gray-600 text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No specifications available.</p>
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