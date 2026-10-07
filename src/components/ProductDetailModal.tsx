import React, { useState } from 'react';
import { Product } from '../types/market';
import { X, Volume2, Plus, Minus, ShoppingBag, Sparkles, MessageCircle, Check, HelpCircle } from 'lucide-react';
import { speakChinese } from '../utils/audio';
import { sounds } from '../utils/soundEffects';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, discountedPrice?: number) => void;
  speechRate: number;
  showPinyin: boolean;
  showViMeaning: boolean;
  onStartDialogueWithProduct?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  speechRate,
  showPinyin,
  showViMeaning,
  onStartDialogueWithProduct
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [hasBargained, setHasBargained] = useState<boolean>(false);
  const [bargainSuccessMsg, setBargainSuccessMsg] = useState<string | null>(null);

  if (!product) return null;

  const effectivePrice = hasBargained && product.bargainPrice ? product.bargainPrice : product.price;
  const totalPrice = effectivePrice * quantity;

  const handleBargain = () => {
    sounds.playSuccess();
    speakChinese('太贵了，便宜一点儿吧！', speechRate, () => {
      speakChinese('行吧，便宜给你！', speechRate);
    });
    setHasBargained(true);
    setBargainSuccessMsg(`Bác bán hàng đã đồng ý giảm từ ¥${product.price} xuống còn ¥${product.bargainPrice}/${product.unitZh}!`);
  };

  const handleAdd = () => {
    sounds.playCashRegister();
    onAddToCart(product, quantity, effectivePrice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative overflow-hidden max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Product Header */}
        <div className="flex items-center gap-4 border-b border-stone-100 pb-5">
          <div className="w-20 h-20 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-5xl shadow-inner shrink-0">
            {product.icon}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-stone-900 tracking-wider">
                {product.nameZh}
              </span>
              <button
                onClick={() => {
                  sounds.playClick();
                  speakChinese(product.nameZh, speechRate);
                }}
                className="p-2 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition shadow-xs"
                title="Phát âm chữ Hán"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-mono font-bold text-rose-600">
                {product.pinyin}
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-sm font-medium text-stone-700">
                {product.meaningVi}
              </span>
            </div>

            <p className="text-xs text-stone-500 mt-1">
              {product.descriptionVi}
            </p>
          </div>
        </div>

        {/* Price & Unit Details (Theo bài giảng sách) */}
        <div className="my-4 bg-stone-50 rounded-2xl p-4 border border-stone-200/70">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-stone-500 font-medium">Đơn giá niêm yết:</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                {hasBargained && product.bargainPrice ? (
                  <>
                    <span className="text-2xl font-black text-emerald-600 font-mono">
                      ¥{product.bargainPrice.toFixed(1)}
                    </span>
                    <span className="text-sm text-stone-400 line-through font-mono">
                      ¥{product.price.toFixed(1)}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-black text-rose-600 font-mono">
                    ¥{product.price.toFixed(1)}
                  </span>
                )}
                <span className="text-xs font-semibold text-stone-600">
                  / 1 {product.unitZh} ({product.unitVi})
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-stone-500 font-medium">Cách đọc tiền tiếng Trung:</span>
              <div className="text-base font-bold text-amber-900 mt-0.5 flex items-center justify-end gap-1">
                <span>{hasBargained && product.bargainPrice ? '优惠价' : product.priceSpokenZh}</span>
                <button
                  onClick={() => {
                    sounds.playClick();
                    speakChinese(`${product.nameZh} ${product.priceSpokenZh} 一${product.unitZh}`, speechRate);
                  }}
                  className="p-1 rounded text-stone-400 hover:text-rose-600"
                  title="Nghe cách nói giá"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-rose-600 font-mono block">
                {product.priceSpokenPinyin}
              </span>
            </div>
          </div>

          {/* Unit Note about Jin vs Gongjin */}
          {product.unitZh === '斤' && (
            <div className="mt-2.5 pt-2 border-t border-stone-200/60 text-xs text-amber-800 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 shrink-0" />
              <span>
                <strong>Ghi nhớ:</strong> 1 斤 (jīn) = 0.5 kg (nửa cân TQ). Muốn mua 1kg hãy gọi <strong>两斤 (liǎng jīn)</strong>!
              </span>
            </div>
          )}
        </div>

        {/* Real Example Sentence from Textbook */}
        <div className="mb-4 bg-amber-50/60 rounded-2xl p-4 border border-amber-200/80">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wide flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Mẫu câu khẩu ngữ ứng dụng:
            </span>
            <button
              onClick={() => {
                sounds.playClick();
                speakChinese(product.exampleSentenceZh, speechRate);
              }}
              className="text-xs font-medium text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              <Volume2 className="w-3.5 h-3.5" /> Nghe câu
            </button>
          </div>

          <p className="text-base font-bold text-stone-900 tracking-wide">
            {product.exampleSentenceZh}
          </p>
          <p className="text-xs font-mono text-rose-600 mt-0.5">
            {product.exampleSentencePinyin}
          </p>
          <p className="text-xs text-stone-600 mt-1 italic">
            "{product.exampleSentenceVi}"
          </p>
        </div>

        {/* Bargain Button Section */}
        {product.bargainPrice && !hasBargained && (
          <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-orange-50 to-rose-50 border border-orange-200 flex items-center justify-between gap-2">
            <div>
              <p className="text-xs font-bold text-stone-800">Thử trả giá với chủ quán?</p>
              <p className="text-[11px] text-stone-500">Nói "太贵了，便宜一点儿吧！" để xin giảm giá</p>
            </div>
            <button
              onClick={handleBargain}
              className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition"
            >
              <span>🗣️</span>
              <span>Mặc cả ngay</span>
            </button>
          </div>
        )}

        {bargainSuccessMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{bargainSuccessMsg}</span>
          </div>
        )}

        {/* Quantity Picker & Add to Cart */}
        <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-stone-600">Số lượng ({product.unitZh}):</span>
            <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden bg-stone-50">
              <button
                onClick={() => {
                  sounds.playClick();
                  setQuantity((prev) => Math.max(1, prev - 1));
                }}
                className="p-2 text-stone-600 hover:bg-stone-200 transition"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-3 text-sm font-bold font-mono text-stone-900">
                {quantity}
              </span>
              <button
                onClick={() => {
                  sounds.playClick();
                  setQuantity((prev) => prev + 1);
                }}
                className="p-2 text-stone-600 hover:bg-stone-200 transition"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition transform active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Bỏ vào giỏ (¥{totalPrice.toFixed(1)})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
