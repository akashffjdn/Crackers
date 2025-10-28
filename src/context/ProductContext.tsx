import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product } from '../data/types'; //
import api from '../services/api'; //

// Define context shape
interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  addProduct: (productData: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => Promise<boolean>; // Admin action
  updateProduct: (id: string, productData: Partial<Product>) => Promise<boolean>; // Admin action
  deleteProduct: (id: string) => Promise<boolean>; // Admin action
  getProductsByCategory: (categoryId: string, limit?: number) => Product[]; // Type signature remains the same
  getProductById: (id: string) => Product | undefined;
  fetchProducts: () => void; // Allow refresh
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch products from API
  const fetchProducts = useCallback(async () => {
    // Prevent refetch if already loading
    // Note: We keep isLoading in dependency array for useCallback, but check it inside
    setIsLoading(true); 
    setError(null);
    console.log("Fetching products from API...");
    try {
      const response = await api.get('/products'); // GET /api/products
      let fetchedProductsData = response.data;

      // Handle pagination object from backend
      if (response.data && Array.isArray(response.data.products)) {
          fetchedProductsData = response.data.products;
      } else if (!Array.isArray(response.data)) {
          console.error("API response for products is not an array:", response.data);
          throw new Error("Invalid product data format received");
      }

      // Map backend '_id' to frontend 'id'
      // Keep categoryId as it comes from backend (could be object or string)
      const mappedProducts = fetchedProductsData.map((p: any) => ({
        ...p,
        id: p._id || p.id,
        // categoryId is populated by backend, keep as is (object)
      }));
      console.log("Fetched products:", mappedProducts.length);
      setProducts(mappedProducts); // Update state
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load products';
      console.error('Error fetching products:', err.response?.data || err);
      setError(errorMessage);
      setProducts([]); // Clear on error
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array to run only once on mount

  // Fetch on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // --- Admin Actions ---

  // **FIXED: Full implementation of addProduct**
  const addProduct = async (productData: Omit<Product, 'id' | 'rating' | 'reviewCount'>): Promise<boolean> => {
    setError(null);
    // setIsLoading(true); // Optionally set a "saving" state
    try {
      // Token added automatically by interceptor
      const response = await api.post('/products', productData); // POST /api/products
      const newProduct = { ...response.data, id: response.data._id || response.data.id }; // Map _id
      
      // Add new product to the start of the list
      setProducts(prev => [newProduct, ...prev]); 
      // setIsLoading(false);
      return true; // Return true on success
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add product';
      console.error('Error adding product:', err.response?.data || err);
      setError(errorMessage);
      // setIsLoading(false);
      return false; // Return false on failure
    }
  };

  // **FIXED: Full implementation of updateProduct**
  const updateProduct = async (id: string, productData: Partial<Product>): Promise<boolean> => {
     setError(null);
     // setIsLoading(true);
    try {
      const response = await api.put(`/products/${id}`, productData); // PUT /api/products/:id
      const updatedProduct = { ...response.data, id: response.data._id || response.data.id }; // Map _id
      
      // Find and replace the updated product in state
      setProducts(prev => prev.map(p => (p.id === id ? updatedProduct : p)));
      // setIsLoading(false);
      return true; // Return true on success
    } catch (err: any) {
       const errorMessage = err.response?.data?.message || err.message || 'Failed to update product';
       console.error('Error updating product:', err.response?.data || err);
       setError(errorMessage);
       // setIsLoading(false);
       return false; // Return false on failure
    }
  };

  // **FIXED: Full implementation of deleteProduct**
  const deleteProduct = async (id: string): Promise<boolean> => {
      setError(null);
      // setIsLoading(true);
    try {
      await api.delete(`/products/${id}`); // DELETE /api/products/:id
      
      // Remove product from state
      setProducts(prev => prev.filter(p => p.id !== id));
      // setIsLoading(false);
      return true; // Return true on success
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete product';
      console.error('Error deleting product:', err.response?.data || err);
      setError(errorMessage);
      // setIsLoading(false);
      return false; // Return false on failure
    }
  };


  // --- Local Filtering/Finding ---

  // **FIXED getProductsByCategory (Handles populated categoryId object)**
  const getProductsByCategory = (categoryIdToFilter: string, limit?: number): Product[] => {
    const categoryProducts = products.filter(product => {
        // Check if product.categoryId exists
        if (!product.categoryId) return false;

        // Check if categoryId is a populated object
        if (typeof product.categoryId === 'object' && product.categoryId !== null && '_id' in product.categoryId) {
            // Compare the _id property of the object
            return (product.categoryId as { _id: string })._id === categoryIdToFilter;
        } 
        // Check if categoryId is just a string ID
        else if (typeof product.categoryId === 'string') {
            return product.categoryId === categoryIdToFilter;
        }
        return false; // Fallback
    });

    return limit ? categoryProducts.slice(0, limit) : categoryProducts;
  };


  const getProductById = (id: string): Product | undefined => {
    return products.find(product => product.id === id);
  };

  // Provide state and functions
  const value: ProductContextType = {
    products,
    isLoading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory, // Provide the fixed function
    getProductById,
    fetchProducts,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

// Custom hook
export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (!context) { throw new Error('useProducts must be used within a ProductProvider'); }
  return context;
};