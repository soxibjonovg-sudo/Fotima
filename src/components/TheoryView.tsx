import React, { useState } from 'react';
import { BookOpen, ChevronRight, Lightbulb, CheckCircle2, Award, Sparkles } from 'lucide-react';
import { THEORY_SECTIONS, TheorySectionData } from '../data/theoryData';
import { playClickSound } from '../utils/audio';

export const TheoryView: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState<string>(THEORY_SECTIONS[0].id);
  const activeSection = THEORY_SECTIONS.find((s) => s.id === activeSectionId) || THEORY_SECTIONS[0];

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 text-white animate-fade-in">
      {/* Header Banner */}
      <div className="mb-8 p-6 md:p-8 rounded-3xl bg-gradient-to-r from-blue-950/90 via-indigo-950/80 to-purple-950/90 border border-blue-500/30 backdrop-blur-md shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            Matematik Nazariya & Isbotlar
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
            EKUB va EKUK: Mukammal Darslik
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            Bo'luvchilar, tub sonlar, kanonik yoyilma, Evklid algoritmi va hayotiy masalalarning to'liq ilmiy tushuntirishlari.
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-black/40 border border-blue-500/40 text-center font-mono">
          <div className="text-xs text-blue-400 font-semibold mb-1">Oltin Formula:</div>
          <div className="text-lg font-bold text-amber-300">EKUB(a, b) · EKUK(a, b) = a · b</div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 px-2">
            Mavzular bobi (7 ta):
          </div>
          {THEORY_SECTIONS.map((sec, idx) => {
            const isActive = sec.id === activeSectionId;
            return (
              <button
                key={sec.id}
                onClick={() => {
                  playClickSound();
                  setActiveSectionId(sec.id);
                }}
                className={`w-full p-3.5 rounded-2xl text-left transition-all flex items-center justify-between border ${
                  isActive
                    ? 'bg-blue-600/30 border-blue-400 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-slate-900/80 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono text-xs font-bold ${
                      isActive ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-xs md:text-sm leading-tight">{sec.title}</h4>
                    <span className="text-[10px] text-slate-400 font-normal line-clamp-1">
                      {sec.subtitle}
                    </span>
                  </div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    isActive ? 'translate-x-1 text-blue-400' : 'text-slate-600'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Active Section Content (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl space-y-6">
          {/* Header Title with Badge */}
          <div className="border-b border-slate-800 pb-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold font-mono">
                {activeSection.badge}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-1">
              {activeSection.title}
            </h2>
            <p className="text-sm text-slate-400">{activeSection.subtitle}</p>
          </div>

          {/* Formula Callout */}
          {activeSection.formula && (
            <div className="p-4 rounded-2xl bg-black/50 border border-blue-500/30 font-mono text-base md:text-lg font-bold text-amber-300 flex items-center gap-3">
              <span className="text-xl">💡</span>
              <span className="break-all">{activeSection.formula}</span>
            </div>
          )}

          {/* Detailed Paragraph Content */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold flex items-center gap-1.5">
              <span>📖</span> Asosiy Qoidalar va Tushuntirish
            </h3>
            {activeSection.content.map((paragraph, pIdx) => (
              <p
                key={pIdx}
                className="text-slate-200 text-sm md:text-base leading-relaxed bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Worked Example */}
          {activeSection.example && (
            <div className="p-5 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold flex items-center gap-1.5">
                <span>🧮</span> Qadamma-qadam Amaliy Misol
              </div>
              <div className="font-mono font-bold text-white text-base">
                {activeSection.example.numbers}
              </div>
              <div className="text-xs font-mono text-slate-300 pl-3 border-l-2 border-purple-500/50 space-y-1 my-2">
                <div>1-Qadam: {activeSection.example.step1}</div>
                <div>2-Qadam: {activeSection.example.step2}</div>
              </div>
              <div className="text-sm font-bold text-emerald-400 font-mono">
                Natija: {activeSection.example.result}
              </div>
            </div>
          )}

          {/* Pro Tips / Insight */}
          {activeSection.tips && (
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-sm text-amber-200 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300 block mb-0.5">Muhim Eslatma:</span>
                <span>{activeSection.tips}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
