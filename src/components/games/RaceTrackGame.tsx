import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Car, Play, Pause, RotateCcw, Award, Flag } from 'lucide-react';
import { lcm, gcd } from '../../utils/math';
import { playCorrectSound, playWrongSound, playWinFanfare, playClickSound } from '../../utils/audio';

export const RaceTrackGame: React.FC = () => {
  const racePairs = [
    { carA: 12, carB: 18 },
    { carA: 15, carB: 20 },
    { carA: 20, carB: 30 },
    { carA: 14, carB: 21 },
  ];

  const [pairIdx, setPairIdx] = useState<number>(0);
  const currentPair = racePairs[pairIdx];
  const targetLcm = lcm(currentPair.carA, currentPair.carB);

  const [userGuess, setUserGuess] = useState<string>('');
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Simulation states
  const [simTime, setSimTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

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
      }, 300); // 1 virtual second per 300ms
    }
    return () => clearInterval(interval);
  }, [isRunning, targetLcm]);

  const handleGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(userGuess, 10);
    if (isNaN(val)) return;

    if (val === targetLcm) {
      playCorrectSound();
      setIsAnswered(true);
      setFeedback(`To'g'ri! EKUK(${currentPair.carA}, ${currentPair.carB}) = ${targetLcm} soniya! Mashinalar start chizig'ida uchrashadi! 🏁`);
      setIsRunning(true);
      playWinFanfare();
      confetti({ particleCount: 120, spread: 70 });
    } else {
      playWrongSound();
      setFeedback(`Noto'g'ri: ${val} soniya emas. Ikkala sonning ham karralisi bo'lgan eng kichik sonni toping.`);
    }
  };

  const handleReset = () => {
    const nextIdx = (pairIdx + 1) % racePairs.length;
    setPairIdx(nextIdx);
    setUserGuess('');
    setIsAnswered(false);
    setFeedback(null);
    setSimTime(0);
    setIsRunning(false);
  };

  // Angle on 360 degree track
  const angleA = ((simTime % currentPair.carA) / currentPair.carA) * 360;
  const angleB = ((simTime % currentPair.carB) / currentPair.carB) * 360;

  const lapsA = Math.floor(simTime / currentPair.carA);
  const lapsB = Math.floor(simTime / currentPair.carB);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 bg-slate-900/80 border border-rose-500/30 p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              EKUK Tezlik Poygasi
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Poyga Simulyatsiyasi
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Qizil va ko'k mashinalar yana necha soniyadan so'ng start chizig'ida baravar uchrashadi?
            </p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 text-xs font-semibold"
        >
          <RotateCcw className="w-4 h-4" />
          Keyingi Poyga
        </button>
      </div>

      {/* Race Conditions Info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-2xl bg-red-950/60 border border-red-500/40 flex items-center justify-between">
          <div>
            <div className="text-xs text-red-300 font-bold uppercase">🔴 Qizil Mashina (A)</div>
            <div className="text-xl font-mono font-bold text-white">
              1 aylana = <span className="text-red-400">{currentPair.carA} soniya</span>
            </div>
          </div>
          <div className="text-xs font-mono text-red-300">Aylandi: {lapsA} ta</div>
        </div>

        <div className="p-4 rounded-2xl bg-blue-950/60 border border-blue-500/40 flex items-center justify-between">
          <div>
            <div className="text-xs text-blue-300 font-bold uppercase">🔵 Ko'k Mashina (B)</div>
            <div className="text-xl font-mono font-bold text-white">
              1 aylana = <span className="text-blue-400">{currentPair.carB} soniya</span>
            </div>
          </div>
          <div className="text-xs font-mono text-blue-300">Aylandi: {lapsB} ta</div>
        </div>
      </div>

      {/* Circular Race Track Arena */}
      <div className="relative bg-gradient-to-b from-[#14060d] to-[#080205] border border-rose-500/30 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[360px] shadow-2xl mb-6 overflow-hidden">
        {/* Track Ring */}
        <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-full border-8 border-slate-800 bg-slate-950/80 flex items-center justify-center shadow-inner">
          {/* Inner Grass */}
          <div className="w-36 h-36 md:w-44 md:h-44 rounded-full border-4 border-slate-800 bg-[#091812] flex flex-col items-center justify-center text-center p-2">
            <Flag className="w-6 h-6 text-amber-400 mb-1" />
            <div className="text-xs font-mono text-slate-400">Vaqt:</div>
            <div className="text-2xl font-mono font-bold text-white">{simTime}s</div>
          </div>

          {/* Finish Line Indicator at top (0 deg) */}
          <div className="absolute top-0 inset-x-1/2 -translate-x-1/2 w-4 h-8 bg-amber-400 border-x border-black z-20 flex items-center justify-center text-[9px] font-bold text-black rotate-0">
            🏁
          </div>

          {/* Car A (Red) position */}
          <div
            className="absolute inset-0 transition-transform duration-300"
            style={{ transform: `rotate(${angleA}deg)` }}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-red-600 border-2 border-white shadow-lg shadow-red-500/50 flex items-center justify-center text-xs font-bold">
              A
            </div>
          </div>

          {/* Car B (Blue) position */}
          <div
            className="absolute inset-0 transition-transform duration-300"
            style={{ transform: `rotate(${angleB}deg)` }}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-blue-600 border-2 border-white shadow-lg shadow-blue-500/50 flex items-center justify-center text-xs font-bold">
              B
            </div>
          </div>
        </div>

        {/* Simulation Controls */}
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all border border-slate-600"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? "To'xtatish" : "Simulyatsiyani Ko'rish"}
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
        className="p-6 rounded-2xl bg-slate-900/90 border border-slate-700 shadow-xl text-center mb-4"
      >
        <h4 className="text-base font-bold text-white mb-2">
          Ular yana necha soniyadan so'ng start chizig'ida birgalikda bo'ladi?
        </h4>
        <p className="text-xs text-slate-400 mb-4 font-mono">
          Formulani eslang: EKUK({currentPair.carA}, {currentPair.carB})
        </p>

        <div className="flex justify-center gap-3 max-w-sm mx-auto">
          <input
            type="number"
            placeholder="Soniya (EKUK)"
            value={userGuess}
            onChange={(e) => setUserGuess(e.target.value)}
            className="flex-1 p-3 text-center text-lg font-mono font-bold bg-slate-800 border border-slate-600 rounded-xl focus:border-rose-400 outline-none text-rose-300"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white font-bold text-sm hover:brightness-110 shadow-lg shadow-rose-600/30 active:scale-95"
          >
            Yechish 🏁
          </button>
        </div>

        {feedback && (
          <div className="mt-4 text-xs font-semibold text-rose-300 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            {feedback}
          </div>
        )}
      </form>
    </div>
  );
};
