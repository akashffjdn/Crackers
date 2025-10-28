import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUser, FaShoppingBag, FaMapMarkerAlt, FaHeart, FaCog, FaSignOutAlt,
  FaPlus, FaTimes, FaEdit, FaSave, FaCheck
} from 'react-icons/fa';
import Header from '../components/Header'; //
import Footer from '../components/Footer'; //
import { useAuth } from '../context/AuthContext'; //
import { Order, Product, User, CartItem } from '../data/types'; // Import CartItem
// getOrdersByUserId removed
import { formatPriceSimple } from '../utils/formatPrice'; //
import { useCart } from '../context/CartContext'; //
// products import removed
import { useWishlist } from '../context/WishlistContext'; // Use type from context
import type { WishlistItem } from '../context/WishlistContext'; // Explicit import
import api from '../services/api'; //
import LoadingSpinner from '../components/LoadingSpinner'; //
import { validatePincode, validatePhone } from '../utils/validation'; //

// Interface matching Backend Address subdocument + frontend id
interface Address {
  _id?: string; // ID from backend
  id?: string;  // ID used in frontend state (mapped from _id)
  label: string; //
  name: string; //
  street: string; //
  city: string; //
  state: string; //
  pincode: string; //
  phone: string; //
  isDefault: boolean; //
}

// UserSettings - Simplified
interface UserSettings {
  language: string; //
  currency: string; //
}

interface ProfileData {
  firstName: string; //
  lastName: string; //
  email: string; //
  phone: string; //
}

// Interface for Order from API (for /myorders endpoint - product is NOT populated)
interface OrderItemFromMyOrdersAPI {
    product: string; // Just the ObjectId string
    quantity: number;
    _id?: string;
    // Fields stored at order time
    priceAtOrder: number;
    nameAtOrder: string;
    imageAtOrder?: string;
}
interface OrderFromMyOrdersAPI extends Omit<Order, 'id' | 'items' | 'userId'> {
    _id: string;
    userId: string | { _id: string; firstName?: string }; // Can still be populated
    items: OrderItemFromMyOrdersAPI[]; // Uses the specific item structure
}


