import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaDownload, FaBox } from 'react-icons/fa'; // Added FaBox
import AdminLayout from '../../components/admin/AdminLayout'; //
import ProductForm from '../../components/admin/ProductForm'; //
import { Product } from '../../data/types'; //
import { useProducts } from '../../context/ProductContext'; //
import { useCategories } from '../../context/CategoryContext'; //
import { formatPriceSimple, calculateDiscount } from '../../utils/formatPrice'; //
import LoadingSpinner from '../../components/LoadingSpinner'; //
import Pagination from '../../components/Pagination'; //

const ProductManagement: React.FC = () => {
  // Use contexts to get data and actions
  // Destructure isLoading and error states from contexts
  const { products, addProduct, updateProduct, deleteProduct, isLoading: productsLoading, error: productsError } = useProducts();
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();

  // State remains the same
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Update filtered products when products or filters change
  useEffect(() => {
    // Only filter/sort if products have loaded
    if (!productsLoading && !categoriesLoading) {
        let filtered = products;

        if (searchTerm) {
          const lowerSearchTerm = searchTerm.toLowerCase();
          filtered = filtered.filter(product =>
            product.name.toLowerCase().includes(lowerSearchTerm) ||
            (product.tags && product.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm))) ||
            product.shortDescription.toLowerCase().includes(lowerSearchTerm)
          );
        }

        if (selectedCategoryFilter) {
          filtered = filtered.filter(product => {
             // Handle both populated object and string ID for categoryId
             if (typeof product.categoryId === 'object' && product.categoryId !== null && '_id' in product.categoryId) {
                 return (product.categoryId as { _id: string })._id === selectedCategoryFilter;
             }
             return product.categoryId === selectedCategoryFilter;
          });
        }


        // Sort (create a copy before sorting)
        const sorted = [...filtered].sort((a, b) => {
          switch (sortBy) {
            case 'name': return a.name.localeCompare(b.name);
            case 'price': return a.price - b.price; // Low to High
            case 'price-desc': return b.price - a.price; // High to Low
            case 'stock': return a.stock - b.stock; // Low to High
            case 'rating': return b.rating - a.rating; // High to Low
            default: return 0;
          }
        });

        setFilteredProducts(sorted);
        // Reset page if filters change
        if (currentPage !== 1) setCurrentPage(1);
    } else {
        // If still loading, keep filtered products empty or sync with potentially empty products array
        setFilteredProducts([]);
    }

  }, [products, searchTerm, selectedCategoryFilter, sortBy, productsLoading, categoriesLoading, currentPage]); // Added loading states as dependencies

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Action handlers remain the same
  const handleAddProduct = () => { setSelectedProduct(null); setIsFormOpen(true); };
  const handleEditProduct = (product: Product) => { setSelectedProduct(product); setIsFormOpen(true); };
  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
        const success = await deleteProduct(productId);
        if (!success) alert('Failed to delete product.');
    }
  };
  const handleSaveProduct = async (productData: Partial<Product>) => {
    let success = false;
    if (selectedProduct) {
        success = await updateProduct(selectedProduct.id, productData);
    } else {
        success = await addProduct(productData as Omit<Product, 'id' | 'rating' | 'reviewCount'>);
    }
    if (success) { setIsFormOpen(false); setSelectedProduct(null); }
    else { alert('Failed to save product.'); }
  };
  const getStockStatus = (stock: number) => {
    if (stock <= 0) return { label: 'Out of Stock', color: 'text-red-600 bg-red-50' };
    if (stock < 10) return { label: 'Low Stock', color: 'text-yellow-600 bg-yellow-50' };
    return { label: 'In Stock', color: 'text-green-600 bg-green-50' };
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-600">Manage your crackers inventory and listings</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            {/* Export Button */}
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <FaDownload />
              <span>Export</span>
            </button>
            {/* Add Product Button */}
            <button
              onClick={handleAddProduct}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              disabled={categoriesLoading || categories.length === 0} // Disable if categories needed for form aren't ready
            >
              <FaPlus />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Loading / Error States */}
         {(productsLoading || categoriesLoading) && ( // Show main spinner if either context is loading initially
             <div className="p-6 bg-white rounded-lg shadow-sm text-center">
                 <LoadingSpinner text="Loading data..." />
             </div>
         )}
         {/* Show errors if they occur */}
         {productsError && !productsLoading && (
             <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">Error loading products: {productsError}</div>
         )}
         {categoriesError && !categoriesLoading && (
             <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">Error loading categories: {categoriesError}</div>
         )}
         {/* Show warning only after categories have loaded and are confirmed empty */}
         {categories.length === 0 && !categoriesLoading && !categoriesError && (
            <div className="p-4 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg">
                Warning: No categories found. Please add categories before adding products.
            </div>
         )}

        {/* Stats */}
        {/* Only render stats once data is loaded */}
        {!productsLoading && !categoriesLoading && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 {/* Total Products */}
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                   <div className="flex items-center">
                     <div className="bg-blue-100 p-3 rounded-lg"><FaBox className="text-blue-600 text-xl" /></div>
                     <div className="ml-4">
                       <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                       <p className="text-gray-600 text-sm">Total Products</p>
                     </div>
                   </div>
                 </div>
                 {/* Categories */}
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                   <div className="flex items-center">
                     <div className="bg-green-100 p-3 rounded-lg"><FaPlus className="text-green-600 text-xl" /></div>
                     <div className="ml-4">
                       <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                       <p className="text-gray-600 text-sm">Categories</p>
                     </div>
                   </div>
                 </div>
                 {/* Low Stock */}
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                   <div className="flex items-center">
                     <div className="bg-yellow-100 p-3 rounded-lg"><FaSearch className="text-yellow-600 text-xl" /></div>
                     <div className="ml-4">
                       <p className="text-2xl font-bold text-gray-900">{products.filter(p => p.stock > 0 && p.stock < 10).length}</p>
                       <p className="text-gray-600 text-sm">Low Stock</p>
                     </div>
                   </div>
                 </div>
                 {/* Out of Stock */}
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                   <div className="flex items-center">
                     <div className="bg-red-100 p-3 rounded-lg"><FaTrash className="text-red-600 text-xl" /></div>
                     <div className="ml-4">
                       <p className="text-2xl font-bold text-gray-900">{products.filter(p => p.stock <= 0).length}</p>
                       <p className="text-gray-600 text-sm">Out of Stock</p>
                     </div>
                   </div>
                 </div>
               </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search products..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
            </div>
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={selectedCategoryFilter} onChange={(e) => setSelectedCategoryFilter(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" disabled={categoriesLoading}>
                <option value="">All Categories</option>
                {categories.map(category => (<option key={category.id} value={category.id}>{category.name}</option>))}
              </select>
            </div>
            {/* Sort By Filter */}
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                <option value="name">Name (A-Z)</option>
                <option value="price">Price (Low-High)</option>
                <option value="price-desc">Price (High-Low)</option>
                <option value="stock">Stock (Low-High)</option>
                <option value="rating">Rating (High-Low)</option>
              </select>
            </div>
            {/* Clear Filters Button */}
            <div className="flex items-end">
              <button onClick={() => { setSearchTerm(''); setSelectedCategoryFilter(''); setSortBy('name'); }} className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              {/* Table Head */}
              <thead className="bg-gray-50">
                 <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                 </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Show loading indicator Row if data is loading */}
                {(productsLoading || categoriesLoading) && (
                    <tr><td colSpan={7} className="p-6 text-center"><LoadingSpinner text="Loading..."/></td></tr>
                )}
                {/* Show table rows only if NOT loading and products exist */}
                {!productsLoading && !categoriesLoading && currentProducts.length > 0 && currentProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock);
                  const discount = calculateDiscount(product.mrp, product.price);

                  // **FIXED:** Directly access populated category name, handle object/string cases
                  let categoryName = 'Loading...'; // Default while categories might still load
                  if (!categoriesLoading) {
                      if (typeof product.categoryId === 'object' && product.categoryId !== null && 'name' in product.categoryId) {
                         categoryName = (product.categoryId as { name: string }).name;
                      } else if (typeof product.categoryId === 'string') {
                         categoryName = categories.find(c => c.id === product.categoryId)?.name || 'Unknown ID';
                      } else {
                         categoryName = 'Invalid Category Data';
                      }
                  }


                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      {/* Product Column */}
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="flex items-center">
                           <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded-lg flex-shrink-0" onError={(e)=>(e.target as HTMLImageElement).src='fallback-image.png'}/>
                           <div className="ml-4">
                             <div className="text-sm font-medium text-gray-900 line-clamp-2 max-w-xs">{product.name}</div>
                             <div className="text-sm text-gray-500">ID: {product.id}</div>
                           </div>
                         </div>
                       </td>
                       {/* Category Column */}
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{categoryName}</td>
                       {/* Price Column */}
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="font-semibold">{formatPriceSimple(product.price)}</div>
                          {discount > 0 && ( <div className="text-xs text-gray-500 line-through">{formatPriceSimple(product.mrp)} ({discount}% off)</div> )}
                       </td>
                       {/* Stock Column */}
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.stock}</td>
                       {/* Rating Column */}
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.rating} ({product.reviewCount})</td>
                       {/* Status Column */}
                        <td className="px-6 py-4 whitespace-nowrap">
                         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stockStatus.color}`}>
                           {stockStatus.label}
                         </span>
                       </td>
                       {/* Actions Column */}
                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                         <div className="flex items-center justify-end space-x-2">
                             <button onClick={() => window.open(`/product/${product.id}`, '_blank')} className="text-blue-600 hover:text-blue-900 p-1" title="View Product Page"><FaEye /></button>
                             <button onClick={() => handleEditProduct(product)} className="text-green-600 hover:text-green-900 p-1" title="Edit Product"><FaEdit /></button>
                             <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-900 p-1" title="Delete Product"><FaTrash /></button>
                         </div>
                       </td>
                    </tr>
                  );
                })}
                 {/* Empty State Row - Show only if not loading and no products match */}
                {!productsLoading && !categoriesLoading && currentProducts.length === 0 && (
                    <tr>
                        <td colSpan={7} className="text-center py-16">
                             <div className="text-gray-400 mb-4"><FaBox className="text-5xl mx-auto" /></div>
                             <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
                             <p className="text-gray-600">Try adjusting filters or add a new product.</p>
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
           {/* Only show pagination if not loading and more than one page */}
           {!productsLoading && !categoriesLoading && totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>

        {/* Product Form Modal */}
        {/* Pass categoriesLoading to disable form submit if categories aren't ready */}
        <ProductForm
          product={selectedProduct}
          isOpen={isFormOpen}
          onClose={() => { setIsFormOpen(false); setSelectedProduct(null); }} // Clear selection on close
          onSave={handleSaveProduct}
          // Pass categoriesLoading for disabling form elements if needed inside ProductForm
          // categoriesLoading={categoriesLoading}
        />
      </div>
    </AdminLayout>
  );
};

export default ProductManagement;