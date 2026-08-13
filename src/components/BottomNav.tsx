import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { LayoutDashboard, ShoppingBag, Plus, Utensils, Settings } from 'lucide-react';

export type TabType = 'dashboard' | 'pos' | 'orders' | 'products' | 'reports' | 'staff' | 'settings';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser } = useAuth();
  const { orders, cart } = useOrders();

  const isOwner = currentUser?.role === 'owner';
  const activeOrdersCount = orders.filter((o) => o.orderStatus !== 'COMPLETED').length;
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-cafe-surface/95 backdrop-blur border-t border-cafe-border px-4 py-2 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around text-xs">
        {/* Home */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center py-1 px-2 transition ${
            activeTab === 'dashboard' ? 'text-cafe-caramel font-black' : 'text-cafe-muted hover:text-cafe-text'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-[10px] mt-1 font-semibold">Home</span>
        </button>

        {/* Orders */}
        <button
          onClick={() => setActiveTab('orders')}
          className={`relative flex flex-col items-center py-1 px-2 transition ${
            activeTab === 'orders' ? 'text-cafe-caramel font-black' : 'text-cafe-muted hover:text-cafe-text'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="text-[10px] mt-1 font-semibold">Orders</span>
          {activeOrdersCount > 0 && (
            <span className="absolute -top-1 right-0 bg-cafe-caramel text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
              {activeOrdersCount}
            </span>
          )}
        </button>

        {/* REFINED NEW SALE BUTTON (Section 18: Prominent but NOT an oversized floating bubble) */}
        <button
          onClick={() => setActiveTab('pos')}
          className={`relative flex items-center space-x-1.5 px-3 py-2 rounded-md font-extrabold text-xs transition active:scale-95 ${
            activeTab === 'pos'
              ? 'bg-cafe-caramel text-white shadow-xs'
              : 'bg-cafe-subtle text-cafe-caramel border border-cafe-caramel/40'
          }`}
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>New Sale</span>
          {cartItemCount > 0 && (
            <span className="bg-cafe-gold text-cafe-text text-[9px] font-black px-1.5 py-0.2 rounded-xs ml-1">
              {cartItemCount}
            </span>
          )}
        </button>

        {/* Menu */}
        <button
          onClick={() => setActiveTab('products')}
          className={`flex flex-col items-center py-1 px-2 transition ${
            activeTab === 'products' ? 'text-cafe-caramel font-black' : 'text-cafe-muted hover:text-cafe-text'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span className="text-[10px] mt-1 font-semibold">Menu</span>
        </button>

        {/* Settings */}
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center py-1 px-2 transition ${
            activeTab === 'settings' ? 'text-cafe-caramel font-black' : 'text-cafe-muted hover:text-cafe-text'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span className="text-[10px] mt-1 font-semibold">Settings</span>
        </button>
      </div>
    </nav>
  );
};
