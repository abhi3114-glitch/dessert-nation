import React, { useState, useRef } from 'react';
import { useOrders } from '../context/OrderContext';
import { CategoryFilter } from '../components/CategoryFilter';
import { PaymentMethod, PaymentStatus, OrderType, Order } from '../types/pos';
import { Search, Plus, Minus, CheckCircle2, QrCode, Banknote, CreditCard, ArrowRight, Utensils, AlertCircle } from 'lucide-react';

export const PosView: React.FC = () => {
  const {
    products,
    categories,
    cart,
    activeCategoryId,
    searchQuery,
    setActiveCategoryId,
    setSearchQuery,
    addToCart,
    updateCartQuantity,
    clearCart,
    createOrder,
  } = useOrders();

  // POS State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderType, setOrderType] = useState<OrderType>('Dine-in');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Paid');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  const nameInputRef = useRef<HTMLInputElement>(null);

  // Success Confirmation Screen
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);

  const filteredProducts = products.filter((p) => {
    const matchesCat = activeCategoryId === 'all' || p.categoryId === activeCategoryId;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch && p.available;
  });

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalAmount = cart.reduce((sum, item) => sum + item.itemTotal, 0);

  const handleSaveSale = async () => {
    if (cart.length === 0 || isSubmitting) return;

    // Enforce compulsory Customer Name
    if (!customerName.trim()) {
      setNameError('Customer Name is compulsory!');
      nameInputRef.current?.focus();
      return;
    }

    setNameError(null);

    try {
      setIsSubmitting(true);
      const newOrder = await createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        orderType,
        paymentMethod,
        paymentStatus,
      });

      // Reset fields & set completed order for Success screen
      setCustomerName('');
      setCustomerPhone('');
      setOrderType('Dine-in');
      setPaymentMethod('UPI');
      setPaymentStatus('Paid');
      setIsMobileCartOpen(false);
      setLastCompletedOrder(newOrder);
    } catch (e: any) {
      console.error('Failed to save sale:', e);
      setNameError(e.message || 'Failed to save sale');
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS SCREEN
  if (lastCompletedOrder) {
    return (
      <div className="p-6 md:p-12 max-w-md mx-auto min-h-[75vh] flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-14 h-14 rounded-full bg-cafe-sage/15 border-2 border-cafe-sage text-cafe-sage flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase text-cafe-sage tracking-widest block">✓ Sale Recorded</span>
          <h2 className="text-3xl md:text-4xl font-black text-cafe-text">₹{lastCompletedOrder.totalAmount}</h2>
          <p className="text-xs font-extrabold text-cafe-muted">
            Order #{lastCompletedOrder.orderNumber ? lastCompletedOrder.orderNumber : lastCompletedOrder.id}
          </p>
        </div>

        <div className="bg-cafe-surface border border-cafe-border p-4 rounded-sm w-full text-xs space-y-2 text-left">
          <div className="flex items-center justify-between text-cafe-muted">
            <span>Customer</span>
            <span className="font-bold text-cafe-text">{lastCompletedOrder.customerName}</span>
          </div>
          <div className="flex items-center justify-between text-cafe-muted">
            <span>Payment</span>
            <span className="font-bold text-cafe-sage">{lastCompletedOrder.paymentMethod} • {lastCompletedOrder.paymentStatus}</span>
          </div>
          <div className="flex items-center justify-between text-cafe-muted">
            <span>Order Type</span>
            <span className="font-bold text-cafe-text">{lastCompletedOrder.orderType}</span>
          </div>
          <div className="flex items-center justify-between text-cafe-muted">
            <span>Created By</span>
            <span className="font-bold text-cafe-caramel">{lastCompletedOrder.createdByName}</span>
          </div>
        </div>

        <div className="w-full pt-2">
          <button
            onClick={() => setLastCompletedOrder(null)}
            className="w-full bg-cafe-caramel hover:bg-cafe-caramel-hover text-white font-extrabold py-3 px-4 rounded-sm text-xs flex items-center justify-center space-x-2 shadow-xs transition"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Sale</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-60px)] md:h-screen bg-cafe-bg">
      {/* LEFT / CENTER COLUMN: POS PRODUCTS & CATEGORIES */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Bar */}
        <div className="bg-cafe-surface px-4 py-3 border-b border-cafe-border flex items-center justify-between space-x-3">
          <h2 className="font-black text-base text-cafe-text">New Sale</h2>

          {/* Customer Name Required Input */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                ref={nameInputRef}
                type="text"
                required
                placeholder="Customer Name * (Required)"
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  if (e.target.value.trim()) setNameError(null);
                }}
                className={`bg-cafe-subtle border rounded-sm px-2.5 py-1.5 text-xs text-cafe-text placeholder-cafe-muted focus:border-cafe-caramel w-44 sm:w-56 font-bold ${
                  nameError ? 'border-cafe-danger ring-1 ring-cafe-danger/50 bg-red-50/50' : 'border-cafe-border'
                }`}
              />
              <span className="text-cafe-danger font-bold text-xs absolute right-2 top-1.5 pointer-events-none">*</span>
            </div>

            <input
              type="tel"
              placeholder="Phone (Optional)"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="hidden sm:block bg-cafe-subtle border border-cafe-border rounded-sm px-2.5 py-1.5 text-xs text-cafe-text placeholder-cafe-muted focus:border-cafe-caramel w-32"
            />
          </div>
        </div>

        {/* Order Type & Search Bar */}
        <div className="bg-cafe-surface/80 px-4 py-2 border-b border-cafe-border flex items-center justify-between">
          <div className="flex items-center space-x-1 bg-cafe-subtle p-0.5 rounded-sm border border-cafe-border text-xs">
            {(['Dine-in', 'Takeaway', 'Delivery'] as OrderType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setOrderType(type)}
                className={`px-3 py-1 font-bold transition text-xs ${
                  orderType === type
                    ? 'bg-cafe-caramel text-white shadow-2xs'
                    : 'text-cafe-muted hover:text-cafe-text'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="relative w-44 sm:w-60">
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-cafe-surface border border-cafe-border rounded-sm pl-8 pr-3 py-1.5 text-xs text-cafe-text placeholder-cafe-muted focus:border-cafe-caramel"
            />
            <Search className="w-3.5 h-3.5 text-cafe-muted absolute left-2.5 top-2" />
          </div>
        </div>

        {/* Text Tabs Category Filter */}
        <CategoryFilter
          categories={categories}
          activeCategoryId={activeCategoryId}
          onSelectCategory={setActiveCategoryId}
        />

        {/* High-Density Food Product Cards */}
        <div className="flex-1 overflow-y-auto p-3 md:p-5 pb-24 md:pb-6">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 text-cafe-muted text-xs font-semibold">
              No products found in this category
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredProducts.map((product) => {
                const cartItem = cart.find((i) => i.productId === product.id);
                const qty = cartItem ? cartItem.quantity : 0;

                return (
                  <div
                    key={product.id}
                    className={`bg-cafe-surface border p-3 rounded-sm flex items-center justify-between transition ${
                      qty > 0 ? 'border-cafe-caramel bg-cafe-subtle/40' : 'border-cafe-border hover:border-cafe-caramel/40'
                    }`}
                  >
                    {/* Image Thumbnail + Name + Price */}
                    <div className="flex items-center space-x-3 min-w-0 flex-1 pr-2">
                      <img
                        src={product.imageUrl || 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=200'}
                        alt={product.name}
                        className="w-10 h-10 rounded-xs object-cover bg-cafe-subtle border border-cafe-border shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=200';
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs text-cafe-text truncate">{product.name}</h4>
                        <p className="text-cafe-caramel font-black text-xs mt-0.5">₹{product.price}</p>
                      </div>
                    </div>

                    {/* Immediate Inline Counter */}
                    {qty === 0 ? (
                      <button
                        onClick={() => addToCart(product)}
                        className="w-7 h-7 rounded-xs bg-cafe-subtle hover:bg-cafe-caramel hover:text-white text-cafe-text font-bold flex items-center justify-center border border-cafe-border active:scale-95 transition"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    ) : (
                      <div className="flex items-center space-x-1.5 bg-cafe-caramel text-white font-black rounded-xs p-1">
                        <button
                          onClick={() => updateCartQuantity(product.id, qty - 1)}
                          className="w-5 h-5 rounded-xs bg-white/20 hover:bg-white/30 flex items-center justify-center active:scale-90"
                        >
                          <Minus className="w-3 h-3 stroke-[3]" />
                        </button>
                        <span className="text-xs font-black w-4 text-center">{qty}</span>
                        <button
                          onClick={() => updateCartQuantity(product.id, qty + 1)}
                          className="w-5 h-5 rounded-xs bg-white/20 hover:bg-white/30 flex items-center justify-center active:scale-90"
                        >
                          <Plus className="w-3 h-3 stroke-[3]" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* DESKTOP STICKY RIGHT COLUMN / MOBILE DRAWER: CURRENT ORDER & PAYMENT */}
      <div
        className={`w-full md:w-80 lg:w-96 bg-cafe-surface border-l border-cafe-border flex flex-col justify-between shadow-xs z-40 transition-all ${
          isMobileCartOpen
            ? 'fixed inset-0 z-50 bg-cafe-surface'
            : 'hidden md:flex'
        }`}
      >
        {/* Receipt Header */}
        <div className="p-3.5 bg-cafe-surface border-b border-cafe-border flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-cafe-text">CURRENT ORDER</h3>
            <span className="bg-cafe-subtle text-cafe-caramel font-black text-[10px] px-2 py-0.5 rounded-xs border border-cafe-border">
              {cartItemsCount} items
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {cart.length > 0 && (
              <button onClick={clearCart} className="text-cafe-danger text-xs hover:underline">
                Clear
              </button>
            )}
            <button
              onClick={() => setIsMobileCartOpen(false)}
              className="md:hidden text-cafe-muted hover:text-cafe-text p-1"
            >
              Close
            </button>
          </div>
        </div>

        {/* Selected Order Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {cart.length === 0 ? (
            <div className="text-center py-16 text-cafe-muted text-xs space-y-1">
              <Utensils className="w-6 h-6 mx-auto opacity-30 text-cafe-caramel mb-1" />
              <p className="font-bold text-cafe-text">Order is empty</p>
              <p>Select products on the left to add to order.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between bg-cafe-subtle/50 p-2.5 rounded-xs border border-cafe-border text-xs"
              >
                <div className="min-w-0 flex-1 pr-2">
                  <p className="font-bold text-cafe-text truncate">{item.productName}</p>
                  <p className="text-[11px] text-cafe-caramel font-semibold">
                    ₹{item.unitPrice} × {item.quantity}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 bg-white border border-cafe-border rounded-xs p-0.5">
                    <button
                      onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                      className="w-4 h-4 text-cafe-text rounded flex items-center justify-center hover:bg-cafe-subtle"
                    >
                      <Minus className="w-2.5 h-2.5" />
                    </button>
                    <span className="text-xs font-bold text-cafe-text w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                      className="w-4 h-4 text-cafe-text rounded flex items-center justify-center hover:bg-cafe-subtle"
                    >
                      <Plus className="w-2.5 h-2.5" />
                    </button>
                  </div>
                  <span className="font-black text-cafe-text w-12 text-right">₹{item.itemTotal}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Payment Selector & Save Button */}
        {cart.length > 0 && (
          <div className="p-4 bg-cafe-surface border-t border-cafe-border space-y-3">
            {/* Compulsory Customer Name Input inside Receipt Panel */}
            <div className="bg-cafe-subtle/50 p-2.5 rounded-xs border border-cafe-border space-y-1">
              <label className="text-[10px] font-extrabold uppercase text-cafe-text flex items-center justify-between">
                <span>CUSTOMER NAME <strong className="text-cafe-danger">*</strong></span>
                {nameError && <span className="text-cafe-danger font-bold text-[9px]">{nameError}</span>}
              </label>
              <input
                type="text"
                required
                placeholder="Enter Customer Name (Compulsory)"
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  if (e.target.value.trim()) setNameError(null);
                }}
                className={`w-full bg-white border rounded-xs px-2.5 py-1.5 text-xs text-cafe-text font-bold placeholder-cafe-muted focus:border-cafe-caramel ${
                  nameError ? 'border-cafe-danger ring-1 ring-cafe-danger/50' : 'border-cafe-border'
                }`}
              />
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase text-cafe-muted block mb-1.5">
                HOW DID THEY PAY?
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'Cash', label: 'Cash', icon: Banknote },
                  { id: 'UPI', label: 'UPI', icon: QrCode },
                  { id: 'Card', label: 'Card', icon: CreditCard },
                ].map((pm) => {
                  const Icon = pm.icon;
                  const isSelected = paymentMethod === pm.id;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xs border text-xs font-bold transition ${
                        isSelected
                          ? 'bg-cafe-caramel text-white border-cafe-caramel shadow-2xs'
                          : 'bg-cafe-subtle text-cafe-text border-cafe-border hover:border-cafe-caramel/50'
                      }`}
                    >
                      <Icon className="w-4 h-4 mb-0.5" />
                      <span>{pm.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Message Box */}
            {nameError && (
              <div className="p-2 bg-cafe-danger/10 border border-cafe-danger/30 text-cafe-danger font-bold text-xs rounded-xs flex items-center space-x-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{nameError}</span>
              </div>
            )}

            {/* Total Amount & Save Button */}
            <div className="pt-1 space-y-2 border-t border-cafe-border/60">
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-cafe-muted font-bold uppercase">TOTAL</span>
                <span className="text-xl font-black text-cafe-text">₹{cartTotalAmount}</span>
              </div>

              <button
                onClick={handleSaveSale}
                disabled={isSubmitting}
                className="w-full bg-cafe-caramel hover:bg-cafe-caramel-hover text-white font-extrabold py-3 px-4 rounded-sm text-xs flex items-center justify-center space-x-2 shadow-xs transition disabled:opacity-50"
              >
                <span>{isSubmitting ? 'SAVING...' : `SAVE SALE (₹${cartTotalAmount})`}</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE FLOATING CART SUMMARY BUTTON */}
      {cartItemsCount > 0 && !isMobileCartOpen && (
        <div className="md:hidden fixed bottom-16 left-3 right-3 z-30">
          <button
            onClick={() => setIsMobileCartOpen(true)}
            className="w-full bg-cafe-caramel text-white font-black p-3 rounded-md flex items-center justify-between shadow-md active:scale-98 transition"
          >
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-xs bg-white text-cafe-caramel flex items-center justify-center font-black text-xs">
                {cartItemsCount}
              </span>
              <span className="text-sm font-extrabold">₹{cartTotalAmount}</span>
            </div>
            <div className="flex items-center space-x-1 text-xs">
              <span className="font-extrabold">VIEW ORDER</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
