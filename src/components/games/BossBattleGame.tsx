import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ShieldAlert, Zap, Flame, Heart, RotateCcw, Award } from 'lucide-react';
import { gcd, getDivisors } from '../../utils/math';
import { playCorrectSound, playWrongSound, playWinFanfare, playClickSound } from '../../utils/audio';

export const BossBattleGame: React.FC = () => {
  const [bossNumber, setBossNumber] = useState<number>(180);
  const [bossHp, setBossHp] = useState<number>(180);
  const [playerHp, setPlayerHp] = useState<number>(100);
  const [battleLog, setBattleLog] = useState<string[]>(["Jang boshlandi! Titan qalqoni: 180"]);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [isDefeat, setIsDefeat] = useState<boolean>(false);

  const heroWeapons = [12, 18, 24, 30, 45];

  const handleWeaponStrike = (weaponVal: number) => {
    if (isVictory || isDefeat) return;
    playClickSound();

    const strikeGcd = gcd(bossHp, weaponVal);

    if (strikeGcd > 1) {
      playCorrectSound();
      const dmg = strikeGcd * 3;
      const nextHp = Math.max(0, bossHp - dmg);
      setBossHp(nextHp);

      const logMsg = `⚔️ EKUB(${bossHp}, ${weaponVal}) = ${strikeGcd}! Siz Titanga ${dmg} ta kritik zarba berdingiz!`;
      setBattleLog((prev) => [logMsg, ...prev.slice(0, 4)]);

      if (nextHp === 0) {
        setIsVictory(true);
        playWinFanfare();
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      }
    } else {
      playWrongSound();
      const counterDmg = 25;
      const nextPlayerHp = Math.max(0, playerHp - counterDmg);
      setPlayerHp(nextPlayerHp);

      const logMsg = `❌ O'zaro tub! EKUB(${bossHp}, ${weaponVal}) = 1. Qalqon tebranmadi, Titan sizga ${counterDmg} zarba berdi!`;
      setBattleLog((prev) => [logMsg, ...prev.slice(0, 4)]);

      if (nextPlayerHp === 0) {
        setIsDefeat(true);
      }
    }
  };

  const handlePrimeArrow = (prime: number) => {
    if (isVictory || isDefeat) return;
    playClickSound();

    if (bossHp % prime === 0) {
      playCorrectSound();
      const dmg = prime * 8;
      const nextHp = Math.max(0, bossHp - dmg);
      setBossHp(nextHp);

      const logMsg = `🏹 Tub o'q: ${bossHp} soni ${prime} ga bo'linadi! ${dmg} zarar yetkazildi!`;
      setBattleLog((prev) => [logMsg, ...prev.slice(0, 4)]);

      if (nextHp === 0) {
        setIsVictory(true);
        playWinFanfare();
        confetti({ particleCount: 150, spread: 80 });
      }
    } else {
      playWrongSound();
      const counterDmg = 20;
      const nextPlayerHp = Math.max(0, playerHp - counterDmg);
      setPlayerHp(nextPlayerHp);

      const logMsg = `❌ Xato o'q: ${bossHp} soni ${prime} ga qoldiqsiz bo'linmaydi! Titan sizga ${counterDmg} zarba berdi!`;
      setBattleLog((prev) => [logMsg, ...prev.slice(0, 4)]);

      if (nextPlayerHp === 0) {
        setIsDefeat(true);
      }
    }
  };

  const restartBattle = () => {
    const bosses = [144, 180, 216, 240, 300];
    const newBoss = bosses[Math.floor(Math.random() * bosses.length)];
    setBossNumber(newBoss);
    setBossHp(newBoss);
    setPlayerHp(100);
    setIsVictory(false);
    setIsDefeat(false);
    setBattleLog([`Yangi jang boshlandi! Titan qalqoni: ${newBoss}`]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 bg-slate-900/80 border border-red-500/30 p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-600/20 text-red-400 rounded-xl border border-red-500/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Raqamlar Jangchisi (Boss Fight)
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                Matematik Titan
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              EKUB va tub bo'luvchilar yordamida Titan qalqonini yakson qiling!
            </p>
          </div>
        </div>
        <button
          onClick={restartBattle}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 text-xs font-semibold"
        >
          <RotateCcw className="w-4 h-4" />
          Yangi Boss
        </button>
      </div>

      {/* Battle Arena */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Boss Card */}
        <div className="bg-gradient-to-b from-red-950/70 to-slate-900/90 border border-red-500/40 rounded-3xl p-6 text-center shadow-xl">
          <div className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-red-600/20 border-2 border-red-500 flex items-center justify-center text-4xl shadow-lg shadow-red-600/30 animate-pulse">
            👹
          </div>
          <h3 className="text-xl font-bold text-red-400 mb-1">Raqamlar Titani</h3>
          <div className="text-3xl font-extrabold font-mono text-white mb-3">{bossHp} HP</div>

          {/* Boss HP Bar */}
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-500"
              style={{ width: `${(bossHp / bossNumber) * 100}%` }}
            />
          </div>
          <div className="text-xs text-slate-400 font-mono">Qalqon: {bossHp} / {bossNumber}</div>
        </div>

        {/* Player Card */}
        <div className="bg-gradient-to-b from-blue-950/70 to-slate-900/90 border border-blue-500/40 rounded-3xl p-6 text-center shadow-xl">
          <div className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-blue-600/20 border-2 border-blue-500 flex items-center justify-center text-4xl shadow-lg shadow-blue-600/30">
            🧙‍♂️
          </div>
          <h3 className="text-xl font-bold text-blue-400 mb-1">Qahramon Matematik</h3>
          <div className="text-3xl font-extrabold font-mono text-white mb-3">{playerHp} HP</div>

          {/* Player HP Bar */}
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${playerHp}%` }}
            />
          </div>
          <div className="text-xs text-slate-400 font-mono flex items-center justify-center gap-1">
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
            Salomatlik: {playerHp} / 100
          </div>
        </div>
      </div>

      {/* Battle Controls */}
      {!isVictory && !isDefeat ? (
        <div className="bg-slate-900/90 border border-slate-700 rounded-3xl p-6 backdrop-blur-md shadow-xl mb-6">
          <div className="mb-6">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              1. EKUB Qilichi bilan zarba (Katta umumiy bo'luvchi = katta zarar):
            </div>
            <div className="grid grid-cols-5 gap-2">
              {heroWeapons.map((w) => (
                <button
                  key={w}
                  onClick={() => handleWeaponStrike(w)}
                  className="py-3 px-2 rounded-xl bg-slate-800 hover:bg-amber-600 hover:text-white border border-slate-700 hover:border-amber-400 text-base font-bold font-mono text-amber-300 transition-all active:scale-95 text-center shadow"
                >
                  ⚔️ {w}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
              <Flame className="w-4 h-4" />
              2. Tub Sonli O'q (Agar {bossHp} ga bo'linsa):
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[2, 3, 5, 7].map((p) => (
                <button
                  key={p}
                  onClick={() => handlePrimeArrow(p)}
                  className="py-3 px-2 rounded-xl bg-slate-800 hover:bg-emerald-600 hover:text-white border border-slate-700 hover:border-emerald-400 text-base font-bold font-mono text-emerald-300 transition-all active:scale-95 text-center shadow"
                >
                  🏹 Tub {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : isVictory ? (
        <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950 to-teal-950 border-2 border-emerald-400 text-center mb-6 shadow-2xl">
          <Award className="w-16 h-16 text-emerald-400 mx-auto mb-3 animate-bounce" />
          <h3 className="text-3xl font-bold text-white mb-2">TITAN MAG'LUB ETILDI! 🏆</h3>
          <p className="text-slate-300 text-sm mb-6">
            Siz umumiy bo'luvchilar va tub sonlarni mohirona qo'llab, Titanni yengdingiz!
          </p>
          <button
            onClick={restartBattle}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm transition-all"
          >
            Yangi Boss Bilan Jang
          </button>
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-gradient-to-r from-red-950 to-slate-900 border-2 border-red-500 text-center mb-6 shadow-2xl">
          <h3 className="text-3xl font-bold text-red-400 mb-2">Qahramon Yiqildi! 💀</h3>
          <p className="text-slate-300 text-sm mb-6">
            O'zaro tub sonlarni tanlash Titanning qarshi hujumiga sabab bo'ldi.
          </p>
          <button
            onClick={restartBattle}
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-all"
          >
            Qayta Urinib Ko'rish
          </button>
        </div>
      )}

      {/* Battle Log */}
      <div className="bg-black/60 border border-slate-800 rounded-2xl p-4 font-mono text-xs space-y-1.5 text-slate-300">
        <div className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Jang Tarixi:</div>
        {battleLog.map((log, idx) => (
          <div key={idx} className={idx === 0 ? 'text-amber-300 font-bold' : 'text-slate-400'}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};
