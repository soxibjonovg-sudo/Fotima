import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Grid3X3, CheckCircle2, Lightbulb, RotateCcw, Award } from 'lucide-react';
import { CROSSWORD_ITEMS, CrosswordItem } from '../../data/crosswordData';
import { playCorrectSound, playWrongSound, playClickSound, playWinFanfare } from '../../utils/audio';

const GRID_SIZE = 10;

export const CrosswordGame: React.FC = () => {
  // Build initial empty grid
  const [userGrid, setUserGrid] = useState<string[][]>(() =>
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''))
  );
  const [selectedItem, setSelectedItem] = useState<CrosswordItem | null>(CROSSWORD_ITEMS[0]);
  const [completed, setCompleted] = useState<boolean>(false);
  const [checkResults, setCheckResults] = useState<{ [key: string]: boolean }>({});
  const [showHint, setShowHint] = useState<boolean>(false);

  // Map to know which cells belong to words
  const cellMap = React.useMemo(() => {
    const map: { [key: string]: { item: CrosswordItem; index: number; letter: string; num?: number }[] } = {};
    CROSSWORD_ITEMS.forEach((item) => {
      for (let i = 0; i < item.word.length; i++) {
        const r = item.direction === 'across' ? item.row : item.row + i;
        const c = item.direction === 'across' ? item.col + i : item.col;
        const key = `${r}-${c}`;
        if (!map[key]) map[key] = [];
        map[key].push({
          item,
          index: i,
          letter: item.word[i],
          num: i === 0 ? item.id : undefined,
        });
      }
    });
    return map;
  }, []);

  const handleCellChange = (r: number, c: number, val: string) => {
    playClickSound();
    const char = val.slice(-1).toUpperCase();
    const nextGrid = userGrid.map((rowArr, rowIdx) =>
      rowArr.map((colVal, colIdx) => (rowIdx === r && colIdx === c ? char : colVal))
    );
    setUserGrid(nextGrid);
    setCheckResults({});

    // Auto-advance cursor to next cell in current word
    if (char && selectedItem) {
      const nextR = selectedItem.direction === 'across' ? r : r + 1;
      const nextC = selectedItem.direction === 'across' ? c + 1 : c;
      const nextInput = document.getElementById(`cw-cell-${nextR}-${nextC}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleCheck = () => {
    let allCorrect = true;
    const results: { [key: string]: boolean } = {};

    CROSSWORD_ITEMS.forEach((item) => {
      for (let i = 0; i < item.word.length; i++) {
        const r = item.direction === 'across' ? item.row : item.row + i;
        const c = item.direction === 'across' ? item.col + i : item.col;
        const key = `${r}-${c}`;
        const isRight = (userGrid[r][c] || '').toUpperCase() === item.word[i];
        results[key] = isRight;
        if (!isRight) allCorrect = false;
      }
    });

    setCheckResults(results);

    if (allCorrect) {
      setCompleted(true);
      playWinFanfare();
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    } else {
      playWrongSound();
    }
  };

  const handleHint = () => {
    if (!selectedItem) return;
    playCorrectSound();
    // Fill first empty letter of selected word
    for (let i = 0; i < selectedItem.word.length; i++) {
      const r = selectedItem.direction === 'across' ? selectedItem.row : selectedItem.row + i;
      const c = selectedItem.direction === 'across' ? selectedItem.col + i : selectedItem.col;
      if (!userGrid[r][c] || userGrid[r][c] !== selectedItem.word[i]) {
        const nextGrid = userGrid.map((rowArr, rowIdx) =>
          rowArr.map((colVal, colIdx) => (rowIdx === r && colIdx === c ? selectedItem.word[i] : colVal))
        );
        setUserGrid(nextGrid);
        break;
      }
    }
    setShowHint(true);
  };

  const handleReset = () => {
    setUserGrid(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('')));
    setCheckResults({});
    setCompleted(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 bg-slate-900/80 border border-slate-700/70 p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-sky-500/20 text-sky-400 rounded-xl border border-sky-500/30">
            <Grid3X3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Matematik Krossvord
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                10x10 Jumboq
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              EKUB, EKUK, Evklid va tub sonlar atamalari bo'yicha krossvordni yeching.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleHint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold transition-all"
            title="Bitta harfni ochish"
          >
            <Lightbulb className="w-4 h-4" />
            Yordam
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 text-xs font-semibold transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Tozalash
          </button>
          <button
            onClick={handleCheck}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:brightness-110 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/20"
          >
            <CheckCircle2 className="w-4 h-4" />
            Tekshirish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Crossword Grid (Left / 7 cols) */}
        <div className="lg:col-span-7 bg-[#0f241a]/90 border border-emerald-500/30 p-4 md:p-6 rounded-3xl shadow-xl flex flex-col items-center">
          <div className="text-xs font-mono text-emerald-400/70 mb-4 text-center">
            Doska maydoni: Katakchani bosing va klaviaturada harflarni tering
          </div>

          <div className="inline-grid grid-cols-10 gap-1.5 p-3 bg-black/40 rounded-2xl border border-emerald-900/50">
            {Array.from({ length: GRID_SIZE }).map((_, r) =>
              Array.from({ length: GRID_SIZE }).map((_, c) => {
                const key = `${r}-${c}`;
                const cellInfo = cellMap[key];
                const isWordCell = !!cellInfo;
                const isSelected = selectedItem && cellInfo?.some((ci) => ci.item.id === selectedItem.id);
                const checkState = checkResults[key];

                if (!isWordCell) {
                  return (
                    <div
                      key={key}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-emerald-950/20 border border-emerald-950/30"
                    />
                  );
                }

                const labelNum = cellInfo.find((ci) => ci.num !== undefined)?.num;

                return (
                  <div
                    key={key}
                    onClick={() => setSelectedItem(cellInfo[0].item)}
                    className={`relative w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center font-bold text-base md:text-lg transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-600/50 border-2 border-sky-400 text-white shadow-md shadow-sky-500/30'
                        : checkState === true
                        ? 'bg-emerald-600/40 border border-emerald-400 text-emerald-200'
                        : checkState === false
                        ? 'bg-red-600/40 border border-red-400 text-red-200'
                        : 'bg-slate-900/90 border border-slate-700 text-amber-200 hover:border-slate-500'
                    }`}
                  >
                    {labelNum && (
                      <span className="absolute top-0.5 left-1 text-[9px] font-mono text-slate-400 leading-none">
                        {labelNum}
                      </span>
                    )}
                    <input
                      id={`cw-cell-${r}-${c}`}
                      type="text"
                      maxLength={1}
                      value={userGrid[r][c]}
                      onChange={(e) => handleCellChange(r, c, e.target.value)}
                      className="w-full h-full text-center bg-transparent border-none outline-none font-bold uppercase"
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Clues Panel (Right / 5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Active Word Clue Card */}
          {selectedItem && (
            <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-500/40 text-sm">
              <div className="flex items-center justify-between text-xs font-mono text-sky-400 mb-1">
                <span>
                  Tanlangan: #{selectedItem.id} ({selectedItem.direction === 'across' ? 'Yotiq' : 'Tik'})
                </span>
                <span>{selectedItem.word.length} ta harf</span>
              </div>
              <p className="text-white font-medium">{selectedItem.clue}</p>
            </div>
          )}

          {/* Full Clues List */}
          <div className="flex-1 bg-slate-900/80 border border-slate-700/70 p-4 rounded-2xl overflow-y-auto max-h-[420px] text-xs space-y-4">
            <div>
              <h4 className="font-bold text-sky-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span>➡️</span> Yotiq (Gorizontal)
              </h4>
              <div className="space-y-2">
                {CROSSWORD_ITEMS.filter((i) => i.direction === 'across').map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`p-2.5 rounded-xl cursor-pointer transition-all border ${
                      selectedItem?.id === item.id
                        ? 'bg-sky-500/20 border-sky-400 text-white'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="font-bold text-sky-400 mr-2">#{item.id}</span>
                    {item.clue}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span>⬇️</span> Tik (Vertikal)
              </h4>
              <div className="space-y-2">
                {CROSSWORD_ITEMS.filter((i) => i.direction === 'down').map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`p-2.5 rounded-xl cursor-pointer transition-all border ${
                      selectedItem?.id === item.id
                        ? 'bg-indigo-500/20 border-indigo-400 text-white'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="font-bold text-indigo-400 mr-2">#{item.id}</span>
                    {item.clue}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {completed && (
        <div className="mt-6 p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-900 to-black border-2 border-emerald-400 text-center animate-fade-in shadow-2xl">
          <Award className="w-12 h-12 text-emerald-400 mx-auto mb-2 animate-bounce" />
          <h3 className="text-2xl font-bold text-white mb-1">Krossvord To'liq Yechildi! 🌟</h3>
          <p className="text-sm text-emerald-200">
            Siz barcha matematik atamalarni va formulalarni to'g'ri topdingiz!
          </p>
        </div>
      )}
    </div>
  );
};
