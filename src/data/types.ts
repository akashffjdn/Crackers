// src/data/types.ts - COMPLETE FILE

// ===== ORIGINAL PRODUCT & ECOMMERCE INTERFACES =====
export interface Category {
  id: string;
  name: string;
  description: string;
  heroImage: string;
  icon: string;
  productCount: number;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  images: string[];
  description: string;
  shortDescription: string;
  mrp: number;
  price: number;
  rating: number;
  reviewCount: number;
  soundLevel: 'Low' | 'Medium' | 'High' | 'Mixed'; // ✅ Added 'Mixed' here
  burnTime: string;
  stock: number;
  features: string[];
  specifications: { [key: string]: string };
  tags: string[];
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isOnSale?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface FilterOptions {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  soundLevel?: string;
  rating?: number;
  sortBy?: string;
}

// ===== NEW AUTHENTICATION INTERFACES =====
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  role: 'user' | 'admin';
  createdAt: string;
  isActive: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: 'card' | 'upi' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AdminStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

// ===== ADMIN INTERFACES =====
export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}
