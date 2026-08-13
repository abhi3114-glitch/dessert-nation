-- DESSERT NATION ASHTA — SUPABASE CLOUD DATABASE SCHEMA
-- Run this in your Supabase Project → SQL Editor → New Query → Run All

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
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
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
  phone TEXT NOT NULL DEFAULT '',
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
  customer_phone TEXT DEFAULT '',
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
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  unit_price NUMERIC NOT NULL DEFAULT 0,
  quantity INT NOT NULL DEFAULT 1,
  item_total NUMERIC NOT NULL DEFAULT 0
);

-- ─── ROW LEVEL SECURITY ────────────────────────────────────────────────────
-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Drop old policies if re-running
DROP POLICY IF EXISTS "Allow public POS access" ON categories;
DROP POLICY IF EXISTS "Allow public POS access" ON products;
DROP POLICY IF EXISTS "Allow public POS access" ON users;
DROP POLICY IF EXISTS "Allow public POS access" ON orders;
DROP POLICY IF EXISTS "Allow public POS access" ON order_items;

-- Allow full access for all authenticated and anon clients (POS phones use anon key)
CREATE POLICY "Allow public POS access" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public POS access" ON products   FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public POS access" ON users      FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public POS access" ON orders     FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public POS access" ON order_items FOR ALL USING (true) WITH CHECK (true);
