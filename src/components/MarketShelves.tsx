import React, { useState } from 'react';
import { Product, ProductCategory } from '../types/market';
import { PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';
import { Search, Sparkles, Filter } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface MarketShelvesProps {
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  showPinyin: boolean;
  showViMeaning: boolean;
  speechRate: number;
}

export const MarketShelves: React.FC<MarketShelvesProps> = ({
  onSelectProduct,
  onQuickAdd,
  showPinyin,
  showViMeaning,
  speechRate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredProducts = PRODUCTS.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();
    if (!query) return matchesCategory;

    const matchesQuery =
      item.nameZh.toLowerCase().includes(query) ||
      item.pinyin.toLowerCase().includes(query) ||
      item.meaningVi.toLowerCase().includes(query) ||
      item.priceSpokenZh.includes(query);

    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-4">
      {/* Category Pills & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
          <button
            onClick={() => {
              sounds.playClick();
              setSelectedCategory('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Tất cả (全部)
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setSelectedCategory('fruit');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap flex items-center gap-1 ${
              selectedCategory === 'fruit'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <span>🍎</span>
            <span>Trái Cây (水果)</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setSelectedCategory('drink');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap flex items-center gap-1 ${
              selectedCategory === 'drink'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <span>🧃</span>
            <span>Đồ Uống (饮料)</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setSelectedCategory('grocery');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap flex items-center gap-1 ${
              selectedCategory === 'grocery'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <span>🥖</span>
            <span>Thực Phẩm (食品)</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo chữ Hán, pinyin, tiếng Việt..."
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-stone-50"
          />
        </div>
      </div>

      {/* Special Notice Banner with Page 3 Highlights */}
      <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-orange-500/10 border border-amber-200 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏷️</span>
          <div>
            <span className="font-bold text-stone-900">Bảng giá đặc biệt (特价 Tèjià): </span>
            <span className="text-stone-700">
              Dưa hấu <strong>2.6元</strong> (两块六), Nho <strong>9.3元</strong> (九块三), Xoài <strong>12.5元</strong> (十二块五), Dâu tây <strong>26.3元</strong> (二十六块三).
            </span>
          </div>
        </div>
        <span className="hidden md:inline-block bg-white text-rose-600 font-bold px-2.5 py-1 rounded-lg text-xs shadow-2xs border border-rose-200 shrink-0">
          Bài học trang 3
        </span>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={onSelectProduct}
            onQuickAdd={onQuickAdd}
            showPinyin={showPinyin}
            showViMeaning={showViMeaning}
            speechRate={speechRate}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-stone-200">
          <span className="text-3xl">🔍</span>
          <p className="mt-2 text-stone-500 text-sm">Không tìm thấy món đồ nào phù hợp.</p>
        </div>
      )}
    </div>
  );
};
