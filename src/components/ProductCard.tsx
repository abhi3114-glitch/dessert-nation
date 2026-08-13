import React from 'react';
import { Product } from '../types/pos';
import { Plus, Minus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  cartQuantity: number;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, qty: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  cartQuantity,
  onAddToCart,
  onUpdateQuantity,
}) => {
  return (
    <div
      className={`relative bg-choco-900 border rounded-2xl p-3 flex flex-col justify-between shadow-md transition transform active:scale-98 ${
        !product.available
          ? 'opacity-50 border-choco-800 pointer-events-none'
          : cartQuantity > 0
          ? 'border-caramel-500 shadow-caramel-500/10'
          : 'border-choco-800 hover:border-choco-700'
      }`}
    >
      <div>
        {/* Product Image */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-choco-950 mb-2.5">
          <img
            src={product.imageUrl || 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=300'}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=300';
            }}
          />
          {!product.available && (
            <div className="absolute inset-0 bg-choco-950/80 flex items-center justify-center">
              <span className="text-[10px] font-bold uppercase bg-red-500/80 text-white px-2 py-0.5 rounded-full">
                Unavailable
              </span>
            </div>
          )}
          {cartQuantity > 0 && (
            <div className="absolute top-2 right-2 bg-caramel-500 text-choco-950 text-xs font-black w-6 h-6 rounded-full flex items-center justify-center shadow-lg border border-choco-950">
              {cartQuantity}
            </div>
          )}
        </div>

        {/* Product Name & Price */}
        <h3 className="font-bold text-cream-50 text-xs line-clamp-2 leading-snug">
          {product.name}
        </h3>
        <p className="text-caramel-400 font-extrabold text-sm mt-1">₹{product.price}</p>
      </div>

      {/* Add / Counter Controls */}
      <div className="mt-3">
        {cartQuantity === 0 ? (
          <button
            onClick={() => onAddToCart(product)}
            disabled={!product.available}
            className="w-full bg-choco-800 hover:bg-caramel-500 hover:text-choco-950 text-cream-100 border border-choco-700 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center space-x-1 transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>ADD</span>
          </button>
        ) : (
          <div className="flex items-center justify-between bg-caramel-500 text-choco-950 font-bold rounded-xl p-1 shadow">
            <button
              onClick={() => onUpdateQuantity(product.id, cartQuantity - 1)}
              className="w-7 h-7 rounded-lg bg-choco-950/20 hover:bg-choco-950/40 flex items-center justify-center transition active:scale-90"
            >
              <Minus className="w-3.5 h-3.5 stroke-[3]" />
            </button>
            <span className="text-xs font-black">{cartQuantity}</span>
            <button
              onClick={() => onUpdateQuantity(product.id, cartQuantity + 1)}
              className="w-7 h-7 rounded-lg bg-choco-950/20 hover:bg-choco-950/40 flex items-center justify-center transition active:scale-90"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
