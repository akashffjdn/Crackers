import React, { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaTrash, FaExclamationTriangle, FaSave } from 'react-icons/fa';
import { Product } from '../../data/types'; //
import { useCategories } from '../../context/CategoryContext'; //

interface ProductFormProps {
  product?: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Partial<Product>) => void; // This calls addProduct/updateProduct in ProductContext
}

// Define the shape of the form data state
interface ProductFormData {
  name: string;
  categoryId: string;
  description: string;
  shortDescription: string;
  mrp: number;
  price: number;
  soundLevel: 'Low' | 'Medium' | 'High' | 'Mixed';
  burnTime: string;
  stock: number;
  images: string[];
  features: string[];
  specifications: { [key: string]: string };
  tags: string[];
}

const ProductForm: React.FC<ProductFormProps> = ({ product, isOpen, onClose, onSave }) => {
  const { categories, isLoading: categoriesLoading } = useCategories(); // Get categories from context

  // **FIXED:** Initialize state correctly with default values
  const initialFormData: ProductFormData = {
    name: '', categoryId: '', description: '', shortDescription: '',
    mrp: 0, price: 0, soundLevel: 'Low', burnTime: '', stock: 0,
    images: [''], features: [''], specifications: {}, tags: ['']
  };

  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [specificationKey, setSpecificationKey] = useState('');
  const [specificationValue, setSpecificationValue] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Effect to populate or reset form
  useEffect(() => {
    if (isOpen) {
      if (product) {
        setFormData({ /* Populate from product */
          name: product.name || '', categoryId: product.categoryId || '', description: product.description || '',
          shortDescription: product.shortDescription || '', mrp: product.mrp || 0, price: product.price || 0,
          soundLevel: product.soundLevel || 'Low', burnTime: product.burnTime || '', stock: product.stock >= 0 ? product.stock : 0,
          images: product.images && product.images.length > 0 ? product.images : [''],
          features: product.features && product.features.length > 0 ? product.features : [''],
          specifications: product.specifications || {},
          tags: product.tags && product.tags.length > 0 ? product.tags : ['']
        });
      } else {
        setFormData(initialFormData); // Reset
      }
      setErrors({});
    }
  }, [product, isOpen]);

  // Validation function
  const validateForm = (): boolean => {
     const newErrors: Record<string, string> = {};
     if (!formData.name.trim()) newErrors.name = 'Product name is required';
     if (!formData.categoryId) newErrors.categoryId = 'Category is required';
     if (!formData.shortDescription.trim()) newErrors.shortDescription = 'Short description is required';
     if (!formData.description.trim()) newErrors.description = 'Full description is required';
     if (formData.mrp <= 0) newErrors.mrp = 'MRP must be a positive number';
     if (formData.price <= 0) newErrors.price = 'Selling price must be a positive number';
     if (formData.price > formData.mrp) newErrors.price = 'Selling price cannot be higher than MRP';
     if (formData.stock < 0) newErrors.stock = 'Stock cannot be negative';
     const validImages = formData.images.map(img => img.trim()).filter(img => img !== '');
     if (validImages.length === 0) { newErrors.images = 'At least one product image URL is required'; }
     else if (validImages.some(img => !/^https?:\/\/.+/.test(img))) { newErrors.images = 'Please enter valid URLs for images'; }

     setErrors(newErrors);
     return Object.keys(newErrors).length === 0;
  };

  // Input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let processedValue: string | number = value;
    if (['mrp', 'price', 'stock'].includes(name)) {
      processedValue = value === '' ? 0 : parseFloat(value) || 0;
      if (processedValue < 0 && name === 'stock') processedValue = 0;
      else if (processedValue < 0) processedValue = 0;
    }
    setFormData(prev => ({ ...prev, [name]: processedValue }));
    if (errors[name]) setErrors(prev => { const updated = {...prev}; delete updated[name]; return updated; });
  };

  // Array input handlers
  const handleArrayInputChange = (index: number, value: string, field: 'images' | 'features' | 'tags') => {
    setFormData(prev => ({ ...prev, [field]: prev[field].map((item, i) => (i === index ? value : item)) }));
    if (errors[field]) setErrors(prev => { const updated = {...prev}; delete updated[field]; return updated; });
  };
  const addArrayField = (field: 'images' | 'features' | 'tags') => { setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] })); };
  const removeArrayField = (index: number, field: 'images' | 'features' | 'tags') => {
    if ((field === 'images' || field === 'features' || field === 'tags') && formData[field].length <= 1) {
      setFormData(prev => ({ ...prev, [field]: [''] })); return;
    }
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  // Specification handlers
  const addSpecification = () => {
    if (specificationKey.trim() && specificationValue.trim()) {
      setFormData(prev => ({ ...prev, specifications: { ...prev.specifications, [specificationKey.trim()]: specificationValue.trim() } }));
      setSpecificationKey(''); setSpecificationValue('');
    }
  };
  const removeSpecification = (key: string) => {
    setFormData(prev => { const newSpecs = { ...prev.specifications }; delete newSpecs[key]; return { ...prev, specifications: newSpecs }; });
  };

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    // Prepare data
    const productData: Partial<Product> = {
      ...formData,
      images: formData.images.map(img => img.trim()).filter(img => img !== ''),
      features: formData.features.map(f => f.trim()).filter(f => f !== ''),
      tags: formData.tags.map(t => t.trim()).filter(t => t !== ''),
    };
    if (product) { productData.rating = product.rating; productData.reviewCount = product.reviewCount; }
    // Call the onSave prop (triggers context -> API)
    onSave(productData);
  };

  if (!isOpen) return null;

  // --- UI Structure (Modal and Form) - Kept as provided ---
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter product name" />
              {errors.name && (<p className="text-red-500 text-sm mt-1 flex items-center"><FaExclamationTriangle className="mr-1" /> {errors.name}</p>)}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select name="categoryId" value={formData.categoryId} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.categoryId ? 'border-red-500' : 'border-gray-300'}`} disabled={categoriesLoading || categories.length === 0}>
                <option value="">{categoriesLoading ? 'Loading...' : 'Select Category'}</option>
                {categories.map(category => (<option key={category.id} value={category.id}>{category.name}</option>))}
              </select>
              {errors.categoryId && (<p className="text-red-500 text-sm mt-1 flex items-center"><FaExclamationTriangle className="mr-1" /> {errors.categoryId}</p>)}
              {categories.length === 0 && !categoriesLoading && (<p className="text-yellow-600 text-sm mt-1 flex items-center"><FaExclamationTriangle className="mr-1" /> No categories available.</p>)}
            </div>
          </div>

          {/* Descriptions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
            <input type="text" name="shortDescription" value={formData.shortDescription} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.shortDescription ? 'border-red-500' : 'border-gray-300'}`} placeholder="Brief description for listing" />
            {errors.shortDescription && (<p className="text-red-500 text-sm mt-1 flex items-center"><FaExclamationTriangle className="mr-1" /> {errors.shortDescription}</p>)}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Description *</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`} placeholder="Detailed product description" />
            {errors.description && (<p className="text-red-500 text-sm mt-1 flex items-center"><FaExclamationTriangle className="mr-1" /> {errors.description}</p>)}
          </div>

          {/* Pricing & Stock */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">MRP *</label>
              <input type="number" name="mrp" value={formData.mrp} onChange={handleInputChange} min="0" step="0.01" className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.mrp ? 'border-red-500' : 'border-gray-300'}`} placeholder="0.00" />
              {errors.mrp && (<p className="text-red-500 text-sm mt-1 flex items-center"><FaExclamationTriangle className="mr-1" /> {errors.mrp}</p>)}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price *</label>
              <input type="number" name="price" value={formData.price} onChange={handleInputChange} min="0" step="0.01" className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.price ? 'border-red-500' : 'border-gray-300'}`} placeholder="0.00" />
              {errors.price && (<p className="text-red-500 text-sm mt-1 flex items-center"><FaExclamationTriangle className="mr-1" /> {errors.price}</p>)}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
              <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} min="0" className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.stock ? 'border-red-500' : 'border-gray-300'}`} placeholder="0" />
              {errors.stock && (<p className="text-red-500 text-sm mt-1 flex items-center"><FaExclamationTriangle className="mr-1" /> {errors.stock}</p>)}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sound Level *</label>
              <select name="soundLevel" value={formData.soundLevel} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                <option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option><option value="Mixed">Mixed</option>
              </select>
            </div>
          </div>

          {/* Burn Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Burn Time</label>
            <input type="text" name="burnTime" value={formData.burnTime} onChange={handleInputChange} placeholder="e.g., 60+ seconds" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Images *</label>
            {formData.images.map((image, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input type="url" value={image} onChange={(e) => handleArrayInputChange(index, e.target.value, 'images')} placeholder="Enter image URL" className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.images ? 'border-red-500' : 'border-gray-300'}`} />
                {image && (<div className="w-12 h-12 border rounded overflow-hidden"><img src={image} alt="Preview" className="w-full h-full object-cover" onError={(e) => {(e.target as HTMLImageElement).style.display='none';}}/></div>)}
                {formData.images.length > 1 && (<button type="button" onClick={() => removeArrayField(index, 'images')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><FaTrash /></button>)}
              </div>
            ))}
            <button type="button" onClick={() => addArrayField('images')} className="flex items-center space-x-2 text-red-600 hover:text-red-700"><FaPlus /><span>Add Image</span></button>
            {errors.images && (<p className="text-red-500 text-sm mt-1 flex items-center"><FaExclamationTriangle className="mr-1" /> {errors.images}</p>)}
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
            {formData.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input type="text" value={feature} onChange={(e) => handleArrayInputChange(index, e.target.value, 'features')} placeholder="Enter feature" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                {formData.features.length > 1 && (<button type="button" onClick={() => removeArrayField(index, 'features')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><FaTrash /></button>)}
              </div>
            ))}
            <button type="button" onClick={() => addArrayField('features')} className="flex items-center space-x-2 text-red-600 hover:text-red-700"><FaPlus /><span>Add Feature</span></button>
          </div>

          {/* Specifications */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Specifications</label>
            <div className="flex items-center space-x-2 mb-4">
              <input type="text" value={specificationKey} onChange={(e) => setSpecificationKey(e.target.value)} placeholder="Specification name" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              <input type="text" value={specificationValue} onChange={(e) => setSpecificationValue(e.target.value)} placeholder="Specification value" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
              <button type="button" onClick={addSpecification} disabled={!specificationKey || !specificationValue} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed">Add</button>
            </div>
            <div className="space-y-2">
              {Object.entries(formData.specifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div><span className="font-medium">{key}:</span> {value}</div>
                  <button type="button" onClick={() => removeSpecification(key)} className="p-1 text-red-600 hover:bg-red-100 rounded"><FaTrash /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            {formData.tags.map((tag, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input type="text" value={tag} onChange={(e) => handleArrayInputChange(index, e.target.value, 'tags')} placeholder="Enter tag" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                {formData.tags.length > 1 && (<button type="button" onClick={() => removeArrayField(index, 'tags')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><FaTrash /></button>)}
              </div>
            ))}
            <button type="button" onClick={() => addArrayField('tags')} className="flex items-center space-x-2 text-red-600 hover:text-red-700"><FaPlus /><span>Add Tag</span></button>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 sticky bottom-0 bg-white py-4 px-6 z-10">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={categoriesLoading || categories.length === 0} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed">
              {product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;