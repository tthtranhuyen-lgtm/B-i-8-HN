import React, { useState } from 'react';
import { CartItem } from '../types/market';
import { BANKNOTES } from '../data/products';
import { X, Volume2, Wallet, QrCode, CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';
import { speakChinese } from '../utils/audio';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  cartTotal: number;
  walletBalance: number;
  onPaymentSuccess: (amountPaid: number, changeAmount: number) => void;
  onStartQuiz: () => void;
  speechRate: number;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  cartTotal,
  walletBalance,
  onPaymentSuccess,
  onStartQuiz,
  speechRate
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qr'>('cash');
  const [givenCashAmount, setGivenCashAmount] = useState<number>(0);
  const [selectedNotes, setSelectedNotes] = useState<{ [denom: number]: number }>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [returnedChange, setReturnedChange] = useState<number>(0);

  if (!isOpen) return null;

  const handleAddNote = (denom: number) => {
    sounds.playCoin();
    setSelectedNotes((prev) => ({
      ...prev,
      [denom]: (prev[denom] || 0) + 1
    }));
    setGivenCashAmount((prev) => Math.round((prev + denom) * 10) / 10);
  };

  const handleClearCash = () => {
    sounds.playClick();
    setSelectedNotes({});
    setGivenCashAmount(0);
  };

  // Convert number to Chinese spoken money representation
  const formatMoneyChinese = (amount: number): { zh: string; pinyin: string } => {
    const rounded = Math.round(amount * 10) / 10;
    const whole = Math.floor(rounded);
    const decimal = Math.round((rounded - whole) * 10);

    let wholeText = '';
    if (whole === 0 && decimal > 0) {
      return { zh: `${decimal}毛`, pinyin: `${decimal} máo` };
    }
    if (whole === 2) {
      wholeText = '两块';
    } else {
      wholeText = `${whole}块`;
    }

    if (decimal === 0) {
      return { zh: wholeText, pinyin: `${wholeText} (kuài)` };
    } else {
      return { zh: `${wholeText}${decimal}`, pinyin: `${wholeText} ${decimal} (kuài...máo)` };
    }
  };

  const handleConfirmCashPayment = () => {
    if (givenCashAmount < cartTotal) {
      sounds.playError();
      speakChinese('钱不够，还少一点儿！', speechRate);
      return;
    }

    const change = Math.round((givenCashAmount - cartTotal) * 10) / 10;
    setReturnedChange(change);

    // Audio sequence: 1. Customer gives money "给您X块" -> 2. Cashier gives change "找您Y块"
    const givenZh = `给您${givenCashAmount}块。`;
    const changeZh = change > 0 ? `找您${change}块。` : '正好，不用找零。';

    sounds.playCashRegister();
    speakChinese(givenZh, speechRate, () => {
      setTimeout(() => {
        speakChinese(changeZh, speechRate);
      }, 500);
    });

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    setIsCompleted(true);
    onPaymentSuccess(cartTotal, change);
  };

  const handleConfirmQrPayment = () => {
    if (walletBalance < cartTotal) {
      sounds.playError();
      return;
    }

    sounds.playCashRegister();
    const payZh = `微信支付收款${cartTotal}块！`;
    speakChinese(payZh, speechRate);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    setIsCompleted(true);
    setReturnedChange(0);
    onPaymentSuccess(cartTotal, 0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 relative overflow-hidden max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {!isCompleted && (
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {isCompleted ? (
          /* Success Screen with Call to Action to Quiz */
          <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center text-4xl mx-auto shadow-inner">
              🎉
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
                Thanh toán thành công · 支付成功
              </span>
              <h3 className="text-2xl font-black text-stone-900 mt-2">
                Giao Dịch Hoàn Tất!
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Bạn đã sử dụng thành thạo từ <strong>给 (gěi)</strong> khi đưa tiền và nhận lại tiền thối <strong>找 (zhǎo)</strong>.
              </p>
            </div>

            {/* Financial Summary */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 max-w-md mx-auto text-left space-y-2">
              <div className="flex justify-between text-xs text-stone-600">
                <span>Tổng tiền hàng (一共):</span>
                <span className="font-bold text-stone-900 font-mono">¥{cartTotal.toFixed(1)}</span>
              </div>

              {paymentMethod === 'cash' ? (
                <>
                  <div className="flex justify-between text-xs text-stone-600">
                    <span>Khách đưa (给您):</span>
                    <span className="font-bold text-rose-600 font-mono">¥{givenCashAmount.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between text-xs pt-1.5 border-t border-stone-200 text-stone-900 font-bold">
                    <span>Thối lại tiền thừa (找您):</span>
                    <span className="text-emerald-600 text-sm font-mono">¥{returnedChange.toFixed(1)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-xs text-stone-600">
                  <span>Phương thức:</span>
                  <span className="font-semibold text-emerald-700">Quét mã điện tử (扫码支付)</span>
                </div>
              )}
            </div>

            {/* Chinese Sentence Voice Highlight */}
            <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 flex items-center justify-between gap-3 text-left">
              <div>
                <p className="text-xs font-bold text-amber-950">
                  {paymentMethod === 'cash' ? `找您 ${returnedChange} 块。` : `微信支付收款 ${cartTotal} 块。`}
                </p>
                <p className="text-[11px] font-mono text-rose-600">
                  {paymentMethod === 'cash' ? `Zhǎo nín ${returnedChange} kuài.` : `Wēixìn zhīfù shōukuǎn ${cartTotal} kuài.`}
                </p>
              </div>
              <button
                onClick={() => {
                  sounds.playClick();
                  speakChinese(paymentMethod === 'cash' ? `找您${returnedChange}块` : `微信支付收款${cartTotal}块`, speechRate);
                }}
                className="p-2 rounded-xl bg-white text-rose-600 border border-amber-300 shadow-2xs hover:bg-rose-50"
                title="Nghe lại câu nói này"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Action Buttons: Take Quiz or Back to Market */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  onClose();
                  onStartQuiz();
                }}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold rounded-2xl shadow-md flex items-center justify-center gap-2 transition"
              >
                <span>Làm Bài Kiểm Tra Ôn Tập</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onClose();
                }}
                className="py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-2xl transition"
              >
                Tiếp tục đi chợ
              </button>
            </div>
          </div>
        ) : (
          /* Payment Interface */
          <div>
            <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl">
                💳
              </div>
              <div>
                <h3 className="text-xl font-black text-stone-900">
                  Thanh Toán Tiền Ảo · 结账付款
                </h3>
                <p className="text-xs text-stone-500">
                  Tập dùng tiền mặt Trung Quốc hoặc quét mã như ngoài đời thực
                </p>
              </div>
            </div>

            {/* Total Due Banner */}
            <div className="my-4 p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 font-medium">Tổng tiền phải trả (一共):</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-black text-rose-600 font-mono">
                    ¥{cartTotal.toFixed(1)}
                  </span>
                  <span className="text-xs font-bold text-amber-900 bg-white/80 px-2 py-0.5 rounded-md border border-amber-200">
                    {formatMoneyChinese(cartTotal).zh}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  sounds.playClick();
                  speakChinese(`一共${cartTotal}块钱。`, speechRate);
                }}
                className="flex items-center gap-1 text-xs text-rose-700 bg-white/90 px-3 py-1.5 rounded-xl border border-rose-200 shadow-2xs hover:bg-rose-50"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Nghe "一共..."</span>
              </button>
            </div>

            {/* Payment Method Tabs */}
            <div className="flex gap-2 p-1 bg-stone-100 rounded-2xl mb-4">
              <button
                onClick={() => {
                  sounds.playClick();
                  setPaymentMethod('cash');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  paymentMethod === 'cash'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <Wallet className="w-4 h-4 text-amber-600" />
                <span>Tiền mặt (现金 Xiànjīn)</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setPaymentMethod('qr');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  paymentMethod === 'qr'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>Quét mã QR (扫码支付)</span>
              </button>
            </div>

            {paymentMethod === 'cash' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-700">
                    Bấm các mệnh giá tiền để đưa cho thu ngân:
                  </span>
                  {givenCashAmount > 0 && (
                    <button
                      onClick={handleClearCash}
                      className="text-stone-400 hover:text-rose-600 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Chọn lại
                    </button>
                  )}
                </div>

                {/* Banknotes selector grid */}
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {BANKNOTES.map((note) => (
                    <button
                      key={note.value}
                      onClick={() => handleAddNote(note.value)}
                      className={`group relative p-2 rounded-xl bg-gradient-to-br ${note.color} text-white font-bold flex flex-col items-center justify-center shadow-xs hover:scale-105 active:scale-95 transition`}
                    >
                      <span className="text-xs sm:text-sm font-mono">{note.label}</span>
                      <span className="text-[10px] opacity-90">{note.nameZh}</span>
                      {selectedNotes[note.value] ? (
                        <span className="absolute -top-1.5 -right-1.5 bg-white text-rose-600 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black shadow-xs">
                          {selectedNotes[note.value]}
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>

                {/* Cash Exchange Calculation Box */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-600">Tiền bạn đưa cho người bán (给您):</span>
                    <span className="text-base font-bold font-mono text-stone-900">
                      ¥{givenCashAmount.toFixed(1)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-200">
                    <span className="text-stone-600">Dự tính tiền thối lại (找您):</span>
                    <span className={`text-base font-bold font-mono ${
                      givenCashAmount >= cartTotal ? 'text-emerald-600' : 'text-rose-500'
                    }`}>
                      {givenCashAmount >= cartTotal
                        ? `¥${(Math.round((givenCashAmount - cartTotal) * 10) / 10).toFixed(1)}`
                        : `Còn thiếu ¥${(Math.round((cartTotal - givenCashAmount) * 10) / 10).toFixed(1)}`}
                    </span>
                  </div>
                </div>

                {/* Confirm Cash Payment Button */}
                <button
                  onClick={handleConfirmCashPayment}
                  disabled={givenCashAmount < cartTotal}
                  className={`w-full py-3 rounded-2xl font-bold text-sm transition shadow-md flex items-center justify-center gap-2 ${
                    givenCashAmount >= cartTotal
                      ? 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer active:scale-98'
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Xác Nhận Đưa Tiền (给您 {givenCashAmount} 块)</span>
                </button>
              </div>
            ) : (
              /* QR Code Payment Simulation */
              <div className="text-center space-y-4 py-2">
                <div className="w-40 h-40 mx-auto bg-stone-100 rounded-2xl border-2 border-dashed border-emerald-400 flex flex-col items-center justify-center p-3 relative group">
                  <QrCode className="w-24 h-24 text-stone-800" />
                  <span className="text-[10px] font-bold text-emerald-700 mt-1">
                    微信支付 / 支付宝
                  </span>
                </div>

                <div className="text-xs text-stone-600">
                  Số dư ví ảo hiện có: <strong className="text-emerald-700">¥{walletBalance.toFixed(1)}</strong>
                </div>

                <button
                  onClick={handleConfirmQrPayment}
                  disabled={walletBalance < cartTotal}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Quét Mã Thanh Toán (¥{cartTotal.toFixed(1)})</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
