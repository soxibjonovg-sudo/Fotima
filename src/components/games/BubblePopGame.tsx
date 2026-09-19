import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, RotateCcw, Target } from 'lucide-react';
import { gcd, lcm } from '../../utils/math';
import { playPopSound, playCorrectSound, playWrongSound, playWinFanfare } from '../../utils/audio';

interface Bubble {
  id: number;
  val: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

export const BubblePopGame: React.FC = () => {
  const [targetGcd, setTargetGcd] = useState<number>(6);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [feedback, setFeedback] = useState<string | null>(null);

  const colors = [
    'from-cyan-500 to-blue-600',
    'from-teal-400 to-emerald-600',
    'from-indigo-500 to-purple-600',
    'from-amber-400 to-orange-600',
    'from-pink-500 to-rose-600',
  ];

  // Spawn fresh round of bubbles with guaranteed valid pairs
  const spawnBubbles = (target: number) => {
    // Generate valid pairs whose gcd is target
    const validPairs = [
      [target * 2, target * 3],
      [target * 3, target * 5],
      [target * 4, target * 7],
    ];
    const chosenPair = validPairs[Math.floor(Math.random() * validPairs.length)];
    const distractors = [target * 2 + 1, target + 3, target * 5 - 1, target * 4 + 2, 7, 11, 13];

    const allVals = [...chosenPair, ...distractors.slice(0, 6)].sort(() => Math.random() - 0.5);

    const newBubbles: Bubble[] = allVals.map((val, idx) => ({
      id: Date.now() + idx,
      val,
      x: (idx * 22) % 80 + 10,
      y: (idx * 27) % 70 + 15,
      size: 64 + (val % 20),
      color: colors[idx % colors.length],
    }));

    setBubbles(newBubbles);
    setSelectedIds([]);
  };

  useEffect(() => {
    const targets = [4, 6, 8, 10, 12, 15];
    const t = targets[(round - 1) % targets.length];
    setTargetGcd(t);
    spawnBubbles(t);
  }, [round]);

  const handleBubbleClick = (b: Bubble) => {
    playPopSound(1.2);

    if (selectedIds.includes(b.id)) {
      setSelectedIds(selectedIds.filter((id) => id !== b.id));
      return;
    }

    if (selectedIds.length === 0) {
      setSelectedIds([b.id]);
    } else if (selectedIds.length === 1) {
      const firstId = selectedIds[0];
      const firstBubble = bubbles.find((item) => item.id === firstId);
      if (!firstBubble) return;

      const calcGcd = gcd(firstBubble.val, b.val);

      if (calcGcd === targetGcd) {
        playCorrectSound();
        setScore((s) => s + 150);
        setFeedback(`Ajoyib! EKUB(${firstBubble.val}, ${b.val}) = ${targetGcd} 🎉`);
        setBubbles(bubbles.filter((item) => item.id !== firstId && item.id !== b.id));
        setSelectedIds([]);

        if (round >= 5) {
          playWinFanfare();
          confetti({ particleCount: 100, spread: 70 });
        }

        setTimeout(() => {
          setRound((r) => r + 1);
          setFeedback(null);
        }, 1200);
      } else {
        playWrongSound();
        setFeedback(`Noto'g'ri: EKUB(${firstBubble.val}, ${b.val}) = ${calcGcd}, maqsad esa: ${targetGcd}`);
        setSelectedIds([]);
        setTimeout(() => setFeedback(null), 1500);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 bg-slate-900/80 border border-teal-500/30 p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-500/20 text-teal-300 rounded-xl border border-teal-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              EKUB / EKUK Pufaklari
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Bosqich {round} / 5
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              EKUBi nishonga teng bo'lgan ikkita pufakni tanlab yoring!
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-slate-400">Ball:</span>
            <div className="text-xl font-mono font-bold text-teal-300">{score}</div>
          </div>
        </div>
      </div>

      {/* Target Mission Bar */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-teal-950/80 via-slate-900/90 to-cyan-950/80 border border-teal-500/40 text-center shadow-lg">
        <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-wider text-teal-400 font-bold mb-1">
          <Target className="w-4 h-4" />
          Hozirgi Vazifa:
        </div>
        <div className="text-2xl md:text-3xl font-extrabold text-white">
          EKUB(A, B) = <span className="text-teal-300 underline underline-offset-4">{targetGcd}</span>
        </div>
        <div className="text-xs text-slate-400 mt-1">
          Ikkala soni ham {targetGcd} ga qoldiqsiz bo'linadigan va boshqa umumiy bo'luvchisi bo'lmagan 2 ta pufakni bosing
        </div>
      </div>

      {/* Bubble Aquarium Stage */}
      <div className="relative h-96 w-full rounded-3xl bg-gradient-to-b from-[#051c2c]/90 via-[#04283d]/80 to-[#02111d]/90 border border-teal-500/30 overflow-hidden shadow-2xl p-6">
        {bubbles.map((b) => {
          const isSelected = selectedIds.includes(b.id);
          return (
            <button
              key={b.id}
              onClick={() => handleBubbleClick(b)}
              className={`absolute rounded-full flex items-center justify-center font-bold text-lg md:text-xl font-mono shadow-xl transition-all duration-300 transform active:scale-90 animate-bounce ${
                isSelected
                  ? 'ring-4 ring-white scale-110 shadow-teal-400/50'
                  : 'hover:scale-105'
              } bg-gradient-to-br ${b.color} border border-white/40 text-white`}
              style={{
                left: `${b.x}%`,
                top: `${b.y}%`,
                width: `${b.size}px`,
                height: `${b.size}px`,
                animationDuration: `${3 + (b.val % 3)}s`,
              }}
            >
              {b.val}
            </button>
          );
        })}

        {feedback && (
          <div className="absolute bottom-4 inset-x-4 mx-auto max-w-md p-3 rounded-xl bg-slate-900/95 border border-teal-500 text-center text-sm font-semibold text-teal-300 shadow-2xl backdrop-blur-md">
            {feedback}
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-between items-center text-xs text-slate-400">
        <span>Tanlangan pufaklar: {selectedIds.length} / 2</span>
        <button
          onClick={() => spawnBubbles(targetGcd)}
          className="text-teal-400 hover:underline flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Pufaklarni qayta joylashtirish
        </button>
      </div>
    </div>
  );
};
