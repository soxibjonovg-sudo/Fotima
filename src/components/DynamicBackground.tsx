import React, { useMemo } from 'react';
import { GameInfo } from '../types';

interface Props {
  bgType: GameInfo['bgType'] | 'theory' | 'gemini';
}

export const DynamicBackground: React.FC<Props> = ({ bgType }) => {
  // Generate random stable particles
  const particles = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      x: (i * 17) % 96 + 2,
      y: (i * 29) % 94 + 3,
      size: (i % 4) + 2,
      duration: 10 + (i % 8) * 2,
      delay: (i % 5) * 1.2,
    }));
  }, []);

  switch (bgType) {
    case 'arena':
      return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-gradient-to-b from-amber-950/40 via-stone-900 to-black">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:28px_28px]" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-10 right-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
          <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-black to-transparent" />
        </div>
      );

    case 'chalkboard':
      return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#12231c]">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#a7f3d0_1px,transparent_1px)] [background-size:32px_32px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,20,13,0.85)_100%)]" />
          {/* Subtle math chalkboard sketches */}
          <div className="absolute top-16 left-8 text-emerald-300/10 font-mono text-3xl select-none rotate-[-6deg]">
            EKUB(a, b) · EKUK(a, b) = a · b
          </div>
          <div className="absolute bottom-20 right-12 text-emerald-300/10 font-mono text-4xl select-none rotate-[4deg]">
            a = b · q + r
          </div>
          <div className="absolute top-1/3 right-1/4 text-emerald-300/10 font-mono text-2xl select-none rotate-[-3deg]">
            gcd(24, 36) = 12
          </div>
        </div>
      );

    case 'cyber':
      return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-slate-950">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f615_1px,transparent_1px),linear-gradient(to_bottom,#ec489915_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[100px]" />
        </div>
      );

    case 'underwater':
      return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-gradient-to-b from-[#041d2d] via-[#05283f] to-[#020e17]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(20,184,166,0.15),transparent_70%)]" />
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full border border-teal-300/20 bg-teal-400/10 animate-bounce"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size * 5}px`,
                height: `${p.size * 5}px`,
                animationDuration: `${p.duration / 2}s`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </div>
      );

    case 'volcano':
      return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#180806]">
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-red-600/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute top-1/3 left-10 w-80 h-80 bg-amber-600/10 rounded-full blur-[80px]" />
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>
      );

    case 'forest':
      return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-gradient-to-b from-[#061e14] via-[#0b291c] to-[#020d08]">
          <div className="absolute top-10 left-1/3 w-96 h-96 bg-emerald-500/15 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-green-500/10 rounded-full blur-[90px]" />
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:36px_36px]" />
        </div>
      );

    case 'nebula':
      return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#090518]">
          <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-violet-600/20 rounded-full blur-[130px]" />
          <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:32px_32px] opacity-15" />
        </div>
      );

    case 'greek':
      return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#1a140e]">
          <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:30px_30px] opacity-15" />
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-amber-600/10 to-transparent" />
          <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-yellow-700/10 rounded-full blur-3xl" />
        </div>
      );

    case 'race':
      return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#0f0714]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f43f5e10_1px,transparent_1px),linear-gradient(to_bottom,#e11d4810_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-rose-600/15 rounded-full blur-[110px]" />
        </div>
      );

    case 'vault':
      return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#0d1117]">
          <div className="absolute inset-0 bg-[radial-gradient(#64748b_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]" />
        </div>
      );

    case 'tactical':
      return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#10070a]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ef444415_1px,transparent_1px),linear-gradient(to_bottom,#ef444415_1px,transparent_1px)] bg-[size:36px_36px]" />
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-red-600/15 rounded-full blur-[120px]" />
        </div>
      );

    case 'wood':
      return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#1a1209]">
          <div className="absolute inset-0 bg-[radial-gradient(#b45309_1px,transparent_1px)] [background-size:28px_28px] opacity-15" />
          <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl" />
        </div>
      );

    case 'casino':
      return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#170821]">
          <div className="absolute inset-0 bg-[radial-gradient(#c084fc_1px,transparent_1px)] [background-size:32px_32px] opacity-15" />
          <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-fuchsia-600/15 rounded-full blur-[120px]" />
        </div>
      );

    case 'arcade':
      return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#050b18]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d415_1px,transparent_1px),linear-gradient(to_bottom,#3b82f615_1px,transparent_1px)] bg-[size:28px_28px]" />
          <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-cyan-600/20 rounded-full blur-[110px]" />
        </div>
      );

    case 'nautical':
      return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#03151e]">
          <div className="absolute top-10 right-1/4 w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-[140px]" />
          <div className="absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:36px_36px] opacity-10" />
        </div>
      );

    case 'space':
      return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#060414]">
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-600/15 rounded-full blur-[120px]" />
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full bg-white/40 animate-pulse"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${Math.max(1, p.size / 2)}px`,
                height: `${Math.max(1, p.size / 2)}px`,
                animationDuration: `${p.duration / 4}s`,
              }}
            />
          ))}
        </div>
      );

    case 'theory':
      return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-gradient-to-b from-[#0b1329] via-[#091836] to-[#040914]">
          <div className="absolute inset-0 bg-[radial-gradient(#60a5fa_1px,transparent_1px)] [background-size:32px_32px] opacity-15" />
          <div className="absolute top-20 right-1/3 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[130px]" />
          <div className="absolute bottom-20 left-1/4 w-[400px] h-[400px] bg-indigo-600/15 rounded-full blur-[110px]" />
        </div>
      );

    case 'gemini':
      return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#090b14]">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-[140px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-pink-600/15 to-indigo-600/15 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:28px_28px] opacity-15" />
        </div>
      );

    default:
      return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:32px_32px] opacity-15" />
        </div>
      );
  }
};
