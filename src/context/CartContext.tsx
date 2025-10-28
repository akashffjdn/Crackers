// src/context/CartContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { CartItem, Product } from '../data/types';
import api from '../services/api'; // Use your configured axios instance
import { useAuth } from './AuthContext'; // To check login status and trigger fetch

// --- State Interface (Simpler) ---
interface CartState {
  items: CartItem[]; // Just the items array
  isLoading: boolean;
  error: string | null;
}

// --- Context Type ---
interface CartContextType extends CartState {
  // Calculated values derived from items
  total: number;
  itemCount: number;
  // Async actions calling the API
  fetchCart: () => void; // Function to trigger fetch
  addToCart: (product: Product, quantity?: number) => Promise<boolean>; // Allow specifying quantity
  removeFromCart: (productId: string) => Promise<boolean>;
  updateQuantity: (productId: string, quantity: number) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// --- Initial State ---
const initialState: CartState = {
  items: [],
  isLoading: false, // Initially false, loading triggered by auth change or manual fetch
  error: null,
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CartState>(initialState);
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth(); // Get auth state

  // --- Helper to update state ---
  const updateCartState = (newItems: CartItem[] | null, loading = false, errorMsg: string | null = null) => {
    setState({
      items: newItems === null ? state.items : newItems, // Keep old items on error if needed, or clear: newItems || []
      isLoading: loading,
      error: errorMsg,
    });
  };

  // --- Fetch Cart Data ---
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
        // If user logs out, clear the local cart state
        updateCartState([], false, null);
        return;
    }
    updateCartState(null, true); // Set loading true, keep existing items temporarily
    try {
      console.log("Fetching cart from API...");
      const response = await api.get('/cart'); // GET /api/cart
      if (Array.isArray(response.data)) {
        updateCartState(response.data, false); // Update items, clear loading/error
        console.log("Cart fetched successfully:", response.data.length, "items");
      } else { throw new Error("Invalid cart data received"); }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to load cart';
      console.error('Error fetching cart:', err);
      updateCartState([], false, msg); // Clear items on error, set error message
    }
  }, [isAuthenticated]); // Re-run fetchCart definition if isAuthenticated changes

  // --- Fetch cart on initial load/auth change ---
  useEffect(() => {
    // Only fetch if authentication isn't loading anymore
    if (!isAuthLoading) {
        fetchCart();
    } else {
        // If auth is still loading, reflect that in cart's loading state
         setState(prev => ({ ...prev, isLoading: true }));
    }
  }, [isAuthLoading, fetchCart]); // Depend on auth loading state and fetch function


  // --- API Call Functions ---

  const addToCart = async (product: Product, quantity: number = 1): Promise<boolean> => {
     if (!isAuthenticated) { updateCartState(null, false, "Please log in to add items."); return false; }
     updateCartState(null, true); // Indicate loading
    try {
      const response = await api.post('/cart', { productId: product.id, quantity }); // POST /api/cart
      if (Array.isArray(response.data)) {
        updateCartState(response.data, false); // Update state with response
        return true;
      } else { throw new Error("Invalid response data"); }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to add item';
      console.error('Error adding to cart:', err);
      updateCartState(null, false, msg); // Keep existing items on error, show error
      return false;
    }
  };

  const removeFromCart = async (productId: string): Promise<boolean> => {
    if (!isAuthenticated) { updateCartState(null, false, "Please log in to modify cart."); return false; }
    updateCartState(null, true);
    try {
      const response = await api.delete(`/cart/${productId}`); // DELETE /api/cart/:productId
      if (Array.isArray(response.data)) {
        updateCartState(response.data, false);
        return true;
      } else { throw new Error("Invalid response data"); }
    } catch (err: any) {
       const msg = err.response?.data?.message || err.message || 'Failed to remove item';
       console.error('Error removing from cart:', err);
       updateCartState(null, false, msg);
      return false;
    }
  };

  const updateQuantity = async (productId: string, quantity: number): Promise<boolean> => {
     if (!isAuthenticated) { updateCartState(null, false, "Please log in to modify cart."); return false; }
     if (quantity <= 0) {
         // Treat quantity <= 0 as removal
         return removeFromCart(productId);
     }
     updateCartState(null, true);
    try {
      const response = await api.put(`/cart/${productId}`, { quantity }); // PUT /api/cart/:productId
      if (Array.isArray(response.data)) {
        updateCartState(response.data, false);
        return true;
      } else { throw new Error("Invalid response data"); }
    } catch (err: any) {
       const msg = err.response?.data?.message || err.message || 'Failed to update quantity';
       console.error('Error updating quantity:', err);
       updateCartState(null, false, msg);
      return false;
    }
  };

  const clearCart = async (): Promise<boolean> => {
    if (!isAuthenticated) { updateCartState(null, false, "Please log in to clear cart."); return false; }
     updateCartState(null, true);
    try {
      const response = await api.delete('/cart'); // DELETE /api/cart
       if (Array.isArray(response.data)) { // Expecting empty array on success
          updateCartState([], false); // Clear local state
          return true;
       } else { throw new Error("Invalid response data"); }
    } catch (err: any) {
       const msg = err.response?.data?.message || err.message || 'Failed to clear cart';
       console.error('Error clearing cart:', err);
       updateCartState(null, false, msg);
      return false;
    }
  };

  // --- Calculated Values ---
  const total = state.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  // --- Context Value ---
  const value: CartContextType = {
    ...state,
    total,
    itemCount,
    fetchCart, // Expose fetch
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// --- Custom Hook ---
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};