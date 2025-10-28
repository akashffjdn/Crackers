import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaBox, FaShippingFast, FaTruck, FaCheckCircle, FaTimesCircle, FaCheck } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Order, CartItem, Product } from '../data/types'; // Make sure CartItem/Product is imported
import { formatPriceSimple } from '../utils/formatPrice';
import api from '../services/api'; // Import your api instance
import LoadingSpinner from '../components/LoadingSpinner'; // Import LoadingSpinner
import { IconType } from 'react-icons'; // Import IconType for tracking steps

// --- Interfaces for API Response (same as OrderManagement) ---
interface OrderItemProductFromAPI {
    _id: string;
    name: string;
    price: number;
    images: string[];
    // Add other fields if populated and needed
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
// --- End Interfaces ---

// --- Define Tracking Step Interface ---
interface TrackingStep {
  key: Order['status'] | 'confirmed'; // Use valid statuses
  label: string;
  icon: IconType;
}

const OrderTrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 // --- Function to map Backend Order to Frontend Order (Same as OrderManagement) ---
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
 // --- End Mapping Function ---


  // --- Fetch order data from the backend ---
  const fetchOrder = useCallback(async () => {
    if (!orderId) {
      setError("No Order ID provided.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      console.log(`Fetching order details for ID: ${orderId}`);
      const response = await api.get(`/orders/${orderId}`); // GET /api/orders/:orderId
      console.log("API Response:", response.data);
      if (response.data) {
          setOrder(mapOrderBEtoFE(response.data as OrderFromAPI)); // Map the response data
      } else {
           throw new Error("Order data not found in response.");
      }
    } catch (err: any) {
      console.error("Error fetching order:", err);
      const errorMsg = err.response?.status === 404
        ? "Order not found."
        : (err.response?.data?.message || err.message || 'Failed to load order details.');
      setError(errorMsg);
      setOrder(null); // Clear order on error
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);
  // --- End Fetch Order ---


  // --- Helper functions ---
   const getStatusColor = (status: Order['status']): string => {
       switch (status) {
         case 'pending': return 'text-yellow-600 bg-yellow-50 border border-yellow-200';
         case 'confirmed': return 'text-blue-600 bg-blue-50 border border-blue-200';
         case 'processing': return 'text-purple-600 bg-purple-50 border border-purple-200';
         case 'shipped': return 'text-orange-600 bg-orange-50 border border-orange-200';
         case 'delivered': return 'text-green-600 bg-green-50 border border-green-200';
         case 'cancelled': return 'text-red-600 bg-red-50 border border-red-200';
         default: return 'text-gray-600 bg-gray-50 border border-gray-200';
       }
   };

   const trackingSteps: TrackingStep[] = [
       { key: 'confirmed', label: 'Confirmed', icon: FaCheck }, // Use FaCheck
       { key: 'processing', label: 'Processing', icon: FaBox },
       { key: 'shipped', label: 'Shipped', icon: FaTruck },
       { key: 'delivered', label: 'Delivered', icon: FaCheckCircle }
   ];

  const getStepStatus = (stepKey: string, currentStatus: Order['status']): 'completed' | 'current' | 'pending' => {
      if (currentStatus === 'cancelled') {
           return 'pending'; 
      }
      const statusOrder: (Order['status'] | 'confirmed')[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
      const currentIndex = statusOrder.indexOf(currentStatus);
      const stepIndex = statusOrder.indexOf(stepKey as Order['status'] | 'confirmed');

      if (stepIndex === -1 || currentIndex === -1) {
           return 'pending';
       }
      if (stepIndex <= currentIndex) return 'completed';
      
      // Mark 'confirmed' as current if status is 'pending' or 'confirmed'
      if (stepKey === 'confirmed' && (currentStatus === 'pending' || currentStatus === 'confirmed')) return 'current';
      // Mark processing as current if status is 'processing'
      if (stepKey === 'processing' && currentStatus === 'processing') return 'current';
      // Mark shipped as current if status is 'shipped'
      if (stepKey === 'shipped' && currentStatus === 'shipped') return 'current';

      // Fallback for steps that aren't completed or current
      return 'pending';
  };
  // --- End Helper Functions ---


 // --- Render Logic ---

  if (isLoading) {
    return ( 
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner text="Loading order details..." />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return ( 
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center text-center px-4">
          <div>
            <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {error || "Order Not Found"}
            </h2>
            <p className="text-gray-600 mb-8">
              {error ? "Could not load order details." : "The order you're looking for doesn't exist or you may not have permission to view it."}
            </p>
            <Link
              to="/dashboard"
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Back to My Orders
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // --- Render Order Details (if loaded and exists) ---
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Order Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
           <div className="flex flex-col md:flex-row md:items-center md:justify-between">
             <div>
               <h1 className="text-2xl font-bold text-gray-900 mb-2">
                 Order #{order.id.substring(0, 12)}... 
               </h1>
               <p className="text-gray-600">
                 Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                   year: 'numeric', month: 'long', day: 'numeric'
                 })}
               </p>
             </div>
             <div className="mt-4 md:mt-0">
               <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize border ${getStatusColor(order.status)}`}>
                 <span className="ml-1">{order.status}</span>
               </span>
             </div>
           </div>
        </div>

        {/* Tracking Progress */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Progress</h2>
            <div className="flex justify-between items-start">
                {trackingSteps.map((step, index) => {
                  // Use order.status (which is guaranteed by the check above)
                  const statusResult = getStepStatus(step.key, order.status); 
                  const IconComponent = step.icon;
                  return (
                    <div key={step.key} className="flex flex-col items-center flex-1 relative px-1">
                       {/* Line Connector (except for the first item) */}
                       {index > 0 && (
                           <div className={`absolute top-4 left-0 w-1/2 h-0.5 ${ statusResult === 'completed' || statusResult === 'current' ? 'bg-green-300' : 'bg-gray-200'}`} aria-hidden="true" />
                       )}
                       {/* Line Connector (except for the last item) */}
                       {index < trackingSteps.length - 1 && (
                            <div className={`absolute top-4 right-0 w-1/2 h-0.5 ${ statusResult === 'completed' ? 'bg-green-300' : 'bg-gray-200'}`} aria-hidden="true" />
                       )}

                       <div className={`relative z-10 rounded-full p-3 mb-2 ${
                         statusResult === 'completed' ? 'bg-green-100 text-green-600' :
                         statusResult === 'current' ? 'bg-blue-100 text-blue-600 animate-pulse' :
                         'bg-gray-100 text-gray-400'
                       }`}>
                         <IconComponent className="text-xl" />
                       </div>
                       <p className={`text-center text-xs sm:text-sm font-medium ${
                         statusResult === 'completed' || statusResult === 'current' ? 'text-gray-900' : 'text-gray-500'
                       }`}>
                         {step.label}
                       </p>
                    </div>
                  );
                })}
              </div>

               {/* Tracking Number / Delivery Date */}
               {order.status !== 'cancelled' && (order.trackingNumber || order.estimatedDelivery) && (
                   <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 space-y-1">
                     {order.trackingNumber && (
                         <p><strong>Tracking Number:</strong> <span className="font-mono">{order.trackingNumber}</span></p>
                     )}
                     {order.estimatedDelivery && (
                         <p><strong>Estimated Delivery:</strong> {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                     )}
                   </div>
               )}
                {/* Cancelled Message */}
                {order.status === 'cancelled' && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                         <p><strong>This order has been cancelled.</strong></p>
                     </div>
                )}
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items ({order.items.length})</h2>
          <div className="space-y-4">
               {order.items.map((item, index) => (
                 <div key={item.product.id || index} className="flex items-center space-x-4 p-4 border rounded-lg border-gray-200">
                   <img 
                    src={item.product.images[0]} 
                    alt={item.product.name} 
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => {(e.target as HTMLImageElement).src = '/placeholder.png';}}
                   />
                   <div className="flex-1 min-w-0"> 
                    <h3 className="font-medium text-gray-900 line-clamp-2">{item.product.name}</h3> 
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p> 
                   </div>
                   <div className="text-right flex-shrink-0"> 
                    <p className="font-semibold text-gray-900"> 
                        {formatPriceSimple(item.product.price * item.quantity)} 
                    </p> 
                   </div>
                 </div>
               ))}
          </div>
           <div className="border-t border-gray-200 pt-4 mt-4">
                 <div className="flex justify-between items-center text-lg font-semibold">
                   <span>Total Paid</span>
                   <span className="text-red-600">{formatPriceSimple(order.total)}</span>
                 </div>
           </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
            <div className="text-gray-600 space-y-1">
                 <p className="font-medium text-gray-800">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                 <p>{order.shippingAddress.street}</p>
                 <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                 <p className="pt-2"> <strong>Phone:</strong> {order.shippingAddress.phone} </p>
                 <p> <strong>Email:</strong> {order.shippingAddress.email} </p>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderTrackingPage;