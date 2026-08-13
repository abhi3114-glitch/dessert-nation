import React, { useRef } from 'react';
import { Category } from '../types/pos';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryFilterProps {
  categories: Category[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategoryId,
  onSelectCategory,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -180 : 180;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-cafe-surface border-b border-cafe-border sticky top-0 z-30 px-3 py-2">
      <div className="flex items-center justify-between">
        <button
          onClick={() => scroll('left')}
          className="p-1 rounded-sm text-cafe-muted hover:text-cafe-text hover:bg-cafe-subtle border border-cafe-border shrink-0 mr-1.5"
          title="Scroll Left"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Text Tabs Navigation with Caramel Underline (Spec Section 11) */}
        <div
          ref={scrollRef}
          className="flex-1 flex items-center space-x-4 overflow-x-auto no-scrollbar scroll-smooth py-1"
        >
          <button
            onClick={() => onSelectCategory('all')}
            className={`pb-1 text-xs font-extrabold tracking-wider uppercase whitespace-nowrap transition border-b-2 ${
              activeCategoryId === 'all'
                ? 'text-cafe-caramel border-cafe-caramel'
                : 'text-cafe-muted border-transparent hover:text-cafe-text'
            }`}
          >
            ALL
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`pb-1 text-xs font-extrabold tracking-wider uppercase whitespace-nowrap transition border-b-2 ${
                activeCategoryId === cat.id
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
  );
};
