export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface CategoryWithCount extends Category {
  _count?: { cakes: number };
}

export interface ProductVariant {
  id: string;
  cakeId: string;
  name: string;
  price: number;
  active: boolean;
  createdAt: string;
}

export interface Cake {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  categoryId: string;
  category: Category;
  imageUrl: string;
  featured: boolean;
  available: boolean;
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface Order {
  id: string;
  name: string;
  email: string;
  eventType: string;
  eventDate: string;
  servings: string;
  categoryId: string | null;
  category: Category | null;
  details: string;
  createdAt: string;
}

// ─── E-commerce types ─────────────────────────────────────────────────────────

export type OrderStatus = 'PENDING' | 'PAID' | 'CONFIRMED' | 'READY' | 'DELIVERED' | 'CANCELLED';
export type FulfillmentType = 'PICKUP' | 'DELIVERY';

export interface ShopOrderItem {
  id: string;
  cakeId: string;
  cakeName: string;
  variantName: string | null;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  pickupAvailable: boolean;
  active: boolean;
}

export interface ShopOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  status: OrderStatus;
  fulfillmentType: FulfillmentType;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentId: string | null;
  notes: string | null;
  pickupDate: string | null;
  pickupSlot: string | null;
  deliveryAddress: string | null;
  branch: Branch | null;
  items: ShopOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface DeliverySettings {
  minOrderAmount: number;
  deliveryFee: number;
  freeDeliveryThreshold: number | null;
  deliveryAvailable: boolean;
  pickupAvailable: boolean;
}

export interface TimeSlot {
  id: string;
  label: string;
  active: boolean;
  sortOrder: number;
}

export interface SiteConfig {
  siteMode: 'retail' | 'bespoke' | 'both';
  siteName: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
  };
}

export interface LoginResponse {
  token: string;
  username: string;
}

export interface CustomerAuthResponse {
  customer: Customer;
  token: string;
}
