import React, { useRef, useState, useEffect } from 'react';
import { Volume2, RotateCcw, Sparkles, CheckCircle2, Eye, EyeOff, Palette, Download, BookOpen } from 'lucide-react';
import { speakChinese } from '../utils/audio';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

interface PracticeCharacter {
  char: string;
  pinyin: string;
  meaningVi: string;
  hanViet: string;
  radical: string;
  strokes: number;
  strokeSteps: string[];
}

export const PRACTICE_CHARACTERS: PracticeCharacter[] = [
  {
    char: '买',
    pinyin: 'mǎi',
    meaningVi: 'Mua (to buy)',
    hanViet: 'Mãi',
    radical: '乛 (Ất)',
    strokes: 6,
    strokeSteps: ['1. Nét móc ngang gập (乛)', '2. Nét chấm (丶)', '3. Nét phẩy (丿)', '4. Nét ngang (一)', '5. Nét phẩy (丿)', '6. Nét chấm dài (丶)']
  },
  {
    char: '果',
    pinyin: 'guǒ',
    meaningVi: 'Quả, trái',
    hanViet: 'Quả',
    radical: '木 (Mộc)',
    strokes: 8,
    strokeSteps: ['1. Sổ', '2. Ngang gập', '3. Ngang', '4. Ngang', '5. Ngang dài', '6. Sổ thẳng', '7. Phẩy', '8. Mác']
  },
  {
    char: '苹',
    pinyin: 'píng',
    meaningVi: 'Táo (trong 苹果)',
    hanViet: 'Bình',
    radical: '艹 (Thảo)',
    strokes: 8,
    strokeSteps: ['1. Ngang', '2. Sổ ngắn', '3. Sổ ngắn', '4. Ngang', '5. Ngang', '6. Phẩy', '7. Sổ đứng', '8. Sổ dài']
  },
  {
    char: '斤',
    pinyin: 'jīn',
    meaningVi: 'Cân TQ = 0.5kg',
    hanViet: 'Cân',
    radical: '斤 (Cân)',
    strokes: 4,
    strokeSteps: ['1. Phẩy nằm (丿)', '2. Phẩy đứng (丿)', '3. Ngang (一)', '4. Sổ thẳng (丨)']
  },
  {
    char: '块',
    pinyin: 'kuài',
    meaningVi: 'Đồng, tệ',
    hanViet: 'Khối',
    radical: '土 (Thổ)',
    strokes: 7,
    strokeSteps: ['1. Ngang', '2. Sổ đứng', '3. Hất (bộ Thổ)', '4. Ngang gập móc', '5. Ngang', '6. Phẩy', '7. Mác']
  },
  {
    char: '贵',
    pinyin: 'guì',
    meaningVi: 'Đắt, quý',
    hanViet: 'Quý',
    radical: '贝 (Bối)',
    strokes: 9,
    strokeSteps: ['1. Sổ', '2. Ngang gập', '3. Ngang', '4. Sổ dài', '5. Sổ', '6. Ngang gập', '7. Ngang', '8. Phẩy', '9. Chấm']
  },
  {
    char: '吧',
    pinyin: 'ba',
    meaningVi: 'Trợ từ ngữ khí (đi mà)',
    hanViet: 'Ba',
    radical: '口 (Khẩu)',
    strokes: 7,
    strokeSteps: ['1. Sổ', '2. Ngang gập', '3. Ngang (bộ Khẩu)', '4. Ngang gập móc', '5. Sổ', '6. Ngang', '7. Sổ cong móc']
  },
  {
    char: '来',
    pinyin: 'lái',
    meaningVi: 'Lấy, mua, đến',
    hanViet: 'Lai',
    radical: '木 (Mộc)',
    strokes: 7,
    strokeSteps: ['1. Ngang', '2. Chấm', '3. Phẩy', '4. Ngang dài', '5. Sổ thẳng', '6. Phẩy', '7. Mác']
  },
  {
    char: '找',
    pinyin: 'zhǎo',
    meaningVi: 'Thối lại tiền thừa',
    hanViet: 'Trảo',
    radical: '扌 (Thủ)',
    strokes: 7,
    strokeSteps: ['1. Ngang', '2. Sổ móc', '3. Hất (bộ Thủ)', '4. Ngang', '5. Nghiêng móc', '6. Phẩy', '7. Chấm']
  },
  {
    char: '给',
    pinyin: 'gěi',
    meaningVi: 'Đưa cho, cho',
    hanViet: 'Cấp',
    radical: '纟 (Mịch)',
    strokes: 9,
    strokeSteps: ['1. Phẩy gập', '2. Phẩy gập', '3. Hất', '4. Phẩy', '5. Mác', '6. Ngang', '7. Sổ', '8. Ngang gập', '9. Ngang']
  },
  {
    char: '点',
    pinyin: 'diǎn (diǎnr)',
    meaningVi: 'Điểm (trong diǎnr)',
    hanViet: 'Điểm',
    radical: '灬 (Hỏa)',
    strokes: 9,
    strokeSteps: ['1. Sổ', '2. Ngang gập', '3. Ngang', '4. Sổ', '5. Ngang', '6. Chấm', '7. Chấm', '8. Chấm', '9. Chấm']
  },
  {
    char: '两',
    pinyin: 'liǎng',
    meaningVi: 'Hai (lượng từ)',
    hanViet: 'Lưỡng',
    radical: '一 (Nhất)',
    strokes: 7,
    strokeSteps: ['1. Ngang', '2. Sổ', '3. Ngang gập móc', '4. Phẩy', '5. Chấm', '6. Phẩy', '7. Chấm']
  }
];

