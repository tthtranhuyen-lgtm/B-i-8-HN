import React, { useState } from 'react';
import { CHINESE_SHOPPING_LESSONS, LessonSection } from '../data/lessons';
import { Volume2, BookOpen, Sparkles, Lightbulb, CheckCircle2, ChevronRight } from 'lucide-react';
import { speakChinese } from '../utils/audio';
import { sounds } from '../utils/soundEffects';

interface MoneyGuideViewProps {
  speechRate: number;
  showPinyin: boolean;
}

export const MoneyGuideView: React.FC<MoneyGuideViewProps> = ({
  speechRate,
  showPinyin
}) => {
  const [activeSectionId, setActiveSectionId] = useState<string>(CHINESE_SHOPPING_LESSONS[0].id);

  const activeSection: LessonSection =
    CHINESE_SHOPPING_LESSONS.find((s) => s.id === activeSectionId) ||
    CHINESE_SHOPPING_LESSONS[0];

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 rounded-3xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-xs mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Sổ Tay Khẩu Ngữ Đi Chợ & Siêu Thị</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-wide">
            Cẩm Nang Nói Tiền & Trả Giá Tiếng Trung
          </h2>
          <p className="text-white/90 text-xs sm:text-sm mt-1 max-w-2xl">
            Tổng hợp toàn bộ kiến thức từ vựng, ngữ pháp, mẫu câu hỏi giá và nghệ thuật mặc cả theo giáo trình chuẩn dành riêng cho người mới bắt đầu.
          </p>
        </div>
        <div className="absolute -bottom-8 -right-8 w-44 h-44 bg-white/10 rounded-full blur-xl pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Navigation Sidebar */}
        <div className="md:col-span-4 space-y-2">
          {CHINESE_SHOPPING_LESSONS.map((section, idx) => {
            const isActive = section.id === activeSection.id;
            return (
              <button
                key={section.id}
                onClick={() => {
                  sounds.playClick();
                  setActiveSectionId(section.id);
                }}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-2 ${
                  isActive
                    ? 'bg-white border-rose-400 shadow-md ring-2 ring-rose-100 text-rose-950 font-bold'
                    : 'bg-white/80 border-stone-200/80 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-md font-mono ${
                        isActive
                          ? 'bg-rose-100 text-rose-700 font-bold'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      Mục {idx + 1}
                    </span>
                    <span className="text-[11px] text-amber-700 font-medium">
                      {section.badge}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm mt-1 truncate">
                    {section.titleVi}
                  </h4>
                </div>
                <ChevronRight
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    isActive ? 'text-rose-600 translate-x-0.5' : 'text-stone-300'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Content Pane */}
        <div className="md:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-sm space-y-5">
            {/* Section Header */}
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-rose-50 text-rose-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                  {activeSection.badge}
                </span>
                <span className="text-xs font-mono text-stone-500">
                  {activeSection.titleZh}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-stone-900 mt-2">
                {activeSection.titleVi}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                {activeSection.contentVi}
              </p>
            </div>

            {/* Examples with Voice */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                Mẫu ví dụ thực tế & Cách phát âm:
              </span>

              {activeSection.examples.map((item, index) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl bg-stone-50 border border-stone-200/90 hover:border-rose-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-stone-900 tracking-wide font-sans">
                        {item.zh}
                      </span>
                      <button
                        onClick={() => {
                          sounds.playClick();
                          speakChinese(item.speechZh || item.zh, speechRate);
                        }}
                        className="p-1.5 rounded-lg bg-amber-100 hover:bg-rose-100 text-amber-800 hover:text-rose-600 transition"
                        title="Bấm để nghe phát âm"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {showPinyin && (
                      <span className="text-xs font-mono font-medium text-rose-600 block mt-0.5">
                        {item.pinyin}
                      </span>
                    )}

                    <p className="text-xs text-stone-700 mt-1">
                      {item.vi}
                    </p>

                    {item.note && (
                      <span className="text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 inline-block mt-1 font-medium">
                        💡 {item.note}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Tips / Secrets Box */}
            {activeSection.tips && activeSection.tips.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-amber-900">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>Mẹo bỏ túi cho người mới học tiếng Trung:</span>
                </div>
                <ul className="space-y-1.5 list-disc list-inside text-amber-900/90">
                  {activeSection.tips.map((tip, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
