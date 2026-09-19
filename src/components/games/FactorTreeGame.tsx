import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { GitBranch, RotateCcw, Check, Sparkles, Award } from 'lucide-react';
import { isPrime, getPrimeFactorCounts } from '../../utils/math';
import { playCorrectSound, playWrongSound, playWinFanfare, playClickSound } from '../../utils/audio';

interface TreeNode {
  id: string;
  val: number;
  isPrimeNode: boolean;
  children?: [TreeNode, TreeNode];
}

export const FactorTreeGame: React.FC = () => {
  const initialNumbers = [36, 48, 60, 72, 84, 90, 100, 120];
  const [rootNum, setRootNum] = useState<number>(60);
  const [tree, setTree] = useState<TreeNode>(() => ({
    id: 'root',
    val: 60,
    isPrimeNode: false,
  }));
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [splitInput, setSplitInput] = useState<{ a: string; b: string }>({ a: '', b: '' });
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Check if all leaves are prime
  const checkCompletion = (node: TreeNode): boolean => {
    if (!node.children) {
      return isPrime(node.val);
    }
    return checkCompletion(node.children[0]) && checkCompletion(node.children[1]);
  };

  const handleSelectNode = (node: TreeNode) => {
    if (node.children || isPrime(node.val)) return;
    playClickSound();
    setSelectedNode(node);
    setSplitInput({ a: '', b: '' });
    setErrorMsg(null);
  };

  const handleSplitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNode) return;

    const numA = parseInt(splitInput.a, 10);
    const numB = parseInt(splitInput.b, 10);

    if (isNaN(numA) || isNaN(numB) || numA <= 1 || numB <= 1) {
      playWrongSound();
      setErrorMsg("Ikkala son ham 1 dan katta bo'lishi kerak!");
      return;
    }

    if (numA * numB !== selectedNode.val) {
      playWrongSound();
      setErrorMsg(`${numA} × ${numB} = ${numA * numB}, lekin bizga ${selectedNode.val} kerak!`);
      return;
    }

    playCorrectSound();
    setErrorMsg(null);

    // Recursively update node in tree
    const updateNode = (curr: TreeNode): TreeNode => {
      if (curr.id === selectedNode.id) {
        return {
          ...curr,
          children: [
            {
              id: `${curr.id}-L`,
              val: numA,
              isPrimeNode: isPrime(numA),
            },
            {
              id: `${curr.id}-R`,
              val: numB,
              isPrimeNode: isPrime(numB),
            },
          ],
        };
      }
      if (curr.children) {
        return {
          ...curr,
          children: [updateNode(curr.children[0]), updateNode(curr.children[1])],
        };
      }
      return curr;
    };

    const newTree = updateNode(tree);
    setTree(newTree);
    setSelectedNode(null);

    if (checkCompletion(newTree)) {
      setIsCompleted(true);
      playWinFanfare();
      confetti({ particleCount: 120, spread: 70 });
    }
  };

  const handleReset = (num: number) => {
    setRootNum(num);
    setTree({
      id: 'root',
      val: num,
      isPrimeNode: false,
    });
    setSelectedNode(null);
    setIsCompleted(false);
    setErrorMsg(null);
  };

  // Render tree nodes recursively
  const renderTree = (node: TreeNode) => {
    const isLeaf = !node.children;
    const isNodePrime = isPrime(node.val);
    const isSelected = selectedNode?.id === node.id;

    return (
      <div key={node.id} className="flex flex-col items-center">
        {/* Node bubble */}
        <button
          onClick={() => handleSelectNode(node)}
          disabled={!isLeaf || isNodePrime}
          className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex flex-col items-center justify-center font-mono font-bold text-lg md:text-xl transition-all shadow-lg ${
            isNodePrime
              ? 'bg-emerald-600 border-2 border-emerald-300 text-white shadow-emerald-500/40'
              : isSelected
              ? 'bg-amber-500 border-2 border-white text-black scale-110 ring-4 ring-amber-400/40'
              : isLeaf
              ? 'bg-slate-800 hover:bg-slate-700 border-2 border-amber-400/60 text-amber-300 animate-pulse'
              : 'bg-slate-900 border border-slate-700 text-slate-300'
          }`}
        >
          <span>{node.val}</span>
          {isNodePrime && (
            <span className="text-[10px] font-sans font-semibold text-emerald-200">Tub</span>
          )}
        </button>

        {/* Children branches */}
        {node.children && (
          <div className="relative mt-4 flex gap-8 md:gap-16 pt-4 border-t-2 border-slate-700">
            {renderTree(node.children[0])}
            {renderTree(node.children[1])}
          </div>
        )}
      </div>
    );
  };

  // Calculate canonical factorization string
  const factorMap = getPrimeFactorCounts(rootNum);
  const factorString = Object.entries(factorMap)
    .map(([prime, count]) => (count > 1 ? `${prime}<sup>${count}</sup>` : `${prime}`))
    .join(' · ');

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 bg-slate-900/80 border border-emerald-500/30 p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <GitBranch className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Tub Ko'paytuvchilar Daraxti
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Kanonik Yoyilma
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Sonlarni shoxlarga ajrating: barcha barglar tub son bo'lguncha davom eting!
            </p>
          </div>
        </div>
      </div>

      {/* Number Selection Bar */}
      <div className="flex flex-wrap items-center gap-2 mb-6 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <span className="text-xs text-slate-400 mr-2 font-mono">Boshlang'ich son:</span>
        {initialNumbers.map((num) => (
          <button
            key={num}
            onClick={() => handleReset(num)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              rootNum === num
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {num}
          </button>
        ))}
      </div>

      {/* Tree Visualization Stage */}
      <div className="bg-gradient-to-b from-[#0a2318]/90 via-[#071912]/80 to-[#030d09]/90 border border-emerald-500/30 rounded-3xl p-6 md:p-10 flex flex-col items-center justify-center min-h-[380px] shadow-2xl mb-6 overflow-x-auto">
        {renderTree(tree)}
      </div>

      {/* Split Input Dialog / Action Panel */}
      {selectedNode && (
        <form
          onSubmit={handleSplitSubmit}
          className="p-6 rounded-3xl bg-slate-900/95 border-2 border-amber-500/80 shadow-2xl backdrop-blur-md mb-6 max-w-lg mx-auto text-center animate-fade-in"
        >
          <h4 className="text-lg font-bold text-white mb-2">
            <span className="text-amber-400 font-mono text-xl">{selectedNode.val}</span> sonini ikkita ko'paytuvchiga ajrating:
          </h4>
          <p className="text-xs text-slate-400 mb-4">
            Ko'paytmasi {selectedNode.val} ga teng bo'lgan ikkita sonni kiriting (masalan: 6 × 10 = 60).
          </p>

          <div className="flex items-center justify-center gap-3 mb-4 font-mono">
            <input
              type="number"
              min="2"
              placeholder="A"
              value={splitInput.a}
              onChange={(e) => setSplitInput({ ...splitInput, a: e.target.value })}
              className="w-24 p-3 text-center text-xl font-bold bg-slate-800 border border-slate-600 rounded-xl focus:border-amber-400 outline-none text-amber-300"
              autoFocus
            />
            <span className="text-2xl text-slate-500 font-bold">×</span>
            <input
              type="number"
              min="2"
              placeholder="B"
              value={splitInput.b}
              onChange={(e) => setSplitInput({ ...splitInput, b: e.target.value })}
              className="w-24 p-3 text-center text-xl font-bold bg-slate-800 border border-slate-600 rounded-xl focus:border-amber-400 outline-none text-amber-300"
            />
            <span className="text-2xl text-slate-500 font-bold">=</span>
            <span className="text-2xl font-bold text-amber-400">{selectedNode.val}</span>
          </div>

          {errorMsg && <div className="text-xs text-red-400 font-semibold mb-3">{errorMsg}</div>}

          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedNode(null)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 hover:bg-slate-700 text-xs font-semibold"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-lg shadow-amber-500/30"
            >
              Shoxlash 🌿
            </button>
          </div>
        </form>
      )}

      {/* Completion Banner */}
      {isCompleted && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border-2 border-emerald-400 text-center shadow-2xl animate-fade-in">
          <Award className="w-12 h-12 text-emerald-400 mx-auto mb-2 animate-bounce" />
          <h3 className="text-2xl font-bold text-white mb-2">Barcha shoxlar tub songa yetdi! 🌳</h3>
          <div
            className="text-xl font-mono text-emerald-300 bg-black/40 py-2 px-6 rounded-xl inline-block border border-emerald-500/40 mb-4"
            dangerouslySetInnerHTML={{ __html: `${rootNum} = ${factorString}` }}
          />
          <p className="text-xs text-slate-300">
            Arifmetikaning asosiy teoremasiga ko'ra, har qanday murakkab son yagona kanonik yoyilmaga ega!
          </p>
        </div>
      )}
    </div>
  );
};
