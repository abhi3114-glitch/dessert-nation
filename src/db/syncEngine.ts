import { localDB } from './indexedDB';
import { Order } from '../types/pos';
import { supabase, isSupabaseConfigured } from './supabase';

export type SyncEventListener = (status: {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  lastSyncedAt?: string;
  message?: string;
}) => void;

class SyncEngine {
  private isOnline: boolean = navigator.onLine;
  private isSyncing: boolean = false;
  private pendingCount: number = 0;
  private lastSyncedAt?: string;
  private listeners: Set<SyncEventListener> = new Set();
  private broadcastChannel: BroadcastChannel;
  private syncTimer?: number;

  constructor() {
    this.broadcastChannel = new BroadcastChannel('dessert_pos_sync');

    // Listen to network status
    window.addEventListener('online', () => this.handleNetworkChange(true));
    window.addEventListener('offline', () => this.handleNetworkChange(false));

    // Listen to broadcast messages from other tabs/devices
    this.broadcastChannel.onmessage = (event) => {
      if (event.data?.type === 'SYNC_COMPLETE' || event.data?.type === 'ORDER_CREATED') {
        this.notifyListeners('Updated from another device/tab');
      }
    };

    // Initial check
    this.updatePendingCount();

    // Periodic sync poll when online (every 10s)
    this.syncTimer = window.setInterval(() => {
      if (this.isOnline && !this.isSyncing) {
        this.triggerSync();
      }
    }, 10000);
  }

  public subscribe(listener: SyncEventListener): () => void {
    this.listeners.add(listener);
    listener({
      isOnline: this.isOnline,
      isSyncing: this.isSyncing,
      pendingCount: this.pendingCount,
      lastSyncedAt: this.lastSyncedAt,
    });
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(message?: string) {
    this.listeners.forEach((listener) =>
      listener({
        isOnline: this.isOnline,
        isSyncing: this.isSyncing,
        pendingCount: this.pendingCount,
        lastSyncedAt: this.lastSyncedAt,
        message,
      })
    );
  }

  private handleNetworkChange(online: boolean) {
    this.isOnline = online;
    if (online) {
      this.notifyListeners('Internet connection restored — Auto-syncing...');
      this.triggerSync();
    } else {
      this.notifyListeners('Internet disconnected — Operating in Offline Mode');
    }
  }

  public async updatePendingCount() {
    const queue = await localDB.getSyncQueue();
    this.pendingCount = queue.length;
    this.notifyListeners();
  }

  public async triggerSync() {
    if (this.isSyncing || !this.isOnline) return;

    try {
      this.isSyncing = true;
      this.notifyListeners('Syncing pending orders with cloud database...');

      const pendingOrders = await localDB.getSyncQueue();
      if (pendingOrders.length === 0) {
        this.isSyncing = false;
        this.updatePendingCount();
        return;
      }

      // Direct Supabase Cloud Sync if configured
      if (isSupabaseConfigured && supabase) {
        for (const order of pendingOrders) {
          const { data: dbOrder, error } = await supabase.from('orders').insert({
            id: order.id,
            business_id: order.businessId,
            customer_name: order.customerName,
            customer_phone: order.customerPhone,
            order_type: order.orderType,
            subtotal: order.subtotal,
            total_amount: order.totalAmount,
            payment_method: order.paymentMethod,
            payment_status: order.paymentStatus,
            order_status: order.orderStatus,
            created_by_name: order.createdByName,
            created_at: order.createdAt,
          }).select().single();

          if (!error && dbOrder) {
            const updatedOrder: Order = {
              ...order,
              id: dbOrder.id,
              orderNumber: dbOrder.order_number,
              syncStatus: 'synced',
              syncedAt: new Date().toISOString(),
            };
            await localDB.saveOrder(updatedOrder);
            await localDB.removeFromSyncQueue(order.localId || order.id);
          }
        }

        this.lastSyncedAt = new Date().toISOString();
        this.notifyListeners(`Synced ${pendingOrders.length} orders to Supabase Cloud ✓`);
        this.broadcastChannel.postMessage({ type: 'SYNC_COMPLETE', count: pendingOrders.length });
        return;
      }

      // Default API Server sync (/api/sync)
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'dn_ashta_secret_key_2026',
        },
        body: JSON.stringify({ orders: pendingOrders }),
      });

      if (response.ok) {
        const result = await response.json();
        const syncedItems: { localId: string; serverId: string; orderNumber: number }[] = result.synced || [];

        for (const item of syncedItems) {
          const localOrder = await localDB.getOrder(item.localId);
          if (localOrder) {
            const updatedOrder: Order = {
              ...localOrder,
              id: item.serverId,
              orderNumber: item.orderNumber,
              syncStatus: 'synced',
              syncedAt: new Date().toISOString(),
            };

            if (item.localId !== item.serverId) {
              await localDB.deleteOrder(item.localId);
            }
            await localDB.saveOrder(updatedOrder);
          }

          await localDB.removeFromSyncQueue(item.localId);
        }

        this.lastSyncedAt = new Date().toISOString();
        this.notifyListeners(`Successfully synced ${syncedItems.length} orders ✓`);
        this.broadcastChannel.postMessage({ type: 'SYNC_COMPLETE', count: syncedItems.length });
      } else {
        this.notifyListeners('Sync server responded with an error, will retry shortly');
      }
    } catch (error) {
      console.warn('Sync failed (will auto-retry when online):', error);
      this.notifyListeners('Offline — Order saved locally, pending sync');
    } finally {
      this.isSyncing = false;
      await this.updatePendingCount();
    }
  }

  public broadcastOrderCreation() {
    this.broadcastChannel.postMessage({ type: 'ORDER_CREATED' });
  }

  public getStatus() {
    return {
      isOnline: this.isOnline,
      isSyncing: this.isSyncing,
      pendingCount: this.pendingCount,
      lastSyncedAt: this.lastSyncedAt,
    };
  }
}

export const syncEngine = new SyncEngine();
