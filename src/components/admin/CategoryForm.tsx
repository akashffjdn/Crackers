import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaImage, FaExclamationTriangle } from 'react-icons/fa';
import { Category } from '../../context/CategoryContext'; // Import Category type

interface CategoryFormProps {
  category: Category | null; // Data for editing, null for adding
  isOpen: boolean; // Controls modal visibility
  onClose: () => void; // Function to close the modal
  onSave: (categoryData: Partial<Category>) => void; // Function to call when saving
}

// Define the structure of the form's state
interface CategoryFormData {
  name: string;
  description: string;
  icon: string;
  heroImage: string;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  isOpen,
  onClose,
  onSave // This function is passed from CategoryManagement.tsx and calls addCategory/updateCategory in CategoryContext
}) => {
  // Initialize state with default values and correct type
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    icon: '🎆',
    heroImage: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Effect to populate or reset the form when it opens or the category prop changes
  useEffect(() => {
    if (isOpen) {
      if (category) {
        // Populate form fields if editing an existing category
        setFormData({
          name: category.name || '',
          description: category.description || '',
          icon: category.icon || '🎆',
          heroImage: category.heroImage || ''
        });
      } else {
        // Reset form fields if adding a new category
        setFormData({ name: '', description: '', icon: '🎆', heroImage: '' });
      }
      setErrors({}); // Clear any previous validation errors
    }
  }, [category, isOpen]); // Rerun effect if category or isOpen changes

  // Form validation logic
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Category name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.icon.trim()) newErrors.icon = 'Icon is required (e.g., an emoji)';
    if (!formData.heroImage.trim()) newErrors.heroImage = 'Hero image URL is required';
    else if (!/^https?:\/\/.+/.test(formData.heroImage)) newErrors.heroImage = 'Please enter a valid URL';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if form is valid
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default browser form submission
    if (validateForm()) {
      // If valid, prepare data (excluding fields not in the form like 'id')
      const saveData: Partial<Category> = {
        name: formData.name,
        description: formData.description,
        icon: formData.icon,
        heroImage: formData.heroImage
      };
      // Call the onSave function passed via props (this triggers the context action -> API call)
      onSave(saveData);
    }
  };

  // Handle changes in form inputs
  const handleInputChange = (field: keyof CategoryFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value })); // Update form state
    // Clear the specific error message when the user starts typing in the field
    if (errors[field]) {
      setErrors(prev => {
        const updatedErrors = { ...prev };
        delete updatedErrors[field];
        return updatedErrors;
      });
    }
  };

  // List of common icons for quick selection
  const commonIcons = ['🎆', '🎇', '✨', '🎊', '🎉', '💥', '🔥', '⭐', '🌟', '💫', '🎁', '🎈', '🌸', '🌀', '🚀', '👶'];

  // Don't render the modal if isOpen is false
  if (!isOpen) return null;

  // --- UI Structure (Modal and Form) ---
  // This part remains the same as your provided UI structure
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-900">
            {category ? 'Edit Category' : 'Add New Category'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 rounded-md hover:bg-gray-100" aria-label="Close modal">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter category name"
            />
            {errors.name && (<p className="text-red-500 text-sm mt-1 flex items-center"><FaExclamationTriangle className="mr-1" /> {errors.name}</p>)}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter category description"
            />
            {errors.description && (<p className="text-red-500 text-sm mt-1 flex items-center"><FaExclamationTriangle className="mr-1" /> {errors.description}</p>)}
          </div>

          {/* Icon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category Icon *</label>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="text-4xl p-2 border rounded bg-gray-50">{formData.icon || '?'}</div>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => handleInputChange('icon', e.target.value)}
                  maxLength={5}
                  className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.icon ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter emoji or icon text"
                />
              </div>
              {errors.icon && (<p className="text-red-500 text-sm mt-1 flex items-center"><FaExclamationTriangle className="mr-1" /> {errors.icon}</p>)}
              <div>
                <p className="text-sm text-gray-600 mb-2">Quick select:</p>
                <div className="flex flex-wrap gap-2">
                  {commonIcons.map((icon) => (
                    <button key={icon} type="button" onClick={() => handleInputChange('icon', icon)} className={`text-2xl p-2 rounded-lg border-2 hover:bg-gray-50 transition-colors ${formData.icon === icon ? 'border-red-500 bg-red-50' : 'border-gray-200'}`} aria-label={`Select icon ${icon}`}>
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image URL *</label>
            <input
              type="url"
              value={formData.heroImage}
              onChange={(e) => handleInputChange('heroImage', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.heroImage ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="https://example.com/image.jpg"
            />
            {errors.heroImage && (<p className="text-red-500 text-sm mt-1 flex items-center"><FaExclamationTriangle className="mr-1" /> {errors.heroImage}</p>)}
            {formData.heroImage && !errors.heroImage && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <div className="relative w-full h-32 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                  <img src={formData.heroImage} alt="Preview" className="max-w-full max-h-full object-contain" onError={(e) => {(e.target as HTMLImageElement).style.display = 'none';}} />
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 sticky bottom-0 bg-white py-4 px-6 z-10">
            <button type="button" onClick={onClose} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              <FaSave />
              <span>{category ? 'Update Category' : 'Create Category'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;