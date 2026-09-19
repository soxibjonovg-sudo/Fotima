import { QuizQuestion } from '../types';

export interface TheorySectionData {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  content: string[];
  formula?: string;
  example?: {
    numbers: string;
    step1: string;
    step2: string;
    result: string;
  };
  tips: string;
}

export const THEORY_SECTIONS: TheorySectionData[] = [
  {
    id: 'boluvchi-karrali',
    title: "1. Bo'luvchi va Karrali Tushunchasi",
    subtitle: "Matematikaning poydevor tushunchalari",
    badge: 'Poydevor',
    content: [
      "Natural son a ning **bo'luvchisi** deb, a soni qoldiqsiz bo'linadigan har qanday natural songa aytiladi. Masalan, 12 ning bo'luvchilari: 1, 2, 3, 4, 6, 12.",
      "Natural son a ning **karralisi** deb, a soniga qoldiqsiz bo'linadigan sonlarga aytiladi. Masalan, 4 ning karralilari: 4, 8, 12, 16, 20, 24, 28...",
      "E'tibor bering: Bo'luvchilar chekli sondadir (eng kattasi sonning o'ziga teng), karralilar esa cheksiz ko'pdir!",
    ],
    formula: "Agar a = b · k (bunda k natural son) bo'lsa, b — a ning bo'luvchisi, a esa b ning karralisidir.",
    example: {
      numbers: 'Son: 18',
      step1: "Bo'luvchilari: 1, 2, 3, 6, 9, 18 (jami 6 ta)",
      step2: 'Karralilari: 18, 36, 54, 72, 90, 108... (cheksiz)',
      result: "Eng kichik bo'luvchi doim 1, eng kichik karrali esa sonning o'zi!",
    },
    tips: "Har qanday natural sonning eng kichik musbat bo'luvchisi 1 bo'lib, eng kattasi sonning o'zidir.",
  },
  {
    id: 'tub-sonlar',
    title: "2. Tub Sonlar va Kanonik Yoyilma",
    subtitle: "Raqamlarning DNK si",
    badge: 'Asos',
    content: [
      "Faqat 1 ga va o'ziga bo'linadigan, 1 dan katta natural sonlar **tub sonlar** deyiladi. 1 soni tub ham, murakkab ham emas!",
      "Eng kichik va yagona juft tub son — **2** dir. Keyingi tub sonlar: 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41...",
      "**Arifmetikaning asosiy teoremasi:** Har qanday 1 dan katta natural sonni tub ko'paytuvchilar ko'paytmasi shaklida yagona usulda tasvirlash mumkin (tartib hisobga olinmasa).",
    ],
    formula: "a = p₁^{α₁} · p₂^{α₂} · ... · pₖ^{αₖ}  (Kanonik shakl)",
    example: {
      numbers: 'Son: 360',
      step1: "360 ni ketma-ket tub sonlarga bo'lamiz: 360÷2=180, 180÷2=90, 90÷2=45",
      step2: '45÷3=15, 15÷3=5, 5÷5=1',
      result: '360 = 2³ · 3² · 5¹',
    },
    tips: "Tub sonlar cheksiz ko'pdir. Buni qadimgi yunon olimi Evklid eramizdan avvalgi 300-yillarda isbotlagan.",
  },
  {
    id: 'ekub-nima',
    title: "3. EKUB (Eng Katta Umumiy Bo'luvchi)",
    subtitle: "Barcha sonlarni bir vaqtda bo'la oladigan eng buyuk raqam",
    badge: 'Asosiy',
    content: [
      "Berilgan bir necha natural sonlarning har birini qoldiqsiz bo'ladigan natural sonlarning eng kattasi ularning **Eng Katta Umumiy Bo'luvchisi (EKUB)** deyiladi.",
      "Xalqaro adabiyotlarda EKUB — **GCD (Greatest Common Divisor)** deb belgilanadi.",
      "**Topish qoidasi:** Sonlar tub ko'paytuvchilarga ajratiladi. Har bir sonning kanonik yoyilmasida qatnashgan *umumiy* tub sonlarning *eng kichik ko'rsatkichi (darajasi)* olinadi va o'zaro ko'paytiriladi.",
    ],
    formula: "EKUB(a, b) = p₁^{min(α₁, β₁)} · p₂^{min(α₂, β₂)} · ... · pₙ^{min(αₙ, βₙ)}",
    example: {
      numbers: 'a = 72 va b = 120',
      step1: '72 = 2³ · 3²  hamda  120 = 2³ · 3¹ · 5¹',
      step2: 'Umumiylari: 2 va 3. Kichik darajalar: 2³ va 3¹',
      result: 'EKUB(72, 120) = 2³ · 3¹ = 8 · 3 = 24',
    },
    tips: "Agar berilgan sonlardan biri ikkinchisiga bo'linsa, ularning EKUBi kichik sonning o'ziga teng bo'ladi! Masalan: EKUB(15, 45) = 15.",
  },
  {
    id: 'ekuk-nima',
    title: '4. EKUK (Eng Kichik Umumiy Karrali)',
    subtitle: "Barcha sonlarga baravar bo'linadigan eng dastlabki marra",
    badge: 'Asosiy',
    content: [
      "Berilgan natural sonlarning har biriga qoldiqsiz bo'linadigan natural sonlarning eng kichigi ularning **Eng Kichik Umumiy Karralisi (EKUK)** deyiladi.",
      "Xalqaro adabiyotlarda EKUK — **LCM (Least Common Multiple)** deb yoziladi.",
      "**Topish qoidasi:** Berilgan sonlarning tub yoyilmalarida qatnashgan *barcha* tub asoslarning *eng katta ko'rsatkichi (darajasi)* olinadi va bir-biriga ko'paytiriladi.",
    ],
    formula: "EKUK(a, b) = p₁^{max(α₁, β₁)} · p₂^{max(α₂, β₂)} · ... · pₖ^{max(αₖ, βₖ)}",
    example: {
      numbers: 'a = 72 va b = 120',
      step1: '72 = 2³ · 3²  hamda  120 = 2³ · 3¹ · 5¹',
      step2: 'Barcha asoslarning katta darajalari: 2³, 3², 5¹',
      result: 'EKUK(72, 120) = 2³ · 3² · 5¹ = 8 · 9 · 5 = 360',
    },
    tips: "Agar bir son ikkinchisiga bo'linsa, ularning EKUKi katta songa teng bo'ladi! Masalan: EKUK(15, 45) = 45.",
  },
  {
    id: 'oltin-formula',
    title: '5. EKUB va EKUK ning Oltin Teoremasi',
    subtitle: "Ikkita son ko'paytmasi bilan bog'liq sehrli tenglik",
    badge: 'Oltin Qoida',
    content: [
      "Istalgan ikkita natural son a va b uchun ularning EKUBi va EKUKi ko'paytmasi shu sonlarning o'zaro ko'paytmasiga teng bo'ladi!",
      "Bu formula olimpiada masalalarida va amaliy hisoblashlarda juda katta qulaylik yaratadi: agar bittasi ma'lum bo'lsa, ikkinchisini bo'lish orqali topish mumkin.",
      "Diqqat: Ushbu qoida *faqat ikkita son* uchun mutlaq to'g'ri bo'lib, 3 ta yoki undan ortiq sonlar uchun umumiy holda to'g'ri kelmaydi.",
    ],
    formula: "EKUB(a, b) · EKUK(a, b) = a · b",
    example: {
      numbers: 'a = 24, b = 36',
      step1: 'EKUB(24, 36) = 12;  EKUK(24, 36) = 72',
      step2: 'EKUB · EKUK = 12 · 72 = 864',
      result: 'a · b = 24 · 36 = 864.  (864 = 864! Tenglik isbotlandi)',
    },
    tips: "Agar sizga a, b va ularning EKUBi berilgan bo'lsa: EKUK(a, b) = (a · b) / EKUB(a, b).",
  },
  {
    id: 'evklid-algoritmi',
    title: '6. Evklid Algoritmi (Katta Sonlar Uchun)',
    subtitle: "2300 yillik eng tezkor va oqlangan usul",
    badge: 'Super Algoritm',
    content: [
      "Agar sonlar juda katta bo'lsa (masalan, 1071 va 462), ularni tub ko'paytuvchilarga ajratish juda ko'p vaqt oladi. Buning o'rniga qadimgi yunon olimi Evklid usuli qo'llaniladi.",
      "**Asosiy qoida:** Agar a = b · q + r (bunda r — qoldiq) bo'lsa, u holda:\nEKUB(a, b) = EKUB(b, r).",
      "Katta sonni kichigiga bo'lamiz va qoldiqni topamiz. Keyin kichik sonni qoldiqqa bo'lamiz. Qoldiq 0 bo'lgandagi oxirgi nol bo'lmagan qoldiq sonlarning EKUBi bo'ladi!",
    ],
    formula: "EKUB(a, b) = EKUB(b, a mod b)  [a mod b = 0 bo'lguncha]",
    example: {
      numbers: 'a = 1071 va b = 462',
      step1: '1071 = 462 · 2 + 147  (qoldiq 147)\n462 = 147 · 3 + 21   (qoldiq 21)',
      step2: '147 = 21 · 7 + 0     (qoldiq 0!)',
      result: "Oxirgi nolmas qoldiq — 21. Demak, EKUB(1071, 462) = 21!",
    },
    tips: "Zamonaviy kompyuterlar va kriptografiya algoritmlari (masalan, RSA xavfsizlik shifri) EKUBni aynan Evklid algoritmi bilan mikrosekundlarda topadi.",
  },
  {
    id: 'amaliy-masalalar',
    title: '7. Hayotiy Amaliy Masalalar',
    subtitle: "Qachon EKUB, qachon esa EKUK kerak bo'ladi?",
    badge: 'Amaliyot',
    content: [
      "**EKUB qachon kerak?** Biror narsani teng bo'laklarga bo'lish, qismlarga ajratish, eng katta o'lchamdagi kvadrat plitkalar bilan xonani qoplash, sovg'a xaltalariga konfetlarni teng taqsimlash kerak bo'lganda.",
      "**EKUK qachon kerak?** Qachonki harakatlar takrorlansa: bir necha svetofor yoki mayoq yana qachon birga nur sochadi? Har 12 va 18 daqiqada yuradigan poyezdlar bekatda yana qachon uchrashadi? Turli o'lchamdagi g'ishtlardan eng kichik kub yasash.",
    ],
    formula: "Bo'lish va taqsimlash -> EKUB;  Takrorlanish va birlashish -> EKUK",
    example: {
      numbers: 'Masala: 2 ta poygachi aylanani 20 va 30 soniyada bosib o\'tadi.',
      step1: "Ular start chizig'idan bir vaqtda chiqishdi. Qachon yana startda uchrashadi?",
      step2: 'EKUK(20, 30) = 60 soniya.',
      result: "Javob: 60 soniyadan so'ng (1-poygachi 3 aylana, 2-poygachi 2 aylana aylanadi).",
    },
    tips: "Masala shartida 'eng ko'p nechtadan bo'lish mumkin' desa — EKUB; 'eng kamida necha vaqtdan so'ng yana uchrashadi' desa — EKUK qidiring!",
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: '18 va 24 sonlarining Eng Katta Umumiy Bo\'luvchisi (EKUB) nechaga teng?',
    options: ['3', '6', '12', '72'],
    correctIndex: 1,
    explanation: '18 = 2 · 3², 24 = 2³ · 3. Umumiylari: 2¹ · 3¹ = 6.',
    difficulty: 'Oson',
  },
  {
    id: 2,
    question: '15 va 20 sonlarining Eng Kichik Umumiy Karralisi (EKUK) qaysi?',
    options: ['30', '45', '60', '300'],
    correctIndex: 2,
    explanation: '15 = 3 · 5, 20 = 2² · 5. EKUK = 2² · 3 · 5 = 60.',
    difficulty: 'Oson',
  },
  {
    id: 3,
    question: "O'zaro tub bo'lgan ikki sonning EKUBi nechaga teng?",
    options: ['0', '1', 'Ularning ko\'paytmasiga', 'Aniqlab bo\'lmaydi'],
    correctIndex: 1,
    explanation: "Ta'rifga ko'ra, umumiy bo'luvchisi faqat 1 bo'lgan sonlar o'zaro tub sonlar deyiladi. Demak, EKUB har doim 1 ga teng.",
    difficulty: 'Oson',
  },
  {
    id: 4,
    question: 'Ikki sonning ko\'paytmasi 180 ga, ularning EKUBi 6 ga teng. Ularning EKUKini toping.',
    options: ['30', '36', '60', '1080'],
    correctIndex: 0,
    explanation: 'EKUB · EKUK = a · b formulasidan: EKUK = 180 / 6 = 30.',
    difficulty: "O'rta",
  },
  {
    id: 5,
    question: '8 va 12 sonlarining EKUBi va EKUKining yig\'indisi nechaga teng?',
    options: ['24', '28', '32', '36'],
    correctIndex: 1,
    explanation: 'EKUB(8, 12) = 4. EKUK(8, 12) = 24. Yig\'indisi: 4 + 24 = 28.',
    difficulty: "O'rta",
  },
  {
    id: 6,
    question: 'Uchta son: 12, 18 va 30 ning EKUBi nechaga teng?',
    options: ['2', '3', '6', '180'],
    correctIndex: 2,
    explanation: '12 = 2²·3, 18 = 2·3², 30 = 2·3·5. Hammada qatnashgan: 2¹ · 3¹ = 6.',
    difficulty: "O'rta",
  },
  {
    id: 7,
    question: 'Evklid algoritmi yordamida EKUB(84, 36) ni hisoblashda birinchi qoldiq necha bo\'ladi?',
    options: ['6', '12', '24', '48'],
    correctIndex: 1,
    explanation: '84 = 36 · 2 + 12. Qoldiq r = 12 bo\'ladi.',
    difficulty: "O'rta",
  },
  {
    id: 8,
    question: 'O\'lchamlari 48 m va 64 m bo\'lgan to\'g\'ri to\'rtburchak maydonga eng katta teng kvadrat plitkalar yotqizilmoqchi. Plitka tomoni necha metr bo\'lishi kerak?',
    options: ['8 m', '12 m', '16 m', '24 m'],
    correctIndex: 2,
    explanation: 'EKUB(48, 64) = 16 m. Eng katta kvadrat tomoni 16 metr bo\'ladi.',
    difficulty: 'Murakkab',
  },
  {
    id: 9,
    question: 'Agar a va b o\'zaro tub bo\'lsa, EKUK(a, b) nimaga teng?',
    options: ['1', 'a + b', 'a · b', '|a - b|'],
    correctIndex: 2,
    explanation: 'EKUB(a, b) = 1 bo\'lgani uchun, EKUK(a, b) = (a · b) / 1 = a · b bo\'ladi.',
    difficulty: 'Murakkab',
  },
  {
    id: 10,
    question: 'Uchta velosipedchi aylanma yo\'lni 15, 20 va 30 soniyada aylanib o\'tishadi. Ular yana necha soniyadan so\'ng startda birga uchrashadi?',
    options: ['30 soniya', '45 soniya', '60 soniya', '120 soniya'],
    correctIndex: 2,
    explanation: 'EKUK(15, 20, 30) = 60 soniya. Demak, 1 daqiqadan so\'ng.',
    difficulty: 'Murakkab',
  },
];
