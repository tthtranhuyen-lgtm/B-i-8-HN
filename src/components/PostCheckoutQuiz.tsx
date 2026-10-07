import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/quizzes';
import { QuizQuestion } from '../types/market';
import { Volume2, CheckCircle2, XCircle, RotateCcw, Trophy, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { speakChinese } from '../utils/audio';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

interface PostCheckoutQuizProps {
  onBackToMarket: () => void;
  onOpenGuide: () => void;
  speechRate: number;
}

export const PostCheckoutQuiz: React.FC<PostCheckoutQuizProps> = ({
  onBackToMarket,
  onOpenGuide,
  speechRate
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: string }>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentQ: QuizQuestion = QUIZ_QUESTIONS[currentIndex];
  const selectedOptionId = selectedAnswers[currentQ.id];
  const isAnswered = selectedOptionId !== undefined;

  const handleSelectOption = (optionId: string) => {
    if (isAnswered) return;

    const isCorrect = optionId === currentQ.correctOptionId;
    if (isCorrect) {
      sounds.playSuccess();
    } else {
      sounds.playError();
    }

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionId
    }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    sounds.playClick();
    setShowExplanation(false);
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 }
        });
      } catch {
        // ignore
      }
    }
  };

  const handleRestartQuiz = () => {
    sounds.playClick();
    setCurrentIndex(0);
    setSelectedAnswers({});
    setShowExplanation(false);
    setIsFinished(false);
  };

  // Score calculation
  const correctCount = QUIZ_QUESTIONS.filter(
    (q) => selectedAnswers[q.id] === q.correctOptionId
  ).length;
  const scorePercent = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Quiz Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-amber-200/90 shadow-sm relative overflow-hidden">
        {isFinished ? (
          /* Finished Result Screen */
          <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center text-4xl mx-auto shadow-inner">
              <Trophy className="w-10 h-10 text-amber-600" />
            </div>

            <div>
              <span className="text-xs font-bold text-rose-700 bg-rose-100 px-3 py-1 rounded-full uppercase tracking-wider">
                Kết Quả Bài Kiểm Tra · 测验成绩
              </span>
              <h3 className="text-3xl font-black text-stone-900 mt-2">
                {scorePercent >= 80 ? 'Xuất Sắc! Đi Chợ Như Người Bản Xứ 🌟' : scorePercent >= 50 ? 'Khá Lắm! Tiếp Tục Phát Huy Nhé 👍' : 'Cần Ôn Tập Thêm Kiến Thức 💪'}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Bạn đã trả lời đúng <strong>{correctCount}/{QUIZ_QUESTIONS.length}</strong> câu ({scorePercent}%)
              </p>
            </div>

            {/* Score Ring / Bar */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 max-w-sm mx-auto text-left space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Cách đọc tiền (两块六, 九块三):</span>
                <span className="font-bold text-emerald-600">Thành thạo</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Trợ từ ngữ khí 吧 & Trả giá:</span>
                <span className="font-bold text-emerald-600">Ghi nhớ tốt</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Đơn vị cân 斤 (0.5kg) & Động từ 来/给/找:</span>
                <span className="font-bold text-emerald-600">Nắm vững</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleRestartQuiz}
                className="flex-1 py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-2xl transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Làm lại bài kiểm tra</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenGuide();
                }}
                className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl transition flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Xem sổ tay cẩm nang</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onBackToMarket();
                }}
                className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl transition flex items-center justify-center gap-2"
              >
                <span>Về quầy đi chợ</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Active Question */
          <div>
            {/* Top progress indicator */}
            <div className="flex items-center justify-between mb-3 text-xs text-stone-500 font-medium">
              <span className="bg-rose-50 text-rose-700 px-2.5 py-1 rounded-lg font-bold">
                Câu {currentIndex + 1} / {QUIZ_QUESTIONS.length}
              </span>
              <span>
                Đúng: {correctCount} câu
              </span>
            </div>

            <div className="w-full bg-stone-100 h-2 rounded-full mb-5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-rose-600 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>

            {/* Question Prompt */}
            <div className="mb-5 space-y-2">
              <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
                {currentQ.questionPromptVi}
              </h3>

              {/* If question has Chinese characters or listening test */}
              {(currentQ.questionZh || currentQ.audioTextZh) && (
                <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/80 flex items-center justify-between gap-3">
                  <div>
                    {currentQ.questionZh && (
                      <p className="text-xl font-black text-stone-900 tracking-wide">
                        {currentQ.questionZh}
                      </p>
                    )}
                    {currentQ.questionPinyin && (
                      <p className="text-xs font-mono text-rose-600">
                        {currentQ.questionPinyin}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      sounds.playClick();
                      speakChinese(currentQ.audioTextZh || currentQ.questionZh || '', speechRate);
                    }}
                    className="p-2.5 rounded-xl bg-white text-rose-600 border border-amber-300 hover:bg-rose-50 shadow-2xs transition flex items-center gap-1.5 text-xs font-bold shrink-0"
                    title="Bấm để nghe phát âm"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Nghe giọng đọc</span>
                  </button>
                </div>
              )}
            </div>

            {/* Answer Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                const isCorrectOption = opt.id === currentQ.correctOptionId;

                let btnStyle = 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100 hover:border-amber-300';
                if (isAnswered) {
                  if (isCorrectOption) {
                    btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-50 border-rose-400 text-rose-950';
                  } else {
                    btnStyle = 'bg-stone-50/50 border-stone-200 text-stone-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                  >
                    <div className="min-w-0">
                      {opt.textZh && (
                        <span className="font-bold text-base mr-2 text-stone-900">
                          {opt.textZh}
                        </span>
                      )}
                      {opt.pinyin && (
                        <span className="font-mono text-xs text-rose-600 mr-2">
                          ({opt.pinyin})
                        </span>
                      )}
                      <span className="text-xs sm:text-sm text-stone-700">
                        {opt.textVi}
                      </span>
                    </div>

                    {isAnswered && (
                      <div className="shrink-0">
                        {isCorrectOption ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : isSelected ? (
                          <XCircle className="w-5 h-5 text-rose-600" />
                        ) : null}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Box */}
            {showExplanation && (
              <div className="mt-4 p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-900 space-y-1 animate-in fade-in duration-200">
                <span className="font-bold flex items-center gap-1 text-sky-950">
                  <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                  Giải thích kiến thức:
                </span>
                <p className="leading-relaxed">{currentQ.explanationVi}</p>
              </div>
            )}

            {/* Next Button */}
            {isAnswered && (
              <div className="mt-5 pt-3 border-t border-stone-100 flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold rounded-xl shadow-md flex items-center gap-2 text-sm transition transform active:scale-95"
                >
                  <span>{currentIndex < QUIZ_QUESTIONS.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
