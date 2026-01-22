import React, { useState } from 'react';
import { 
  Briefcase, BookOpen, Volume2, X, 
  Settings, Heart, Sparkles, FileText, CheckCircle2
} from 'lucide-react';

const apiKey = ""; 

const App = () => {
  const [topic, setTopic] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const callAI = async (prompt) => {
    setIsProcessing(true);
    const sys = "Expert pedagogical assistant for GSS Garki teachers. Draft a professional, WAEC-compliant lesson plan including objectives, content, and evaluation. Plain text only. No markdown.";
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: sys }] }
        }) 
      });
      const d = await r.json();
      return d.candidates[0].content.parts[0].text;
    } catch (e) { return "Deployment interrupted."; } finally { setIsProcessing(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans">
      <nav className="p-6 border-b border-white/10 bg-slate-900/50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Briefcase className="text-blue-500" />
          <span className="font-black tracking-widest uppercase text-sm">Educator Pro</span>
        </div>
        <div className="text-[10px] font-bold text-yellow-500 tracking-[0.3em] uppercase">Teacher Support Suite</div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-12">
        <div className="text-center space-y-4 max-w-3xl">
          <h1 className="text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-none">
            Strategic <br/><span className="text-blue-500 italic">Pedagogy</span>
          </h1>
          <p className="text-xl text-slate-400 font-light">Enter a topic to orchestrate a high-impact lesson plan in seconds.</p>
        </div>

        <div className="w-full max-w-xl space-y-6">
          <div className="bg-white/5 p-10 rounded-[40px] border border-white/10 shadow-2xl relative">
            <input 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-black/40 p-6 rounded-2xl text-white text-center text-2xl outline-none border border-white/10 focus:border-blue-500 transition-all mb-6"
              placeholder="e.g. Organic Chemistry"
            />
            <button 
              onClick={async () => {
                const res = await callAI(`Lesson on: ${topic}`);
                setResult(res); setShowModal(true);
              }}
              className="w-full bg-slate-700 hover:bg-slate-600 py-6 rounded-2xl font-black text-xl uppercase tracking-widest transition-all flex items-center justify-center gap-3"
            >
              <FileText size={24}/> Draft Lesson Strategy
            </button>
          </div>
          
          <div className="flex justify-center gap-12 text-slate-500 uppercase font-black text-[10px] tracking-widest">
            <span className="flex items-center gap-2"><CheckCircle2 size={12}/> WAEC Standards</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={12}/> Rapid Prep</span>
          </div>
        </div>
      </main>

      <footer className="bg-blue-900 h-20 border-t-8 border-yellow-500 flex items-center justify-between px-10">
        <div className="flex items-center gap-4">
          <Settings className="text-yellow-500" size={24} />
          <p className="text-sm lg:text-lg font-black text-white uppercase">The Rotary Club of Abuja HighRise</p>
        </div>
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Service Above Self</p>
      </footer>

      {showModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[100] flex items-center justify-center p-6">
          <div className="bg-slate-900 border-2 border-blue-500/40 rounded-[40px] w-full max-w-5xl max-h-[85vh] flex flex-col shadow-2xl">
            <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h2 className="text-2xl font-black text-white uppercase">Lesson Strategy: {topic}</h2>
              <button onClick={() => setShowModal(false)} className="bg-white/10 p-3 rounded-xl text-white"><X/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-12 text-xl text-slate-300 leading-relaxed whitespace-pre-wrap font-light italic">
              {result}
            </div>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="fixed inset-0 bg-black/90 z-[200] flex flex-col items-center justify-center space-y-6">
          <div className="h-20 w-20 border-8 border-t-blue-500 border-white/5 rounded-full animate-spin"></div>
          <p className="text-xl font-black text-white uppercase tracking-[0.5em] animate-pulse">Drafting Strategy...</p>
        </div>
      )}
    </div>
  );
};

export default App;
