import React, { useState } from 'react';
import {
  Gamepad2,
  ArrowLeft,
  Sparkles,
  Search,
  Filter,
  Swords,
  Grid3X3,
  Timer,
  ShieldAlert,
  GitBranch,
  CircleDot,
  Compass,
  Car,
  KeyRound,
  Bomb,
  Scale,
  Layers,
  Blocks,
  Eye,
  Rocket,
  ChevronRight,
} from 'lucide-react';
import { GAMES_LIST } from '../data/gamesList';
import { GameInfo } from '../types';
import { playClickSound } from '../utils/audio';

// Import all 16 game components
import { TugOfWarGame } from './games/TugOfWarGame';
import { CrosswordGame } from './games/CrosswordGame';
import { SpeedQuizGame } from './games/SpeedQuizGame';
import { BubblePopGame } from './games/BubblePopGame';
import { BossBattleGame } from './games/BossBattleGame';
import { FactorTreeGame } from './games/FactorTreeGame';
import { VennDiagramGame } from './games/VennDiagramGame';
import { EuclidMazeGame } from './games/EuclidMazeGame';
import { RaceTrackGame } from './games/RaceTrackGame';
import { SafeCrackerGame } from './games/SafeCrackerGame';
import { BombDefusalGame } from './games/BombDefusalGame';
import { ScalesBalanceGame } from './games/ScalesBalanceGame';
import { MemoryCardsGame } from './games/MemoryCardsGame';
import { NumberDropGame } from './games/NumberDropGame';
import { BeaconSyncGame } from './games/BeaconSyncGame';
import { RocketLaunchGame } from './games/RocketLaunchGame';

interface GameHubProps {
  activeGameId: string | null;
  onSelectGame: (gameId: string | null) => void;
}

export const GameHub: React.FC<GameHubProps> = ({ activeGameId, onSelectGame }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'Barchasi (16)' },
    { id: 'Tezkor', name: '⚡ Tezkor' },
    { id: 'Mantiq', name: '🧩 Mantiq' },
    { id: 'Vizual', name: '🎨 Vizual' },
    { id: 'Strategiya', name: '⚔️ Strategiya' },
  ];

  const filteredGames = GAMES_LIST.filter((g) => {
    const matchesCategory = selectedCategory === 'all' || g.category === selectedCategory;
    const matchesSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Swords': return <Swords className="w-6 h-6" />;
      case 'Grid3X3': return <Grid3X3 className="w-6 h-6" />;
      case 'Timer': return <Timer className="w-6 h-6" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6" />;
      case 'ShieldAlert': return <ShieldAlert className="w-6 h-6" />;
      case 'GitBranch': return <GitBranch className="w-6 h-6" />;
      case 'CircleDot': return <CircleDot className="w-6 h-6" />;
      case 'Compass': return <Compass className="w-6 h-6" />;
      case 'Car': return <Car className="w-6 h-6" />;
      case 'KeyRound': return <KeyRound className="w-6 h-6" />;
      case 'Bomb': return <Bomb className="w-6 h-6" />;
      case 'Scale': return <Scale className="w-6 h-6" />;
      case 'Layers': return <Layers className="w-6 h-6" />;
      case 'Blocks': return <Blocks className="w-6 h-6" />;
      case 'Lighthouse': return <Eye className="w-6 h-6" />;
      case 'Rocket': return <Rocket className="w-6 h-6" />;
      default: return <Gamepad2 className="w-6 h-6" />;
    }
  };

  const renderActiveGame = () => {
    switch (activeGameId) {
      case 'tug-of-war': return <TugOfWarGame />;
      case 'crossword': return <CrosswordGame />;
      case 'speed-quiz': return <SpeedQuizGame />;
      case 'bubble-pop': return <BubblePopGame />;
      case 'boss-battle': return <BossBattleGame />;
      case 'factor-tree': return <FactorTreeGame />;
      case 'venn-diagram': return <VennDiagramGame />;
      case 'euclid-maze': return <EuclidMazeGame />;
      case 'race-track': return <RaceTrackGame />;
      case 'safe-cracker': return <SafeCrackerGame />;
      case 'bomb-defusal': return <BombDefusalGame />;
      case 'scales-balance': return <ScalesBalanceGame />;
      case 'memory-cards': return <MemoryCardsGame />;
      case 'tetris-drop': return <NumberDropGame />;
      case 'beacon-sync': return <BeaconSyncGame />;
      case 'rocket-launch': return <RocketLaunchGame />;
      default: return null;
    }
  };

  // If a game is currently selected, display back navigation + the active game
  if (activeGameId) {
    const currentGame = GAMES_LIST.find((g) => g.id === activeGameId);
    return (
      <div className="w-full">
        {/* Back Navigation Bar */}
        <div className="max-w-5xl mx-auto px-4 pt-2 pb-4 flex items-center justify-between">
          <button
            onClick={() => {
              playClickSound();
              onSelectGame(null);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-semibold transition-all backdrop-blur-md shadow-lg active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Barcha O'yinlar Katalogi (16 ta)</span>
          </button>

          {currentGame && (
            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 font-mono">
                {currentGame.category}
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                {currentGame.difficulty}
              </span>
            </div>
          )}
        </div>

        {/* Game Render Area */}
        <div className="animate-fade-in">{renderActiveGame()}</div>
      </div>
    );
  }

  // Games Directory / Hub Grid
  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 text-white animate-fade-in">
      {/* Header Promo Banner */}
      <div className="mb-8 p-6 md:p-8 rounded-3xl bg-gradient-to-r from-amber-600/30 via-purple-600/30 to-blue-600/30 border border-white/10 backdrop-blur-md shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            16 Xil Interaktiv Matematik O'yinlar
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
            EKUB va EKUK O'yinlar Maydoni
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            Arqon tortishish, krossvord, tezkor testlar, titan jangi, Evklid labirinti, tarozi balansi va kosmik parvozlar bilan qiziqarli o'rganing! Har bir o'yin o'zining moslashtirilgan animatsion foniga ega.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 border border-slate-700/80 rounded-2xl overflow-x-auto max-w-full">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                playClickSound();
                setSelectedCategory(cat.id);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="O'yin nomi yoki kalit so'z..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900/80 border border-slate-700/80 focus:border-amber-400 outline-none text-xs text-white placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* 16 Games Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
        {filteredGames.map((game, idx) => (
          <div
            key={game.id}
            onClick={() => {
              playClickSound();
              onSelectGame(game.id);
            }}
            className="group relative bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/70 hover:border-amber-500/60 rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-2xl cursor-pointer overflow-hidden backdrop-blur-md"
          >
            {/* Ambient Corner Glow */}
            <div
              className={`absolute -top-12 -right-12 w-28 h-28 bg-gradient-to-br ${game.themeColor} opacity-20 rounded-full blur-2xl group-hover:opacity-40 transition-opacity`}
            />

            <div>
              {/* Card Top: Icon and Difficulty */}
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${game.themeColor} flex items-center justify-center text-white shadow-lg shadow-black/40 group-hover:scale-110 transition-transform`}
                >
                  {getIcon(game.icon)}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                    #{idx + 1}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold">
                    {game.difficulty}
                  </span>
                </div>
              </div>

              {/* Title & Short Description */}
              <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-amber-300 transition-colors">
                {game.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                {game.shortDesc}
              </p>
            </div>

            {/* Bottom Meta & Action */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 font-mono">{game.category}</span>
              <div className="flex items-center gap-1 font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                <span>O'ynash</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
