import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Swords, RefreshCw, Trophy, Sparkles, User, Bot } from 'lucide-react';
import { generateDynamicProblem, DynamicProblem } from '../../utils/math';
import { playCorrectSound, playWrongSound, playTugSound, playWinFanfare } from '../../utils/audio';

export const TugOfWarGame: React.FC = () => {
  const [position, setPosition] = useState<number>(0); // -5 (Bot wins) to +5 (Player wins)
  const [currentProblem, setCurrentProblem] = useState<DynamicProblem>(() => generateDynamicProblem('easy'));
  const [winner, setWinner] = useState<'player' | 'bot' | null>(null);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [tugEffect, setTugEffect] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    if (position >= 5 && !winner) {
      setWinner('player');
      playWinFanfare();
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    } else if (position <= -5 && !winner) {
      setWinner('bot');
      playWrongSound();
    }
  }, [position, winner]);

  const handleAnswer = (chosen: number) => {
    if (winner) return;

    if (chosen === currentProblem.correctAnswer) {
      playCorrectSound();
      playTugSound();
      setTugEffect('left');
      setTimeout(() => setTugEffect(null), 400);

      setPosition((prev) => Math.min(5, prev + 1));
      setScore((s) => s + 100 + streak * 20);
      setStreak((st) => st + 1);
      setFeedback("Barakalla! Arqon siz tomon siljidi (+1) 🎯");

      const nextLevel = streak > 4 ? 'hard' : streak > 2 ? 'medium' : 'easy';
      setCurrentProblem(generateDynamicProblem(nextLevel));
    } else {
      playWrongSound();
      playTugSound();
      setTugEffect('right');
      setTimeout(() => setTugEffect(null), 400);

      setPosition((prev) => Math.max(-5, prev - 1));
      setStreak(0);
      setFeedback(`Xato! To'g'ri javob: ${currentProblem.correctAnswer}. Arqon raqib tomonga tortildi (-1)`);

      setTimeout(() => {
        setCurrentProblem(generateDynamicProblem('easy'));
      }, 1200);
    }
  };

  const restartGame = () => {
    setPosition(0);
    setWinner(null);
    setStreak(0);
    setFeedback(null);
    setCurrentProblem(generateDynamicProblem('easy'));
  };

  // Calculate rope knot position percentage (0% = player side, 100% = bot side, 50% = center)
  // position ranges from -5 to +5 -> percentage = 50 - (position * 8)
  const knotPercent = 50 - position * 7.5;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 bg-slate-900/70 border border-slate-700/60 backdrop-blur-md p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <Swords className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Arqon Tortishish Jangi
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Jonli Matematik Jang
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Har bir to'g'ri EKUB/EKUK yechimi arqonni siz tomon 1 qadam tortadi!
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-slate-400">Ball:</div>
            <div className="text-xl font-mono font-bold text-amber-400">{score}</div>
          </div>
          {streak > 1 && (
            <div className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-lg text-amber-300 text-xs font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              {streak}x Zanjir!
            </div>
          )}
        </div>
      </div>

      {/* Tug Arena Stage */}
      <div className="relative mb-6 bg-gradient-to-b from-stone-900/90 to-black/90 border border-amber-600/30 rounded-3xl p-6 overflow-hidden shadow-2xl">
        {/* Tension arena floor */}
        <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:20px_20px] opacity-10" />

        {/* Competitor Avatars & Rope */}
        <div className="relative z-10 flex items-center justify-between mb-4">
          {/* Player side */}
          <div className={`flex flex-col items-center transition-transform ${tugEffect === 'left' ? 'scale-110' : ''}`}>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 border-2 border-blue-400">
              <User className="w-8 h-8" />
            </div>
            <span className="mt-2 text-sm font-bold text-blue-400">Siz (Matematik)</span>
            <span className="text-xs font-mono text-blue-300/80">Quvvat: {Math.max(0, 5 + position)}</span>
          </div>

          {/* Center Flag Indicator */}
          <div className="text-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400/80 mb-1">
              {position === 0 ? 'Teng Kurash' : position > 0 ? `Siz +${position} oldindasiz!` : `Raqib +${Math.abs(position)} oldinda!`}
            </div>
            <div className="text-xs text-slate-500 font-mono">G'alaba uchun: 5 ochko</div>
          </div>

          {/* Bot side */}
          <div className={`flex flex-col items-center transition-transform ${tugEffect === 'right' ? 'scale-110' : ''}`}>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-red-500/30 border-2 border-red-400">
              <Bot className="w-8 h-8" />
            </div>
            <span className="mt-2 text-sm font-bold text-red-400">Raqib Robot</span>
            <span className="text-xs font-mono text-red-300/80">Quvvat: {Math.max(0, 5 - position)}</span>
          </div>
        </div>

        {/* The Physical Rope Visualizer */}
        <div className="relative py-8 px-4">
          {/* Rope line */}
          <div className="h-4 w-full bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-800 rounded-full border border-amber-400/40 shadow-inner flex items-center relative">
            {/* Center target line */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-10 bg-white/40 rounded-full" />

            {/* Red Knot / Center Ribbon */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500 ease-out flex flex-col items-center"
              style={{ left: `${knotPercent}%` }}
            >
              <div className="w-8 h-8 bg-red-600 border-2 border-white rounded-full shadow-lg shadow-red-600/60 flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-yellow-300 rounded-full animate-ping" />
              </div>
              <div className="w-1.5 h-6 bg-red-500 rounded-b shadow" />
            </div>
          </div>

          {/* Tug distance tick marks */}
          <div className="flex justify-between mt-2 px-1 text-[10px] font-mono text-slate-500">
            <span>🔵 -5 (Yutqizish)</span>
            <span>-3</span>
            <span>-1</span>
            <span className="text-amber-400 font-bold">0 (Markaz)</span>
            <span>+1</span>
            <span>+3</span>
            <span>+5 (G'alaba) 🏆</span>
          </div>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div className="text-center py-2 px-4 rounded-xl bg-slate-800/80 border border-slate-700 text-sm font-medium text-amber-300 animate-fade-in">
            {feedback}
          </div>
        )}
      </div>

      {/* Math Question Panel */}
      {!winner ? (
        <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-6 backdrop-blur-md text-center shadow-xl">
          <div className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-500/30">
            Jang Vazifasi
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {currentProblem.type}({currentProblem.numA}, {currentProblem.numB})
          </h3>
          <p className="text-sm text-slate-400 mb-6">
            Ushbu sonlarning {currentProblem.type === 'EKUB' ? "Eng Katta Umumiy Bo'luvchisini" : "Eng Kichik Umumiy Karralisini"} toping:
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-xl mx-auto">
            {currentProblem.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(opt)}
                className="py-4 px-6 rounded-xl bg-slate-800/90 hover:bg-amber-600 hover:text-white border border-slate-700 hover:border-amber-400 text-xl font-bold font-mono text-amber-300 transition-all transform active:scale-95 shadow-md"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Winner Modal / Banner */
        <div className="bg-gradient-to-br from-slate-900 via-stone-900 to-black border-2 border-amber-500/80 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Trophy className="w-10 h-10 animate-bounce" />
          </div>
          <h3 className="text-3xl font-extrabold text-white mb-2">
            {winner === 'player' ? "G'ALABA! SIZ CHEMPIONSIZ! 🥇" : "Raqib g'olib bo'ldi!"}
          </h3>
          <p className="text-slate-300 max-w-md mx-auto mb-6 text-sm">
            {winner === 'player'
              ? `Ajoyib matematik mahorat! Jami ${score} ball jamg'ardingiz va arqonni to'liq o'z tomoningizga tortib oldingiz.`
              : "Bu safar raqib tezroq bo'ldi. EKUB va EKUK qoidalarini mustahkamlab, qaytadan urinib ko'ring!"}
          </p>
          <button
            onClick={restartGame}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 text-white font-bold hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-amber-600/30"
          >
            <RefreshCw className="w-5 h-5" />
            Yangi Jangni Boshlash
          </button>
        </div>
      )}
    </div>
  );
};
