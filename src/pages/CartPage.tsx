import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaLock } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { formatPriceSimple, calculateDiscount } from '../utils/formatPrice';

const CartPage: React.FC = () => {
  const { items, total, itemCount, updateQuantity, removeFromCart } = useCart();

  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const savings = items.reduce((sum, item) => sum + ((item.product.mrp - item.product.price) * item.quantity), 0);
  const shipping = subtotal > 2000 ? 0 : 99;
  const finalTotal = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <FaShoppingBag className="text-6xl text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some crackers to light up your festival!</p>
            <Link
              to="/shop"
              className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-orange-700 transition-all inline-block"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart ({itemCount} items)</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const discount = calculateDiscount(item.product.mrp, item.product.price);
                
                return (
                  <div key={item.product.id} className="bg-white rounded-lg p-6 shadow-sm border">
                    <div className="flex flex-col md:flex-row gap-4">
                      <Link to={`/product/${item.product.id}`} className="flex-shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full md:w-24 h-24 object-cover rounded-lg hover:opacity-80 transition-opacity"
                        />
                      </Link>
                      
                      <div className="flex-1">
                        <Link
                          to={`/product/${item.product.id}`}
                          className="text-lg font-semibold text-gray-800 hover:text-red-600 line-clamp-2 block mb-1"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-gray-500 mb-2">{item.product.categoryId.replace('-', ' ')}</p>
                        
                        <div className="flex items-center space-x-4">
                          <span className="text-lg font-bold text-red-600">{formatPriceSimple(item.product.price)}</span>
                          <span className="text-sm text-gray-500 line-through">{formatPriceSimple(item.product.mrp)}</span>
                          {discount > 0 && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                              {discount}% OFF
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col space-y-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center border rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-100 transition-colors"
                          >
                            <FaMinus className="text-sm" />
                          </button>
                          <span className="px-4 py-2 border-x min-w-[50px] text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100 transition-colors"
                          >
                            <FaPlus className="text-sm" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="flex items-center justify-center space-x-2 text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          <FaTrash />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 shadow-sm border sticky top-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                    <span className="font-semibold">{formatPriceSimple(subtotal)}</span>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>You Save</span>
                      <span className="font-semibold">-{formatPriceSimple(savings)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className={shipping === 0 ? "text-green-600 font-semibold" : "font-semibold"}>
                      {shipping === 0 ? "FREE" : formatPriceSimple(shipping)}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-sm text-gray-500">
                      Add {formatPriceSimple(2000 - subtotal)} more for free delivery
                    </p>
                  )}
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-red-600">{formatPriceSimple(finalTotal)}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-red-700 hover:to-orange-700 transition-all flex items-center justify-center space-x-2 mb-4"
                >
                  <FaLock />
                  <span>Proceed to Checkout</span>
                </Link>

                <div className="text-center">
                  <Link to="/shop" className="text-red-600 hover:text-red-700 font-medium">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
