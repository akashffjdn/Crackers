import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLock, FaCreditCard, FaMoneyBillWave, FaShieldAlt, FaShoppingBag } from 'react-icons/fa';
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

  const inputClass = "w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder-surface-500 focus:border-accent/40 focus:ring-1 focus:ring-accent/20 focus:outline-none transition-all duration-300";

  if (items.length === 0 && !isLoading) {
    return (
      <div className="min-h-screen bg-surface-900 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center pt-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center px-6">
            <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
              <FaShoppingBag className="text-surface-500" size={32} />
            </div>
            <p className="text-lg text-surface-400 mb-6">Your cart is empty.</p>
            <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-accent text-white text-sm font-semibold hover:shadow-[0_0_30px_rgba(230,57,70,0.25)] transition-all duration-300">
              Go Shopping
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  const InputField = ({ label, ...props }: any) => (
    <div>
      <label className="block text-[11px] font-semibold text-surface-400 uppercase tracking-[0.15em] mb-2.5">{label}</label>
      <input {...props} className={inputClass} />
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-900">
      <Header />
      <main className="pt-28 pb-16">
        <div className="max-w-5xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <div className="flex items-center gap-2 text-xs text-surface-500 mb-5 justify-center">
              <Link to="/cart" className="hover:text-white transition-colors">Cart</Link>
              <span>/</span>
              <span className="text-surface-300">Checkout</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-[-0.02em]">Complete your order</h1>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-5 gap-8">
              {/* Left - Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:col-span-3 space-y-5"
              >
                {error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-accent/10 border border-accent/20 text-accent text-sm px-4 py-3 rounded-xl">
                    {error}
                  </motion.div>
                )}

                {/* Contact */}
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center">1</span>
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="you@example.com" />
                    <InputField label="Phone" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="+91 98765 43210" />
                  </div>
                </div>

                {/* Shipping */}
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center">2</span>
                    Shipping Address
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="First Name" type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required placeholder="John" />
                      <InputField label="Last Name" type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required placeholder="Doe" />
                    </div>
                    <InputField label="Street Address" type="text" name="street" value={formData.street} onChange={handleInputChange} required placeholder="123 Main Street" />
                    <div className="grid grid-cols-3 gap-4">
                      <InputField label="City" type="text" name="city" value={formData.city} onChange={handleInputChange} required placeholder="Chennai" />
                      <InputField label="State" type="text" name="state" value={formData.state} onChange={handleInputChange} required placeholder="Tamil Nadu" />
                      <InputField label="Pincode" type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} required maxLength={6} placeholder="600001" />
                    </div>
                  </div>
                </div>

                {/* Payment */}
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center">3</span>
                    Payment Method
                  </h3>
                  <div className="space-y-3">
                    {([
                      { value: 'card', icon: <FaCreditCard size={14} />, label: 'Card (Online Payment)' },
                      { value: 'upi', icon: <span className="text-xs font-bold">UPI</span>, label: 'UPI (Online Payment)' },
                      { value: 'cod', icon: <FaMoneyBillWave size={14} />, label: 'Cash on Delivery' },
                    ] as const).map((method) => (
                      <label
                        key={method.value}
                        className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-300 ${formData.paymentMethod === method.value
                            ? 'bg-accent/[0.06] border border-accent/30'
                            : 'bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04]'
                          }`}
                      >
                        <input type="radio" name="paymentMethod" value={method.value} checked={formData.paymentMethod === method.value} onChange={handleInputChange} className="accent-accent" />
                        <span className="text-accent">{method.icon}</span>
                        <span className="text-sm text-surface-300">{method.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Right - Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-2"
              >
                <div className="sticky top-28 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <h3 className="text-sm font-semibold text-white mb-5">Order Summary</h3>

                  <div className="space-y-3 max-h-48 overflow-y-auto mb-5 pr-1">
                    {items.map((item: any) => (
                      <div key={item.product.id} className="flex items-center gap-3">
                        <img src={item.product.images[0]} alt={item.product.name} className="w-11 h-11 object-cover rounded-lg" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white line-clamp-1">{item.product.name}</p>
                          <p className="text-[11px] text-surface-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-xs font-semibold text-white">{formatPriceSimple(item.product.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 border-t border-white/[0.06] pt-4 mb-5">
                    <div className="flex justify-between text-sm">
                      <span className="text-surface-400">Subtotal</span>
                      <span className="text-white">{formatPriceSimple(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-surface-400">Shipping</span>
                      <span className={shipping === 0 ? "text-emerald-400" : "text-white"}>{shipping === 0 ? 'FREE' : formatPriceSimple(shipping)}</span>
                    </div>
                    <div className="h-px bg-white/[0.06]" />
                    <div className="flex justify-between pt-1">
                      <span className="text-base font-semibold text-white">Total</span>
                      <span className="text-lg font-bold text-white">{formatPriceSimple(finalTotal)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !isAuthenticated}
                    className="w-full py-3.5 rounded-xl bg-accent text-white text-[15px] font-semibold hover:shadow-[0_0_30px_rgba(230,57,70,0.25)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 mb-3"
                  >
                    {isLoading ? <LoadingSpinner size="sm" /> : <><FaLock size={12} /> {formData.paymentMethod === 'cod' ? 'Place COD Order' : 'Proceed to Payment'}</>}
                  </button>

                  {!isAuthenticated && (
                    <p className="text-center text-xs text-accent">Please log in to complete your order.</p>
                  )}

                  <div className="mt-3 text-center text-[11px] text-surface-500 flex items-center justify-center gap-1.5">
                    <FaShieldAlt className="text-emerald-500" size={10} />
                    <span>{formData.paymentMethod === 'cod' ? 'Pay on Delivery' : 'Secure Payment'}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;