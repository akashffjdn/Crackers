import { Product } from './types';

export const products: Product[] = [
  // Sparklers
  {
    id: "SP001",
    categoryId: "sparklers",
    name: "Premium Golden Sparklers - Pack of 50",
    images: [
      "https://images.unsplash.com/photo-1542223616-9de9adb5e3d8?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=600&h=600&fit=crop"
    ],
    description: "Experience the magic of festivals with our premium golden sparklers. Each sparkler burns for 60+ seconds with brilliant golden sparks that create memorable moments for you and your family. Made with high-quality materials and eco-friendly composition.",
    shortDescription: "Premium quality golden sparklers with 60+ seconds burn time",
    mrp: 250,
    price: 199,
    rating: 4.5,
    reviewCount: 1247,
    soundLevel: "Low",
    burnTime: "60+ seconds",
    stock: 150,
    features: [
      "Premium quality from Sivakasi",
      "Safe for children above 8 years",
      "Minimal smoke emission",
      "Consistent burn time",
      "Government certified",
      "Eco-friendly composition"
    ],
    specifications: {
      "Pack Size": "50 pieces",
      "Burn Time": "60+ seconds each",
      "Sound Level": "Silent",
      "Age Limit": "8+ years",
      "Certification": "BIS Approved",
      "Origin": "Sivakasi, Tamil Nadu",
      "Weight": "500g",
      "Dimensions": "25cm length"
    },
    tags: ["bestseller", "premium", "golden", "safe"],
    isBestSeller: true
  },
  {
    id: "SP002",
    categoryId: "sparklers",
    name: "Electric Sparklers - Pack of 25",
    images: [
      "https://images.unsplash.com/photo-1542223616-9de9adb5e3d8?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop"
    ],
    description: "Bright electric sparklers that create dazzling white sparks. Perfect for birthday parties and intimate celebrations.",
    shortDescription: "Bright electric sparklers with dazzling white sparks",
    mrp: 180,
    price: 149,
    rating: 4.3,
    reviewCount: 856,
    soundLevel: "Low",
    burnTime: "45 seconds",
    stock: 200,
    features: [
      "Bright white sparks",
      "Safe for indoor use",
      "Quick lighting",
      "Minimal residue"
    ],
    specifications: {
      "Pack Size": "25 pieces",
      "Burn Time": "45 seconds each",
      "Sound Level": "Silent",
      "Age Limit": "10+ years",
      "Certification": "BIS Approved",
      "Origin": "Sivakasi, Tamil Nadu"
    },
    tags: ["electric", "white", "indoor"],
    isOnSale: true
  },

  // Ground Chakkars
  {
    id: "GC001",
    categoryId: "ground-chakkars",
    name: "Colorful Ground Chakkars - Set of 12",
    images: [
      "https://images.unsplash.com/photo-1605116982135-20eea4e9ac06?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=600&h=600&fit=crop"
    ],
    description: "Beautiful spinning ground chakkars that create colorful wheels of light. Each chakkar spins for 30+ seconds with vibrant colors including red, green, yellow, and blue.",
    shortDescription: "Colorful spinning wheels with 30+ seconds display time",
    mrp: 200,
    price: 149,
    rating: 4.6,
    reviewCount: 923,
    soundLevel: "Medium",
    burnTime: "30+ seconds",
    stock: 75,
    features: [
      "Multiple color combinations",
      "Stable spinning motion",
      "Safe for outdoor use",
      "Consistent performance"
    ],
    specifications: {
      "Pack Size": "12 pieces",
      "Burn Time": "30+ seconds each",
      "Sound Level": "Medium",
      "Age Limit": "12+ years",
      "Colors": "Red, Green, Yellow, Blue",
      "Diameter": "8cm"
    },
    tags: ["colorful", "spinning", "outdoor"],
    isBestSeller: true
  },

  // Flower Pots
  {
    id: "FP001",
    categoryId: "flower-pots",
    name: "Golden Shower Flower Pot - Big Size",
    images: [
      "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1562113530-57ba84cea785?w=600&h=600&fit=crop"
    ],
    description: "Large flower pot that creates a beautiful golden shower effect reaching up to 10 feet in height. Perfect centerpiece for any celebration.",
    shortDescription: "Large golden shower flower pot - 10 feet height",
    mrp: 350,
    price: 299,
    rating: 4.7,
    reviewCount: 1156,
    soundLevel: "Medium",
    burnTime: "90 seconds",
    stock: 45,
    features: [
      "10 feet height display",
      "Golden shower effect",
      "Long lasting performance",
      "Safe outdoor use"
    ],
    specifications: {
      "Size": "Big (12cm height)",
      "Burn Time": "90 seconds",
      "Display Height": "10 feet",
      "Sound Level": "Medium",
      "Age Limit": "14+ years",
      "Effect": "Golden Shower"
    },
    tags: ["golden", "big", "shower", "centerpiece"],
    isBestSeller: true
  },

  // Rockets
  {
    id: "RC001",
    categoryId: "rockets",
    name: "Color Burst Rockets - Pack of 10",
    images: [
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1562113530-57ba84cea785?w=600&h=600&fit=crop"
    ],
    description: "High-flying rockets that burst into spectacular colored displays at 50+ feet height. Each rocket creates a different color burst.",
    shortDescription: "High-flying rockets with colored bursts at 50+ feet",
    mrp: 450,
    price: 399,
    rating: 4.8,
    reviewCount: 789,
    soundLevel: "High",
    burnTime: "5 seconds + burst",
    stock: 60,
    features: [
      "50+ feet flight height",
      "Multi-color bursts",
      "Professional grade",
      "Stable flight path"
    ],
    specifications: {
      "Pack Size": "10 pieces",
      "Flight Height": "50+ feet",
      "Burst Colors": "5 different colors",
      "Sound Level": "High",
      "Age Limit": "18+ years",
      "Safety Distance": "25 meters"
    },
    tags: ["rockets", "high-flying", "colorful", "professional"],
    isBestSeller: true
  },

  // Gift Boxes
  {
    id: "GB001",
    categoryId: "gift-boxes",
    name: "Diwali Special Family Pack",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1542223616-9de9adb5e3d8?w=600&h=600&fit=crop"
    ],
    description: "Complete family pack containing sparklers, ground chakkars, flower pots, and fancy crackers. Perfect for family celebrations.",
    shortDescription: "Complete family pack with assorted crackers",
    mrp: 899,
    price: 699,
    rating: 4.9,
    reviewCount: 445,
    soundLevel: "Mixed",
    burnTime: "Varies",
    stock: 25,
    features: [
      "Complete variety pack",
      "Family friendly",
      "Great value for money",
      "Beautiful gift packaging"
    ],
    specifications: {
      "Contents": "25 Sparklers, 8 Chakkars, 4 Flower Pots, 5 Fancy Crackers",
      "Total Items": "42 pieces",
      "Package": "Premium Gift Box",
      "Age Suitability": "8+ years",
      "Burn Duration": "30+ minutes total"
    },
    tags: ["gift", "family", "variety", "diwali"],
    isBestSeller: true,
    isOnSale: true
  }
];

export default products;
