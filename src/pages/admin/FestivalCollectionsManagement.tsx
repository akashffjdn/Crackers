import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaEye,
    FaEyeSlash,
    FaSearch,
    FaSave,
    FaTimes,
    FaArrowUp,
    FaArrowDown,
    FaBox, // Keep icon if needed elsewhere
    FaGift,
    FaList // Icon for categories
} from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import { Product } from '../../data/types';
import { useProducts } from '../../context/ProductContext';
import { useCategories, Category } from '../../context/CategoryContext'; // Import useCategories and Category type
import api from '../../services/api'; //
import { formatPriceSimple } from '../../utils/formatPrice'; //
import LoadingSpinner from '../../components/LoadingSpinner'; //

// --- Interfaces matching Backend Models (assignedProducts removed from FE type) ---
interface CollectionProductPackBE {
    _id?: string;
    name: string;
    description: string;
    price: number;
    mrp: number;
    image?: string;
    products: {
        productId: string; // Refers to Product _id
        quantity: number;
        _id?: string;
    }[];
    isActive: boolean;
    createdAt?: string;
}

interface FestivalCollectionBE {
    _id: string;
    title: string;
    description: string;
    slug: string;
    color: string;
    image?: string;
    isActive: boolean;
    sortOrder: number;
    tags: string[];
    seoTitle?: string;
    seoDescription?: string;
    assignedProducts: string[]; // Keep in BE type for backend model consistency
    customPacks?: CollectionProductPackBE[];
    showAllTaggedProducts: boolean;
    createdAt: string;
    updatedAt: string;
}

// Frontend type (mapping _id to id, removing assignedProducts)
interface FestivalCollectionFE extends Omit<FestivalCollectionBE, '_id' | 'customPacks' | 'assignedProducts'> {
    id: string;
    customPacks: CollectionProductPackFE[];
    // assignedProducts removed based on requirement
}
interface CollectionProductPackFE extends Omit<CollectionProductPackBE, '_id' | 'createdAt'> {
     id: string; // Use 'id' consistently on frontend (can map from _id or be temp)
     _id?: string; // Keep original _id if it came from backend for updates
     createdAt?: string; // Keep if needed for display
}


