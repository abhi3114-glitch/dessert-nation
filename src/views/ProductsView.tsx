import React, { useState, useRef } from 'react';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types/pos';
import { AddProductModal } from '../components/Modals/AddProductModal';
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

export const ProductsView: React.FC = () => {
  const { products, categories, toggleProductAvailability, deleteProduct } = useOrders();
  const { currentUser } = useAuth();

  const isOwner = currentUser?.role === 'owner';

  const [selectedCatId, setSelectedCatId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -180 : 180;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCatId === 'all' || p.categoryId === selectedCatId;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleEdit = (product: Product) => {
    setProductToEdit(product);
    setIsAddModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      await deleteProduct(id);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-5 pb-24 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cafe-border pb-4">
        <div>
          <h2 className="text-2xl font-black text-cafe-text">Menu Catalog</h2>
          <p className="text-xs text-cafe-muted font-medium">
            {isOwner ? 'Manage products, prices & availability' : 'View Dessert Nation Menu items'}
          </p>
        </div>
        {isOwner && (
          <button
            onClick={() => {
              setProductToEdit(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center space-x-1.5 bg-cafe-caramel hover:bg-cafe-caramel-hover text-white font-extrabold px-3.5 py-2 rounded-sm text-xs shadow-2xs transition"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Item</span>
          </button>
        )}
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search menu catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-cafe-surface border border-cafe-border rounded-sm pl-9 pr-4 py-2 text-xs text-cafe-text placeholder-cafe-muted focus:border-cafe-caramel"
            />
            <Search className="w-4 h-4 text-cafe-muted absolute left-3 top-2.5" />
          </div>

          <div className="relative shrink-0 w-36 sm:w-48">
            <select
              value={selectedCatId}
              onChange={(e) => setSelectedCatId(e.target.value)}
              className="w-full bg-cafe-surface border border-cafe-border rounded-sm px-3 py-2 text-xs font-bold text-cafe-caramel focus:border-cafe-caramel appearance-none truncate pr-7"
            >
              <option value="all">All Categories ({categories.length})</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-cafe-caramel absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Text Tabs Bar */}
        <div className="flex items-center justify-between border-b border-cafe-border pb-1">
          <button
            onClick={() => scroll('left')}
            className="p-1 rounded-sm text-cafe-muted hover:text-cafe-text hover:bg-cafe-subtle border border-cafe-border shrink-0 mr-1.5"
            title="Scroll Left"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div
            ref={scrollRef}
            className="flex-1 flex items-center space-x-4 overflow-x-auto no-scrollbar scroll-smooth py-1"
          >
            <button
              onClick={() => setSelectedCatId('all')}
              className={`pb-1 text-xs font-extrabold tracking-wider uppercase whitespace-nowrap transition border-b-2 ${
                selectedCatId === 'all'
                  ? 'text-cafe-caramel border-cafe-caramel'
                  : 'text-cafe-muted border-transparent hover:text-cafe-text'
              }`}
            >
              ALL
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCatId(cat.id)}
                className={`pb-1 text-xs font-extrabold tracking-wider uppercase whitespace-nowrap transition border-b-2 ${
                  selectedCatId === cat.id
                    ? 'text-cafe-caramel border-cafe-caramel'
                    : 'text-cafe-muted border-transparent hover:text-cafe-text'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <button
            onClick={() => scroll('right')}
            className="p-1 rounded-sm text-cafe-muted hover:text-cafe-text hover:bg-cafe-subtle border border-cafe-border shrink-0 ml-1.5"
            title="Scroll Right"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Products Table / List */}
      <div className="space-y-2">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-cafe-surface rounded-sm border border-cafe-border text-cafe-muted text-xs">
            No products found in this category
          </div>
        ) : (
          filteredProducts.map((product) => {
            const catName = categories.find((c) => c.id === product.categoryId)?.name || 'General';
            return (
              <div
                key={product.id}
                className={`flex items-center justify-between bg-cafe-surface border p-3 rounded-sm transition ${
                  !product.available ? 'border-cafe-border opacity-60' : 'border-cafe-border hover:border-cafe-caramel/40'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <img
                    src={product.imageUrl || 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=200'}
                    alt={product.name}
                    className="w-10 h-10 rounded-xs object-cover bg-cafe-subtle border border-cafe-border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=200';
                    }}
                  />
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-xs text-cafe-text truncate">{product.name}</h4>
                      {!product.available && (
                        <span className="text-[9px] uppercase font-bold bg-cafe-danger/10 text-cafe-danger border border-cafe-danger/30 px-1 py-0.2 rounded-xs">
                          Disabled
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-cafe-muted mt-0.5">{catName}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="font-black text-cafe-caramel text-sm">₹{product.price}</span>

                  {isOwner && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => toggleProductAvailability(product.id)}
                        title={product.available ? 'Disable product' : 'Enable product'}
                        className={`p-1.5 rounded-xs border transition ${
                          product.available
                            ? 'bg-cafe-sage/10 border-cafe-sage/30 text-cafe-sage hover:bg-cafe-sage/20'
                            : 'bg-cafe-danger/10 border-cafe-danger/30 text-cafe-danger hover:bg-cafe-danger/20'
                        }`}
                      >
                        {product.available ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleEdit(product)}
                        className="p-1.5 rounded-xs bg-cafe-subtle hover:bg-cafe-border text-cafe-text border border-cafe-border transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="p-1.5 rounded-xs bg-cafe-danger/10 hover:bg-cafe-danger/20 text-cafe-danger border border-cafe-danger/30 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        productToEdit={productToEdit}
      />
    </div>
  );
};
