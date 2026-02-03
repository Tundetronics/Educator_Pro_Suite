import React, { useState } from 'react';
import { Briefcase, Volume2, X, Heart } from 'lucide-react';

const apiKey = ""; 

const App = () => {
  const [topic, setTopic] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const cleanText = (text) => {
    return text.replace(/[*#_~`\[\]()<>|]/g, '').trim();
  };

  const speak = (text) => {
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text.replace(/\n/g, '. ')));
  };

  const callAI = async (prompt) => {
    setIsProcessing(true);
    const sys = "Expert pedagogical orchestrator. Provide WAEC lesson plans. Use PLAIN TEXT ONLY. No markdown, no asterisks, no hashes. Just clear text.";
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, { 
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], systemInstruction: { parts: [{ text: sys }] } }) 
      });
      const d = await r.json();
      return cleanText(d.candidates[0].content.parts[0].text);
    } catch (e) { return "System Busy."; } finally { setIsProcessing(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      <nav className="p-6 border-b border-blue-500/30 bg-black/50 flex justify-between items-center">
        <div className="flex items-center gap-3 font-black uppercase text-sm text-blue-400"><Briefcase/><span className="tracking-widest">RC Abuja HighRise</span></div>
        <img src="https://upload.wikimedia.org/wikipedia/en/thumb/0/06/Rotary_International_logo.svg/1200px-Rotary_International_logo.svg.png" className="h-10 brightness-0 invert" alt="Rotary" />
      </nav>
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-10">
        <h1 className="text-6xl font-black uppercase italic tracking-tighter">Educator <span className="text-blue-500">Pro</span></h1>
        <div className="w-full max-w-xl bg-white/5 p-12 rounded-[50px] border border-white/10 shadow-2xl space-y-6">
          <input value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full bg-black/40 p-6 rounded-2xl text-center text-2xl outline-none border border-white/10 focus:border-blue-500" placeholder="e.g. Calculus Introduction" />
          <button onClick={async () => { const res = await callAI(`Draft strategy for: ${topic}`); setResult(res); setShowModal(true); }} className="w-full bg-blue-600 py-6 rounded-2xl font-black text-xl uppercase tracking-widest text-white hover:bg-blue-500 transition-all">Orchestrate Strategy</button>
        </div>
      </main>
      <footer className="bg-[#002147] h-24 border-t-8 border-yellow-500 flex items-center justify-between px-10">
        <div className="flex flex-col items-start"><p className="text-xs font-black uppercase tracking-widest text-white">Vocational Service Month 2026</p><p className="text-[10px] opacity-50 uppercase text-blue-200">Architect: Rtn. Babatunde Adesina</p></div>
        <Heart className="text-yellow-500" />
      </footer>
      {showModal && (
        <div className="fixed inset-0 bg-black/98 z-[100] flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-blue-500/30 rounded-[40px] w-full max-w-5xl max-h-[85vh] flex flex-col shadow-2xl">
            <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h2 className="text-2xl font-black uppercase text-blue-400">Strategy Output</h2>
              <div className="flex gap-4"><button onClick={() => speak(result)} className="bg-blue-600 px-8 py-2 rounded-xl font-bold flex items-center gap-2"><Volume2 size={20}/> Listen</button><button onClick={() => setShowModal(false)} className="bg-white/10 p-3 rounded-xl"><X/></button></div>
            </div>
            <div className="flex-1 overflow-y-auto p-12 text-xl text-slate-300 leading-relaxed whitespace-pre-wrap">{result}</div>
          </div>
        </div>
      )}
      {isProcessing && <div className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center font-black uppercase text-2xl animate-pulse">Processing...</div>}
    </div>
  );
};
export default App;
