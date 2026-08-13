export type UserRole = 'owner' | 'employee';

export type PaymentMethod = 'Cash' | 'UPI' | 'Card' | 'Other';

export type PaymentStatus = 'Paid' | 'Pending';

export type OrderType = 'Dine-in' | 'Takeaway' | 'Delivery';

export type OrderStatus = 'NEW' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';

export type SyncStatus = 'synced' | 'pending_sync' | 'failed';

export interface Business {
  id: string;
  name: string;
  location: string;
  currency: string;
  phone?: string;
  logoUrl?: string;
  createdAt: string;
}

export interface User {
  id: string;
  businessId: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: UserRole;
  active: boolean;
  avatarUrl?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  businessId: string;
  name: string;
  sortOrder: number;
}

export interface Product {
  id: string;
  businessId: string;
  categoryId: string;
  name: string;
  price: number;
  imageUrl?: string;
  available: boolean;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  itemTotal: number;
}

export interface Order {
  id: string;
  businessId: string;
  orderNumber: number;
  localId?: string;
  customerName?: string;
  customerPhone?: string;
  orderType: OrderType;
  subtotal: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdByUserId: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  syncedAt?: string;
  syncStatus: SyncStatus;
  items: OrderItem[];
}

export interface DailySummary {
  date: string;
  totalSales: number;
  orderCount: number;
  averageOrderValue: number;
  cashSales: number;
  upiSales: number;
  cardSales: number;
  otherSales: number;
}
