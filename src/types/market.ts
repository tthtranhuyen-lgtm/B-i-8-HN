export type ProductCategory = 'fruit' | 'drink' | 'grocery';

export interface Product {
  id: string;
  nameZh: string;        // e.g. "苹果"
  pinyin: string;        // e.g. "píngguǒ"
  meaningVi: string;     // e.g. "Quả táo"
  category: ProductCategory;
  price: number;         // in RMB/Yuan (e.g. 8.5)
  bargainPrice?: number;  // if bargained (e.g. 7.0)
  unitZh: string;        // e.g. "斤" or "个" or "瓶"
  unitPinyin: string;    // e.g. "jīn"
  unitVi: string;        // e.g. "nửa cân (0.5kg)"
  priceSpokenZh: string; // e.g. "八块五"
  priceSpokenPinyin: string; // e.g. "bā kuài wǔ"
  icon: string;          // Emoji or icon indicator
  bgColor: string;
  borderColor: string;
  descriptionVi: string;
  exampleSentenceZh: string;
  exampleSentencePinyin: string;
  exampleSentenceVi: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  currentPrice: number; // may be discounted after bargaining
  isBargained?: boolean;
}

export interface ShoppingQuest {
  id: string;
  title: string;
  targetItems: {
    productId: string;
    targetQty: number;
  }[];
  budget: number;
  description: string;
  rewardExp: number;
}

export interface DialogueMessage {
  id: string;
  speaker: 'vendor' | 'customer';
  speakerName: string;
  textZh: string;
  pinyin: string;
  textVi: string;
  highlightWords?: string[];
  audioSpeed?: number;
}

export interface DialogueChoice {
  textZh: string;
  pinyin: string;
  textVi: string;
  nextStepId: string;
  isBargain?: boolean;
  discountOffered?: number;
}

export interface DialogueNode {
  id: string;
  message: DialogueMessage;
  choices?: DialogueChoice[];
  isEnd?: boolean;
  bargainSuccess?: boolean;
  discountAmount?: number;
}

export interface QuizQuestion {
  id: string;
  type: 'listen' | 'price_reading' | 'grammar' | 'vocabulary' | 'fill_blank';
  questionPromptVi: string;
  questionZh?: string;
  questionPinyin?: string;
  audioTextZh?: string;
  options: {
    id: string;
    textZh?: string;
    pinyin?: string;
    textVi: string;
  }[];
  correctOptionId: string;
  explanationVi: string;
}

export interface Banknote {
  value: number; // e.g. 100, 50, 20, 10, 5, 1, 0.5
  nameZh: string; // 一百块, 五十块, etc.
  pinyin: string;
  color: string;
  label: string;
}
