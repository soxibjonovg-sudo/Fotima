import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Scale, RotateCcw, Plus, Minus, CheckCircle2, Award } from 'lucide-react';
import { lcm, gcd } from '../../utils/math';
import { playCorrectSound, playWrongSound, playWinFanfare, playClickSound } from '../../utils/audio';

export const ScalesBalanceGame: React.FC = () => {
  const pairs = [
    { a: 15, b: 20 },
    { a: 12, b: 16 },
    { a: 18, b: 24 },
    { a: 20, b: 25 },
  ];

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const pair = pairs[currentIdx];
  const targetLcm = lcm(pair.a, pair.b);

  const [countA, setCountA] = useState<number>(1);
  const [countB, setCountB] = useState<number>(1);
  const [isBalanced, setIsBalanced] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const weightA = countA * pair.a;
  const weightB = countB * pair.b;
  const diff = weightA - weightB;

  // Beam tilt angle (capped between -15 and +15 degrees)
  const tiltAngle = Math.max(-15, Math.min(15, -diff * 0.8));

  const handleAddA = () => {
    playClickSound();
    setCountA((c) => c + 1);
    setIsBalanced(false);
  };

  const handleSubA = () => {
    playClickSound();
    setCountA((c) => Math.max(1, c - 1));
    setIsBalanced(false);
  };

  const handleAddB = () => {
    playClickSound();
    setCountB((c) => c + 1);
    setIsBalanced(false);
  };

  const handleSubB = () => {
    playClickSound();
    setCountB((c) => Math.max(1, c - 1));
    setIsBalanced(false);
  };

  const handleCheckBalance = () => {
    if (weightA === weightB) {
      if (weightA === targetLcm) {
        playCorrectSound();
        playWinFanfare();
        setIsBalanced(true);
        setFeedback(`Qoyilmaqom! Tarozi aynan eng kichik umumiy karralida tenglashdi: EKUK(${pair.a}, ${pair.b}) = ${targetLcm} kg! ⚖️`);
        confetti({ particleCount: 140, spread: 75 });
      } else {
        playCorrectSound();
        setFeedback(`Tarozi teng, lekin bu eng kichik umumiy karrali emas! (${weightA} > ${targetLcm}). Kamroq toshlar bilan urinib ko'ring.`);
      }
    } else {
      playWrongSound();
      setFeedback(`Hozircha tarozi teng emas (Farq: ${Math.abs(diff)} kg). Og'irliklarni moslang.`);
    }
  };

  const handleNext = () => {
    const nextI = (currentIdx + 1) % pairs.length;
    setCurrentIdx(nextI);
    setCountA(1);
    setCountB(1);
    setIsBalanced(false);
    setFeedback(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 bg-slate-900/80 border border-amber-600/30 p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-600/20 text-amber-400 rounded-xl border border-amber-600/30">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Toshlar va Tarozilar
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-600/20 text-amber-300 border border-amber-600/30">
                EKUK Balansi
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Chap va o'ng pallalarga toshlar qo'yib, tarozini eng kichik umumiy karralida tenglashtiring!
            </p>
          </div>
        </div>
        <button
          onClick={handleNext}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 text-xs font-semibold"
        >
          <RotateCcw className="w-4 h-4" />
          Keyingi Misol
        </button>
      </div>

      {/* Target Mission */}
      <div className="mb-6 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-between">
        <div>
          <span className="text-xs text-amber-300 uppercase font-mono font-bold block">
            Tosh turlari:
          </span>
          <span className="text-sm text-slate-300">
            Chap tosh: <strong className="text-amber-400">{pair.a} kg</strong> | O'ng tosh: <strong className="text-yellow-400">{pair.b} kg</strong>
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 uppercase font-mono block">Maqsad:</span>
          <span className="text-sm font-bold text-amber-300 font-mono">EKUK({pair.a}, {pair.b}) = ? kg</span>
        </div>
      </div>

      {/* Physical Scale Visualizer */}
      <div className="bg-gradient-to-b from-[#1b140b] to-[#0c0905] border border-amber-700/40 rounded-3xl p-6 md:p-10 shadow-2xl mb-6 flex flex-col items-center justify-center min-h-[360px] relative overflow-hidden">
        {/* Scale Base and Pillar */}
        <div className="relative w-full max-w-lg flex flex-col items-center">
          {/* Pivoting Scale Beam */}
          <div
            className="w-full h-4 bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 rounded-full shadow-lg border border-amber-400/40 transition-transform duration-500 origin-center flex items-center justify-between px-2 relative"
            style={{ transform: `rotate(${tiltAngle}deg)` }}
          >
            {/* Left Pan Attachment */}
            <div className="relative -bottom-24 -left-4 flex flex-col items-center">
              <div className="w-0.5 h-20 bg-amber-500/80" />
              <div className="w-28 h-8 bg-amber-900 border-2 border-amber-500 rounded-b-2xl shadow-xl flex items-center justify-center font-mono font-bold text-xs text-amber-200">
                {weightA} kg ({countA} ta)
              </div>
            </div>

            {/* Pivot fulcrum point */}
            <div className="w-6 h-6 rounded-full bg-amber-400 border-2 border-black shadow-md mx-auto" />

            {/* Right Pan Attachment */}
            <div className="relative -bottom-24 -right-4 flex flex-col items-center">
              <div className="w-0.5 h-20 bg-yellow-500/80" />
              <div className="w-28 h-8 bg-yellow-900 border-2 border-yellow-500 rounded-b-2xl shadow-xl flex items-center justify-center font-mono font-bold text-xs text-yellow-200">
                {weightB} kg ({countB} ta)
              </div>
            </div>
          </div>

          {/* Scale Standing Triangle Fulcrum */}
          <div className="w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[90px] border-b-amber-800 shadow-2xl" />
          <div className="w-48 h-5 bg-amber-900 rounded-full border border-amber-600/60 shadow-lg" />
        </div>
      </div>

      {/* Control Buttons for Pans */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Left Pan Controls */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-600/40 text-center">
          <div className="text-xs text-amber-400 font-bold uppercase mb-2">
            Chap Palla ({pair.a} kg toshlar)
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleSubA}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white active:scale-95 transition-all"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-2xl font-mono font-bold text-amber-300 w-12 text-center">
              {countA}
            </span>
            <button
              onClick={handleAddA}
              className="p-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Pan Controls */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-yellow-600/40 text-center">
          <div className="text-xs text-yellow-400 font-bold uppercase mb-2">
            O'ng Palla ({pair.b} kg toshlar)
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleSubB}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white active:scale-95 transition-all"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-2xl font-mono font-bold text-yellow-300 w-12 text-center">
              {countB}
            </span>
            <button
              onClick={handleAddB}
              className="p-3 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-white active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Action Button & Feedback */}
      <div className="flex flex-col items-center gap-4">
        {feedback && (
          <div
            className={`p-3 rounded-xl text-center text-xs font-semibold max-w-lg ${
              isBalanced
                ? 'bg-emerald-950 border border-emerald-500 text-emerald-300'
                : 'bg-slate-800 border border-slate-700 text-amber-300'
            }`}
          >
            {feedback}
          </div>
        )}

        <button
          onClick={handleCheckBalance}
          className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold text-sm hover:brightness-110 shadow-lg shadow-amber-600/20 active:scale-95"
        >
          <CheckCircle2 className="w-4 h-4" />
          Tarozini Tekshirish ⚖️
        </button>
      </div>
    </div>
  );
};
