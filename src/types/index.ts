// Shared TypeScript types mirroring backend interfaces

export interface User {
  _id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  role: string;
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
  stockQuantity: number;
  images: string[];
  attributes: Record<string, string>;
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
  items: CartItem[];
  subtotal: number;
  totalDiscount: number;
  taxAmount: number;
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
