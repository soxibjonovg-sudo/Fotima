export type ActiveTab = 'games' | 'theory' | 'gemini' | 'calculator';

export type GameId =
  | 'tug-of-war'
  | 'crossword'
  | 'speed-quiz'
  | 'bubble-pop'
  | 'boss-battle'
  | 'factor-tree'
  | 'venn-diagram'
  | 'euclid-maze'
  | 'race-track'
  | 'safe-cracker'
  | 'bomb-defusal'
  | 'scales-balance'
  | 'memory-cards'
  | 'tetris-drop'
  | 'beacon-sync'
  | 'rocket-launch';

export interface GameInfo {
  id: GameId;
  title: string;
  shortDesc: string;
  difficulty: 'Oson' | "O'rta" | 'Murakkab' | 'Olimpiada';
  category: 'Tezkor' | 'Mantiq' | 'Strategiya' | 'Vizual';
  icon: string;
  themeColor: string;
  bgType: 'arena' | 'chalkboard' | 'cyber' | 'underwater' | 'volcano' | 'forest' | 'nebula' | 'greek' | 'race' | 'vault' | 'tactical' | 'wood' | 'casino' | 'arcade' | 'nautical' | 'space';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  source?: 'gemini' | 'local-fallback';
}

export interface CrosswordClue {
  number: number;
  direction: 'across' | 'down';
  clue: string;
  answer: string;
  row: number;
  col: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'Oson' | "O'rta" | 'Murakkab';
}
