import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUser, FaShoppingBag, FaMapMarkerAlt, FaHeart, FaCog, FaSignOutAlt,
  FaPlus, FaTimes, FaEdit, FaSave, FaBox
} from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { Order, Product, CartItem } from '../data/types';
import { formatPriceSimple } from '../utils/formatPrice';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import type { WishlistItem } from '../context/WishlistContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { validatePincode, validatePhone } from '../utils/validation';

// Interfaces
interface Address {
  _id?: string;
  id?: string;
  label: string;
  name: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

interface UserSettings {
  language: string;
  currency: string;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface OrderItemFromMyOrdersAPI {
    product: string;
    quantity: number;
    _id?: string;
    priceAtOrder: number;
    nameAtOrder: string;
    imageAtOrder?: string;
}

interface OrderFromMyOrdersAPI extends Omit<Order, 'id' | 'items' | 'userId'> {
    _id: string;
    userId: string | { _id: string; firstName?: string };
    items: OrderItemFromMyOrdersAPI[];
}

const UserDashboard: React.FC = () => {
    const { user, logout, updateProfile: updateAuthProfile } = useAuth();
    const [activeTab, setActiveTab] = useState('orders');
    const { addToCart } = useCart();
    const { wishlistItems, removeFromWishlist, isLoading: isLoadingWishlist, error: errorWishlist } = useWishlist();

    const [userOrders, setUserOrders] = useState<Order[]>([]);
    const [userAddresses, setUserAddresses] = useState<Address[]>([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(true);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
    const [errorOrders, setErrorOrders] = useState<string | null>(null);
    const [errorAddresses, setErrorAddresses] = useState<string | null>(null);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingAddress, setIsSavingAddress] = useState(false);
    const [profileError, setProfileError] = useState<string | null>(null);
    const [addressError, setAddressError] = useState<string | null>(null);

    const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [addressFormData, setAddressFormData] = useState<Partial<Address>>({});

    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileData, setProfileData] = useState<ProfileData>({
        firstName: '', lastName: '', email: '', phone: ''
    });

    const [userSettings, setUserSettings] = useState<UserSettings>({
        language: 'en', currency: 'INR'
    });

    // Fetch Orders
    const fetchOrders = useCallback(async () => {
        if (!user) return;
        setIsLoadingOrders(true);
        setErrorOrders(null);
        try {
            const response = await api.get('/orders/myorders');
            const ordersData = response.data.map((order: OrderFromMyOrdersAPI): Order => {
                const mappedItems: CartItem[] = (order.items || []).map(item => {
                    const productName = item.nameAtOrder || 'Unknown Product';
                    const productPrice = item.priceAtOrder || 0;
                    const productImage = item.imageAtOrder || '/placeholder.png';
                    const productId = typeof item.product === 'string' ? item.product : 'unknown';

                    return {
                        quantity: item.quantity,
                        product: {
                            id: productId,
                            name: productName,
                            price: productPrice,
                            images: [productImage],
                            categoryId: '',
                            description: '',
                            shortDescription: '',
                            mrp: productPrice,
                            rating: 0,
                            reviewCount: 0,
                            soundLevel: 'Low',
                            burnTime: '',
                            stock: 1,
                            features: [],
                            specifications: {},
                            tags: []
                        }
                    };
                });

                const userIdString = typeof order.userId === 'string' ? order.userId : order.userId._id;
                const userDetails = typeof order.userId === 'object' ? order.userId : null;

                return {
                    ...order,
                    id: order._id,
                    items: mappedItems,
                    userId: userIdString,
                    shippingAddress: {
                        ...order.shippingAddress,
                        firstName: order.shippingAddress.firstName || userDetails?.firstName || '',
                    },
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

    // Fetch Addresses
    const fetchAddresses = useCallback(async () => {
        if (!user) return;
        setIsLoadingAddresses(true);
        setErrorAddresses(null);
        try {
            const response = await api.get('/users/addresses');
            const addressesData = response.data.map((addr: Address): Address => ({ ...addr, id: addr._id }));
            setUserAddresses(addressesData);
        } catch (err: any) {
            setErrorAddresses(err.response?.data?.message || err.message || 'Failed to load addresses.');
        } finally {
            setIsLoadingAddresses(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchOrders();
            fetchAddresses();
            setProfileData({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone
            });
        } else {
            setIsLoadingOrders(false);
            setIsLoadingAddresses(false);
            setUserOrders([]);
            setUserAddresses([]);
        }
    }, [user, fetchOrders, fetchAddresses]);

    // Profile handlers
    const handleProfileUpdate = async () => {
        if (!user) return;
        setProfileError(null);
        setIsSavingProfile(true);
        try {
            const result = await updateAuthProfile(profileData);
            if (result.success) {
                setIsEditingProfile(false);
                alert('Profile updated successfully!');
            } else {
                setProfileError(result.error || 'Update failed');
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || error.message || 'Error occurred';
            setProfileError(msg);
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleProfileCancel = () => {
        setProfileData({
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
            phone: user?.phone || ''
        });
        setIsEditingProfile(false);
        setProfileError(null);
    };

    // Address handlers
    const handleAddAddress = () => {
        setSelectedAddress(null);
        setAddressFormData({
            label: '',
            name: `${user?.firstName} ${user?.lastName}` || '',
            street: '',
            city: '',
            state: '',
            pincode: '',
            phone: user?.phone || '',
            isDefault: userAddresses.length === 0
        });
        setAddressError(null);
        setIsAddressFormOpen(true);
    };

    const handleEditAddress = (address: Address) => {
        setSelectedAddress(address);
        setAddressFormData({ ...address });
        setAddressError(null);
        setIsAddressFormOpen(true);
    };

    const handleSaveAddress = async () => {
        setAddressError(null);
        if (!addressFormData.label?.trim() || !addressFormData.name?.trim() || !addressFormData.street?.trim() ||
            !addressFormData.city?.trim() || !addressFormData.state?.trim() || !addressFormData.pincode?.trim() ||
            !addressFormData.phone?.trim()) {
            setAddressError('All fields are required.');
            return;
        }
        if (!validatePincode(addressFormData.pincode)) {
            setAddressError('Invalid Pincode.');
            return;
        }
        if (!validatePhone(addressFormData.phone)) {
            setAddressError('Invalid Phone number.');
            return;
        }
        setIsSavingAddress(true);
        const { id, ...dataToSend } = addressFormData;
        try {
            if (selectedAddress) {
                await api.put(`/users/addresses/${selectedAddress._id}`, dataToSend);
            } else {
                await api.post('/users/addresses', dataToSend);
            }
            setIsAddressFormOpen(false);
            setSelectedAddress(null);
            setAddressFormData({});
            fetchAddresses();
        } catch (err: any) {
            setAddressError(err.response?.data?.message || err.message || 'Failed to save address.');
        } finally {
            setIsSavingAddress(false);
        }
    };

    const handleDeleteAddress = async (addressId: string | undefined) => {
        if (!addressId) return;
        const addressToDelete = userAddresses.find(addr => addr._id === addressId);
        if (!addressToDelete) return;
        if (window.confirm(`Delete "${addressToDelete.label}" address?`)) {
            try {
                await api.delete(`/users/addresses/${addressId}`);
                fetchAddresses();
            } catch (err: any) {
                setErrorAddresses(err.response?.data?.message || err.message || 'Failed to delete address.');
            }
        }
    };

    const handleSetDefaultAddress = async (addressId: string | undefined) => {
        if (!addressId) return;
        try {
            await api.put(`/users/addresses/${addressId}/default`);
            fetchAddresses();
        } catch (err: any) {
            setErrorAddresses(err.response?.data?.message || err.message || 'Failed to set default address.');
        }
    };

    // Wishlist handlers
    const handleRemoveFromWishlist = async (productId: string) => {
        const success = await removeFromWishlist(productId);
        if (!success) {
            alert('Failed to remove item from wishlist.');
        }
    };

    const handleMoveToCart = async (item: WishlistItem) => {
        try {
            if (!item.product) {
                alert('Product details not found.');
                return;
            }
            addToCart(item.product);
            const success = await removeFromWishlist(item.product.id);
            if (success) {
                alert(`${item.product.name} moved to cart!`);
            }
        } catch(error) {
            alert('Failed to move item to cart.');
            console.error("Cart error:", error);
        }
    };

    // Settings handler
    const handleUpdateSetting = (setting: keyof UserSettings, value: any) => {
        setUserSettings(p => ({ ...p, [setting]: value }));
    };

    // Status color helper
    const getStatusColor = (status: string) => {
        switch(status) {
            case 'pending':
            case 'confirmed':
                return 'text-blue-400 bg-blue-500/10';
            case 'processing':
                return 'text-yellow-400 bg-yellow-500/10';
            case 'shipped':
                return 'text-orange-400 bg-orange-500/10';
            case 'delivered':
                return 'text-green-400 bg-green-500/10';
            case 'cancelled':
                return 'text-red-400 bg-red-500/10';
            default:
                return 'text-surface-400 bg-white/[0.05]';
        }
    };

    const tabs = [
        { id: 'orders', icon: FaShoppingBag, label: 'My Orders' },
        { id: 'profile', icon: FaUser, label: 'Profile' },
        { id: 'addresses', icon: FaMapMarkerAlt, label: 'Addresses' },
        { id: 'wishlist', icon: FaHeart, label: 'Wishlist' },
        { id: 'settings', icon: FaCog, label: 'Settings' }
    ];

    return (
        <div className="min-h-screen bg-surface-900 flex flex-col">
            <Header />
            <main className="flex-1 max-w-7xl mx-auto px-6 pt-28 pb-20 w-full">
                {!user && !isLoadingOrders && !isLoadingAddresses && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-24"
                    >
                        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                            <FaUser className="text-4xl text-surface-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3">Please log in</h2>
                        <p className="text-surface-400 mb-8">Log in to view your dashboard</p>
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-accent text-white text-sm font-semibold hover:shadow-[0_0_30px_rgba(230,57,70,0.25)] transition-all duration-300"
                        >
                            Login
                        </Link>
                    </motion.div>
                )}

                {user && (
                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="sticky top-28 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
                            >
                                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/[0.06]">
                                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                                        <FaUser className="text-accent text-xl" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h2 className="font-semibold text-white truncate">
                                            {user.firstName} {user.lastName}
                                        </h2>
                                        <p className="text-xs text-surface-400 truncate">{user.email}</p>
                                    </div>
                                </div>

                                <nav className="space-y-1">
                                    {tabs.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => setActiveTab(item.id)}
                                                className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl transition-all duration-300 ${
                                                    activeTab === item.id
                                                        ? 'bg-accent text-white shadow-[0_0_20px_rgba(230,57,70,0.2)]'
                                                        : 'text-surface-300 hover:bg-white/[0.05] hover:text-white'
                                                }`}
                                            >
                                                <Icon className="text-lg flex-shrink-0" />
                                                <span className="text-sm font-medium">{item.label}</span>
                                            </button>
                                        );
                                    })}

                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-300 mt-4 pt-4 border-t border-white/[0.06]"
                                    >
                                        <FaSignOutAlt className="text-lg flex-shrink-0" />
                                        <span className="text-sm font-medium">Sign Out</span>
                                    </button>
                                </nav>
                            </motion.div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {/* Orders Tab */}
                                    {activeTab === 'orders' && (
                                        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                                            <div className="p-6 border-b border-white/[0.06]">
                                                <h2 className="text-2xl font-bold text-white">My Orders</h2>
                                                <p className="text-surface-400 text-sm mt-1">Track and manage your orders</p>
                                            </div>

                                            {isLoadingOrders ? (
                                                <div className="p-12 text-center">
                                                    <LoadingSpinner text="Loading orders..." />
                                                </div>
                                            ) : errorOrders ? (
                                                <div className="p-6 text-center text-accent">{errorOrders}</div>
                                            ) : userOrders.length === 0 ? (
                                                <div className="p-12 text-center">
                                                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                                                        <FaShoppingBag className="text-4xl text-surface-600" />
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-white mb-2">No orders yet</h3>
                                                    <p className="text-surface-400 mb-8">Start shopping to see your orders here</p>
                                                    <Link
                                                        to="/shop"
                                                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-accent text-white text-sm font-semibold hover:shadow-[0_0_30px_rgba(230,57,70,0.25)] transition-all duration-300"
                                                    >
                                                        Start Shopping
                                                    </Link>
                                                </div>
                                            ) : (
                                                <div className="p-6 space-y-4">
                                                    {userOrders.map((order) => (
                                                        <motion.div
                                                            key={order.id}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="rounded-xl bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.12] transition-all duration-300 overflow-hidden"
                                                        >
                                                            {/* Compact Order Card */}
                                                            <div className="p-4">
                                                                {/* Header Row */}
                                                                <div className="flex items-center justify-between mb-3">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                                                                            <FaBox className="text-accent text-sm" />
                                                                        </div>
                                                                        <div>
                                                                            <h3 className="font-semibold text-white text-sm">
                                                                                Order #{order.id.substring(order.id.length - 8)}
                                                                            </h3>
                                                                            <p className="text-xs text-surface-400">
                                                                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                                                    month: 'short',
                                                                                    day: 'numeric',
                                                                                    year: 'numeric'
                                                                                })}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize ${getStatusColor(order.status)}`}>
                                                                            {order.status}
                                                                        </span>
                                                                        <span className="font-bold text-white text-sm">
                                                                            {formatPriceSimple(order.total)}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                {/* Product Preview */}
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    {order.items.slice(0, 1).map((item, idx) => (
                                                                        <div key={idx} className="relative">
                                                                            <img
                                                                                src={item.product.images[0]}
                                                                                alt={item.product.name}
                                                                                className="w-12 h-12 object-cover rounded-lg border border-white/[0.08]"
                                                                            />
                                                                            {item.quantity > 1 && (
                                                                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center text-[10px] font-bold text-white border border-surface-900">
                                                                                    {item.quantity}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-sm text-surface-300 truncate">
                                                                            {order.items[0]?.product.name}
                                                                        </p>
                                                                        {order.items.length > 1 && (
                                                                            <p className="text-xs text-surface-500">
                                                                                +{order.items.length - 1} more items
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Track Button */}
                                                                <Link
                                                                    to={`/orders/${order.id}`}
                                                                    className="block w-full text-center bg-accent hover:bg-accent/90 text-white py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200"
                                                                >
                                                                    Track Order
                                                                </Link>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Profile Tab */}
                                    {activeTab === 'profile' && (
                                        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6">
                                            {profileError && (
                                                <div className="mb-4 p-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-sm">
                                                    {profileError}
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between mb-8">
                                                <div>
                                                    <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                                                    <p className="text-surface-400 text-sm mt-1">Manage your account details</p>
                                                </div>
                                                {!isEditingProfile ? (
                                                    <button
                                                        onClick={() => setIsEditingProfile(true)}
                                                        className="flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-[0_0_20px_rgba(230,57,70,0.3)] transition-all"
                                                    >
                                                        <FaEdit />
                                                        <span>Edit</span>
                                                    </button>
                                                ) : (
                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={handleProfileCancel}
                                                            className="px-5 py-2.5 border border-white/[0.12] text-white rounded-xl text-sm font-semibold hover:bg-white/[0.05] transition-all"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={handleProfileUpdate}
                                                            disabled={isSavingProfile}
                                                            className="flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-[0_0_20px_rgba(230,57,70,0.3)] transition-all disabled:opacity-50"
                                                        >
                                                            {isSavingProfile ? <LoadingSpinner size="sm" /> : <FaSave />}
                                                            <span>{isSavingProfile ? 'Saving...' : 'Save'}</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {[
                                                    { label: 'First Name', key: 'firstName', type: 'text' },
                                                    { label: 'Last Name', key: 'lastName', type: 'text' },
                                                    { label: 'Email', key: 'email', type: 'email' },
                                                    { label: 'Phone', key: 'phone', type: 'tel' }
                                                ].map((field) => (
                                                    <div key={field.key}>
                                                        <label className="block text-sm font-medium text-surface-400 mb-2">
                                                            {field.label}
                                                        </label>
                                                        <input
                                                            type={field.type}
                                                            value={profileData[field.key as keyof ProfileData]}
                                                            onChange={(e) => setProfileData(p => ({ ...p, [field.key]: e.target.value }))}
                                                            disabled={!isEditingProfile}
                                                            className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Addresses, Wishlist, Settings tabs continue... */}
                                    {/* Due to length, I'll add these in the next part */}

                                    {activeTab === 'addresses' && (
                                        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                                            <div className="p-6 border-b border-white/[0.06]">
                                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                                    <div>
                                                        <h2 className="text-2xl font-bold text-white">Saved Addresses</h2>
                                                        <p className="text-surface-400 text-sm mt-1">Manage delivery addresses</p>
                                                    </div>
                                                    <button
                                                        onClick={handleAddAddress}
                                                        className="flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-[0_0_20px_rgba(230,57,70,0.3)] transition-all"
                                                    >
                                                        <FaPlus />
                                                        Add Address
                                                    </button>
                                                </div>
                                            </div>

                                            {isLoadingAddresses ? (
                                                <div className="p-12 text-center"><LoadingSpinner text="Loading..." /></div>
                                            ) : errorAddresses ? (
                                                <div className="p-6 text-center text-accent">{errorAddresses}</div>
                                            ) : userAddresses.length === 0 ? (
                                                <div className="p-12 text-center">
                                                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                                                        <FaMapMarkerAlt className="text-4xl text-surface-600" />
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-white mb-2">No addresses</h3>
                                                    <p className="text-surface-400 mb-8">Add your first address</p>
                                                    <button onClick={handleAddAddress} className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-accent text-white text-sm font-semibold hover:shadow-[0_0_30px_rgba(230,57,70,0.25)] transition-all">
                                                        Add Address
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {userAddresses.map((address) => (
                                                        <div key={address._id || address.id} className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all relative">
                                                            {address.isDefault && (
                                                                <span className="absolute top-3 right-3 bg-green-500/10 text-green-400 text-xs font-semibold px-3 py-1 rounded-full border border-green-500/20">
                                                                    Default
                                                                </span>
                                                            )}
                                                            <div className="mb-3">
                                                                <h4 className="font-semibold text-white">{address.label}</h4>
                                                                <p className="text-sm text-surface-400">{address.name}</p>
                                                            </div>
                                                            <div className="text-sm text-surface-300 mb-4 space-y-1">
                                                                <p>{address.street}</p>
                                                                <p>{address.city}, {address.state} {address.pincode}</p>
                                                                <p className="pt-2"><span className="font-medium text-surface-400">Phone:</span> {address.phone}</p>
                                                            </div>
                                                            <div className="flex items-center gap-3 text-sm">
                                                                <button onClick={() => handleEditAddress(address)} className="text-blue-400 hover:text-blue-300 font-medium">Edit</button>
                                                                {!address.isDefault && (
                                                                    <button onClick={() => handleSetDefaultAddress(address._id)} className="text-green-400 hover:text-green-300 font-medium">Set Default</button>
                                                                )}
                                                                <button onClick={() => handleDeleteAddress(address._id)} className="text-red-400 hover:text-red-300 font-medium">Delete</button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'wishlist' && (
                                        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                                            <div className="p-6 border-b border-white/[0.06]">
                                                <h2 className="text-2xl font-bold text-white">My Wishlist</h2>
                                                <p className="text-surface-400 text-sm mt-1">Save products for later</p>
                                            </div>

                                            {isLoadingWishlist ? (
                                                <div className="p-12 text-center"><LoadingSpinner text="Loading..." /></div>
                                            ) : errorWishlist ? (
                                                <div className="p-6 text-center text-accent">{errorWishlist}</div>
                                            ) : wishlistItems.length === 0 ? (
                                                <div className="p-12 text-center">
                                                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                                                        <FaHeart className="text-4xl text-surface-600" />
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-white mb-2">Wishlist is empty</h3>
                                                    <p className="text-surface-400 mb-8">Add products you love</p>
                                                    <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-accent text-white text-sm font-semibold hover:shadow-[0_0_30px_rgba(230,57,70,0.25)] transition-all">
                                                        Browse Products
                                                    </Link>
                                                </div>
                                            ) : (
                                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                                    {wishlistItems.map((item) => (
                                                        <div key={item.id} className="rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] overflow-hidden transition-all">
                                                            <div className="relative">
                                                                <img src={item.product.images[0]} alt={item.product.name} className="w-full h-48 object-cover" />
                                                                <button onClick={() => handleRemoveFromWishlist(item.product.id)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-900/80 backdrop-blur-sm flex items-center justify-center border border-white/[0.1] hover:bg-red-500/20 hover:border-red-500/30 transition-all">
                                                                    <FaTimes className="text-red-400" size={12} />
                                                                </button>
                                                            </div>
                                                            <div className="p-4">
                                                                <h3 className="font-semibold text-white mb-2 line-clamp-2">{item.product.name}</h3>
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <span className="text-lg font-bold text-accent">{formatPriceSimple(item.product.price)}</span>
                                                                    {item.product.mrp > item.product.price && (
                                                                        <span className="text-sm text-surface-500 line-through">{formatPriceSimple(item.product.mrp)}</span>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center justify-between mb-4">
                                                                    <div className="flex items-center gap-1">
                                                                        <div className="flex text-yellow-400 text-sm">
                                                                            {[...Array(5)].map((_, i) => (
                                                                                <span key={i} className={i < Math.floor(item.product.rating) ? '' : 'opacity-30'}>⭐</span>
                                                                            ))}
                                                                        </div>
                                                                        <span className="text-xs text-surface-400">({item.product.reviewCount})</span>
                                                                    </div>
                                                                    <span className={`text-xs px-2 py-1 rounded-full ${item.product.stock > 0 ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                                                        {item.product.stock > 0 ? 'In Stock' : 'Out'}
                                                                    </span>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <button onClick={() => handleMoveToCart(item)} disabled={item.product.stock === 0} className="flex-1 bg-accent text-white py-2.5 px-4 rounded-xl text-sm font-semibold hover:shadow-[0_0_20px_rgba(230,57,70,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                                                        Move to Cart
                                                                    </button>
                                                                    <Link to={`/product/${item.product.id}`} className="px-4 py-2.5 border border-white/[0.12] text-white rounded-xl text-sm font-semibold hover:bg-white/[0.05] transition-all">
                                                                        View
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'settings' && (
                                        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6">
                                            <h2 className="text-2xl font-bold text-white mb-6">Preferences</h2>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-surface-400 mb-2">Language</label>
                                                    <select value={userSettings.language} onChange={(e) => handleUpdateSetting('language', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all cursor-pointer">
                                                        <option value="en" className="bg-surface-800">English</option>
                                                        <option value="hi" className="bg-surface-800">Hindi</option>
                                                        <option value="ta" className="bg-surface-800">Tamil</option>
                                                        <option value="te" className="bg-surface-800">Telugu</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-surface-400 mb-2">Currency</label>
                                                    <select value={userSettings.currency} onChange={(e) => handleUpdateSetting('currency', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all cursor-pointer">
                                                        <option value="INR" className="bg-surface-800">Indian Rupee (₹)</option>
                                                        <option value="USD" className="bg-surface-800">US Dollar ($)</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </main>

            {/* Address Modal */}
            <AnimatePresence>
                {isAddressFormOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-surface-900 border border-white/[0.1] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        >
                            {/* Header */}
                            <div className="sticky top-0 bg-surface-900/95 backdrop-blur-sm border-b border-white/[0.08] px-6 py-4 flex items-center justify-between z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                                        <FaMapMarkerAlt className="text-accent text-sm" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{selectedAddress ? 'Edit' : 'Add New'} Address</h3>
                                        <p className="text-xs text-surface-400">Fill in the delivery details</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsAddressFormOpen(false)}
                                    className="w-9 h-9 rounded-lg hover:bg-white/[0.05] flex items-center justify-center transition-colors group"
                                >
                                    <FaTimes className="text-surface-400 group-hover:text-white transition-colors" />
                                </button>
                            </div>

                            <div className="p-6">
                                {addressError && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-5 p-3.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-sm flex items-center gap-3"
                                    >
                                        <span className="text-red-400">⚠</span>
                                        {addressError}
                                    </motion.div>
                                )}

                                <div className="space-y-5">
                                    {/* Label & Name Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-surface-400 mb-2 uppercase tracking-wider">
                                                Label <span className="text-accent">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={addressFormData.label || ''}
                                                onChange={(e) => setAddressFormData(p => ({ ...p, label: e.target.value }))}
                                                placeholder="e.g., Home, Office"
                                                className="w-full px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white placeholder:text-surface-500 focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-surface-400 mb-2 uppercase tracking-wider">
                                                Recipient Name <span className="text-accent">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={addressFormData.name || ''}
                                                onChange={(e) => setAddressFormData(p => ({ ...p, name: e.target.value }))}
                                                placeholder="Full name"
                                                className="w-full px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white placeholder:text-surface-500 focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Street Address */}
                                    <div>
                                        <label className="block text-xs font-semibold text-surface-400 mb-2 uppercase tracking-wider">
                                            Street Address <span className="text-accent">*</span>
                                        </label>
                                        <textarea
                                            value={addressFormData.street || ''}
                                            onChange={(e) => setAddressFormData(p => ({ ...p, street: e.target.value }))}
                                            rows={2.5}
                                            placeholder="House/Flat no., Building, Street"
                                            className="w-full px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white placeholder:text-surface-500 focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all resize-none text-sm"
                                        />
                                    </div>

                                    {/* City, State, Pincode Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-surface-400 mb-2 uppercase tracking-wider">
                                                City <span className="text-accent">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={addressFormData.city || ''}
                                                onChange={(e) => setAddressFormData(p => ({ ...p, city: e.target.value }))}
                                                placeholder="City"
                                                className="w-full px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white placeholder:text-surface-500 focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-surface-400 mb-2 uppercase tracking-wider">
                                                State <span className="text-accent">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={addressFormData.state || ''}
                                                onChange={(e) => setAddressFormData(p => ({ ...p, state: e.target.value }))}
                                                placeholder="State"
                                                className="w-full px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white placeholder:text-surface-500 focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-surface-400 mb-2 uppercase tracking-wider">
                                                Pincode <span className="text-accent">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={addressFormData.pincode || ''}
                                                onChange={(e) => setAddressFormData(p => ({ ...p, pincode: e.target.value }))}
                                                placeholder="6 digits"
                                                maxLength={6}
                                                className="w-full px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white placeholder:text-surface-500 focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-xs font-semibold text-surface-400 mb-2 uppercase tracking-wider">
                                            Phone Number <span className="text-accent">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            value={addressFormData.phone || ''}
                                            onChange={(e) => setAddressFormData(p => ({ ...p, phone: e.target.value }))}
                                            placeholder="10 digit mobile number"
                                            className="w-full px-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white placeholder:text-surface-500 focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all text-sm"
                                        />
                                    </div>

                                    {/* Default Checkbox */}
                                    <div className="flex items-center gap-3 p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                                        <input
                                            type="checkbox"
                                            id="defaultAddress"
                                            checked={addressFormData.isDefault || false}
                                            onChange={(e) => setAddressFormData(p => ({ ...p, isDefault: e.target.checked }))}
                                            className="w-4 h-4 accent-accent border-white/[0.2] rounded cursor-pointer"
                                        />
                                        <label htmlFor="defaultAddress" className="text-sm text-surface-300 cursor-pointer flex-1">
                                            Set as default delivery address
                                        </label>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-3 pt-6 mt-6 border-t border-white/[0.06]">
                                    <button
                                        onClick={() => setIsAddressFormOpen(false)}
                                        className="flex-1 px-4 py-2.5 border border-white/[0.12] text-white rounded-lg text-sm font-semibold hover:bg-white/[0.05] transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveAddress}
                                        disabled={isSavingAddress}
                                        className="flex-1 px-4 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSavingAddress ? 'Saving...' : (selectedAddress ? 'Update Address' : 'Add Address')}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
};

export default UserDashboard;
