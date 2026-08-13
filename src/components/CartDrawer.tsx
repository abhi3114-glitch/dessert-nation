import React, { useState } from 'react';
import { useOrders } from '../context/OrderContext';
import { PaymentMethod, PaymentStatus, OrderType } from '../types/pos';
import { X, Trash2, Plus, Minus, ShoppingBag, Banknote, QrCode, CreditCard, ArrowRight, Check } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (orderId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onOrderSuccess }) => {
  const { cart, updateCartQuantity, removeFromCart, clearCart, createOrder } = useOrders();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderType, setOrderType] = useState<OrderType>('Dine-in');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Paid');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const totalAmount = cart.reduce((sum, item) => sum + item.itemTotal, 0);
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSubmitOrder = async () => {
    if (cart.length === 0 || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const newOrder = await createOrder({
        customerName: customerName.trim() || 'Walk-in Guest',
        customerPhone: customerPhone.trim(),
        orderType,
        paymentMethod,
        paymentStatus,
      });

      // Reset form
      setCustomerName('');
      setCustomerPhone('');
      setOrderType('Dine-in');
      setPaymentMethod('UPI');
      setPaymentStatus('Paid');

      onClose();
      onOrderSuccess(newOrder.orderNumber ? `#${newOrder.orderNumber}` : newOrder.id);
    } catch (e) {
      console.error('Failed to create order:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-choco-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-choco-900 h-full flex flex-col shadow-2xl border-l border-choco-800">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-choco-950 border-b border-choco-800">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-caramel-400" />
            <h2 className="font-bold text-cream-50 text-base">Current Cart</h2>
            <span className="bg-choco-800 text-caramel-300 text-xs px-2 py-0.5 rounded-full font-mono">
              {totalItemsCount} items
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-choco-500 hover:text-cream-50 hover:bg-choco-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-choco-500">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm font-semibold">Your order cart is empty</p>
              <p className="text-xs mt-1">Tap items on the POS screen to add them</p>
            </div>
          ) : (
            <>
              {/* Cart Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-choco-500 font-bold uppercase tracking-wider">
                  <span>Selected Items</span>
                  <button
                    onClick={clearCart}
                    className="text-red-400 hover:text-red-300 flex items-center space-x-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Cart</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {cart.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center justify-between bg-choco-950/70 border border-choco-800 p-2.5 rounded-xl"
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="font-bold text-xs text-cream-50 truncate">{item.productName}</p>
                        <p className="text-[11px] text-caramel-400 font-semibold">
                          ₹{item.unitPrice} × {item.quantity} = ₹{item.itemTotal}
                        </p>
                      </div>

                      {/* Quantity Controller */}
                      <div className="flex items-center space-x-2 bg-choco-800 rounded-lg p-1">
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                          className="w-6 h-6 bg-choco-700 text-cream-50 rounded flex items-center justify-center hover:bg-choco-600 active:scale-90"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-cream-50 w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                          className="w-6 h-6 bg-choco-700 text-cream-50 rounded flex items-center justify-center hover:bg-choco-600 active:scale-90"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="border-choco-800" />

              {/* Order Type */}
              <div>
                <label className="block text-xs font-bold text-cream-100 uppercase tracking-wider mb-2">
                  Order Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Dine-in', 'Takeaway', 'Delivery'] as OrderType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setOrderType(type)}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        orderType === type
                          ? 'bg-caramel-500 text-choco-950 border-caramel-400 shadow-md'
                          : 'bg-choco-950 text-cream-200 border-choco-800 hover:border-choco-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Information (Optional) */}
              <div className="bg-choco-950/50 p-3 rounded-xl border border-choco-800 space-y-2">
                <p className="text-[11px] font-bold text-caramel-400 uppercase">
                  Customer Info <span className="text-choco-500 font-normal">(Optional)</span>
                </p>
                <input
                  type="text"
                  placeholder="Customer Name (Default: Walk-in Guest)"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-choco-900 border border-choco-700 rounded-lg px-3 py-2 text-xs text-cream-50 placeholder-choco-500 focus:outline-none focus:border-caramel-400"
                />
                <input
                  type="tel"
                  placeholder="Phone Number (Optional)"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-choco-900 border border-choco-700 rounded-lg px-3 py-2 text-xs text-cream-50 placeholder-choco-500 focus:outline-none focus:border-caramel-400"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-bold text-cream-100 uppercase tracking-wider mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'UPI', label: 'UPI / QR', icon: QrCode },
                    { id: 'Cash', label: 'Cash', icon: Banknote },
                    { id: 'Card', label: 'Card', icon: CreditCard },
                    { id: 'Other', label: 'Other', icon: Check },
                  ].map((pm) => {
                    const Icon = pm.icon;
                    const isSelected = paymentMethod === pm.id;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                        className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-bold transition ${
                          isSelected
                            ? 'bg-gradient-to-r from-caramel-500 to-amber-500 text-choco-950 border-caramel-400 shadow-md'
                            : 'bg-choco-950 text-cream-100 border-choco-800 hover:border-choco-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{pm.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Payment Status */}
              <div className="flex items-center justify-between bg-choco-950/70 p-3 rounded-xl border border-choco-800">
                <span className="text-xs font-bold text-cream-100">Payment Status</span>
                <div className="flex items-center space-x-1 bg-choco-900 p-1 rounded-lg border border-choco-800">
                  <button
                    type="button"
                    onClick={() => setPaymentStatus('Paid')}
                    className={`px-3 py-1 rounded text-xs font-bold transition ${
                      paymentStatus === 'Paid'
                        ? 'bg-emerald-500 text-white shadow'
                        : 'text-choco-500 hover:text-cream-100'
                    }`}
                  >
                    Paid
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentStatus('Pending')}
                    className={`px-3 py-1 rounded text-xs font-bold transition ${
                      paymentStatus === 'Pending'
                        ? 'bg-amber-500 text-choco-950 shadow'
                        : 'text-choco-500 hover:text-cream-100'
                    }`}
                  >
                    Pending
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer Checkout Button */}
        {cart.length > 0 && (
          <div className="p-4 bg-choco-950 border-t border-choco-800 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-choco-500 font-medium">Total Amount</span>
              <span className="font-black text-xl text-caramel-400">₹{totalAmount}</span>
            </div>

            <button
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-caramel-500 to-amber-500 hover:from-caramel-400 hover:to-amber-400 text-choco-950 font-black py-3.5 px-4 rounded-xl text-base flex items-center justify-center space-x-2 shadow-lg shadow-caramel-500/20 active:scale-98 transition disabled:opacity-50"
            >
              <span>{isSubmitting ? 'SAVING ORDER...' : `SAVE ORDER (₹${totalAmount})`}</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
