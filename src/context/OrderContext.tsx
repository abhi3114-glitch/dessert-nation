import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Order, OrderItem, Product, Category, OrderStatus, PaymentMethod, PaymentStatus, OrderType } from '../types/pos';
import { localDB } from '../db/indexedDB';
import { syncEngine } from '../db/syncEngine';
import { useAuth } from './AuthContext';
import { DEFAULT_PRODUCTS, DEFAULT_CATEGORIES } from '../data/defaultMenu';
import {
  isSupabaseConfigured,
  sbFetchProducts,
  sbFetchCategories,
  sbFetchOrders,
  sbUpsertProduct,
  sbUpdateProduct as sbPatchProduct,
  sbDeleteProduct,
  sbUpdateOrderStatus as sbPatchOrderStatus,
  sbUpdatePaymentStatus as sbPatchPaymentStatus,
  sbDeleteOrder as sbRemoveOrder,
  sbSeedCategories,
} from '../db/supabase';

interface OrderContextType {
  products: Product[];
  categories: Category[];
  orders: Order[];
  cart: OrderItem[];
  activeCategoryId: string;
  searchQuery: string;
  isLoading: boolean;
  setActiveCategoryId: (id: string) => void;
  setSearchQuery: (query: string) => void;
  addToCart: (product: Product) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  createOrder: (details: {
    customerName?: string;
    customerPhone?: string;
    orderType: OrderType;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  updatePaymentStatus: (orderId: string, status: PaymentStatus) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  updateOrder: (orderId: string, updatedFields: Partial<Order>) => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'businessId' | 'createdAt'>) => Promise<Product>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  toggleProductAvailability: (id: string) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, currentBusiness } = useAuth();

  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load local data and sync with cloud
  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [localProds, localCats, localOrds] = await Promise.all([
        localDB.getProducts(),
        localDB.getCategories(),
        localDB.getOrders(),
      ]);

      if (localProds.length > 0) setProducts(localProds);
      if (localCats.length > 0) setCategories(localCats);
      setOrders(localOrds);

