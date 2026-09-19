import React, { useState } from 'react';
import {
  Gamepad2,
  BookOpen,
  Calculator,
  Bot,
  Volume2,
  VolumeX,
  Sparkles,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { DynamicBackground } from './components/DynamicBackground';
import { GameHub } from './components/GameHub';
import { TheoryView } from './components/TheoryView';
import { CalculatorView } from './components/CalculatorView';
import { GeminiChatView } from './components/GeminiChatView';
import { GAMES_LIST } from './data/gamesList';
import { playClickSound, toggleSound } from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<'games' | 'theory' | 'calculator' | 'gemini'>('games');
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);

  // Determine appropriate background based on active tab and selected game
  const getCurrentBgType = () => {
    if (activeTab === 'games') {
      if (activeGameId) {
        const game = GAMES_LIST.find((g) => g.id === activeGameId);
        return game?.bgType || 'arena';
      }
      return 'arena';
    }
    if (activeTab === 'theory') return 'chalkboard';
    if (activeTab === 'calculator') return 'cyber';
    if (activeTab === 'gemini') return 'nebula';
    return 'default';
  };

  const handleSoundToggle = () => {
    const muted = toggleSound();
    setIsSoundMuted(muted);
  };

  const handleTabChange = (tab: 'games' | 'theory' | 'calculator' | 'gemini') => {
    playClickSound();
    setActiveTab(tab);
  };

  return (
    <div className="relative min-h-screen text-white font-sans selection:bg-amber-500 selection:text-black overflow-x-hidden">
      {/* Immersive Animated Section-Specific Background */}
      <DynamicBackground type={getCurrentBgType()} />

      {/* Top Main Navigation Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div
            onClick={() => {
              playClickSound();
              setActiveTab('games');
              setActiveGameId(null);
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h1 className="text-base md:text-lg font-extrabold text-white tracking-tight flex items-center gap-1.5 leading-tight">
                EKUB & EKUK <span className="text-amber-400 font-mono">Platformasi</span>
              </h1>
              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline-block">
                16 ta O'yin · Nazariya · Gemini AI Repetitor
              </span>
            </div>
          </div>

          {/* Nav Navigation Tabs */}
          <nav className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-x-auto">
            <button
              onClick={() => handleTabChange('games')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'games'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>O'yinlar (16 ta)</span>
            </button>

            <button
              onClick={() => handleTabChange('theory')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'theory'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Nazariya & Isbotlar</span>
            </button>

            <button
              onClick={() => handleTabChange('calculator')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'calculator'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>Kalkulyator</span>
            </button>

            <button
              onClick={() => handleTabChange('gemini')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'gemini'
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>Gemini AI</span>
            </button>
          </nav>

          {/* Sound Mute Toggle */}
          <button
            onClick={handleSoundToggle}
            className="p-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-amber-400 transition-colors shadow"
            title={isSoundMuted ? "Ovozni yoqish" : "Ovozni o'chirish"}
          >
            {isSoundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Content View Switcher */}
      <main className="relative z-10 py-6">
        {activeTab === 'games' && (
          <GameHub
            activeGameId={activeGameId}
            onSelectGame={(id) => setActiveGameId(id)}
          />
        )}

        {activeTab === 'theory' && <TheoryView />}

        {activeTab === 'calculator' && <CalculatorView />}

        {activeTab === 'gemini' && <GeminiChatView />}
      </main>

      {/* Footer Banner */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md py-6 mt-12 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>Matematika: EKUB (Eng Katta Umumiy Bo'luvchi) va EKUK (Eng Kichik Umumiy Karrali)</span>
          </div>
          <div className="text-slate-400">
            Oltin formula: <span className="text-amber-400 font-bold">EKUB(a, b) · EKUK(a, b) = a · b</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
