import React, { useState } from 'react';
import { Calculator, Sparkles, Check, ArrowRight, RotateCcw } from 'lucide-react';
import { gcd, lcm, getPrimeFactors, getPrimeFactorCounts, getDivisors, getEuclideanSteps } from '../utils/math';
import { playClickSound } from '../utils/audio';

export const CalculatorView: React.FC = () => {
  const [numA, setNumA] = useState<number>(48);
  const [numB, setNumB] = useState<number>(72);
  const [numC, setNumC] = useState<string>('');

  const cVal = parseInt(numC, 10);
  const hasC = !isNaN(cVal) && cVal > 0;

  const resultGcd = hasC ? gcd(gcd(numA, numB), cVal) : gcd(numA, numB);
  const resultLcm = hasC ? lcm(lcm(numA, numB), cVal) : lcm(numA, numB);

  const divisorsA = getDivisors(numA);
  const divisorsB = getDivisors(numB);
  const commonDivisors = divisorsA.filter((d) => divisorsB.includes(d));

  const euclidSteps = getEuclideanSteps(numA, numB);

  const factorsA = getPrimeFactorCounts(numA);
  const factorsB = getPrimeFactorCounts(numB);

  const formatFactors = (map: { [prime: number]: number }) =>
    Object.entries(map)
      .map(([p, exp]) => (exp > 1 ? `${p}<sup>${exp}</sup>` : `${p}`))
      .join(' · ');

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 text-white animate-fade-in">
      {/* Header */}
      <div className="mb-6 p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/30 backdrop-blur-md shadow-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              Universal EKUB & EKUK Kalkulyatori
            </h2>
            <p className="text-xs text-slate-400">
              Ixtiyoriy sonlarni kiriting: to'liq qadamma-qadam tahlil, Evklid jadvali va kanonik yoyilma!
            </p>
          </div>
        </div>
      </div>

      {/* Input Controls */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-700/80 mb-6 shadow-xl">
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
          Hisoblash uchun sonlarni kiriting:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-indigo-400 font-mono font-bold block mb-1">
              1-son (A):
            </label>
            <input
              type="number"
              min="1"
              max="999999"
              value={numA}
              onChange={(e) => setNumA(Math.max(1, parseInt(e.target.value || '1', 10)))}
              className="w-full p-3.5 rounded-xl bg-slate-800 border border-slate-600 focus:border-indigo-400 outline-none font-mono text-xl font-bold text-white"
            />
          </div>

          <div>
            <label className="text-xs text-purple-400 font-mono font-bold block mb-1">
              2-son (B):
            </label>
            <input
              type="number"
              min="1"
              max="999999"
              value={numB}
              onChange={(e) => setNumB(Math.max(1, parseInt(e.target.value || '1', 10)))}
              className="w-full p-3.5 rounded-xl bg-slate-800 border border-slate-600 focus:border-purple-400 outline-none font-mono text-xl font-bold text-white"
            />
          </div>

          <div>
            <label className="text-xs text-cyan-400 font-mono font-bold block mb-1">
              3-son (C, ixtiyoriy):
            </label>
            <input
              type="number"
              min="1"
              placeholder="Masalan: 36"
              value={numC}
              onChange={(e) => setNumC(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-slate-800 border border-slate-600 focus:border-cyan-400 outline-none font-mono text-xl font-bold text-white"
            />
          </div>
        </div>

        {/* Quick presets */}
        <div className="flex flex-wrap items-center gap-2 mt-4 text-xs font-mono text-slate-400">
          <span>Tayyor namunalar:</span>
          {[
            { a: 24, b: 36, label: '24 va 36' },
            { a: 45, b: 60, label: '45 va 60' },
            { a: 84, b: 120, label: '84 va 120' },
            { a: 105, b: 252, label: '105 va 252' },
          ].map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                playClickSound();
                setNumA(preset.a);
                setNumB(preset.b);
                setNumC('');
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:border-slate-500"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Result Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* GCD Result */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/80 to-blue-950/80 border-2 border-indigo-500/50 shadow-xl text-center">
          <span className="text-xs uppercase font-mono tracking-widest text-indigo-300 font-bold block mb-1">
            Eng Katta Umumiy Bo'luvchi (EKUB)
          </span>
          <div className="text-3xl md:text-5xl font-extrabold font-mono text-white my-2">
            {resultGcd}
          </div>
          <div className="text-xs text-indigo-300 font-mono">
            EKUB({numA}, {numB}{hasC ? `, ${cVal}` : ''}) = {resultGcd}
          </div>
        </div>

        {/* LCM Result */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-950/80 to-pink-950/80 border-2 border-purple-500/50 shadow-xl text-center">
          <span className="text-xs uppercase font-mono tracking-widest text-purple-300 font-bold block mb-1">
            Eng Kichik Umumiy Karrali (EKUK)
          </span>
          <div className="text-3xl md:text-5xl font-extrabold font-mono text-white my-2">
            {resultLcm}
          </div>
          <div className="text-xs text-purple-300 font-mono">
            EKUK({numA}, {numB}{hasC ? `, ${cVal}` : ''}) = {resultLcm}
          </div>
        </div>
      </div>

      {/* Prime Factorization Section */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-700/80 mb-6 shadow-xl">
        <h3 className="text-sm font-mono uppercase tracking-wider text-emerald-400 font-bold mb-4 flex items-center gap-2">
          <span>🌿</span> Tub Ko'paytuvchilarga Yoyilishi:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
            <div className="text-xs text-slate-400 font-mono mb-1">{numA} soni:</div>
            <div
              className="text-lg font-mono font-bold text-emerald-300"
              dangerouslySetInnerHTML={{ __html: `${numA} = ${formatFactors(factorsA)}` }}
            />
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
            <div className="text-xs text-slate-400 font-mono mb-1">{numB} soni:</div>
            <div
              className="text-lg font-mono font-bold text-emerald-300"
              dangerouslySetInnerHTML={{ __html: `${numB} = ${formatFactors(factorsB)}` }}
            />
          </div>
        </div>
      </div>

      {/* Golden Identity Verification */}
      {!hasC && (
        <div className="p-5 rounded-3xl bg-amber-950/40 border border-amber-500/40 mb-6 text-center font-mono">
          <div className="text-xs uppercase text-amber-400 font-bold tracking-wider mb-2">
            Oltin Formula Isboti (a · b = EKUB · EKUK):
          </div>
          <div className="text-base md:text-lg text-white font-bold">
            {numA} · {numB} = {resultGcd} · {resultLcm} ={' '}
            <span className="text-amber-300">{numA * numB}</span>
          </div>
          <div className="text-xs text-emerald-400 mt-1 flex items-center justify-center gap-1">
            <Check className="w-3.5 h-3.5" /> Matematik tenglik aynan bajariladi!
          </div>
        </div>
      )}

      {/* Euclidean Algorithm Step-by-Step Table */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-xl">
        <h3 className="text-sm font-mono uppercase tracking-wider text-amber-400 font-bold mb-4 flex items-center gap-2">
          <span>🏛️</span> Evklid Algoritmi Qadamlari (Ketma-ket Bo'lish):
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs md:text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400">
                <th className="pb-3 font-semibold">Qadam</th>
                <th className="pb-3 font-semibold">Tenglama (a = b · q + r)</th>
                <th className="pb-3 font-semibold">Bo'linuvchi</th>
                <th className="pb-3 font-semibold">Bo'luvchi</th>
                <th className="pb-3 font-semibold">Qoldiq (r)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {euclidSteps.map((step) => (
                <tr key={step.step} className="hover:bg-slate-800/40">
                  <td className="py-3 font-bold text-amber-400">#{step.step}</td>
                  <td className="py-3 text-white font-semibold">{step.equation}</td>
                  <td className="py-3 text-slate-300">{step.a}</td>
                  <td className="py-3 text-slate-300">{step.b}</td>
                  <td className={`py-3 font-bold ${step.remainder === 0 ? 'text-emerald-400' : 'text-amber-300'}`}>
                    {step.remainder} {step.remainder === 0 ? '(Tugadi!)' : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
