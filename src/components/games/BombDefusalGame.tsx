import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Bomb, Scissors, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { gcd, areCoprime } from '../../utils/math';
import { playCorrectSound, playWrongSound, playWinFanfare, playClickSound } from '../../utils/audio';

interface Wire {
  id: number;
  color: string;
  wireColorClass: string;
  val: number;
  cut: boolean;
}

export const BombDefusalGame: React.FC = () => {
  const [coreNumber, setCoreNumber] = useState<number>(35);
  const [wires, setWires] = useState<Wire[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(25);
  const [isDefused, setIsDefused] = useState<boolean>(false);
  const [isExploded, setIsExploded] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const setupRound = () => {
    // Pick core number
    const cores = [30, 35, 42, 54, 70, 84];
    const core = cores[Math.floor(Math.random() * cores.length)];
    setCoreNumber(core);

    // Find 1 coprime number and 3 non-coprime numbers
    const wireColors = [
      { name: 'Qizil', class: 'bg-red-500 border-red-400' },
      { name: 'Ko\'k', class: 'bg-blue-500 border-blue-400' },
      { name: 'Sariq', class: 'bg-amber-400 border-amber-300' },
      { name: 'Yashil', class: 'bg-emerald-500 border-emerald-400' },
    ];

    // Candidate numbers
    let coprimeCandidate = 11;
    for (let c = 11; c <= 99; c++) {
      if (areCoprime(core, c)) {
        coprimeCandidate = c;
        break;
      }
    }

    const nonCoprimes: number[] = [];
    for (let nc = 6; nc <= 90; nc++) {
      if (!areCoprime(core, nc) && nc !== core && !nonCoprimes.includes(nc)) {
        nonCoprimes.push(nc);
        if (nonCoprimes.length === 3) break;
      }
    }

    const combined = [
      { val: coprimeCandidate, isCoprime: true },
      ...nonCoprimes.map((val) => ({ val, isCoprime: false })),
    ].sort(() => Math.random() - 0.5);

    const generatedWires: Wire[] = combined.map((item, idx) => ({
      id: idx + 1,
      color: wireColors[idx].name,
      wireColorClass: wireColors[idx].class,
      val: item.val,
      cut: false,
    }));

    setWires(generatedWires);
    setTimeLeft(25);
    setIsDefused(false);
    setIsExploded(false);
    setStatusMessage(null);
  };

  useEffect(() => {
    setupRound();
  }, []);

  useEffect(() => {
    if (isDefused || isExploded) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setIsExploded(true);
          playWrongSound();
          setStatusMessage("Vaqt tugadi! Mina portladi! 💥");
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isDefused, isExploded]);

  const handleCutWire = (wire: Wire) => {
    if (isDefused || isExploded || wire.cut) return;
    playClickSound();

    const isTargetCoprime = areCoprime(coreNumber, wire.val);

    setWires((prev) => prev.map((w) => (w.id === wire.id ? { ...w, cut: true } : w)));

    if (isTargetCoprime) {
      playCorrectSound();
      playWinFanfare();
      setIsDefused(true);
      setStatusMessage(`Muvaffaqiyat! EKUB(${coreNumber}, ${wire.val}) = 1 (O'zaro tub!). Mina xavfsizlantirildi! 🛡️`);
      confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });
    } else {
      playWrongSound();
      setIsExploded(true);
      const commonGcd = gcd(coreNumber, wire.val);
      setStatusMessage(`XATO SIM! EKUB(${coreNumber}, ${wire.val}) = ${commonGcd} (1 emas!). Mina portladi! 💥`);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 bg-slate-900/80 border border-red-600/30 p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-600/20 text-red-400 rounded-xl border border-red-600/30">
            <Bomb className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Mina Zararsizlantirish
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                O'zaro Tub Sonlar Qoidasi
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Mina yadrosiga o'zaro tub (EKUB = 1) bo'lgan simni kesib minani to'xtating!
            </p>
          </div>
        </div>
        <button
          onClick={setupRound}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 text-xs font-semibold"
        >
          <RotateCcw className="w-4 h-4" />
          Qayta O'rnatish
        </button>
      </div>

      {/* Bomb Machine Terminal */}
      <div className="bg-gradient-to-b from-[#1c0d10] to-[#0d0608] border-2 border-red-600/40 rounded-3xl p-6 md:p-8 shadow-2xl mb-6 relative overflow-hidden">
        {/* Tension Timer & Core Badge */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-black/50 p-4 rounded-2xl border border-red-900/50">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500 flex items-center justify-center font-mono font-extrabold text-2xl text-red-400">
              {coreNumber}
            </div>
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider block font-mono">
                Mina Yadrosi Son:
              </span>
              <span className="text-lg font-bold text-white font-mono">{coreNumber}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <span className="text-xs text-slate-400 uppercase">Portlashgacha:</span>
            <div
              className={`px-4 py-2 rounded-xl text-2xl font-bold border-2 ${
                timeLeft <= 5
                  ? 'bg-red-600 text-white border-red-400 animate-ping'
                  : 'bg-red-950/60 text-red-400 border-red-600'
              }`}
            >
              00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </div>
          </div>
        </div>

        {/* The 4 Bomb Wires */}
        <div className="space-y-4 mb-6">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            Simlar maydoni (Faqat bittasi o'zaro tub, EKUB=1):
          </div>

          {wires.map((w) => (
            <div
              key={w.id}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 flex-1">
                {/* Visual colored wire cable */}
                <div
                  className={`h-4 flex-1 rounded-full border shadow transition-all ${w.wireColorClass} ${
                    w.cut ? 'opacity-30 border-dashed scale-y-50' : 'animate-pulse'
                  }`}
                />
                <span className="font-mono font-bold text-xl text-white min-w-[50px] text-right">
                  {w.val}
                </span>
              </div>

              <button
                onClick={() => handleCutWire(w)}
                disabled={w.cut || isDefused || isExploded}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  w.cut
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/30 active:scale-95'
                }`}
              >
                <Scissors className="w-4 h-4" />
                {w.cut ? 'Kesildi ✂️' : 'Simni Kesish'}
              </button>
            </div>
          ))}
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`p-4 rounded-2xl text-center text-sm font-bold animate-fade-in ${
              isDefused
                ? 'bg-emerald-950 border border-emerald-500 text-emerald-300'
                : 'bg-red-950 border border-red-500 text-red-300'
            }`}
          >
            {statusMessage}
          </div>
        )}
      </div>
    </div>
  );
};
