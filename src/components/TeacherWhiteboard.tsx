import React, { useRef, useState, useEffect } from 'react';
import { PenTool, Highlighter, Eraser, Trash2, RotateCcw, X, Eye, EyeOff, Maximize2, Download, MousePointer, Sparkles } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface TeacherWhiteboardProps {
  isActive: boolean;
  onToggleActive: () => void;
}

type ToolType = 'pen' | 'highlighter' | 'eraser' | 'laser';

export const TeacherWhiteboard: React.FC<TeacherWhiteboardProps> = ({
  isActive,
  onToggleActive
}) => {
  const [currentTool, setCurrentTool] = useState<ToolType>('pen');
  const [currentColor, setCurrentColor] = useState<string>('#ef4444'); // vibrant teaching red
  const [strokeWidth, setStrokeWidth] = useState<number>(4);
  const [isWhiteboardBackground, setIsWhiteboardBackground] = useState<boolean>(false);
  const [laserPos, setLaserPos] = useState<{ x: number; y: number } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const historyRef = useRef<ImageData[]>([]);

  // Adjust canvas size to window
  useEffect(() => {
    if (!isActive) return;

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx) tempCtx.drawImage(canvas, 0, 0);

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      if (tempCtx) ctx.drawImage(tempCanvas, 0, 0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isActive]);

  const saveHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const state = ctx.getImageData(0, 0, canvas.width, canvas.height);
    historyRef.current.push(state);
    if (historyRef.current.length > 20) historyRef.current.shift();
  };

  const handleUndo = () => {
    sounds.playClick();
    const canvas = canvasRef.current;
    if (!canvas || historyRef.current.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const previousState = historyRef.current.pop();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (historyRef.current.length > 0) {
      ctx.putImageData(historyRef.current[historyRef.current.length - 1], 0, 0);
    }
  };

  const handleClear = () => {
    sounds.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    saveHistory();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Drawing handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentTool === 'laser') return;
    saveHistory();
    isDrawingRef.current = true;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentTool === 'laser') {
      setLaserPos({ x: e.clientX, y: e.clientY });
      return;
    }

    if (!isDrawingRef.current || !lastPosRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(e.clientX, e.clientY);

    if (currentTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = strokeWidth * 3.5;
    } else if (currentTool === 'highlighter') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = currentColor + '55'; // semi-transparent for highlighting
      ctx.lineWidth = strokeWidth * 2.8;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = strokeWidth;
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    lastPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
    lastPosRef.current = null;
  };

  // Touch handlers for tablets/iPad
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!e.touches[0] || currentTool === 'laser') return;
    saveHistory();
    isDrawingRef.current = true;
    lastPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!e.touches[0]) return;
    if (currentTool === 'laser') {
      setLaserPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      return;
    }
    if (!isDrawingRef.current || !lastPosRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(e.touches[0].clientX, e.touches[0].clientY);

    if (currentTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = strokeWidth * 3.5;
    } else if (currentTool === 'highlighter') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = currentColor + '55';
      ctx.lineWidth = strokeWidth * 2.8;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = strokeWidth;
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    lastPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = () => {
    isDrawingRef.current = false;
    lastPosRef.current = null;
  };

  const handleDownloadSnapshot = () => {
    sounds.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `bai-giang-tieng-trung-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Background overlay if Whiteboard canvas is toggled on */}
      {isWhiteboardBackground && (
        <div className="absolute inset-0 bg-[#1e293b]/95 backdrop-blur-xs pointer-events-auto transition-opacity" />
      )}

      {/* Drawing Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`absolute inset-0 w-full h-full ${
          currentTool === 'laser' ? 'pointer-events-none' : 'pointer-events-auto cursor-crosshair'
        }`}
      />

      {/* Laser Pointer Glowing Red Dot */}
      {currentTool === 'laser' && laserPos && (
        <div
          className="absolute w-5 h-5 -ml-2.5 -mt-2.5 rounded-full bg-red-500 shadow-[0_0_15px_6px_rgba(239,68,68,0.8)] pointer-events-none animate-pulse"
          style={{ left: laserPos.x, top: laserPos.y }}
        />
      )}

      {/* Floating Teacher Toolbar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto bg-stone-900/90 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-stone-700/80 flex items-center gap-3 max-w-[95vw] overflow-x-auto">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-sm font-bold text-amber-400 flex items-center gap-1">
            <span>👨‍🏫</span>
            <span className="hidden sm:inline">Bút Giáo Viên</span>
          </span>
        </div>

        <div className="h-5 w-px bg-stone-700 shrink-0" />

        {/* Tools: Pen, Highlighter, Laser, Eraser */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => {
              sounds.playClick();
              setCurrentTool('pen');
            }}
            className={`p-2 rounded-xl transition ${
              currentTool === 'pen' ? 'bg-rose-600 text-white shadow-xs' : 'text-stone-300 hover:bg-stone-800'
            }`}
            title="Bút viết thường"
          >
            <PenTool className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setCurrentTool('highlighter');
            }}
            className={`p-2 rounded-xl transition ${
              currentTool === 'highlighter' ? 'bg-amber-500 text-stone-950 font-bold shadow-xs' : 'text-stone-300 hover:bg-stone-800'
            }`}
            title="Bút dạ quang (Tô sáng Pinyin / Chữ Hán)"
          >
            <Highlighter className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setCurrentTool('laser');
            }}
            className={`p-2 rounded-xl transition ${
              currentTool === 'laser' ? 'bg-red-500 text-white shadow-xs' : 'text-stone-300 hover:bg-stone-800'
            }`}
            title="Con trỏ Laser giảng bài"
          >
            <MousePointer className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setCurrentTool('eraser');
            }}
            className={`p-2 rounded-xl transition ${
              currentTool === 'eraser' ? 'bg-stone-700 text-white' : 'text-stone-300 hover:bg-stone-800'
            }`}
            title="Cục tẩy"
          >
            <Eraser className="w-4 h-4" />
          </button>
        </div>

        <div className="h-5 w-px bg-stone-700 shrink-0" />

        {/* Color Palette */}
        <div className="flex items-center gap-1.5 shrink-0">
          {[
            { hex: '#ef4444', label: 'Đỏ' },
            { hex: '#eab308', label: 'Vàng' },
            { hex: '#10b981', label: 'Xanh lá' },
            { hex: '#3b82f6', label: 'Xanh dương' },
            { hex: '#ffffff', label: 'Trắng' }
          ].map((c) => (
            <button
              key={c.hex}
              onClick={() => {
                sounds.playClick();
                setCurrentColor(c.hex);
                if (currentTool === 'eraser' || currentTool === 'laser') setCurrentTool('pen');
              }}
              className={`w-5 h-5 rounded-full transition transform ${
                currentColor === c.hex ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'
              }`}
              style={{ backgroundColor: c.hex }}
              title={c.label}
            />
          ))}
        </div>

        <div className="h-5 w-px bg-stone-700 shrink-0" />

        {/* Stroke Width Picker */}
        <div className="flex items-center gap-1 shrink-0">
          {[3, 6, 12].map((w) => (
            <button
              key={w}
              onClick={() => {
                sounds.playClick();
                setStrokeWidth(w);
              }}
              className={`w-6 h-6 rounded-lg text-[11px] font-bold flex items-center justify-center transition ${
                strokeWidth === w ? 'bg-stone-700 text-amber-300' : 'text-stone-400 hover:bg-stone-800'
              }`}
              title={`Cỡ nét ${w}px`}
            >
              {w === 3 ? 'S' : w === 6 ? 'M' : 'L'}
            </button>
          ))}
        </div>

        <div className="h-5 w-px bg-stone-700 shrink-0" />

        {/* Board Background Toggle */}
        <button
          onClick={() => {
            sounds.playClick();
            setIsWhiteboardBackground((prev) => !prev);
          }}
          className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-xl transition shrink-0 ${
            isWhiteboardBackground ? 'bg-emerald-600 text-white font-bold' : 'text-stone-300 hover:bg-stone-800'
          }`}
          title="Chuyển giữa Vẽ đè màn hình & Bảng tối toàn màn hình"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{isWhiteboardBackground ? 'Bảng xanh' : 'Vẽ đè'}</span>
        </button>

        {/* Undo & Clear */}
        <button
          onClick={handleUndo}
          className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition shrink-0"
          title="Hoàn tác nét vẽ"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={handleClear}
          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-stone-800 transition shrink-0"
          title="Xóa toàn bộ nét"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <button
          onClick={handleDownloadSnapshot}
          className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition shrink-0"
          title="Lưu ảnh bài giảng (PNG)"
        >
          <Download className="w-4 h-4" />
        </button>

        <div className="h-5 w-px bg-stone-700 shrink-0" />

        {/* Close Whiteboard Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onToggleActive();
          }}
          className="p-1.5 rounded-xl bg-stone-800 hover:bg-rose-600 text-white transition shrink-0"
          title="Đóng chế độ bút giáo viên"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
