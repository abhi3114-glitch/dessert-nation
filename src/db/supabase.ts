import { createClient } from '@supabase/supabase-js';
import { Product, Category, Order, User } from '../types/pos';

// Accept both VITE_-prefixed (Vite standard) and non-prefixed (some Vercel setups)
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.SUPABASE_URL ||
  '';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ─── PRODUCTS ────────────────────────────────────────────────────────────────

export async function sbFetchProducts(): Promise<Product[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data || []).map(mapProduct);
}

export async function sbUpsertProduct(p: Product): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('products').upsert({
    id: p.id,
    business_id: p.businessId,
    category_id: p.categoryId,
    name: p.name,
    price: p.price,
    available: p.available,
    image_url: p.imageUrl || null,
    created_at: p.createdAt,
  });
  if (error) throw error;
}

export async function sbUpdateProduct(id: string, fields: Partial<Product>): Promise<void> {
  if (!supabase) return;
  const row: Record<string, unknown> = {};
  if (fields.name !== undefined) row.name = fields.name;
  if (fields.categoryId !== undefined) row.category_id = fields.categoryId;
  if (fields.price !== undefined) row.price = fields.price;
  if (fields.available !== undefined) row.available = fields.available;
  if (fields.imageUrl !== undefined) row.image_url = fields.imageUrl;
  const { error } = await supabase.from('products').update(row).eq('id', id);
  if (error) throw error;
}

export async function sbDeleteProduct(id: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

// ─── CATEGORIES ──────────────────────────────────────────────────────────────

export async function sbFetchCategories(): Promise<Category[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data || []).map(mapCategory);
}

export async function sbSeedCategories(cats: Category[]): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('categories').upsert(
    cats.map((c) => ({
      id: c.id,
      business_id: c.businessId,
      name: c.name,
      sort_order: c.sortOrder,
    }))
  );
  if (error) throw error;
}

// ─── ORDERS ──────────────────────────────────────────────────────────────────

export async function sbFetchOrders(): Promise<Order[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false })
    .limit(500);
  if (error) throw error;
  return (data || []).map(mapOrder);
}

export async function sbUpsertOrder(order: Order): Promise<{ orderNumber: number; serverId: string } | null> {
  if (!supabase) return null;

  // Upsert the order row
  const { data: dbOrder, error: orderErr } = await supabase
    .from('orders')
    .upsert({
      id: order.id,
      business_id: order.businessId,
      customer_name: order.customerName,
      customer_phone: order.customerPhone || '',
      order_type: order.orderType,
      subtotal: order.subtotal,
      total_amount: order.totalAmount,
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus,
      order_status: order.orderStatus,
      created_by_name: order.createdByName,
      created_at: order.createdAt,
      updated_at: order.updatedAt,
    })
    .select()
    .single();

  if (orderErr || !dbOrder) return null;

  // Upsert order items
  if (order.items && order.items.length > 0) {
    const itemRows = order.items.map((item) => ({
      id: item.id,
      order_id: dbOrder.id,
      product_id: item.productId,
      product_name: item.productName,
      unit_price: item.unitPrice,
      quantity: item.quantity,
      item_total: item.itemTotal,
    }));
    await supabase.from('order_items').upsert(itemRows);
  }

  return { orderNumber: dbOrder.order_number, serverId: dbOrder.id };
}

export async function sbUpdateOrderStatus(id: string, orderStatus: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from('orders')
    .update({ order_status: orderStatus, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

export async function sbUpdatePaymentStatus(id: string, paymentStatus: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from('orders')
    .update({ payment_status: paymentStatus, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

export async function sbDeleteOrder(id: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('orders').delete().eq('id', id);
  if (error) throw error;
}

// ─── USERS ───────────────────────────────────────────────────────────────────

export async function sbFetchUsers(): Promise<User[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw error;
  return (data || []).map(mapUser);
}

export async function sbUpsertUser(u: User): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('users').upsert({
    id: u.id,
    business_id: u.businessId,
    name: u.name,
    email: u.email,
    phone: u.phone,
    // Store hash+salt only — never plain text password
    password: u.passwordHash || u.password || '',
    password_hash: u.passwordHash || null,
    password_salt: u.passwordSalt || null,
    role: u.role,
    active: u.active,
    created_at: u.createdAt,
  });
  if (error) throw error;
}

export async function sbDeleteUser(id: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) throw error;
}

export async function sbUpdateUserStatus(id: string, active: boolean): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('users').update({ active }).eq('id', id);
  if (error) throw error;
}

// ─── MAPPERS (snake_case → camelCase) ────────────────────────────────────────

function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    businessId: (row.business_id as string) || 'biz_dn_ashta',
    categoryId: row.category_id as string,
    name: row.name as string,
    price: Number(row.price),
    available: Boolean(row.available),
    imageUrl: row.image_url as string | undefined,
    createdAt: row.created_at as string,
  };
}

function mapCategory(row: Record<string, unknown>): Category {
  return {
    id: row.id as string,
    businessId: (row.business_id as string) || 'biz_dn_ashta',
    name: row.name as string,
    sortOrder: Number(row.sort_order),
  };
}

function mapOrder(row: Record<string, unknown>): Order {
  const items = ((row.order_items as Record<string, unknown>[]) || []).map((i) => ({
    id: i.id as string,
    orderId: i.order_id as string,
    productId: i.product_id as string,
    productName: i.product_name as string,
    unitPrice: Number(i.unit_price),
    quantity: Number(i.quantity),
    itemTotal: Number(i.item_total),
  }));

  return {
    id: row.id as string,
    businessId: (row.business_id as string) || 'biz_dn_ashta',
    orderNumber: Number(row.order_number),
    localId: row.id as string,
    customerName: row.customer_name as string,
    customerPhone: (row.customer_phone as string) || '',
    orderType: row.order_type as Order['orderType'],
    subtotal: Number(row.subtotal),
    totalAmount: Number(row.total_amount),
    paymentMethod: row.payment_method as Order['paymentMethod'],
    paymentStatus: row.payment_status as Order['paymentStatus'],
    orderStatus: row.order_status as Order['orderStatus'],
    createdByUserId: '',
    createdByName: row.created_by_name as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    syncStatus: 'synced',
    syncedAt: row.created_at as string,
    items,
  };
}

function mapUser(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    businessId: (row.business_id as string) || 'biz_dn_ashta',
    name: row.name as string,
    email: row.email as string,
    phone: (row.phone as string) || '',
    // Read hash fields if available, fall back to legacy password field for migration
    passwordHash: (row.password_hash as string) || undefined,
    passwordSalt: (row.password_salt as string) || undefined,
    password: row.password_hash ? undefined : ((row.password as string) || undefined),
    role: row.role as 'owner' | 'employee',
    active: Boolean(row.active),
    createdAt: row.created_at as string,
  };
}
