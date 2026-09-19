import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CircleDot, RotateCcw, CheckCircle2, Award, Sparkles } from 'lucide-react';
import { gcd, lcm, getPrimeFactors } from '../../utils/math';
import { playCorrectSound, playWrongSound, playWinFanfare, playClickSound } from '../../utils/audio';

interface FactorToken {
  id: string;
  val: number;
  belongsTo: 'A' | 'B' | 'both';
  zone: 'pool' | 'left' | 'intersection' | 'right';
}

export const VennDiagramGame: React.FC = () => {
  const problems = [
    { a: 24, b: 36 },
    { a: 30, b: 45 },
    { a: 40, b: 60 },
    { a: 28, b: 42 },
  ];
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const currentPair = problems[currentIdx];

  // Prepare tokens
  const setupTokens = (numA: number, numB: number) => {
    const factorsA = getPrimeFactors(numA);
    const factorsB = getPrimeFactors(numB);

    const intersection: number[] = [];
    const remainingA = [...factorsA];
    const remainingB = [...factorsB];

    factorsA.forEach((fa) => {
      const idxInB = remainingB.indexOf(fa);
      if (idxInB !== -1) {
        intersection.push(fa);
        remainingB.splice(idxInB, 1);
        const idxInA = remainingA.indexOf(fa);
        remainingA.splice(idxInA, 1);
      }
    });

    const tokens: FactorToken[] = [];
    let counter = 1;

    intersection.forEach((val) => {
      tokens.push({ id: `inter-${counter++}`, val, belongsTo: 'both', zone: 'pool' });
    });
    remainingA.forEach((val) => {
      tokens.push({ id: `left-${counter++}`, val, belongsTo: 'A', zone: 'pool' });
    });
    remainingB.forEach((val) => {
      tokens.push({ id: `right-${counter++}`, val, belongsTo: 'B', zone: 'pool' });
    });

    return tokens.sort(() => Math.random() - 0.5);
  };

  const [tokens, setTokens] = useState<FactorToken[]>(() => setupTokens(currentPair.a, currentPair.b));
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSelectToken = (id: string) => {
    playClickSound();
    setSelectedTokenId(selectedTokenId === id ? null : id);
  };

  const handlePlaceInZone = (targetZone: 'left' | 'intersection' | 'right' | 'pool') => {
    if (!selectedTokenId) return;
    playClickSound();

    setTokens((prev) =>
      prev.map((t) => (t.id === selectedTokenId ? { ...t, zone: targetZone } : t))
    );
    setSelectedTokenId(null);
  };

  const handleVerify = () => {
    const poolTokens = tokens.filter((t) => t.zone === 'pool');
    if (poolTokens.length > 0) {
      playWrongSound();
      setFeedback("Avval barcha tub ko'paytuvchilarni doiralarga joylashtiring!");
      return;
    }

    const leftTokens = tokens.filter((t) => t.zone === 'left');
    const interTokens = tokens.filter((t) => t.zone === 'intersection');
    const rightTokens = tokens.filter((t) => t.zone === 'right');

    const leftCorrect = leftTokens.every((t) => t.belongsTo === 'A');
    const interCorrect = interTokens.every((t) => t.belongsTo === 'both');
    const rightCorrect = rightTokens.every((t) => t.belongsTo === 'B');

    if (leftCorrect && interCorrect && rightCorrect) {
      playWinFanfare();
      setIsSuccess(true);
      setFeedback("Ajoyib! Barcha tub ko'paytuvchilar mukammal joylashtirildi! 🎉");
      confetti({ particleCount: 130, spread: 75 });
    } else {
      playWrongSound();
      setFeedback("Ba'zi sonlar noto'g'ri sohada. Kesishma — faqat har ikkala sonda qatnashgan umumiylar uchun!");
    }
  };

  const handleNextProblem = () => {
    const nextI = (currentIdx + 1) % problems.length;
    setCurrentIdx(nextI);
    setTokens(setupTokens(problems[nextI].a, problems[nextI].b));
    setIsSuccess(false);
    setFeedback(null);
    setSelectedTokenId(null);
  };

  // Compute live products
  const interVals = tokens.filter((t) => t.zone === 'intersection').map((t) => t.val);
  const currentGcdDisplay = interVals.length > 0 ? interVals.reduce((a, b) => a * b, 1) : 1;

  const allAssignedVals = tokens.filter((t) => t.zone !== 'pool').map((t) => t.val);
  const currentLcmDisplay = allAssignedVals.length > 0 ? allAssignedVals.reduce((a, b) => a * b, 1) : 1;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 bg-slate-900/80 border border-violet-500/30 p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-violet-500/20 text-violet-400 rounded-xl border border-violet-500/30">
            <CircleDot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Venn Diagrammasi Matcher
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                {currentPair.a} va {currentPair.b}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Kesishma (A ∩ B) — EKUBni, butun birlashma (A ∪ B) esa EKUKni beradi!
            </p>
          </div>
        </div>
        <button
          onClick={handleNextProblem}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 text-xs font-semibold"
        >
          <RotateCcw className="w-4 h-4" />
          Keyingi Misol
        </button>
      </div>

      {/* Real-time Math Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 text-center">
          <div className="text-xs text-indigo-300 uppercase tracking-wider mb-1 font-semibold">
            EKUB({currentPair.a}, {currentPair.b}) = Kesishma (A ∩ B)
          </div>
          <div className="text-2xl font-mono font-bold text-indigo-400">
            {interVals.length > 0 ? interVals.join(' · ') : 'Ø'} = {currentGcdDisplay}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-violet-950/60 border border-violet-500/40 text-center">
          <div className="text-xs text-violet-300 uppercase tracking-wider mb-1 font-semibold">
            EKUK({currentPair.a}, {currentPair.b}) = Birlashma (A ∪ B)
          </div>
          <div className="text-2xl font-mono font-bold text-violet-400">
            {allAssignedVals.length > 0 ? allAssignedVals.join(' · ') : 'Ø'} = {currentLcmDisplay}
          </div>
        </div>
      </div>

      {/* Interactive Venn Diagram Visualizer */}
      <div className="relative bg-gradient-to-b from-[#0e0724] to-[#060312] border border-violet-500/40 rounded-3xl p-6 md:p-8 min-h-[340px] flex items-center justify-center shadow-2xl mb-6 overflow-hidden">
        <div className="relative w-full max-w-2xl h-72 flex items-center justify-center">
          {/* Circle A (Left) */}
          <div
            onClick={() => handlePlaceInZone('left')}
            className="absolute left-8 md:left-16 w-56 md:w-64 h-56 md:h-64 rounded-full border-2 border-cyan-500 bg-cyan-500/10 hover:bg-cyan-500/20 transition-all flex flex-col items-start p-6 cursor-pointer"
          >
            <span className="text-sm font-bold text-cyan-400 font-mono">Faqat {currentPair.a}</span>
            <div className="flex flex-wrap gap-2 mt-8 max-w-[120px]">
              {tokens.filter((t) => t.zone === 'left').map((t) => (
                <button
                  key={t.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectToken(t.id);
                  }}
                  className={`w-9 h-9 rounded-xl font-bold font-mono text-sm shadow-md transition-all ${
                    selectedTokenId === t.id
                      ? 'bg-amber-400 text-black ring-2 ring-white scale-110'
                      : 'bg-cyan-600 text-white'
                  }`}
                >
                  {t.val}
                </button>
              ))}
            </div>
          </div>

          {/* Circle B (Right) */}
          <div
            onClick={() => handlePlaceInZone('right')}
            className="absolute right-8 md:right-16 w-56 md:w-64 h-56 md:h-64 rounded-full border-2 border-pink-500 bg-pink-500/10 hover:bg-pink-500/20 transition-all flex flex-col items-end p-6 cursor-pointer"
          >
            <span className="text-sm font-bold text-pink-400 font-mono">Faqat {currentPair.b}</span>
            <div className="flex flex-wrap gap-2 mt-8 max-w-[120px] justify-end">
              {tokens.filter((t) => t.zone === 'right').map((t) => (
                <button
                  key={t.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectToken(t.id);
                  }}
                  className={`w-9 h-9 rounded-xl font-bold font-mono text-sm shadow-md transition-all ${
                    selectedTokenId === t.id
                      ? 'bg-amber-400 text-black ring-2 ring-white scale-110'
                      : 'bg-pink-600 text-white'
                  }`}
                >
                  {t.val}
                </button>
              ))}
            </div>
          </div>

          {/* Overlap Intersection (Center) */}
          <div
            onClick={() => handlePlaceInZone('intersection')}
            className="z-10 w-36 h-48 rounded-[50%] bg-violet-600/30 hover:bg-violet-600/40 border-2 border-violet-400 flex flex-col items-center justify-center cursor-pointer p-2 shadow-inner"
          >
            <span className="text-[11px] font-bold text-violet-300 font-mono text-center">
              EKUB (A ∩ B)
            </span>
            <div className="flex flex-wrap gap-1.5 justify-center mt-2 max-w-[100px]">
              {tokens.filter((t) => t.zone === 'intersection').map((t) => (
                <button
                  key={t.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectToken(t.id);
                  }}
                  className={`w-8 h-8 rounded-xl font-bold font-mono text-sm shadow-md transition-all ${
                    selectedTokenId === t.id
                      ? 'bg-amber-400 text-black ring-2 ring-white scale-110'
                      : 'bg-violet-500 text-white'
                  }`}
                >
                  {t.val}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Unassigned Factor Token Pool */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 mb-6">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Taqsimlanmagan tub ko'paytuvchilar: (Sonni bosing, so'ng sohani tanlang)</span>
          {selectedTokenId && <span className="text-amber-400 font-bold animate-pulse">Tanlandi! Diagrammani bosing ⬆️</span>}
        </div>

        <div className="flex flex-wrap gap-2.5 min-h-[44px]">
          {tokens.filter((t) => t.zone === 'pool').map((t) => (
            <button
              key={t.id}
              onClick={() => handleSelectToken(t.id)}
              className={`px-4 py-2 rounded-xl font-mono font-bold text-lg transition-all shadow-md active:scale-95 ${
                selectedTokenId === t.id
                  ? 'bg-amber-400 text-black ring-4 ring-amber-300/40 scale-105'
                  : 'bg-slate-800 hover:bg-slate-700 text-violet-300 border border-violet-500/40'
              }`}
            >
              {t.val}
            </button>
          ))}
          {tokens.filter((t) => t.zone === 'pool').length === 0 && (
            <div className="text-xs text-emerald-400 font-medium py-2">
              Barcha tub sonlar diagrammaga joylashtirildi. Endi "Tekshirish" tugmasini bosing!
            </div>
          )}
        </div>
      </div>

      {feedback && (
        <div className="p-3 mb-6 rounded-xl bg-slate-800 border border-slate-700 text-center text-sm font-semibold text-violet-300">
          {feedback}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={handleVerify}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-indigo-600/30"
        >
          <CheckCircle2 className="w-4 h-4" />
          Joylashuvni Tekshirish
        </button>
      </div>
    </div>
  );
};
