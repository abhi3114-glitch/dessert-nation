import React, { useState, useEffect } from 'react';
import { useOrders } from '../../context/OrderContext';
import { Product } from '../../types/pos';
import { X, Image } from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, productToEdit }) => {
  const { categories, addProduct, updateProduct } = useOrders();

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'cat_waffles');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [available, setAvailable] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form whenever the modal opens or productToEdit changes
  useEffect(() => {
    if (isOpen) {
      setName(productToEdit?.name || '');
      setCategoryId(productToEdit?.categoryId || categories[0]?.id || 'cat_waffles');
      setPrice(productToEdit?.price != null ? String(productToEdit.price) : '');
      setImageUrl(productToEdit?.imageUrl || '');
      setAvailable(productToEdit?.available ?? true);
      setIsSubmitting(false);
    }
  }, [isOpen, productToEdit, categories]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const numPrice = parseFloat(price);

      if (productToEdit) {
        await updateProduct(productToEdit.id, {
          name: name.trim(),
          categoryId,
          price: numPrice,
          imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=300',
          available,
        });
      } else {
        await addProduct({
          name: name.trim(),
          categoryId,
          price: numPrice,
          imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=300',
          available,
        });
      }

      onClose();
    } catch (e) {
      console.error('Failed to save product:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-choco-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-choco-900 border border-choco-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-choco-950 border-b border-choco-800">
          <h3 className="font-bold text-cream-50 text-sm">
            {productToEdit ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h3>
          <button onClick={onClose} className="p-1 text-choco-500 hover:text-cream-50">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-cream-100 mb-1">Product Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Triple Chocolate Waffle"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-choco-950 border border-choco-700 rounded-xl px-3 py-2 text-cream-50 placeholder-choco-500 focus:outline-none focus:border-caramel-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-cream-100 mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-choco-950 border border-choco-700 rounded-xl px-3 py-2 text-cream-50 focus:outline-none focus:border-caramel-400"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-cream-100 mb-1">Price (₹)</label>
              <input
                type="number"
                required
                min="0"
                placeholder="150"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-choco-950 border border-choco-700 rounded-xl px-3 py-2 text-cream-50 placeholder-choco-500 focus:outline-none focus:border-caramel-400 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-cream-100 mb-1">Image URL (Optional)</label>
            <div className="relative">
              <input
                type="url"
                placeholder="https://..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-choco-950 border border-choco-700 rounded-xl pl-8 pr-3 py-2 text-cream-50 placeholder-choco-500 focus:outline-none focus:border-caramel-400"
              />
              <Image className="w-4 h-4 text-choco-500 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="flex items-center justify-between bg-choco-950 p-3 rounded-xl border border-choco-800">
            <span className="font-bold text-cream-100">Item Availability</span>
            <button
              type="button"
              onClick={() => setAvailable(!available)}
              className={`w-12 h-6 rounded-full transition p-1 flex items-center ${
                available ? 'bg-emerald-500 justify-end' : 'bg-choco-800 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-choco-800 hover:bg-choco-700 text-cream-100 font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-gradient-to-r from-caramel-500 to-amber-500 text-choco-950 font-black rounded-xl shadow-md"
            >
              {isSubmitting ? 'Saving...' : productToEdit ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
