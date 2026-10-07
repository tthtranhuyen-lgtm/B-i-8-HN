import React, { useState } from 'react';
import { VOCABULARY_LIST, VocabularyItem } from '../data/vocabulary';
import { Volume2, Layers, Sparkles, CheckCircle, RotateCw, ChevronLeft, ChevronRight, Edit3, Shuffle } from 'lucide-react';
import { speakChinese } from '../utils/audio';
import { sounds } from '../utils/soundEffects';

interface VocabularySummaryProps {
  onStartWritingPractice: (hanzi: string) => void;
  speechRate: number;
  showPinyin: boolean;
  showViMeaning: boolean;
}

export const VocabularySummary: React.FC<VocabularySummaryProps> = ({
  onStartWritingPractice,
  speechRate,
  showPinyin,
  showViMeaning
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'core' | 'fruit_drink' | 'grammar_phrase'>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());

  const filteredList = VOCABULARY_LIST.filter((item) => {
    return selectedCategory === 'all' || item.category === selectedCategory;
  });

  const currentItem: VocabularyItem = filteredList[currentIndex] || filteredList[0] || VOCABULARY_LIST[0];

  const handleNext = () => {
    sounds.playClick();
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredList.length);
  };

  const handlePrev = () => {
    sounds.playClick();
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredList.length) % filteredList.length);
  };

  const handleShuffle = () => {
    sounds.playClick();
    setIsFlipped(false);
    const randomIndex = Math.floor(Math.random() * filteredList.length);
    setCurrentIndex(randomIndex);
  };

  const toggleMastered = (id: string) => {
    sounds.playClick();
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSpeak = (text: string) => {
    sounds.playClick();
    speakChinese(text, speechRate);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Category selector & Stats header */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-amber-200/80 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => {
              sounds.playClick();
              setSelectedCategory('all');
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Tất cả ({VOCABULARY_LIST.length})
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setSelectedCategory('core');
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedCategory === 'core'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Từ vựng cốt lõi
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setSelectedCategory('fruit_drink');
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedCategory === 'fruit_drink'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Trái cây & Đồ uống
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setSelectedCategory('grammar_phrase');
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedCategory === 'grammar_phrase'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Ngữ pháp & Trợ từ
          </button>
        </div>

        {/* Mastered Counter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-stone-500 font-medium">
            Thẻ: <strong>{currentIndex + 1}</strong>/{filteredList.length}
          </span>
          <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-lg border border-emerald-200">
            Đã thuộc: {masteredIds.size}
          </span>
        </div>
      </div>

      {/* Main Interactive Flashcard */}
      {currentItem && (
        <div
          onClick={() => {
            sounds.playClick();
            setIsFlipped((prev) => !prev);
          }}
          className="group min-h-[350px] sm:min-h-[380px] bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/90 hover:border-rose-300 shadow-md cursor-pointer transition-all flex flex-col justify-between text-center relative select-none"
        >
          {/* Card Top Information */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-bold text-stone-400 bg-stone-100 px-2 py-0.5 rounded-md">
              #{currentItem.orderNumber}
            </span>

            <div className="flex items-center gap-2">
              <span className="bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded-full font-semibold">
                {currentItem.partOfSpeech} ({currentItem.partOfSpeechZh})
              </span>
              <span className="text-[11px] text-stone-400">
                {isFlipped ? 'Mặt sau' : 'Mặt trước'}
              </span>
            </div>
          </div>

          {!isFlipped ? (
            /* FRONT OF FLASHCARD: Big Hanzi & Voice */
            <div className="space-y-4 my-auto">
              <span className="text-6xl sm:text-7xl font-black text-stone-900 font-sans tracking-wide block transition-transform group-hover:scale-105">
                {currentItem.hanzi}
              </span>

              {showPinyin && (
                <span className="text-xl font-mono font-bold text-rose-600 block">
                  {currentItem.pinyin}
                </span>
              )}

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeak(currentItem.speechZh || currentItem.hanzi);
                  }}
                  className="px-4 py-2 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition transform active:scale-95"
                  title="Bấm để nghe phát âm giọng phổ thông chuẩn"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Phát âm (普通话)</span>
                </button>
              </div>

              <p className="text-xs text-stone-400 pt-1">
                (Chạm vào thẻ để lật xem giải nghĩa & ví dụ)
              </p>
            </div>
          ) : (
            /* BACK OF FLASHCARD: Details, Meaning & Example */
            <div className="space-y-3.5 my-auto animate-in fade-in zoom-in-95 duration-200">
              <div>
                <span className="text-3xl font-black text-stone-900 font-sans">
                  {currentItem.hanzi}
                </span>
                <span className="text-lg font-mono font-bold text-rose-600 block mt-0.5">
                  {currentItem.pinyin}
                </span>
              </div>

              <div className="text-xs text-stone-500 font-medium">
                Âm Hán Việt: <strong>{currentItem.hanViet}</strong>
              </div>

              <div className="text-base font-bold text-stone-900 bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/80 max-w-md mx-auto">
                👉 {currentItem.meaningVi}
              </div>

              {/* Example sentence */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/70 text-xs max-w-md mx-auto text-left">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-stone-900">{currentItem.exampleZh}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeak(currentItem.exampleZh);
                    }}
                    className="text-stone-400 hover:text-rose-600 p-1 rounded"
                    title="Nghe câu ví dụ"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-[11px] font-mono text-rose-600 mt-0.5">
                  {currentItem.examplePinyin}
                </div>
                <div className="text-[11px] text-stone-600 mt-0.5 italic">
                  "{currentItem.exampleVi}"
                </div>
              </div>
            </div>
          )}

          {/* Card Bottom Actions */}
          <div className="flex items-center justify-between gap-2 pt-4 border-t border-stone-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMastered(currentItem.id);
              }}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition ${
                masteredIds.has(currentItem.id)
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>{masteredIds.has(currentItem.id) ? 'Đã thuộc' : 'Đánh dấu đã thuộc'}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                sounds.playClick();
                const charToWrite = currentItem.hanzi.replace(/[()（）]/g, '').slice(0, 1) || '买';
                onStartWritingPractice(charToWrite);
              }}
              className="text-xs font-bold text-amber-900 hover:text-amber-950 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl transition flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Tập viết chữ này</span>
            </button>
          </div>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="flex items-center justify-between gap-2.5">
        <button
          onClick={handlePrev}
          className="flex-1 py-3 px-4 bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition shadow-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Từ trước</span>
        </button>

        <button
          onClick={handleShuffle}
          className="p-3 bg-white hover:bg-stone-50 border border-stone-200 text-stone-600 rounded-2xl transition shadow-xs"
          title="Đổi thẻ ngẫu nhiên"
        >
          <Shuffle className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setIsFlipped((prev) => !prev);
          }}
          className="flex-1 py-3 px-4 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition shadow-xs"
        >
          <RotateCw className="w-4 h-4" />
          <span>Lật thẻ</span>
        </button>

        <button
          onClick={handleNext}
          className="flex-1 py-3 px-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition shadow-md"
        >
          <span>Từ kế tiếp</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Jump Bar: Mini character dots */}
      <div className="bg-white/80 rounded-2xl p-3 border border-stone-200/80 flex flex-wrap gap-1.5 justify-center">
        {filteredList.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => {
              sounds.playClick();
              setIsFlipped(false);
              setCurrentIndex(idx);
            }}
            className={`w-7 h-7 rounded-lg text-xs font-bold font-sans transition ${
              currentIndex === idx
                ? 'bg-rose-600 text-white shadow-xs scale-110'
                : masteredIds.has(item.id)
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
            title={item.pinyin}
          >
            {item.hanzi.slice(0, 1)}
          </button>
        ))}
      </div>
    </div>
  );
};
