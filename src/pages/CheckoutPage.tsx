import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaLock, FaCreditCard, FaMoneyBillWave, FaShieldAlt,
  FaShoppingBag, FaTruck, FaCheckCircle, FaMapMarkerAlt,
  FaEnvelope, FaPhone, FaUser, FaHome, FaCity, FaMapPin,
  FaArrowLeft, FaArrowRight, FaCheck
} from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { formatPriceSimple } from '../utils/formatPrice';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const useScript = (url: string) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      const existing = document.querySelector(`script[src="${url}"]`);
      if (existing) document.body.removeChild(existing);
    };
  }, [url]);
};

interface CheckoutForm {
  email: string; firstName: string; lastName: string; phone: string;
  street: string; city: string; state: string; pincode: string;
  paymentMethod: 'card' | 'upi' | 'cod';
}

const CheckoutPage: React.FC = () => {
  useScript('https://checkout.razorpay.com/v1/checkout.js');

  const { items, total, itemCount, clearCart } = useCart();
  const { user, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CheckoutForm>({
    email: '', firstName: '', lastName: '', phone: '',
    street: '', city: '', state: '', pincode: '',
    paymentMethod: 'cod'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '', firstName: user.firstName || '',
        lastName: user.lastName || '', phone: user.phone || '',
        street: user.address?.street || '', city: user.address?.city || '',
        state: user.address?.state || '', pincode: user.address?.pincode || '',
      }));
    }
  }, [user]);

  const subtotal = items.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 2000 ? 0 : 99;
  const finalTotal = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const displayRazorpay = async () => {
    setError(null);
    setIsLoading(true);
    const shippingAddress = {
      firstName: formData.firstName, lastName: formData.lastName, email: formData.email,
      phone: formData.phone, street: formData.street, city: formData.city,
      state: formData.state, pincode: formData.pincode,
    };
    const orderItemsPayload = items.map((item: any) => ({ productId: item.product.id, quantity: item.quantity }));

    if (!shippingAddress.firstName || !shippingAddress.street || !shippingAddress.city || !shippingAddress.pincode) {
      setError("Please fill in all required address fields.");
      setIsLoading(false);
      return;
    }

    try {
      const { data: razorpayOrder } = await api.post('/payments/create-order', { items: orderItemsPayload });
      if (!razorpayOrder?.orderId) throw new Error("Failed to create order.");

      const razorpayKeyId = 'rzp_test_RVniSvbS37g2Xx';
      if (!razorpayKeyId) { setError("Payment configuration error."); setIsLoading(false); return; }

      const options = {
        key: razorpayKeyId, amount: razorpayOrder.amount, currency: razorpayOrder.currency,
        name: "Akash Crackers", description: `Order #${razorpayOrder.receipt || ''}`,
        order_id: razorpayOrder.orderId,
        handler: async function (response: any) {
          setIsLoading(true);
          try {
            const verifyRes = await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderDetails: { orderItems: orderItemsPayload, shippingAddress, paymentMethod: 'online' }
            });
            clearCart();
            alert('Payment Successful! Order placed.');
            navigate(`/orders/${verifyRes.data.orderId}`);
          } catch (verifyError: any) {
            setError(verifyError.response?.data?.message || "Payment verification failed.");
            setIsLoading(false);
          }
        },
        prefill: { name: `${formData.firstName} ${formData.lastName}`, email: formData.email, contact: formData.phone },
        theme: { color: "#e63946" },
        modal: { ondismiss: () => { setError("Payment cancelled."); setIsLoading(false); } }
      };
      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        setError(`Payment failed: ${response.error.description || 'Unknown error'}`);
        setIsLoading(false);
      });
      rzp.open();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Could not initiate payment.');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !token) {
      setError("You must be logged in.");
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    if (!formData.firstName || !formData.street || !formData.city || !formData.pincode) {
      setError("Please fill in all required fields.");
      return;
    }

    if (formData.paymentMethod === 'cod') {
      setIsLoading(true); setError(null);
      const shippingAddress = {
        firstName: formData.firstName, lastName: formData.lastName, email: formData.email,
        phone: formData.phone, street: formData.street, city: formData.city,
        state: formData.state, pincode: formData.pincode,
      };
      const orderItemsPayload = items.map((item: any) => ({ productId: item.product.id, quantity: item.quantity }));
      try {
        const response = await api.post('/orders', { orderItems: orderItemsPayload, shippingAddress, paymentMethod: 'cod' });
        clearCart();
        alert('Order placed! Pay on delivery.');
        navigate(`/orders/${response.data._id}`);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to place order.');
      } finally {
        setIsLoading(false);
      }
    } else {
      displayRazorpay();
    }
  };

  const goToNextStep = () => {
    if (currentStep === 1 && (!formData.email || !formData.phone)) {
      setError("Please fill in contact information");
      return;
    }
    if (currentStep === 2 && (!formData.firstName || !formData.street || !formData.city || !formData.pincode)) {
      setError("Please fill in shipping address");
      return;
    }
    setError(null);
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const goToPrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError(null);
  };

  const inputClass = "w-full px-4 py-3.5 rounded-lg bg-surface-800 border border-surface-700 text-white text-sm placeholder-surface-500 focus:border-accent focus:ring-1 focus:ring-accent/20 focus:outline-none transition-all duration-200";

  if (items.length === 0 && !isLoading) {
    return (
      <div className="min-h-screen bg-surface-900 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center pt-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center px-6">
            <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-accent/10 to-gold/10 border border-accent/20 flex items-center justify-center">
              <FaShoppingBag className="text-accent" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Your cart is empty</h2>
            <p className="text-surface-400 mb-8">Add some crackers to get started</p>
            <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-accent text-white text-sm font-semibold hover:shadow-[0_0_50px_rgba(230,57,70,0.4)] transition-all duration-300 hover:scale-105">
              <FaShoppingBag size={16} />
              Browse Shop
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  const InputField = ({ label, icon, ...props }: any) => (
    <div>
      <label className="block text-sm font-medium text-surface-300 mb-2">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500">{icon}</div>}
        <input {...props} className={icon ? `${inputClass} pl-10` : inputClass} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-900">
      <Header />
      <main className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* LEFT SIDE - FORM */}
            <div>
              {/* Back to cart link */}
              <Link
                to="/cart"
                className="inline-flex items-center gap-2 text-sm text-surface-400 hover:text-white transition-colors mb-6"
              >
                <FaArrowLeft size={12} />
                Back to cart
              </Link>

              {/* Error Alert */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-accent/10 border border-accent/30 text-accent text-sm px-4 py-3 rounded-lg flex items-start gap-3 mb-6"
                >
                  <FaShieldAlt className="mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Step Indicator */}
              <div className="mb-8">
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((step) => (
                    <React.Fragment key={step}>
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all ${
                        currentStep > step
                          ? 'bg-emerald-500 text-white'
                          : currentStep === step
                          ? 'bg-accent text-white'
                          : 'bg-surface-800 text-surface-500'
                      }`}>
                        {currentStep > step ? <FaCheck size={12} /> : step}
                      </div>
                      {step < 3 && (
                        <div className={`flex-1 h-0.5 transition-all ${
                          currentStep > step ? 'bg-emerald-500' : 'bg-surface-800'
                        }`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  <span className={`text-xs ${currentStep >= 1 ? 'text-white' : 'text-surface-500'}`}>Contact</span>
                  <span className={`text-xs ${currentStep >= 2 ? 'text-white' : 'text-surface-500'}`}>Shipping</span>
                  <span className={`text-xs ${currentStep >= 3 ? 'text-white' : 'text-surface-500'}`}>Payment</span>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {/* STEP 1: Contact */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
                      <div className="space-y-4 mb-6">
                        <InputField
                          label="Email"
                          icon={<FaEnvelope size={14} />}
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="you@example.com"
                        />
                        <InputField
                          label="Phone Number"
                          icon={<FaPhone size={14} />}
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={goToNextStep}
                        className="w-full py-3.5 rounded-lg bg-accent text-white font-semibold hover:bg-accent/90 transition-all flex items-center justify-center gap-2"
                      >
                        Continue to shipping
                        <FaArrowRight size={14} />
                      </button>
                    </motion.div>
                  )}

                  {/* STEP 2: Shipping */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-2xl font-bold text-white mb-6">Shipping Address</h2>
                      <div className="space-y-4 mb-6">
                        <div className="grid grid-cols-2 gap-4">
                          <InputField
                            label="First Name"
                            icon={<FaUser size={14} />}
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            placeholder="John"
                          />
                          <InputField
                            label="Last Name"
                            icon={<FaUser size={14} />}
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                            placeholder="Doe"
                          />
                        </div>
                        <InputField
                          label="Street Address"
                          icon={<FaHome size={14} />}
                          type="text"
                          name="street"
                          value={formData.street}
                          onChange={handleInputChange}
                          required
                          placeholder="123 Main Street"
                        />
                        <div className="grid grid-cols-3 gap-4">
                          <InputField
                            label="City"
                            icon={<FaCity size={14} />}
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                            placeholder="Chennai"
                          />
                          <InputField
                            label="State"
                            icon={<FaMapPin size={14} />}
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            required
                            placeholder="TN"
                          />
                          <InputField
                            label="Pincode"
                            icon={<FaMapMarkerAlt size={14} />}
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            required
                            maxLength={6}
                            placeholder="600001"
                          />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={goToPrevStep}
                          className="px-6 py-3.5 rounded-lg border border-surface-700 text-white font-semibold hover:bg-surface-800 transition-all flex items-center gap-2"
                        >
                          <FaArrowLeft size={14} />
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={goToNextStep}
                          className="flex-1 py-3.5 rounded-lg bg-accent text-white font-semibold hover:bg-accent/90 transition-all flex items-center justify-center gap-2"
                        >
                          Continue to payment
                          <FaArrowRight size={14} />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: Payment */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-2xl font-bold text-white mb-6">Payment Method</h2>
                      <div className="space-y-3 mb-6">
                        {([
                          {
                            value: 'card',
                            icon: <FaCreditCard size={18} />,
                            label: 'Credit / Debit Card',
                            description: 'Razorpay secure payment'
                          },
                          {
                            value: 'upi',
                            icon: <div className="w-5 h-5 rounded bg-accent/20 flex items-center justify-center text-[9px] font-black text-accent">UPI</div>,
                            label: 'UPI Payment',
                            description: 'PhonePe, GPay, Paytm'
                          },
                          {
                            value: 'cod',
                            icon: <FaMoneyBillWave size={18} />,
                            label: 'Cash on Delivery',
                            description: 'Pay when delivered'
                          },
                        ] as const).map((method) => (
                          <label
                            key={method.value}
                            className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all border-2 ${
                              formData.paymentMethod === method.value
                                ? 'bg-accent/10 border-accent'
                                : 'bg-surface-800/50 border-surface-700 hover:border-surface-600'
                            }`}
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={method.value}
                              checked={formData.paymentMethod === method.value}
                              onChange={handleInputChange}
                              className="accent-accent"
                            />
                            <div className={`transition-colors ${formData.paymentMethod === method.value ? 'text-accent' : 'text-surface-400'}`}>
                              {method.icon}
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-white">{method.label}</div>
                              <div className="text-xs text-surface-500">{method.description}</div>
                            </div>
                            {formData.paymentMethod === method.value && (
                              <FaCheckCircle className="text-accent" size={16} />
                            )}
                          </label>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={goToPrevStep}
                          className="px-6 py-3.5 rounded-lg border border-surface-700 text-white font-semibold hover:bg-surface-800 transition-all flex items-center gap-2"
                        >
                          <FaArrowLeft size={14} />
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={isLoading || !isAuthenticated}
                          className="flex-1 py-3.5 rounded-lg bg-accent text-white font-semibold hover:bg-accent/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <FaLock size={14} />
                              {formData.paymentMethod === 'cod' ? 'Place Order' : 'Pay Now'}
                            </>
                          )}
                        </button>
                      </div>
                      {!isAuthenticated && (
                        <p className="text-center text-xs text-accent mt-4">Please log in to complete your order</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>

            {/* RIGHT SIDE - ORDER SUMMARY */}
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="bg-surface-800/50 border border-surface-700 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-5">Order Summary</h3>

                {/* Items */}
                <div className="space-y-3 mb-5 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item: any) => (
                    <div key={item.product.id} className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-14 h-14 object-cover rounded-lg"
                        />
                        <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-surface-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-white">{formatPriceSimple(item.product.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                {/* Price Details */}
                <div className="border-t border-surface-700 pt-4 space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-400">Subtotal</span>
                    <span className="text-white">{formatPriceSimple(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-400">Shipping</span>
                    <span className={shipping === 0 ? "text-emerald-400 font-semibold" : "text-white"}>
                      {shipping === 0 ? 'FREE' : formatPriceSimple(shipping)}
                    </span>
                  </div>
                  {subtotal < 2000 && (
                    <p className="text-xs text-surface-500">
                      Add {formatPriceSimple(2000 - subtotal)} more for free shipping
                    </p>
                  )}
                </div>

                {/* Total */}
                <div className="border-t border-surface-700 pt-4 flex justify-between items-center">
                  <span className="text-base font-bold text-white">Total</span>
                  <span className="text-2xl font-bold text-accent">{formatPriceSimple(finalTotal)}</span>
                </div>

                {/* Security Badge */}
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-surface-500">
                  <FaShieldAlt className="text-emerald-500" size={12} />
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(230, 57, 70, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(230, 57, 70, 0.5);
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage;
