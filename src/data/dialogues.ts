export interface DialogueScenario {
  id: string;
  titleVi: string;
  titleZh: string;
  descriptionVi: string;
  vendorName: string;
  vendorAvatar: string;
  vendorRole: string;
  initialNodeId: string;
  nodes: Record<string, {
    id: string;
    speaker: 'vendor' | 'customer';
    textZh: string;
    pinyin: string;
    textVi: string;
    noteVi?: string;
    choices?: {
      id: string;
      textZh: string;
      pinyin: string;
      textVi: string;
      nextNodeId: string;
      isBargainSuccess?: boolean;
      discountGiven?: number; // RMB discount
    }[];
    isEnd?: boolean;
    finalDiscount?: number;
  }>;
}

export const DIALOGUE_SCENARIOS: DialogueScenario[] = [
  {
    id: 'fruit_stall_bargain',
    titleVi: 'Sạp hoa quả: Hỏi giá & Mặc cả với ông chủ',
    titleZh: '水果摊：问价与讲价',
    descriptionVi: 'Học cách chào hỏi, hỏi giá quýt/táo, dùng "太贵了" và "吧" để xin giảm giá thân thiện.',
    vendorName: 'Vương Đại Thúc (王大叔)',
    vendorAvatar: '👨‍🌾',
    vendorRole: 'Chủ sạp trái cây tươi',
    initialNodeId: 'start',
    nodes: {
      start: {
        id: 'start',
        speaker: 'vendor',
        textZh: '你好！新鲜的水果，想买点儿什么？',
        pinyin: 'Nǐ hǎo! Xīnxiān de shuǐguǒ, xiǎng mǎi diǎnr shénme?',
        textVi: 'Chào cháu! Hoa quả tươi ngon đây, muốn mua chút gì nào?',
        choices: [
          {
            id: 'c1',
            textZh: '老板，橘子怎么卖？',
            pinyin: 'Lǎobǎn, júzi zěnme mài?',
            textVi: 'Ông chủ ơi, quýt bán thế nào vậy ạ?',
            nextNodeId: 'node_orange_price'
          },
          {
            id: 'c2',
            textZh: '老板，苹果多少钱一斤？',
            pinyin: 'Lǎobǎn, píngguǒ duōshao qián yì jīn?',
            textVi: 'Ông chủ, táo bao nhiêu tiền một cân (0.5kg)?',
            nextNodeId: 'node_apple_price'
          }
        ]
      },
      node_orange_price: {
        id: 'node_orange_price',
        speaker: 'vendor',
        textZh: '橘子四块五一斤，很甜的！',
        pinyin: 'Júzi sì kuài wǔ yì jīn, hěn tián de!',
        textVi: 'Quýt 4 tệ 5 một cân (0.5kg), ngọt lịm luôn!',
        choices: [
          {
            id: 'c_orange_bargain',
            textZh: '太贵了，便宜一点儿吧！四块行不行？',
            pinyin: 'Tài guì le, piányi yìdiǎnr ba! Sì kuài xíng bù xíng?',
            textVi: 'Đắt quá rồi, rẻ một chút đi ạ! 4 tệ được không bác?',
            nextNodeId: 'node_orange_bargain_reply',
            isBargainSuccess: true,
            discountGiven: 0.5
          },
          {
            id: 'c_orange_accept',
            textZh: '好的，来两斤橘子！',
            pinyin: 'Hǎo de, lái liǎng jīn júzi!',
            textVi: 'Vâng ạ, lấy cho cháu 2 cân (1kg) quýt nhé!',
            nextNodeId: 'node_orange_pack'
          }
        ]
      },
      node_orange_bargain_reply: {
        id: 'node_orange_bargain_reply',
        speaker: 'vendor',
        textZh: '哈哈，看你这么会说话，行吧！算你四块一斤！还要别的吗？',
        pinyin: 'Hāhā, kàn nǐ zhème huì shuōhuà, xíng ba! Suàn nǐ sì kuài yì jīn! Hái yào bié de ma?',
        textVi: 'Haha, nhìn cháu khéo ăn nói thế, được thôi! Tính cho cháu 4 đồng 1 cân! Còn muốn lấy gì khác không?',
        noteVi: '🎉 Bạn đã trả giá thành công! Giảm 0.5 tệ/cân nhờ dùng trợ từ 吧.',
        choices: [
          {
            id: 'c_more_apple',
            textZh: '再来三个苹果。一共多少钱？',
            pinyin: 'Zài lái sān ge píngguǒ. Yígòng duōshao qián?',
            textVi: 'Cho cháu thêm 3 quả táo nữa. Tổng cộng bao nhiêu tiền ạ?',
            nextNodeId: 'node_total_orange_apple'
          },
          {
            id: 'c_no_more',
            textZh: '不要别的了，一共多少钱？',
            pinyin: 'Bú yào bié de le, yígòng duōshao qián?',
            textVi: 'Cháu không lấy thêm gì nữa ạ, tổng cộng bao nhiêu tiền?',
            nextNodeId: 'node_pay_orange_only'
          }
        ]
      },
      node_orange_pack: {
        id: 'node_orange_pack',
        speaker: 'vendor',
        textZh: '好嘞！两斤一共九块钱。还要别的吗？',
        pinyin: 'Hǎo lei! Liǎng jīn yígòng jiǔ kuài qián. Hái yào bié de ma?',
        textVi: 'Được rồi! 2 cân tổng cộng 9 đồng. Còn lấy gì nữa không cháu?',
        choices: [
          {
            id: 'c_give_money',
            textZh: '不要了。给您十块。',
            pinyin: 'Bú yào le. Gěi nín shí kuài.',
            textVi: 'Cháu không lấy thêm nữa. Gửi bác 10 đồng ạ.',
            nextNodeId: 'node_change_1'
          }
        ]
      },
      node_apple_price: {
        id: 'node_apple_price',
        speaker: 'vendor',
        textZh: '红富士苹果八块五一斤，脆得很！',
        pinyin: 'Hóngfùshì píngguǒ bā kuài wǔ yì jīn, cuì de hěn!',
        textVi: 'Táo Phú Sĩ đỏ 8 tệ 5 một cân, giòn ngọt lắm!',
        choices: [
          {
            id: 'c_apple_bargain',
            textZh: '太贵了，便宜一点儿吧！七块五怎么样？',
            pinyin: 'Tài guì le, piányi yìdiǎnr ba! Qī kuài wǔ zěnmeyàng?',
            textVi: 'Đắt quá, rẻ chút đi bác ơi! 7 tệ 5 thế nào ạ?',
            nextNodeId: 'node_apple_bargain_reply',
            isBargainSuccess: true,
            discountGiven: 1.0
          },
          {
            id: 'c_apple_direct',
            textZh: '老板，来三个苹果！',
            pinyin: 'Lǎobǎn, lái sān ge píngguǒ!',
            textVi: 'Ông chủ, cho cháu 3 quả táo nhé!',
            nextNodeId: 'node_apple_direct_pack'
          }
        ]
      },
      node_apple_bargain_reply: {
        id: 'node_apple_bargain_reply',
        speaker: 'vendor',
        textZh: '行吧行吧，七块五给你！买两斤吧！',
        pinyin: 'Xíng ba xíng ba, qī kuài wǔ gěi nǐ! Mǎi liǎng jīn ba!',
        textVi: 'Được rồi được rồi, 7 tệ 5 bán cho cháu đó! Mua 2 cân nhé!',
        choices: [
          {
            id: 'c_buy_two_jin',
            textZh: '好，给您二十块钱。',
            pinyin: 'Hǎo, gěi nín èrshí kuài qián.',
            textVi: 'Vâng ạ, gửi bác 20 đồng tiền ạ.',
            nextNodeId: 'node_change_apple'
          }
        ]
      },
      node_apple_direct_pack: {
        id: 'node_apple_direct_pack',
        speaker: 'vendor',
        textZh: '三个苹果正好一斤半，十二块。',
        pinyin: 'Sān ge píngguǒ zhènghǎo yì jīn bàn, shí\'èr kuài.',
        textVi: 'Ba quả táo vừa vặn một cân rưỡi, 12 đồng.',
        choices: [
          {
            id: 'c_pay_apple_direct',
            textZh: '给您五十块。',
            pinyin: 'Gěi nín wǔshí kuài.',
            textVi: 'Gửi bác 50 đồng ạ.',
            nextNodeId: 'node_change_apple_50'
          }
        ]
      },
      node_total_orange_apple: {
        id: 'node_total_orange_apple',
        speaker: 'vendor',
        textZh: '两斤橘子八块，三个苹果十二块，一共二十块！',
        pinyin: 'Liǎng jīn júzi bā kuài, sān ge píngguǒ shí\'èr kuài, yígòng èrshí kuài!',
        textVi: '2 cân quýt 8 đồng, 3 quả táo 12 đồng, tổng cộng hai mươi đồng!',
        choices: [
          {
            id: 'c_pay_20',
            textZh: '给您一百块。',
            pinyin: 'Gěi nín yìbǎi kuài.',
            textVi: 'Gửi bác 100 đồng ạ.',
            nextNodeId: 'node_change_100_to_80'
          }
        ]
      },
      node_pay_orange_only: {
        id: 'node_pay_orange_only',
        speaker: 'vendor',
        textZh: '两斤橘子打折后一共八块钱！',
        pinyin: 'Liǎng jīn júzi dǎzhé hòu yígòng bā kuài qián!',
        textVi: '2 cân quýt sau khi giảm giá tổng cộng 8 đồng nhé!',
        choices: [
          {
            id: 'c_pay_10',
            textZh: '给您十块。',
            pinyin: 'Gěi nín shí kuài.',
            textVi: 'Gửi bác 10 đồng ạ.',
            nextNodeId: 'node_change_2'
          }
        ]
      },
      node_change_1: {
        id: 'node_change_1',
        speaker: 'vendor',
        textZh: '收您十块，找您一块。慢走，下次再来！',
        pinyin: 'Shōu nín shí kuài, zhǎo nín yí kuài. Màn zǒu, xià cì zài lái!',
        textVi: 'Nhận của cháu 10 đồng, thối lại cho cháu 1 đồng. Đi cẩn thận, lần sau lại ghé nhé!',
        isEnd: true
      },
      node_change_2: {
        id: 'node_change_2',
        speaker: 'vendor',
        textZh: '找您两块。水果甜得很，下次再来！',
        pinyin: 'Zhǎo nín liǎng kuài. Shuǐguǒ tián de hěn, xià cì zài lái!',
        textVi: 'Thối lại cho cháu 2 đồng. Hoa quả ngọt lắm đấy, lần sau lại tới nhé!',
        isEnd: true,
        finalDiscount: 1.0
      },
      node_change_apple: {
        id: 'node_change_apple',
        speaker: 'vendor',
        textZh: '一共十五块，收您二十，找您五块！谢谢！',
        pinyin: 'Yígòng shíwǔ kuài, shōu nín èrshí, zhǎo nín wǔ kuài! Xièxie!',
        textVi: 'Tổng cộng 15 đồng, nhận của cháu 20, thối lại cháu 5 đồng! Cảm ơn nhé!',
        isEnd: true,
        finalDiscount: 2.0
      },
      node_change_apple_50: {
        id: 'node_change_apple_50',
        speaker: 'vendor',
        textZh: '收您五十，找您三十八块。拿好零钱！',
        pinyin: 'Shōu nín wǔshí, zhǎo nín sānshíbā kuài. Ná hǎo língqián!',
        textVi: 'Nhận của cháu 50 đồng, thối lại cháu 38 đồng. Cầm chắc tiền lẻ nhé!',
        isEnd: true
      },
      node_change_100_to_80: {
        id: 'node_change_100_to_80',
        speaker: 'vendor',
        textZh: '收您一百，找您八十块！欢迎下次光临！',
        pinyin: 'Shōu nín yìbǎi, zhǎo nín bāshí kuài! Huānyíng xià cì guānglín!',
        textVi: 'Nhận của cháu 100 đồng, thối lại cháu 80 đồng! Hoan nghênh lần sau lại ghé!',
        isEnd: true,
        finalDiscount: 1.0
      }
    }
  },
  {
    id: 'supermarket_checkout',
    titleVi: 'Siêu thị: Mua đồ uống & Thanh toán quét mã/tiền mặt',
    titleZh: '超市收银：饮料与结账',
    descriptionVi: 'Thực hành tính tiền tại quầy thu ngân siêu thị: "一共多少钱？", hỏi mã thanh toán hoặc đưa tiền mặt.',
    vendorName: 'Thu Ngân Viên (收银员 小李)',
    vendorAvatar: '👩‍💼',
    vendorRole: 'Nhân viên thu ngân siêu thị',
    initialNodeId: 'start_sm',
    nodes: {
      start_sm: {
        id: 'start_sm',
        speaker: 'vendor',
        textZh: '您好，欢迎光临！请问需要塑料袋吗？',
        pinyin: 'Nín hǎo, huānyíng guānglín! Qǐngwèn xūyào sùliàodài ma?',
        textVi: 'Kính chào quý khách! Cho hỏi quý khách có cần túi nilon không ạ?',
        choices: [
          {
            id: 'c_sm_1',
            textZh: '不需要，谢谢。一共多少钱？',
            pinyin: 'Bù xūyào, xièxie. Yígòng duōshao qián?',
            textVi: 'Không cần đâu ạ, cảm ơn chị. Tổng cộng hết bao nhiêu tiền?',
            nextNodeId: 'node_sm_total'
          },
          {
            id: 'c_sm_2',
            textZh: '要一个。一共多少钱？',
            pinyin: 'Yào yí gè. Yígòng duōshao qián?',
            textVi: 'Cho tôi một túi nhé. Tổng cộng bao nhiêu tiền?',
            nextNodeId: 'node_sm_total_bag'
          }
        ]
      },
      node_sm_total: {
        id: 'node_sm_total',
        speaker: 'vendor',
        textZh: '一瓶绿茶四块，一盒牛奶六块五，一共十块五毛。',
        pinyin: 'Yì píng lǜchá sì kuài, yì hé niúnǎi liù kuài wǔ, yígòng shí kuài wǔ máo.',
        textVi: 'Một chai trà xanh 4 đồng, một hộp sữa 6 đồng rưỡi, tổng cộng là mười đồng năm hào (10.5 tệ).',
        choices: [
          {
            id: 'c_sm_cash',
            textZh: '给您二十块现金。',
            pinyin: 'Gěi nín èrshí kuài xiànjīn.',
            textVi: 'Gửi chị 20 đồng tiền mặt ạ.',
            nextNodeId: 'node_sm_change'
          },
          {
            id: 'c_sm_wechat',
            textZh: '我微信支付可以吗？',
            pinyin: 'Wǒ Wēixìn zhīfù kěyǐ ma?',
            textVi: 'Tôi thanh toán bằng WeChat được không ạ?',
            nextNodeId: 'node_sm_qr'
          }
        ]
      },
      node_sm_total_bag: {
        id: 'node_sm_total_bag',
        speaker: 'vendor',
        textZh: '塑料袋三毛，商品一共十块五，总共十块八毛。',
        pinyin: 'Sùliàodài sān máo, shāngpǐn yígòng shí kuài wǔ, zǒnggòng shí kuài bā máo.',
        textVi: 'Túi 3 hào, hàng hóa 10 tệ 5, tất cả là 10 tệ 8 hào.',
        choices: [
          {
            id: 'c_sm_cash_2',
            textZh: '给您五十块。',
            pinyin: 'Gěi nín wǔshí kuài.',
            textVi: 'Gửi chị 50 đồng ạ.',
            nextNodeId: 'node_sm_change_50'
          }
        ]
      },
      node_sm_change: {
        id: 'node_sm_change',
        speaker: 'vendor',
        textZh: '收您二十，找您九块五毛。小票请拿好！',
        pinyin: 'Shōu nín èrshí, zhǎo nín jiǔ kuài wǔ máo. Xiǎopiào qǐng ná hǎo!',
        textVi: 'Nhận của quý khách 20, thối lại chín đồng năm hào. Hóa đơn xin giữ lấy ạ!',
        isEnd: true
      },
      node_sm_qr: {
        id: 'node_sm_qr',
        speaker: 'vendor',
        textZh: '可以的，请扫这里。微信支付收款十块五毛！祝您生活愉快！',
        pinyin: 'Kěyǐ de, qǐng sǎo zhèlǐ. Wēixìn zhīfù shōukuǎn shí kuài wǔ máo! Zhù nín shēnghuó yúkuài!',
        textVi: 'Được chứ ạ, mời quét ở đây. [Âm thanh WeChat]: Đã nhận 10 đồng 5 hào! Chúc quý khách vui vẻ!',
        isEnd: true
      },
      node_sm_change_50: {
        id: 'node_sm_change_50',
        speaker: 'vendor',
        textZh: '收您五十，找您三十九块两毛。慢走！',
        pinyin: 'Shōu nín wǔshí, zhǎo nín sānshíjiǔ kuài liǎng máo. Màn zǒu!',
        textVi: 'Nhận 50 đồng, thối lại 39 đồng 2 hào cho bạn. Chào bạn nhé!',
        isEnd: true
      }
    }
  }
];
