import { Product } from "./types";
export interface CollectionProductPack {
  id: string;
  name: string;
  description: string;
  price: number;
  mrp: number;
  image: string;
  products: {
    productId: string;
    quantity: number;
  }[];
  isActive: boolean;
  createdAt: string;
}

export interface FestivalCollection {
  id: string;
  title: string;
  description: string;
  slug: string; // URL-friendly version of title
  color: string; // Gradient classes
  image: string;
  isActive: boolean;
  sortOrder: number;
  tags: string[]; // Tags to filter products
  seoTitle?: string;
  seoDescription?: string;
  
  // ✅ Enhanced features for admin control
  assignedProducts: string[]; // Product IDs manually assigned by admin
  customPacks: CollectionProductPack[]; // Custom product packs for this collection
  showAllTaggedProducts: boolean; // Whether to also show products filtered by tags
  
  createdAt: string;
  updatedAt: string;
}

// Enhanced default festival collections
export const festivalCollections: FestivalCollection[] = [
  {
    id: 'diwali-2024',
    title: 'Diwali Special',
    description: 'Light up your Diwali with our premium collection of sparklers and crackers',
    slug: 'diwali-special',
    color: 'from-yellow-500 to-orange-600',
    image: 'https://images.unsplash.com/photo-1605712834672-6ad5d0c5c3b8?w=600&h=400&fit=crop',
    isActive: true,
    sortOrder: 1,
    tags: ['diwali', 'festival', 'premium'],
    assignedProducts: ['SP001', 'SP002', 'GC001'], // Admin-assigned products
    customPacks: [
      {
        id: 'diwali-family-pack',
        name: 'Diwali Family Celebration Pack',
        description: 'Complete family pack with sparklers, ground chakras, and flower pots for the perfect Diwali celebration',
        price: 1299,
        mrp: 1599,
        image: 'https://images.unsplash.com/photo-1605712834672-6ad5d0c5c3b8?w=400&h=400&fit=crop',
        products: [
          { productId: 'SP001', quantity: 2 },
          { productId: 'GC001', quantity: 3 },
          { productId: 'FP001', quantity: 1 }
        ],
        isActive: true,
        createdAt: new Date('2024-01-01').toISOString()
      },
      {
        id: 'diwali-premium-pack',
        name: 'Diwali Premium Gold Pack',
        description: 'Luxury fireworks collection for grand Diwali celebrations with premium sparklers and rockets',
        price: 2499,
        mrp: 2999,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
        products: [
          { productId: 'SP001', quantity: 4 },
          { productId: 'CR001', quantity: 2 },
          { productId: 'FP001', quantity: 2 }
        ],
        isActive: true,
        createdAt: new Date('2024-01-01').toISOString()
      }
    ],
    showAllTaggedProducts: true,
    seoTitle: 'Diwali Special Crackers Collection | Sparkle Crackers',
    seoDescription: 'Celebrate Diwali with our premium collection of sparklers, crackers and fireworks.',
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'dussehra-2024',
    title: 'Dussehra Celebration',
    description: 'Celebrate the victory of good over evil with spectacular fireworks',
    slug: 'dussehra-celebration',
    color: 'from-red-500 to-pink-600',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
    isActive: true,
    sortOrder: 2,
    tags: ['dussehra', 'festival', 'celebration'],
    assignedProducts: ['CR001', 'FP001', 'GC002'],
    customPacks: [
      {
        id: 'dussehra-victory-pack',
        name: 'Victory Celebration Pack',
        description: 'Spectacular fireworks to celebrate the triumph of good over evil',
        price: 1899,
        mrp: 2299,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
        products: [
          { productId: 'CR001', quantity: 3 },
          { productId: 'FP001', quantity: 2 },
          { productId: 'SP002', quantity: 2 }
        ],
        isActive: true,
        createdAt: new Date('2024-01-02').toISOString()
      }
    ],
    showAllTaggedProducts: true,
    seoTitle: 'Dussehra Fireworks Collection | Sparkle Crackers',
    seoDescription: 'Celebrate Dussehra with our special collection of crackers and fireworks.',
    createdAt: new Date('2024-01-02').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'wedding-collection',
    title: 'Wedding Collection',
    description: 'Make your special day even more magical with our wedding fireworks',
    slug: 'wedding-collection',
    color: 'from-pink-500 to-purple-600',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=400&fit=crop',
    isActive: true,
    sortOrder: 3,
    tags: ['wedding', 'celebration', 'special'],
    assignedProducts: ['FP001', 'SP001', 'CR001'],
    customPacks: [
      {
        id: 'wedding-romantic-pack',
        name: 'Romantic Wedding Pack',
        description: 'Beautiful and elegant fireworks perfect for wedding celebrations and romantic moments',
        price: 3499,
        mrp: 4199,
        image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=400&fit=crop',
        products: [
          { productId: 'FP001', quantity: 4 },
          { productId: 'SP001', quantity: 6 },
          { productId: 'GC001', quantity: 2 }
        ],
        isActive: true,
        createdAt: new Date('2024-01-03').toISOString()
      },
      {
        id: 'wedding-grand-pack',
        name: 'Grand Wedding Celebration Pack',
        description: 'Spectacular fireworks collection for grand wedding celebrations with premium assortment',
        price: 5999,
        mrp: 7499,
        image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=400&h=400&fit=crop',
        products: [
          { productId: 'FP001', quantity: 6 },
          { productId: 'SP001', quantity: 8 },
          { productId: 'CR001', quantity: 4 },
          { productId: 'GC001', quantity: 4 }
        ],
        isActive: true,
        createdAt: new Date('2024-01-03').toISOString()
      }
    ],
    showAllTaggedProducts: false, // Only show admin-assigned products for weddings
    seoTitle: 'Wedding Fireworks Collection | Sparkle Crackers',
    seoDescription: 'Make your wedding magical with our premium fireworks collection.',
    createdAt: new Date('2024-01-03').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'new-year-2025',
    title: 'New Year Special',
    description: 'Welcome the new year with a spectacular bang and celebration',
    slug: 'new-year-special',
    color: 'from-blue-500 to-purple-600',
    image: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=600&h=400&fit=crop',
    isActive: true,
    sortOrder: 4,
    tags: ['new-year', 'celebration', 'party'],
    assignedProducts: ['CR001', 'SP002', 'FP001'],
    customPacks: [
      {
        id: 'new-year-countdown-pack',
        name: 'Countdown Celebration Pack',
        description: 'Perfect fireworks collection for New Year countdown and midnight celebrations',
        price: 2199,
        mrp: 2699,
        image: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=400&h=400&fit=crop',
        products: [
          { productId: 'CR001', quantity: 5 },
          { productId: 'SP002', quantity: 4 },
          { productId: 'FP001', quantity: 2 }
        ],
        isActive: true,
        createdAt: new Date('2024-01-04').toISOString()
      }
    ],
    showAllTaggedProducts: true,
    seoTitle: 'New Year Fireworks Collection | Sparkle Crackers',
    seoDescription: 'Welcome the new year with our spectacular fireworks collection.',
    createdAt: new Date('2024-01-04').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'children-safe-collection',
    title: 'Kids Safe Collection',
    description: 'Safe and fun fireworks specially curated for children with adult supervision',
    slug: 'kids-safe-collection',
    color: 'from-green-500 to-blue-500',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=400&fit=crop',
    isActive: true,
    sortOrder: 5,
    tags: ['kids', 'safe', 'family', 'low-sound'],
    assignedProducts: ['SP001', 'GC001'],
    customPacks: [
      {
        id: 'kids-starter-pack',
        name: 'Kids Starter Safety Pack',
        description: 'Specially designed safe fireworks for children with minimal sound and maximum fun',
        price: 699,
        mrp: 899,
        image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=400&fit=crop',
        products: [
          { productId: 'SP001', quantity: 3 },
          { productId: 'GC001', quantity: 5 }
        ],
        isActive: true,
        createdAt: new Date('2024-01-05').toISOString()
      }
    ],
    showAllTaggedProducts: true,
    seoTitle: 'Kids Safe Fireworks Collection | Sparkle Crackers',
    seoDescription: 'Safe and fun fireworks for children with adult supervision.',
    createdAt: new Date('2024-01-05').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'corporate-events-collection',
    title: 'Corporate Events',
    description: 'Professional fireworks displays for corporate events, inaugurations, and business celebrations',
    slug: 'corporate-events',
    color: 'from-indigo-600 to-purple-700',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop',
    isActive: true,
    sortOrder: 6,
    tags: ['corporate', 'business', 'professional', 'events'],
    assignedProducts: ['CR001', 'FP001'],
    customPacks: [
      {
        id: 'corporate-professional-pack',
        name: 'Professional Display Pack',
        description: 'Premium fireworks collection perfect for corporate events and business celebrations',
        price: 4999,
        mrp: 5999,
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=400&fit=crop',
        products: [
          { productId: 'CR001', quantity: 8 },
          { productId: 'FP001', quantity: 6 },
          { productId: 'SP002', quantity: 4 }
        ],
        isActive: true,
        createdAt: new Date('2024-01-06').toISOString()
      }
    ],
    showAllTaggedProducts: false,
    seoTitle: 'Corporate Event Fireworks | Sparkle Crackers',
    seoDescription: 'Professional fireworks displays for corporate events and business celebrations.',
    createdAt: new Date('2024-01-06').toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Helper functions
export const getFestivalCollections = (): FestivalCollection[] => {
  return festivalCollections.sort((a, b) => a.sortOrder - b.sortOrder);
};

export const getActiveFestivalCollections = (): FestivalCollection[] => {
  return festivalCollections.filter(collection => collection.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);
};

export const getFestivalCollectionBySlug = (slug: string): FestivalCollection | undefined => {
  return festivalCollections.find(collection => collection.slug === slug);
};

export const getFestivalCollectionById = (id: string): FestivalCollection | undefined => {
  return festivalCollections.find(collection => collection.id === id);
};

export const getCollectionProducts = (collectionId: string, allProducts: Product[]): Product[] => {
  const collection = getFestivalCollectionById(collectionId);
  if (!collection) return [];

  let collectionProducts: Product[] = []; // ✅ Properly typed array

  // Add admin-assigned products
  if (collection.assignedProducts && collection.assignedProducts.length > 0) {
    const assignedProducts = collection.assignedProducts
      .map(productId => allProducts.find(p => p.id === productId))
      .filter((product): product is Product => product !== undefined); // ✅ Type guard
    collectionProducts.push(...assignedProducts);
  }

  // Add tag-based products if enabled
  if (collection.showAllTaggedProducts && collection.tags.length > 0) {
    const taggedProducts = allProducts.filter(product => 
      product.tags && 
      product.tags.some((tag: string) => collection.tags.includes(tag)) &&
      !collection.assignedProducts?.includes(product.id) // Avoid duplicates
    );
    collectionProducts.push(...taggedProducts);
  }

  // Remove duplicates based on product ID
  const uniqueProducts = collectionProducts.filter((product, index, self) => 
    index === self.findIndex(p => p.id === product.id)
  );

  return uniqueProducts;
};

export const getActiveCustomPacks = (collectionId: string): CollectionProductPack[] => {
  const collection = getFestivalCollectionById(collectionId);
  if (!collection || !collection.customPacks) return [];
  
  return collection.customPacks.filter(pack => pack.isActive);
};

export const getPackById = (collectionId: string, packId: string): CollectionProductPack | undefined => {
  const collection = getFestivalCollectionById(collectionId);
  if (!collection || !collection.customPacks) return undefined;
  
  return collection.customPacks.find(pack => pack.id === packId);
};

// Function to calculate pack savings
export const calculatePackSavings = (pack: CollectionProductPack, allProducts: any[]): number => {
  const individualTotal = pack.products.reduce((total, item) => {
    const product = allProducts.find(p => p.id === item.productId);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);
  
  return Math.max(0, individualTotal - pack.price);
};

// Function to get collections by tag
export const getCollectionsByTag = (tag: string): FestivalCollection[] => {
  return festivalCollections.filter(collection => 
    collection.isActive && collection.tags.includes(tag)
  ).sort((a, b) => a.sortOrder - b.sortOrder);
};

// Function to search collections
export const searchCollections = (query: string): FestivalCollection[] => {
  const searchTerm = query.toLowerCase();
  return festivalCollections.filter(collection =>
    collection.isActive && (
      collection.title.toLowerCase().includes(searchTerm) ||
      collection.description.toLowerCase().includes(searchTerm) ||
      collection.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  ).sort((a, b) => a.sortOrder - b.sortOrder);
};
