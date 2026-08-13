import React, { useState } from 'react';
import { useOrders } from '../context/OrderContext';
import { OrderCard } from '../components/OrderCard';
import { EditOrderModal } from '../components/Modals/EditOrderModal';
import { Order, OrderStatus } from '../types/pos';
import { Search, RefreshCw, ShoppingBag, X, Edit2, Trash2 } from 'lucide-react';
import { syncEngine } from '../db/syncEngine';

export const OrdersView: React.FC = () => {
  const { orders = [], updateOrderStatus, updatePaymentStatus, deleteOrder, refreshData } = useOrders();

  const [filterTab, setFilterTab] = useState<'active' | 'completed' | 'all' | 'pending'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const safeOrders = (orders || []).filter((o) => o && typeof o === 'object');

  const filteredOrders = safeOrders.filter((o) => {
    // Tab filter
    if (filterTab === 'active' && o.orderStatus === 'COMPLETED') return false;
    if (filterTab === 'completed' && o.orderStatus !== 'COMPLETED') return false;
    if (filterTab === 'pending' && o.syncStatus !== 'pending_sync') return false;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = String(o.orderNumber || o.id || '').toLowerCase().includes(q);
      const matchCust = (o.customerName || '').toLowerCase().includes(q);
      const matchItems = Array.isArray(o.items) && o.items.some((i) => (i?.productName || '').toLowerCase().includes(q));
      return matchNum || matchCust || matchItems;
    }

    return true;
  });

  const handleManualSync = async () => {
    setIsRefreshing(true);
    await syncEngine.triggerSync();
    await refreshData();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleOpenEdit = (order: Order) => {
    setOrderToEdit(order);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (orderId: string, orderNum: string | number) => {
    await deleteOrder(orderId);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(null);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-5 pb-24 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cafe-border pb-4">
        <div>
          <h2 className="text-2xl font-black text-cafe-text">Orders Management</h2>
          <p className="text-xs text-cafe-muted font-medium">Track, edit customer orders or remove mistakes</p>
        </div>

        <button
          onClick={handleManualSync}
          className="flex items-center space-x-1.5 bg-cafe-surface hover:bg-cafe-subtle text-cafe-text px-3 py-1.5 rounded-sm border border-cafe-border text-xs font-bold transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cafe-caramel' : ''}`} />
          <span>Sync</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search by order #, customer, or item name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-cafe-surface border border-cafe-border rounded-sm pl-9 pr-4 py-2 text-xs text-cafe-text placeholder-cafe-muted focus:border-cafe-caramel"
        />
        <Search className="w-4 h-4 text-cafe-muted absolute left-3 top-2.5" />
      </div>

      {/* Text Tabs Navigation */}
      <div className="flex items-center space-x-4 border-b border-cafe-border pb-1">
        {[
          { id: 'active', label: 'ACTIVE' },
          { id: 'completed', label: 'COMPLETED' },
          { id: 'all', label: 'ALL TODAY' },
          { id: 'pending', label: 'PENDING SYNC' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterTab(tab.id as any)}
            className={`pb-2 text-xs font-extrabold tracking-wider uppercase transition border-b-2 ${
              filterTab === tab.id
                ? 'text-cafe-caramel border-cafe-caramel'
                : 'text-cafe-muted border-transparent hover:text-cafe-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Operational Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-cafe-surface rounded-sm border border-cafe-border text-cafe-muted text-xs space-y-1">
          <ShoppingBag className="w-8 h-8 mx-auto opacity-30 text-cafe-caramel mb-1" />
          <p className="font-extrabold text-cafe-text">No orders found</p>
          <p>Orders will appear here as employees process sales.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <div key={order.id} onClick={() => setSelectedOrder(order)} className="cursor-pointer">
              <OrderCard
                order={order}
                onUpdateStatus={updateOrderStatus}
                onEditOrder={handleOpenEdit}
                onDeleteOrder={handleDelete}
              />
            </div>
          ))}
        </div>
      )}

      {/* ORDER DETAIL SHEET / MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-cafe-text/30 backdrop-blur-xs">
          <div className="w-full max-w-md bg-cafe-surface border border-cafe-border rounded-t-lg sm:rounded-md shadow-lg p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-cafe-border">
              <div>
                <h3 className="font-black text-base text-cafe-caramel">
                  Order #{selectedOrder.orderNumber ? selectedOrder.orderNumber : selectedOrder.id}
                </h3>
                <p className="text-[11px] text-cafe-muted">
                  {new Date(selectedOrder.createdAt || Date.now()).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center space-x-1">
                {/* Edit Order CTA inside Detail Sheet */}
                <button
                  onClick={() => {
                    handleOpenEdit(selectedOrder);
                    setSelectedOrder(null);
                  }}
                  className="p-1.5 rounded-xs bg-cafe-subtle text-cafe-text border border-cafe-border font-bold text-xs flex items-center space-x-1 hover:bg-cafe-border"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                {/* Delete Order CTA inside Detail Sheet */}
                <button
                  onClick={() => {
                    const numStr = selectedOrder.orderNumber || selectedOrder.id;
                    if (window.confirm(`Are you sure you want to delete Order #${numStr}?`)) {
                      handleDelete(selectedOrder.id, numStr);
                    }
                  }}
                  className="p-1.5 rounded-xs bg-cafe-danger/10 text-cafe-danger border border-cafe-danger/30 font-bold text-xs flex items-center space-x-1 hover:bg-cafe-danger/20"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 rounded text-cafe-muted hover:text-cafe-text hover:bg-cafe-subtle ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="bg-cafe-subtle/60 p-3 rounded-sm border border-cafe-border text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-cafe-muted font-semibold">Customer</span>
                <span className="font-bold text-cafe-text">{selectedOrder.customerName || 'Walk-in Guest'}</span>
              </div>
              {selectedOrder.customerPhone && (
                <div className="flex items-center justify-between">
                  <span className="text-cafe-muted font-semibold">Phone</span>
                  <span className="font-bold text-cafe-text">{selectedOrder.customerPhone}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-cafe-muted font-semibold">Order Type</span>
                <span className="font-bold text-cafe-text">{selectedOrder.orderType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-cafe-muted font-semibold">Created By</span>
                <span className="font-bold text-cafe-caramel">{selectedOrder.createdByName}</span>
              </div>
            </div>

            {/* Items List */}
            <div>
              <span className="text-[10px] font-extrabold uppercase text-cafe-muted block mb-1.5">ITEMS SNAPSHOT</span>
              <div className="bg-cafe-subtle/40 p-3 rounded-sm border border-cafe-border space-y-1.5 text-xs">
                {(selectedOrder.items || []).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="font-medium text-cafe-text">
                      <span className="text-cafe-caramel font-black mr-1.5">{item.quantity}×</span>
                      {item.productName}
                    </span>
                    <span className="font-mono text-cafe-text">₹{item.itemTotal}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-cafe-border flex items-center justify-between font-black text-sm">
                  <span>TOTAL</span>
                  <span className="text-cafe-caramel">₹{selectedOrder.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="flex items-center justify-between bg-cafe-subtle/60 p-3 rounded-sm border border-cafe-border text-xs">
              <div>
                <span className="text-cafe-muted block text-[10px] uppercase font-bold">Payment Method</span>
                <span className="font-bold text-cafe-text">{selectedOrder.paymentMethod}</span>
              </div>
              <button
                onClick={() => {
                  const newStatus = selectedOrder.paymentStatus === 'Paid' ? 'Pending' : 'Paid';
                  updatePaymentStatus(selectedOrder.id, newStatus);
                  setSelectedOrder({ ...selectedOrder, paymentStatus: newStatus });
                }}
                className={`px-3 py-1 rounded-xs font-bold border ${
                  selectedOrder.paymentStatus === 'Paid'
                    ? 'bg-cafe-sage/15 text-cafe-sage border-cafe-sage/30'
                    : 'bg-amber-500/15 text-amber-800 border-amber-500/30'
                }`}
              >
                {selectedOrder.paymentStatus}
              </button>
            </div>

            {/* Status Stepper */}
            <div>
              <span className="text-[10px] font-extrabold uppercase text-cafe-muted block mb-1.5">UPDATE STATUS</span>
              <div className="grid grid-cols-4 gap-1.5">
                {(['NEW', 'PREPARING', 'READY', 'COMPLETED'] as OrderStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, st);
                      setSelectedOrder({ ...selectedOrder, orderStatus: st });
                    }}
                    className={`py-2 rounded-xs text-[10px] font-extrabold uppercase transition ${
                      selectedOrder.orderStatus === st
                        ? 'bg-cafe-caramel text-white shadow-2xs'
                        : 'bg-cafe-subtle text-cafe-muted border border-cafe-border hover:text-cafe-text'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      <EditOrderModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        orderToEdit={orderToEdit}
      />
    </div>
  );
};
