# 🍰 Dessert Nation Ashta — Mobile POS & Café Sales Management System

A premium, mobile-first, offline-first café order recording and sales management application built for **Dessert Nation Ashta, Madhya Pradesh**.

---

## 🌟 Key Features

- **📱 Mobile-First & Offline-First**: Built with IndexedDB and `syncEngine` so staff can record walk-in sales even without internet.
- **🍰 Complete 16-Category Menu**:
  1. Waffles (11 items)
  2. Mini Pancakes (7 items)
  3. Brownie Bowl (6 items)
  4. Waffle Cake (4 items)
  5. Ice Cream Add-ons (9 items)
  6. Cold Coffee (4 items)
  7. Hot Beverages (6 items)
  8. Shakes (4 items)
  9. Chinese (10 items)
  10. Continental (5 items)
  11. Wraps (2 items)
  12. Burger (2 items)
  13. Sandwich (5 items)
  14. Fries (3 items)
  15. MoMo (7 items)
  16. Maggie (3 items)
- **👤 Mandatory Customer Name**: compulsory validation for every sale to replace paper-and-pen records.
- **📅 Date-Wise Reports & Analytics**: Pick any specific day with an HTML date picker to view earnings, AOV, payment breakdown (UPI, Cash, Card), top selling desserts, and full order list.
- **✏️ Edit & Delete Orders**: Modify existing orders on customer request or delete mistakes with confirmation.
- **🔐 Phone Number & Password Authentication**: Owner (`9876543210`) & Staff accounts with persistent mobile session.
- **🚀 Cloud Deployment Ready**: Preconfigured for **Vercel** (`vercel.json`), **Render** (`render.yaml`), **Supabase** (`supabase_schema.sql`), and **Capacitor Android** (`android/`).

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
- App UI: `http://localhost:5173/`
- API Server: `http://localhost:3001/`

### 3. Build for Production
```bash
npm run build
```

---

## ☁️ Cloud Deployment (Vercel + Supabase)

1. Execute `supabase_schema.sql` in your **[Supabase](https://supabase.com)** SQL Editor.
2. Deploy to Vercel:
   ```bash
   npx vercel
   ```
3. Set environment variables:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase Anon Key

---

## 🤖 Android Native App (Capacitor)

```bash
npm run cap:build
```
Open `android/` directory in Android Studio to build `app-debug.apk`.
