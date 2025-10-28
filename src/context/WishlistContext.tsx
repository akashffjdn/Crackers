import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product } from '../data/types';
import api from '../services/api'; // Import your API service
import { useAuth } from './AuthContext'; // Import useAuth

// Interface for backend product object within wishlist response
interface WishlistProductBE extends Omit<Product, 'id' | 'categoryId'> {
    _id: string; // Backend uses _id
    categoryId: string | { _id: string; name?: string }; // Category might be populated
}

// Interface for backend wishlist item response
interface WishlistItemBE extends WishlistProductBE {
  createdAt: any;
} // The backend returns populated products directly

// Frontend WishlistItem interface
export interface WishlistItem {
  id: string; // Use product ID as the item ID for consistency
  product: Product;
  addedAt?: string; // Optional: Keep if you want to track addition time
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  isLoading: boolean;
  error: string | null;
  addToWishlist: (product: Product) => Promise<boolean>; // Make async
  removeFromWishlist: (productId: string) => Promise<boolean>; // Make async, use productId
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
  clearWishlist: () => Promise<boolean>; // Make async
  fetchWishlist: () => void; // Expose fetch function
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Start false, load when user logs in
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth(); // Get user and auth status

  // Function to map backend data to frontend format
  const mapBEToFE = (items: WishlistItemBE[]): WishlistItem[] => {
      return items.map(itemBE => {
          // Handle populated vs non-populated categoryId
          let categoryIdString: string;
          if (typeof itemBE.categoryId === 'object' && itemBE.categoryId !== null && '_id' in itemBE.categoryId) {
              categoryIdString = (itemBE.categoryId as { _id: string })._id;
          } else if (typeof itemBE.categoryId === 'string') {
              categoryIdString = itemBE.categoryId;
          } else {
              console.warn("Invalid categoryId format received:", itemBE.categoryId);
              categoryIdString = 'unknown'; // Fallback
          }

          const productFE: Product = {
             ...itemBE,
             id: itemBE._id,
             categoryId: categoryIdString, // Ensure it's a string ID
          };
          return {
              id: productFE.id, // Use product ID as the item ID
              product: productFE,
              addedAt: itemBE.createdAt // Or keep undefined if not needed
          };
      });
  };


  // Fetch wishlist from backend
  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
        setWishlistItems([]); // Clear wishlist if not authenticated
        setIsLoading(false);
        return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/users/wishlist'); // GET /api/users/wishlist
      if (Array.isArray(response.data)) {
          setWishlistItems(mapBEToFE(response.data));
      } else {
          throw new Error("Invalid wishlist data received");
      }
    } catch (err: any) {
      console.error('Error fetching wishlist:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load wishlist');
      setWishlistItems([]); // Clear on error
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]); // Depend on isAuthenticated

  // Fetch wishlist when authentication status changes
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]); // fetchWishlist already depends on isAuthenticated

  // Add item to wishlist via API
  const addToWishlist = async (product: Product): Promise<boolean> => {
    if (!isAuthenticated) {
        setError("Please log in to add items to your wishlist.");
        return false;
    }
    if (isInWishlist(product.id)) {
        return true; // Already exists, treat as success
    }
    setIsLoading(true); // Indicate loading for this specific action
    setError(null);
    try {
      const response = await api.post('/users/wishlist', { productId: product.id }); // POST /api/users/wishlist
      if (Array.isArray(response.data)) {
        setWishlistItems(mapBEToFE(response.data)); // Update state with the returned list
        return true;
      } else { throw new Error("Invalid response data"); }
    } catch (err: any) {
      console.error('Error adding to wishlist:', err);
      setError(err.response?.data?.message || err.message || 'Failed to add item');
      return false;
    } finally {
        setIsLoading(false);
    }
  };

  // Remove item from wishlist via API
  const removeFromWishlist = async (productId: string): Promise<boolean> => {
     if (!isAuthenticated) {
        setError("Please log in to modify your wishlist.");
        return false;
    }
    setIsLoading(true);
    setError(null);
    try {
      // Use productId directly in the URL
      const response = await api.delete(`/users/wishlist/${productId}`); // DELETE /api/users/wishlist/:productId
      if (Array.isArray(response.data)) {
          setWishlistItems(mapBEToFE(response.data)); // Update state with the returned list
          return true;
      } else { throw new Error("Invalid response data"); }
    } catch (err: any) {
      console.error('Error removing from wishlist:', err);
      setError(err.response?.data?.message || err.message || 'Failed to remove item');
      return false;
    } finally {
        setIsLoading(false);
    }
  };

  // Check if item is in wishlist (local check is fine)
  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some(item => item.product.id === productId);
  };

  // Clear wishlist (might need a backend endpoint if required, otherwise just clear local state)
  const clearWishlist = async (): Promise<boolean> => {
    // NOTE: No backend endpoint defined for this.
    // If you need this, create a DELETE /api/users/wishlist route.
    // For now, it just clears the local state for the current session.
    if (!isAuthenticated) return false;
    console.warn("clearWishlist called - no backend endpoint implemented. Clearing local state only.");
    setWishlistItems([]);
    // To implement backend clear:
    // try {
    //   await api.delete('/users/wishlist/clear'); // Example endpoint
    //   setWishlistItems([]);
    //   return true;
    // } catch (err) {
    //   setError('Failed to clear wishlist on server.');
    //   return false;
    // }
    return true; // Return true as local state is cleared
  };

  const value: WishlistContextType = {
    wishlistItems,
    isLoading,
    error,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    wishlistCount: wishlistItems.length,
    clearWishlist,
    fetchWishlist // Expose fetch function
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

// useWishlist hook remains the same
export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};