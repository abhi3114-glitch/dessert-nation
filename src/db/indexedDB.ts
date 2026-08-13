import { Order, Product, Category, User, Business } from '../types/pos';
import { DEFAULT_PRODUCTS, DEFAULT_CATEGORIES, DEFAULT_USERS, DEFAULT_BUSINESS } from '../data/defaultMenu';

const DB_NAME = 'DessertNationPOSDB';
const DB_VERSION = 1;

export class LocalDatabase {
  private dbPromise: Promise<IDBDatabase>;

  constructor() {
    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('products')) {
          db.createObjectStore('products', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('categories')) {
          db.createObjectStore('categories', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('orders')) {
          db.createObjectStore('orders', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('business')) {
          db.createObjectStore('business', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('sync_queue')) {
          db.createObjectStore('sync_queue', { keyPath: 'id' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    this.initDefaultData();
  }

  private async initDefaultData() {
    try {
      const db = await this.dbPromise;

      const tx = db.transaction(['products', 'categories', 'users', 'business'], 'readwrite');
      const prodStore = tx.objectStore('products');
      const catStore = tx.objectStore('categories');
      const userStore = tx.objectStore('users');
      const bizStore = tx.objectStore('business');

      // Always populate/upsert categories and default products
      DEFAULT_CATEGORIES.forEach((c) => catStore.put(c));
      DEFAULT_PRODUCTS.forEach((p) => prodStore.put(p));

      const userCountReq = userStore.count();
      userCountReq.onsuccess = () => {
        if (userCountReq.result === 0) {
          DEFAULT_USERS.forEach((u) => userStore.put(u));
          bizStore.put(DEFAULT_BUSINESS);
        }
      };
    } catch (e) {
      console.error('Failed to seed default local DB data:', e);
    }
  }

  // --- PRODUCTS ---
  async getProducts(): Promise<Product[]> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction('products', 'readonly');
      const request = tx.objectStore('products').getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async saveProduct(product: Product): Promise<void> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction('products', 'readwrite');
      const request = tx.objectStore('products').put(product);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteProduct(id: string): Promise<void> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction('products', 'readwrite');
      const request = tx.objectStore('products').delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // --- CATEGORIES ---
  async getCategories(): Promise<Category[]> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction('categories', 'readonly');
      const request = tx.objectStore('categories').getAll();
      request.onsuccess = () => {
        const cats = request.result || [];
        cats.sort((a, b) => a.sortOrder - b.sortOrder);
        resolve(cats);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async saveCategory(category: Category): Promise<void> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction('categories', 'readwrite');
      const request = tx.objectStore('categories').put(category);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // --- ORDERS ---
  async getOrders(): Promise<Order[]> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction('orders', 'readonly');
      const request = tx.objectStore('orders').getAll();
      request.onsuccess = () => {
        const rawOrders: any[] = request.result || [];
        const orders: Order[] = rawOrders
          .filter((o) => o && typeof o === 'object')
          .map((o) => ({
            ...o,
            createdAt: o.createdAt || o.updatedAt || new Date().toISOString(),
            items: Array.isArray(o.items) ? o.items : [],
            totalAmount: typeof o.totalAmount === 'number' ? o.totalAmount : 0,
            orderStatus: o.orderStatus || 'NEW',
            paymentMethod: o.paymentMethod || 'UPI',
            paymentStatus: o.paymentStatus || 'Paid',
            orderType: o.orderType || 'Dine-in',
            createdByName: o.createdByName || 'Employee',
          }));
        orders.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        resolve(orders);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getOrder(id: string): Promise<Order | null> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction('orders', 'readonly');
      const request = tx.objectStore('orders').get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async saveOrder(order: Order): Promise<void> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction('orders', 'readwrite');
      const request = tx.objectStore('orders').put(order);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteOrder(id: string): Promise<void> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction('orders', 'readwrite');
      const request = tx.objectStore('orders').delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // --- USERS / EMPLOYEES ---
  async getUsers(): Promise<User[]> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction('users', 'readonly');
      const request = tx.objectStore('users').getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async saveUser(user: User): Promise<void> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction('users', 'readwrite');
      const request = tx.objectStore('users').put(user);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteUser(id: string): Promise<void> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction('users', 'readwrite');
      const request = tx.objectStore('users').delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // --- SYNC QUEUE ---
  async addToSyncQueue(order: Order): Promise<void> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction('sync_queue', 'readwrite');
      const request = tx.objectStore('sync_queue').put(order);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getSyncQueue(): Promise<Order[]> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction('sync_queue', 'readonly');
      const request = tx.objectStore('sync_queue').getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async removeFromSyncQueue(id: string): Promise<void> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction('sync_queue', 'readwrite');
      const request = tx.objectStore('sync_queue').delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const localDB = new LocalDatabase();
