import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaLock, FaArrowRight } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { formatPriceSimple, calculateDiscount } from '../utils/formatPrice';

const CartPage: React.FC = () => {
  const { items, total, itemCount, updateQuantity, removeFromCart } = useCart();

  const subtotal = items.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0);
  const savings = items.reduce((sum: number, item: any) => sum + ((item.product.mrp - item.product.price) * item.quantity), 0);
  const shipping = subtotal > 2000 ? 0 : 99;
  const finalTotal = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-surface-900">
        <Header />
        <div className="flex items-center justify-center min-h-[70vh] pt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center px-6"
          >
            <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
              <FaShoppingBag className="text-surface-500" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Your cart is empty</h2>
            <p className="text-surface-400 text-[15px] mb-10">Add some crackers to light up your festival!</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-accent text-white text-[15px] font-semibold hover:shadow-[0_0_30px_rgba(230,57,70,0.25)] transition-all duration-300"
            >
              Continue Shopping <FaArrowRight size={12} />
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-900">
      <Header />
      <main className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-10"
          >
            <div className="flex items-center gap-2 text-xs text-surface-500 mb-5">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-surface-300">Cart</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-[-0.02em]">
              Shopping Cart
              <span className="text-surface-500 text-lg font-normal ml-3">({itemCount} items)</span>
            </h1>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item: any, index: number) => {
                const discount = calculateDiscount(item.product.mrp, item.product.price);

                return (
                  <motion.div
                    key={item.product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.06 }}
                    className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-all duration-300"
                  >
                    <div className="flex gap-5">
                      {/* Image */}
                      <Link to={`/product/${item.product.id}`} className="flex-shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-24 h-24 object-cover rounded-xl hover:opacity-80 transition-opacity"
                        />
                      </Link>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item.product.id}`}
                          className="text-sm font-semibold text-white hover:text-accent transition-colors line-clamp-2 block mb-2"
                        >
                          {item.product.name}
                        </Link>

                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-base font-bold text-white">{formatPriceSimple(item.product.price)}</span>
                          <span className="text-xs text-surface-500 line-through">{formatPriceSimple(item.product.mrp)}</span>
                          {discount > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {discount}% OFF
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity + Remove */}
                      <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center rounded-xl border border-white/[0.08] overflow-hidden bg-white/[0.02]">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-2.5 text-surface-400 hover:text-white hover:bg-white/[0.06] transition-all"
                          >
                            <FaMinus size={10} />
                          </button>
                          <span className="px-4 py-2 text-sm font-medium text-white border-x border-white/[0.08] min-w-[44px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-2.5 text-surface-400 hover:text-white hover:bg-white/[0.06] transition-all"
                          >
                            <FaPlus size={10} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-xs text-surface-500 hover:text-accent transition-colors flex items-center gap-1.5"
                        >
                          <FaTrash size={10} /> Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-28 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <h3 className="text-base font-semibold text-white mb-6">Order Summary</h3>

                <div className="space-y-3.5 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-400">Subtotal ({itemCount} items)</span>
                    <span className="text-white font-medium">{formatPriceSimple(subtotal)}</span>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-400">You Save</span>
                      <span className="text-emerald-400 font-medium">-{formatPriceSimple(savings)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-400">Shipping</span>
                    <span className={shipping === 0 ? "text-emerald-400 font-medium" : "text-white font-medium"}>
                      {shipping === 0 ? "FREE" : formatPriceSimple(shipping)}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-[11px] text-surface-500">
                      Add {formatPriceSimple(2000 - subtotal)} more for free delivery
                    </p>
                  )}

                  <div className="h-px bg-white/[0.06]" />

                  <div className="flex justify-between pt-1">
                    <span className="text-base font-semibold text-white">Total</span>
                    <span className="text-lg font-bold text-white">{formatPriceSimple(finalTotal)}</span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="w-full py-3.5 rounded-xl bg-accent text-white text-[15px] font-semibold hover:shadow-[0_0_30px_rgba(230,57,70,0.25)] transition-all duration-300 flex items-center justify-center gap-2 mb-4"
                >
                  <FaLock size={12} /> Proceed to Checkout
                </Link>

                <div className="text-center">
                  <Link to="/shop" className="text-xs text-surface-400 hover:text-accent transition-colors font-medium">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
