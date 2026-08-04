// Shared TypeScript types mirroring backend interfaces

export interface User {
  _id: string;   // FE canonical id
  id?: string;   // Backend login response returns `id` — mapped to `_id` on login
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  role: string;
  isVerified?: boolean;
}

export interface Address {
  _id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  postalCode?: string;
  country?: string;
  isDefault: boolean;
  coordinates?: [number, number];
}

export interface OrderItem {
  sku: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  variantName?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  orderStatus?: string;
  items: OrderItem[];
  subtotal: number;
  totalDiscount: number;
  taxAmount: number;
  totalAmount: number;
  paymentSummary?: {
    subTotal?: number;
    discountAmount?: number;
    taxAmount?: number;
    totalAmount?: number;
    shippingFee?: number;
  };
  shippingAddress?: Address;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface OrderTracking {
  status: string;
  timestamp: string;
  description: string;
  location?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  salePrice?: number;
  currency: string;
  images: string[];
  category: any;
  brand: string;
  averageRating: number;
  reviewCount: number;
  isActive: boolean;
  variants: ProductVariant[];
  sku: string;
  stockQuantity: number;
}

export interface ProductVariant {
  _id: string;
  sku: string;
  name: string;
  price: number;
  salePrice?: number;
  compareAtPrice?: number;
  stockQuantity?: number;
  images?: string[];
  attributes?: Record<string, string>;
}

export interface CartItem {
  sku: string;
  productId: string;
  variantId?: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Cart {
  _id?: string;
  cartId?: string;
  items: CartItem[];
  subtotal: number;
  subTotal?: number;
  totalDiscount: number;
  discountAmount?: number;
  taxAmount: number;
  shippingFee?: number;
  totalAmount: number;
  couponCode?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface ApiResponse<T> {
  message: string;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}
