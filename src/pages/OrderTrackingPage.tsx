import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaCheck,
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaCalendar,
  FaArrowLeft, FaShippingFast, FaBoxOpen
} from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Order, CartItem } from '../data/types';
import { formatPriceSimple } from '../utils/formatPrice';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { IconType } from 'react-icons';

// --- Interfaces for API Response ---
interface OrderItemProductFromAPI {
    _id: string;
    name: string;
    price: number;
    images: string[];
}
interface OrderItemFromAPI {
    product: OrderItemProductFromAPI | string;
    quantity: number;
    _id?: string;
    priceAtOrder?: number;
    nameAtOrder?: string;
    imageAtOrder?: string;
}
interface OrderFromAPI extends Omit<Order, 'id' | 'items' | 'userId'> {
    _id: string;
    userId: string | { _id: string; firstName?: string; lastName?: string; email?: string };
    items: OrderItemFromAPI[];
}

interface TrackingStep {
  key: Order['status'] | 'confirmed';
  label: string;
  icon: IconType;
  description: string;
}

const OrderTrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapOrderBEtoFE = (orderData: OrderFromAPI): Order => {
     const mappedItems: CartItem[] = (orderData.items || []).map(item => {
         const productDetails = (typeof item.product === 'object' && item.product !== null) ? item.product : null;
         const productName = item.nameAtOrder || productDetails?.name || 'Unknown Product';
         const productPrice = item.priceAtOrder || productDetails?.price || 0;
         const productImage = item.imageAtOrder || (productDetails?.images ? productDetails.images[0] : '/placeholder.png');
         const productId = (productDetails?._id || (typeof item.product === 'string' ? item.product : 'unknown'));

         return {
             quantity: item.quantity,
             product: {
                 id: productId, name: productName, price: productPrice, images: [productImage],
                 categoryId: '', description: '', shortDescription: '', mrp: productPrice,
                 rating: 0, reviewCount: 0, soundLevel: 'Low', burnTime: '', stock: 1,
                 features: [], specifications: {}, tags: []
             }
         };
     });
     const userIdString = typeof orderData.userId === 'string' ? orderData.userId : orderData.userId._id;
     const userDetails = typeof orderData.userId === 'object' ? orderData.userId : null;

     return {
         ...orderData,
         id: orderData._id,
         items: mappedItems,
         userId: userIdString,
         shippingAddress: {
             ...orderData.shippingAddress,
             firstName: orderData.shippingAddress.firstName || userDetails?.firstName || '',
             lastName: orderData.shippingAddress.lastName || userDetails?.lastName || '',
             email: orderData.shippingAddress.email || userDetails?.email || '',
         },
         status: orderData.status as Order['status'],
         paymentMethod: orderData.paymentMethod as Order['paymentMethod'],
         paymentStatus: orderData.paymentStatus as Order['paymentStatus'],
     };
 };

  const fetchOrder = useCallback(async () => {
    if (!orderId) {
      setError("No Order ID provided.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/orders/${orderId}`);
      if (response.data) {
          setOrder(mapOrderBEtoFE(response.data as OrderFromAPI));
      } else {
           throw new Error("Order data not found in response.");
      }
    } catch (err: any) {
      const errorMsg = err.response?.status === 404
        ? "Order not found."
        : (err.response?.data?.message || err.message || 'Failed to load order details.');
      setError(errorMsg);
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const getStatusColor = (status: Order['status']): string => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
      case 'confirmed': return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      case 'processing': return 'bg-purple-500/10 border-purple-500/30 text-purple-400';
      case 'shipped': return 'bg-orange-500/10 border-orange-500/30 text-orange-400';
      case 'delivered': return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      case 'cancelled': return 'bg-accent/10 border-accent/30 text-accent';
      default: return 'bg-surface-700/50 border-surface-600 text-surface-400';
    }
  };

  const trackingSteps: TrackingStep[] = [
    { key: 'confirmed', label: 'Confirmed', icon: FaCheck, description: 'Order confirmed' },
    { key: 'processing', label: 'Processing', icon: FaBoxOpen, description: 'Preparing items' },
    { key: 'shipped', label: 'Shipped', icon: FaTruck, description: 'On the way' },
    { key: 'delivered', label: 'Delivered', icon: FaCheckCircle, description: 'Completed' }
  ];

  const getStepStatus = (stepKey: string, currentStatus: Order['status']): 'completed' | 'current' | 'pending' => {
    if (currentStatus === 'cancelled') return 'pending';
    const statusOrder: (Order['status'] | 'confirmed')[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepKey as Order['status'] | 'confirmed');

    if (stepIndex === -1 || currentIndex === -1) return 'pending';
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-900 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner text="Loading order details..." fullScreen />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-surface-900 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center text-center px-4 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
              <FaTimesCircle className="text-4xl text-accent" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {error || "Order Not Found"}
            </h2>
            <p className="text-surface-400 mb-8 max-w-md">
              {error ? "Could not load order details." : "The order you're looking for doesn't exist or you may not have permission to view it."}
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-white font-semibold hover:shadow-[0_0_30px_rgba(230,57,70,0.4)] transition-all duration-300 hover:scale-105"
            >
              <FaArrowLeft size={14} />
              Back to My Orders
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
      <main className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Back Button */}
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-surface-400 hover:text-white transition-colors mb-6"
          >
            <FaArrowLeft size={12} />
            Back to orders
          </Link>

          {/* Order Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-surface-800/50 border border-surface-700 rounded-2xl p-6 md:p-8 mb-6"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Order #{order.id.substring(0, 12)}...
                </h1>
                <div className="flex items-center gap-2 text-surface-400 text-sm">
                  <FaCalendar size={14} />
                  <span>
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold capitalize border ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
          </motion.div>

          {/* Tracking Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-surface-800/50 border border-surface-700 rounded-2xl p-6 md:p-8 mb-6"
          >
            <h2 className="text-xl font-bold text-white mb-8">Order Progress</h2>

            {/* Desktop Timeline */}
            <div className="hidden md:block">
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-12 left-0 right-0 h-1 bg-surface-700">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{
                      width: order.status === 'delivered' ? '100%' :
                             order.status === 'shipped' ? '66%' :
                             order.status === 'processing' ? '33%' :
                             order.status === 'confirmed' || order.status === 'pending' ? '0%' : '0%'
                    }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-accent to-emerald-500"
                  />
                </div>

                <div className="relative z-10 grid grid-cols-4 gap-4">
                  {trackingSteps.map((step, index) => {
                    const status = getStepStatus(step.key, order.status);
                    const IconComponent = step.icon;
                    return (
                      <motion.div
                        key={step.key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                        className="flex flex-col items-center"
                      >
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                          status === 'completed' ? 'bg-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.3)]' :
                          status === 'current' ? 'bg-accent text-white shadow-[0_0_30px_rgba(230,57,70,0.3)] animate-pulse' :
                          'bg-surface-700 text-surface-500'
                        }`}>
                          <IconComponent className="text-3xl" />
                        </div>
                        <p className={`text-sm font-semibold mb-1 ${
                          status === 'completed' || status === 'current' ? 'text-white' : 'text-surface-500'
                        }`}>
                          {step.label}
                        </p>
                        <p className="text-xs text-surface-500">{step.description}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile Timeline */}
            <div className="md:hidden space-y-4">
              {trackingSteps.map((step, index) => {
                const status = getStepStatus(step.key, order.status);
                const IconComponent = step.icon;
                return (
                  <div key={step.key} className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      status === 'completed' ? 'bg-emerald-500 text-white' :
                      status === 'current' ? 'bg-accent text-white animate-pulse' :
                      'bg-surface-700 text-surface-500'
                    }`}>
                      <IconComponent className="text-xl" />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${
                        status === 'completed' || status === 'current' ? 'text-white' : 'text-surface-500'
                      }`}>
                        {step.label}
                      </p>
                      <p className="text-xs text-surface-500">{step.description}</p>
                    </div>
                    {status === 'completed' && <FaCheck className="text-emerald-500" />}
                  </div>
                );
              })}
            </div>

            {/* Tracking Info */}
            {order.status !== 'cancelled' && (order.trackingNumber || order.estimatedDelivery) && (
              <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <div className="space-y-2 text-sm">
                  {order.trackingNumber && (
                    <div className="flex items-center justify-between">
                      <span className="text-surface-400">Tracking Number:</span>
                      <span className="font-mono text-blue-400">{order.trackingNumber}</span>
                    </div>
                  )}
                  {order.estimatedDelivery && (
                    <div className="flex items-center justify-between">
                      <span className="text-surface-400">Estimated Delivery:</span>
                      <span className="text-white">
                        {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Cancelled Message */}
            {order.status === 'cancelled' && (
              <div className="mt-8 p-4 bg-accent/10 border border-accent/30 rounded-xl">
                <p className="text-accent font-semibold flex items-center gap-2">
                  <FaTimesCircle />
                  This order has been cancelled
                </p>
              </div>
            )}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2 bg-surface-800/50 border border-surface-700 rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6">
                Order Items ({order.items.length})
              </h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <motion.div
                    key={item.product.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-surface-800 border border-surface-700 rounded-xl hover:border-surface-600 transition-all"
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => {(e.target as HTMLImageElement).src = '/placeholder.png';}}
                      />
                      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white line-clamp-2 mb-1">{item.product.name}</h3>
                      <p className="text-sm text-surface-500">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-white text-lg">
                        {formatPriceSimple(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t border-surface-700 pt-4 mt-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-white">Total Paid</span>
                  <span className="text-2xl font-bold text-accent">{formatPriceSimple(order.total)}</span>
                </div>
              </div>
            </motion.div>

            {/* Shipping Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-1 bg-surface-800/50 border border-surface-700 rounded-2xl p-6 h-fit"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                  <FaMapMarkerAlt className="text-accent" size={18} />
                </div>
                <h2 className="text-xl font-bold text-white">Shipping Address</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-surface-400 mb-1">Name</p>
                  <p className="font-medium text-white">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-surface-400 mb-1">Address</p>
                  <p className="text-white leading-relaxed">
                    {order.shippingAddress.street}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-surface-400 mb-1 flex items-center gap-2">
                    <FaPhone size={12} /> Phone
                  </p>
                  <p className="text-white">{order.shippingAddress.phone}</p>
                </div>

                <div>
                  <p className="text-sm text-surface-400 mb-1 flex items-center gap-2">
                    <FaEnvelope size={12} /> Email
                  </p>
                  <p className="text-white break-all">{order.shippingAddress.email}</p>
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

export default OrderTrackingPage;