interface HanziPracticeCanvasProps {
  initialChar?: string;
  speechRate: number;
}

export const HanziPracticeCanvas: React.FC<HanziPracticeCanvasProps> = ({
  initialChar = '买',
  speechRate
}) => {
  const [selectedChar, setSelectedChar] = useState<string>(initialChar);
  const [showGhostGuide, setShowGhostGuide] = useState<boolean>(true);
  const [inkColor, setInkColor] = useState<string>('#1c1917'); // Chinese ink black
  const [brushWidth, setBrushWidth] = useState<number>(6);
  const [strokesHistory, setStrokesHistory] = useState<ImageData[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const activeCharData =
    PRACTICE_CHARACTERS.find((c) => c.char === selectedChar) ||
    PRACTICE_CHARACTERS[0];

  // Draw traditional Mi-zi-ge (米字格) red calligraphy grid
  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save();
    ctx.strokeStyle = '#f87171'; // soft red grid lines
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    // Horizontal center line
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Vertical center line
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    // Diagonal lines
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width, 0);
    ctx.lineTo(0, height);
    ctx.stroke();

    // Outer border
    ctx.setLineDash([]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ef4444';
    ctx.strokeRect(1, 1, width - 2, height - 2);

    ctx.restore();
  };

  // Reset or clear canvas
  const handleClear = () => {
    sounds.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx, canvas.width, canvas.height);
    setStrokesHistory([]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI display
    const size = Math.min(380, window.innerWidth - 64);
    canvas.width = size;
    canvas.height = size;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx, canvas.width, canvas.height);
  }, [selectedChar]);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const state = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setStrokesHistory((prev) => [...prev.slice(-15), state]);
  };

  const handleUndo = () => {
    sounds.playClick();
    if (strokesHistory.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = [...strokesHistory];
    newHistory.pop();
    setStrokesHistory(newHistory);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx, canvas.width, canvas.height);

    if (newHistory.length > 0) {
      ctx.putImageData(newHistory[newHistory.length - 1], 0, 0);
    }
  };

  // Mouse & Touch drawing handlers
  const startDrawing = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    saveState();
    const rect = canvas.getBoundingClientRect();
    isDrawingRef.current = true;
    lastPosRef.current = {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const draw = (clientX: number, clientY: number) => {
    if (!isDrawingRef.current || !lastPosRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = clientX - rect.left;
    const currentY = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(currentX, currentY);
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = brushWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    lastPosRef.current = { x: currentX, y: currentY };
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
    lastPosRef.current = null;
  };

  const handleCompleteWriting = () => {
    sounds.playSuccess();
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 rounded-3xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-xs mb-2">
            <span>✍️</span>
            <span>Tập Viết Chữ Hán Theo Quy Tắc Bút Thuận</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-wide">
            Phòng Luyện Viết Chữ Hán (汉字临摹)
          </h2>
          <p className="text-white/90 text-xs sm:text-sm mt-1 max-w-2xl">
            Luyện viết chữ Hán trên ô kẻ Mễ Tự Cách (米字格) chuẩn thư pháp. Tích hợp nét mẫu mờ hướng dẫn theo tỷ lệ vàng và nguyên tắc bút thuận chuẩn xác.
          </p>
        </div>
        <div className="absolute -bottom-8 -right-8 w-44 h-44 bg-white/10 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* Character Selector Pill Strip */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-stone-200/90 shadow-xs flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider shrink-0 mr-1">
          Chọn chữ luyện:
        </span>
        {PRACTICE_CHARACTERS.map((item) => (
          <button
            key={item.char}
            onClick={() => {
              sounds.playClick();
              setSelectedChar(item.char);
              speakChinese(item.char, speechRate);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold text-sm sm:text-base font-sans transition shrink-0 ${
              selectedChar === item.char
                ? 'bg-rose-600 text-white shadow-md scale-105'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {item.char}
          </button>
        ))}
      </div>

      {/* Main Practice Workspace Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        {/* Left: Canvas & Drawing Controls */}
        <div className="md:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-sm flex flex-col items-center">
          {/* Top toolbar */}
          <div className="w-full flex items-center justify-between pb-3 border-b border-stone-100 gap-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-stone-800">Ô Kẻ Mễ Tự (米字格)</span>
              <button
                onClick={() => {
                  sounds.playClick();
                  setShowGhostGuide((prev) => !prev);
                }}
                className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border transition ${
                  showGhostGuide
                    ? 'bg-rose-50 text-rose-700 border-rose-200 font-bold'
                    : 'bg-stone-100 text-stone-500 border-stone-200'
                }`}
                title="Bật/Tắt nét mẫu mờ để đồ theo"
              >
                {showGhostGuide ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>Nét mẫu mờ</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleUndo}
                disabled={strokesHistory.length === 0}
                className="p-1.5 rounded-lg border text-xs text-stone-600 hover:bg-stone-100 disabled:opacity-30 transition"
                title="Hoàn tác nét vừa viết"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handleClear}
                className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-rose-50 hover:text-rose-600 text-stone-700 text-xs font-bold transition"
              >
                Xóa tất cả
              </button>
            </div>
          </div>

          {/* Interactive Canvas Container with Ghost Guide Overlay */}
          <div className="relative bg-amber-50/40 rounded-2xl p-2 border-2 border-red-300 shadow-inner flex items-center justify-center">
            {/* Ghost Template Character Overlay */}
            {showGhostGuide && (
              <div
                className="absolute inset-0 flex items-center justify-center text-[190px] sm:text-[230px] font-sans text-red-200/50 select-none pointer-events-none font-black"
                style={{ lineHeight: 1 }}
              >
                {activeCharData.char}
              </div>
            )}

            {/* Drawing Canvas */}
            <canvas
              ref={canvasRef}
              onMouseDown={(e) => startDrawing(e.clientX, e.clientY)}
              onMouseMove={(e) => draw(e.clientX, e.clientY)}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={(e) => {
                if (e.touches[0]) startDrawing(e.touches[0].clientX, e.touches[0].clientY);
              }}
              onTouchMove={(e) => {
                if (e.touches[0]) draw(e.touches[0].clientX, e.touches[0].clientY);
              }}
              onTouchEnd={stopDrawing}
              className="cursor-crosshair touch-none bg-transparent rounded-xl"
            />
          </div>

          {/* Color & Brush Controls */}
          <div className="w-full mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Color Palette */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-stone-500">Màu mực:</span>
              {[
                { label: 'Mực tàu', hex: '#1c1917' },
                { label: 'Chu sa đỏ', hex: '#dc2626' },
                { label: 'Lam ngọc', hex: '#2563eb' }
              ].map((c) => (
                <button
                  key={c.hex}
                  onClick={() => {
                    sounds.playClick();
                    setInkColor(c.hex);
                  }}
                  className={`w-5 h-5 rounded-full transition transform ${
                    inkColor === c.hex ? 'scale-125 ring-2 ring-offset-2 ring-stone-400' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.label}
                />
              ))}
            </div>

            {/* Brush Width Slider */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-stone-500">Cỡ nét:</span>
              <div className="flex items-center gap-1">
                {[3, 6, 10].map((w) => (
                  <button
                    key={w}
                    onClick={() => {
                      sounds.playClick();
                      setBrushWidth(w);
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      brushWidth === w ? 'bg-rose-600 text-white' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {w === 3 ? 'Mảnh' : w === 6 ? 'Vừa' : 'Đậm'}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleCompleteWriting}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Đã viết xong!</span>
            </button>
          </div>
        </div>

        {/* Right: Character Information & Stroke Order Steps */}
        <div className="md:col-span-5 space-y-4">
          {/* Card Info */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-stone-900 font-sans">
                  {activeCharData.char}
                </span>
                <span className="text-lg font-mono font-bold text-rose-600">
                  {activeCharData.pinyin}
                </span>
              </div>

              <button
                onClick={() => {
                  sounds.playClick();
                  speakChinese(activeCharData.char, speechRate);
                }}
                className="p-2.5 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition shadow-xs"
                title="Bấm để nghe phát âm"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-stone-100">
              <div className="bg-stone-50 p-2 rounded-xl">
                <span className="text-stone-400 block">Âm Hán Việt:</span>
                <span className="font-bold text-stone-800">{activeCharData.hanViet}</span>
              </div>
              <div className="bg-stone-50 p-2 rounded-xl">
                <span className="text-stone-400 block">Bộ thủ (部首):</span>
                <span className="font-bold text-stone-800">{activeCharData.radical}</span>
              </div>
              <div className="bg-stone-50 p-2 rounded-xl">
                <span className="text-stone-400 block">Tổng số nét:</span>
                <span className="font-bold text-stone-800">{activeCharData.strokes} nét</span>
              </div>
              <div className="bg-stone-50 p-2 rounded-xl">
                <span className="text-stone-400 block">Ý nghĩa:</span>
                <span className="font-bold text-rose-700">{activeCharData.meaningVi}</span>
              </div>
            </div>
          </div>

          {/* Stroke Sequence Guide */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-sm space-y-3">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Thứ tự các nét bút thuận (笔顺):
            </span>

            <div className="space-y-1.5">
              {activeCharData.strokeSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs font-medium text-amber-950 flex items-center gap-2"
                >
                  <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 text-[11px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>

            {/* General Stroke Rules reminder */}
            <div className="mt-3 pt-3 border-t border-stone-100 text-[11px] text-stone-500 leading-relaxed">
              <strong>Nguyên tắc vàng:</strong> Ngang trước sổ sau, phẩy trước mác sau, trên trước dưới sau, ngoài trước trong sau.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
