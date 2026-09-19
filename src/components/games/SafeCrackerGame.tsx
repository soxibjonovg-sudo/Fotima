import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { KeyRound, Lock, Unlock, RotateCcw, Award, ShieldCheck } from 'lucide-react';
import { gcd, lcm } from '../../utils/math';
import { playCorrectSound, playWrongSound, playWinFanfare, playClickSound } from '../../utils/audio';

export const SafeCrackerGame: React.FC = () => {
  const [pinInputs, setPinInputs] = useState<[string, string, string]>(['', '', '']);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Puzzle dials:
  // Dial 1: EKUB(48, 72) -> 24
  // Dial 2: EKUK(10, 15) -> 30
  // Dial 3: a=12, b=18 bo'lsa, (a · b) / EKUK(12,18) = EKUB(12,18) -> 6
  const correctDials = [24, 30, 6];

  const handleInputChange = (idx: number, val: string) => {
    playClickSound();
    const next: [string, string, string] = [pinInputs[0], pinInputs[1], pinInputs[2]];
    next[idx] = val;
    setPinInputs(next);
    setFeedback(null);
  };

  const handleUnlockAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    const d1 = parseInt(pinInputs[0], 10);
    const d2 = parseInt(pinInputs[1], 10);
    const d3 = parseInt(pinInputs[2], 10);

    if (d1 === correctDials[0] && d2 === correctDials[1] && d3 === correctDials[2]) {
      setIsUnlocked(true);
      playWinFanfare();
      confetti({ particleCount: 150, spread: 85, origin: { y: 0.6 } });
      setFeedback("Seyf ochildi! Oltin matematik qoidalar yordam berdi! 💰");
    } else {
      playWrongSound();
      const mistakes: string[] = [];
      if (d1 !== correctDials[0]) mistakes.push("1-qulf");
      if (d2 !== correctDials[1]) mistakes.push("2-qulf");
      if (d3 !== correctDials[2]) mistakes.push("3-qulf");
      setFeedback(`Noto'g'ri kod! (${mistakes.join(', ')} xato). Qayta hisoblang.`);
    }
  };

  const handleReset = () => {
    setPinInputs(['', '', '']);
    setIsUnlocked(false);
    setFeedback(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 bg-slate-900/80 border border-slate-700/60 p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-700 text-slate-300 rounded-xl border border-slate-600">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Seyf Qulfini Ochish
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-700 text-slate-300 border border-slate-600">
                3 Bosqichli Shifr
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Har bir qulfning matematik formulasini yechib, seyfni oching.
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

      {/* Safe Visualizer */}
      <div className="bg-gradient-to-b from-[#111827] via-[#0b1120] to-[#030712] border-4 border-slate-700 rounded-3xl p-6 md:p-10 shadow-2xl mb-6 relative overflow-hidden">
        {/* Metal Bolts */}
        <div className="absolute top-4 left-4 w-4 h-4 rounded-full bg-slate-600 border border-slate-400 shadow-inner" />
        <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-slate-600 border border-slate-400 shadow-inner" />
        <div className="absolute bottom-4 left-4 w-4 h-4 rounded-full bg-slate-600 border border-slate-400 shadow-inner" />
        <div className="absolute bottom-4 right-4 w-4 h-4 rounded-full bg-slate-600 border border-slate-400 shadow-inner" />

        {/* Central Lock Handle */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div
            className={`w-28 h-28 rounded-full border-4 flex items-center justify-center transition-all duration-700 shadow-2xl ${
              isUnlocked
                ? 'border-emerald-400 bg-emerald-950/40 text-emerald-400 shadow-emerald-500/40 rotate-90'
                : 'border-slate-500 bg-slate-800 text-slate-400 shadow-black'
            }`}
          >
            {isUnlocked ? <Unlock className="w-12 h-12 animate-pulse" /> : <Lock className="w-12 h-12" />}
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400 mt-2 font-bold">
            {isUnlocked ? 'OCHIQ (UNLOCKED)' : 'QULFLANGAN (LOCKED)'}
          </span>
        </div>

        {/* 3 Dials Grid */}
        <form onSubmit={handleUnlockAttempt}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Dial 1 */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700 text-center">
              <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1">
                1-QULF KODI:
              </span>
              <div className="text-sm text-slate-300 font-mono mb-3">
                EKUB(48, 72) = ?
              </div>
              <input
                type="number"
                placeholder="Kod"
                disabled={isUnlocked}
                value={pinInputs[0]}
                onChange={(e) => handleInputChange(0, e.target.value)}
                className="w-full p-3 text-center text-xl font-bold font-mono bg-slate-800 border border-slate-600 rounded-xl focus:border-amber-400 outline-none text-amber-300"
              />
            </div>

            {/* Dial 2 */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700 text-center">
              <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                2-QULF KODI:
              </span>
              <div className="text-sm text-slate-300 font-mono mb-3">
                EKUK(10, 15) = ?
              </div>
              <input
                type="number"
                placeholder="Kod"
                disabled={isUnlocked}
                value={pinInputs[1]}
                onChange={(e) => handleInputChange(1, e.target.value)}
                className="w-full p-3 text-center text-xl font-bold font-mono bg-slate-800 border border-slate-600 rounded-xl focus:border-cyan-400 outline-none text-cyan-300"
              />
            </div>

            {/* Dial 3 */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700 text-center">
              <span className="text-[11px] font-mono font-bold text-purple-400 uppercase tracking-wider block mb-1">
                3-QULF KODI (Oltin Qoida):
              </span>
              <div className="text-xs text-slate-300 font-mono mb-3">
                (12 · 18) / EKUK(12, 18) = ?
              </div>
              <input
                type="number"
                placeholder="Kod"
                disabled={isUnlocked}
                value={pinInputs[2]}
                onChange={(e) => handleInputChange(2, e.target.value)}
                className="w-full p-3 text-center text-xl font-bold font-mono bg-slate-800 border border-slate-600 rounded-xl focus:border-purple-400 outline-none text-purple-300"
              />
            </div>
          </div>

          {feedback && (
            <div
              className={`p-3 rounded-xl mb-4 text-center text-xs font-semibold ${
                isUnlocked
                  ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-300'
                  : 'bg-red-950/80 border border-red-500 text-red-300'
              }`}
            >
              {feedback}
            </div>
          )}

          {!isUnlocked && (
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold text-sm hover:brightness-110 shadow-lg shadow-amber-500/20 active:scale-95"
              >
                Kombinatsiyani Tekshirish 🔓
              </button>
            </div>
          )}
        </form>

        {/* Revealed Vault Contents */}
        {isUnlocked && (
          <div className="mt-6 p-6 rounded-2xl bg-black/60 border border-amber-500/40 text-center animate-fade-in">
            <div className="text-4xl mb-2">💎 👑 🪙 📜</div>
            <h4 className="text-lg font-bold text-amber-300 mb-1">Seyf Xazinasi Qo'lga Kiritildi!</h4>
            <p className="text-xs text-slate-300 font-mono">
              Oltin Qoida Isboti: EKUB(12, 18) · EKUK(12, 18) = 6 · 36 = 216 = 12 · 18!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
