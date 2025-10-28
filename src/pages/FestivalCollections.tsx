import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header'; //
import Footer from '../components/Footer'; //
// ProductCard import removed as it's no longer used directly here
import { formatPriceSimple, calculateDiscount } from '../utils/formatPrice'; //
import { useCart } from '../context/CartContext'; //
import { FaShoppingCart, FaGift, FaBox } from 'react-icons/fa';
import { Product } from '../data/types'; //
import { useProducts } from '../context/ProductContext'; //
import api from '../services/api'; //
import LoadingSpinner from '../components/LoadingSpinner'; //

// --- Interfaces matching Backend Models ---
// (Should match structures in FestivalCollectionsManagement.tsx)
interface CollectionProductPackBE {
    _id?: string;
    id?: string;
    name: string;
    description: string;
    price: number;
    mrp: number;
    image?: string;
    products: {
        productId: string;
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
    assignedProducts: string[];
    customPacks?: CollectionProductPackBE[];
    showAllTaggedProducts: boolean;
    createdAt: string;
    updatedAt: string;
}

// Frontend type
interface FestivalCollectionFE extends Omit<FestivalCollectionBE, '_id' | 'customPacks'> {
    id: string;
    customPacks: CollectionProductPackFE[];
}
interface CollectionProductPackFE extends Omit<CollectionProductPackBE, '_id' | 'id'> {
     id: string;
     _id?: string;
}


// --- Updated PackCard Component ---
// (Keep the PackCard component exactly as it was in the previous correct version)
const PackCard: React.FC<{ pack: CollectionProductPackFE; allProducts: Product[] }> = ({ pack, allProducts }) => {
  const { addToCart } = useCart(); //

  const handleAddPackToCart = () => {
    let itemsAddedCount = 0;
    pack.products.forEach(item => {
      const product = allProducts.find(p => p.id === item.productId);
      if (product) {
        if (product.stock >= item.quantity) {
            for (let i = 0; i < item.quantity; i++) { addToCart(product); }
            itemsAddedCount += item.quantity;
        } else {
             alert(`Could not add ${item.quantity} x ${product.name}, only ${product.stock} available.`);
             for (let i = 0; i < product.stock; i++) { addToCart(product); }
             itemsAddedCount += product.stock;
        }
      } else { console.warn(`Product ID ${item.productId} not found.`); }
    });
    if (itemsAddedCount > 0) { alert(`${pack.name} (${itemsAddedCount} items) added!`); }
    else { alert(`Could not add items from ${pack.name}.`); }
  };

  const discount = calculateDiscount(pack.mrp, pack.price); //
  const individualTotal = pack.products.reduce((total, item) => {
    const product = allProducts.find(p => p.id === item.productId);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);

  return (
     <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border-2 border-orange-200">
      <div className="relative">
        {pack.image && <img src={pack.image} alt={pack.name} className="w-full h-48 object-cover" onError={(e)=>(e.target as HTMLImageElement).src='fallback-image.png'}/>}
        <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold flex items-center space-x-1"> <FaGift /> <span>PACK DEAL</span> </div>
        {discount > 0 && <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold"> {discount}% OFF </div>}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 text-gray-900">{pack.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{pack.description}</p>
        <div className="flex items-center space-x-2 mb-3"> <span className="text-2xl font-bold text-red-600"> {formatPriceSimple(pack.price)} </span> {pack.mrp > pack.price && <span className="text-lg text-gray-500 line-through"> {formatPriceSimple(pack.mrp)} </span>} </div>
        {individualTotal > pack.price && (<div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4"> <p className="text-sm text-green-800"> <strong>Save:</strong> {formatPriceSimple(individualTotal - pack.price)} </p> <p className="text-xs text-green-600"> Ind. price: {formatPriceSimple(individualTotal)} </p> </div>)}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Includes:</h4>
          <div className="space-y-1">
            {pack.products.slice(0, 3).map(item => { const product = allProducts.find(p => p.id === item.productId); return product ? ( <div key={item.productId} className="flex items-center justify-between text-xs text-gray-600"> <span className="line-clamp-1">{product.name}</span> <span className="font-medium">×{item.quantity}</span> </div> ) : null; })}
            {pack.products.length > 3 && <p className="text-xs text-gray-500">+ {pack.products.length - 3} more</p>}
          </div>
        </div>
        <button onClick={handleAddPackToCart} className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all flex items-center justify-center space-x-2"> <FaShoppingCart /> <span>Add Pack</span> </button>
      </div>
    </div>
  );
};

// --- Main FestivalCollections Component ---
const FestivalCollections: React.FC = () => {
    const [collections, setCollections] = useState<FestivalCollectionFE[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCollectionSlug, setActiveCollectionSlug] = useState<string>('');
    const { products: allProducts, isLoading: productsLoading, error: productsError } = useProducts(); //

    // Fetch active collections from backend on mount
    useEffect(() => {
        const fetchActiveCollections = async () => { /* ... Keep fetch logic exactly the same ... */
            setIsLoading(true); setError(null);
            try {
                const response = await api.get('/collections'); //
                const fetchedData: FestivalCollectionBE[] = response.data;
                 const mappedCollections = fetchedData.map((col): FestivalCollectionFE => ({
                    ...col, id: col._id,
                    customPacks: (col.customPacks || []).map((pack, index) => ({ ...pack, id: pack._id || `temp-${col._id}-${index}`, _id: pack._id }))
                }));
                setCollections(mappedCollections);
                if (mappedCollections.length > 0) { setActiveCollectionSlug(mappedCollections[0].slug); }
            } catch (err: any) { setError(err.response?.data?.message || err.message || 'Failed load.'); setCollections([]); }
            finally { setIsLoading(false); }
        };
        fetchActiveCollections();
    }, []);

    // Function to get products (REMOVED - Not needed anymore on this page)
    // const getProductsForCollection = useCallback(...) => { ... };

    // Find the currently active collection data from state
    const activeCollectionData = useMemo(() => { // Same logic
        return collections.find(c => c.slug === activeCollectionSlug);
    }, [collections, activeCollectionSlug]);

    // Calculate products (REMOVED - Not needed anymore)
    // const activeCollectionProducts = useMemo(() => { ... });


    // --- Render Logic ---

    // Combined Loading State
    if (isLoading || productsLoading) { /* ... Keep Loading JSX ... */
        return ( <div className="min-h-screen bg-gray-50 flex flex-col"> <Header /> <div className="flex-1 flex items-center justify-center"> <LoadingSpinner text="Loading collections..." /> </div> <Footer /> </div> );
    }

    // Combined Error State
     if (error || productsError) { /* ... Keep Error JSX ... */
        return ( <div className="min-h-screen bg-gray-50 flex flex-col"> <Header /> <div className="flex-1 max-w-7xl mx-auto px-4 py-16 text-center text-red-600"> <p>Error:</p> {error && <p>- Collections: {error}</p>} {productsError && <p>- Products: {productsError}</p>} </div> <Footer /> </div> );
    }

    // No Collections State
    if (collections.length === 0) { /* ... Keep No Collections JSX ... */
         return ( <div className="min-h-screen bg-gray-50 flex flex-col"> <Header /> <div className="max-w-7xl mx-auto px-4 py-16 text-center"> <FaBox className="text-6xl text-gray-400 mx-auto mb-4" /> <h1 className="text-4xl font-bold mb-4">Collections</h1> <p className="text-xl mb-8">None available.</p> <Link to="/shop" className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700"> Browse Products </Link> </div> <Footer /> </div> );
    }

    // --- Main Render with Data ---
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-16">
                    <div className="max-w-7xl mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">Festival Collections</h1>
                        <p className="text-xl md:text-2xl">Curated fireworks packs for every celebration</p> {/* Updated text */}
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-12">
                    {/* Collection Tabs */}
                    <div className="flex flex-wrap justify-center mb-12 gap-3 md:gap-4">
                        {collections.map((collection) => (
                            <button key={collection.slug} onClick={() => setActiveCollectionSlug(collection.slug)} /* ... Keep button styling ... */
                                className={`px-5 py-2.5 md:px-6 md:py-3 rounded-full font-semibold text-sm md:text-base transition-all duration-300 transform hover:scale-105 ${ activeCollectionSlug === collection.slug ? `bg-gradient-to-r ${collection.color} text-white shadow-lg ring-2 ring-white/50` : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm border border-gray-200' }`} >
                                {collection.title}
                            </button>
                        ))}
                    </div>

                    {/* Active Collection Details */}
                    {activeCollectionData && (
                        <>
                            {/* Collection Header */}
                            <div className="text-center mb-12">
                                <div className={`bg-gradient-to-br ${activeCollectionData.color} text-white rounded-2xl shadow-xl p-6 md:p-10 mb-8`}>
                                     {/* ... Keep Image, Title, Description ... */}
                                      {activeCollectionData.image && ( <div className="mb-6"> <img src={activeCollectionData.image} alt={activeCollectionData.title} className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-full mx-auto border-4 border-white/50 shadow-lg" onError={(e)=>(e.target as HTMLImageElement).src='fallback-image.png'}/> </div> )}
                                      <h2 className="text-3xl md:text-4xl font-bold mb-3">{activeCollectionData.title}</h2>
                                      <p className="text-lg md:text-xl mb-6 max-w-3xl mx-auto">{activeCollectionData.description}</p>

                                    {/* Stats (REMOVED Product Count Stat) */}
                                    <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6 text-sm mb-6">
                                        {/* Product count removed */}
                                         {(activeCollectionData.customPacks || []).filter(p => p.isActive).length > 0 && (
                                            <div className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full font-medium">
                                                {(activeCollectionData.customPacks || []).filter(p => p.isActive).length} Special Packs Available
                                            </div>
                                        )}
                                    </div>
                                    {/* Tags */}
                                    {activeCollectionData.tags && activeCollectionData.tags.length > 0 && ( /* ... Keep Tags JSX ... */
                                        <div className="flex flex-wrap justify-center gap-2"> {activeCollectionData.tags.map((tag, index) => ( <span key={index} className="bg-white/25 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium"> #{tag} </span> ))} </div>
                                     )}
                                </div>
                            </div>

                            {/* Custom Packs Section */}
                            {(activeCollectionData.customPacks || []).filter(p => p.isActive).length > 0 ? (
                                <div className="mb-16">
                                    <div className="flex items-center justify-center mb-10">
                                        <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-800 px-5 py-2.5 rounded-full shadow">
                                            <FaGift size={18} />
                                            <span className="font-semibold text-lg">Special Pack Deals for {activeCollectionData.title}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {(activeCollectionData.customPacks || [])
                                            .filter(pack => pack.isActive)
                                            .map(pack => (
                                                <PackCard key={pack.id} pack={pack} allProducts={allProducts} />
                                            ))}
                                    </div>
                                </div>
                            ) : (
                                // No Packs Message
                                <div className="text-center py-16">
                                    <FaGift className="text-6xl text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Special Packs Yet</h3>
                                    <p className="text-gray-600 mb-6">There are currently no special packs available for the {activeCollectionData.title} collection.</p>
                                    <Link to="/shop" className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow hover:shadow-md"> Browse All Products </Link>
                                </div>
                            )}

                             {/* Individual Products Section REMOVED */}

                            {/* No Products/Packs Message REMOVED (Covered by No Packs Message) */}

                        </>
                    )}

                    {/* View All Button */}
                    {/* <div className="text-center mt-16">
                        <Link to="/shop" className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow hover:shadow-md">
                            View All Products
                        </Link>
                    </div> */}
                </div>
            </main>
            <Footer />
            {/* Style block removed as requested */}
        </div>
    );
};

export default FestivalCollections;