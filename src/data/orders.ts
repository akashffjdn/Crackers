import { Order } from './types';

export const mockOrders: Order[] = [
  {
    id: 'ORD001',
    userId: '1',
    items: [
      {
        product: {
          id: 'SP001',
          categoryId: 'sparklers',
          name: 'Premium Golden Sparklers - Pack of 50',
          images: ['https://images.unsplash.com/photo-1542223616-9de9adb5e3d8?w=300&h=300&fit=crop'],
          description: 'Premium quality golden sparklers with 60+ seconds burn time',
          shortDescription: 'Premium golden sparklers',
          mrp: 250,
          price: 199,
          rating: 4.5,
          reviewCount: 1247,
          soundLevel: 'Low',
          burnTime: '60+ seconds',
          stock: 150,
          features: ['Premium quality from Sivakasi', 'Safe for children above 8 years'],
          specifications: { 'Pack Size': '50 pieces', 'Burn Time': '60+ seconds each' },
          tags: ['bestseller', 'premium', 'golden']
        },
        quantity: 2
      },
      {
        product: {
          id: 'GC001',
          categoryId: 'ground-chakkars',
          name: 'Colorful Ground Chakkars - Set of 12',
          images: ['https://images.unsplash.com/photo-1605116982135-20eea4e9ac06?w=300&h=300&fit=crop'],
          description: 'Beautiful spinning ground chakkars that create colorful wheels of light',
          shortDescription: 'Colorful spinning wheels',
          mrp: 200,
          price: 149,
          rating: 4.6,
          reviewCount: 923,
          soundLevel: 'Medium',
          burnTime: '30+ seconds',
          stock: 75,
          features: ['Multiple color combinations', 'Stable spinning motion'],
          specifications: { 'Pack Size': '12 pieces', 'Burn Time': '30+ seconds each' },
          tags: ['colorful', 'spinning']
        },
        quantity: 1
      }
    ],
    total: 547,
    status: 'processing',
    shippingAddress: {
      firstName: 'Rahul',
      lastName: 'Sharma',
      email: 'rahul@example.com',
      phone: '+91 9876543210',
      street: '123 MG Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001'
    },
    paymentMethod: 'card',
    paymentStatus: 'paid',
    createdAt: '2025-01-20T10:30:00Z',
    updatedAt: '2025-01-21T14:20:00Z',
    trackingNumber: 'SP2025012001',
    estimatedDelivery: '2025-01-25'
  },
  {
    id: 'ORD002',
    userId: '2',
    items: [
      {
        product: {
          id: 'FP001',
          categoryId: 'flower-pots',
          name: 'Golden Shower Flower Pot - Big Size',
          images: ['https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=300&h=300&fit=crop'],
          description: 'Large flower pot that creates a beautiful golden shower effect',
          shortDescription: 'Large golden shower flower pot',
          mrp: 350,
          price: 299,
          rating: 4.7,
          reviewCount: 1156,
          soundLevel: 'Medium',
          burnTime: '90 seconds',
          stock: 45,
          features: ['10 feet height display', 'Golden shower effect'],
          specifications: { 'Size': 'Big (12cm height)', 'Burn Time': '90 seconds' },
          tags: ['golden', 'big', 'shower']
        },
        quantity: 3
      }
    ],
    total: 897,
    status: 'shipped',
    shippingAddress: {
      firstName: 'Priya',
      lastName: 'Patel',
      email: 'priya@example.com',
      phone: '+91 9876543211',
      street: '456 Brigade Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001'
    },
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    createdAt: '2025-01-19T15:45:00Z',
    updatedAt: '2025-01-21T09:15:00Z',
    trackingNumber: 'SP2025011902',
    estimatedDelivery: '2025-01-24'
  },
  {
    id: 'ORD003',
    userId: '3',
    items: [
      {
        product: {
          id: 'GB001',
          categoryId: 'gift-boxes',
          name: 'Diwali Special Family Pack',
          images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop'],
          description: 'Complete family pack containing sparklers, ground chakkars, flower pots, and fancy crackers',
          shortDescription: 'Complete family pack with assorted crackers',
          mrp: 899,
          price: 699,
          rating: 4.9,
          reviewCount: 445,
          soundLevel: 'Mixed',
          burnTime: 'Varies',
          stock: 25,
          features: ['Complete variety pack', 'Family friendly'],
          specifications: { 'Contents': '25 Sparklers, 8 Chakkars, 4 Flower Pots, 5 Fancy Crackers' },
          tags: ['gift', 'family', 'variety']
        },
        quantity: 1
      }
    ],
    total: 699,
    status: 'delivered',
    shippingAddress: {
      firstName: 'Amit',
      lastName: 'Kumar',
      email: 'amit@example.com',
      phone: '+91 9876543212',
      street: '789 Anna Salai',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600001'
    },
    paymentMethod: 'cod',
    paymentStatus: 'paid',
    createdAt: '2025-01-18T12:20:00Z',
    updatedAt: '2025-01-22T16:30:00Z',
    trackingNumber: 'SP2025011803',
    estimatedDelivery: '2025-01-23'
  },
  {
    id: 'ORD004',
    userId: '4',
    items: [
      {
        product: {
          id: 'RC001',
          categoryId: 'rockets',
          name: 'Color Burst Rockets - Pack of 10',
          images: ['https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop'],
          description: 'High-flying rockets that burst into spectacular colored displays',
          shortDescription: 'High-flying rockets with colored bursts',
          mrp: 450,
          price: 399,
          rating: 4.8,
          reviewCount: 789,
          soundLevel: 'High',
          burnTime: '5 seconds + burst',
          stock: 60,
          features: ['50+ feet flight height', 'Multi-color bursts'],
          specifications: { 'Pack Size': '10 pieces', 'Flight Height': '50+ feet' },
          tags: ['rockets', 'high-flying', 'colorful']
        },
        quantity: 2
      }
    ],
    total: 798,
    status: 'pending',
    shippingAddress: {
      firstName: 'Deepika',
      lastName: 'Singh',
      email: 'deepika@example.com',
      phone: '+91 9876543213',
      street: '321 CP Road',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001'
    },
    paymentMethod: 'card',
    paymentStatus: 'paid',
    createdAt: '2025-01-22T08:10:00Z',
    updatedAt: '2025-01-22T08:10:00Z'
  },
  {
    id: 'ORD005',
    userId: '5',
    items: [
      {
        product: {
          id: 'SP002',
          categoryId: 'sparklers',
          name: 'Electric Sparklers - Pack of 25',
          images: ['https://images.unsplash.com/photo-1542223616-9de9adb5e3d8?w=300&h=300&fit=crop'],
          description: 'Bright electric sparklers that create dazzling white sparks',
          shortDescription: 'Bright electric sparklers',
          mrp: 180,
          price: 149,
          rating: 4.3,
          reviewCount: 856,
          soundLevel: 'Low',
          burnTime: '45 seconds',
          stock: 200,
          features: ['Bright white sparks', 'Safe for indoor use'],
          specifications: { 'Pack Size': '25 pieces', 'Burn Time': '45 seconds each' },
          tags: ['electric', 'white', 'indoor']
        },
        quantity: 4
      }
    ],
    total: 596,
    status: 'confirmed',
    shippingAddress: {
      firstName: 'Suresh',
      lastName: 'Reddy',
      email: 'suresh@example.com',
      phone: '+91 9876543214',
      street: '654 Banjara Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500034'
    },
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    createdAt: '2025-01-21T19:25:00Z',
    updatedAt: '2025-01-22T10:05:00Z'
  }
];

export const getOrderById = (id: string): Order | undefined => {
  return mockOrders.find(order => order.id === id);
};

export const getOrdersByUserId = (userId: string): Order[] => {
  return mockOrders.filter(order => order.userId === userId);
};

export const getOrdersByStatus = (status: Order['status']): Order[] => {
  return mockOrders.filter(order => order.status === status);
};

export const getTotalRevenue = (): number => {
  return mockOrders
    .filter(order => order.paymentStatus === 'paid')
    .reduce((total, order) => total + order.total, 0);
};

export const getOrderStats = () => {
  const totalOrders = mockOrders.length;
  const pendingOrders = mockOrders.filter(order => order.status === 'pending').length;
  const processingOrders = mockOrders.filter(order => order.status === 'processing').length;
  const shippedOrders = mockOrders.filter(order => order.status === 'shipped').length;
  const deliveredOrders = mockOrders.filter(order => order.status === 'delivered').length;
  const cancelledOrders = mockOrders.filter(order => order.status === 'cancelled').length;

  return {
    totalOrders,
    pendingOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    totalRevenue: getTotalRevenue()
  };
};

export default mockOrders;
