import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { formatPriceSimple, calculateDiscount } from '../utils/formatPrice';
import { useCart } from '../context/CartContext';
import { FaShoppingCart, FaGift, FaBox, FaCheckCircle, FaArrowRight, FaStar, FaFire } from 'react-icons/fa';
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
const PackCard: React.FC<{ pack: CollectionProductPackFE; allProducts: Product[]; index: number }> = ({ pack, allProducts, index }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleAddPackToCart = async () => {
    setIsAdding(true);
    let productsFound = 0;

    for (const item of pack.products) {
      const product = allProducts.find(p => p.id === item.productId);

      if (product) {
        const quantityToAdd = Math.min(item.quantity, product.stock);

        if (quantityToAdd > 0) {
            await addToCart(product, quantityToAdd);
            productsFound++;
        }
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
  const savings = pack.mrp - pack.price;

  return (
     <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.08] hover:border-accent/30 transition-all duration-500 hover:shadow-[0_8px_40px_rgba(230,57,70,0.15)]"
    >
      {/* Image Section */}
      <div className="relative h-72 overflow-hidden">
        {pack.image ? (
            <img
              src={pack.image}
              alt={pack.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              onError={(e)=>(e.target as HTMLImageElement).src='https://via.placeholder.com/600x400?text=Pack+Image'}
            />
        ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 to-gold/20">
              <FaGift size={80} className="text-white/30" />
            </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-surface-900/60 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
          {index === 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold text-surface-900 text-xs font-bold">
              <FaStar size={12} />
              <span>BESTSELLER</span>
            </div>
          )}
          {discount > 0 && (
            <div className="ml-auto px-3 py-1.5 rounded-full bg-accent text-white text-xs font-bold">
              {discount}% OFF
            </div>
          )}
        </div>

        {/* Bottom Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="font-bold text-2xl text-white mb-1">{pack.name}</h3>
          <p className="text-white/80 text-sm line-clamp-1">{pack.description}</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Price Section */}
        <div className="mb-6">
          <div className="flex items-end gap-3 mb-2">
            <span className="text-3xl font-bold text-white">{formatPriceSimple(pack.price)}</span>
            {pack.mrp > pack.price && (
              <span className="text-lg text-surface-500 line-through mb-1">{formatPriceSimple(pack.mrp)}</span>
            )}
          </div>
          {savings > 0 && (
            <p className="text-sm text-green-400 font-semibold">
              You save {formatPriceSimple(savings)}
            </p>
          )}
        </div>

        {/* Pack Contents Preview */}
        <div className="mb-6">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between text-left py-3 px-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 group/btn"
          >
            <h4 className="text-sm font-semibold text-surface-400 uppercase tracking-wider">
              What's Inside ({pack.products.length} items)
            </h4>
            <FaArrowRight
              size={12}
              className={`text-surface-400 group-hover/btn:text-accent transition-all duration-300 ${showDetails ? 'rotate-90' : ''}`}
            />
          </button>

          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mt-3"
              >
                <div className="space-y-2 bg-white/[0.03] p-4 rounded-xl border border-white/[0.06] max-h-48 overflow-y-auto">
                  {pack.products.map(item => {
                      const product = allProducts.find(p => p.id === item.productId);
                      return product ? (
                          <div key={item.productId} className="flex items-center justify-between text-sm">
                              <span className="text-surface-300 line-clamp-1 flex-1 pr-3">{product.name}</span>
                              <span className="font-bold text-accent whitespace-nowrap">× {item.quantity}</span>
                          </div>
                      ) : null;
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Add to Cart Button */}
        <button
            onClick={handleAddPackToCart}
            disabled={isAdding}
            className="w-full relative px-6 py-4 bg-accent text-white font-bold rounded-full transition-all duration-300 hover:shadow-[0_0_40px_rgba(230,57,70,0.5)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group/cart"
        >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isAdding ? (
                <span>Adding to cart...</span>
              ) : (
                <>
                  <FaShoppingCart />
                  <span>Add Pack to Cart</span>
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-rose-600 opacity-0 group-hover/cart:opacity-100 transition-opacity duration-300" />
        </button>
      </div>

      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
    </motion.div>
  );
};

// --- Main FestivalCollections Component ---
const FestivalCollections: React.FC = () => {
    const [collections, setCollections] = useState<FestivalCollectionFE[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCollectionSlug, setActiveCollectionSlug] = useState<string>('');
    const { products: allProducts, isLoading: productsLoading, error: productsError } = useProducts();

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
        return (
          <div className="min-h-screen bg-surface-900 flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center">
              <LoadingSpinner fullScreen text="Loading festival collections..." />
            </div>
          </div>
        );
    }

     if (error || productsError) {
        return (
          <div className="min-h-screen bg-surface-900 flex flex-col">
            <Header />
            <div className="flex-1 max-w-7xl mx-auto px-6 py-16 text-center">
              <div className="text-accent text-6xl mb-6">⚠️</div>
              <p className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</p>
              {error && <p className="text-surface-400 mt-2">{error}</p>}
            </div>
            <Footer />
          </div>
        );
    }

    if (collections.length === 0) {
         return (
          <div className="min-h-screen bg-surface-900 flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center">
              <div className="max-w-2xl mx-auto px-6 text-center">
                <FaBox className="text-8xl text-surface-600 mx-auto mb-8" />
                <h1 className="text-5xl font-bold text-white mb-4">No Collections Yet</h1>
                <p className="text-xl text-surface-400 mb-10">We're preparing something special for you. Check back soon!</p>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-3 px-10 py-4 bg-accent text-white font-bold text-lg rounded-full hover:shadow-[0_0_40px_rgba(230,57,70,0.4)] transition-all hover:scale-105"
                >
                  Browse All Products
                  <FaArrowRight />
                </Link>
              </div>
            </div>
            <Footer />
          </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-900">
            <Header />

            <main className="pt-28 pb-20">
                {/* Hero Section with Background */}
                <div className="relative overflow-hidden mb-16">
                  {/* Background Decorations */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/[0.05] rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/[0.05] rounded-full blur-[120px]" />
                  </div>

                  <div className="max-w-7xl mx-auto px-6 relative z-10">
                    {/* Header */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7 }}
                      className="text-center mb-12"
                    >
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <FaFire className="text-accent" size={20} />
                        <p className="text-[11px] font-semibold text-accent tracking-[0.2em] uppercase">
                          Festival Collections
                        </p>
                      </div>
                      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-[-0.02em] leading-[1.05] mb-6">
                        Curated packs for<br />
                        <span className="bg-gradient-to-r from-accent via-rose-500 to-gold bg-clip-text text-transparent">
                          every celebration.
                        </span>
                      </h1>
                      <p className="text-lg md:text-xl text-surface-400 max-w-3xl mx-auto leading-relaxed">
                        {activeCollectionData?.description || 'Handpicked combo packs featuring the best crackers for your festivals at amazing prices.'}
                      </p>
                    </motion.div>

                    {/* Collection Tabs */}
                    {collections.length > 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-wrap gap-3 justify-center"
                      >
                        {collections.map((col) => (
                          <button
                            key={col.slug}
                            onClick={() => setActiveCollectionSlug(col.slug)}
                            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                              activeCollectionSlug === col.slug
                                ? 'bg-accent text-white shadow-[0_0_30px_rgba(230,57,70,0.3)] scale-105'
                                : 'bg-white/[0.05] text-surface-300 border border-white/[0.1] hover:bg-white/[0.08] hover:text-white'
                            }`}
                          >
                            {col.title}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Active Collection Content */}
                <div className="max-w-7xl mx-auto px-6">
                  <AnimatePresence mode="wait">
                    {activeCollectionData && (
                        <motion.div
                          key={activeCollectionData.slug}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.4 }}
                        >
                            {/* Custom Packs Grid */}
                            {(activeCollectionData.customPacks || []).filter(p => p.isActive).length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {(activeCollectionData.customPacks || [])
                                        .filter(pack => pack.isActive)
                                        .map((pack, index) => (
                                            <PackCard key={pack.id} pack={pack} allProducts={allProducts} index={index} />
                                        ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 rounded-3xl bg-white/[0.02] border border-white/[0.08]">
                                    <FaGift className="text-7xl text-surface-600 mx-auto mb-6" />
                                    <h3 className="text-2xl font-bold text-white mb-3">No Packs Available</h3>
                                    <p className="text-surface-400 mb-8 text-lg">This collection is being updated. Check back soon!</p>
                                    <Link
                                      to="/shop"
                                      className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-white font-semibold rounded-full hover:shadow-[0_0_30px_rgba(230,57,70,0.4)] transition-all hover:scale-105"
                                    >
                                      Browse All Products
                                      <FaArrowRight />
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    )}
                  </AnimatePresence>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default FestivalCollections;
