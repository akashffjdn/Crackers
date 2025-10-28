// src/context/AdminContext.tsx - UPDATE THIS SECTION

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AdminStats, Order, Product, User } from '../data/types';

interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

interface AdminState {
  stats: AdminStats;
  notifications: AdminNotification[];
  unreadCount: number;
  recentOrders: Order[];
  recentUsers: User[];
  isLoading: boolean;
}

// 🔧 FIX: Update AdminAction to accept partial notification
type AdminAction =
  | { type: 'SET_STATS'; payload: AdminStats }
  | { type: 'SET_NOTIFICATIONS'; payload: AdminNotification[] }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<AdminNotification, 'id' | 'createdAt'> } // ✅ Fixed this line
  | { type: 'SET_RECENT_ORDERS'; payload: Order[] }
  | { type: 'SET_RECENT_USERS'; payload: User[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: Order['status'] } };

interface AdminContextType extends AdminState {
  refreshStats: () => void;
  markNotificationAsRead: (id: string) => void;
  addNotification: (notification: Omit<AdminNotification, 'id' | 'createdAt'>) => void; // ✅ This was already correct
  updateOrderStatus: (orderId: string, status: Order['status'], trackingNumber?: string) => void;
  deleteProduct: (productId: string) => void;
  updateProduct: (productId: string, productData: Partial<Product>) => void;
  createProduct: (productData: Partial<Product>) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const adminReducer = (state: AdminState, action: AdminAction): AdminState => {
  switch (action.type) {
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter(n => !n.read).length
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
        unreadCount: state.unreadCount - 1
      };
    case 'ADD_NOTIFICATION':
      // ✅ This now works correctly with the fixed type
      const newNotification: AdminNotification = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      return {
        ...state,
        notifications: [newNotification, ...state.notifications],
        unreadCount: state.unreadCount + 1
      };
    case 'SET_RECENT_ORDERS':
      return { ...state, recentOrders: action.payload };
    case 'SET_RECENT_USERS':
      return { ...state, recentUsers: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        recentOrders: state.recentOrders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, status: action.payload.status, updatedAt: new Date().toISOString() }
            : order
        )
      };
    default:
      return state;
  }
};

// Rest of the file remains exactly the same...
const initialState: AdminState = {
  stats: {
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  },
  notifications: [],
  unreadCount: 0,
  recentOrders: [],
  recentUsers: [],
  isLoading: false
};

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  // Load initial data
  useEffect(() => {
    const loadAdminData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });

      try {
        // Mock API calls - replace with real API
        const stats: AdminStats = {
          totalUsers: 2547,
          totalOrders: 1823,
          totalRevenue: 856420,
          pendingOrders: 45
        };

        const notifications: AdminNotification[] = [
          {
            id: '1',
            title: 'New Order Received',
            message: 'Order #SP001 received from John Doe',
            type: 'info',
            read: false,
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            title: 'Low Stock Alert',
            message: 'Premium Golden Sparklers - Pack of 50 is running low',
            type: 'warning',
            read: false,
            createdAt: new Date(Date.now() - 3600000).toISOString()
          }
        ];

        dispatch({ type: 'SET_STATS', payload: stats });
        dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
      } catch (error) {
        console.error('Failed to load admin data:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadAdminData();
  }, []);

  const refreshStats = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Mock API call - replace with real API
      const stats: AdminStats = {
        totalUsers: Math.floor(Math.random() * 3000) + 2000,
        totalOrders: Math.floor(Math.random() * 2000) + 1500,
        totalRevenue: Math.floor(Math.random() * 1000000) + 500000,
        pendingOrders: Math.floor(Math.random() * 100) + 20
      };

      dispatch({ type: 'SET_STATS', payload: stats });
    } catch (error) {
      console.error('Failed to refresh stats:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const markNotificationAsRead = (id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  };

  const addNotification = (notification: Omit<AdminNotification, 'id' | 'createdAt'>) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const updateOrderStatus = async (orderId: string, status: Order['status'], trackingNumber?: string) => {
    try {
      // Mock API call - replace with real API
      await new Promise(resolve => setTimeout(resolve, 500));

      dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status } });

      // Add notification
      addNotification({
        title: 'Order Status Updated',
        message: `Order #${orderId} status changed to ${status}`,
        type: 'success',
        read: false
      });
    } catch (error) {
      console.error('Failed to update order status:', error);
      addNotification({
        title: 'Update Failed',
        message: `Failed to update order #${orderId}`,
        type: 'error',
        read: false
      });
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      // Mock API call - replace with real API
      await new Promise(resolve => setTimeout(resolve, 500));

      addNotification({
        title: 'Product Deleted',
        message: `Product #${productId} has been deleted`,
        type: 'success',
        read: false
      });
    } catch (error) {
      console.error('Failed to delete product:', error);
      addNotification({
        title: 'Delete Failed',
        message: `Failed to delete product #${productId}`,
        type: 'error',
        read: false
      });
    }
  };

  const updateProduct = async (productId: string, productData: Partial<Product>) => {
    try {
      // Mock API call - replace with real API
      await new Promise(resolve => setTimeout(resolve, 500));

      addNotification({
        title: 'Product Updated',
        message: `Product #${productId} has been updated`,
        type: 'success',
        read: false
      });
    } catch (error) {
      console.error('Failed to update product:', error);
      addNotification({
        title: 'Update Failed',
        message: `Failed to update product #${productId}`,
        type: 'error',
        read: false
      });
    }
  };

  const createProduct = async (productData: Partial<Product>) => {
    try {
      // Mock API call - replace with real API
      await new Promise(resolve => setTimeout(resolve, 500));

      addNotification({
        title: 'Product Created',
        message: `New product "${productData.name}" has been created`,
        type: 'success',
        read: false
      });
    } catch (error) {
      console.error('Failed to create product:', error);
      addNotification({
        title: 'Create Failed',
        message: `Failed to create product "${productData.name}"`,
        type: 'error',
        read: false
      });
    }
  };

  const value: AdminContextType = {
    ...state,
    refreshStats,
    markNotificationAsRead,
    addNotification,
    updateOrderStatus,
    deleteProduct,
    updateProduct,
    createProduct
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
