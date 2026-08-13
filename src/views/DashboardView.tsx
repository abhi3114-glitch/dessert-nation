import React from 'react';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { OrderCard } from '../components/OrderCard';
import { Plus, ArrowRight, ShoppingBag, QrCode, Banknote, CreditCard, Sparkles } from 'lucide-react';
import { TabType } from '../components/BottomNav';

interface DashboardViewProps {
  onNavigate: (tab: TabType) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { orders = [], updateOrderStatus } = useOrders();
  const { currentUser } = useAuth();

  // Filter today's orders safely
  const todayStr = new Date().toISOString().split('T')[0];
  const safeOrders = (orders || []).filter((o) => o && typeof o === 'object');
  const todayOrders = safeOrders.filter((o) => {
    const created = String(o?.createdAt || o?.updatedAt || new Date().toISOString());
    return created.startsWith(todayStr);
  });

  // Compute metrics
  const totalSales = todayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalOrdersCount = todayOrders.length;
  const aovText = totalOrdersCount > 0 ? `₹${Math.round(totalSales / totalOrdersCount)} average` : 'No orders yet';

  const cashSales = todayOrders.filter((o) => o.paymentMethod === 'Cash').reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const upiSales = todayOrders.filter((o) => o.paymentMethod === 'UPI').reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const cardSales = todayOrders.filter((o) => o.paymentMethod === 'Card').reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const activeOrders = safeOrders.filter((o) => o?.orderStatus !== 'COMPLETED');
  const recentOrders = safeOrders.slice(0, 5);

  const formattedDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).toUpperCase();

  return (
    <div className="p-4 md:p-8 space-y-8 pb-24 max-w-4xl mx-auto">
      {/* Header Greeting & Microcopy (Section 5 & 19) */}
      <div className="flex items-start justify-between border-b border-cafe-border pb-5">
        <div>
          <span className="text-[10px] font-black uppercase text-cafe-caramel tracking-widest block mb-1">
            TODAY • {formattedDate}
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-cafe-text tracking-tight">
            Good morning, {currentUser?.name?.split(' ')[0] || 'Staff'}
          </h2>
          <p className="text-xs text-cafe-muted font-medium mt-1">
            Ready to make someone's day sweeter?
          </p>
        </div>

        <button
          onClick={() => onNavigate('pos')}
          className="flex items-center space-x-2 bg-cafe-caramel hover:bg-cafe-caramel-hover text-white font-extrabold px-4 py-2.5 rounded-sm shadow-xs active:scale-95 transition text-xs md:text-sm"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ New Sale</span>
        </button>
      </div>

      {/* TODAY'S SALES SECTION (Typographic layout as per Spec Section 7 & 19, NOT a giant card) */}
      <div className="space-y-4">
        <span className="text-[10px] font-black uppercase text-cafe-muted tracking-widest block">
          TODAY'S SUMMARY
        </span>

        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <div className="text-4xl md:text-5xl font-black text-cafe-text tracking-tight">
              ₹{totalSales.toLocaleString('en-IN')}
            </div>
            <p className="text-xs font-semibold text-cafe-muted mt-1">
              <span className="font-extrabold text-cafe-text">{totalOrdersCount} orders</span>
              <span className="mx-2 text-cafe-border">•</span>
              <span>{aovText}</span>
            </p>
          </div>

          {/* Compact Inline Payment Breakdown (Section 7) */}
          <div className="flex items-center space-x-3 text-xs bg-cafe-surface p-3 rounded-sm border border-cafe-border">
            <div>
              <span className="text-[10px] text-cafe-muted block uppercase font-bold">UPI</span>
              <span className="font-bold text-cafe-text">₹{upiSales.toLocaleString('en-IN')}</span>
            </div>
            <span className="text-cafe-border">|</span>
            <div>
              <span className="text-[10px] text-cafe-muted block uppercase font-bold">Cash</span>
              <span className="font-bold text-cafe-text">₹{cashSales.toLocaleString('en-IN')}</span>
            </div>
            <span className="text-cafe-border">|</span>
            <div>
              <span className="text-[10px] text-cafe-muted block uppercase font-bold">Card</span>
              <span className="font-bold text-cafe-text">₹{cardSales.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVE ORDERS SECTION (Section 7 & 8) */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between border-b border-cafe-border/60 pb-2">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-cafe-text flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cafe-caramel" />
            <span>ACTIVE ORDERS ({activeOrders.length})</span>
          </h3>
          <button
            onClick={() => onNavigate('orders')}
            className="text-xs font-bold text-cafe-caramel hover:underline flex items-center space-x-1"
          >
            <span>View all orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {activeOrders.length === 0 ? (
          /* Human Empty State (Spec Section 8) */
          <div className="text-center py-12 bg-cafe-surface rounded-md border border-cafe-border p-6 space-y-2">
            <Sparkles className="w-6 h-6 mx-auto text-cafe-caramel/60 mb-1" />
            <p className="font-extrabold text-sm text-cafe-text">Nothing sweet yet.</p>
            <p className="text-xs text-cafe-muted max-w-xs mx-auto">
              Your first order of the day will appear here.
            </p>
            <button
              onClick={() => onNavigate('pos')}
              className="mt-3 inline-flex items-center space-x-1.5 bg-cafe-subtle hover:bg-cafe-caramel hover:text-white text-cafe-caramel font-bold px-3.5 py-2 rounded-sm text-xs transition border border-cafe-caramel/30"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Start a Sale</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {activeOrders.slice(0, 3).map((order) => (
              <OrderCard key={order.id} order={order} onUpdateStatus={updateOrderStatus} />
            ))}
          </div>
        )}
      </div>

      {/* RECENT SALES FEED */}
      {recentOrders.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-cafe-border/60 pb-2">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-cafe-text">RECENT SALES</h3>
            <button
              onClick={() => onNavigate('orders')}
              className="text-xs font-bold text-cafe-caramel hover:underline"
            >
              See all
            </button>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <OrderCard key={order.id} order={order} onUpdateStatus={updateOrderStatus} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
