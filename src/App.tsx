import React, { useState } from 'react';
import { Header, ActiveTab } from './components/Header';
import { ShoppingListQuest } from './components/ShoppingListQuest';
import { MarketShelves } from './components/MarketShelves';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { DialogueSim } from './components/DialogueSim';
import { MoneyGuideView } from './components/MoneyGuideView';
import { PostCheckoutQuiz } from './components/PostCheckoutQuiz';
import { VocabularySummary } from './components/VocabularySummary';
import { HanziPracticeCanvas } from './components/HanziPracticeCanvas';
import { TeacherWhiteboard } from './components/TeacherWhiteboard';
import { Product, CartItem, ShoppingQuest } from './types/market';
import { PRODUCTS, SHOPPING_QUESTS } from './data/products';
import { sounds } from './utils/soundEffects';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ActiveTab>('vocab');
  const [walletBalance, setWalletBalance] = useState<number>(200.0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentQuest, setCurrentQuest] = useState<ShoppingQuest>(SHOPPING_QUESTS[0]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  // Teacher mode & writing practice state
  const [isTeacherMode, setIsTeacherMode] = useState<boolean>(false);
  const [selectedCharForWriting, setSelectedCharForWriting] = useState<string>('买');

  // Settings
  const [showPinyin, setShowPinyin] = useState<boolean>(true);
  const [showViMeaning, setShowViMeaning] = useState<boolean>(true);
  const [speechRate, setSpeechRate] = useState<number>(1.0);

  // Calculate cart total
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.currentPrice * item.quantity,
    0
  );
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (product: Product, quantity: number, discountedPrice?: number) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      const effPrice = discountedPrice || product.price;
      const isBargained = discountedPrice !== undefined && discountedPrice < product.price;

      if (existingIndex > -1) {
        const nextCart = [...prev];
        nextCart[existingIndex] = {
          ...nextCart[existingIndex],
          quantity: nextCart[existingIndex].quantity + quantity,
          currentPrice: isBargained ? effPrice : nextCart[existingIndex].currentPrice,
          isBargained: isBargained || nextCart[existingIndex].isBargained
        };
        return nextCart;
      } else {
        return [
          ...prev,
          {
            product,
            quantity,
            currentPrice: effPrice,
            isBargained
          }
        ];
      }
    });
  };

  const handleQuickAdd = (product: Product) => {
    handleAddToCart(product, 1);
  };

  const handleUpdateCartQty = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleOpenProductDetail = (productId: string) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (product) {
      setSelectedProduct(product);
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handlePaymentSuccess = (amountPaid: number) => {
    setWalletBalance((prev) => Math.max(0, Math.round((prev - amountPaid) * 10) / 10));
    setCart([]);
  };

  const handleResetWallet = () => {
    setWalletBalance(200.0);
  };

  const handleStartQuiz = () => {
    setIsCheckoutOpen(false);
    setCurrentTab('quiz');
  };

  const handleStartWritingPractice = (char: string) => {
    setSelectedCharForWriting(char);
    setCurrentTab('writing');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/80 via-rose-50/50 to-orange-50/70 text-stone-900 flex flex-col font-sans selection:bg-rose-200 relative overflow-hidden">
      {/* Lively Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft Ambient Glowing Orbs */}
        <div className="absolute top-10 -left-20 w-96 h-96 bg-amber-200/35 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-20 w-[420px] h-[420px] bg-rose-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-10 left-1/4 w-[460px] h-[460px] bg-orange-200/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />

        {/* Floating Chinese Market Icons in the background */}
        <div className="absolute top-24 left-[8%] text-3xl opacity-25 animate-float-slow select-none">
          🏮
        </div>
        <div className="absolute top-48 right-[10%] text-4xl opacity-25 animate-float-reverse select-none">
          🍎
        </div>
        <div className="absolute top-[45%] left-[5%] text-3xl opacity-20 animate-float-slow select-none" style={{ animationDelay: '1.5s' }}>
          🍉
        </div>
        <div className="absolute top-[60%] right-[6%] text-3xl opacity-25 animate-float-reverse select-none" style={{ animationDelay: '3s' }}>
          🧃
        </div>
        <div className="absolute bottom-28 left-[12%] text-3xl opacity-20 animate-float-slow select-none" style={{ animationDelay: '2.5s' }}>
          🍊
        </div>
        <div className="absolute bottom-36 right-[15%] text-3xl opacity-25 animate-float-reverse select-none" style={{ animationDelay: '1s' }}>
          🥟
        </div>
      </div>

      {/* Top Header & Navigation */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        walletBalance={walletBalance}
        cartCount={cartCount}
        cartTotal={cartTotal}
        openCart={() => setIsCartOpen(true)}
        showPinyin={showPinyin}
        setShowPinyin={setShowPinyin}
        showViMeaning={showViMeaning}
        setShowViMeaning={setShowViMeaning}
        speechRate={speechRate}
        setSpeechRate={setSpeechRate}
        onResetWallet={handleResetWallet}
        isTeacherMode={isTeacherMode}
        onToggleTeacherMode={() => setIsTeacherMode((prev) => !prev)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-5 relative z-10">
        {/* 1. VOCABULARY SUMMARY (Flashcard mode) */}
        {currentTab === 'vocab' && (
          <VocabularySummary
            onStartWritingPractice={handleStartWritingPractice}
            speechRate={speechRate}
            showPinyin={showPinyin}
            showViMeaning={showViMeaning}
          />
        )}

        {/* 2. HANZI HANDWRITING PRACTICE */}
        {currentTab === 'writing' && (
          <HanziPracticeCanvas
            initialChar={selectedCharForWriting}
            speechRate={speechRate}
          />
        )}

        {/* 3. MARKET SIMULATOR */}
        {currentTab === 'market' && (
          <div className="space-y-5">
            <ShoppingListQuest
              currentQuest={currentQuest}
              onSelectQuest={setCurrentQuest}
              cart={cart}
              onOpenProductDetail={handleOpenProductDetail}
              showPinyin={showPinyin}
              speechRate={speechRate}
            />

            <MarketShelves
              onSelectProduct={setSelectedProduct}
              onQuickAdd={handleQuickAdd}
              showPinyin={showPinyin}
              showViMeaning={showViMeaning}
              speechRate={speechRate}
            />
          </div>
        )}

        {/* 4. REALISTIC DIALOGUE SIMULATION */}
        {currentTab === 'dialogue' && (
          <DialogueSim
            speechRate={speechRate}
            showPinyin={showPinyin}
            showViMeaning={showViMeaning}
          />
        )}

        {/* 5. MONEY & BARGAINING GUIDE */}
        {currentTab === 'guide' && (
          <MoneyGuideView
            speechRate={speechRate}
            showPinyin={showPinyin}
          />
        )}

        {/* 6. POST-CHECKOUT MINI QUIZ */}
        {currentTab === 'quiz' && (
          <PostCheckoutQuiz
            onBackToMarket={() => setCurrentTab('market')}
            onOpenGuide={() => setCurrentTab('guide')}
            speechRate={speechRate}
          />
        )}
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          speechRate={speechRate}
          showPinyin={showPinyin}
          showViMeaning={showViMeaning}
          onStartDialogueWithProduct={() => {
            setSelectedProduct(null);
            setCurrentTab('dialogue');
          }}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={handleProceedToCheckout}
        totalPrice={cartTotal}
        speechRate={speechRate}
        showPinyin={showPinyin}
      />

      {/* Virtual Checkout Cashier Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        cartTotal={cartTotal}
        walletBalance={walletBalance}
        onPaymentSuccess={handlePaymentSuccess}
        onStartQuiz={handleStartQuiz}
        speechRate={speechRate}
      />

      {/* Teacher Whiteboard Toolbar & Canvas Overlay (Available across all tabs) */}
      <TeacherWhiteboard
        isActive={isTeacherMode}
        onToggleActive={() => setIsTeacherMode((prev) => !prev)}
      />

      {/* Clean Minimal Footer */}
      <footer className="mt-8 border-t border-amber-200/60 bg-white/60 backdrop-blur-md py-4 px-4 text-center text-xs text-stone-400 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <span>🏮 Chợ Tiếng Trung</span>
        </div>
      </footer>
    </div>
  );
}
