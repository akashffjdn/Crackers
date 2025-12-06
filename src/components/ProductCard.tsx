import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaHeart, FaFire, FaCheckCircle } from 'react-icons/fa';
import { Product } from '../data/types';
import { useCart } from '../context/CartContext';
import { formatPriceSimple, calculateDiscount } from '../utils/formatPrice';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart, error: cartError } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const success = await addToCart(product);

    if (!success && cartError === "Please log in to add items.") {
      alert("Please log in to add items to your cart.");
    } else if (!success) {
      alert(`Failed to add item: ${cartError || 'Unknown error'}`);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const discount = calculateDiscount(product.mrp, product.price);

  return (
    <Link 
      to={`/product/${product.id}`} 
      className="group block h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 p-5 flex flex-col h-full transform hover:-translate-y-2 border border-gray-100 relative overflow-hidden">
        {/* Background Gradient on Hover */}
        <div className={`absolute inset-0 bg-gradient-to-br from-red-50/50 to-orange-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
        
        <div className="relative z-10">
          {/* Image Container */}
          <div className="relative mb-4 rounded-2xl overflow-hidden bg-gray-100">
            <div className="aspect-square relative">
              <img
                src={product.images[0]}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  isHovered ? 'scale-110' : 'scale-100'
                }`}
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.isBestSeller && (
                <span className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1 animate-pulse-slow">
                  <FaFire className="text-xs" />
                  <span>Bestseller</span>
                </span>
              )}
              {product.isOnSale && (
                <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Sound Level Badge */}
            <span className={`absolute bottom-3 left-3 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border ${
              product.soundLevel === 'Low' ? 'bg-green-500/90 text-white border-green-400' :
              product.soundLevel === 'Medium' ? 'bg-yellow-500/90 text-white border-yellow-400' :
              'bg-red-500/90 text-white border-red-400'
            } shadow-lg`}>
              {product.soundLevel} Sound
            </span>

            {/* Wishlist Button */}
            <button
              onClick={handleWishlist}
              className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 transform hover:scale-110 ${
                isWishlisted
                  ? 'bg-red-500 text-white border-red-400 shadow-lg'
                  : 'bg-white/90 text-gray-700 hover:bg-red-50 hover:text-red-600 border-white/50'
              }`}
            >
              <FaHeart className={`text-sm ${isWishlisted ? 'fill-current' : ''}`} />
            </button>

            {/* Stock Badge */}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                <span className="bg-red-600 text-white px-6 py-3 rounded-full font-bold text-lg shadow-xl">
                  Sold Out
                </span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 flex flex-col">
            <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center mb-3">
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar 
                    key={i} 
                    className={`text-sm ${
                      i < Math.floor(product.rating) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`} 
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600 font-medium">
                ({product.reviewCount})
              </span>
            </div>

            {/* Price */}
            <div className="mb-4">
              <div className="flex items-baseline space-x-2">
                <span className="text-red-600 font-bold text-2xl">
                  {formatPriceSimple(product.price)}
                </span>
                <span className="line-through text-gray-400 text-sm">
                  {formatPriceSimple(product.mrp)}
                </span>
              </div>
              {discount > 0 && (
                <span className="inline-block mt-1 text-xs text-green-600 font-semibold">
                  Save {discount}%
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`mt-auto w-full py-3.5 px-4 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 ${
                product.stock === 0
                  ? 'bg-gray-300 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {product.stock === 0 ? (
                <>
                  <span>Sold Out</span>
                </>
              ) : (
                <>
                  <FaShoppingCart />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Hover Effect Border */}
        <div className={`absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-red-200 transition-all duration-500 pointer-events-none`}></div>
      </div>
    </Link>
  );
};

export default ProductCard;