import React from 'react';
import { ShoppingQuest, CartItem } from '../types/market';
import { PRODUCTS, SHOPPING_QUESTS } from '../data/products';
import { CheckCircle2, Circle, ListChecks, Award, Volume2, Plus } from 'lucide-react';
import { speakChinese } from '../utils/audio';
import { sounds } from '../utils/soundEffects';

interface ShoppingListQuestProps {
  currentQuest: ShoppingQuest;
  onSelectQuest: (quest: ShoppingQuest) => void;
  cart: CartItem[];
  onOpenProductDetail: (productId: string) => void;
  showPinyin: boolean;
  speechRate: number;
}

export const ShoppingListQuest: React.FC<ShoppingListQuestProps> = ({
  currentQuest,
  onSelectQuest,
  cart,
  onOpenProductDetail,
  showPinyin,
  speechRate
}) => {
  // Check if each target item is fulfilled in the cart
  const questStatus = currentQuest.targetItems.map((target) => {
    const product = PRODUCTS.find((p) => p.id === target.productId);
    const cartItem = cart.find((item) => item.product.id === target.productId);
    const currentQty = cartItem ? cartItem.quantity : 0;
    const isDone = currentQty >= target.targetQty;
    return {
      target,
      product,
      currentQty,
      isDone
    };
  });

  const allCompleted = questStatus.every((item) => item.isDone);
  const completedCount = questStatus.filter((item) => item.isDone).length;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200/90 shadow-sm relative overflow-hidden">
      {/* Decorative background accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/40 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
            <ListChecks className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 text-sm sm:text-base flex items-center gap-2">
              <span>Danh Sách Mua Sắm (购物清单)</span>
              {allCompleted && (
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 animate-bounce">
                  <Award className="w-3 h-3" /> Đã hoàn thành!
                </span>
              )}
            </h3>
            <p className="text-xs text-stone-500">{currentQuest.description}</p>
          </div>
        </div>

        {/* Quest selector dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={currentQuest.id}
            onChange={(e) => {
              const selected = SHOPPING_QUESTS.find((q) => q.id === e.target.value);
              if (selected) {
                sounds.playClick();
                onSelectQuest(selected);
              }
            }}
            className="text-xs bg-stone-50 border border-stone-200 text-stone-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
          >
            {SHOPPING_QUESTS.map((q) => (
              <option key={q.id} value={q.id}>
                {q.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-stone-100 h-2 rounded-full mb-4 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            allCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-rose-500'
          }`}
          style={{ width: `${(completedCount / questStatus.length) * 100}%` }}
        />
      </div>

      {/* Target Items Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        {questStatus.map(({ target, product, currentQty, isDone }) => {
          if (!product) return null;
          return (
            <div
              key={target.productId}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                isDone
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  : 'bg-stone-50/80 border-stone-200/80 text-stone-800 hover:border-amber-300'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-xl shrink-0">{product.icon}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm tracking-wide">{product.nameZh}</span>
                    {showPinyin && (
                      <span className="text-xs text-rose-600 font-mono">({product.pinyin})</span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakChinese(product.nameZh, speechRate);
                      }}
                      className="text-stone-400 hover:text-rose-600 p-0.5 rounded transition"
                      title="Nghe phát âm"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-xs text-stone-500 truncate">
                    Cần: <span className="font-semibold text-stone-800">{target.targetQty} {product.unitZh}</span> ({product.unitVi})
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                  isDone ? 'bg-emerald-200/70 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {currentQty}/{target.targetQty}
                </span>

                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <button
                    onClick={() => onOpenProductDetail(product.id)}
                    className="p-1 rounded-lg bg-white border border-stone-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition"
                    title="Xem chi tiết & Mua"
                  >
                    <Plus className="w-4 h-4 text-stone-600" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
