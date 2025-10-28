export const APP_CONFIG = {
  APP_NAME: 'Sparkle Crackers',
  COMPANY_TAGLINE: 'Premium Sivakasi Fireworks',
  SUPPORT_PHONE: '+91 98765 43210',
  SUPPORT_EMAIL: 'support@sparklecrackers.com',
  WHATSAPP_NUMBER: '+91 98765 43210',
  ADDRESS: '123 Fireworks Street, Sivakasi, Tamil Nadu 626123',
  FREE_SHIPPING_THRESHOLD: 2000,
  STANDARD_SHIPPING_COST: 99,
  EXPRESS_SHIPPING_COST: 199
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
} as const;

export const PAYMENT_METHODS = {
  COD: 'cod',
  ONLINE: 'online'
} as const;

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
} as const;

export const SOUND_LEVELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High'
} as const;
