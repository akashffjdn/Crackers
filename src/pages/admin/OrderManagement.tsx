import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FaEye, FaEdit, FaDownload, FaSearch, FaTimesCircle, FaBox } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import OrderStatusUpdater from '../../components/admin/OrderStatusUpdater';
import OrderStatusBadge from '../../components/admin/OrderStatusBadge';
import { Order, CartItem, Product } from '../../data/types'; // Import Order and CartItem
import api from '../../services/api'; // Import api instance
import { formatPriceSimple } from '../../utils/formatPrice';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Link } from 'react-router-dom';

// --- Interfaces for API Response ---
// This matches the populated product details from the backend
interface OrderItemProductFromAPI {
    // These fields come from the populated 'product'
    _id: string; // The Product's ID
    name: string;
    price: number;
    images: string[];
    // Add other fields if populated and needed
}

// This matches the 'items' array structure in a backend Order
interface OrderItemFromAPI {
    product: OrderItemProductFromAPI | string; // Can be populated (object) or just an ID (string)
    quantity: number;
    _id?: string; // ID of the item subdocument
    // Fields stored at order time (if your model adds them)
    priceAtOrder?: number;
    nameAtOrder?: string;
    imageAtOrder?: string;
}

// This matches the backend Order model
interface OrderFromAPI extends Omit<Order, 'id' | 'items' | 'userId'> {
    _id: string;
    userId: string | { _id: string; firstName?: string; lastName?: string; email?: string }; // Can be populated
    items: OrderItemFromAPI[];
}
// --- End Interfaces ---


