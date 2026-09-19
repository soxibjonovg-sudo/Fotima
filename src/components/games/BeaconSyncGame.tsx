import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Eye, Play, Pause, RotateCcw, Award, Sparkles } from 'lucide-react';
import { lcm } from '../../utils/math';
import { playCorrectSound, playWrongSound, playWinFanfare, playClickSound } from '../../utils/audio';

export const BeaconSyncGame: React.FC = () => {
  const lighthouseTrios = [
    { a: 4, b: 6, c: 10 },
    { a: 6, b: 8, c: 12 },
    { a: 3, b: 5, c: 9 },
  ];

  const [trioIdx, setTrioIdx] = useState<number>(0);
  const trio = lighthouseTrios[trioIdx];
  const targetLcm = lcm(trio.a, lcm(trio.b, trio.c));

  const [userGuess, setUserGuess] = useState<string>('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [simTime, setSimTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSolved, setIsSolved] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSimTime((t) => {
          if (t >= targetLcm) {
            setIsRunning(false);
            return targetLcm;
          }
          return t + 1;
        });
      }, 250);
    }
    return () => clearInterval(interval);
  }, [isRunning, targetLcm]);

  const handleGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(userGuess, 10);
    if (isNaN(val)) return;

    if (val === targetLcm) {
      playCorrectSound();
      playWinFanfare();
      setIsSolved(true);
      setFeedback(`Mukammal! EKUK(${trio.a}, ${trio.b}, ${trio.c}) = ${targetLcm} soniya! Mayoqlar aynan shu lahzada birgalikda chaqnaydi! 🌟`);
      setIsRunning(true);
      confetti({ particleCount: 130, spread: 75 });
    } else {
      playWrongSound();
      setFeedback(`Noto'g'ri: ${val} soniya emas. Uchala sonning eng kichik umumiy karralisini (EKUK) toping.`);
    }
  };

  const handleReset = () => {
    const nextI = (trioIdx + 1) % lighthouseTrios.length;
    setTrioIdx(nextI);
    setUserGuess('');
    setFeedback(null);
    setSimTime(0);
    setIsRunning(false);
    setIsSolved(false);
  };

  // Check if each lighthouse is flashing right now
  const flashA = simTime > 0 && simTime % trio.a === 0;
  const flashB = simTime > 0 && simTime % trio.b === 0;
  const flashC = simTime > 0 && simTime % trio.c === 0;
  const allFlashing = flashA && flashB && flashC;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 bg-slate-900/80 border border-teal-500/30 p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-500/20 text-teal-300 rounded-xl border border-teal-500/30">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Mayoqlar Sinxronligi
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                3 Ta Son EKUKi
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Uchta dengiz mayog'i har {trio.a}, {trio.b}, {trio.c} soniyada nur sochadi. Qachon ular birga porlaydi?
            </p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 text-xs font-semibold"
        >
          <RotateCcw className="w-4 h-4" />
          Yangi Guruh
        </button>
      </div>

      {/* Sea Stage with 3 Lighthouses */}
      <div className="relative bg-gradient-to-b from-[#020d18] via-[#041a2e] to-[#010810] border border-teal-500/40 rounded-3xl p-6 md:p-8 min-h-[340px] shadow-2xl mb-6 overflow-hidden flex flex-col justify-between">
        {/* Ocean Wave effect background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/20 via-transparent to-transparent pointer-events-none" />

        {/* Global Sync Banner */}
        <div className="text-center z-10">
          <span className="text-xs font-mono uppercase text-teal-400 tracking-wider">
            Sinxron Sekundomer:
          </span>
          <div className="text-3xl font-mono font-extrabold text-white mt-0.5">
            {simTime} soniya
          </div>
          {allFlashing && (
            <div className="text-xs font-bold text-amber-300 animate-bounce mt-1">
              ✨ BARCHA MAYOQLAR BIR PAYTDA PORLAMOQDA! ✨
            </div>
          )}
        </div>

        {/* 3 Lighthouses Row */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 z-10 my-6">
          {/* Lighthouse 1 */}
          <div className="flex flex-col items-center">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-2 transition-all duration-300 ${
                flashA
                  ? 'bg-amber-400 text-black shadow-[0_0_50px_rgba(251,191,36,0.9)] scale-110'
                  : 'bg-slate-800 text-slate-500 border border-slate-700'
              }`}
            >
              🏮
            </div>
            <span className="text-xs font-bold text-teal-300 font-mono">1-Mayoq</span>
            <span className="text-[11px] text-slate-400 font-mono">Har {trio.a}s da</span>
          </div>

          {/* Lighthouse 2 */}
          <div className="flex flex-col items-center">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-2 transition-all duration-300 ${
                flashB
                  ? 'bg-cyan-400 text-black shadow-[0_0_50px_rgba(34,211,238,0.9)] scale-110'
                  : 'bg-slate-800 text-slate-500 border border-slate-700'
              }`}
            >
              🏮
            </div>
            <span className="text-xs font-bold text-teal-300 font-mono">2-Mayoq</span>
            <span className="text-[11px] text-slate-400 font-mono">Har {trio.b}s da</span>
          </div>

          {/* Lighthouse 3 */}
          <div className="flex flex-col items-center">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-2 transition-all duration-300 ${
                flashC
                  ? 'bg-emerald-400 text-black shadow-[0_0_50px_rgba(52,211,153,0.9)] scale-110'
                  : 'bg-slate-800 text-slate-500 border border-slate-700'
              }`}
            >
              🏮
            </div>
            <span className="text-xs font-bold text-teal-300 font-mono">3-Mayoq</span>
            <span className="text-[11px] text-slate-400 font-mono">Har {trio.c}s da</span>
          </div>
        </div>

        {/* Sim Controls */}
        <div className="flex justify-center gap-3 z-10">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-semibold"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? "To'xtatish" : "Simulyatsiyani Yurgizish"}
          </button>
          <button
            onClick={() => {
              setSimTime(0);
              setIsRunning(false);
            }}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-semibold"
          >
            0 ga qaytarish
          </button>
        </div>
      </div>

      {/* Answer Form */}
      <form
        onSubmit={handleGuessSubmit}
        className="p-6 rounded-2xl bg-slate-900/90 border border-teal-500/40 shadow-xl text-center"
      >
        <h4 className="text-base font-bold text-white mb-2">
          EKUK({trio.a}, {trio.b}, {trio.c}) = Necha soniya?
        </h4>
        <div className="flex justify-center gap-3 max-w-sm mx-auto">
          <input
            type="number"
            placeholder="Javobingiz (soniya)"
            value={userGuess}
            onChange={(e) => setUserGuess(e.target.value)}
            className="flex-1 p-3 text-center text-lg font-mono font-bold bg-slate-800 border border-slate-600 rounded-xl focus:border-teal-400 outline-none text-teal-300"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-bold text-sm shadow-lg shadow-teal-500/20 active:scale-95"
          >
            Yuborish 🌊
          </button>
        </div>

        {feedback && (
          <div className="mt-4 text-xs font-semibold text-teal-300 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            {feedback}
          </div>
        )}
      </form>
    </div>
  );
};
