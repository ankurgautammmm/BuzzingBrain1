import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  User, 
  BookOpen, 
  Flame, 
  Loader2,
  Minimize2,
  Maximize2,
  Trash2
} from 'lucide-react';
import { ChatMessage, NoteContentPayload } from '../types';

interface AiTutorChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeNote?: NoteContentPayload | null;
  onApplyCommand?: (command: string) => void;
}

export const AiTutorChatDrawer: React.FC<AiTutorChatDrawerProps> = ({
  isOpen,
  onClose,
  activeNote,
  onApplyCommand,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Namaste! I'm your Buzzing Brain AI Tutor 🎓. Free education for all! Ask me anything about your Class 9, 10, 11, or 12 NCERT syllabus, request a derivation breakdown, or ask for memory mnemonics!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputPrompt.trim() || isLoading) return;

    const userText = inputPrompt.trim();
    setInputPrompt('');

    const newMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const nextHistory = [...messages, newMsg];
    setMessages(nextHistory);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextHistory.map(m => ({ role: m.role, text: m.text })),
          contextNote: activeNote || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat error: ${response.statusText}`);
      }

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'model',
        text: data.reply || "I've reviewed your question. Let me know how else I can assist!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...nextHistory, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'model',
        text: "I encountered a brief connection issue. Please check your network and try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...nextHistory, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'reset',
        role: 'model',
        text: "Conversation cleared. How can I assist your NCERT preparation now?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

  const suggestedQuestions = activeNote ? [
    `Explain "${activeNote.chapter}" in simpler terms`,
    `Give me a 5-mark CBSE question for ${activeNote.subject}`,
    `Write a mnemonic for ${activeNote.topic || activeNote.chapter}`,
  ] : [
    "What are the top 3 high-yield chapters in Class 10 Science?",
    "How do I craft a /handwriting command with high thinking?",
    "Explain Fleming's Left-Hand Rule with an example",
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-md bg-white rounded-3xl shadow-2xl border-2 border-slate-300 overflow-hidden flex flex-col h-[560px] animate-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm flex items-center gap-1.5">
              <span>Buzzing Brain AI Tutor</span>
              <span className="text-[10px] bg-purple-900/60 text-purple-300 px-1.5 py-0.5 rounded border border-purple-700/60 font-mono">
                Gemini 3.5
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              {activeNote ? `Context: ${activeNote.chapter}` : 'AI Study Buddy & Doubts Solver'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleClearHistory}
            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Thread */}
      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-purple-600 text-white'
            }`}>
              {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div className={`max-w-[80%] rounded-2xl p-3 shadow-2xs ${
              msg.role === 'user'
                ? 'bg-amber-500 text-slate-950 rounded-tr-xs font-medium'
                : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs leading-relaxed'
            }`}>
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <div className={`text-[10px] mt-1 text-right ${msg.role === 'user' ? 'text-slate-900/70' : 'text-slate-400'}`}>
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-3 text-slate-500 flex items-center gap-2 shadow-2xs">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600" />
              <span>Scribble Tutor is thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-3 py-1.5 bg-slate-100 border-t border-slate-200 flex gap-1.5 overflow-x-auto text-[11px]">
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => {
              setInputPrompt(q);
            }}
            className="whitespace-nowrap px-2.5 py-1 bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-800 rounded-lg border border-slate-200 transition-colors shadow-2xs cursor-pointer font-medium"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Row */}
      <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="Ask a question about this chapter or syllabus..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !inputPrompt.trim()}
          className="p-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