const OrderManagement: React.FC = () => {
    const [allOrders, setAllOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    
    // Pagination info from backend
    const [totalPages, setTotalPages] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);


    // --- Function to map Backend Order to Frontend Order ---
    const mapOrderBEtoFE = (orderData: OrderFromAPI): Order => {
        const mappedItems: CartItem[] = (orderData.items || []).map(item => {
            
            // Handle if product is populated (object) or just an ID (string)
            const productDetails = (typeof item.product === 'object' && item.product !== null) 
                ? item.product 
                : null;

            // Use details stored at order time if available, otherwise fall back
            const productName = item.nameAtOrder || productDetails?.name || 'Unknown Product';
            const productPrice = item.priceAtOrder || productDetails?.price || 0;
            const productImage = item.imageAtOrder || (productDetails?.images ? productDetails.images[0] : '/placeholder.png');
            const productId = (productDetails?._id || (typeof item.product === 'string' ? item.product : 'unknown'));

            return {
                quantity: item.quantity,
                // Reconstruct the 'Product' subset needed for the CartItem type
                product: {
                    id: productId,
                    name: productName,
                    price: productPrice,
                    images: [productImage],
                    // Fill required Product fields with defaults if not critical for display
                    categoryId: '', 
                    description: '',
                    shortDescription: '',
                    mrp: productPrice, // Use price as fallback
                    rating: 0,
                    reviewCount: 0,
                    soundLevel: 'Low',
                    burnTime: '',
                    stock: 1, // Stock isn't relevant for a placed order item
                    features: [],
                    specifications: {},
                    tags: []
                }
            };
        });

        // Handle populated vs non-populated userId
        const userIdString = typeof orderData.userId === 'string' ? orderData.userId : orderData.userId._id;
        const userDetails = typeof orderData.userId === 'object' ? orderData.userId : null;

        return {
            ...orderData,
            id: orderData._id, // Map _id to id
            items: mappedItems,
            userId: userIdString,
            // Use populated user details for shipping/customer info if available
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


    // --- Fetch Orders Function (with Pagination) ---
    const fetchOrders = useCallback(async (page = 1) => {
        setIsLoading(true);
        setError(null);
        try {
            console.log(`Fetching all orders (admin) page: ${page}...`);
            // Pass pagination params to the API
            const response = await api.get('/orders', {
                params: {
                    page: page,
                    limit: itemsPerPage,
                    // You could also pass filters/search to backend here
                    // search: searchTerm,
                    // status: statusFilter,
                    // date: dateFilter, 
                }
            }); 
            
            // Use backend pagination data
            if (response.data && Array.isArray(response.data.orders)) {
                 console.log(`Fetched ${response.data.orders.length} orders.`);
                 setAllOrders(response.data.orders.map(mapOrderBEtoFE)); // Map and set state
                 setTotalPages(response.data.totalPages || 1);
                 setTotalOrders(response.data.totalOrders || 0);
                 setCurrentPage(response.data.currentPage || page);
            } else {
                 // Handle case where backend pagination isn't implemented yet
                 // and it just returns a flat array
                 if(Array.isArray(response.data)) {
                    console.warn("Backend /api/orders does not seem to support pagination. Loading all.");
                    const mappedData = response.data.map(mapOrderBEtoFE);
                    setAllOrders(mappedData);
                    setTotalPages(Math.ceil(mappedData.length / itemsPerPage));
                    setTotalOrders(mappedData.length);
                    setCurrentPage(page); // Keep requested page
                 } else {
                    throw new Error("Invalid orders data format received");
                 }
            }
        } catch (err: any) {
            console.error("Error fetching orders:", err);
            setError(err.response?.data?.message || err.message || 'Failed to fetch orders');
            setAllOrders([]); // Clear orders on error
        } finally {
            setIsLoading(false);
        }
    }, [itemsPerPage]); // Removed dependencies that are now handled by backend (searchTerm, etc)

    // Fetch orders on component mount
    useEffect(() => {
        fetchOrders(currentPage);
    }, [fetchOrders, currentPage]); // Refetch when currentPage changes
    // --- End Fetch Orders ---


    // --- Filtering Logic (Client-side, can be moved to backend) ---
    useEffect(() => {
        // This filtering now happens *after* fetching the paginated data
        // For full filtering, these params should be sent to the backend `fetchOrders`
        let filtered = allOrders; // Start with the data fetched for the current page

        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(order =>
                order.id.toLowerCase().includes(lowerSearch) ||
                `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`.toLowerCase().includes(lowerSearch) ||
                order.shippingAddress.email.toLowerCase().includes(lowerSearch) ||
                (order.shippingAddress.phone && order.shippingAddress.phone.includes(lowerSearch))
            );
        }
        if (statusFilter) {
            filtered = filtered.filter(order => order.status === statusFilter);
        }
        if (dateFilter) {
             const today = new Date(); today.setHours(0,0,0,0);
             let filterStartDate = new Date(today);
             switch (dateFilter) {
                 case 'today': break;
                 case 'week': filterStartDate.setDate(today.getDate() - 7); break;
                 case 'month': filterStartDate.setMonth(today.getMonth() - 1); break;
                 default: filterStartDate = new Date(0); 
             }
             filtered = filtered.filter(order => new Date(order.createdAt) >= filterStartDate);
        }

        // Sort by creation date (newest first)
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setFilteredOrders(filtered);
        // We don't reset currentPage here anymore as filtering is client-side
        // on the already paginated data.
        // For backend filtering, you would refetch page 1.

    }, [allOrders, searchTerm, statusFilter, dateFilter]);


    // --- Pagination Calculation ---
    // Use client-side filtered results for display
    const totalFilteredPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    // const currentOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);
    
    // **NOTE:** Since we're doing client-side filtering on *paginated* data,
    // we should just display all `filteredOrders` (which is already just one page worth)
    // OR, if backend pagination isn't implemented and `allOrders` holds *everything*,
    // then the slicing is correct.
    
    // Assuming backend pagination IS implemented (as per `getAllOrders` recommendation):
    const currentOrders = filteredOrders; // Display the filtered data from the current page
    
    // Assuming backend pagination IS NOT implemented (fallback):
    // const totalPagesFallback = Math.ceil(filteredOrders.length / itemsPerPage);
    // const startIndexFallback = (currentPage - 1) * itemsPerPage;
    // const currentOrdersFallback = filteredOrders.slice(startIndexFallback, startIndexFallback + itemsPerPage);
    // Use totalPagesFallback and currentOrdersFallback below if backend pagination isn't working yet.


    // --- Update Order Status API Call ---
    const handleUpdateOrderStatus = async (orderId: string, status: Order['status'], trackingNumber?: string) => {
        setIsStatusModalOpen(false);
        // Find the specific order in the *local* list to show loading
        setFilteredOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'processing' } : o)); // Optimistic UI
        
        setError(null);
        try {
            console.log(`Updating order ${orderId} status to ${status}...`);
            // Send API request
            await api.put(`/orders/${orderId}/status`, { status, trackingNumber });
            console.log(`Order ${orderId} updated successfully.`);
            
            // Refetch *only* the current page's data
            fetchOrders(currentPage); 
            // alert('Order status updated!'); // Optional success feedback
        } catch (err: any) {
            console.error("Error updating order status:", err);
            const errorMsg = err.response?.data?.message || err.message || 'Failed to update order status';
            setError(errorMsg);
            alert(`Update Failed: ${errorMsg}`); // Show error
            // Revert optimistic update by refetching
            fetchOrders(currentPage);
        }
    };
    // --- End Update Order Status ---


    // Helper function (remains the same)
     const getPaymentStatusColor = (status: string) => {
         switch (status) {
             case 'paid': return 'text-green-600 bg-green-50';
             case 'pending': return 'text-yellow-600 bg-yellow-50';
             case 'failed': return 'text-red-600 bg-red-50';
             default: return 'text-gray-600 bg-gray-50';
         }
     };

    // Calculate Stats (useMemo for efficiency, uses *totalOrders* from backend)
    const orderStats = useMemo(() => ({
        total: totalOrders, // Use total from backend
        // Note: These stats might only reflect the current page if backend doesn't provide totals
        // For accurate stats, backend API should provide these counts
        pending: allOrders.filter(o => o.status === 'pending').length,
        confirmed: allOrders.filter(o => o.status === 'confirmed').length,
        processing: allOrders.filter(o => o.status === 'processing').length,
        shipped: allOrders.filter(o => o.status === 'shipped').length,
        delivered: allOrders.filter(o => o.status === 'delivered').length,
        cancelled: allOrders.filter(o => o.status === 'cancelled').length
    }), [allOrders, totalOrders]); // Depend on allOrders (current page data) and totalOrders


    // --- Render Logic ---
    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header (remains the same) */}
                 <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                     <div> <h1 className="text-2xl font-bold text-gray-900">Order Management</h1> <p className="text-gray-600">Track and manage customer orders</p> </div>
                     <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors mt-4 md:mt-0"> <FaDownload /> <span>Export Orders</span> </button>
                 </div>

                 {/* Loading State */}
                 {isLoading && (
                    <div className="p-6 bg-white rounded-lg shadow-sm text-center">
                        <LoadingSpinner text="Loading orders..." />
                    </div>
                 )}

                 {/* Error State */}
                 {error && !isLoading && (
                    <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
                        Error: {error}
                        <button onClick={() => fetchOrders(currentPage)} className="ml-4 px-2 py-1 border border-red-300 rounded text-sm hover:bg-red-100">Retry</button>
                    </div>
                 )}

                 {/* Stats Cards - Render only when not loading and no error */}
                 {!isLoading && !error && (
                      <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
                         {[ 
                             { label: 'Total', value: orderStats.total, color: 'text-gray-800' }, 
                             { label: 'Pending', value: orderStats.pending, color: 'text-yellow-800' }, 
                             { label: 'Confirmed', value: orderStats.confirmed, color: 'text-blue-800' }, 
                             { label: 'Processing', value: orderStats.processing, color: 'text-purple-800' }, // Use purple for processing
                             { label: 'Shipped', value: orderStats.shipped, color: 'text-orange-800' }, // Use orange for shipped
                             { label: 'Delivered', value: orderStats.delivered, color: 'text-green-800' }, 
                             { label: 'Cancelled', value: orderStats.cancelled, color: 'text-red-800' }
                         ].map((stat, index) => ( <div key={index} className="bg-white rounded-lg shadow-sm p-4"> <div className={`text-2xl font-bold ${stat.color}`}> {stat.value} </div> <div className="text-sm text-gray-600">{stat.label}</div> </div> ))}
                     </div>
                 )}


                {/* Filters (remain the same) - Render only when not loading and no error */}
                 {!isLoading && !error && (
                     <div className="bg-white rounded-lg shadow-sm p-6">
                         {/* ... (Keep existing Filter JSX: Search, Status, Date, Clear) ... */}
                         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                             <div>
                                <label htmlFor="order-search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                                 <div className="relative"> <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" /> <input id="order-search" type="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Order ID, Customer..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" /> </div>
                             </div>
                              <div>
                                 <label htmlFor="order-status-filter" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                 <select id="order-status-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white">
                                     <option value="">All Status</option> <option value="pending">Pending</option> <option value="confirmed">Confirmed</option> <option value="processing">Processing</option> <option value="shipped">Shipped</option> <option value="delivered">Delivered</option> <option value="cancelled">Cancelled</option>
                                 </select>
                             </div>
                             <div>
                                 <label htmlFor="order-date-filter" className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                                 <select id="order-date-filter" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white">
                                     <option value="">All Time</option> <option value="today">Today</option> <option value="week">Last 7 days</option> <option value="month">Last 30 days</option>
                                 </select>
                             </div>
                             <div className="flex items-end"> <button onClick={() => { setSearchTerm(''); setStatusFilter(''); setDateFilter(''); }} type="button" className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"> Clear Filters </button> </div>
                         </div>
                     </div>
                 )}

                {/* Orders Table - Render only when not loading and no error */}
                 {!isLoading && !error && (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                {/* Table Head (remains the same) */}
                                <thead className="bg-gray-50">
                                    <tr>
                                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                         <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {/* Handle Empty State */}
                                    {currentOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                                                 <FaTimesCircle className="mx-auto text-4xl text-gray-300 mb-3" />
                                                 No orders found{searchTerm || statusFilter || dateFilter ? ' matching your criteria' : ''}.
                                            </td>
                                        </tr>
                                    ) : (
                                        currentOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                                {/* Order Details Column */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <Link to={`/orders/${order.id}`} target="_blank" className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                                                            #{order.id.substring(0, 8)}...
                                                        </Link>
                                                        <div className="text-sm text-gray-500">
                                                             {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                                        </div>
                                                         {order.trackingNumber && ( <div className="text-xs text-gray-400 font-mono mt-1"> {order.trackingNumber} </div> )}
                                                    </div>
                                                </td>
                                                {/* Customer Column */}
                                                 <td className="px-6 py-4 whitespace-nowrap">
                                                     <div>
                                                         <div className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                                                             {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                                                         </div>
                                                         <a href={`mailto:${order.shippingAddress.email}`} className="text-sm text-blue-600 hover:underline truncate max-w-[180px]">{order.shippingAddress.email}</a>
                                                          <div className="text-sm text-gray-500">{order.shippingAddress.phone}</div>
                                                     </div>
                                                 </td>
                                                 {/* Amount Column */}
                                                 <td className="px-6 py-4 whitespace-nowrap">
                                                     <div className="text-sm font-semibold text-gray-900">
                                                         {formatPriceSimple(order.total)}
                                                     </div>
                                                      <div className="text-xs text-gray-500 capitalize"> {order.paymentMethod} </div>
                                                 </td>
                                                 {/* Status Column */}
                                                 <td className="px-6 py-4 whitespace-nowrap">
                                                     <OrderStatusBadge status={order.status} />
                                                 </td>
                                                 {/* Payment Column */}
                                                 <td className="px-6 py-4 whitespace-nowrap">
                                                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getPaymentStatusColor(order.paymentStatus)}`}>
                                                         {order.paymentStatus}
                                                     </span>
                                                 </td>
                                                 {/* Date Column */}
                                                 <td className="px-6 py-4 whitespace-nowrap">
                                                     <div className="text-sm text-gray-900"> {new Date(order.createdAt).toLocaleDateString()} </div>
                                                     <div className="text-xs text-gray-500"> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} </div>
                                                 </td>
                                                {/* Actions Column (remains the same) */}
                                                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                     <div className="flex items-center justify-end space-x-2">
                                                         <Link to={`/orders/${order.id}`} target="_blank" className="text-blue-600 hover:text-blue-900 p-1" title="View Order"> <FaEye /> </Link>
                                                         <button onClick={() => { setSelectedOrder(order); setIsStatusModalOpen(true); }} className="text-green-600 hover:text-green-900 p-1" title="Update Status"> <FaEdit /> </button>
                                                     </div>
                                                 </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                         {/* Pagination Controls - Use backend totalPages */}
                         {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={(page) => fetchOrders(page)} // Make pagination refetch
                            />
                         )}
                    </div>
                 )}

                {/* Order Status Update Modal (remains the same) */}
                <OrderStatusUpdater
                    order={selectedOrder}
                    isOpen={isStatusModalOpen}
                    onClose={() => setIsStatusModalOpen(false)}
                    onUpdateStatus={handleUpdateOrderStatus} // Pass the API handler
                />
            </div>
        </AdminLayout>
    );
};

export default OrderManagement;