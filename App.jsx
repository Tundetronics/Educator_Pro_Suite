import React, { useState } from 'react';
import { Briefcase, Volume2, X, Apple, Heart } from 'lucide-react';

/**
 * Gift 2 - Educator Pro Suite
 * RC Abuja HighRise Vocational Project 2026
 * Architect: Rtn. Babatunde Adesina — The Agentic Orchestrator
 */

const apiKey = ""; 

const App = () => {
  const [topic, setTopic] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const sanitize = (t) => t.replace(/[*#_~`\[\]()<>|]/g, '').trim();

  const speak = (t) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(t.replace(/\n/g, '. ')));
  };

  const callAI = async (prompt) => {
    setIsProcessing(true);
    const sys = "Expert pedagogical orchestrator. Provide WAEC lesson plans. Use PLAIN CONVERSATIONAL TEXT ONLY. No markdown symbols.";
    const delays = [1000, 2000, 4000];
    
    for (let i = 0; i <= delays.length; i++) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, { 
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], systemInstruction: { parts: [{ text: sys }] } }) 
        });
        if (!response.ok) throw new Error();
        const data = await response.json();
        setResult(sanitize(data.candidates?.[0]?.content?.parts?.[0]?.text || ""));
        setShowModal(true);
        setIsProcessing(false);
        return;
      } catch (e) {
        if (i === delays.length) {
          setResult("Orchestration interrupted. Retry.");
          setShowModal(true);
          setIsProcessing(false);
        } else {
          await new Promise(res => setTimeout(res, delays[i]));
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      <nav className="p-6 border-b border-blue-500/30 bg-black/50 flex justify-between items-center backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3 font-black uppercase text-sm text-blue-400"><Briefcase/><span className="tracking-widest">RC Abuja HighRise</span></div>
        <Apple className="text-yellow-500" />
      </nav>
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-10">
        <h1 className="text-6xl font-black uppercase italic tracking-tighter">Educator <span className="text-blue-500">Pro</span></h1>
        <div className="w-full max-w-xl bg-white/5 p-12 rounded-[50px] border border-white/10 shadow-2xl space-y-6 backdrop-blur-xl">
          <input value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full bg-black/40 p-6 rounded-2xl text-center text-2xl outline-none border border-white/10 focus:border-blue-500 transition-all" placeholder="Topic: e.g. Geography" />
          <button disabled={isProcessing || !topic.trim()} onClick={() => callAI(`Lesson plan for: ${topic}`)} className="w-full bg-blue-600 py-6 rounded-2xl font-black text-xl uppercase tracking-widest text-white hover:bg-blue-500 active:scale-95 transition-all">
            {isProcessing ? "Processing..." : "Orchestrate Strategy"}
          </button>
        </div>
      </main>
      <footer className="bg-[#002147] h-24 border-t-8 border-yellow-500 flex items-center justify-between px-10 mt-auto">
        <div className="text-left"><p className="text-xs font-black uppercase tracking-widest text-white">Vocational Excellence Suite</p><p className="text-[10px] uppercase text-blue-300/50">Rtn. Babatunde Adesina</p></div>
        <Heart className="text-yellow-500" size={24} />
      </footer>
      {showModal && (
        <div className="fixed inset-0 bg-black/98 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-blue-500/30 rounded-[40px] w-full max-w-5xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h2 className="text-2xl font-black uppercase text-blue-400">Lesson Architecture</h2>
              <div className="flex gap-4">
                <button onClick={() => speak(result)} className="bg-blue-600 px-8 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-500 transition-all"><Volume2 size={20}/> Listen</button>
                <button onClick={() => setShowModal(false)} className="bg-white/10 p-3 rounded-xl border border-white/10 transition-colors"><X/></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-12 text-xl text-slate-300 leading-relaxed whitespace-pre-wrap font-light">{result}</div>
          </div>
        </div>
      )}
    </div>
  );
};
export default App;
