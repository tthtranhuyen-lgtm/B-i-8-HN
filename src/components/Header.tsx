import React from 'react';
import { ShoppingBag, BookOpen, MessageCircle, HelpCircle, Volume2, Wallet, RefreshCw, Eye, EyeOff, Edit3, PenTool, Sparkles } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export type ActiveTab = 'vocab' | 'writing' | 'market' | 'dialogue' | 'guide' | 'quiz';

interface HeaderProps {
  currentTab: ActiveTab;
  setCurrentTab: (tab: ActiveTab) => void;
  walletBalance: number;
  cartCount: number;
  cartTotal: number;
  openCart: () => void;
  showPinyin: boolean;
  setShowPinyin: (v: boolean | ((prev: boolean) => boolean)) => void;
  showViMeaning: boolean;
  setShowViMeaning: (v: boolean | ((prev: boolean) => boolean)) => void;
  speechRate: number;
  setSpeechRate: (r: number) => void;
  onResetWallet: () => void;
  isTeacherMode: boolean;
  onToggleTeacherMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  walletBalance,
  cartCount,
  cartTotal,
  openCart,
  showPinyin,
  setShowPinyin,
  showViMeaning,
  setShowViMeaning,
  speechRate,
  setSpeechRate,
  onResetWallet,
  isTeacherMode,
  onToggleTeacherMode
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
      {/* Top Banner with Chinese lantern vibe */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs md:text-sm">
          <div className="flex items-center gap-2 font-medium">
            <span className="text-base">🏮</span>
            <span className="font-bold tracking-wide text-sm sm:text-base">Chợ Tiếng Trung</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Teacher Pen Mode Toggle */}
            <button
              onClick={() => {
                sounds.playClick();
                onToggleTeacherMode();
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition shadow-xs ${
                isTeacherMode
                  ? 'bg-amber-300 text-stone-950 ring-2 ring-white animate-pulse'
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
              title="Bật/Tắt chế độ bút vẽ, tô sáng giảng dạy online cho giáo viên"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>{isTeacherMode ? 'Đang bật Bút Dạy' : 'Bút Giáo Viên 👨‍🏫'}</span>
            </button>

            {/* Virtual Wallet */}
            <div className="flex items-center gap-1.5 bg-black/25 px-2.5 py-1 rounded-full border border-white/20">
              <Wallet className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Ví:</span>
              <span className="font-bold text-amber-300">¥{walletBalance.toFixed(1)}</span>
              <button
                onClick={() => {
                  sounds.playClick();
                  onResetWallet();
                }}
                title="Nạp lại tiền ảo vào ví"
                className="ml-1 text-white/80 hover:text-white p-0.5 rounded hover:bg-white/10 transition"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>

            {/* Audio speed & Putonghua indicator */}
            <button
              onClick={() => {
                sounds.playClick();
                setSpeechRate(speechRate === 1.0 ? 0.8 : 1.0);
              }}
              className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-full text-xs transition text-white"
              title="Đổi tốc độ đọc giọng phổ thông chuẩn"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-200" />
              <span>Giọng Phổ Thông · {speechRate === 1.0 ? '1.0x' : '0.8x'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-2.5">
        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {/* TAB 1: Từ Vựng (NEW) */}
          <button
            onClick={() => {
              sounds.playClick();
              setCurrentTab('vocab');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium text-xs sm:text-sm transition-all whitespace-nowrap ${
              currentTab === 'vocab'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-200'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <span>📚</span>
            <span>Từ Vựng (生词)</span>
          </button>

          {/* TAB 2: Luyện Viết Chữ (NEW) */}
          <button
            onClick={() => {
              sounds.playClick();
              setCurrentTab('writing');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium text-xs sm:text-sm transition-all whitespace-nowrap ${
              currentTab === 'writing'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-200'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Luyện Viết Chữ</span>
          </button>

          {/* TAB 3: Quầy Đi Chợ */}
          <button
            onClick={() => {
              sounds.playClick();
              setCurrentTab('market');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium text-xs sm:text-sm transition-all whitespace-nowrap ${
              currentTab === 'market'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-200'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <span>🏪</span>
            <span>Quầy Đi Chợ</span>
          </button>

          {/* TAB 4: Hội Thoại Trả Giá */}
          <button
            onClick={() => {
              sounds.playClick();
              setCurrentTab('dialogue');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium text-xs sm:text-sm transition-all whitespace-nowrap ${
              currentTab === 'dialogue'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-200'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Hội Thoại Trả Giá</span>
          </button>

          {/* TAB 5: Cẩm Nang Nói Tiền */}
          <button
            onClick={() => {
              sounds.playClick();
              setCurrentTab('guide');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium text-xs sm:text-sm transition-all whitespace-nowrap ${
              currentTab === 'guide'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-200'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Cẩm Nang Nói Tiền</span>
          </button>

          {/* TAB 6: Bài Kiểm Tra */}
          <button
            onClick={() => {
              sounds.playClick();
              setCurrentTab('quiz');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium text-xs sm:text-sm transition-all whitespace-nowrap ${
              currentTab === 'quiz'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-200'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Bài Kiểm Tra</span>
          </button>
        </nav>

        {/* Right tools: Display Toggles & Cart */}
        <div className="flex items-center gap-2">
          {/* Toggle Pinyin */}
          <button
            onClick={() => {
              sounds.playClick();
              setShowPinyin((prev: boolean) => !prev);
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition ${
              showPinyin
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-stone-100 text-stone-500 border-stone-200'
            }`}
            title="Bật/Tắt hiển thị Pinyin để luyện nhớ mặt chữ Hán"
          >
            {showPinyin ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Pinyin</span>
          </button>

          {/* Toggle Vietnamese Meaning */}
          <button
            onClick={() => {
              sounds.playClick();
              setShowViMeaning((prev: boolean) => !prev);
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition ${
              showViMeaning
                ? 'bg-sky-50 text-sky-800 border-sky-200'
                : 'bg-stone-100 text-stone-500 border-stone-200'
            }`}
            title="Bật/Tắt dịch nghĩa tiếng Việt"
          >
            <span className="font-bold text-[11px]">VI</span>
            <span className="hidden sm:inline">Dịch</span>
          </button>

          {/* Cart Button */}
          <button
            onClick={() => {
              sounds.playClick();
              openCart();
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium px-3.5 py-1.5 rounded-xl shadow-xs transition transform active:scale-95 text-xs sm:text-sm"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </div>
            <span>Giỏ hàng</span>
            <span className="bg-white/20 px-1.5 py-0.5 rounded-md text-xs font-bold">
              ¥{cartTotal.toFixed(1)}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
