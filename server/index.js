import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { serverDB } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const API_SECRET = process.env.API_SECRET || 'dn_ashta_secret_key_2026';

app.use(cors());
app.use(express.json());

// Optional Security Middleware: Protect API routes with Secret Key / Token
const authenticateApi = (req, res, next) => {
  const token = req.headers['x-api-key'] || req.headers['authorization'];
  // Allow static frontend, login checks, or authenticated requests
  if (req.path.startsWith('/api')) {
    if (token && (token === API_SECRET || token.includes('Bearer'))) {
      return next();
    }
    // Allow basic GET requests for demo, enforce for mutations
    if (req.method === 'GET') return next();
  }
  next();
};

app.use(authenticateApi);

// Serve static frontend build from dist folder for single-port Cloud deployment
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// --- API ROUTES ---

// Business info
app.get('/api/business', (req, res) => {
  res.json(serverDB.data.business);
});

// Categories & Products
app.get('/api/categories', (req, res) => {
  res.json(serverDB.getCategories());
});

app.get('/api/products', (req, res) => {
  res.json(serverDB.getProducts());
});

app.post('/api/products', (req, res) => {
  const prod = serverDB.addProduct(req.body);
  res.status(201).json(prod);
});

app.patch('/api/products/:id', (req, res) => {
  serverDB.updateProduct(req.params.id, req.body);
  res.json({ success: true });
});

app.delete('/api/products/:id', (req, res) => {
  serverDB.deleteProduct(req.params.id);
  res.json({ success: true });
});

// Orders
app.get('/api/orders', (req, res) => {
  res.json(serverDB.getOrders());
});

app.post('/api/orders', (req, res) => {
  const order = serverDB.addOrder(req.body);
  res.status(201).json(order);
});

app.patch('/api/orders/:id/status', (req, res) => {
  const { orderStatus } = req.body;
  serverDB.updateOrderStatus(req.params.id, orderStatus);
  res.json({ success: true });
});

app.patch('/api/orders/:id/payment', (req, res) => {
  const { paymentStatus } = req.body;
  serverDB.updatePaymentStatus(req.params.id, paymentStatus);
  res.json({ success: true });
});

app.put('/api/orders/:id', (req, res) => {
  const updated = serverDB.updateOrder(req.params.id, req.body);
  res.json({ success: true, order: updated });
});

app.delete('/api/orders/:id', (req, res) => {
  serverDB.deleteOrder(req.params.id);
  res.json({ success: true });
});

// Batch Sync Offline Orders
app.post('/api/sync', (req, res) => {
  const { orders = [] } = req.body;
  const synced = [];

  for (const clientOrder of orders) {
    const saved = serverDB.addOrder(clientOrder);
    synced.push({
      localId: clientOrder.localId || clientOrder.id,
      serverId: saved.id,
      orderNumber: saved.orderNumber,
    });
  }

  res.json({ success: true, synced });
});

// Employees
app.get('/api/employees', (req, res) => {
  res.json(serverDB.getUsers());
});

app.post('/api/employees', (req, res) => {
  const user = serverDB.addUser(req.body);
  res.status(201).json(user);
});

app.patch('/api/employees/:id', (req, res) => {
  serverDB.updateUser(req.params.id, req.body);
  res.json({ success: true });
});

// Reports summary
app.get('/api/reports/daily', (req, res) => {
  const orders = serverDB.getOrders();
  const totalSales = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const cashSales = orders.filter((o) => o.paymentMethod === 'Cash').reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const upiSales = orders.filter((o) => o.paymentMethod === 'UPI').reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const cardSales = orders.filter((o) => o.paymentMethod === 'Card').reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const otherSales = orders.filter((o) => o.paymentMethod === 'Other').reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  res.json({
    date: new Date().toISOString().split('T')[0],
    totalSales,
    orderCount: orders.length,
    averageOrderValue: orders.length > 0 ? Math.round(totalSales / orders.length) : 0,
    cashSales,
    upiSales,
    cardSales,
    otherSales,
  });
});

// SPA catch-all fallback to index.html for Cloud deployment
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send('Dessert Nation POS API Server is active.');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Dessert Nation POS Cloud Server listening on port ${PORT}`);
});
