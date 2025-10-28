// src/routes/AppRoutes.tsx
import React, { Suspense, lazy } from 'react'; // Import lazy and Suspense
import { Routes, Route } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner'; // Or any loading indicator
import ProtectedRoute from '../components/ProtectedRoute';
import AdminRoute from '../components/AdminRoute';

// --- Lazy Load Pages ---
// Public
const CrackersLanding = lazy(() => import('../pages/CrackersLanding'));
const ShopNow = lazy(() => import('../pages/ShopNow'));
const ProductsPage = lazy(() => import('../pages/ProductsPage'));
const ProductDetails = lazy(() => import('../pages/ProductDetails'));
const CartPage = lazy(() => import('../pages/CartPage'));
const SafetyGuidelines = lazy(() => import('../pages/SafetyGuidelines'));
const BulkOrders = lazy(() => import('../pages/BulkOrders'));
const FestivalCollections = lazy(() => import('../pages/FestivalCollections'));
const ContactUs = lazy(() => import('../pages/ContactUs'));
const QuickOrderPage = lazy(() => import('../pages/QuickOrderPage'));
const NotFound = lazy(() => import('../pages/NotFound'));
// Auth (Load these relatively quickly)
const LoginPage = lazy(() => import('../pages/LoginPage'));
const SignupPage = lazy(() => import('../pages/SignUpPage'));
// Protected User
const CheckoutPage = lazy(() => import('../pages/CheckoutPage'));
const UserDashboard = lazy(() => import('../pages/UserDashboard'));
const OrderTrackingPage = lazy(() => import('../pages/OrderTrackingPage'));
// Admin (Prime candidates for lazy loading)
const AdminLogin = lazy(() => import('../pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const ProductManagement = lazy(() => import('../pages/admin/ProductManagement'));
const OrderManagement = lazy(() => import('../pages/admin/OrderManagement'));
const UserManagement = lazy(() => import('../pages/admin/UserManagement'));
const ContentManagement = lazy(() => import('../pages/admin/ContentManagement'));
const Analytics = lazy(() => import('../pages/admin/Analytics'));
const AdminSettings = lazy(() => import('../pages/admin/AdminSettings'));
const AdminProfile = lazy(() => import('../pages/admin/AdminProfile'));
const CategoryManagement = lazy(() => import('../pages/admin/CategoryManagement'));
const FestivalCollectionsManagement = lazy(() => import('../pages/admin/FestivalCollectionsManagement'));


const AppRoutes: React.FC = () => {
  return (
    // Wrap all routes in Suspense with a fallback UI
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner text="Loading page..." /></div>}>
      <Routes>
        {/* Public Routes */}
        <Route path="" element={<CrackersLanding />} />
        <Route path="/shop" element={<ShopNow />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:categoryId" element={<ProductsPage />} />
        <Route path="/product/:productId" element={<ProductDetails />} />
        <Route path="/safety-guidelines" element={<SafetyGuidelines />} />
        <Route path="/bulk-orders" element={<BulkOrders />} />
        <Route path="/festival-collections" element={<FestivalCollections />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/quick-order" element={<QuickOrderPage/>}/>
        <Route path="/cart" element={<CartPage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<ProtectedRoute requireAuth={false}><LoginPage /></ProtectedRoute>} />
        <Route path="/signup" element={<ProtectedRoute requireAuth={false}><SignupPage /></ProtectedRoute>} />

        {/* Protected User Routes */}
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/orders/:orderId" element={<ProtectedRoute><OrderTrackingPage /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><ProductManagement /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><OrderManagement /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
        <Route path="/admin/content" element={<AdminRoute><ContentManagement /></AdminRoute>} />
        <Route path="/admin/analytics" element={<AdminRoute><Analytics /></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
        <Route path="/admin/profile" element={<AdminRoute><AdminProfile /></AdminRoute>} />
        <Route path="/admin/categories" element={<AdminRoute><CategoryManagement /></AdminRoute>} />
        <Route path="/admin/festival-collections" element={<AdminRoute><FestivalCollectionsManagement /></AdminRoute>} />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;