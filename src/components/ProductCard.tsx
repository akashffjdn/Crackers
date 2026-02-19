import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import { Product } from '../data/types';
import { useCart } from '../context/CartContext';
import { formatPriceSimple, calculateDiscount } from '../utils/formatPrice';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
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

  const discount = calculateDiscount(product.mrp, product.price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link to={`/product/${product.id}`} className="group block h-full">
        <div className="relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.1] transition-all duration-500 flex flex-col h-full">
          {/* Image */}
          <div className="relative overflow-hidden aspect-[4/3]">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-surface-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.isBestSeller && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 text-surface-900 uppercase tracking-wider backdrop-blur-sm">
                  Bestseller
                </span>
              )}
              {product.isOnSale && discount > 0 && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-accent text-white uppercase tracking-wider">
                  {discount}% Off
                </span>
              )}
            </div>

            {/* Sound level */}
            <span className={`absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-semibold backdrop-blur-md ${product.soundLevel === 'Low' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/20' :
                product.soundLevel === 'Medium' ? 'bg-gold/20 text-gold border border-gold/20' :
                  'bg-accent/20 text-accent-light border border-accent/20'
              }`}>
              {product.soundLevel}
            </span>
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-1">
            <h3 className="text-sm font-semibold text-white line-clamp-2 flex-1 mb-3 group-hover:text-accent transition-colors duration-300 leading-snug">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar
                    key={i}
                    size={10}
                    className={i < Math.floor(product.rating) ? 'text-gold' : 'text-surface-700'}
                  />
                ))}
              </div>
              <span className="text-[11px] text-surface-500">({product.reviewCount})</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-lg font-bold text-white">{formatPriceSimple(product.price)}</span>
              {discount > 0 && (
                <span className="text-sm text-surface-500 line-through">{formatPriceSimple(product.mrp)}</span>
              )}
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full py-2.5 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${product.stock === 0
                  ? 'bg-surface-800 text-surface-500 cursor-not-allowed'
                  : 'bg-white/[0.04] text-white border border-white/[0.08] hover:bg-accent hover:text-white hover:border-accent'
                }`}
            >
              <FaShoppingCart size={11} />
              <span>{product.stock === 0 ? 'Sold Out' : 'Add to Cart'}</span>
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;