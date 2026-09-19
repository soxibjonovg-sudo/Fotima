import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Compass, RotateCcw, Check, Sparkles, Key, DoorOpen } from 'lucide-react';
import { gcd, getEuclideanSteps, EuclideanStep } from '../../utils/math';
import { playCorrectSound, playWrongSound, playWinFanfare, playClickSound } from '../../utils/audio';

export const EuclidMazeGame: React.FC = () => {
  const problems = [
    { a: 252, b: 105 },
    { a: 391, b: 299 },
    { a: 546, b: 210 },
    { a: 644, b: 420 },
  ];

  const [problemIdx, setProblemIdx] = useState<number>(0);
  const currentProb = problems[problemIdx];
  const allSteps = getEuclideanSteps(currentProb.a, currentProb.b);

  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [inputQ, setInputQ] = useState<string>('');
  const [inputR, setInputR] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<EuclideanStep[]>([]);
  const [isLabyrinthSolved, setIsLabyrinthSolved] = useState<boolean>(false);

  const activeStep = allSteps[currentStepIdx];

  const handleStepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStep) return;

    const userQ = parseInt(inputQ, 10);
    const userR = parseInt(inputR, 10);

    if (isNaN(userQ) || isNaN(userR)) {
      playWrongSound();
      setErrorMsg("To'liq butun sonlarni kiriting!");
      return;
    }

    if (userQ === activeStep.quotient && userR === activeStep.remainder) {
      playCorrectSound();
      setErrorMsg(null);
      setCompletedSteps((prev) => [...prev, activeStep]);
      setInputQ('');
      setInputR('');

      if (currentStepIdx < allSteps.length - 1) {
        setCurrentStepIdx((idx) => idx + 1);
      } else {
        setIsLabyrinthSolved(true);
        playWinFanfare();
        confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });
      }
    } else {
      playWrongSound();
      setErrorMsg(`Xato! Maslahat: ${activeStep.a} sonida ${activeStep.b} nechtaligini va qoldiqni hisoblang.`);
    }
  };

  const handleReset = (nextIdx?: number) => {
    const idx = nextIdx !== undefined ? nextIdx : (problemIdx + 1) % problems.length;
    setProblemIdx(idx);
    setCurrentStepIdx(0);
    setInputQ('');
    setInputR('');
    setErrorMsg(null);
    setCompletedSteps([]);
    setIsLabyrinthSolved(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 bg-slate-900/80 border border-amber-600/30 p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-600/20 text-amber-400 rounded-xl border border-amber-600/30">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Evklid Algoritmi Labirinti
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-600/20 text-amber-300 border border-amber-600/30">
                EKUB({currentProb.a}, {currentProb.b})
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Katta sonlarni qoldiq orqali qisqartirib, Evklid xazinasiga yo'l oching!
            </p>
          </div>
        </div>
        <button
          onClick={() => handleReset()}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 text-xs font-semibold"
        >
          <RotateCcw className="w-4 h-4" />
          Yangi Masala
        </button>
      </div>

      {/* Labirinth Steps History */}
      <div className="bg-gradient-to-b from-[#18110b] to-[#0d0a06] border border-amber-700/40 rounded-3xl p-6 shadow-2xl mb-6">
        <h4 className="text-xs font-mono uppercase tracking-wider text-amber-500 mb-4 flex items-center gap-2">
          <span>🏛️</span> Yunon Ma'badi Zanjiri: (a = b · q + r)
        </h4>

        <div className="space-y-3 mb-6">
          {completedSteps.map((step) => (
            <div
              key={step.step}
              className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between font-mono text-sm"
            >
              <div className="flex items-center gap-2 text-amber-200">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Bosqich {step.step}:</span>
                <span className="font-bold">{step.equation}</span>
              </div>
              <span className="text-xs text-amber-400">Qoldiq: {step.remainder}</span>
            </div>
          ))}

          {/* Current Active Step Form */}
          {!isLabyrinthSolved && activeStep && (
            <form
              onSubmit={handleStepSubmit}
              className="p-5 rounded-2xl bg-slate-900/95 border-2 border-amber-500 shadow-xl"
            >
              <div className="text-xs font-bold text-amber-400 font-mono mb-3">
                ➡️ Navbatdagi Bo'lish: {activeStep.a} sonini {activeStep.b} ga bo'ling:
              </div>

              <div className="flex flex-wrap items-center gap-3 font-mono text-lg mb-3">
                <span className="font-bold text-white text-xl">{activeStep.a}</span>
                <span className="text-slate-400">=</span>
                <span className="font-bold text-amber-300 text-xl">{activeStep.b}</span>
                <span className="text-slate-400">·</span>

                {/* Quotient Input */}
                <input
                  type="number"
                  placeholder="q (to'liqsiz bo'linma)"
                  value={inputQ}
                  onChange={(e) => setInputQ(e.target.value)}
                  className="w-28 p-2 text-center text-base font-bold bg-slate-800 border border-amber-500/60 rounded-xl focus:border-amber-400 outline-none text-amber-200"
                  autoFocus
                />

                <span className="text-slate-400">+</span>

                {/* Remainder Input */}
                <input
                  type="number"
                  placeholder="r (qoldiq)"
                  value={inputR}
                  onChange={(e) => setInputR(e.target.value)}
                  className="w-24 p-2 text-center text-base font-bold bg-slate-800 border border-amber-500/60 rounded-xl focus:border-amber-400 outline-none text-amber-200"
                />

                <button
                  type="submit"
                  className="ml-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-lg shadow-amber-500/20"
                >
                  Qadam Bosish ⚔️
                </button>
              </div>

              {errorMsg && <div className="text-xs text-red-400 font-semibold">{errorMsg}</div>}
            </form>
          )}
        </div>
      </div>

      {/* Solved Treasure Room */}
      {isLabyrinthSolved && (
        <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-950 via-yellow-950 to-stone-900 border-2 border-amber-400 text-center shadow-2xl animate-fade-in">
          <DoorOpen className="w-16 h-16 text-amber-400 mx-auto mb-3 animate-bounce" />
          <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
            Evklid Xazinasi Ochildi! 🪙
          </h3>
          <p className="text-slate-300 text-sm max-w-md mx-auto mb-4">
            Oxirgi nolga teng bo'lmagan qoldiq topildi:
          </p>
          <div className="inline-block p-4 rounded-2xl bg-black/60 border border-amber-400/50 font-mono text-2xl font-bold text-amber-300 mb-6">
            EKUB({currentProb.a}, {currentProb.b}) = {gcd(currentProb.a, currentProb.b)}
          </div>
          <div>
            <button
              onClick={() => handleReset()}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm shadow-lg shadow-amber-500/30"
            >
              Keyingi Labirintga O'tish ➡️
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
