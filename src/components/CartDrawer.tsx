import React from 'react';
import { CartItem } from '../types/market';
import { X, Trash2, Plus, Minus, Volume2, ShoppingBag, Sparkles, ArrowRight } from 'lucide-react';
import { speakChinese } from '../utils/audio';
import { sounds } from '../utils/soundEffects';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
  totalPrice: number;
  speechRate: number;
  showPinyin: boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveItem,
  onProceedToCheckout,
  totalPrice,
  speechRate,
  showPinyin
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-stone-200 animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                Giỏ Hàng Đi Chợ (购物车)
              </h3>
              <p className="text-xs text-stone-500">
                {cart.length} món đồ đã chọn
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <span className="text-5xl block">🛒</span>
              <p className="font-bold text-stone-700 text-sm">
                Giỏ hàng của bạn đang trống
              </p>
              <p className="text-xs text-stone-400 max-w-xs mx-auto">
                Hãy ghé qua quầy Trái Cây (水果) hoặc Đồ Uống (饮料) để thêm đồ vào giỏ nhé!
              </p>
            </div>
          ) : (
            cart.map((item) => {
              const subtotal = item.currentPrice * item.quantity;
              return (
                <div
                  key={item.product.id}
                  className="p-3 rounded-2xl border border-stone-200 bg-stone-50/70 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl shrink-0">{item.product.icon}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-stone-900 text-sm">
                          {item.product.nameZh}
                        </span>
                        {showPinyin && (
                          <span className="text-xs text-rose-600 font-mono">
                            ({item.product.pinyin})
                          </span>
                        )}
                        <button
                          onClick={() => {
                            sounds.playClick();
                            speakChinese(item.product.nameZh, speechRate);
                          }}
                          className="text-stone-400 hover:text-rose-600 p-0.5 rounded"
                          title="Nghe phát âm"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-xs text-stone-500">
                        {item.currentPrice.toFixed(1)}元 / {item.product.unitZh}
                        {item.isBargained && (
                          <span className="ml-1 text-[10px] text-emerald-600 font-bold bg-emerald-100 px-1 rounded">
                            Đã bớt
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {/* Quantity controls */}
                    <div className="flex items-center bg-white border border-stone-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => {
                          sounds.playClick();
                          onUpdateQty(item.product.id, -1);
                        }}
                        className="p-1 hover:bg-stone-100 text-stone-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => {
                          sounds.playClick();
                          onUpdateQty(item.product.id, 1);
                        }}
                        className="p-1 hover:bg-stone-100 text-stone-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right min-w-[50px]">
                      <span className="text-sm font-bold text-rose-600 font-mono">
                        ¥{subtotal.toFixed(1)}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        sounds.playClick();
                        onRemoveItem(item.product.id);
                      }}
                      className="text-stone-400 hover:text-rose-600 p-1 transition"
                      title="Xóa món này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer with Total & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 font-medium">Tổng thanh toán (一共):</span>
                <div className="text-2xl font-black text-rose-600 font-mono">
                  ¥{totalPrice.toFixed(1)}
                </div>
              </div>

              <button
                onClick={() => {
                  sounds.playClick();
                  speakChinese(`一共${totalPrice}块钱。`, speechRate);
                }}
                className="flex items-center gap-1 text-xs text-amber-800 bg-amber-100 px-3 py-1.5 rounded-xl font-medium hover:bg-amber-200 transition"
                title="Luyện nghe: 一共多少钱？"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Nói câu tổng tiền</span>
              </button>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                onProceedToCheckout();
              }}
              className="w-full py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold rounded-2xl shadow-md flex items-center justify-center gap-2 transition transform active:scale-98"
            >
              <span>Thanh toán ngay (去结账)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
