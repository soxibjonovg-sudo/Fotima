import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Timer, Trophy, CheckCircle2, XCircle, RotateCcw, Award, Zap, HelpCircle } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../../data/theoryData';
import { playCorrectSound, playWrongSound, playWinFanfare, playClickSound } from '../../utils/audio';

export const SpeedQuizGame: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(20);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<{ [qId: number]: number }>({});

  const question = QUIZ_QUESTIONS[currentIndex];

  useEffect(() => {
    if (isFinished || isAnswered) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          handleTimeOut();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, isAnswered, isFinished]);

  const handleTimeOut = () => {
    setIsAnswered(true);
    playWrongSound();
    setStreak(0);
  };

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    setUserAnswers((prev) => ({ ...prev, [question.id]: index }));

    if (index === question.correctIndex) {
      playCorrectSound();
      const bonus = timeLeft * 10;
      setScore((s) => s + 100 + bonus + streak * 30);
      setStreak((st) => st + 1);
    } else {
      playWrongSound();
      setStreak(0);
    }
  };

  const handleNext = () => {
    playClickSound();
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(20);
    } else {
      setIsFinished(true);
      playWinFanfare();
      confetti({ particleCount: 140, spread: 75, origin: { y: 0.6 } });
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setTimeLeft(20);
    setIsFinished(false);
    setUserAnswers({});
  };

  const correctCount = Object.entries(userAnswers).filter(
    ([id, ans]) => QUIZ_QUESTIONS.find((q) => q.id === Number(id))?.correctIndex === ans
  ).length;

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 bg-slate-900/80 border border-slate-700/60 p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/30">
            <Timer className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Tezkor Viktorina & Test
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                10 ta Savol
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Vaqt tugamasdan oldin javob bering, ball va zanjirlar to'plang!
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-right">
          <div>
            <span className="text-xs text-slate-400">Umumiy Ball:</span>
            <div className="text-xl font-mono font-bold text-purple-400">{score}</div>
          </div>
          {streak > 1 && (
            <div className="px-3 py-1 bg-purple-500/20 border border-purple-500/40 rounded-lg text-purple-300 text-xs font-semibold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              {streak}x
            </div>
          )}
        </div>
      </div>

      {!isFinished ? (
        <div className="bg-slate-900/90 border border-purple-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl">
          {/* Progress Bar and Timer */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex justify-between text-xs text-slate-400 font-mono mb-1.5">
                <span>Savol {currentIndex + 1} / {QUIZ_QUESTIONS.length}</span>
                <span className="text-purple-400 font-bold">{question.difficulty}</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Circular Timer badge */}
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center font-mono font-bold text-lg border-2 transition-colors ${
                timeLeft <= 5
                  ? 'bg-red-950/60 border-red-500 text-red-400 animate-pulse'
                  : 'bg-purple-950/40 border-purple-500 text-purple-300'
              }`}
            >
              {timeLeft}s
            </div>
          </div>

          {/* Question Text */}
          <h3 className="text-xl md:text-2xl font-bold text-white mb-6 leading-relaxed">
            {question.question}
          </h3>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {question.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === question.correctIndex;
              let btnStyle = 'bg-slate-800/80 border-slate-700 hover:border-purple-500 text-slate-200';

              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold shadow-md shadow-emerald-600/20';
                } else if (isSelected) {
                  btnStyle = 'bg-red-950/60 border-red-500 text-red-300';
                } else {
                  btnStyle = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between text-base active:scale-[0.98] ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-700/50 flex items-center justify-center text-xs font-mono font-bold text-purple-300">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {isAnswered && (
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 mb-6 text-xs text-slate-300 space-y-1">
              <div className="font-bold text-amber-400 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                Matematik Tushuntirish:
              </div>
              <p>{question.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-purple-600/30"
              >
                {currentIndex < QUIZ_QUESTIONS.length - 1 ? "Keyingi Savol ➡️" : "Natijani Ko'rish 🏆"}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Results View */
        <div className="bg-slate-900/90 border border-purple-500/40 rounded-3xl p-8 text-center backdrop-blur-md shadow-2xl">
          <Trophy className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-bounce" />
          <h3 className="text-3xl font-extrabold text-white mb-2">Viktorina Yakunlandi!</h3>
          <p className="text-sm text-slate-300 mb-6">
            Siz 10 ta savoldan <span className="font-bold text-emerald-400">{correctCount} tasiga</span> to'g'ri javob berdingiz.
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-8">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
              <div className="text-xs text-slate-400 mb-1">To'plangan Ball</div>
              <div className="text-2xl font-bold font-mono text-purple-400">{score}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
              <div className="text-xs text-slate-400 mb-1">Aniqlik</div>
              <div className="text-2xl font-bold font-mono text-emerald-400">
                {Math.round((correctCount / QUIZ_QUESTIONS.length) * 100)}%
              </div>
            </div>
          </div>

          <button
            onClick={restartQuiz}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold hover:brightness-110 active:scale-95 transition-all shadow-lg"
          >
            <RotateCcw className="w-5 h-5" />
            Qaytadan Boshlash
          </button>
        </div>
      )}
    </div>
  );
};
