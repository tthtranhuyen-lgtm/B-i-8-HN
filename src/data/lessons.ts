export interface LessonSection {
  id: string;
  titleVi: string;
  titleZh: string;
  badge: string;
  contentVi: string;
  examples: {
    zh: string;
    speechZh?: string;
    pinyin: string;
    vi: string;
    note?: string;
  }[];
  tips?: string[];
}

export const CHINESE_SHOPPING_LESSONS: LessonSection[] = [
  {
    id: 'money_units',
    titleVi: '1. Đơn vị tiền tệ Trung Quốc: 块 (元), 毛 (角), 分',
    titleZh: '货币单位：块、毛、分',
    badge: 'Cơ bản nhất',
    contentVi: 'Tiền Trung Quốc (Nhân dân tệ - 人民币 / RMB) có 3 đơn vị chính từ lớn đến nhỏ: 块 (hoặc 元) > 毛 (hoặc 角) > 分. Trong giao tiếp hằng ngày và khi đi chợ, người bản xứ thường dùng cách nói khẩu ngữ (văn nói).',
    examples: [
      {
        zh: '块 (kuài) / 元 (yuán)',
        speechZh: '块，元',
        pinyin: 'kuài / yuán',
        vi: 'Đồng, Tệ (Đơn vị cơ bản). Văn nói dùng 块, văn viết dùng 元.',
        note: '1 块 = 10 毛'
      },
      {
        zh: '毛 (máo) / 角 (jiǎo)',
        speechZh: '毛，角',
        pinyin: 'máo / jiǎo',
        vi: 'Hào (Bằng 1/10 một đồng). Văn nói dùng 毛, văn viết dùng 角.',
        note: '1 毛 = 10 分'
      },
      {
        zh: '分 (fēn)',
        speechZh: '分',
        pinyin: 'fēn',
        vi: 'Xu (Bằng 1/100 một đồng). Hiện nay ít dùng trong chợ tiền mặt.',
        note: 'Đơn vị nhỏ nhất'
      }
    ],
    tips: [
      'Ghi nhớ: Văn nói dùng "块" (kuài) và "毛" (máo). Biển giá trong siêu thị thường in chữ "元" (yuán).',
      '1 Tệ = 10 Hào = 100 Xu.'
    ]
  },
  {
    id: 'how_to_say_price',
    titleVi: '2. Cách đọc số tiền (Rất quan trọng!)',
    titleZh: '数字与价格表达',
    badge: 'Trọng tâm bài học',
    contentVi: 'Khi đọc giá có phần thập phân, người Trung Quốc thường nói tắt bằng cách bỏ chữ "毛" ở cuối nếu phía trước đã có "块". Đặc biệt: Số 2 đứng trước lượng từ 块 luôn đọc là 两 (liǎng), KHÔNG đọc là 二 (èr)!',
    examples: [
      {
        zh: '2.6元 → 两块六',
        speechZh: '两块六',
        pinyin: 'liǎng kuài liù',
        vi: 'Hai đồng sáu hào (2.6 tệ) - Đọc tắt bỏ chữ 毛 ở cuối.',
        note: 'Chú ý: Dùng 两块六, KHÔNG nói 二块六!'
      },
      {
        zh: '9.3元 → 九块三',
        speechZh: '九块三',
        pinyin: 'jiǔ kuài sān',
        vi: 'Chín đồng ba hào (9.3 tệ).',
        note: 'Rất thông dụng khi đi chợ'
      },
      {
        zh: '26.3元 → 二十六块三',
        speechZh: '二十六块三',
        pinyin: 'èrshíliù kuài sān',
        vi: 'Hai mươi sáu đồng ba (26.3 tệ).',
        note: 'Hàng chục dùng 二十六, nhưng nếu 2 tệ lẻ lẻ thì dùng 两块'
      },
      {
        zh: '12.5元 → 十二块五',
        speechZh: '十二块五',
        pinyin: 'shí\'èr kuài wǔ',
        vi: 'Mười hai đồng rưỡi / 12 tệ 5.',
        note: '12.5 tệ = 十二块五'
      },
      {
        zh: '一共多少钱？',
        speechZh: '一共多少钱？',
        pinyin: 'Yígòng duōshao qián?',
        vi: 'Tổng cộng bao nhiêu tiền?',
        note: 'Câu hỏi kinh điển khi tính tiền'
      }
    ],
    tips: [
      '⚠️ Nguyên tắc vàng số 2: Trước lượng từ "块" và "斤", hãy dùng 两 (liǎng). Ví dụ: 两块钱 (2 tệ), 两斤苹果 (2 cân táo).',
      'Nếu sau số thập phân là 0 (ví dụ 2.05元), phải đọc chữ 零 (líng): 两块零五分.'
    ]
  },
  {
    id: 'weight_units',
    titleVi: '3. Đơn vị cân nặng khi mua hoa quả: 斤 (jīn) vs 公斤 (gōngjīn)',
    titleZh: '重量单位：斤 与 公斤',
    badge: 'Dễ nhầm lẫn',
    contentVi: 'Ở Trung Quốc, người ta luôn bán rau củ quả bằng đơn vị 斤 (jīn - cân Tàu). 1 斤 chỉ bằng một nửa kilôgam (0.5 kg). Còn 1 公斤 (gōngjīn) mới bằng 1 kg tiêu chuẩn quốc tế!',
    examples: [
      {
        zh: '一斤 (yì jīn)',
        speechZh: '一斤',
        pinyin: 'yì jīn',
        vi: '1 cân Trung Quốc = 500 gram (0.5 kg).',
        note: 'Khi người bán báo "苹果 8 块一斤" nghĩa là 8 tệ / 0.5 kg (tức 16 tệ / 1 kg).'
      },
      {
        zh: '一公斤 (yì gōngjīn)',
        speechZh: '一公斤',
        pinyin: 'yì gōngjīn',
        vi: '1 kilôgam = 1000 gram (1 kg = 2 斤).',
        note: 'Dùng khi cần đo chuẩn quốc tế'
      },
      {
        zh: '两斤 (liǎng jīn)',
        speechZh: '两斤',
        pinyin: 'liǎng jīn',
        vi: '2 cân TQ = đúng tròn 1 kg.',
        note: 'Khách hay mua 两斤'
      }
    ],
    tips: [
      'Đừng bị hớ! Thấy giá hoa quả đề "5块一斤" thì đó chỉ là 500g thôi nhé, 1kg sẽ là 10 tệ!'
    ]
  },
  {
    id: 'asking_price',
    titleVi: '4. Cách hỏi giá hàng hóa: 怎么卖？ & 多少钱？',
    titleZh: '怎么问价格：怎么卖？多少钱？',
    badge: 'Mẫu câu thực tế',
    contentVi: 'Có 2 cách hỏi giá phổ biến và tự nhiên nhất của người bản xứ khi đi chợ hoặc siêu thị.',
    examples: [
      {
        zh: '老板，橘子怎么卖？',
        speechZh: '老板，橘子怎么卖？',
        pinyin: 'Lǎobǎn, júzi zěnme mài?',
        vi: 'Ông chủ ơi, quýt bán thế nào vậy ạ?',
        note: 'Cấu trúc: Danh từ + 怎么卖？'
      },
      {
        zh: '苹果多少钱一斤？',
        speechZh: '苹果多少钱一斤？',
        pinyin: 'Píngguǒ duōshao qián yì jīn?',
        vi: 'Táo bao nhiêu tiền một cân (0.5kg)?',
        note: 'Cấu trúc: Danh từ + 多少钱 + [đơn vị]?'
      },
      {
        zh: '这个多少钱？',
        speechZh: '这个多少钱？',
        pinyin: 'Zhège duōshao qián?',
        vi: 'Cái này bao nhiêu tiền?',
        note: 'Chỉ tay vào món đồ'
      }
    ]
  },
  {
    id: 'bargaining_ba',
    titleVi: '5. Nghệ thuật trả giá & Trợ từ ngữ khí 吧 (ba)',
    titleZh: '讲价技巧与语气助词“吧”',
    badge: 'Bí kíp đi chợ',
    contentVi: 'Trợ từ "吧" (ba) đứng ở cuối câu, biểu thị ngữ khí yêu cầu, thương lượng, đề nghị hoặc nhượng bộ nhẹ nhàng, giúp câu nói mềm mại và dễ được người bán chấp nhận.',
    examples: [
      {
        zh: '太贵了，便宜一点儿吧！',
        speechZh: '太贵了，便宜一点儿吧！',
        pinyin: 'Tài guì le, piányi yìdiǎnr ba!',
        vi: 'Đắt quá rồi, bớt một chút đi mà!',
        note: 'Công thức: 太 + Tính từ + 了 + 便宜一点儿 + 吧！'
      },
      {
        zh: '七块行不行？',
        speechZh: '七块行不行？',
        pinyin: 'Qī kuài xíng bù xíng?',
        vi: 'Bảy đồng được không bác?',
        note: 'Đưa ra mức giá mong muốn'
      },
      {
        zh: '行吧，给你算七块！',
        speechZh: '行吧，给你算七块！',
        pinyin: 'Xíng ba, gěi nǐ suàn qī kuài!',
        vi: 'Được rồi, tính cho cháu 7 đồng nhé!',
        note: 'Người bán nhượng bộ đồng ý'
      }
    ],
    tips: [
      'Dùng ngữ điệu thân thiện kèm chữ "吧" sẽ tăng tỉ lệ chủ sạp giảm giá lên 90%!'
    ]
  },
  {
    id: 'ordering_and_paying',
    titleVi: '6. Cách gọi món "来...", trả tiền "给..." và tiền thối "找..."',
    titleZh: '买单用语：来、给、找',
    badge: 'Hoàn thành giao dịch',
    contentVi: '3 động từ thiết yếu trong mọi giao dịch mua sắm tiếng Trung:',
    examples: [
      {
        zh: '老板，来3个苹果！',
        speechZh: '老板，来三个苹果！',
        pinyin: 'Lǎobǎn, lái sān ge píngguǒ!',
        vi: 'Ông chủ, lấy cho tôi 3 quả táo!',
        note: 'Động từ "来" (lái) ở đây mang nghĩa là lấy / mua / cho tôi'
      },
      {
        zh: '我去买点儿吃的。',
        speechZh: '我去买点儿吃的。',
        pinyin: 'Wǒ qù mǎi diǎnr chī de.',
        vi: 'Tôi đi mua một ít đồ ăn.',
        note: '买点儿吃的 = mua một ít đồ ăn'
      },
      {
        zh: '给您100块。',
        speechZh: '给您一百块。',
        pinyin: 'Gěi nín yìbǎi kuài.',
        vi: 'Gửi bác 100 đồng ạ.',
        note: '给 (gěi) = Đưa cho, gửi tiền'
      },
      {
        zh: '找您30块。',
        speechZh: '找您三十块。',
        pinyin: 'Zhǎo nín sānshí kuài.',
        vi: 'Thối lại (trả lại) cho bạn 30 đồng.',
        note: '找 (zhǎo) = Thối lại tiền thừa'
      },
      {
        zh: '给妈妈买苹果。',
        speechZh: '给妈妈买苹果。',
        pinyin: 'Gěi māma mǎi píngguǒ.',
        vi: 'Mua táo cho mẹ.',
        note: 'Cấu trúc: 给 + sb + V + sth'
      }
    ]
  }
];
