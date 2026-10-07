import React, { useState, useEffect } from 'react';
import { DIALOGUE_SCENARIOS, DialogueScenario } from '../data/dialogues';
import { Volume2, RotateCcw, Sparkles, MessageCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { speakChinese } from '../utils/audio';
import { sounds } from '../utils/soundEffects';

interface DialogueSimProps {
  speechRate: number;
  showPinyin: boolean;
  showViMeaning: boolean;
}

export const DialogueSim: React.FC<DialogueSimProps> = ({
  speechRate,
  showPinyin,
  showViMeaning
}) => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(0);
  const scenario: DialogueScenario = DIALOGUE_SCENARIOS[selectedScenarioIndex];
  const [currentNodeId, setCurrentNodeId] = useState<string>(scenario.initialNodeId);
  const [chatHistory, setChatHistory] = useState<{
    id: string;
    speaker: 'vendor' | 'customer';
    textZh: string;
    pinyin: string;
    textVi: string;
    noteVi?: string;
  }[]>([]);

  // Reset dialogue when scenario changes
  useEffect(() => {
    const initNode = scenario.nodes[scenario.initialNodeId];
    setCurrentNodeId(scenario.initialNodeId);
    setChatHistory([
      {
        id: initNode.id,
        speaker: initNode.speaker,
        textZh: initNode.textZh,
        pinyin: initNode.pinyin,
        textVi: initNode.textVi,
        noteVi: initNode.noteVi
      }
    ]);
    // Speak initial welcome
    speakChinese(initNode.textZh, speechRate);
  }, [selectedScenarioIndex, scenario]);

  const currentNode = scenario.nodes[currentNodeId];

  const handleSelectChoice = (choice: {
    id: string;
    textZh: string;
    pinyin: string;
    textVi: string;
    nextNodeId: string;
    isBargainSuccess?: boolean;
    discountGiven?: number;
  }) => {
    sounds.playClick();

    // 1. Add customer choice to chat
    const customerMsg = {
      id: `cust_${Date.now()}`,
      speaker: 'customer' as const,
      textZh: choice.textZh,
      pinyin: choice.pinyin,
      textVi: choice.textVi
    };

    // 2. Add next vendor node
    const nextNode = scenario.nodes[choice.nextNodeId];
    const vendorMsg = {
      id: nextNode.id,
      speaker: nextNode.speaker,
      textZh: nextNode.textZh,
      pinyin: nextNode.pinyin,
      textVi: nextNode.textVi,
      noteVi: nextNode.noteVi
    };

    setChatHistory((prev) => [...prev, customerMsg, vendorMsg]);
    setCurrentNodeId(choice.nextNodeId);

    // Speak customer sentence, then vendor sentence
    speakChinese(choice.textZh, speechRate, () => {
      if (choice.isBargainSuccess) {
        sounds.playSuccess();
      }
      setTimeout(() => {
        speakChinese(nextNode.textZh, speechRate);
      }, 350);
    });
  };

  const handleRestart = () => {
    sounds.playClick();
    const initNode = scenario.nodes[scenario.initialNodeId];
    setCurrentNodeId(scenario.initialNodeId);
    setChatHistory([
      {
        id: initNode.id,
        speaker: initNode.speaker,
        textZh: initNode.textZh,
        pinyin: initNode.pinyin,
        textVi: initNode.textVi,
        noteVi: initNode.noteVi
      }
    ]);
    speakChinese(initNode.textZh, speechRate);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Top Scenario Switcher */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{scenario.vendorAvatar}</span>
          <div>
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <span>{scenario.titleVi}</span>
              <span className="text-xs font-mono bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md font-semibold">
                {scenario.titleZh}
              </span>
            </h3>
            <p className="text-xs text-stone-500">
              Đối thoại với: <strong>{scenario.vendorName}</strong> ({scenario.vendorRole})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-stone-100 p-1 rounded-xl">
            {DIALOGUE_SCENARIOS.map((sc, idx) => (
              <button
                key={sc.id}
                onClick={() => setSelectedScenarioIndex(idx)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                  selectedScenarioIndex === idx
                    ? 'bg-white text-rose-600 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Kịch bản {idx + 1}
              </button>
            ))}
          </div>

          <button
            onClick={handleRestart}
            className="flex items-center gap-1 text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 px-2.5 py-1.5 rounded-xl font-medium transition"
            title="Bắt đầu lại hội thoại"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Làm lại</span>
          </button>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-gradient-to-b from-stone-50/70 to-white rounded-3xl p-4 sm:p-6 border border-stone-200/80 shadow-sm min-h-[420px] flex flex-col justify-between">
        <div className="space-y-4 overflow-y-auto max-h-[460px] pr-1">
          {chatHistory.map((item, index) => {
            const isVendor = item.speaker === 'vendor';
            return (
              <div
                key={`${item.id}_${index}`}
                className={`flex gap-3 items-start ${isVendor ? 'justify-start' : 'justify-end'}`}
              >
                {isVendor && (
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-xl shrink-0 shadow-2xs">
                    {scenario.vendorAvatar}
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-xs relative ${
                    isVendor
                      ? 'bg-white border border-stone-200/90 text-stone-900 rounded-tl-xs'
                      : 'bg-gradient-to-r from-rose-600 to-red-600 text-white rounded-tr-xs'
                  }`}
                >
                  {/* Speaker name */}
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span
                      className={`text-[11px] font-bold ${
                        isVendor ? 'text-amber-800' : 'text-rose-100'
                      }`}
                    >
                      {isVendor ? scenario.vendorName : 'Bạn (Khách hàng)'}
                    </span>

                    <button
                      onClick={() => {
                        sounds.playClick();
                        speakChinese(item.textZh, speechRate);
                      }}
                      className={`p-1 rounded-full transition ${
                        isVendor
                          ? 'hover:bg-stone-100 text-stone-500 hover:text-rose-600'
                          : 'hover:bg-white/20 text-white'
                      }`}
                      title="Phát âm câu này"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Chinese Text */}
                  <div className="text-base sm:text-lg font-bold tracking-wide">
                    {item.textZh}
                  </div>

                  {/* Pinyin */}
                  {showPinyin && (
                    <div
                      className={`text-xs font-mono font-medium mt-0.5 ${
                        isVendor ? 'text-rose-600' : 'text-rose-100'
                      }`}
                    >
                      {item.pinyin}
                    </div>
                  )}

                  {/* Vietnamese translation */}
                  {showViMeaning && (
                    <div
                      className={`text-xs mt-1 pt-1 border-t ${
                        isVendor
                          ? 'text-stone-600 border-stone-100'
                          : 'text-white/90 border-white/20'
                      }`}
                    >
                      {item.textVi}
                    </div>
                  )}

                  {/* Note bonus if any (e.g. discount notice) */}
                  {item.noteVi && (
                    <div className="mt-2 p-2 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 font-medium">
                      {item.noteVi}
                    </div>
                  )}
                </div>

                {!isVendor && (
                  <div className="w-10 h-10 rounded-2xl bg-rose-100 border border-rose-300 flex items-center justify-center text-xl shrink-0 shadow-2xs">
                    🧑
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* User Interactive Response Choices */}
        <div className="mt-6 pt-4 border-t border-stone-200">
          {currentNode.isEnd ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <h4 className="font-bold text-emerald-900 text-base">
                Hoàn thành xuất sắc hội thoại mua sắm!
              </h4>
              <p className="text-xs text-emerald-700 mt-1">
                Bạn đã luyện thành thạo kỹ năng hỏi giá, dùng trợ từ <strong>吧</strong> để trả giá và nhận tiền thối <strong>找</strong>.
              </p>
              <button
                onClick={handleRestart}
                className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                Luyện tập lại vòng hội thoại
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-600 flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5 text-rose-600" />
                  Chọn câu bạn muốn nói tiếp theo:
                </span>
                <span className="text-[11px] text-stone-400">
                  (Bấm vào câu để đọc & phản hồi người bán)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentNode.choices?.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => handleSelectChoice(choice)}
                    className="group text-left p-3.5 rounded-2xl border border-rose-200 bg-white hover:bg-rose-50/80 hover:border-rose-400 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-stone-900 text-sm group-hover:text-rose-600 transition-colors">
                          {choice.textZh}
                        </span>
                        <ArrowRight className="w-4 h-4 text-rose-400 group-hover:translate-x-1 transition-transform shrink-0" />
                      </div>

                      {showPinyin && (
                        <span className="text-xs font-mono text-rose-600 block mt-0.5">
                          {choice.pinyin}
                        </span>
                      )}

                      {showViMeaning && (
                        <span className="text-xs text-stone-500 block mt-1">
                          {choice.textVi}
                        </span>
                      )}
                    </div>

                    {choice.isBargainSuccess && (
                      <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full w-fit">
                        <Sparkles className="w-2.5 h-2.5" /> Bí kíp mặc cả
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