      if (navigator.onLine) {
        // ── Supabase direct sync ──────────────────────────────────────────────
        if (isSupabaseConfigured) {
          try {
            const [sbProds, sbCats, sbOrds] = await Promise.all([
              sbFetchProducts(),
              sbFetchCategories(),
              sbFetchOrders(),
            ]);

            // Seed categories if empty (first launch)
            if (sbCats.length === 0) {
              await sbSeedCategories(DEFAULT_CATEGORIES);
              setCategories(DEFAULT_CATEGORIES);
              DEFAULT_CATEGORIES.forEach((c) => localDB.saveCategory(c));
            } else {
              setCategories(sbCats);
              sbCats.forEach((c) => localDB.saveCategory(c));
            }

            // Seed products if empty (first launch)
            if (sbProds.length === 0) {
              for (const p of DEFAULT_PRODUCTS) {
                await sbUpsertProduct(p);
                await localDB.saveProduct(p);
              }
              setProducts(DEFAULT_PRODUCTS);
            } else {
              setProducts(sbProds);
              sbProds.forEach((p) => localDB.saveProduct(p));
            }

            // Merge server orders with local pending
            const pendingOrders = localOrds.filter((o) => o.syncStatus === 'pending_sync');
            const mergedMap = new Map<string, Order>();
            sbOrds.forEach((o) => {
              mergedMap.set(o.id, o);
              localDB.saveOrder(o);
            });
            pendingOrders.forEach((o) => mergedMap.set(o.id, o));

            const mergedList = Array.from(mergedMap.values()).sort(
              (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
            );
            setOrders(mergedList);
          } catch (e) {
            console.log('Supabase fetch failed, using local cache:', e);
          }
        } else {
          // ── Fallback: Express API server ────────────────────────────────────
          try {
            const [pRes, cRes, oRes] = await Promise.all([
              fetch('/api/products'),
              fetch('/api/categories'),
              fetch('/api/orders'),
            ]);

            if (pRes.ok) {
              const serverProds: Product[] = await pRes.json();
              if (serverProds.length > 0) {
                setProducts(serverProds);
                serverProds.forEach((p) => localDB.saveProduct(p));
              }
            }
            if (cRes.ok) {
              const serverCats: Category[] = await cRes.json();
              if (serverCats.length > 0) {
                setCategories(serverCats);
                serverCats.forEach((c) => localDB.saveCategory(c));
              }
            }
            if (oRes.ok) {
              const serverOrders: Order[] = await oRes.json();
              const pendingOrders = localOrds.filter((o) => o.syncStatus === 'pending_sync');
              const mergedMap = new Map<string, Order>();
              serverOrders.forEach((o) => { mergedMap.set(o.id, o); localDB.saveOrder(o); });
              pendingOrders.forEach((o) => mergedMap.set(o.id, o));
              const mergedList = Array.from(mergedMap.values()).sort(
                (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
              );
              setOrders(mergedList);
            }
          } catch (e) {
            console.log('Using local offline cached data');
          }
        }
      }
    } catch (err) {
      console.error('Failed to load DB data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();

    const unsubscribe = syncEngine.subscribe(() => {
      refreshData();
    });

    return () => unsubscribe();
  }, [refreshData]);

  // CART OPERATIONS
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.productId === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const existing = updated[existingIndex];
        const newQty = existing.quantity + 1;
        updated[existingIndex] = { ...existing, quantity: newQty, itemTotal: newQty * existing.unitPrice };
        return updated;
      } else {
        const newItem: OrderItem = {
          id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          orderId: '',
          productId: product.id,
          productName: product.name,
          unitPrice: product.price,
          quantity: 1,
          itemTotal: product.price,
        };
        return [...prev, newItem];
      }
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) { removeFromCart(productId); return; }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity, itemTotal: quantity * item.unitPrice } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => setCart([]);

  // CREATE ORDER
  const createOrder = async (details: {
    customerName?: string;
    customerPhone?: string;
    orderType: OrderType;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
  }): Promise<Order> => {
    if (cart.length === 0) throw new Error('Cart is empty');
    if (!details.customerName || !details.customerName.trim()) {
      throw new Error('Customer Name is compulsory');
    }

    const totalAmount = cart.reduce((sum, i) => sum + i.itemTotal, 0);
    const now = new Date().toISOString();
    const tempNumber = Math.floor(1000 + Math.random() * 9000);
    const tempId = `LOCAL-${Date.now()}`;

    const newOrder: Order = {
      id: tempId,
      businessId: currentBusiness.id,
      orderNumber: tempNumber,
      localId: tempId,
      customerName: details.customerName.trim(),
      customerPhone: details.customerPhone || '',
      orderType: details.orderType,
      subtotal: totalAmount,
      totalAmount,
      paymentMethod: details.paymentMethod,
      paymentStatus: details.paymentStatus,
      orderStatus: 'NEW',
      createdByUserId: currentUser?.id || 'emp_system',
      createdByName: currentUser?.name || 'Employee',
      createdAt: now,
      updatedAt: now,
      syncStatus: 'pending_sync',
      items: cart.map((i) => ({ ...i, orderId: tempId })),
    };

    await localDB.saveOrder(newOrder);
    await localDB.addToSyncQueue(newOrder);
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    syncEngine.broadcastOrderCreation();
    syncEngine.triggerSync();

    return newOrder;
  };

  // UPDATE ORDER STATUS
  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const target = orders.find((o) => o.id === orderId || o.localId === orderId);
    if (!target) return;

    const updated: Order = { ...target, orderStatus: status, updatedAt: new Date().toISOString() };
    await localDB.saveOrder(updated);
    setOrders((prev) => prev.map((o) => (o.id === orderId || o.localId === orderId ? updated : o)));

    if (navigator.onLine && target.syncStatus === 'synced') {
      if (isSupabaseConfigured) {
        sbPatchOrderStatus(orderId, status).catch(() => {});
      } else {
        fetch(`/api/orders/${orderId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderStatus: status }),
        }).catch(() => {});
      }
    } else {
      await localDB.addToSyncQueue(updated);
      syncEngine.triggerSync();
    }
  };

  // UPDATE PAYMENT STATUS
  const updatePaymentStatus = async (orderId: string, status: PaymentStatus) => {
    const target = orders.find((o) => o.id === orderId || o.localId === orderId);
    if (!target) return;

    const updated: Order = { ...target, paymentStatus: status, updatedAt: new Date().toISOString() };
    await localDB.saveOrder(updated);
    setOrders((prev) => prev.map((o) => (o.id === orderId || o.localId === orderId ? updated : o)));

    if (navigator.onLine && target.syncStatus === 'synced') {
      if (isSupabaseConfigured) {
        sbPatchPaymentStatus(orderId, status).catch(() => {});
      } else {
        fetch(`/api/orders/${orderId}/payment`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentStatus: status }),
        }).catch(() => {});
      }
    } else {
      await localDB.addToSyncQueue(updated);
      syncEngine.triggerSync();
    }
  };

  // DELETE ORDER
  const deleteOrder = async (orderId: string) => {
    try {
      setOrders((prev) => prev.filter((o) => o.id !== orderId && o.localId !== orderId));
      await localDB.deleteOrder(orderId);
      if (navigator.onLine) {
        if (isSupabaseConfigured) {
          sbRemoveOrder(orderId).catch(() => {});
        } else {
          fetch(`/api/orders/${orderId}`, { method: 'DELETE' }).catch(() => {});
        }
      }
    } catch (e) {
      console.error('Failed to delete order:', e);
    }
  };

  // UPDATE ORDER
  const updateOrder = async (orderId: string, updatedFields: Partial<Order>) => {
    try {
      const now = new Date().toISOString();
      let updatedOrder: Order | null = null;

      setOrders((prev) =>
        prev.map((o) => {
          if (o.id === orderId || o.localId === orderId) {
            updatedOrder = { ...o, ...updatedFields, updatedAt: now };
            localDB.saveOrder(updatedOrder);
            return updatedOrder;
          }
          return o;
        })
      );

      if (navigator.onLine && updatedOrder && !isSupabaseConfigured) {
        fetch(`/api/orders/${orderId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedFields),
        }).catch(() => {});
      }
    } catch (e) {
      console.error('Failed to update order:', e);
    }
  };

  // PRODUCT MANAGEMENT (Owner only)
  const addProduct = async (productData: Omit<Product, 'id' | 'businessId' | 'createdAt'>): Promise<Product> => {
    const newProd: Product = {
      ...productData,
      id: `prod_${Date.now()}`,
      businessId: currentBusiness.id,
      createdAt: new Date().toISOString(),
    };

    await localDB.saveProduct(newProd);
    setProducts((prev) => [...prev, newProd]);

    if (isSupabaseConfigured) {
      sbUpsertProduct(newProd).catch(console.error);
    } else {
      fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd),
      }).catch(() => {});
    }

    return newProd;
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;

    const updated: Product = { ...target, ...productData };
    await localDB.saveProduct(updated);
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));

    if (isSupabaseConfigured) {
      sbPatchProduct(id, productData).catch(console.error);
    } else {
      fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      }).catch(() => {});
    }
  };

  const toggleProductAvailability = async (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    await updateProduct(id, { available: !target.available });
  };

  const deleteProduct = async (id: string) => {
    await localDB.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));

    if (isSupabaseConfigured) {
      sbDeleteProduct(id).catch(console.error);
    } else {
      fetch(`/api/products/${id}`, { method: 'DELETE' }).catch(() => {});
    }
  };

  return (
    <OrderContext.Provider
      value={{
        products,
        categories,
        orders,
        cart,
        activeCategoryId,
        searchQuery,
        isLoading,
        setActiveCategoryId,
        setSearchQuery,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        createOrder,
        updateOrderStatus,
        updatePaymentStatus,
        deleteOrder,
        updateOrder,
        addProduct,
        updateProduct,
        toggleProductAvailability,
        deleteProduct,
        refreshData,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
