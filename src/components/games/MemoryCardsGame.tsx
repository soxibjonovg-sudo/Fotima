import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Layers, RotateCcw, Award, CheckCircle2 } from 'lucide-react';
import { playCorrectSound, playWrongSound, playWinFanfare, playClickSound } from '../../utils/audio';

interface CardItem {
  id: number;
  matchId: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryCardsGame: React.FC = () => {
  const initialPairs = [
    { matchId: 1, textA: 'EKUB(18, 24)', textB: '6' },
    { matchId: 2, textA: 'EKUK(4, 6)', textB: '12' },
    { matchId: 3, textA: 'EKUB(15, 25)', textB: '5' },
    { matchId: 4, textA: 'EKUK(5, 7)', textB: '35' },
    { matchId: 5, textA: 'EKUB(40, 60)', textB: '20' },
    { matchId: 6, textA: 'EKUK(8, 12)', textB: '24' },
  ];

  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [isWon, setIsWon] = useState<boolean>(false);

  const initGame = () => {
    const deck: CardItem[] = [];
    let idCounter = 1;

    initialPairs.forEach((p) => {
      deck.push({ id: idCounter++, matchId: p.matchId, content: p.textA, isFlipped: false, isMatched: false });
      deck.push({ id: idCounter++, matchId: p.matchId, content: p.textB, isFlipped: false, isMatched: false });
    });

    setCards(deck.sort(() => Math.random() - 0.5));
    setFlippedIds([]);
    setMoves(0);
    setIsWon(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (card: CardItem) => {
    if (card.isFlipped || card.isMatched || flippedIds.length >= 2) return;
    playClickSound();

    const newFlipped = [...flippedIds, card.id];
    setCards((prev) => prev.map((c) => (c.id === card.id ? { ...c, isFlipped: true } : c)));
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const card1 = cards.find((c) => c.id === newFlipped[0])!;
      const card2 = card;

      if (card1.matchId === card2.matchId) {
        playCorrectSound();
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === card1.id || c.id === card2.id ? { ...c, isMatched: true } : c
            )
          );
          setFlippedIds([]);

          // Check if all matched
          const unMatchedLeft = cards.filter(
            (c) => !c.isMatched && c.id !== card1.id && c.id !== card2.id
          );
          if (unMatchedLeft.length === 0) {
            setIsWon(true);
            playWinFanfare();
            confetti({ particleCount: 140, spread: 80 });
          }
        }, 500);
      } else {
        playWrongSound();
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === card1.id || c.id === card2.id ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedIds([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 bg-slate-900/80 border border-fuchsia-500/30 p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-fuchsia-500/20 text-fuchsia-400 rounded-xl border border-fuchsia-500/30">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Xotira Kartalari
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
                12 ta Karta
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              EKUB/EKUK ifodalari va ularning to'g'ri javoblarini ochib juftlang.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-slate-400">Urinishlar:</span>
            <div className="text-xl font-mono font-bold text-fuchsia-400">{moves}</div>
          </div>
          <button
            onClick={initGame}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 text-xs font-semibold"
          >
            <RotateCcw className="w-4 h-4" />
            Qayta
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-6">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card)}
            disabled={card.isMatched || card.isFlipped}
            className={`h-28 md:h-32 rounded-2xl p-2 font-mono font-bold text-base md:text-lg transition-all duration-300 flex items-center justify-center text-center shadow-lg transform active:scale-95 ${
              card.isMatched
                ? 'bg-emerald-950/60 border-2 border-emerald-500 text-emerald-300 opacity-80'
                : card.isFlipped
                ? 'bg-gradient-to-br from-fuchsia-600 to-indigo-700 border-2 border-fuchsia-400 text-white scale-105 shadow-fuchsia-500/40'
                : 'bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-400 hover:border-fuchsia-500/50'
            }`}
          >
            {card.isFlipped || card.isMatched ? (
              <span>{card.content}</span>
            ) : (
              <span className="text-2xl text-slate-600">❓</span>
            )}
          </button>
        ))}
      </div>

      {isWon && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-fuchsia-950 to-purple-950 border-2 border-fuchsia-400 text-center shadow-2xl animate-fade-in">
          <Award className="w-12 h-12 text-fuchsia-400 mx-auto mb-2 animate-bounce" />
          <h3 className="text-2xl font-bold text-white mb-1">Barcha Juftliklar Topildi! 🌟</h3>
          <p className="text-xs text-fuchsia-200">
            Siz {moves} ta harakatda xotirangiz va hisob-kitobingizni isbotladingiz!
          </p>
        </div>
      )}
    </div>
  );
};
