-- DESSERT NATION ASHTA — SUPABASE CLOUD DATABASE SCHEMA
-- Execute this SQL script inside your Supabase Project's SQL Editor to enable 24/7 cloud sync.

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL DEFAULT 'biz_dn_ashta',
  name TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 1
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL DEFAULT 'biz_dn_ashta',
  category_id TEXT REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  available BOOLEAN NOT NULL DEFAULT TRUE,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. USERS / EMPLOYEES TABLE
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL DEFAULT 'biz_dn_ashta',
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  password TEXT DEFAULT 'password123',
  role TEXT NOT NULL DEFAULT 'employee',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL DEFAULT 'biz_dn_ashta',
  order_number SERIAL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  order_type TEXT NOT NULL DEFAULT 'Dine-in',
  subtotal NUMERIC NOT NULL DEFAULT 0,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL DEFAULT 'UPI',
  payment_status TEXT NOT NULL DEFAULT 'Paid',
  order_status TEXT NOT NULL DEFAULT 'NEW',
  created_by_name TEXT NOT NULL DEFAULT 'Staff',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  unit_price NUMERIC NOT NULL DEFAULT 0,
  quantity INT NOT NULL DEFAULT 1,
  item_total NUMERIC NOT NULL DEFAULT 0
);

-- ENABLE ROW LEVEL SECURITY (RLS) & PUBLIC SYNC ACCESS FOR POS PHONES
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public POS access" ON categories FOR ALL USING (true);
CREATE POLICY "Allow public POS access" ON products FOR ALL USING (true);
CREATE POLICY "Allow public POS access" ON users FOR ALL USING (true);
CREATE POLICY "Allow public POS access" ON orders FOR ALL USING (true);
CREATE POLICY "Allow public POS access" ON order_items FOR ALL USING (true);
