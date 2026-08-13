import React from 'react';
import { Order, OrderStatus } from '../types/pos';
import { Edit2, Trash2, Clock, User, QrCode, Banknote, CreditCard, CheckCircle2 } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onEditOrder?: (order: Order) => void;
  onDeleteOrder?: (orderId: string, orderNum: string | number) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onUpdateStatus,
  onEditOrder,
  onDeleteOrder,
}) => {
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'NEW':
        return <span className="inline-flex items-center space-x-1 text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-xs text-[10px] font-bold"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /><span>NEW</span></span>;
      case 'PREPARING':
        return <span className="inline-flex items-center space-x-1 text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-xs text-[10px] font-bold"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /><span>PREPARING</span></span>;
      case 'READY':
        return <span className="inline-flex items-center space-x-1 text-purple-800 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-xs text-[10px] font-bold"><span className="w-1.5 h-1.5 rounded-full bg-purple-500" /><span>READY</span></span>;
      case 'COMPLETED':
        return <span className="inline-flex items-center space-x-1 text-cafe-sage bg-cafe-sage/10 border border-cafe-sage/30 px-2 py-0.5 rounded-xs text-[10px] font-bold"><span className="w-1.5 h-1.5 rounded-full bg-cafe-sage" /><span>COMPLETED</span></span>;
      case 'CANCELLED':
        return <span className="inline-flex items-center space-x-1 text-cafe-danger bg-cafe-danger/10 border border-cafe-danger/30 px-2 py-0.5 rounded-xs text-[10px] font-bold"><span className="w-1.5 h-1.5 rounded-full bg-cafe-danger" /><span>CANCELLED</span></span>;
      default:
        return null;
    }
  };

  const formattedTime = new Date(order.createdAt || Date.now()).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const itemsSummary = (order.items || [])
    .map((i) => `${i.quantity}× ${i.productName}`)
    .join(', ');

  const orderNumStr = order.orderNumber ? order.orderNumber : order.id;

  return (
    <div className="bg-cafe-surface border border-cafe-border rounded-sm p-4 space-y-2.5 shadow-2xs hover:border-cafe-caramel/40 transition">
      {/* Header Line */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2.5">
          <span className="font-mono font-black text-sm text-cafe-caramel">
            #{orderNumStr}
          </span>
          <span className="font-bold text-cafe-text">
            {order.customerName || 'Walk-in Guest'}
          </span>
          <span className="text-cafe-muted text-[11px]">• {order.orderType}</span>
        </div>

        <div className="flex items-center space-x-2">
          {getStatusBadge(order.orderStatus)}
          <span className="font-black text-sm text-cafe-text">₹{order.totalAmount}</span>

          {/* Edit & Delete Action Buttons */}
          <div className="flex items-center space-x-1 ml-2" onClick={(e) => e.stopPropagation()}>
            {onEditOrder && (
              <button
                onClick={() => onEditOrder(order)}
                title="Edit Order (Customer requested changes)"
                className="p-1 rounded-xs bg-cafe-subtle hover:bg-cafe-border text-cafe-text transition"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}

            {onDeleteOrder && (
              <button
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete Order #${orderNumStr}?`)) {
                    onDeleteOrder(order.id, orderNumStr);
                  }
                }}
                title="Delete Order (Added by mistake)"
                className="p-1 rounded-xs bg-cafe-danger/10 hover:bg-cafe-danger/20 text-cafe-danger border border-cafe-danger/30 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Items Summary Line */}
      <p className="text-xs text-cafe-muted font-medium line-clamp-2">
        {itemsSummary || 'No items snapshot'}
      </p>

      {/* Meta Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-cafe-border/60 text-[11px]">
        <div className="flex items-center space-x-2 text-cafe-muted">
          <span>{order.paymentMethod} · <strong className="text-cafe-text font-bold">{order.paymentStatus}</strong></span>
          <span>•</span>
          <span>{formattedTime}</span>
          <span>•</span>
          <span>By {order.createdByName}</span>
        </div>

        {/* Status Stepper */}
        <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
          {(['NEW', 'PREPARING', 'READY', 'COMPLETED'] as OrderStatus[]).map((st) => (
            <button
              key={st}
              onClick={() => onUpdateStatus(order.id, st)}
              className={`px-2 py-0.5 rounded-xs text-[9px] font-extrabold uppercase transition ${
                order.orderStatus === st
                  ? 'bg-cafe-caramel text-white shadow-2xs'
                  : 'bg-cafe-subtle text-cafe-muted hover:text-cafe-text hover:bg-cafe-border/50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
