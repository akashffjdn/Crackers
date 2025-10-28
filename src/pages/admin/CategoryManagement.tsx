import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaImage } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import CategoryForm from '../../components/admin/CategoryForm';
import { Category, useCategories } from '../../context/CategoryContext';
import { useProducts } from '../../context/ProductContext';

const CategoryManagement: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const { getProductsByCategory } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    const productsInCategory = getProductsByCategory(categoryId);
    
    if (productsInCategory.length > 0) {
      if (!window.confirm(
        `This category has ${productsInCategory.length} product(s). Deleting it will not delete the products, but they will need to be reassigned to other categories. Are you sure you want to continue?`
      )) {
        return;
      }
    } else {
      if (!window.confirm('Are you sure you want to delete this category?')) {
        return;
      }
    }
    
    deleteCategory(categoryId);
  };

  const handleSaveCategory = (categoryData: Partial<Category>) => {
    if (selectedCategory) {
      // Update existing category
      updateCategory(selectedCategory.id, categoryData);
    } else {
      // Create new category
      const newCategory: Category = {
        id: `CAT${Date.now()}`,
        ...categoryData as Omit<Category, 'id'>
      };
      
      addCategory(newCategory);
    }
    setIsFormOpen(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
            <p className="text-gray-600">Manage your product categories and organization</p>
          </div>
          <button
            onClick={handleAddCategory}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors mt-4 md:mt-0"
          >
            <FaPlus />
            <span>Add Category</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaImage className="text-blue-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                <p className="text-gray-600 text-sm">Total Categories</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <FaEye className="text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {categories.reduce((total, cat) => total + getProductsByCategory(cat.id).length, 0)}
                </p>
                <p className="text-gray-600 text-sm">Total Products</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <FaImage className="text-purple-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(categories.reduce((total, cat) => total + getProductsByCategory(cat.id).length, 0) / categories.length) || 0}
                </p>
                <p className="text-gray-600 text-sm">Avg Products/Category</p>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const productCount = getProductsByCategory(category.id).length;
            
            return (
              <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Category Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={category.heroImage}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full p-2 text-2xl">
                    {category.icon}
                  </div>
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                    {productCount} products
                  </div>
                </div>

                {/* Category Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {category.description}
                  </p>
                  
                  {/* Category Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Category ID:</span>
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {category.id}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Products:</span>
                      <span className="font-semibold text-red-600">
                        {productCount} items
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <button
                      onClick={() => window.open(`/products/${category.id}`, '_blank')}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
                      title="View Category Page"
                    >
                      <FaEye />
                      <span className="text-sm">View</span>
                    </button>
                    
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="flex items-center space-x-1 text-green-600 hover:text-green-800 transition-colors"
                        title="Edit Category"
                      >
                        <FaEdit />
                        <span className="text-sm">Edit</span>
                      </button>
                      
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="flex items-center space-x-1 text-red-600 hover:text-red-800 transition-colors"
                        title="Delete Category"
                      >
                        <FaTrash />
                        <span className="text-sm">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {categories.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
            <div className="text-gray-400 mb-4">
              <FaImage className="text-5xl mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first product category.
            </p>
            <button
              onClick={handleAddCategory}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Create First Category
            </button>
          </div>
        )}

        {/* Category Form Modal */}
        <CategoryForm
          category={selectedCategory}
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveCategory}
        />
      </div>
    </AdminLayout>
  );
};

export default CategoryManagement;
