import { Category, Product, Business, User } from '../types/pos';

export const DEFAULT_BUSINESS: Business = {
  id: 'biz_dn_ashta',
  name: 'Dessert Nation',
  location: 'Ashta, Madhya Pradesh',
  currency: '₹',
  phone: '+91 98765 43210',
  createdAt: new Date().toISOString(),
};

export const DEFAULT_USERS: User[] = [
  {
    id: 'user_owner_rahul',
    businessId: 'biz_dn_ashta',
    name: 'Rahul Sharma (Owner)',
    email: 'owner@dessertnation.com',
    role: 'owner',
    active: true,
    phone: '9876543210',
    password: 'password123',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user_emp_rahul',
    businessId: 'biz_dn_ashta',
    name: 'Rahul',
    email: 'rahul@dessertnation.com',
    role: 'employee',
    active: true,
    phone: '9876543211',
    password: 'password123',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user_emp_aman',
    businessId: 'biz_dn_ashta',
    name: 'Aman',
    email: 'aman@dessertnation.com',
    role: 'employee',
    active: true,
    phone: '9876543212',
    password: 'password123',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user_emp_priya',
    businessId: 'biz_dn_ashta',
    name: 'Priya',
    email: 'priya@dessertnation.com',
    role: 'employee',
    active: true,
    phone: '9876543213',
    password: 'password123',
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat_waffles', businessId: 'biz_dn_ashta', name: 'Waffles', sortOrder: 1 },
  { id: 'cat_pancakes', businessId: 'biz_dn_ashta', name: 'Mini Pancakes', sortOrder: 2 },
  { id: 'cat_brownie', businessId: 'biz_dn_ashta', name: 'Brownie Bowl', sortOrder: 3 },
  { id: 'cat_waffle_cake', businessId: 'biz_dn_ashta', name: 'Waffle Cake', sortOrder: 4 },
  { id: 'cat_addons', businessId: 'biz_dn_ashta', name: 'Ice Cream Add-ons', sortOrder: 5 },
  { id: 'cat_cold_drinks', businessId: 'biz_dn_ashta', name: 'Cold Coffee', sortOrder: 6 },
  { id: 'cat_hot_drinks', businessId: 'biz_dn_ashta', name: 'Hot Beverages', sortOrder: 7 },
  { id: 'cat_shakes', businessId: 'biz_dn_ashta', name: 'Shakes', sortOrder: 8 },
  { id: 'cat_chinese', businessId: 'biz_dn_ashta', name: 'Chinese', sortOrder: 9 },
  { id: 'cat_continental', businessId: 'biz_dn_ashta', name: 'Continental', sortOrder: 10 },
  { id: 'cat_wraps', businessId: 'biz_dn_ashta', name: 'Wraps', sortOrder: 11 },
  { id: 'cat_burgers', businessId: 'biz_dn_ashta', name: 'Burger', sortOrder: 12 },
  { id: 'cat_sandwiches', businessId: 'biz_dn_ashta', name: 'Sandwich', sortOrder: 13 },
  { id: 'cat_fries', businessId: 'biz_dn_ashta', name: 'Fries', sortOrder: 14 },
  { id: 'cat_momo', businessId: 'biz_dn_ashta', name: 'MoMo', sortOrder: 15 },
  { id: 'cat_maggie', businessId: 'biz_dn_ashta', name: 'Maggie', sortOrder: 16 },
];

export const DEFAULT_PRODUCTS: Product[] = [
  // --- WAFFLES ---
  { id: 'prod_wf_1', businessId: 'biz_dn_ashta', categoryId: 'cat_waffles', name: 'Triple Chocolate Waffle', price: 130, available: true, imageUrl: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_wf_2', businessId: 'biz_dn_ashta', categoryId: 'cat_waffles', name: 'Strawberry / Blueberry Filling Waffle', price: 130, available: true, imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb1475a?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_wf_3', businessId: 'biz_dn_ashta', categoryId: 'cat_waffles', name: 'Death By Triple Chocolate Waffle', price: 150, available: true, imageUrl: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_wf_4', businessId: 'biz_dn_ashta', categoryId: 'cat_waffles', name: 'Dark Chocolate Waffle', price: 140, available: true, imageUrl: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_wf_5', businessId: 'biz_dn_ashta', categoryId: 'cat_waffles', name: 'Lotus Biscoff Waffle', price: 150, available: true, imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_wf_6', businessId: 'biz_dn_ashta', categoryId: 'cat_waffles', name: 'Naked Nutella Waffle', price: 150, available: true, imageUrl: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_wf_7', businessId: 'biz_dn_ashta', categoryId: 'cat_waffles', name: 'KitKat Waffle', price: 150, available: true, imageUrl: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_wf_8', businessId: 'biz_dn_ashta', categoryId: 'cat_waffles', name: 'Red Velvet White Chocolate Waffle', price: 150, available: true, imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb1475a?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_wf_9', businessId: 'biz_dn_ashta', categoryId: 'cat_waffles', name: 'French Crunch Nutella Waffle', price: 150, available: true, imageUrl: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_wf_10', businessId: 'biz_dn_ashta', categoryId: 'cat_waffles', name: 'Real Almond Filling', price: 170, available: true, imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_wf_11', businessId: 'biz_dn_ashta', categoryId: 'cat_waffles', name: 'Dairy Milk Waffle', price: 150, available: true, imageUrl: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=300', createdAt: new Date().toISOString() },

  // --- MINI PANCAKES ---
  { id: 'prod_mp_1', businessId: 'biz_dn_ashta', categoryId: 'cat_pancakes', name: 'Classic Triple Chocolate Pancakes', price: 150, available: true, imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_mp_2', businessId: 'biz_dn_ashta', categoryId: 'cat_pancakes', name: 'Red Velvet White Chocolate Pancakes', price: 200, available: true, imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_mp_3', businessId: 'biz_dn_ashta', categoryId: 'cat_pancakes', name: 'High on Nutella Pancakes', price: 270, available: true, imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_mp_4', businessId: 'biz_dn_ashta', categoryId: 'cat_pancakes', name: 'Oreo Topping Pancakes', price: 250, available: true, imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_mp_5', businessId: 'biz_dn_ashta', categoryId: 'cat_pancakes', name: 'Lotus Biscoff Pancakes', price: 300, available: true, imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_mp_6', businessId: 'biz_dn_ashta', categoryId: 'cat_pancakes', name: 'KitKat Toppings Pancakes', price: 250, available: true, imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_mp_7', businessId: 'biz_dn_ashta', categoryId: 'cat_pancakes', name: 'Real Strawberry Pancakes (Seasonal)', price: 300, available: true, imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300', createdAt: new Date().toISOString() },

  // --- BROWNIE BOWL ---
  { id: 'prod_bb_1', businessId: 'biz_dn_ashta', categoryId: 'cat_brownie', name: 'Brownie with Triple Chocolate', price: 150, available: true, imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_bb_2', businessId: 'biz_dn_ashta', categoryId: 'cat_brownie', name: 'Brownie with Dairy Milk Chocolate', price: 170, available: true, imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_bb_3', businessId: 'biz_dn_ashta', categoryId: 'cat_brownie', name: 'Brownie with White/Dark Chocolate', price: 200, available: true, imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_bb_4', businessId: 'biz_dn_ashta', categoryId: 'cat_brownie', name: 'Death By Chocolate Brownie', price: 250, available: true, imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_bb_5', businessId: 'biz_dn_ashta', categoryId: 'cat_brownie', name: 'Strawberry Brownie (Seasonal)', price: 0, available: false, imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_bb_6', businessId: 'biz_dn_ashta', categoryId: 'cat_brownie', name: 'Matilda Bowl', price: 300, available: true, imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300', createdAt: new Date().toISOString() },

  // --- WAFFLE CAKE ---
  { id: 'prod_wc_1', businessId: 'biz_dn_ashta', categoryId: 'cat_waffle_cake', name: 'Red Velvet Waffle Cake', price: 250, available: true, imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb1475a?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_wc_2', businessId: 'biz_dn_ashta', categoryId: 'cat_waffle_cake', name: 'Triple Chocolate Waffle Cake', price: 250, available: true, imageUrl: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_wc_3', businessId: 'biz_dn_ashta', categoryId: 'cat_waffle_cake', name: 'Lotus Biscoff Waffle Cake', price: 350, available: true, imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_wc_4', businessId: 'biz_dn_ashta', categoryId: 'cat_waffle_cake', name: 'KIKI Oreo Waffle Cake', price: 350, available: true, imageUrl: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=300', createdAt: new Date().toISOString() },

  // --- ADD-ON ICE CREAM SCOOP ---
  { id: 'prod_ic_1', businessId: 'biz_dn_ashta', categoryId: 'cat_addons', name: 'Premium Vanilla', price: 40, available: true, imageUrl: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_ic_2', businessId: 'biz_dn_ashta', categoryId: 'cat_addons', name: 'Rich Chocolate', price: 40, available: true, imageUrl: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_ic_3', businessId: 'biz_dn_ashta', categoryId: 'cat_addons', name: 'Strawberry', price: 40, available: true, imageUrl: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_ic_4', businessId: 'biz_dn_ashta', categoryId: 'cat_addons', name: 'American Nuts', price: 50, available: true, imageUrl: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_ic_5', businessId: 'biz_dn_ashta', categoryId: 'cat_addons', name: 'Butter Scotch', price: 50, available: true, imageUrl: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_ic_6', businessId: 'biz_dn_ashta', categoryId: 'cat_addons', name: 'Black Currant', price: 50, available: true, imageUrl: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_ic_7', businessId: 'biz_dn_ashta', categoryId: 'cat_addons', name: 'Choco Mud Pie', price: 50, available: true, imageUrl: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_ic_8', businessId: 'biz_dn_ashta', categoryId: 'cat_addons', name: 'Alphonso Mango', price: 50, available: true, imageUrl: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_ic_9', businessId: 'biz_dn_ashta', categoryId: 'cat_addons', name: 'Cookies N Cream', price: 50, available: true, imageUrl: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=300', createdAt: new Date().toISOString() },

  // --- COLD COFFEE ---
  { id: 'prod_cc_1', businessId: 'biz_dn_ashta', categoryId: 'cat_cold_drinks', name: 'Classic Cold Coffee', price: 100, available: true, imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_cc_2', businessId: 'biz_dn_ashta', categoryId: 'cat_cold_drinks', name: 'Hazelnut Cold Coffee', price: 120, available: true, imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_cc_3', businessId: 'biz_dn_ashta', categoryId: 'cat_cold_drinks', name: 'Brownie Cold Coffee', price: 120, available: true, imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_cc_4', businessId: 'biz_dn_ashta', categoryId: 'cat_cold_drinks', name: 'Ice Cream Cold Coffee', price: 120, available: true, imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300', createdAt: new Date().toISOString() },

  // --- HOT BEVERAGES ---
  { id: 'prod_hb_1', businessId: 'biz_dn_ashta', categoryId: 'cat_hot_drinks', name: 'Hot Tea', price: 15, available: true, imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_hb_2', businessId: 'biz_dn_ashta', categoryId: 'cat_hot_drinks', name: 'Hot Coffee', price: 30, available: true, imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_hb_3', businessId: 'biz_dn_ashta', categoryId: 'cat_hot_drinks', name: 'Black Coffee', price: 30, available: true, imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_hb_4', businessId: 'biz_dn_ashta', categoryId: 'cat_hot_drinks', name: 'Black Tea', price: 15, available: true, imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_hb_5', businessId: 'biz_dn_ashta', categoryId: 'cat_hot_drinks', name: 'Hot Chocolate', price: 70, available: true, imageUrl: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_hb_6', businessId: 'biz_dn_ashta', categoryId: 'cat_hot_drinks', name: 'Hot Mocha', price: 50, available: true, imageUrl: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=300', createdAt: new Date().toISOString() },

  // --- SHAKES ---
  { id: 'prod_sh_1', businessId: 'biz_dn_ashta', categoryId: 'cat_shakes', name: 'Oreo Shake', price: 100, available: true, imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_sh_2', businessId: 'biz_dn_ashta', categoryId: 'cat_shakes', name: 'KitKat Shake', price: 120, available: true, imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_sh_3', businessId: 'biz_dn_ashta', categoryId: 'cat_shakes', name: 'Lotus Biscoff Shake', price: 120, available: true, imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_sh_4', businessId: 'biz_dn_ashta', categoryId: 'cat_shakes', name: 'Chocolate Shake', price: 120, available: true, imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300', createdAt: new Date().toISOString() },

  // --- CHINESE ---
  { id: 'prod_cn_1', businessId: 'biz_dn_ashta', categoryId: 'cat_chinese', name: 'Veg Noodles', price: 100, available: true, imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_cn_2', businessId: 'biz_dn_ashta', categoryId: 'cat_chinese', name: 'Hakka Noodles', price: 120, available: true, imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_cn_3', businessId: 'biz_dn_ashta', categoryId: 'cat_chinese', name: 'Schezwan Noodles', price: 120, available: true, imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_cn_4', businessId: 'biz_dn_ashta', categoryId: 'cat_chinese', name: 'Burnt Garlic Noodles', price: 130, available: true, imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_cn_5', businessId: 'biz_dn_ashta', categoryId: 'cat_chinese', name: 'Chilli Garlic Noodles', price: 140, available: true, imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_cn_6', businessId: 'biz_dn_ashta', categoryId: 'cat_chinese', name: 'Veg Fried Rice', price: 100, available: true, imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_cn_7', businessId: 'biz_dn_ashta', categoryId: 'cat_chinese', name: 'Paneer Fried Rice', price: 150, available: true, imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_cn_8', businessId: 'biz_dn_ashta', categoryId: 'cat_chinese', name: 'Chilli Paneer', price: 180, available: true, imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_cn_9', businessId: 'biz_dn_ashta', categoryId: 'cat_chinese', name: 'Veg Manchurian', price: 130, available: true, imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_cn_10', businessId: 'biz_dn_ashta', categoryId: 'cat_chinese', name: 'Crispy Corn', price: 100, available: true, imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300', createdAt: new Date().toISOString() },

  // --- CONTINENTAL (New Section) ---
  { id: 'prod_ct_1', businessId: 'biz_dn_ashta', categoryId: 'cat_continental', name: 'Tandoori Mac n Cheese', price: 200, available: true, imageUrl: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_ct_2', businessId: 'biz_dn_ashta', categoryId: 'cat_continental', name: 'Makhni Mac n Cheese', price: 200, available: true, imageUrl: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_ct_3', businessId: 'biz_dn_ashta', categoryId: 'cat_continental', name: 'Chipotle Mac n Cheese', price: 200, available: true, imageUrl: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_ct_4', businessId: 'biz_dn_ashta', categoryId: 'cat_continental', name: 'Arrabbiata Red Sauce Pasta', price: 200, available: true, imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d628876c?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_ct_5', businessId: 'biz_dn_ashta', categoryId: 'cat_continental', name: 'Alfredo White Sauce Pasta', price: 200, available: true, imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d628876c?w=300', createdAt: new Date().toISOString() },

  // --- WRAPS ---
  { id: 'prod_wr_1', businessId: 'biz_dn_ashta', categoryId: 'cat_wraps', name: 'Paneer Wrap', price: 120, available: true, imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_wr_2', businessId: 'biz_dn_ashta', categoryId: 'cat_wraps', name: 'Veg Wrap', price: 120, available: true, imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300', createdAt: new Date().toISOString() },

  // --- BURGER ---
  { id: 'prod_bg_1', businessId: 'biz_dn_ashta', categoryId: 'cat_burgers', name: 'Veg Mac Tikki Burger', price: 70, available: true, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_bg_2', businessId: 'biz_dn_ashta', categoryId: 'cat_burgers', name: 'Paneer Mac Spicy Burger', price: 110, available: true, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300', createdAt: new Date().toISOString() },

  // --- SANDWICH ---
  { id: 'prod_sw_1', businessId: 'biz_dn_ashta', categoryId: 'cat_sandwiches', name: 'Paneer Makhni Sandwich', price: 120, available: true, imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_sw_2', businessId: 'biz_dn_ashta', categoryId: 'cat_sandwiches', name: 'Veg Makhni Sandwich', price: 100, available: true, imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_sw_3', businessId: 'biz_dn_ashta', categoryId: 'cat_sandwiches', name: 'Mozzarella Cheese Sandwich', price: 100, available: true, imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_sw_4', businessId: 'biz_dn_ashta', categoryId: 'cat_sandwiches', name: 'Corn Cheese Sandwich', price: 100, available: true, imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_sw_5', businessId: 'biz_dn_ashta', categoryId: 'cat_sandwiches', name: 'Cheese Chutney Sandwich', price: 100, available: true, imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300', createdAt: new Date().toISOString() },

  // --- FRIES ---
  { id: 'prod_fr_1', businessId: 'biz_dn_ashta', categoryId: 'cat_fries', name: 'Peri Peri Fries', price: 80, available: true, imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_fr_2', businessId: 'biz_dn_ashta', categoryId: 'cat_fries', name: 'Saucy Loaded Fries', price: 130, available: true, imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_fr_3', businessId: 'biz_dn_ashta', categoryId: 'cat_fries', name: 'Honey Chilli Fries', price: 150, available: true, imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300', createdAt: new Date().toISOString() },

  // --- MOMO ---
  { id: 'prod_mo_1', businessId: 'biz_dn_ashta', categoryId: 'cat_momo', name: 'Veg Steam Momo', price: 80, available: true, imageUrl: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_mo_2', businessId: 'biz_dn_ashta', categoryId: 'cat_momo', name: 'Paneer Steam Momo', price: 100, available: true, imageUrl: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_mo_3', businessId: 'biz_dn_ashta', categoryId: 'cat_momo', name: 'Veg Fried Momo', price: 100, available: true, imageUrl: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_mo_4', businessId: 'biz_dn_ashta', categoryId: 'cat_momo', name: 'Paneer Fried Momo', price: 120, available: true, imageUrl: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_mo_5', businessId: 'biz_dn_ashta', categoryId: 'cat_momo', name: 'Tandoori Saucy Momo', price: 150, available: true, imageUrl: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_mo_6', businessId: 'biz_dn_ashta', categoryId: 'cat_momo', name: 'Makhni Saucy Momo', price: 150, available: true, imageUrl: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_mo_7', businessId: 'biz_dn_ashta', categoryId: 'cat_momo', name: 'Chilli Garlic Momo', price: 150, available: true, imageUrl: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=300', createdAt: new Date().toISOString() },

  // --- MAGGIE ---
  { id: 'prod_mg_1', businessId: 'biz_dn_ashta', categoryId: 'cat_maggie', name: 'Veg Maggie', price: 60, available: true, imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_mg_2', businessId: 'biz_dn_ashta', categoryId: 'cat_maggie', name: 'Veg Cheese Maggie', price: 70, available: true, imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=300', createdAt: new Date().toISOString() },
  { id: 'prod_mg_3', businessId: 'biz_dn_ashta', categoryId: 'cat_maggie', name: 'Plain Soupy Maggie', price: 60, available: true, imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=300', createdAt: new Date().toISOString() },
];
