import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { LayoutDashboard, ShoppingBag, Plus, Utensils, BarChart3, Users, Settings, LogOut } from 'lucide-react';
import { TabType } from './BottomNav';
import { SyncBadge } from './SyncBadge';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const { currentUser } = useAuth();
  const { orders } = useOrders();

  const isOwner = currentUser?.role === 'owner';
  const activeOrdersCount = orders.filter((o) => o.orderStatus !== 'COMPLETED').length;

  return (
    <aside className="hidden md:flex flex-col w-60 bg-cafe-surface border-r border-cafe-border min-h-screen p-5 sticky top-0 h-screen select-none">
      {/* Brand Header */}
      <div className="flex items-center space-x-3 pb-5 border-b border-cafe-border">
        <img
          src="/logo.jpg"
          alt="Dessert Nation"
          className="w-9 h-9 object-contain rounded-md bg-cafe-subtle p-0.5 border border-cafe-border shadow-xs"
        />
        <div>
          <h1 className="font-black text-sm text-cafe-text tracking-tight leading-none">DESSERT NATION</h1>
          <p className="text-[10px] font-bold text-cafe-caramel uppercase tracking-widest mt-1">ASHTA • CAFÉ POS</p>
        </div>
      </div>

      {/* Network / Sync Status */}
      <div className="py-3 border-b border-cafe-border/60">
        <SyncBadge />
      </div>

      {/* Editorial Navigation Links (Section 17: Branded left bar / text highlight, NOT giant rounded boxes) */}
      <nav className="flex-1 py-5 space-y-1 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-sm transition ${
            activeTab === 'dashboard'
              ? 'text-cafe-caramel font-black bg-cafe-subtle/80 border-l-3 border-cafe-caramel'
              : 'text-cafe-muted hover:text-cafe-text hover:bg-cafe-subtle/40'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-sm transition ${
            activeTab === 'orders'
              ? 'text-cafe-caramel font-black bg-cafe-subtle/80 border-l-3 border-cafe-caramel'
              : 'text-cafe-muted hover:text-cafe-text hover:bg-cafe-subtle/40'
          }`}
        >
          <div className="flex items-center space-x-3">
            <ShoppingBag className="w-4 h-4" />
            <span>Orders</span>
          </div>
          {activeOrdersCount > 0 && (
            <span className="bg-cafe-caramel text-white text-[10px] font-black px-1.5 py-0.5 rounded-xs">
              {activeOrdersCount}
            </span>
          )}
        </button>

        {/* Refined New Sale CTA (Section 17 & 18) */}
        <button
          onClick={() => setActiveTab('pos')}
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-sm transition my-3 ${
            activeTab === 'pos'
              ? 'bg-cafe-caramel text-white font-black shadow-xs'
              : 'bg-cafe-subtle text-cafe-caramel font-black border border-cafe-caramel/30 hover:bg-cafe-caramel hover:text-white'
          }`}
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Sale</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-sm transition ${
            activeTab === 'products'
              ? 'text-cafe-caramel font-black bg-cafe-subtle/80 border-l-3 border-cafe-caramel'
              : 'text-cafe-muted hover:text-cafe-text hover:bg-cafe-subtle/40'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Menu</span>
        </button>

        {isOwner && (
          <>
            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-sm transition ${
                activeTab === 'reports'
                  ? 'text-cafe-caramel font-black bg-cafe-subtle/80 border-l-3 border-cafe-caramel'
                  : 'text-cafe-muted hover:text-cafe-text hover:bg-cafe-subtle/40'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Reports</span>
            </button>

            <button
              onClick={() => setActiveTab('staff')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-sm transition ${
                activeTab === 'staff'
                  ? 'text-cafe-caramel font-black bg-cafe-subtle/80 border-l-3 border-cafe-caramel'
                  : 'text-cafe-muted hover:text-cafe-text hover:bg-cafe-subtle/40'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Employees</span>
            </button>
          </>
        )}

        <div className="pt-3">
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-sm transition ${
              activeTab === 'settings'
                ? 'text-cafe-caramel font-black bg-cafe-subtle/80 border-l-3 border-cafe-caramel'
                : 'text-cafe-muted hover:text-cafe-text hover:bg-cafe-subtle/40'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </nav>

      {/* User Session Footer */}
      <div className="pt-4 border-t border-cafe-border space-y-2">
        <div className="flex items-center justify-between bg-cafe-subtle/60 p-2.5 rounded-sm border border-cafe-border text-xs">
          <div className="min-w-0 flex-1 pr-2">
            <p className="font-bold text-cafe-text truncate">{currentUser?.name}</p>
            <p className="text-[10px] text-cafe-caramel font-bold uppercase">{currentUser?.role}</p>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="p-1 rounded-sm text-cafe-muted hover:text-cafe-danger hover:bg-white transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