const FestivalCollectionsManagement: React.FC = () => {
    const [collections, setCollections] = useState<FestivalCollectionFE[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { products: availableProducts, isLoading: productsLoading, error: productsError } = useProducts();
    const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories(); // Fetch categories

    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    // isProductsModalOpen removed
    const [isPackModalOpen, setIsPackModalOpen] = useState(false);
    const [editingCollection, setEditingCollection] = useState<FestivalCollectionFE | null>(null);
    const [selectedCollectionId, setSelectedCollectionId] = useState<string>('');
    const [editingPack, setEditingPack] = useState<CollectionProductPackFE | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    // State for category filter WITHIN the pack modal
    const [selectedPackCategoryFilter, setSelectedPackCategoryFilter] = useState<string | null>(null);

    // Form state (assignedProducts removed)
    const initialFormData: Partial<Omit<FestivalCollectionFE, 'id' | 'createdAt' | 'updatedAt'>> = {
        title: '', description: '', slug: '', color: 'from-red-500 to-orange-600',
        image: '', isActive: true, sortOrder: 1, tags: [],
        customPacks: [], showAllTaggedProducts: true, seoTitle: '', seoDescription: ''
        // assignedProducts removed
    };
    const [formData, setFormData] = useState<Partial<Omit<FestivalCollectionFE, 'id' | 'createdAt' | 'updatedAt'>>>(initialFormData);

    const initialPackFormData: Partial<Omit<CollectionProductPackFE, 'id' | '_id' | 'createdAt'>> = { // Omit generated fields
        name: '', description: '', price: 0, mrp: 0, image: '', products: [], isActive: true
    };
    const [packFormData, setPackFormData] = useState<Partial<Omit<CollectionProductPackFE, 'id' | '_id' | 'createdAt'>>>(initialPackFormData);

    // selectedProducts state removed
    const [packProducts, setPackProducts] = useState<{ productId: string, quantity: number }[]>([]);


    // --- API Data Fetching ---
    const fetchCollections = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get('/collections/admin/all');
            const fetchedData: FestivalCollectionBE[] = response.data;

            const mappedCollections = fetchedData.map((col): FestivalCollectionFE => {
                 const { assignedProducts, ...restOfCol } = col; // Destructure and ignore assignedProducts
                 return {
                    ...restOfCol,
                    id: col._id,
                    customPacks: (col.customPacks || []).map((pack, index) => ({
                        ...pack,
                        id: pack._id || `temp-pack-${col._id}-${index}`,
                        _id: pack._id
                    }))
                };
            });

            setCollections(mappedCollections);
        } catch (err: any) {
            console.error("Error fetching collections:", err);
            setError(err.response?.data?.message || err.message || 'Failed to fetch collections');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCollections();
    }, [fetchCollections]);

    // --- Utility Functions ---
    const generateSlug = (title: string): string => { // Same as before
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    };

    // --- Modal Open/Close Handlers ---
    const handleAddCollection = () => { // Same as before
        setEditingCollection(null);
        setFormData({
            ...initialFormData,
            sortOrder: collections.length > 0 ? Math.max(...collections.map(c => c.sortOrder)) + 1 : 1
        });
        setFormError(null);
        setIsFormOpen(true);
    };

    const handleEditCollection = (collection: FestivalCollectionFE) => { // Same as before
        setEditingCollection(collection);
        const { id, createdAt, updatedAt, customPacks, ...editableData } = collection;
        setFormData({
            ...editableData,
            tags: [...(collection.tags || [])] // Ensure tags is always an array
        });
        setFormError(null);
        setIsFormOpen(true);
    };

    // --- API Action Handlers ---

    const handleDeleteCollection = async (id: string) => { // Same as before
        const collectionToDelete = collections.find(c => c.id === id);
        if (!collectionToDelete) return;
        if (window.confirm(`Delete "${collectionToDelete.title}"?`)) {
            try {
                setIsLoading(true);
                await api.delete(`/collections/${id}`);
                setCollections(prev => prev.filter(c => c.id !== id));
                alert('Deleted.');
            } catch (err: any) {
                setError(`Delete failed: ${err.response?.data?.message || err.message}`);
            } finally { setIsLoading(false); }
        }
    };

    const handleToggleActive = async (id: string) => { // Same as before
        const collection = collections.find(c => c.id === id);
        if (!collection) return;
        const newStatus = !collection.isActive;
        setCollections(prev => prev.map(c => c.id === id ? { ...c, isActive: newStatus, updatedAt: new Date().toISOString() } : c));
        try {
            await api.put(`/collections/${id}`, { isActive: newStatus });
        } catch (err: any) {
            setError(`Toggle failed: ${err.response?.data?.message || err.message}`);
            setCollections(prev => prev.map(c => c.id === id ? { ...c, isActive: collection.isActive, updatedAt: collection.updatedAt } : c));
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => { // Same as before (payload excludes assignedProducts implicitly now)
        e.preventDefault();
        setFormError(null); setIsSaving(true);
        if (!formData.title || !formData.description) {
            setFormError('Title and Description required.'); setIsSaving(false); return;
        }
        const slug = formData.slug || generateSlug(formData.title!);
        const payload = { ...formData, slug };
        try {
            if (editingCollection) { await api.put(`/collections/${editingCollection.id}`, payload); }
            else { await api.post('/collections', payload); }
            setIsFormOpen(false); setEditingCollection(null); fetchCollections();
        } catch (err: any) {
            setFormError(err.response?.data?.message || err.message || 'Save failed.');
        } finally { setIsSaving(false); }
    };

    const handleMove = async (id: string, direction: 'up' | 'down') => { // Same as before
        const collectionsSorted = [...collections].sort((a,b) => a.sortOrder - b.sortOrder);
        const currentIndex = collectionsSorted.findIndex(c => c.id === id);
        if (currentIndex === -1) return;
        const currentCollection = collectionsSorted[currentIndex];
        const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (swapIndex < 0 || swapIndex >= collectionsSorted.length) return;
        const swapCollection = collectionsSorted[swapIndex];
        const updateCurrent = api.put(`/collections/${currentCollection.id}`, { sortOrder: swapCollection.sortOrder });
        const updateSwap = api.put(`/collections/${swapCollection.id}`, { sortOrder: currentCollection.sortOrder });
        setIsLoading(true);
        try {
            await Promise.all([updateCurrent, updateSwap]); fetchCollections();
        } catch (err: any) {
            setError("Sort order update failed."); fetchCollections();
        }
    };

    // --- Product Assignment Functions REMOVED ---

     // --- Custom Pack Management (API Version) ---
     const handleManagePacks = (collection: FestivalCollectionFE) => { // Same as before
        setSelectedCollectionId(collection.id);
        handleAddPack(); // Reset form
        setFormError(null);
        setSelectedPackCategoryFilter(null); // Reset category filter
        setIsPackModalOpen(true);
     };

    const handleAddPack = () => { // Same as before
        setEditingPack(null);
        setPackFormData(initialPackFormData);
        setPackProducts([]);
        setFormError(null);
    };

    const handleEditPack = (pack: CollectionProductPackFE) => { // Same as before
        setEditingPack(pack);
        const { id, _id, createdAt, ...editablePackData } = pack;
        setPackFormData({ ...editablePackData });
        setPackProducts(Array.isArray(pack.products) ? [...pack.products] : []);
        setFormError(null);
    };

     const handleSavePack = async () => { // Same logic as before
        setFormError(null);
        if (!packFormData.name || !packFormData.description || packProducts.length === 0 || packFormData.price === undefined || packFormData.mrp === undefined) {
            setFormError('Pack Name, Description, Price, MRP required, and at least one product selected.'); return;
        }
        if (packFormData.price > packFormData.mrp) { setFormError('Price cannot exceed MRP.'); return; }
        setIsSaving(true);
        const currentCollection = collections.find(c => c.id === selectedCollectionId);
        if (!currentCollection) { setFormError("Collection not found."); setIsSaving(false); return; }
        const packPayload: CollectionProductPackBE = {
            _id: editingPack?._id, name: packFormData.name!, description: packFormData.description!, price: packFormData.price!, mrp: packFormData.mrp!,
            image: packFormData.image || '', products: packProducts.map(p => ({ productId: p.productId, quantity: p.quantity })),
            isActive: packFormData.isActive !== undefined ? packFormData.isActive : true,
        };
        let updatedPacks: CollectionProductPackBE[];
        if (editingPack) {
             updatedPacks = (currentCollection.customPacks || []).map(p => {
                 const { id, _id, createdAt, ...packDataFE } = p;
                 const packDataBE: CollectionProductPackBE = { ...packDataFE, _id: _id, products: (packDataFE.products || []).map(prod => ({productId: prod.productId, quantity: prod.quantity})) };
                 return p.id === editingPack.id ? packPayload : packDataBE;
             });
        } else {
             updatedPacks = (currentCollection.customPacks || []).map(p => {
                 const { id, _id, createdAt, ...packDataFE } = p;
                 return { ...packDataFE, _id: _id, products: (packDataFE.products || []).map(prod => ({productId: prod.productId, quantity: prod.quantity})) };
             });
            const { _id, ...newPackPayload } = packPayload; updatedPacks.push(newPackPayload);
        }
        try {
            await api.put(`/collections/${selectedCollectionId}/packs`, { customPacks: updatedPacks });
            handleAddPack(); fetchCollections();
        } catch (err: any) { setFormError(err.response?.data?.message || err.message || 'Save failed.'); }
        finally { setIsSaving(false); }
    };

     const handleDeletePack = async (packIdToDelete: string) => { // Same logic as before
         const currentCollection = collections.find(c => c.id === selectedCollectionId);
         if (!currentCollection || !currentCollection.customPacks) return;
         const packToDelete = currentCollection.customPacks.find(p => p.id === packIdToDelete);
         if (!packToDelete) return;
         if (window.confirm(`Delete "${packToDelete.name}"?`)) {
             setIsSaving(true); setFormError(null);
             const updatedPacks = currentCollection.customPacks.filter(pack => pack.id !== packIdToDelete)
                 .map(p => { const { id, _id, createdAt, ...packDataFE } = p; return { ...packDataFE, _id: _id, products: (packDataFE.products || []).map(prod => ({productId: prod.productId, quantity: prod.quantity})) }; });
             try {
                 await api.put(`/collections/${selectedCollectionId}/packs`, { customPacks: updatedPacks });
                 if (editingPack?.id === packIdToDelete) { handleAddPack(); }
                 fetchCollections();
             } catch (err: any) { setFormError(err.response?.data?.message || err.message || 'Delete failed.'); }
             finally { setIsSaving(false); }
         }
     };

    // --- Pack Product Selection Helpers (remain the same logic) ---
    const addProductToPack = (productId: string) => { // Same logic
        const existing = packProducts.find(p=>p.productId===productId);
        if(existing){ setPackProducts(prev=>prev.map(p=>p.productId===productId?{...p,quantity:p.quantity+1}:p)); }
        else{ setPackProducts(prev=>[...prev,{productId,quantity:1}]); }
    };
    const removeProductFromPack = (productId: string) => { // Same logic
        setPackProducts(prev => prev.filter(p => p.productId !== productId));
    };
    const updatePackProductQuantity = (productId: string, quantity: number) => { // Same logic
        const num = Number(quantity);
        if(isNaN(num)||num<=0){ removeProductFromPack(productId); }
        else{ setPackProducts(prev => prev.map(p => p.productId === productId ? { ...p, quantity: num } : p)); }
    };

    // --- Product Data Helpers ---
    const getProductById = useCallback((id: string): Product | undefined => { // Same logic
        return availableProducts.find(p => p.id === id);
    }, [availableProducts]);

    const calculatePackTotal = useCallback(() => { // Same logic
        return packProducts.reduce((total, item) => {
            const product = getProductById(item.productId);
            return total + (product ? product.price * item.quantity : 0);
        }, 0);
    }, [packProducts, getProductById]);

    // --- Filter products for pack modal based on selected category ---
    const filteredPackProducts = useMemo(() => { // Same logic, uses selectedPackCategoryFilter state
        if (productsLoading || !availableProducts) return [];
        if (!selectedPackCategoryFilter) return availableProducts;
        return availableProducts.filter(p => {
            if (typeof p.categoryId === 'object' && p.categoryId !== null && '_id' in p.categoryId) {
                 return (p.categoryId as { _id: string })._id === selectedPackCategoryFilter;
             }
             return p.categoryId === selectedPackCategoryFilter;
        });
    }, [availableProducts, productsLoading, selectedPackCategoryFilter]);


    // --- Filtering and Sorting Collections (Memoized) ---
    const filteredCollections = useMemo(() => { // Same logic
        return collections
            .filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()) || c.description.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => a.sortOrder - b.sortOrder);
    }, [collections, searchTerm]);

    // --- Color options (remain the same) ---
     const colorOptions = [ /* ... same options ... */
         { value: 'from-red-500 to-orange-600', label: 'Red to Orange' }, { value: 'from-yellow-500 to-orange-600', label: 'Yellow to Orange' }, { value: 'from-green-500 to-blue-600', label: 'Green to Blue' },
         { value: 'from-blue-500 to-purple-600', label: 'Blue to Purple' }, { value: 'from-purple-500 to-pink-600', label: 'Purple to Pink' }, { value: 'from-pink-500 to-red-600', label: 'Pink to Red' },
         { value: 'from-indigo-500 to-purple-600', label: 'Indigo to Purple' }, { value: 'from-gray-600 to-gray-800', label: 'Gray Gradient' }
     ];

    // --- Render Logic ---
    return (
        <AdminLayout>
             <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Festival Collections</h1>
                        <p className="text-gray-600 mt-1">Manage collections and create custom packs</p>
                    </div>
                    <button onClick={handleAddCollection} className="mt-4 md:mt-0 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center space-x-2"> <FaPlus /> <span>Add Collection</span> </button>
                </div>

                {/* Loading/Error States */}
                 {(isLoading || productsLoading || categoriesLoading) && (<div className="p-6 bg-white rounded-lg shadow-sm text-center"> <LoadingSpinner text={isLoading ? "Loading collections..." : (productsLoading ? "Loading products..." : "Loading categories...")} /> </div>)}
                 {(error || productsError || categoriesError) && !isLoading && !productsLoading && !categoriesLoading && (<div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg"> Error: {error || productsError || categoriesError} <button onClick={fetchCollections} className="ml-4 px-2 py-1 border border-red-300 rounded text-sm hover:bg-red-100">Retry</button> </div>)}

                {/* Search - Render only when not loading/error */}
                {!isLoading && !error && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="relative max-w-md">
                            <FaSearch className="absolute left-3 top-3 text-gray-400" />
                            <input type="text" placeholder="Search collections..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"/>
                        </div>
                    </div>
                )}

                 {/* Collections List Table - Render only when not loading/error */}
                 {!isLoading && !error && (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        {filteredCollections.length === 0 ? (
                            <div className="p-8 text-center text-gray-500"> <FaBox className="mx-auto text-4xl mb-3" /> No collections found{searchTerm ? ' matching search' : ''}. </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        {/* REMOVED Products Column Header */}
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collection</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Custom Packs</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredCollections.map((collection, index) => (
                                        <tr key={collection.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap"> {/* Collection */}
                                            <div className="flex items-center">
                                                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${collection.color} flex-shrink-0`}></div>
                                                <div className="ml-4"> <div className="text-sm font-medium text-gray-900">{collection.title}</div> <div className="text-sm text-gray-500">{collection.description}</div> <div className="text-xs text-gray-400">/{collection.slug}</div> </div>
                                            </div>
                                        </td>
                                        {/* Assigned Products Column REMOVED */}
                                        <td className="px-6 py-4 whitespace-nowrap"> {/* Custom Packs */}
                                            <div className="flex items-center space-x-2"> <span className="text-sm text-gray-900"> {(collection.customPacks || []).length} packs </span> <button onClick={() => handleManagePacks(collection)} className="text-green-600 hover:text-green-800"> <FaGift /> </button> </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap"> {/* Status */}
                                            <button onClick={() => handleToggleActive(collection.id)} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ collection.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800' }`}> {collection.isActive ? <FaEye className="mr-1" /> : <FaEyeSlash className="mr-1" />} {collection.isActive ? 'Active' : 'Inactive'} </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap"> {/* Order */}
                                            <div className="flex items-center space-x-2"> <span className="text-sm text-gray-900">{collection.sortOrder}</span> <div className="flex flex-col space-y-1"> <button onClick={() => handleMove(collection.id, 'up')} disabled={index === 0} className="text-gray-400 hover:text-gray-600 disabled:opacity-30"> <FaArrowUp className="w-3 h-3" /> </button> <button onClick={() => handleMove(collection.id, 'down')} disabled={index === filteredCollections.length - 1} className="text-gray-400 hover:text-gray-600 disabled:opacity-30"> <FaArrowDown className="w-3 h-3" /> </button> </div> </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"> {/* Actions */}
                                            <div className="flex items-center justify-end space-x-2"> <button onClick={() => handleEditCollection(collection)} className="text-blue-600 hover:text-blue-900"> <FaEdit /> </button> <button onClick={() => handleDeleteCollection(collection.id)} className="text-red-600 hover:text-red-900"> <FaTrash /> </button> </div>
                                        </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                 )}

                {/* --- Modals --- */}

                {/* Add/Edit Collection Form Modal (Keep original JSX structure, assignedProducts field removed implicitly) */}
                {isFormOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            {/* ... Header ... */}
                             <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                                <h3 className="text-lg font-semibold text-gray-900"> {editingCollection ? 'Edit' : 'Add New'} Collection </h3>
                                <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-gray-600 p-2 rounded-md hover:bg-gray-100"> <FaTimes size={20} /> </button>
                             </div>
                            {/* Form */}
                            <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
                                {formError && (<div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">{formError}</div>)}
                                {/* ... Keep original inputs (Title, Slug, Sort, Desc, Color, Image, Tags) ... */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div className="md:col-span-2"> <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label> <input type="text" value={formData.title} onChange={(e) => { const t = e.target.value; setFormData(p => ({ ...p, title: t, slug: generateSlug(t) })); }} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" /> </div>
                                     <div> <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label> <input type="text" value={formData.slug} onChange={(e) => setFormData(p => ({ ...p, slug: e.target.value }))} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"/> </div>
                                     <div> <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label> <input type="number" value={formData.sortOrder} onChange={(e) => setFormData(p => ({ ...p, sortOrder: parseInt(e.target.value) || 1 }))} min="1" className="w-full px-3 py-2 border border-gray-300 rounded-lg"/> </div>
                                     <div className="md:col-span-2"> <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label> <textarea value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} required rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg"/> </div>
                                     <div> <label className="block text-sm font-medium text-gray-700 mb-2">Color</label> <select value={formData.color} onChange={(e) => setFormData(p => ({ ...p, color: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg"> {colorOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)} </select> <div className={`mt-2 h-8 rounded bg-gradient-to-r ${formData.color}`}></div> </div>
                                     <div> <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label> <input type="url" value={formData.image || ''} onChange={(e) => setFormData(p => ({ ...p, image: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg"/> </div>
                                     <div className="md:col-span-2"> <label className="block text-sm font-medium text-gray-700 mb-2">Tags (,)</label> <input type="text" value={formData.tags?.join(', ') || ''} onChange={(e) => setFormData(p => ({ ...p, tags: e.target.value.split(',').map(t=>t.trim()).filter(Boolean) }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg"/> </div>
                                </div>
                                {/* SEO */}
                                <div className="border-t pt-6">
                                     <h4 className="text-md font-medium text-gray-900 mb-4">SEO</h4>
                                     <div className="grid grid-cols-1 gap-4">
                                         <div> <label className="block text-sm font-medium text-gray-700 mb-2">Title</label> <input type="text" value={formData.seoTitle || ''} onChange={(e) => setFormData(p => ({ ...p, seoTitle: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg"/> </div>
                                         <div> <label className="block text-sm font-medium text-gray-700 mb-2">Description</label> <textarea value={formData.seoDescription || ''} onChange={(e) => setFormData(p => ({ ...p, seoDescription: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg"/> </div>
                                     </div>
                                </div>
                                {/* Settings */}
                                <div className="border-t pt-6 space-y-4">
                                     <div className="flex items-center"> <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData(p => ({ ...p, isActive: e.target.checked }))} className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"/> <label className="ml-2 block text-sm text-gray-900"> Active </label> </div>
                                     <div className="flex items-center"> <input type="checkbox" checked={formData.showAllTaggedProducts} onChange={(e) => setFormData(p => ({ ...p, showAllTaggedProducts: e.target.checked }))} className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"/> <label className="ml-2 block text-sm text-gray-900"> Show tagged products </label> </div>
                                </div>
                                {/* Actions */}
                                <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                                    <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"> Cancel </button>
                                    <button type="submit" disabled={isSaving} className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"> {isSaving ? <LoadingSpinner size="sm"/> : <FaSave />} <span>{isSaving ? 'Saving...' : (editingCollection ? 'Update' : 'Create')}</span> </button>
                                </div>
                            </form>
                        </div>
                    </div>
                 )}

                 {/* Product Assignment Modal REMOVED */}

                {/* Custom Pack Management Modal */}
                {isPackModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] flex flex-col">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                                <h3 className="text-xl font-semibold text-gray-900">Manage Custom Packs</h3>
                                <div className="flex items-center space-x-4">
                                    <button onClick={handleAddPack} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"> <FaPlus /> <span>New Pack</span> </button>
                                    <button onClick={() => setIsPackModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2 rounded-md hover:bg-gray-100"> <FaTimes /> </button>
                                </div>
                            </div>
                            {/* Modal Body */}
                            <div className="flex-1 overflow-y-auto p-6">
                                {formError && (<div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">{formError}</div>)}
                                {/* Existing Packs Display */}
                                <div className="mb-8">
                                    {/* ... Keep original Existing Packs JSX ... */}
                                     <h4 className="font-medium text-gray-900 mb-4 border-b pb-2">Existing Packs</h4>
                                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                         {(collections.find(c => c.id === selectedCollectionId)?.customPacks || []).length === 0 ? ( <p className="text-gray-500 text-sm md:col-span-full">No packs created yet.</p> ) :
                                          (collections.find(c => c.id === selectedCollectionId)?.customPacks || []).map(pack => (
                                             <div key={pack.id} className={`border rounded-lg p-3 ${editingPack?.id === pack.id ? 'bg-blue-50 border-blue-300' : 'bg-gray-50'}`}>
                                                 {pack.image && <img src={pack.image} alt={pack.name} className="w-full h-24 object-cover rounded mb-2 border"/>}
                                                 <h5 className="font-medium text-sm mb-1 line-clamp-1">{pack.name}</h5>
                                                 <p className="text-xs text-gray-600 mb-2 line-clamp-2">{pack.description}</p>
                                                 <div className="flex items-center justify-between mb-2"> <span className="text-red-600 font-semibold text-sm">{formatPriceSimple(pack.price)}</span> {pack.mrp > pack.price && <span className="text-xs text-gray-500 line-through">{formatPriceSimple(pack.mrp)}</span>} </div>
                                                 <div className="text-xs text-gray-500 mb-2">{(pack.products || []).length} products</div>
                                                  <span className={`inline-block px-2 py-0.5 rounded text-xs ${pack.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}> {pack.isActive ? 'Active' : 'Inactive'} </span>
                                                 <div className="flex space-x-2 mt-3"> <button onClick={() => handleEditPack(pack)} className="flex-1 py-1.5 rounded text-xs bg-blue-100 text-blue-700 hover:bg-blue-200"> Edit </button> <button onClick={() => handleDeletePack(pack.id)} className="flex-1 py-1.5 rounded text-xs bg-red-100 text-red-700 hover:bg-red-200"> Delete </button> </div>
                                             </div>
                                          ))}
                                     </div>
                                </div>
                                {/* Pack Edit/Create Form */}
                                <div className="border-t pt-6">
                                    <h4 className="font-medium text-gray-900 mb-4">{editingPack ? 'Edit Pack Details' : 'Create New Pack'}</h4>
                                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                                        {/* Left Side: Form Fields */}
                                        <div className="lg:col-span-2 space-y-4">
                                            {/* ... Keep original Pack Form Fields JSX ... */}
                                             <div> <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label> <input type="text" value={packFormData.name} onChange={(e) => setPackFormData(p => ({ ...p, name: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg"/> </div>
                                             <div> <label className="block text-sm font-medium text-gray-700 mb-2">Desc *</label> <textarea value={packFormData.description} onChange={(e) => setPackFormData(p => ({ ...p, description: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg"/> </div>
                                             <div className="grid grid-cols-2 gap-4"> <div> <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label> <input type="number" value={packFormData.price || ''} onChange={(e) => setPackFormData(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg"/> </div> <div> <label className="block text-sm font-medium text-gray-700 mb-2">MRP *</label> <input type="number" value={packFormData.mrp || ''} onChange={(e) => setPackFormData(p => ({ ...p, mrp: parseFloat(e.target.value) || 0 }))} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg"/> </div> </div>
                                             <div> <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label> <input type="url" value={packFormData.image || ''} onChange={(e) => setPackFormData(p => ({ ...p, image: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg"/> </div>
                                             <div className="flex items-center"> <input type="checkbox" checked={packFormData.isActive} onChange={(e) => setPackFormData(p => ({ ...p, isActive: e.target.checked }))} className="h-4 w-4 text-red-600 border-gray-300 rounded"/> <label className="ml-2 block text-sm"> Active </label> </div>
                                             <div className="bg-gray-50 p-3 rounded-lg border text-sm"> <p>Individual Total: <strong>{formatPriceSimple(calculatePackTotal())}</strong></p> <p>Pack Price: <strong>{formatPriceSimple(packFormData.price || 0)}</strong></p> {(calculatePackTotal() > (packFormData.price||0)) && <p className="text-green-600">Saves: <strong>{formatPriceSimple(calculatePackTotal() - (packFormData.price||0))}</strong></p>} </div>
                                             <div className="flex items-center space-x-3 pt-3 border-t"> <button type="button" onClick={handleAddPack} className="px-4 py-2 border rounded-lg hover:bg-gray-50"> Clear/New </button> <button type="button" onClick={handleSavePack} disabled={isSaving} className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"> {isSaving ? <LoadingSpinner size="sm"/> : <FaSave/>} <span>{editingPack ? 'Update' : 'Create'} Pack</span> </button> </div>
                                        </div>
                                        {/* Right Side: Product Selection with Categories */}
                                        <div className="lg:col-span-3">
                                            <label className="block text-sm font-medium text-gray-700 mb-2"> Add Products ({packProducts.length} selected) </label>
                                            <div className="h-[500px] flex flex-col border rounded-lg">
                                                {/* Category Selection */}
                                                <div className="p-3 border-b bg-gray-50 flex flex-wrap gap-2">
                                                    <button type="button" onClick={() => setSelectedPackCategoryFilter(null)} className={`px-3 py-1 rounded text-xs ${!selectedPackCategoryFilter ? 'bg-red-600 text-white' : 'bg-white hover:bg-gray-100 border'}`}> All </button>
                                                    {categoriesLoading ? <span>...</span> : categoriesError ? <span className="text-xs text-red-500">!</span> :
                                                     categories.map(cat => ( <button key={cat.id} type="button" onClick={() => setSelectedPackCategoryFilter(cat.id)} className={`px-3 py-1 rounded text-xs ${selectedPackCategoryFilter === cat.id ? 'bg-red-600 text-white' : 'bg-white hover:bg-gray-100 border'}`}> {cat.name} </button> ))}
                                                </div>
                                                {/* Selected Products */}
                                                <div className="p-3 border-b bg-gray-100 max-h-[150px] overflow-y-auto">
                                                     <h5 className="text-xs font-semibold mb-1 text-gray-600">Selected ({packProducts.length})</h5>
                                                     {packProducts.length === 0 ? (<p className="text-xs text-gray-500">None</p>) : packProducts.map(item => { const product = getProductById(item.productId); return (
                                                         <div key={item.productId} className="flex items-center justify-between text-xs py-1"> <span className="line-clamp-1 flex-1 pr-2">{product?.name || '...'}</span> <input type="number" min="1" value={item.quantity} onChange={e => updatePackProductQuantity(item.productId, parseInt(e.target.value))} className="w-12 text-center border rounded px-1 py-0.5"/> <button onClick={() => removeProductFromPack(item.productId)} className="ml-2 text-red-500 hover:text-red-700"><FaTimes size={10}/></button> </div>
                                                      );})}
                                                </div>
                                                {/* Available Products (Filtered) */}
                                                <div className="flex-1 overflow-y-auto p-3">
                                                     {productsLoading ? (<LoadingSpinner/>) : productsError ? (<p className="text-red-500 text-xs">{productsError}</p>) :
                                                     filteredPackProducts.length === 0 ? (<p className="text-center text-xs text-gray-500 py-4">No products in this category.</p>) :
                                                     filteredPackProducts.map(product => (
                                                         <div key={product.id} className="flex items-center justify-between py-2 border-b last:border-0">
                                                             <div className="flex items-center space-x-2"> <img src={product.images[0]} alt="" className="w-8 h-8 object-cover rounded"/> <span className="text-xs font-medium line-clamp-1">{product.name}</span> </div>
                                                             <button onClick={() => addProductToPack(product.id)} className="px-2 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700" disabled={packProducts.some(p => p.productId === product.id)}>Add</button>
                                                         </div>
                                                     ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Modal Footer (part of form) */}
                        </div>
                    </div>
                )}


            </div>
            {/* NO <style> block - Reverted to direct Tailwind classes */}
        </AdminLayout>
    );
};

export default FestivalCollectionsManagement;