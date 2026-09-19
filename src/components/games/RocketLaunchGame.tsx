import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Rocket, RotateCcw, Award, Flame, Zap } from 'lucide-react';
import { playCorrectSound, playWrongSound, playWinFanfare, playClickSound } from '../../utils/audio';

export const RocketLaunchGame: React.FC = () => {
  // Problem:
  // A = 2^3 · 3^2 · 5^1
  // B = 2^1 · 3^3 · 7^1
  // Mission: Calculate EKUK (LCM) exponent requirements:
  // For EKUK: take MAX degree of each prime!
  // degree of 2: max(3, 1) = 3
  // degree of 3: max(2, 3) = 3
  // degree of 5: max(1, 0) = 1
  // degree of 7: max(0, 1) = 1
  const correctExponents = {
    p2: 3,
    p3: 3,
    p5: 1,
    p7: 1,
  };

  const [userExponents, setUserExponents] = useState({
    p2: 0,
    p3: 0,
    p5: 0,
    p7: 0,
  });

  const [isLaunched, setIsLaunched] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleLaunch = () => {
    playClickSound();

    const isMatch =
      userExponents.p2 === correctExponents.p2 &&
      userExponents.p3 === correctExponents.p3 &&
      userExponents.p5 === correctExponents.p5 &&
      userExponents.p7 === correctExponents.p7;

    if (isMatch) {
      playCorrectSound();
      playWinFanfare();
      setIsLaunched(true);
      setFeedback("RAKETA FAZOGA MUVAOFFAQ QILINDI! 🚀🌌 EKUK formulasini maksimal darajalar orqali a'lo darajada yechdingiz!");
      confetti({ particleCount: 160, spread: 90, origin: { y: 0.7 } });
    } else {
      playWrongSound();
      setFeedback("Reaktor kuchi yetarli emas! Eslatma: EKUK uchun har bir tub sonning eng KATTA darajasi olinadi!");
    }
  };

  const handleReset = () => {
    setUserExponents({ p2: 0, p3: 0, p5: 0, p7: 0 });
    setIsLaunched(false);
    setFeedback(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 bg-slate-900/80 border border-indigo-500/30 p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Kosmik Raketa Parvozi
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Olimpiada Darajasi
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Kanonik yoyilma qoidasi: EKUK uchun har bir tub sonning eng KATTA darajasi tanlanadi!
            </p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 text-xs font-semibold"
        >
          <RotateCcw className="w-4 h-4" />
          Qayta O'rnatish
        </button>
      </div>

      {/* Target Mission Formula Box */}
      <div className="p-5 rounded-3xl bg-indigo-950/40 border border-indigo-500/40 mb-6 text-center">
        <div className="text-xs font-mono uppercase tracking-wider text-indigo-400 mb-2">
          Ikkita kosmik koordinata soni berilgan:
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 font-mono text-xl md:text-2xl font-bold">
          <div className="px-4 py-2 rounded-xl bg-black/40 border border-indigo-500/40 text-cyan-300">
            A = 2³ · 3² · 5¹
          </div>
          <span className="text-indigo-400 font-bold">va</span>
          <div className="px-4 py-2 rounded-xl bg-black/40 border border-indigo-500/40 text-pink-300">
            B = 2¹ · 3³ · 7¹
          </div>
        </div>
        <div className="text-xs text-slate-400 mt-3 font-mono">
          Vazifa: <strong>EKUK(A, B) = 2<sup>?</sup> · 3<sup>?</sup> · 5<sup>?</sup> · 7<sup>?</sup></strong> yoqilg'i darajalarini moslang.
        </div>
      </div>

      {/* Launchpad Stage */}
      <div className="relative bg-gradient-to-b from-[#0b0c2a] via-[#050614] to-[#020208] border border-indigo-500/30 rounded-3xl p-6 md:p-8 min-h-[300px] shadow-2xl mb-6 overflow-hidden flex flex-col items-center justify-center">
        {/* Deep space stars */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Animated Rocket */}
        <div
          className={`text-6xl md:text-7xl transition-all duration-1000 transform ${
            isLaunched
              ? '-translate-y-96 scale-50 opacity-0'
              : 'hover:scale-105'
          }`}
        >
          🚀
        </div>

        {isLaunched && (
          <div className="absolute inset-x-0 bottom-8 flex flex-col items-center animate-bounce">
            <Flame className="w-12 h-12 text-orange-500 fill-orange-500" />
            <span className="text-sm font-bold text-amber-400 font-mono">Gipersakrash Boshlandi! 🌌</span>
          </div>
        )}
      </div>

      {/* Fuel Reactor Exponent Dials */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Prime 2 */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/40 text-center">
          <span className="text-xs font-mono uppercase text-indigo-400 block mb-1">Tub Son: 2</span>
          <div className="text-xl font-mono font-bold text-white mb-2">
            2<sup>{userExponents.p2}</sup>
          </div>
          <div className="flex items-center justify-center gap-2">
            {[0, 1, 2, 3, 4].map((d) => (
              <button
                key={d}
                onClick={() => setUserExponents({ ...userExponents, p2: d })}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all ${
                  userExponents.p2 === d
                    ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/50'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Prime 3 */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/40 text-center">
          <span className="text-xs font-mono uppercase text-indigo-400 block mb-1">Tub Son: 3</span>
          <div className="text-xl font-mono font-bold text-white mb-2">
            3<sup>{userExponents.p3}</sup>
          </div>
          <div className="flex items-center justify-center gap-2">
            {[0, 1, 2, 3, 4].map((d) => (
              <button
                key={d}
                onClick={() => setUserExponents({ ...userExponents, p3: d })}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all ${
                  userExponents.p3 === d
                    ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/50'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Prime 5 */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/40 text-center">
          <span className="text-xs font-mono uppercase text-indigo-400 block mb-1">Tub Son: 5</span>
          <div className="text-xl font-mono font-bold text-white mb-2">
            5<sup>{userExponents.p5}</sup>
          </div>
          <div className="flex items-center justify-center gap-2">
            {[0, 1, 2, 3].map((d) => (
              <button
                key={d}
                onClick={() => setUserExponents({ ...userExponents, p5: d })}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all ${
                  userExponents.p5 === d
                    ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/50'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Prime 7 */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/40 text-center">
          <span className="text-xs font-mono uppercase text-indigo-400 block mb-1">Tub Son: 7</span>
          <div className="text-xl font-mono font-bold text-white mb-2">
            7<sup>{userExponents.p7}</sup>
          </div>
          <div className="flex items-center justify-center gap-2">
            {[0, 1, 2, 3].map((d) => (
              <button
                key={d}
                onClick={() => setUserExponents({ ...userExponents, p7: d })}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all ${
                  userExponents.p7 === d
                    ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/50'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl mb-6 text-center text-xs font-bold ${
            isLaunched
              ? 'bg-emerald-950 border border-emerald-500 text-emerald-300'
              : 'bg-red-950 border border-red-500 text-red-300'
          }`}
        >
          {feedback}
        </div>
      )}

      {/* Launch Action */}
      <div className="flex justify-center">
        <button
          onClick={handleLaunch}
          disabled={isLaunched}
          className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm hover:brightness-110 shadow-lg shadow-indigo-600/30 active:scale-95 disabled:opacity-50"
        >
          <Rocket className="w-4 h-4" />
          Raketani Fazoga Uchirish 🚀
        </button>
      </div>
    </div>
  );
};
