import React, { useState } from 'react';
import { useOrders } from '../context/OrderContext';
import { TrendingUp, ShoppingBag, Banknote, QrCode, CreditCard, Award, Calendar, Search } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { orders = [] } = useOrders();
  const [period, setPeriod] = useState<'today' | 'specific' | '7days' | '30days'>('today');
  const [selectedDateStr, setSelectedDateStr] = useState<string>(new Date().toISOString().split('T')[0]);

  const safeOrders = (orders || []).filter((o) => o && typeof o === 'object');
  const now = new Date();

  const filteredOrders = safeOrders.filter((o) => {
    const createdStr = String(o?.createdAt || o?.updatedAt || new Date().toISOString());
    const createdDate = new Date(createdStr);

    if (period === 'today') {
      return createdStr.startsWith(now.toISOString().split('T')[0]);
    } else if (period === 'specific') {
      return createdStr.startsWith(selectedDateStr);
    } else if (period === '7days') {
      const diffTime = Math.abs(now.getTime() - createdDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    } else {
      const diffTime = Math.abs(now.getTime() - createdDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30;
    }
  });

  const totalSales = filteredOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalOrders = filteredOrders.length;
  const aovText = totalOrders > 0 ? `₹${Math.round(totalSales / totalOrders)}` : 'No orders yet';

  const upiSales = filteredOrders.filter((o) => o.paymentMethod === 'UPI').reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const cashSales = filteredOrders.filter((o) => o.paymentMethod === 'Cash').reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const cardSales = filteredOrders.filter((o) => o.paymentMethod === 'Card').reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Top Products Ranking
  const productCountMap = new Map<string, { name: string; qty: number; revenue: number }>();
  filteredOrders.forEach((o) => {
    (o.items || []).forEach((item) => {
      const existing = productCountMap.get(item.productId) || { name: item.productName, qty: 0, revenue: 0 };
      existing.qty += item.quantity;
      existing.revenue += item.itemTotal;
      productCountMap.set(item.productId, existing);
    });
  });

  const topProducts = Array.from(productCountMap.values())
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  const getPeriodLabel = () => {
    if (period === 'today') return "TODAY'S SUMMARY";
    if (period === 'specific') {
      const dateObj = new Date(selectedDateStr + 'T00:00:00');
      return `SUMMARY FOR ${dateObj.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}`;
    }
    if (period === '7days') return 'LAST 7 DAYS SUMMARY';
    return 'LAST 30 DAYS SUMMARY';
  };

  return (
    <div className="p-4 md:p-8 space-y-6 pb-24 max-w-4xl mx-auto">
      {/* Header & Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-cafe-border pb-4 gap-3">
        <div>
          <h2 className="text-2xl font-black text-cafe-text">Sales Reports & Analytics</h2>
          <p className="text-xs text-cafe-muted font-medium">Daily, weekly, monthly earnings & date-wise order lookup</p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center space-x-1 bg-cafe-subtle p-0.5 rounded-sm border border-cafe-border text-xs flex-wrap gap-y-1">
          {[
            { id: 'today', label: 'Today' },
            { id: 'specific', label: 'Pick Date' },
            { id: '7days', label: '7 Days' },
            { id: '30days', label: '30 Days' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPeriod(tab.id as any)}
              className={`px-3 py-1 font-bold transition rounded-xs ${
                period === tab.id
                  ? 'bg-cafe-caramel text-white shadow-2xs'
                  : 'text-cafe-muted hover:text-cafe-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Date Picker Input when "Pick Date" is selected */}
      {period === 'specific' && (
        <div className="bg-cafe-surface p-4 rounded-sm border border-cafe-border flex items-center space-x-3">
          <Calendar className="w-4 h-4 text-cafe-caramel" />
          <span className="text-xs font-bold text-cafe-text">Select Particular Day:</span>
          <input
            type="date"
            value={selectedDateStr}
            onChange={(e) => setSelectedDateStr(e.target.value)}
            className="bg-cafe-subtle border border-cafe-border rounded-xs px-3 py-1.5 text-xs text-cafe-text font-bold focus:border-cafe-caramel"
          />
        </div>
      )}

      {/* Main Metrics Typographic Banner */}
      <div className="bg-cafe-surface p-5 rounded-sm border border-cafe-border space-y-3 shadow-2xs">
        <span className="text-[10px] font-black uppercase text-cafe-muted tracking-widest block">
          {getPeriodLabel()}
        </span>

        <div className="text-4xl md:text-5xl font-black text-cafe-text tracking-tight">
          ₹{totalSales.toLocaleString('en-IN')}
        </div>

        <p className="text-xs font-semibold text-cafe-muted">
          <span className="font-extrabold text-cafe-text">{totalOrders} orders</span>
          <span className="mx-2 text-cafe-border">•</span>
          <span>Average order: <strong className="text-cafe-caramel font-bold">{aovText}</strong></span>
        </p>

        {/* Payment Breakdown Progress */}
        <div className="pt-3 border-t border-cafe-border space-y-2">
          <span className="text-[10px] font-bold uppercase text-cafe-muted block">PAYMENT METHOD BREAKDOWN</span>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-cafe-subtle/50 p-2.5 rounded-xs border border-cafe-border">
              <span className="text-[10px] font-bold text-cafe-muted flex items-center space-x-1">
                <QrCode className="w-3 h-3 text-cafe-caramel" />
                <span>UPI</span>
              </span>
              <span className="text-sm font-black text-cafe-text mt-0.5 block">₹{upiSales.toLocaleString('en-IN')}</span>
            </div>

            <div className="bg-cafe-subtle/50 p-2.5 rounded-xs border border-cafe-border">
              <span className="text-[10px] font-bold text-cafe-muted flex items-center space-x-1">
                <Banknote className="w-3 h-3 text-cafe-sage" />
                <span>CASH</span>
              </span>
              <span className="text-sm font-black text-cafe-text mt-0.5 block">₹{cashSales.toLocaleString('en-IN')}</span>
            </div>

            <div className="bg-cafe-subtle/50 p-2.5 rounded-xs border border-cafe-border">
              <span className="text-[10px] font-bold text-cafe-muted flex items-center space-x-1">
                <CreditCard className="w-3 h-3 text-cafe-gold" />
                <span>CARD</span>
              </span>
              <span className="text-sm font-black text-cafe-text mt-0.5 block">₹{cardSales.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Selling Desserts Ranking */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-xs uppercase tracking-wider text-cafe-text flex items-center space-x-2">
          <Award className="w-4 h-4 text-cafe-caramel" />
          <span>TOP SELLING DESSERTS ({filteredOrders.length} ORDERS)</span>
        </h3>

        {topProducts.length === 0 ? (
          <div className="text-center py-10 bg-cafe-surface rounded-sm border border-cafe-border text-cafe-muted text-xs">
            No sales recorded in this period
          </div>
        ) : (
          <div className="bg-cafe-surface border border-cafe-border rounded-sm divide-y divide-cafe-border text-xs">
            {topProducts.map((p, idx) => (
              <div key={idx} className="p-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-5 font-black text-cafe-caramel text-center">#{idx + 1}</span>
                  <div>
                    <h4 className="font-bold text-cafe-text">{p.name}</h4>
                    <p className="text-[11px] text-cafe-muted">{p.qty} items sold</p>
                  </div>
                </div>
                <span className="font-black text-cafe-text">₹{p.revenue}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detailed Orders List for Selected Period / Particular Day */}
      {filteredOrders.length > 0 && (
        <div className="space-y-3 pt-2">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-cafe-text flex items-center space-x-2">
            <ShoppingBag className="w-4 h-4 text-cafe-caramel" />
            <span>ORDERS LIST ({filteredOrders.length} ORDERS)</span>
          </h3>

          <div className="bg-cafe-surface border border-cafe-border rounded-sm divide-y divide-cafe-border text-xs">
            {filteredOrders.map((ord) => (
              <div key={ord.id} className="p-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-black text-cafe-caramel">#{ord.orderNumber || ord.id}</span>
                    <span className="font-bold text-cafe-text">{ord.customerName}</span>
                    <span className="text-cafe-muted text-[11px]">({ord.orderType})</span>
                  </div>
                  <p className="text-[11px] text-cafe-muted mt-0.5">
                    {(ord.items || []).map((i) => `${i.quantity}× ${i.productName}`).join(', ')}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-black text-cafe-text block">₹{ord.totalAmount}</span>
                  <span className="text-[10px] text-cafe-sage font-bold uppercase">{ord.paymentMethod} • {ord.paymentStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
