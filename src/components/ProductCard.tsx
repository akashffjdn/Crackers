import React from 'react';
// Import useNavigate if you want to redirect to login
import { Link, useNavigate } from 'react-router-dom';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import { Product } from '../data/types';
import { useCart } from '../context/CartContext'; // Ensure this path is correct
import { formatPriceSimple, calculateDiscount } from '../utils/formatPrice'; // Ensure this path is correct

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Get error state along with addToCart
  const { addToCart, error: cartError } = useCart(); // Destructure error
  // const navigate = useNavigate(); // Uncomment if you want to redirect

  // Make the handler async to await the result
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const success = await addToCart(product); // await the async call

    // Check if adding failed and if the error is the login prompt
    if (!success && cartError === "Please log in to add items.") { // Check exact error message from CartContext
      // Show a popup or alert
      alert("Please log in to add items to your cart.");
      // Optionally redirect to login page:
      // navigate('/login');
    } else if (!success) {
      // Handle other potential errors during add to cart
      alert(`Failed to add item: ${cartError || 'Unknown error'}`);
    }
    // No need for an else block if success is true, addToCart might handle visual feedback implicitly
  };

  const discount = calculateDiscount(product.mrp, product.price);

  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="bg-white rounded-xl shadow hover:shadow-xl transition-all duration-300 p-4 flex flex-col h-full transform hover:-translate-y-1">
        <div className="relative mb-4">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-48 w-full object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
          />
          {product.isBestSeller && (
            <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
              Bestseller
            </span>
          )}
          {product.isOnSale && (
            <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
              {discount}% OFF
            </span>
          )}
          <span className={`absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-medium ${
            product.soundLevel === 'Low' ? 'bg-green-100 text-green-800' :
            product.soundLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {product.soundLevel} Sound
          </span>
        </div>

        <h3 className="font-semibold text-lg line-clamp-2 flex-1 mb-2">{product.name}</h3>

        <div className="flex items-center mb-2 text-yellow-400 text-sm">
          {Array.from({ length: 5 }).map((_, i) => (
            <FaStar key={i} className={i < Math.floor(product.rating) ? '' : 'opacity-20'} />
          ))}
          <span className="ml-2 text-gray-500">({product.reviewCount})</span>
        </div>

        <div className="mb-3">
          <span className="text-red-600 font-bold text-xl">{formatPriceSimple(product.price)}</span>
          <span className="line-through text-gray-400 ml-2 text-sm">{formatPriceSimple(product.mrp)}</span>
        </div>

        <button
          onClick={handleAddToCart} // Use the updated handler
          disabled={product.stock === 0}
          className="mt-auto bg-gradient-to-r from-red-600 to-orange-500 text-white py-2 px-4 rounded-lg font-semibold hover:from-red-700 hover:to-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
        >
          <FaShoppingCart />
          <span>{product.stock === 0 ? 'Sold Out' : 'Add to Cart'}</span>
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;