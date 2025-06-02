export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: 'apparel' | 'accessories' | 'vinyl' | 'art';
  variants?: ProductVariant[];
  stock: number;
  featured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  name: string;
  type: 'size' | 'color';
  options: string[];
  priceAdjustment?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariants?: Record<string, string>;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  customer: Customer;
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: string;
  paymentIntentId?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  email: string;
  name: string;
  phone?: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CheckoutSession {
  items: CartItem[];
  customer?: Customer;
  shippingAddress?: Address;
  billingAddress?: Address;
} 