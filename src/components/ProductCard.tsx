import React from 'react';
import { Product } from '../types/market';
import { Volume2, Sparkles, Plus, Tag } from 'lucide-react';
import { speakChinese } from '../utils/audio';
import { sounds } from '../utils/soundEffects';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  showPinyin: boolean;
  showViMeaning: boolean;
  speechRate: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickAdd,
  showPinyin,
  showViMeaning,
  speechRate
}) => {
  const handlePlayVoice = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playClick();
    speakChinese(product.nameZh, speechRate);
  };

  return (
    <div
      onClick={() => {
        sounds.playClick();
        speakChinese(product.nameZh, speechRate);
        onSelect(product);
      }}
      className={`group relative bg-white rounded-2xl p-4 border border-stone-200/90 hover:border-rose-400 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between`}
    >
      {/* Top badges */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-3xl filter drop-shadow-xs group-hover:scale-110 transition-transform">
          {product.icon}
        </span>

        {/* Featured Special Price Tag if any */}
        {(product.id === 'watermelon' || product.id === 'grape' || product.id === 'strawberry' || product.id === 'mango') ? (
          <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-xs">
            <Sparkles className="w-2.5 h-2.5" />
            特价 (Giá ưu đãi)
          </span>
        ) : (
          <span className="text-[11px] text-stone-400 font-medium">
            {product.category === 'fruit' ? 'Quầy Trái Cây' : product.category === 'drink' ? 'Quầy Đồ Uống' : 'Thực Phẩm'}
          </span>
        )}
      </div>

      {/* Chinese Characters, Pinyin, Meaning */}
      <div className="my-1">
        <div className="flex items-center justify-between gap-1">
          <h4 className="text-2xl font-black text-stone-900 tracking-wide font-sans group-hover:text-rose-600 transition-colors">
            {product.nameZh}
          </h4>

          <button
            onClick={handlePlayVoice}
            className="p-1.5 rounded-full bg-amber-50 hover:bg-rose-100 text-amber-700 hover:text-rose-600 transition"
            title="Bấm để nghe phát âm tiếng Trung"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {showPinyin && (
          <p className="text-xs font-mono font-medium text-rose-600 mt-0.5">
            {product.pinyin}
          </p>
        )}

        {showViMeaning && (
          <p className="text-xs text-stone-600 mt-0.5 line-clamp-1">
            {product.meaningVi}
          </p>
        )}
      </div>

      {/* Price section with Chinese spoken price */}
      <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-rose-600 font-mono">¥{product.price.toFixed(1)}</span>
            <span className="text-[11px] text-stone-500">
              /{product.unitZh} ({product.unitVi})
            </span>
          </div>
          <div className="text-[11px] font-medium text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded inline-block">
            Đọc: {product.priceSpokenZh}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            sounds.playCoin();
            onQuickAdd(product);
          }}
          className="p-2 rounded-xl bg-stone-100 hover:bg-rose-600 hover:text-white text-stone-700 transition transform active:scale-90"
          title="Thêm nhanh 1 phần vào giỏ"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
