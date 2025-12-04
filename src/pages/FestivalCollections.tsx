import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { formatPriceSimple, calculateDiscount } from '../utils/formatPrice';
import { useCart } from '../context/CartContext';
import { FaShoppingCart, FaGift, FaBox } from 'react-icons/fa';
import { Product } from '../data/types';
import { useProducts } from '../context/ProductContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

// --- Interfaces matching Backend Models ---
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
const PackCard: React.FC<{ pack: CollectionProductPackFE; allProducts: Product[] }> = ({ pack, allProducts }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  // ✅ FIX: Use async/await and pass quantity directly to addToCart
  const handleAddPackToCart = async () => {
    setIsAdding(true);
    let productsFound = 0;

    for (const item of pack.products) {
      const product = allProducts.find(p => p.id === item.productId);
      
      if (product) {
        // Determine how many we can actually add based on stock
        const quantityToAdd = Math.min(item.quantity, product.stock);
        
        if (quantityToAdd > 0) {
            // Pass the calculated quantity directly!
            await addToCart(product, quantityToAdd);
            productsFound++;
        } else {
            console.warn(`Skipping ${product.name}: Out of stock`);
        }
      } else { 
          console.warn(`Product ID ${item.productId} not found in catalog.`); 
      }
    }

    setIsAdding(false);
    if (productsFound > 0) {
        alert(`${pack.name} added to cart successfully!`);
    } else {
        alert(`Could not add items from ${pack.name} (Check stock availability).`);
    }
  };

  const discount = calculateDiscount(pack.mrp, pack.price);
  const individualTotal = pack.products.reduce((total, item) => {
    const product = allProducts.find(p => p.id === item.productId);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);

  return (
     <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border-2 border-orange-200 flex flex-col h-full">
      <div className="relative h-48 bg-gray-100">
        {pack.image ? (
            <img src={pack.image} alt={pack.name} className="w-full h-full object-cover" onError={(e)=>(e.target as HTMLImageElement).src='https://via.placeholder.com/400x300?text=Pack+Image'}/>
        ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400"><FaGift size={40} /></div>
        )}
        <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold flex items-center space-x-1"> <FaGift /> <span>PACK DEAL</span> </div>
        {discount > 0 && <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold"> {discount}% OFF </div>}
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-lg mb-2 text-gray-900">{pack.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{pack.description}</p>
        
        <div className="flex items-center space-x-2 mb-3"> 
            <span className="text-2xl font-bold text-red-600"> {formatPriceSimple(pack.price)} </span> 
            {pack.mrp > pack.price && <span className="text-lg text-gray-500 line-through"> {formatPriceSimple(pack.mrp)} </span>} 
        </div>
        
        {individualTotal > pack.price && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-4"> 
                <p className="text-sm text-green-800 font-medium"> Save {formatPriceSimple(individualTotal - pack.price)} </p> 
            </div>
        )}
        
        <div className="mb-4 flex-1">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Pack Contents:</h4>
          <div className="space-y-1 bg-gray-50 p-2 rounded">
            {pack.products.slice(0, 3).map(item => { 
                const product = allProducts.find(p => p.id === item.productId); 
                return product ? ( 
                    <div key={item.productId} className="flex items-center justify-between text-xs text-gray-700"> 
                        <span className="line-clamp-1 flex-1 pr-2">{product.name}</span> 
                        <span className="font-bold whitespace-nowrap">x {item.quantity}</span> 
                    </div> 
                ) : null; 
            })}
            {pack.products.length > 3 && <p className="text-xs text-gray-500 text-center pt-1">+ {pack.products.length - 3} more items</p>}
          </div>
        </div>
        
        <button 
            onClick={handleAddPackToCart} 
            disabled={isAdding}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
        > 
            {isAdding ? <LoadingSpinner size="sm" color="text-white" /> : <FaShoppingCart />} 
            <span>{isAdding ? 'Adding...' : 'Add to Cart'}</span> 
        </button>
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
    const { products: allProducts, isLoading: productsLoading, error: productsError } = useProducts();

    // Fetch active collections from backend on mount
    useEffect(() => {
        const fetchActiveCollections = async () => {
            setIsLoading(true); setError(null);
            try {
                const response = await api.get('/collections');
                const fetchedData: FestivalCollectionBE[] = response.data;
                 const mappedCollections = fetchedData.map((col): FestivalCollectionFE => ({
                    ...col, id: col._id,
                    customPacks: (col.customPacks || []).map((pack, index) => ({ 
                        ...pack, 
                        id: pack._id || `temp-${col._id}-${index}`, 
                        _id: pack._id 
                    }))
                }));
                setCollections(mappedCollections);
                if (mappedCollections.length > 0) { setActiveCollectionSlug(mappedCollections[0].slug); }
            } catch (err: any) { 
                console.error("Error fetching collections:", err);
                setError(err.response?.data?.message || err.message || 'Failed load.'); 
                setCollections([]); 
            } finally { setIsLoading(false); }
        };
        fetchActiveCollections();
    }, []);

    const activeCollectionData = useMemo(() => {
        return collections.find(c => c.slug === activeCollectionSlug);
    }, [collections, activeCollectionSlug]);

    if (isLoading || productsLoading) {
        return ( <div className="min-h-screen bg-gray-50 flex flex-col"> <Header /> <div className="flex-1 flex items-center justify-center"> <LoadingSpinner text="Loading collections..." /> </div> <Footer /> </div> );
    }

     if (error || productsError) {
        return ( <div className="min-h-screen bg-gray-50 flex flex-col"> <Header /> <div className="flex-1 max-w-7xl mx-auto px-4 py-16 text-center text-red-600"> <p>Error:</p> {error && <p>- Collections: {error}</p>} {productsError && <p>- Products: {productsError}</p>} </div> <Footer /> </div> );
    }

    if (collections.length === 0) {
         return ( <div className="min-h-screen bg-gray-50 flex flex-col"> <Header /> <div className="max-w-7xl mx-auto px-4 py-16 text-center"> <FaBox className="text-6xl text-gray-400 mx-auto mb-4" /> <h1 className="text-4xl font-bold mb-4">Collections</h1> <p className="text-xl mb-8">No active collections found.</p> <Link to="/shop" className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700"> Browse Products </Link> </div> <Footer /> </div> );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-16">
                    <div className="max-w-7xl mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">Festival Collections</h1>
                        <p className="text-xl md:text-2xl">Curated fireworks packs for every celebration</p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-12">
                    {/* Collection Tabs */}
                    <div className="flex flex-wrap justify-center mb-12 gap-3 md:gap-4">
                        {collections.map((collection) => (
                            <button key={collection.slug} onClick={() => setActiveCollectionSlug(collection.slug)} 
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
                                      {activeCollectionData.image && ( <div className="mb-6"> <img src={activeCollectionData.image} alt={activeCollectionData.title} className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-full mx-auto border-4 border-white/50 shadow-lg" onError={(e)=>(e.target as HTMLImageElement).src='https://via.placeholder.com/150'}/> </div> )}
                                      <h2 className="text-3xl md:text-4xl font-bold mb-3">{activeCollectionData.title}</h2>
                                      <p className="text-lg md:text-xl mb-6 max-w-3xl mx-auto">{activeCollectionData.description}</p>

                                    <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6 text-sm mb-6">
                                         {(activeCollectionData.customPacks || []).filter(p => p.isActive).length > 0 && (
                                            <div className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full font-medium">
                                                {(activeCollectionData.customPacks || []).filter(p => p.isActive).length} Special Packs Available
                                            </div>
                                        )}
                                    </div>
                                    
                                    {activeCollectionData.tags && activeCollectionData.tags.length > 0 && ( 
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
                                            <span className="font-semibold text-lg">Special Pack Deals</span>
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
                                <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100">
                                    <FaGift className="text-6xl text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Special Packs Yet</h3>
                                    <p className="text-gray-600 mb-6">There are currently no special packs available for this collection.</p>
                                    <Link to="/shop" className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow"> Browse All Products </Link>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default FestivalCollections;