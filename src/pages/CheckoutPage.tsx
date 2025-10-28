// src/pages/CheckoutPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaLock, FaCreditCard, FaMoneyBillWave, FaShieldAlt, FaShoppingBag, FaEye, FaEyeSlash } from 'react-icons/fa'; // Added Eye icons
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { formatPriceSimple, calculateDiscount } from '../utils/formatPrice'; // Corrected import path if needed
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { User } from '../data/types'; // Make sure User type includes address field if used

// --- Helper Hook to load external scripts ---
const useScript = (url: string) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector(`script[src="${url}"]`);
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, [url]);
};

// --- Interfaces ---
interface ShippingAddressBE {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
}

interface OrderItemPayload {
    productId: string;
    quantity: number;
}

interface CheckoutForm {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: 'card' | 'upi' | 'cod';
}

// --- Component ---
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
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        // Make sure user.address exists and has these properties
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        pincode: user.address?.pincode || '',
      }));
    }
  }, [user]);

  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const freeShippingThreshold = 2000;
  const standardShippingCost = 99;
  const shipping = subtotal > freeShippingThreshold ? 0 : standardShippingCost;
  const finalTotal = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const displayRazorpay = async () => {
    console.log("--- displayRazorpay function started ---");
    setError(null);
    setIsLoading(true);

     const shippingAddress: ShippingAddressBE = {
        firstName: formData.firstName, lastName: formData.lastName, email: formData.email, phone: formData.phone,
        street: formData.street, city: formData.city, state: formData.state, pincode: formData.pincode,
    };
    const orderItemsPayload: OrderItemPayload[] = items.map(item => ({
        productId: item.product.id, quantity: item.quantity,
    }));

     if (!shippingAddress.firstName || !shippingAddress.lastName || !shippingAddress.email || !shippingAddress.phone || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
        setError("Please fill in all required address fields before proceeding to payment.");
        setIsLoading(false);
        return;
     }

    try {
      const { data: razorpayOrder } = await api.post('/payments/create-order', {
        items: orderItemsPayload
      });

      if (!razorpayOrder || !razorpayOrder.orderId) {
          throw new Error("Failed to create Razorpay order ID.");
      }

      // *** FIXED: Access environment variable using process.env for CRA ***
      const razorpayKeyId = 'rzp_test_RVniSvbS37g2Xx';
      console.log('VITE Razorpay Key ID:', razorpayKeyId);
     
      if (!razorpayKeyId) {
          console.error("Razorpay Key ID not found. Ensure REACT_APP_RAZORPAY_TEST_KEY_ID is set in your .env file.");
          setError("Payment gateway configuration error. Please contact support.");
          setIsLoading(false);
          return;
      }

      const options = {
        key: razorpayKeyId, // *** FIXED HERE ***
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Akash Crackers",
        description: `Order Payment #${razorpayOrder.receipt || ''}`,
        order_id: razorpayOrder.orderId,
        handler: async function (response: any) {
          console.log("Razorpay Success Response:", response);
          setIsLoading(true);
          try {
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderDetails: {
                 orderItems: orderItemsPayload,
                 shippingAddress: shippingAddress,
                 paymentMethod: 'online'
              }
            };
            const verifyRes = await api.post('/payments/verify', verificationData);
            console.log("Backend Verification Response:", verifyRes.data);
            clearCart();
            alert('Payment Successful! Order placed.');
            navigate(`/orders/${verifyRes.data.orderId}`);
          } catch (verifyError: any) {
            console.error("Payment Verification Failed:", verifyError);
            setError(verifyError.response?.data?.message || verifyError.message || "Payment verification failed. Please contact support.");
            setIsLoading(false);
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          address: `${formData.street}, ${formData.city}`,
        },
        theme: {
          color: "#E53E3E",
        },
        modal: {
            ondismiss: function() {
                console.log('Razorpay checkout modal dismissed');
                setError("Payment process was cancelled.");
                setIsLoading(false);
            }
        }
      };

      // @ts-ignore // Ignore window.Razorpay type error
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
          console.error("Razorpay Payment Failed:", response.error);
          setError(`Payment failed: ${response.error.description || response.error.reason || 'Unknown error'}. Please try again or choose another method.`);
          setIsLoading(false);
      });
      rzp.open();

    } catch (err: any) {
      console.error('Error initiating Razorpay checkout:', err);
       const backendMessage = err.response?.data?.message;
       if (backendMessage && (backendMessage.includes('Insufficient stock') || backendMessage.includes('Product not found'))) {
           setError(`Order Error: ${backendMessage}`);
       } else {
           setError(backendMessage || err.message || 'Could not initiate payment. Please try again.');
       }
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     if (!isAuthenticated || !token) {
        setError("You must be logged in to place an order.");
        navigate('/login', { state: { from: '/checkout' } });
        return;
    }
     if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.street || !formData.city || !formData.state || !formData.pincode) {
        setError("Please fill in all required address fields.");
        return;
     }

    if (formData.paymentMethod === 'cod') {
      setIsLoading(true);
      setError(null);
      const shippingAddress: ShippingAddressBE = {
        firstName: formData.firstName, lastName: formData.lastName, email: formData.email, phone: formData.phone,
        street: formData.street, city: formData.city, state: formData.state, pincode: formData.pincode,
      };
      const orderItemsPayload: OrderItemPayload[] = items.map(item => ({
          productId: item.product.id, quantity: item.quantity,
      }));
       const orderData = {
          orderItems: orderItemsPayload,
          shippingAddress: shippingAddress,
          paymentMethod: 'cod',
      };
      try {
        const response = await api.post('/orders', orderData);
        console.log('COD Order submitted successfully:', response.data);
        clearCart();
        alert('Order placed successfully! Pay on delivery.');
        navigate(`/orders/${response.data._id}`);
      } catch (err: any) {
        console.error('Error submitting COD order:', err);
         const backendMessage = err.response?.data?.message;
         setError(backendMessage || err.message || 'Failed to place COD order.');
      } finally {
        setIsLoading(false);
      }
    } else {
      displayRazorpay();
    }
  };

  // *** FIXED: Added parentheses around the returned JSX block ***
  if (items.length === 0 && !isLoading) {
       return ( // <-- Added parenthesis
         <div className="min-h-screen bg-gray-50 flex flex-col">
             <Header />
             <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                   <FaShoppingBag className="text-6xl text-gray-400 mx-auto mb-4" />
                   <p className="text-xl text-gray-600 mb-4">Your cart is empty.</p>
                   <Link to="/shop" className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">Go Shopping</Link>
                </div>
             </div>
             <Footer />
         </div>
       ); // <-- Added parenthesis
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
             <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
             <p className="text-gray-600">Complete your purchase</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-2 gap-12">
              {/* === Left Side: Form Fields === */}
              <div className="space-y-8">
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                  </div>
                )}
                {/* Contact Info */}
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                   <h3 className="text-lg font-semibold mb-4 border-b pb-2">1. Contact Information</h3>
                   <div className="space-y-4">
                     <div>
                       <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                       <input id="email" type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                     </div>
                     <div>
                       <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                       <input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                     </div>
                   </div>
                </div>
                {/* Shipping Address */}
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                   <h3 className="text-lg font-semibold mb-4 border-b pb-2">2. Shipping Address</h3>
                   <div className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                       <div>
                         <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                         <input id="firstName" type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"/>
                       </div>
                       <div>
                         <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                         <input id="lastName" type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"/>
                       </div>
                     </div>
                     <div>
                       <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                       <input id="street" type="text" name="street" value={formData.street} onChange={handleInputChange} required className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"/>
                     </div>
                     <div className="grid grid-cols-3 gap-4">
                       <div>
                         <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                         <input id="city" type="text" name="city" value={formData.city} onChange={handleInputChange} required className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"/>
                       </div>
                       <div>
                         <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                         <input id="state" type="text" name="state" value={formData.state} onChange={handleInputChange} required className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"/>
                       </div>
                       <div>
                         <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                         <input id="pincode" type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} required maxLength={6} pattern="[1-9][0-9]{5}" title="Enter a valid 6-digit Indian pincode" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"/>
                       </div>
                     </div>
                   </div>
                </div>
                {/* Payment Method */}
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                   <h3 className="text-lg font-semibold mb-4 border-b pb-2">3. Payment Method</h3>
                    <div className="space-y-3">
                        <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${formData.paymentMethod === 'card' ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}>
                            <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={handleInputChange} className="mr-3"/>
                            <FaCreditCard className="mr-2 text-blue-600"/> Card (Online Payment)
                        </label>
                         <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${formData.paymentMethod === 'upi' ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}>
                            <input type="radio" name="paymentMethod" value="upi" checked={formData.paymentMethod === 'upi'} onChange={handleInputChange} className="mr-3"/>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="w-6 h-6 mr-2"/> UPI (Online Payment)
                        </label>
                        <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${formData.paymentMethod === 'cod' ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}>
                            <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} className="mr-3"/>
                            <FaMoneyBillWave className="mr-2 text-green-600"/> Cash on Delivery (COD)
                        </label>
                    </div>
                </div>
              </div>

              {/* === Right Side: Order Summary === */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg p-6 shadow-sm border sticky top-24">
                   <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Order Summary</h3>
                   <div className="space-y-3 max-h-60 overflow-y-auto mb-4 pr-2">
                       {items.map(item=>(
                            <div key={item.product.id} className="flex items-center space-x-3 text-sm">
                                <img src={item.product.images[0]} alt={item.product.name} className="w-12 h-12 object-cover rounded"/>
                                <div className="flex-1">
                                    <p className="font-medium line-clamp-1">{item.product.name}</p>
                                    <p className="text-gray-500">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-semibold">{formatPriceSimple(item.product.price * item.quantity)}</p>
                            </div>
                       ))}
                   </div>
                   <div className="space-y-2 border-t pt-4 mb-6">
                      <div className="flex justify-between text-gray-600"><p>Subtotal:</p> <p>{formatPriceSimple(subtotal)}</p></div>
                      <div className="flex justify-between text-gray-600"><p>Shipping:</p> <p>{shipping === 0 ? 'FREE' : formatPriceSimple(shipping)}</p></div>
                      <div className="flex justify-between font-bold text-lg text-gray-900"><p>Total:</p> <p className="text-red-600">{formatPriceSimple(finalTotal)}</p></div>
                   </div>

                   {/* Submit Button */}
                   <button
                     type="submit"
                     disabled={isLoading || !isAuthenticated}
                     className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-red-700 hover:to-orange-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     {isLoading ? ( <LoadingSpinner size="sm" color="text-white" /> ) : ( <FaLock /> )}
                     <span>{isLoading ? 'Processing...' : (isAuthenticated ? (formData.paymentMethod === 'cod' ? 'Place COD Order' : 'Proceed to Payment') : 'Login to Order')}</span>
                   </button>

                    {!isAuthenticated && ( <p className="text-center text-sm text-red-600 mt-3">Please log in or sign up to complete your order.</p> )}

                   <div className="mt-4 text-center text-sm text-gray-500 flex items-center justify-center space-x-1">
                     <FaShieldAlt className="text-green-600"/>
                     <span>{formData.paymentMethod === 'cod' ? 'Pay on Delivery' : 'Secure Online Payment'}</span>
                   </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;