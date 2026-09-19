import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Sparkles, BrainCircuit, RefreshCw, Lightbulb, Copy, Check, Award } from 'lucide-react';
import { playClickSound, playCorrectSound } from '../utils/audio';

interface Message {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  timestamp: string;
  source?: string;
}

export const GeminiChatView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'gemini',
      text: "Assalomu alaykum! Men sizning **EKUB va EKUK bo'yicha shaxsiy Gemini AI repetitoringizman**.\n\nSizga mavzuni xohlagan murakkablik darajasida tushuntirib bera olaman, qiziqarli olimpiada masalalari tuzib, bosqichma-bosqich yechish usullarini ko'rsataman. Qanday savolingiz bor?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<'medium' | 'hard' | 'olympiad'>('hard');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const quickPrompts = [
    "EKUB va EKUKning mohiyati va farqi nima?",
    "Evklid algoritmining qadamlari va isboti",
    "Oltin formula: EKUB(a,b) · EKUK(a,b) = a · b",
    "3 ta sonning EKUB va EKUKini topish usuli",
    "Olimpiada: a + b = 120 va EKUB(a,b) = 15 bo'lsa a va b ni toping",
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    playClickSound();
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setLoading(true);

    try {
      // Build conversation history context
      const history = messages.slice(-6).map((m) => ({
        role: m.sender,
        text: m.text,
      }));

      const res = await fetch('/api/gemini/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userMsg.text,
          difficulty,
          history,
        }),
      });

      const data = await res.json();
      playCorrectSound();

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'gemini',
        text: data.answer || "Kechirasiz, javob olib bo'lmadi.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'gemini',
          text: "Server bilan bog'lanishda xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateChallenge = async () => {
    if (loading) return;
    playClickSound();
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level: difficulty }),
      });
      const data = await res.json();
      playCorrectSound();

      let challengeText = `### 🏆 Olimpiada Masalasi (${difficulty.toUpperCase()} Daraja):\n\n${data.problem}\n\n`;
      if (data.hint) {
        challengeText += `💡 **Yordam (Hint):** ${data.hint}\n\n`;
      }
      if (data.solution) {
        challengeText += `📝 **Batafsil Yechimi:**\n${data.solution}`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'gemini',
          text: challengeText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 text-white animate-fade-in flex flex-col h-[calc(100vh-140px)] min-h-[600px]">
      {/* Header Bar */}
      <div className="mb-4 p-4 md:p-5 rounded-3xl bg-slate-900/80 border border-sky-500/30 backdrop-blur-md shadow-2xl flex flex-wrap items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-2xl text-white shadow-lg shadow-sky-500/30">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
              Gemini AI Matematik Repetitor
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-mono">
                Tezkor & Murakkab
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              EKUB, EKUK, Evklid va sonlar nazariyasi bo'yicha chuqur ilmiy tushuntirishlar
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          {/* Difficulty selector */}
          <select
            value={difficulty}
            onChange={(e: any) => setDifficulty(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-sky-300 outline-none focus:border-sky-400"
          >
            <option value="medium">Daraja: O'rta</option>
            <option value="hard">Daraja: Murakkab</option>
            <option value="olympiad">Daraja: Olimpiada 🏆</option>
          </select>

          {/* Generate challenge button */}
          <button
            onClick={handleGenerateChallenge}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold hover:brightness-110 shadow-md active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Yangi Masala Tuzish
          </button>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 bg-slate-900/90 border border-slate-700/80 rounded-3xl p-4 md:p-6 overflow-y-auto space-y-4 shadow-inner mb-4">
        {messages.map((msg) => {
          const isAi = msg.sender === 'gemini';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
            >
              {isAi && (
                <div className="w-9 h-9 rounded-xl bg-sky-600/30 border border-sky-500/50 flex items-center justify-center text-sky-300 flex-shrink-0 mt-1 shadow">
                  <BrainCircuit className="w-5 h-5" />
                </div>
              )}

              <div
                className={`relative max-w-[85%] md:max-w-[75%] p-4 rounded-3xl shadow-xl leading-relaxed text-sm ${
                  isAi
                    ? 'bg-slate-800/90 border border-slate-700 text-slate-100'
                    : 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-tr-none'
                }`}
              >
                {/* Copy button for AI */}
                {isAi && (
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors"
                    title="Nusxa olish"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}

                {/* Message text with basic markdown formatting */}
                <div className="whitespace-pre-wrap font-sans text-sm md:text-base leading-relaxed space-y-2">
                  {msg.text.split('\n\n').map((paragraph, pIdx) => {
                    // Check if it's a heading
                    if (paragraph.startsWith('### ')) {
                      return (
                        <h4 key={pIdx} className="font-bold text-base text-amber-300">
                          {paragraph.replace('### ', '')}
                        </h4>
                      );
                    }
                    return (
                      <p key={pIdx} className="leading-relaxed">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>

                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{msg.timestamp}</span>
                  {msg.source && <span>Manba: {msg.source}</span>}
                </div>
              </div>

              {!isAi && (
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white flex-shrink-0 mt-1 shadow">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-600/30 border border-sky-500/50 flex items-center justify-center text-sky-300 animate-pulse">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div className="p-4 rounded-3xl bg-slate-800/90 border border-slate-700 text-slate-300 text-xs flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-sky-400" />
              <span>Gemini tahlil qilmoqda va murakkab hisob-kitob bajarmoqda...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 flex-shrink-0 text-xs">
        <span className="text-[11px] text-slate-400 flex items-center gap-1 flex-shrink-0 font-mono">
          <Lightbulb className="w-3 h-3 text-amber-400" />
          Tezkor savollar:
        </span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={loading}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 hover:border-sky-500 text-slate-300 whitespace-nowrap transition-all flex-shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 mt-2 flex-shrink-0"
      >
        <input
          type="text"
          placeholder="EKUB, EKUK yoki Evklid algoritmi haqida savolingizni yozing..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          disabled={loading}
          className="flex-1 p-4 rounded-2xl bg-slate-900/90 border border-slate-700 focus:border-sky-500 outline-none text-white text-sm placeholder:text-slate-500 shadow-xl"
        />
        <button
          type="submit"
          disabled={loading || !inputQuery.trim()}
          className="p-4 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:brightness-110 text-white transition-all shadow-lg shadow-sky-600/30 disabled:opacity-50 active:scale-95"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
