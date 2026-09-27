import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowRight,
  Bot,
  ChevronRight,
  Loader2,
  MessageSquare, 
  Send,
  ShieldCheck,
  Sparkles,
  User,
  Wind,
} from 'lucide-react';
import { Patient, TabType } from '../types';
import { api } from '../services/api';

interface NexusAiChatProps {
  patient: Patient;
  onNavigate: (tab: TabType) => void;
  onOpenBreathing: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; actionTab?: TabType; isBreathing?: boolean }[];
}

export const NexusAiChat: React.FC<NexusAiChatProps> = ({
  patient,
  onNavigate,
  onOpenBreathing,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Hello ${patient.name.split(' ')[0]}! I'm your HealthNexus AI Assistant. I can help explain your medical reports, track physiological shifts across time, and connect your physical vitals with mental well-being.\n\nHow can I support your health journey today?`,
      timestamp: 'Just now',
      suggestedActions: [
        { label: 'View "What Changed?"', actionTab: 'whatchanged' },
        { label: 'Review HealthPulse Breakdown', actionTab: 'healthpulse' },
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Explain my HbA1c increase from 7.4% to 8.2%',
    'Why does work stress cause my blood pressure to rise?',
    'What questions should I ask my doctor about my kidneys?',
    'How does 2-min breathing improve my autonomic balance?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await api.sendChatMessage(query, {
        name: patient.name,
        age: patient.age,
        conditions: patient.conditions,
        healthPulseScore: patient.healthPulseScore,
        vitals: 'BP 148/94, HbA1c 8.2%, Stress 7.8/10',
      });

      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: res.suggestedActions,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5EAEA] shadow-xs h-[calc(100vh-140px)] flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#E5EAEA] flex items-center justify-between bg-white z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#168A6A] to-[#22A07C] text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm text-[#16302A]">Nexus AI Health Copilot</h2>
              <span className="bg-[#E8F7F1] text-[#168A6A] text-[10px] font-bold px-2 py-0.5 rounded-full">
                Gemini 2.5 Decision Support
              </span>
            </div>
            <p className="text-[11px] text-[#64748B]">Context: {patient.name} &bull; Vitals & Lab Records Synced</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-xs text-[#168A6A] font-semibold bg-[#E8F7F1] px-2.5 py-1 rounded-xl">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Clinical Explainability Guardrails</span>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#F8FAFA]">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isUser ? 'bg-[#3B82C4] text-white' : 'bg-[#168A6A] text-white'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`space-y-2 max-w-xl ${isUser ? 'items-end text-right' : 'items-start text-left'}`}>
                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    isUser
                      ? 'bg-[#3B82C4] text-white rounded-tr-none shadow-xs'
                      : 'bg-white border border-[#E5EAEA] text-[#16302A] rounded-tl-none shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>

                {/* Suggested Action Pills */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestedActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          if (action.isBreathing) onOpenBreathing();
                          else if (action.actionTab) onNavigate(action.actionTab);
                        }}
                        className="px-3 py-1 rounded-xl bg-white hover:bg-[#E8F7F1] border border-[#168A6A]/30 text-[#168A6A] text-[11px] font-bold shadow-xs transition-all flex items-center gap-1"
                      >
                        {action.isBreathing ? <Wind className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                        <span>{action.label}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[10px] text-[#64748B] block px-1">{msg.timestamp}</span>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#168A6A] text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 bg-white border border-[#E5EAEA] rounded-2xl rounded-tl-none text-xs text-[#64748B] flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#168A6A]" />
              <span>Analyzing clinical context & crafting response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Carousel */}
      <div className="p-2.5 bg-white border-t border-[#E5EAEA] flex items-center gap-1.5 overflow-x-auto text-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] shrink-0 mr-1">
          Suggestions:
        </span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="shrink-0 px-2.5 py-1 rounded-xl bg-[#F8FAFA] hover:bg-[#E8F7F1] border border-[#E5EAEA] text-[#16302A] text-[11px] font-medium transition-all"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3.5 bg-white border-t border-[#E5EAEA]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your health, vitals, lab reports, or well-being..."
            className="flex-1 bg-[#F8FAFA] text-[#16302A] text-xs px-4 py-2.5 rounded-xl border border-[#E5EAEA] focus:outline-none focus:border-[#168A6A] focus:bg-white transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-[#168A6A] hover:bg-[#127257] disabled:opacity-40 text-white transition-all shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[10px] text-[#64748B] text-center mt-2">
          HealthNexus AI is a clinical decision-support tool. It does not replace direct medical advice from a physician.
        </p>
      </div>
    </div>
  );
};
