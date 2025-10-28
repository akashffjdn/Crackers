import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import api from '../services/api'; //

// Define Category interface used in frontend
export interface Category {
  id: string; // Use 'id' consistently
  _id?: string; // Allow _id from backend
  name: string;
  description: string;
  icon: string;
  heroImage: string;
  productCount?: number; // Calculated dynamically, not stored/fetched here
}

// Define context shape
interface CategoryContextType {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  addCategory: (categoryData: Omit<Category, 'id' | 'productCount'>) => Promise<boolean>; // Admin action
  updateCategory: (id: string, categoryData: Partial<Category>) => Promise<boolean>; // Admin action
  deleteCategory: (id: string) => Promise<boolean>; // Admin action
  getCategoryById: (id: string) => Category | undefined;
  fetchCategories: () => void; // Allow refresh
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch categories from API
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    console.log("Fetching categories from API...");
    try {
      const response = await api.get('/categories'); // GET /api/categories
      if (!Array.isArray(response.data)) {
          throw new Error("Invalid category data format received");
      }
      // Map backend '_id' to frontend 'id'
      const mappedCategories = response.data.map((cat: any) => ({
        ...cat,
        id: cat._id || cat.id
       }));
       console.log("Fetched categories:", mappedCategories.length);
      setCategories(mappedCategories); // Update state
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load categories';
      console.error('Error fetching categories:', err.response?.data || err);
      setError(errorMessage);
      setCategories([]); // Clear on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // --- Admin Actions ---

  // ADD CATEGORY Function - Calls API
  const addCategory = async (categoryData: Omit<Category, 'id' | 'productCount'>): Promise<boolean> => {
    setError(null);
    setIsLoading(true);
    try {
      // Token added automatically by interceptor
      const response = await api.post('/categories', categoryData); // POST /api/categories
      const newCategory = { ...response.data, id: response.data._id || response.data.id }; // Map _id
      setCategories(prev => [newCategory, ...prev]); // Update state
      setIsLoading(false);
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add category';
      console.error('Error adding category:', err.response?.data || err);
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  };

  // UPDATE CATEGORY Function - Calls API
  const updateCategory = async (id: string, categoryData: Partial<Category>): Promise<boolean> => {
     setError(null);
     setIsLoading(true);
    try {
      const response = await api.put(`/categories/${id}`, categoryData); // PUT /api/categories/:id
      const updatedCategory = { ...response.data, id: response.data._id || response.data.id }; // Map _id
      setCategories(prev => prev.map(cat => (cat.id === id ? updatedCategory : cat))); // Update state
      setIsLoading(false);
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update category';
      console.error('Error updating category:', err.response?.data || err);
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  };

  // DELETE CATEGORY Function - Calls API
  const deleteCategory = async (id: string): Promise<boolean> => {
     setError(null);
     setIsLoading(true);
    try {
      await api.delete(`/categories/${id}`); // DELETE /api/categories/:id
      setCategories(prev => prev.filter(cat => cat.id !== id)); // Update state
      setIsLoading(false);
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete category';
      console.error('Error deleting category:', err.response?.data || err);
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  };

  // --- Local Finding ---
  const getCategoryById = (id: string): Category | undefined => {
    return categories.find(category => category.id === id);
  };

  // Provide state and functions
  const value: CategoryContextType = {
    categories,
    isLoading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    fetchCategories,
  };

  return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
};

// Custom hook
export const useCategories = (): CategoryContextType => {
  const context = useContext(CategoryContext);
  if (!context) { throw new Error('useCategories must be used within a CategoryProvider'); }
  return context;
};