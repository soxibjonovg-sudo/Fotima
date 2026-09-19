export interface CrosswordItem {
  id: number;
  word: string;
  clue: string;
  direction: 'across' | 'down';
  row: number;
  col: number;
}

// 10x10 Crossword grid layout
export const CROSSWORD_ITEMS: CrosswordItem[] = [
  {
    id: 1,
    word: 'EKUB',
    clue: "Eng Katta Umumiy Bo'luvchi so'zlarining bosh harflaridan tuzilgan qisqartma.",
    direction: 'across',
    row: 1,
    col: 2,
  },
  {
    id: 2,
    word: 'EVKLID',
    clue: "Qoldiq orqali EKUBni eng tezkor topish algoritmini kashf etgan qadimgi yunon matematigi.",
    direction: 'across',
    row: 3,
    col: 1,
  },
  {
    id: 3,
    word: 'TUB',
    clue: "Faqat 1 ga va o'ziga qoldiqsiz bo'linadigan 1 dan katta son.",
    direction: 'across',
    row: 5,
    col: 3,
  },
  {
    id: 4,
    word: 'KARRALI',
    clue: "Berilgan songa qoldiqsiz bo'linadigan son (masalan: 12, 18, 24 sonlari 6 ning ...sidir).",
    direction: 'across',
    row: 7,
    col: 0,
  },
  {
    id: 5,
    word: 'OLTIN',
    clue: "EKUB(a,b) · EKUK(a,b) = a · b formulasining mashhur nomi (... qoida).",
    direction: 'across',
    row: 9,
    col: 2,
  },
  {
    id: 6,
    word: 'EKUK',
    clue: "Eng Kichik Umumiy Karrali iborasining rasmiy qisqartmasi.",
    direction: 'down',
    row: 1,
    col: 2,
  },
  {
    id: 7,
    word: 'BIR',
    clue: "O'zaro tub bo'lgan istalgan ikki sonning EKUBi nechaga teng?",
    direction: 'down',
    row: 4,
    col: 5,
  },
  {
    id: 8,
    word: 'DARAXT',
    clue: "Sonlarni tub ko'paytuvchilarga ajratishda shoxlanuvchi ko'rinish (... ko'rinishi).",
    direction: 'down',
    row: 3,
    col: 8,
  },
];
