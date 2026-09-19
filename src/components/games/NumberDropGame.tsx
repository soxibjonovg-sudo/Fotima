import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Blocks, RotateCcw, Trophy, Zap } from 'lucide-react';
import { gcd } from '../../utils/math';
import { playCorrectSound, playWrongSound, playPopSound, playWinFanfare, playClickSound } from '../../utils/audio';

interface Block {
  id: number;
  val: number;
}

export const NumberDropGame: React.FC = () => {
  const initialNumbers = [12, 18, 24, 30, 36, 45, 60, 75, 90, 15, 20, 28, 42, 56, 70, 84];

  const [blocks, setBlocks] = useState<Block[]>(() =>
    initialNumbers.map((val, idx) => ({ id: idx + 1, val }))
  );
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);
  const [message, setMessage] = useState<string | null>(null);

  const handleBlockClick = (b: Block) => {
    playClickSound();

    if (selectedIds.includes(b.id)) {
      setSelectedIds(selectedIds.filter((id) => id !== b.id));
      return;
    }

    if (selectedIds.length === 0) {
      setSelectedIds([b.id]);
    } else if (selectedIds.length === 1) {
      const first = blocks.find((item) => item.id === selectedIds[0])!;
      const second = b;
      const calcGcd = gcd(first.val, second.val);

      if (calcGcd > 1) {
        playPopSound(1.4);
        playCorrectSound();
        const earned = calcGcd * 20;
        setScore((s) => s + earned);
        setMessage(`Portlash! EKUB(${first.val}, ${second.val}) = ${calcGcd}! (+${earned} ball)`);

        // Remove the 2 matched blocks and add fresh ones
        const remaining = blocks.filter((item) => item.id !== first.id && item.id !== second.id);
        const freshNums = [
          Math.floor(Math.random() * 50) + 10,
          Math.floor(Math.random() * 50) + 10,
        ];
        const newBlocks = [
          ...remaining,
          { id: Date.now() + 1, val: freshNums[0] },
          { id: Date.now() + 2, val: freshNums[1] },
        ];

        setBlocks(newBlocks);
        setSelectedIds([]);

        if (score + earned >= 500) {
          playWinFanfare();
          confetti({ particleCount: 120, spread: 70 });
        }
      } else {
        playWrongSound();
        setMessage(`O'zaro tub! EKUB(${first.val}, ${second.val}) = 1. Umumiy bo'luvchiga ega bloklarni tanlang.`);
        setSelectedIds([]);
      }
    }
  };

  const handleReset = () => {
    setBlocks(initialNumbers.map((val, idx) => ({ id: idx + 1, val })));
    setSelectedIds([]);
    setScore(0);
    setMessage(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 bg-slate-900/80 border border-cyan-500/30 p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/30">
            <Blocks className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Raqamlar Qulashi (Tetris Drop)
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                EKUB Portlatish
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Umumiy bo'luvchisi (EKUB {'>'} 1) bo'lgan 2 ta blokni bosing va ularni portlating!
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-slate-400">Ball:</span>
            <div className="text-xl font-mono font-bold text-cyan-400">{score}</div>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 text-xs font-semibold"
          >
            <RotateCcw className="w-4 h-4" />
            Tozalash
          </button>
        </div>
      </div>

      {/* Grid of Blocks */}
      <div className="bg-gradient-to-b from-[#091b29] to-[#040e17] border border-cyan-500/40 rounded-3xl p-6 md:p-8 shadow-2xl mb-6">
        <div className="grid grid-cols-4 gap-3 md:gap-4 max-w-lg mx-auto">
          {blocks.map((b) => {
            const isSelected = selectedIds.includes(b.id);
            return (
              <button
                key={b.id}
                onClick={() => handleBlockClick(b)}
                className={`h-16 md:h-20 rounded-2xl font-mono font-bold text-lg md:text-xl transition-all shadow-lg transform active:scale-95 flex items-center justify-center ${
                  isSelected
                    ? 'bg-amber-400 text-black ring-4 ring-white scale-105 shadow-amber-400/50'
                    : 'bg-gradient-to-br from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white border border-cyan-400/40 shadow-cyan-900/50'
                }`}
              >
                {b.val}
              </button>
            );
          })}
        </div>

        {message && (
          <div className="mt-6 p-3 rounded-xl bg-slate-900/90 border border-cyan-500/50 text-center text-xs font-mono text-cyan-300 max-w-md mx-auto">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};