const UserDashboard: React.FC = () => {
    const { user, logout, updateProfile: updateAuthProfile } = useAuth(); //
    const [activeTab, setActiveTab] = useState('orders'); //
    const { addToCart } = useCart(); //
    // Destructure isLoading and error from useWishlist
    const { wishlistItems, removeFromWishlist, isLoading: isLoadingWishlist, error: errorWishlist } = useWishlist(); //

    // --- State for API data ---
    const [userOrders, setUserOrders] = useState<Order[]>([]); //
    const [userAddresses, setUserAddresses] = useState<Address[]>([]); //
    const [isLoadingOrders, setIsLoadingOrders] = useState(true); //
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(true); //
    const [errorOrders, setErrorOrders] = useState<string | null>(null); //
    const [errorAddresses, setErrorAddresses] = useState<string | null>(null); //
    const [isSavingProfile, setIsSavingProfile] = useState(false); //
    const [isSavingAddress, setIsSavingAddress] = useState(false); //
    const [profileError, setProfileError] = useState<string | null>(null); //
    const [addressError, setAddressError] = useState<string | null>(null); //


    // Address Modal State
    const [isAddressFormOpen, setIsAddressFormOpen] = useState(false); //
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null); //
    const [addressFormData, setAddressFormData] = useState<Partial<Address>>({}); //

    // Profile Edit State
    const [isEditingProfile, setIsEditingProfile] = useState(false); //
    const [profileData, setProfileData] = useState<ProfileData>({ //
        firstName: '', lastName: '', email: '', phone: '' //
    });

    // Settings state (local mock - Simplified)
    const [userSettings, setUserSettings] = useState<UserSettings>({ //
        language: 'en', currency: 'INR' //
     });

    // --- Data Fetching (Orders, Addresses) ---
    // --- CORRECTED fetchOrders mapping ---
    const fetchOrders = useCallback(async () => {
        if (!user) return;
        setIsLoadingOrders(true);
        setErrorOrders(null);
        try {
            const response = await api.get('/orders/myorders'); // Fetches OrderFromMyOrdersAPI[]
            const ordersData = response.data.map((order: OrderFromMyOrdersAPI): Order => {
                // Map items correctly using ...AtOrder fields
                const mappedItems: CartItem[] = (order.items || []).map(item => {
                    // Use details stored at order time
                    const productName = item.nameAtOrder || 'Unknown Product';
                    const productPrice = item.priceAtOrder || 0;
                    const productImage = item.imageAtOrder || '/placeholder.png';
                    const productId = typeof item.product === 'string' ? item.product : 'unknown'; // Product ID is a string here

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
                            stock: 1, // Stock isn't relevant for a placed order item display
                            features: [],
                            specifications: {},
                            tags: []
                        }
                    };
                });

                // Handle populated vs non-populated userId
                const userIdString = typeof order.userId === 'string' ? order.userId : order.userId._id;
                 const userDetails = typeof order.userId === 'object' ? order.userId : null; // Get user details if populated

                // Construct the final Order object for frontend
                return {
                    ...order,
                    id: order._id, // Map _id to id
                    items: mappedItems, // Use the correctly mapped items
                    userId: userIdString,
                     // Use populated user details for shipping/customer info if available
                    shippingAddress: {
                        ...order.shippingAddress,
                        firstName: order.shippingAddress.firstName || userDetails?.firstName || '',
                        // Add lastName, email if populated and needed
                    },
                    // Ensure enums are correctly typed
                    status: order.status as Order['status'],
                    paymentMethod: order.paymentMethod as Order['paymentMethod'],
                    paymentStatus: order.paymentStatus as Order['paymentStatus'],
                };
            });
            setUserOrders(ordersData);
        } catch (err: any) {
            setErrorOrders(err.response?.data?.message || err.message || 'Failed to load orders.');
        } finally {
            setIsLoadingOrders(false);
        }
    }, [user]);
    // --- End CORRECTED fetchOrders mapping ---

    const fetchAddresses = useCallback(async () => { /* ... Keep exact fetch logic ... */ //
        if (!user) return; setIsLoadingAddresses(true); setErrorAddresses(null); //
        try { const response = await api.get('/users/addresses'); const addressesData = response.data.map((addr: Address): Address => ({ ...addr, id: addr._id })); setUserAddresses(addressesData); } catch (err: any) { setErrorAddresses(err.response?.data?.message || err.message || 'Failed load.'); } finally { setIsLoadingAddresses(false); } //
    }, [user]); //
    useEffect(() => { /* ... Keep exact useEffect logic ... */ //
        if (user) { fetchOrders(); fetchAddresses(); setProfileData({ firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone }); } //
        else { setIsLoadingOrders(false); setIsLoadingAddresses(false); setUserOrders([]); setUserAddresses([]); } //
    }, [user, fetchOrders, fetchAddresses]); //

    // --- Profile Management ---
    const handleProfileUpdate = async () => { /* ... Keep exact logic ... */ //
        if (!user) return; setProfileError(null); setIsSavingProfile(true); try { const result = await updateAuthProfile(profileData); if (result.success) { setIsEditingProfile(false); alert('Profile updated!'); } else { setProfileError(result.error || 'Update failed'); alert(`Update failed: ${result.error}`); } } catch (error: any) { const msg = error.response?.data?.message || error.message || 'Error occurred'; setProfileError(msg); alert(`Update failed: ${msg}`); } finally { setIsSavingProfile(false); } //
    };
    const handleProfileCancel = () => { /* ... Keep exact logic ... */ //
        setProfileData({ firstName: user?.firstName || '', lastName: user?.lastName || '', email: user?.email || '', phone: user?.phone || '' }); setIsEditingProfile(false); setProfileError(null); //
    };

    // --- Address Management ---
    const handleAddAddress = () => { /* ... Keep exact logic ... */ //
        setSelectedAddress(null); setAddressFormData({ label: '', name: `${user?.firstName} ${user?.lastName}` || '', street: '', city: '', state: '', pincode: '', phone: user?.phone || '', isDefault: userAddresses.length === 0 }); setAddressError(null); setIsAddressFormOpen(true); //
    };
    const handleEditAddress = (address: Address) => { /* ... Keep exact logic ... */ //
        setSelectedAddress(address); setAddressFormData({ ...address }); setAddressError(null); setIsAddressFormOpen(true); //
    };
    const handleSaveAddress = async () => { /* ... Keep exact logic ... */ //
        setAddressError(null); if (!addressFormData.label?.trim() || !addressFormData.name?.trim() || !addressFormData.street?.trim() || !addressFormData.city?.trim() || !addressFormData.state?.trim() || !addressFormData.pincode?.trim() || !addressFormData.phone?.trim()) { setAddressError('Required fields (*).'); return; } if (!validatePincode(addressFormData.pincode)) { setAddressError('Invalid Pincode.'); return; } if (!validatePhone(addressFormData.phone)) { setAddressError('Invalid Phone.'); return; } setIsSavingAddress(true); const { id, ...dataToSend } = addressFormData; try { if (selectedAddress) { await api.put(`/users/addresses/${selectedAddress._id}`, dataToSend); } else { await api.post('/users/addresses', dataToSend); } setIsAddressFormOpen(false); setSelectedAddress(null); setAddressFormData({}); fetchAddresses(); } catch (err: any) { setAddressError(err.response?.data?.message || err.message || 'Save failed.'); } finally { setIsSavingAddress(false); } //
    };
    const handleDeleteAddress = async (addressId: string | undefined) => { /* ... Keep exact logic ... */ //
        if (!addressId) return; const addressToDelete = userAddresses.find(addr => addr._id === addressId); if (!addressToDelete) return; if (window.confirm(`Delete "${addressToDelete.label}" address?`)) { setIsLoadingAddresses(true); try { await api.delete(`/users/addresses/${addressId}`); fetchAddresses(); alert('Deleted.'); } catch (err: any) { setErrorAddresses(err.response?.data?.message || err.message || 'Delete failed.'); fetchAddresses(); } } //
    };
    const handleSetDefaultAddress = async (addressId: string | undefined) => { /* ... Keep exact logic ... */ //
        if (!addressId) return; setIsLoadingAddresses(true); try { await api.put(`/users/addresses/${addressId}/default`); fetchAddresses(); } catch (err: any) { setErrorAddresses(err.response?.data?.message || err.message || 'Set default failed.'); fetchAddresses(); } //
    };

    // --- Wishlist / Settings / Color functions ---

    // UPDATE handleRemoveFromWishlist to be async and handle errors
    const handleRemoveFromWishlist = async (productId: string) => { // Use productId
        const success = await removeFromWishlist(productId); //
        if (!success) {
            alert('Failed to remove item from wishlist. Please try again.');
            // Optionally show error from context: alert(`Failed: ${errorWishlist}`);
        } else {
             alert('Item removed from wishlist.');
        }
    };

    // UPDATE handleMoveToCart to be async and handle errors
    const handleMoveToCart = async (item: WishlistItem) => { // Takes WishlistItem
        try {
            // Ensure product exists before adding to cart
            if (!item.product) { //
                alert('Product details not found.');
                return;
            }
            addToCart(item.product); // Add to cart first (local operation)
            const success = await removeFromWishlist(item.product.id); // Then remove from wishlist (API call)
            if (success) {
                 alert(`${item.product.name} moved to cart!`); //
            } else {
                 alert(`Failed to remove ${item.product.name} from wishlist after adding to cart. Please remove manually.`); //
                // You might want to remove it from the cart again here if the wishlist removal failed critically
                // removeFromCart(item.product.id); // Assuming removeFromCart exists in CartContext
            }
        } catch(cartError) {
            alert('Failed to move item to cart.');
            console.error("Cart error:", cartError);
        }
    };

    // handleToggleSetting removed as toggles are gone
    const handleUpdateSetting = (setting: keyof UserSettings, value: any) => { //
        // Here you would ideally persist this setting (e.g., in localStorage or backend)
        console.log(`Setting ${setting} updated to:`, value); // Placeholder log
        setUserSettings(p => ({ ...p, [setting]: value })); //
        // Example for localStorage:
        // localStorage.setItem('userPrefs', JSON.stringify({ ...userSettings, [setting]: value }));
        // Add API call here if storing preferences on the backend
    };
    const getStatusColor = (status: string) => { /* ... same switch statement ... */ //
        switch(status){case'pending':case'confirmed':return'text-blue-600 bg-blue-50';case'processing':return'text-yellow-600 bg-yellow-50';case'shipped':return'text-orange-600 bg-orange-50';case'delivered':return'text-green-600 bg-green-50';case'cancelled':return'text-red-600 bg-red-50';default:return'text-gray-600 bg-gray-50';} //
    };

    // --- RENDER LOGIC ---
    // (Rest of the component's return statement remains exactly the same
    // as you provided, including JSX for tabs, forms, modals etc.)
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header /> {/* */}
            <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
                 {!user && !isLoadingOrders && !isLoadingAddresses && ( /* ... Login prompt ... */ //
                      <div className="text-center py-16"> <h2 className="text-xl font-semibold mb-4">Please log in</h2> <p className="text-gray-600 mb-6">Log in to view your dashboard.</p> <Link to="/login" className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700">Login</Link> </div> //
                 )}
                 {user && ( //
                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                             <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24"> {/* ... Sidebar JSX ... */} {/* */}
                                <div className="flex items-center space-x-3 mb-6"> <div className="bg-red-100 p-3 rounded-full"> <FaUser className="text-red-600 text-xl" /> </div> <div> <h2 className="font-semibold text-gray-900"> {user?.firstName} {user?.lastName} </h2> <p className="text-sm text-gray-500">{user?.email}</p> </div> </div> {/* */}
                                <nav className="space-y-2"> {/* */}
                                    {[ { id: 'orders', icon: FaShoppingBag, label: 'My Orders' }, { id: 'profile', icon: FaUser, label: 'Profile' }, { id: 'addresses', icon: FaMapMarkerAlt, label: 'Addresses' }, { id: 'wishlist', icon: FaHeart, label: 'Wishlist' }, { id: 'settings', icon: FaCog, label: 'Settings' } ].map((item) => { const Icon = item.icon; return ( <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${ activeTab === item.id ? 'bg-red-50 text-red-700 border-r-2 border-red-600' : 'text-gray-700 hover:bg-gray-100' }`}> <Icon className="text-lg" /> <span>{item.label}</span> </button> ); })} {/* */}
                                    <button onClick={logout} className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg text-red-600 hover:bg-red-50 transition-colors"> <FaSignOutAlt className="text-lg" /> <span>Sign Out</span> </button> {/* */}
                                </nav>
                            </div>
                        </div>
                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            {/* Orders Tab */}
                            {activeTab === 'orders' && ( /* ... Orders Tab JSX ... */ <div className="bg-white rounded-lg shadow-sm"> <div className="p-6 border-b"> <h2 className="text-xl font-semibold text-gray-900">My Orders</h2> </div> {isLoadingOrders ? ( <div className="p-6 text-center"><LoadingSpinner text="Loading orders..."/></div> ) : errorOrders ? ( <div className="p-6 text-center text-red-600">{errorOrders}</div> ) : userOrders.length === 0 ? ( <div className="p-6 text-center"> <FaShoppingBag className="text-4xl text-gray-400 mx-auto mb-4" /> <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3> <p className="text-gray-600 mb-6">Start shopping to see your orders here</p> <Link to="/shop" className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"> Start Shopping </Link> </div> ) : ( <div className="p-6"> <div className="space-y-4"> {userOrders.map((order) => ( <div key={order.id} className="border border-gray-200 rounded-lg p-4"> <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3"> <div> <h3 className="font-semibold text-gray-900">Order #{order.id.substring(0,8)}...</h3> <p className="text-sm text-gray-500"> Placed on {new Date(order.createdAt).toLocaleDateString()} </p> </div> <div className="flex items-center space-x-3 mt-2 md:mt-0"> <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(order.status)}`}> {order.status} </span> <span className="font-semibold text-gray-900"> {formatPriceSimple(order.total)} </span> </div> </div> <div className="flex items-center space-x-4 mb-3"> {order.items.slice(0, 3).map((item, index) => ( <img key={index} src={item.product.images[0]} alt={item.product.name} className="w-12 h-12 object-cover rounded-lg"/> ))} {order.items.length > 3 && ( <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-medium text-gray-600"> +{order.items.length - 3} </div> )} </div> <div className="flex flex-col sm:flex-row gap-3"> <Link to={`/orders/${order.id}`} className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg text-center font-medium hover:bg-red-700 transition-colors"> Track Order </Link> {order.status === 'delivered' && ( <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"> Reorder </button> )} </div> </div> ))} </div> </div> )} </div> )} {/* */}
                            {/* Profile Tab */}
                            {activeTab === 'profile' && ( /* ... Profile Tab JSX ... */ <div className="bg-white rounded-lg shadow-sm p-6"> {profileError && (<div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">{profileError}</div>)} <div className="flex items-center justify-between mb-6"> <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2> {!isEditingProfile ? ( <button onClick={() => setIsEditingProfile(true)} className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"> <FaEdit /> <span>Edit Profile</span> </button> ) : ( <div className="flex space-x-3"> <button onClick={handleProfileCancel} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"> Cancel </button> <button onClick={handleProfileUpdate} disabled={isSavingProfile} className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"> {isSavingProfile ? <LoadingSpinner size="sm"/> : <FaSave />} <span>{isSavingProfile ? 'Saving...' : 'Save Changes'}</span> </button> </div> )} </div> <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> <div> <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label> <input type="text" value={profileData.firstName} onChange={(e) => setProfileData(p => ({ ...p, firstName: e.target.value }))} disabled={!isEditingProfile} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-50 disabled:text-gray-500"/> </div> <div> <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label> <input type="text" value={profileData.lastName} onChange={(e) => setProfileData(p => ({ ...p, lastName: e.target.value }))} disabled={!isEditingProfile} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-50 disabled:text-gray-500"/> </div> <div> <label className="block text-sm font-medium text-gray-700 mb-1">Email</label> <input type="email" value={profileData.email} onChange={(e) => setProfileData(p => ({ ...p, email: e.target.value }))} disabled={!isEditingProfile} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-50 disabled:text-gray-500"/> </div> <div> <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label> <input type="tel" value={profileData.phone} onChange={(e) => setProfileData(p => ({ ...p, phone: e.target.value }))} disabled={!isEditingProfile} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-50 disabled:text-gray-500"/> </div> </div> </div> )} {/* */}
                            {/* Addresses Tab */}
                            {activeTab === 'addresses' && ( /* ... Addresses Tab JSX ... */ <div className="bg-white rounded-lg shadow-sm"> <div className="p-6 border-b border-gray-200"> <div className="flex flex-col md:flex-row md:items-center md:justify-between"> <h2 className="text-xl font-semibold text-gray-900">Saved Addresses</h2> <button onClick={handleAddAddress} className="mt-4 md:mt-0 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center space-x-2"> <FaPlus /> <span>Add New Address</span> </button> </div> </div> {isLoadingAddresses ? ( <div className="p-6 text-center"><LoadingSpinner text="Loading addresses..."/></div> ) : errorAddresses ? ( <div className="p-6 text-center text-red-600">{errorAddresses}</div> ) : userAddresses.length === 0 ? ( <div className="p-6 text-center"> <FaMapMarkerAlt className="text-4xl text-gray-400 mx-auto mb-4" /> <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3> <p className="text-gray-600 mb-6">Add your first address</p> <button onClick={handleAddAddress} className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"> Add Address </button> </div> ) : ( <div className="p-6"> <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {userAddresses.map((address) => ( <div key={address._id || address.id} className="border border-gray-200 rounded-lg p-4 relative"> {address.isDefault && ( <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded"> Default </span> )} <div className="mb-3"> <h4 className="font-semibold text-gray-900">{address.label}</h4> <p className="text-sm text-gray-600">{address.name}</p> </div> <div className="text-sm text-gray-700 mb-4"> <p>{address.street}</p> <p>{address.city}, {address.state} {address.pincode}</p> <p className="mt-1"> <span className="font-medium">Phone:</span> {address.phone} </p> </div> <div className="flex items-center space-x-3"> <button onClick={() => handleEditAddress(address)} className="text-blue-600 hover:text-blue-800 text-sm font-medium"> Edit </button> {!address.isDefault && ( <button onClick={() => handleSetDefaultAddress(address._id)} className="text-green-600 hover:text-green-800 text-sm font-medium"> Set Default </button> )} <button onClick={() => handleDeleteAddress(address._id)} className="text-red-600 hover:text-red-800 text-sm font-medium"> Delete </button> </div> </div> ))} </div> </div> )} </div> )} {/* */}

                            {/* Wishlist Tab - ADD Loading and Error Handling */}
                            {activeTab === 'wishlist' && ( //
                                <div className="bg-white rounded-lg shadow-sm">
                                    <div className="p-6 border-b border-gray-200"> {/* */}
                                        <h2 className="text-xl font-semibold text-gray-900">My Wishlist</h2> {/* */}
                                        <p className="text-gray-600 mt-1">Save products for later</p> {/* */}
                                    </div>
                                    {isLoadingWishlist ? ( // Check loading state
                                        <div className="p-6 text-center">
                                            <LoadingSpinner text="Loading wishlist..." /> {/* */}
                                        </div>
                                    ) : errorWishlist ? ( // Check error state
                                        <div className="p-6 text-center text-red-600">
                                            {errorWishlist} {/* */}
                                        </div>
                                    ) : wishlistItems.length === 0 ? ( //
                                        // Empty state remains the same
                                        <div className="p-6 text-center"> <FaHeart className="text-4xl text-gray-400 mx-auto mb-4" /> <h3 className="text-lg font-medium text-gray-900 mb-2">Wishlist is empty</h3> <p className="text-gray-600 mb-6">Add products you love</p> <Link to="/shop" className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"> Browse Products </Link> </div> //
                                    ) : (
                                        // Wishlist items grid remains the same, but ensure functions are called correctly
                                        <div className="p-6"> {/* */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* */}
                                                {wishlistItems.map((item) => ( // item is WishlistItem //
                                                    <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md"> {/* */}
                                                        <div className="relative"> {/* */}
                                                            <img src={item.product.images[0]} alt={item.product.name} className="w-full h-48 object-cover"/> {/* */}
                                                            {/* Use product ID for remove button */}
                                                            <button onClick={() => handleRemoveFromWishlist(item.product.id)} className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"> {/* */}
                                                                <FaTimes className="text-red-500" /> {/* */}
                                                            </button>
                                                        </div>
                                                        <div className="p-4"> {/* */}
                                                            {/* ... (product details display remains the same) ... */}
                                                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.product.name}</h3> {/* */}
                                                            <div className="flex items-center space-x-2 mb-3"> <span className="text-lg font-bold text-red-600">{formatPriceSimple(item.product.price)}</span> {item.product.mrp > item.product.price && <span className="text-sm text-gray-500 line-through">{formatPriceSimple(item.product.mrp)}</span>} </div> {/* */}
                                                            <div className="flex items-center justify-between mb-4"> <div className="flex items-center space-x-1"> <div className="flex text-yellow-400"> {[...Array(5)].map((_, i)=>(<span key={i} className={i<Math.floor(item.product.rating)?'':'opacity-30'}>⭐</span>))} </div> <span className="text-sm text-gray-600">({item.product.reviewCount})</span> </div> <span className={`text-xs px-2 py-1 rounded ${item.product.stock>0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{item.product.stock > 0 ? 'In Stock' : 'Out'}</span> </div> {/* */}
                                                            {/* ... (price, rating, stock display) ... */}
                                                            <div className="flex space-x-2"> {/* */}
                                                                {/* Pass the correct item object to handleMoveToCart */}
                                                                <button onClick={() => handleMoveToCart(item)} disabled={item.product.stock === 0} className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"> Move to Cart </button> {/* */}
                                                                <Link to={`/product/${item.product.id}`} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"> View </Link> {/* */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* --- Settings Tab - SIMPLIFIED --- */}
                            {activeTab === 'settings' && ( //
                              <div className="space-y-6"> {/* */}
                                {/* Preferences */}
                                <div className="bg-white rounded-lg shadow-sm p-6"> {/* */}
                                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3> {/* */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* */}
                                    {/* Language Select */}
                                    <div> {/* */}
                                      <label htmlFor="pref-language" className="block text-sm font-medium text-gray-700 mb-2"> Language </label> {/* */}
                                      <select
                                        id="pref-language" //
                                        value={userSettings.language} //
                                        onChange={(e) => handleUpdateSetting('language', e.target.value)} //
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white" //
                                      >
                                        <option value="en">English</option> {/* */}
                                        <option value="hi">Hindi</option> {/* */}
                                        <option value="ta">Tamil</option> {/* */}
                                        <option value="te">Telugu</option> {/* */}
                                      </select>
                                    </div>
                                    {/* Currency Select */}
                                    <div> {/* */}
                                      <label htmlFor="pref-currency" className="block text-sm font-medium text-gray-700 mb-2"> Currency </label> {/* */}
                                      <select
                                        id="pref-currency" //
                                        value={userSettings.currency} //
                                        onChange={(e) => handleUpdateSetting('currency', e.target.value)} //
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white" //
                                      >
                                        <option value="INR">Indian Rupee (₹)</option> {/* */}
                                        <option value="USD">US Dollar ($)</option> {/* */}
                                      </select>
                                    </div>
                                  </div>
                                </div>
                                {/* Add a save button if these preferences need to be persisted */}
                                {/* <div className="flex justify-end">
                                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Save Preferences</button>
                                </div> */}
                              </div>
                            )}
                        </div>
                    </div>
                 )}
            </main>

            {/* Address Form Modal */}
            {isAddressFormOpen && ( /* ... Address Modal JSX ... */ //
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"> <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"> <div className="p-6"> <div className="flex items-center justify-between mb-4"> <h3 className="text-lg font-semibold text-gray-900"> {selectedAddress ? 'Edit' : 'Add New'} Address </h3> <button onClick={() => setIsAddressFormOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"> <FaTimes className="text-gray-500" /> </button> </div> {addressError && (<div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">{addressError}</div>)} <div className="space-y-4"> <div> <label className="block text-sm font-medium text-gray-700 mb-1">Label *</label> <input type="text" value={addressFormData.label || ''} onChange={(e)=>setAddressFormData(p=>({...p, label:e.target.value}))} placeholder="Home, Office..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"/> </div> <div> <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label> <input type="text" value={addressFormData.name || ''} onChange={(e)=>setAddressFormData(p=>({...p, name:e.target.value}))} placeholder="Recipient" className="w-full px-3 py-2 border border-gray-300 rounded-lg"/> </div> <div> <label className="block text-sm font-medium text-gray-700 mb-1">Street *</label> <textarea value={addressFormData.street || ''} onChange={(e)=>setAddressFormData(p=>({...p, street:e.target.value}))} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg"/> </div> <div className="grid grid-cols-2 gap-4"> <div> <label className="block text-sm font-medium text-gray-700 mb-1">City *</label> <input type="text" value={addressFormData.city || ''} onChange={(e)=>setAddressFormData(p=>({...p, city:e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg"/> </div> <div> <label className="block text-sm font-medium text-gray-700 mb-1">State *</label> <input type="text" value={addressFormData.state || ''} onChange={(e)=>setAddressFormData(p=>({...p, state:e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg"/> </div> </div> <div className="grid grid-cols-2 gap-4"> <div> <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label> <input type="text" value={addressFormData.pincode || ''} onChange={(e)=>setAddressFormData(p=>({...p, pincode:e.target.value}))} maxLength={6} className="w-full px-3 py-2 border border-gray-300 rounded-lg"/> </div> <div> <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label> <input type="tel" value={addressFormData.phone || ''} onChange={(e)=>setAddressFormData(p=>({...p, phone:e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-lg"/> </div> </div> <div className="flex items-center"> <input type="checkbox" checked={addressFormData.isDefault || false} onChange={(e)=>setAddressFormData(p=>({...p, isDefault:e.target.checked}))} className="h-4 w-4 text-red-600 border-gray-300 rounded"/> <label className="ml-2 block text-sm"> Default </label> </div> </div> <div className="flex items-center justify-end space-x-4 pt-4 border-t mt-4"> <button onClick={() => setIsAddressFormOpen(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"> Cancel </button> <button onClick={handleSaveAddress} disabled={isSavingAddress} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"> {isSavingAddress?<LoadingSpinner size="sm"/>:<FaSave/>} {isSavingAddress?'Saving...':(selectedAddress?'Update':'Add')} </button> </div> </div> </div> </div> //
            )}

            <Footer /> {/* */}
            {/* Removed the <style> block with helper classes */}
        </div>
    );
};

export default UserDashboard;