import { QuizQuestion } from '../types/market';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    type: 'price_reading',
    questionPromptVi: 'Theo sách bài học, giá tiền 2.6元 (2 đồng 6 hào) trong khẩu ngữ người Trung Quốc thường đọc là gì?',
    options: [
      { id: 'opt_a', textZh: '两块六', pinyin: 'liǎng kuài liù', textVi: 'Hai đồng sáu (Đúng chuẩn, dùng 两 và bỏ chữ 毛)' },
      { id: 'opt_b', textZh: '二块六', pinyin: 'èr kuài liù', textVi: 'Hai đồng sáu (Sai, trước lượng từ 块 không dùng 二)' },
      { id: 'opt_c', textZh: '两角六', pinyin: 'liǎng jiǎo liù', textVi: 'Hai hào sáu (Sai đơn vị)' },
      { id: 'opt_d', textZh: '二十六块', pinyin: 'èrshíliù kuài', textVi: 'Hai mươi sáu đồng (Sai mệnh giá)' }
    ],
    correctOptionId: 'opt_a',
    explanationVi: 'Chính xác! 2.6元 đọc là "两块六" (liǎng kuài liù). Chú ý số 2 trước lượng từ 块 dùng "两" (liǎng), và trong khẩu ngữ thường lược bỏ chữ 毛 ở cuối.'
  },
  {
    id: 'q2',
    type: 'listen',
    questionPromptVi: 'Bấm nút nghe bên dưới và chọn nghĩa tiếng Việt chính xác của câu phát âm:',
    questionZh: '苹果多少钱一斤？',
    questionPinyin: 'Píngguǒ duōshao qián yì jīn?',
    audioTextZh: '苹果多少钱一斤？',
    options: [
      { id: 'opt_a', textVi: 'Táo bao nhiêu tiền một cân (0.5kg)?' },
      { id: 'opt_b', textVi: 'Quýt bao nhiêu tiền một quả?' },
      { id: 'opt_c', textVi: 'Táo này có ngọt không ông chủ?' },
      { id: 'opt_d', textVi: 'Cho tôi mua hai cân táo.' }
    ],
    correctOptionId: 'opt_a',
    explanationVi: '苹果 (píngguǒ) = Quả táo; 多少钱 (duōshao qián) = bao nhiêu tiền; 一斤 (yì jīn) = một cân (0.5kg).'
  },
  {
    id: 'q3',
    type: 'grammar',
    questionPromptVi: 'Trợ từ ngữ khí “吧” (ba) trong câu trả giá "便宜一点儿吧！" có tác dụng gì và đứng ở vị trí nào?',
    options: [
      { id: 'opt_a', textVi: 'Biểu thị ngữ khí yêu cầu, thương lượng, đề nghị; luôn đứng ở CUỐI câu.' },
      { id: 'opt_b', textVi: 'Biểu thị câu hỏi nghi vấn có không; luôn đứng ở ĐẦU câu.' },
      { id: 'opt_c', textVi: 'Biểu thị sự tức giận, trách móc; đứng ở giữa câu.' },
      { id: 'opt_d', textVi: 'Chỉ dùng trong văn viết trang trọng, không dùng khi đi chợ.' }
    ],
    correctOptionId: 'opt_a',
    explanationVi: 'Theo trang 5 sách bài học: Trợ từ ngữ khí “吧” biểu thị ngữ khí yêu cầu, thương lượng hoặc đề nghị. Vị trí luôn đứng ở cuối câu!'
  },
  {
    id: 'q4',
    type: 'vocabulary',
    questionPromptVi: 'Ở Trung Quốc, khi người bán hàng nói "一斤" (yì jīn), đơn vị cân nặng này tương đương với bao nhiêu kilôgam quốc tế?',
    options: [
      { id: 'opt_a', textVi: '0.5 kg (nửa kilôgam / 500g)' },
      { id: 'opt_b', textVi: '1 kg (một kilôgam)' },
      { id: 'opt_c', textVi: '2 kg (hai kilôgam)' },
      { id: 'opt_d', textVi: '0.1 kg (100g)' }
    ],
    correctOptionId: 'opt_a',
    explanationVi: 'Rất quan trọng! 1 斤 (jīn) = 0.5 kg. Muốn nói 1 kg tiêu chuẩn phải dùng "公斤" (gōngjīn) hoặc "两斤" (liǎng jīn).'
  },
  {
    id: 'q5',
    type: 'price_reading',
    questionPromptVi: 'Giá khuyến mãi của Nho (葡萄) là 9.3元 và Xoài (芒果) là 12.5元. Cách đọc tương ứng là gì?',
    options: [
      { id: 'opt_a', textZh: '九块三 与 十二块五', pinyin: 'jiǔ kuài sān & shí\'èr kuài wǔ', textVi: 'Chín đồng ba & Mười hai đồng năm' },
      { id: 'opt_b', textZh: '九角三 与 十二角五', pinyin: 'jiǔ jiǎo sān & shí\'èr jiǎo wǔ', textVi: 'Chín hào ba & Mười hai hào năm' },
      { id: 'opt_c', textZh: '九块毛 与 十二块五毛', pinyin: 'jiǔ kuài máo & shí\'èr kuài wǔ máo', textVi: 'Cách nói sai ngữ pháp' },
      { id: 'opt_d', textZh: '十九块 与 二十块五', pinyin: 'shíjiǔ kuài & èrshí kuài wǔ', textVi: 'Mười chín & hai mươi' }
    ],
    correctOptionId: 'opt_a',
    explanationVi: 'Chính xác! 9.3元 đọc là 九块三 (jiǔ kuài sān), 12.5元 đọc là 十二块五 (shí\'èr kuài wǔ) theo trang 3 sách bài học.'
  },
  {
    id: 'q6',
    type: 'fill_blank',
    questionPromptVi: 'Điền động từ thích hợp vào chỗ trống để gọi món: "老板，____ 3个苹果！" (Ông chủ, cho tôi / lấy cho tôi 3 quả táo!)',
    options: [
      { id: 'opt_a', textZh: '来 (lái)', pinyin: 'lái', textVi: 'Lấy, mang lại (rất tự nhiên khi mua hàng)' },
      { id: 'opt_b', textZh: '去 (qù)', pinyin: 'qù', textVi: 'Đi (không mang nghĩa lấy đồ)' },
      { id: 'opt_c', textZh: '跑 (pǎo)', pinyin: 'pǎo', textVi: 'Chạy' },
      { id: 'opt_d', textZh: '看 (kàn)', pinyin: 'kàn', textVi: 'Xem, nhìn' }
    ],
    correctOptionId: 'opt_a',
    explanationVi: 'Theo bài học trang 4: Từ "来" (lái) thường được người bản xứ dùng khi gọi món hoặc mua hàng: "老板，来3个苹果！"'
  },
  {
    id: 'q7',
    type: 'vocabulary',
    questionPromptVi: 'Khi thanh toán, khách đưa 100块 và thu ngân nói "找您30块", từ "找" (zhǎo) ở đây mang nghĩa gì?',
    options: [
      { id: 'opt_a', textVi: 'Thối lại, trả lại tiền thừa (to give change)' },
      { id: 'opt_b', textVi: 'Tìm kiếm người mất tích' },
      { id: 'opt_c', textVi: 'Vay mượn thêm tiền' },
      { id: 'opt_d', textVi: 'Phạt tiền' }
    ],
    correctOptionId: 'opt_a',
    explanationVi: 'Theo trang 2 và trang 6: Từ "找" (zhǎo) trong mua bán nghĩa là "trả lại tiền thừa, thối tiền". "找您30块" = Thối lại cho quý khách 30 đồng.'
  },
  {
    id: 'q8',
    type: 'grammar',
    questionPromptVi: 'Câu nào dưới đây thể hiện đúng cấu trúc "Làm gì đó cho ai" (给 + đối tượng + Động từ + Tân ngữ)?',
    options: [
      { id: 'opt_a', textZh: '给妈妈买苹果。', pinyin: 'Gěi māma mǎi píngguǒ.', textVi: 'Mua táo cho mẹ.' },
      { id: 'opt_b', textZh: '买苹果给妈妈看。', pinyin: 'Mǎi píngguǒ gěi māma kàn.', textVi: 'Mua táo cho mẹ xem.' },
      { id: 'opt_c', textZh: '妈妈给苹果买。', pinyin: 'Māma gěi píngguǒ mǎi.', textVi: 'Sai cấu trúc ngữ pháp.' },
      { id: 'opt_d', textZh: '苹果买给妈妈。', pinyin: 'Píngguǒ mǎi gěi māma.', textVi: 'Sai cấu trúc cơ bản.' }
    ],
    correctOptionId: 'opt_a',
    explanationVi: 'Theo trang 6 sách bài tập: Cấu trúc 给 + sb + V + sth: "给妈妈买苹果" (Mua táo cho mẹ).'
  }
];
