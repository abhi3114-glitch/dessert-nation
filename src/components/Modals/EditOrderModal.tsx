import React, { useState, useEffect } from 'react';
import { Order, OrderItem, PaymentMethod, PaymentStatus, OrderType, Product } from '../../types/pos';
import { useOrders } from '../../context/OrderContext';
import { X, Plus, Minus, Trash2, Check, AlertCircle } from 'lucide-react';

interface EditOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderToEdit: Order | null;
}

export const EditOrderModal: React.FC<EditOrderModalProps> = ({
  isOpen,
  onClose,
  orderToEdit,
}) => {
  const { products, updateOrder } = useOrders();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderType, setOrderType] = useState<OrderType>('Dine-in');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Paid');
  const [items, setItems] = useState<OrderItem[]>([]);
  const [selectedProdId, setSelectedProdId] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (orderToEdit) {
      setCustomerName(orderToEdit.customerName || '');
      setCustomerPhone(orderToEdit.customerPhone || '');
      setOrderType(orderToEdit.orderType || 'Dine-in');
      setPaymentMethod(orderToEdit.paymentMethod || 'UPI');
      setPaymentStatus(orderToEdit.paymentStatus || 'Paid');
      setItems(orderToEdit.items || []);
      setErrorMsg(null);
    }
  }, [orderToEdit]);

  if (!isOpen || !orderToEdit) return null;

  const totalAmount = items.reduce((sum, i) => sum + i.itemTotal, 0);

  const handleUpdateItemQty = (prodId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => {
          if (i.productId === prodId) {
            const newQty = i.quantity + delta;
            if (newQty <= 0) return null;
            return { ...i, quantity: newQty, itemTotal: newQty * i.unitPrice };
          }
          return i;
        })
        .filter(Boolean) as OrderItem[]
    );
  };

  const handleAddItem = () => {
    if (!selectedProdId) return;
    const prod = products.find((p) => p.id === selectedProdId);
    if (!prod) return;

    setItems((prev) => {
      const existing = prev.find((i) => i.productId === prod.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === prod.id
            ? { ...i, quantity: i.quantity + 1, itemTotal: (i.quantity + 1) * i.unitPrice }
            : i
        );
      }
      return [
        ...prev,
        {
          id: `item_${Date.now()}_${Math.random()}`,
          orderId: orderToEdit.id,
          productId: prod.id,
          productName: prod.name,
          unitPrice: prod.price,
          quantity: 1,
          itemTotal: prod.price,
        },
      ];
    });
    setSelectedProdId('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setErrorMsg('Customer Name is compulsory!');
      return;
    }
    if (items.length === 0) {
      setErrorMsg('Order must contain at least 1 item!');
      return;
    }

    await updateOrder(orderToEdit.id, {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      orderType,
      paymentMethod,
      paymentStatus,
      items,
      subtotal: totalAmount,
      totalAmount,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cafe-text/30 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-cafe-surface border border-cafe-border rounded-md shadow-xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-cafe-border">
          <h3 className="font-black text-base text-cafe-caramel">
            Edit Order #{orderToEdit.orderNumber || orderToEdit.id}
          </h3>
          <button onClick={onClose} className="p-1 rounded text-cafe-muted hover:text-cafe-text">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-2 bg-cafe-danger/10 border border-cafe-danger/30 text-cafe-danger font-bold text-xs rounded-xs flex items-center space-x-1.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* Customer Details */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-cafe-text font-bold mb-1">
                Customer Name <strong className="text-cafe-danger">*</strong>
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  if (e.target.value.trim()) setErrorMsg(null);
                }}
                className="w-full bg-cafe-subtle border border-cafe-border rounded-xs px-2.5 py-1.5 text-cafe-text font-bold focus:border-cafe-caramel"
              />
            </div>

            <div>
              <label className="block text-cafe-text font-bold mb-1">Phone</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-cafe-subtle border border-cafe-border rounded-xs px-2.5 py-1.5 text-cafe-text focus:border-cafe-caramel"
              />
            </div>
          </div>

          {/* Order Type & Payment Method */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-cafe-text font-bold mb-1">Type</label>
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value as OrderType)}
                className="w-full bg-cafe-subtle border border-cafe-border rounded-xs px-2 py-1.5 text-cafe-text font-bold"
              >
                <option value="Dine-in">Dine-in</option>
                <option value="Takeaway">Takeaway</option>
                <option value="Delivery">Delivery</option>
              </select>
            </div>

            <div>
              <label className="block text-cafe-text font-bold mb-1">Payment</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full bg-cafe-subtle border border-cafe-border rounded-xs px-2 py-1.5 text-cafe-text font-bold"
              >
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-cafe-text font-bold mb-1">Status</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                className="w-full bg-cafe-subtle border border-cafe-border rounded-xs px-2 py-1.5 text-cafe-text font-bold"
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Add Item to Order */}
          <div>
            <label className="block text-cafe-text font-bold mb-1">Add Product to Order</label>
            <div className="flex space-x-2">
              <select
                value={selectedProdId}
                onChange={(e) => setSelectedProdId(e.target.value)}
                className="flex-1 bg-cafe-subtle border border-cafe-border rounded-xs px-2.5 py-1.5 text-cafe-text"
              >
                <option value="">Select menu item...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (₹{p.price})
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddItem}
                className="bg-cafe-caramel text-white px-3 py-1.5 rounded-xs font-bold shrink-0"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase text-cafe-muted block">ITEMS SNAPSHOT</span>
            <div className="bg-cafe-subtle/50 p-2.5 rounded-xs border border-cafe-border space-y-2">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center justify-between text-xs">
                  <span className="font-bold text-cafe-text flex-1 truncate pr-2">{item.productName}</span>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 bg-white border border-cafe-border rounded-xs p-0.5">
                      <button
                        type="button"
                        onClick={() => handleUpdateItemQty(item.productId, -1)}
                        className="w-4 h-4 text-cafe-text rounded flex items-center justify-center hover:bg-cafe-subtle"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="font-bold w-4 text-center">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateItemQty(item.productId, 1)}
                        className="w-4 h-4 text-cafe-text rounded flex items-center justify-center hover:bg-cafe-subtle"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>
                    <span className="font-black text-cafe-text w-12 text-right">₹{item.itemTotal}</span>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-cafe-border flex items-center justify-between font-black text-sm">
                <span>TOTAL</span>
                <span className="text-cafe-caramel">₹{totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-cafe-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-cafe-subtle text-cafe-text rounded-xs font-bold border border-cafe-border"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cafe-caramel hover:bg-cafe-caramel-hover text-white rounded-xs font-bold shadow-2xs"
            >
              Save Order Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
