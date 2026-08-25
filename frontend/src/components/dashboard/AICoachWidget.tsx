import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, Volume2 } from 'lucide-react';

interface AICoachWidgetProps {
  targetRole: string;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

export const AICoachWidget: React.FC<AICoachWidgetProps> = ({ targetRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `Hello! I'm your AI Coach Assistant for ${targetRole}. Ask me anything about STAR responses, system design architecture, or resume optimization!`
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsThinking(true);

    setTimeout(() => {
      let aiText = `Great question regarding ${targetRole}! `;
      if (currentInput.toLowerCase().includes('star')) {
        aiText += `The STAR method formula is: Situation (15% setting context), Task (10% target goal), Action (60% your specific technical contributions), and Result (15% metric-driven impact).`;
      } else if (currentInput.toLowerCase().includes('design') || currentInput.toLowerCase().includes('system')) {
        aiText += `For System Design, structure your answer in 4 phases: 1) Clarify Scale & Constraints, 2) Define API Endpoints, 3) Draw High-level Architecture, and 4) Deep-dive into DB Bottlenecks & Caching.`;
      } else {
        aiText += `Focus on framing your answer with direct technical terminology, clear architecture choices, and quantifiable outcomes (e.g. reduced latency by 30%).`;
      }

      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: aiText }]);
      setIsThinking(false);
    }, 800);
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 hover:scale-105 text-slate-950 font-black text-xs rounded-full shadow-2xl shadow-emerald-500/30 border border-emerald-400/40 transition-all cursor-pointer group"
        >
          <div className="w-7 h-7 rounded-full bg-slate-950 flex items-center justify-center text-emerald-400">
            <Bot className="w-4 h-4 animate-bounce" />
          </div>
          <span>AI Coach Sidekick</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </button>
      )}

      {isOpen && (
        <div className="w-80 sm:w-96 glass-panel rounded-3xl border border-emerald-500/30 shadow-2xl overflow-hidden flex flex-col h-[480px]">
          <div className="p-4 border-b border-emerald-500/20 bg-[#061410] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Bot className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-white flex items-center gap-1">
                  <span>Coach.AI Assistant</span>
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                </h3>
                <span className="text-[10px] text-emerald-400 font-semibold">Online • {targetRole}</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-[#0B2119] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 text-xs ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-emerald-500 text-slate-950 font-bold rounded-br-none'
                      : 'bg-[#061410] border border-emerald-500/15 text-slate-200 rounded-bl-none'
                  }`}
                >
                  <p>{m.text}</p>
                  {m.sender === 'ai' && (
                    <button
                      onClick={() => speak(m.text)}
                      className="mt-1.5 text-[10px] text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" /> Listen Voice
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Bot className="w-4 h-4 text-emerald-400 animate-spin" />
                <span>Coach is analyzing...</span>
              </div>
            )}
          </div>

          <div className="px-3 py-1.5 border-t border-emerald-500/10 bg-[#040D0A] flex items-center gap-1.5 overflow-x-auto text-[10px]">
            <button
              onClick={() => setInput('Give me a STAR example')}
              className="px-2 py-0.5 rounded-full bg-[#061410] hover:bg-[#0A211B] text-emerald-400 border border-emerald-500/20 whitespace-nowrap cursor-pointer"
            >
              ⭐ STAR Formula
            </button>
            <button
              onClick={() => setInput('System Design steps')}
              className="px-2 py-0.5 rounded-full bg-[#061410] hover:bg-[#0A211B] text-teal-300 border border-emerald-500/20 whitespace-nowrap cursor-pointer"
            >
              📐 System Design
            </button>
          </div>

          <div className="p-3 border-t border-emerald-500/20 bg-[#061410] flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask AI Coach..."
              className="flex-1 bg-[#040D0A] border border-emerald-500/20 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-400/60"
            />
            <button
              onClick={handleSend}
              className="p-2 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black rounded-xl cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AICoachWidget;
