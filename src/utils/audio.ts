// High-Quality Standard Mandarin (普通话 Putonghua) Audio Synthesizer & Natural Voice Engine

let activeAudio: HTMLAudioElement | null = null;
let activeUtterance: SpeechSynthesisUtterance | null = null;

// Ensure voices are loaded early
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

/**
 * Clean text strictly for Mandarin speech synthesis:
 * - If text contains an arrow '→' or '->', speak the right side (e.g. "2.6元 → 两块六" -> "两块六")
 * - Remove Latin/Pinyin letters, slashes, brackets, ellipses
 * - Handle numbers and Chinese characters cleanly
 */
export const cleanTextForMandarinTTS = (rawText: string): string => {
  if (!rawText) return '';

  let text = rawText.trim();

  // If there's an arrow like "2.6元 → 两块六", prioritize the right side
  if (text.includes('→')) {
    const parts = text.split('→');
    text = parts[parts.length - 1].trim();
  } else if (text.includes('->')) {
    const parts = text.split('->');
    text = parts[parts.length - 1].trim();
  }

  // Handle common words with parentheses
  text = text.replace(/块\s*\(元\)/g, '块');
  text = text.replace(/角\s*\(毛\)/g, '毛');
  text = text.replace(/\(一\)点儿/g, '一点儿');

  // Remove ellipses like 太……了 -> 太贵了
  text = text.replace(/…+/g, '贵').replace(/\.{3,}/g, '贵');

  // Remove parentheses and anything inside if it contains latin letters (e.g. "(kuài)", "(yuán)", "(yì)")
  text = text.replace(/\([a-zA-Z\s'’`\/]+\)/g, '');
  text = text.replace(/（[a-zA-Z\s'’`\/]+）/g, '');

  // Remove all Latin alphabet characters (a-z, A-Z)
  text = text.replace(/[a-zA-Z]/g, '');

  // Remove slashes, brackets, symbols
  text = text.replace(/[()（）\/\\\[\]{}|#*~`^]/g, ' ');

  // Normalize spaces
  text = text.replace(/\s+/g, ' ').trim();

  return text;
};

/**
 * Get standard Putonghua (普通话) voice from window.speechSynthesis
 * Prioritizes neural, natural mainland voices
 */
export const getStandardMandarinVoice = (): SpeechSynthesisVoice | null => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // 1. High priority: Neural & Natural Mainland Putonghua voices (Xiaoxiao, Yunxi, Google, Ting-Ting)
  const preferredPutonghua = voices.find((v) => {
    const lang = v.lang.toLowerCase();
    const name = v.name.toLowerCase();
    const isZhCN = lang === 'zh-cn' || lang === 'zh_cn' || lang === 'cmn-hans-cn' || lang === 'cmn-cn';
    const isNeuralOrNatural =
      name.includes('natural') ||
      name.includes('online') ||
      name.includes('neural') ||
      name.includes('普通话') ||
      name.includes('xiaoxiao') ||
      name.includes('yunxi') ||
      name.includes('yunjian') ||
      name.includes('ting-ting') ||
      name.includes('google 普通话');
    return isZhCN && isNeuralOrNatural;
  });

  if (preferredPutonghua) return preferredPutonghua;

  // 2. Any exact zh-CN voice (avoid Cantonese/zh-HK/zh-TW)
  const zhCNVoice = voices.find((v) => {
    const lang = v.lang.toLowerCase();
    return lang === 'zh-cn' || lang === 'zh_cn' || lang === 'cmn-hans-cn';
  });
  if (zhCNVoice) return zhCNVoice;

  // 3. Fallback: Any Mandarin voice that is NOT Cantonese
  const generalZhVoice = voices.find((v) => {
    const lang = v.lang.toLowerCase();
    const name = v.name.toLowerCase();
    return (
      (lang.startsWith('zh') || name.includes('chinese') || name.includes('mandarin')) &&
      !lang.includes('hk') &&
      !lang.includes('yue') &&
      !name.includes('cantonese')
    );
  });

  return generalZhVoice || null;
};

/**
 * Fallback Web Speech API with smooth standard Mandarin Putonghua settings
 */
const speakWithWebSpeech = (
  cleanText: string,
  rate: number,
  onEnd?: () => void
): boolean => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return false;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);

    utterance.lang = 'zh-CN';
    utterance.rate = Math.max(0.7, Math.min(1.1, rate));
    utterance.pitch = 1.0;

    const voice = getStandardMandarinVoice();
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onend = () => {
      activeUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      activeUtterance = null;
      if (onEnd) onEnd();
    };

    activeUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error('Web Speech error:', err);
    if (onEnd) onEnd();
    return false;
  }
};

/**
 * Main Speak Function:
 * First plays the natural human Putonghua audio stream (Google Neural TTS zh-CN).
 * If network or audio playback fails, seamlessly falls back to Web Speech API.
 */
export const speakChinese = (
  text: string,
  rate: number = 0.9,
  onEnd?: () => void
): boolean => {
  stopSpeech();

  const cleanText = cleanTextForMandarinTTS(text);
  if (!cleanText) {
    if (onEnd) onEnd();
    return false;
  }

  // Attempt natural human Putonghua audio stream first
  try {
    const encodedQuery = encodeURIComponent(cleanText);
    const naturalAudioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedQuery}&tl=zh-CN&client=tw-ob`;

    const audio = new Audio(naturalAudioUrl);
    activeAudio = audio;

    // Apply speed adjustment
    audio.playbackRate = Math.max(0.65, Math.min(1.2, rate));

    let hasHandledCompletion = false;
    const finish = () => {
      if (!hasHandledCompletion) {
        hasHandledCompletion = true;
        activeAudio = null;
        if (onEnd) onEnd();
      }
    };

    audio.onended = finish;

    audio.onerror = () => {
      // If natural audio stream fails (e.g. offline or blocked), fallback smoothly to Web Speech API
      activeAudio = null;
      speakWithWebSpeech(cleanText, rate, onEnd);
    };

    // Play with promise handling
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        // Autoplay policy or fetch error -> fallback to Web Speech
        activeAudio = null;
        speakWithWebSpeech(cleanText, rate, onEnd);
      });
    }

    return true;
  } catch (err) {
    // Immediate fallback
    return speakWithWebSpeech(cleanText, rate, onEnd);
  }
};

export const stopSpeech = () => {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  activeUtterance = null;
};
