import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/api';
import { CoachConversation, CoachMessage } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  MessageSquare,
  Sparkles,
  Send,
  Plus,
  Bot,
  User,
  Clock,
  Target,
  FileText,
  AlertCircle,
} from 'lucide-react';

export const CareerCoachPage: React.FC = () => {
  const { profile } = useAuth();
  const [conversations, setConversations] = useState<CoachConversation[]>([]);
  const [currentConvoId, setCurrentConvoId] = useState<string | null>(null);
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const list = await apiRequest<CoachConversation[]>('/coach/conversations');
      setConversations(list || []);
      if (list && list.length > 0) {
        setCurrentConvoId(list[0].id);
        await loadMessages(list[0].id);
      } else {
        await startNewConversation();
      }
    } catch (err) {
      console.warn('Could not load conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (convoId: string) => {
    try {
      const msgs = await apiRequest<CoachMessage[]>(`/coach/conversations/${convoId}`);
      setMessages(msgs || []);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const startNewConversation = async () => {
    try {
      const newConvo = await apiRequest<CoachConversation>('/coach/conversations', {
        method: 'POST',
        body: JSON.stringify({ title: 'New Career Strategy Session' }),
      });
      setConversations(prev => [newConvo, ...prev]);
      setCurrentConvoId(newConvo.id);
      setMessages([]);
    } catch (err) {
      console.error('Failed to start new conversation:', err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim() || sending) return;

    if (!customPrompt) {
      setInputMessage('');
    }

    setSending(true);

    // Optimistically add user message
    const tempUserMsg: CoachMessage = {
      id: 'temp-' + Date.now(),
      conversation_id: currentConvoId || '',
      sender: 'user',
      content: textToSend,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      const data = await apiRequest<{ conversation_id: string; message: CoachMessage }>('/coach/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: textToSend,
          conversation_id: currentConvoId,
        }),
      });

      if (!currentConvoId) {
        setCurrentConvoId(data.conversation_id);
      }

      setMessages(prev => [...prev.filter(m => m.id !== tempUserMsg.id), tempUserMsg, data.message]);
    } catch (err: any) {
      alert(err.message || 'Failed to receive coach response.');
    } finally {
      setSending(false);
    }
  };

  const quickPrompts = [
    'How should I prepare for system design interviews?',
    'Review my current skillset and suggest my next capstone project',
    'How can I explain missing database experience during an interview?',
    'Help me create a weekly study schedule for 10 hours',
  ];

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col md:flex-row gap-6">
      {/* Left Sidebar: Conversations & Active Context */}
      <div className="w-full md:w-80 flex flex-col gap-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-navy-950 text-base">AI Career Coach</h2>
          <Button size="sm" variant="outline" onClick={startNewConversation} icon={<Plus className="w-4 h-4" />}>
            New Session
          </Button>
        </div>

        {/* Profile Context Pill */}
        <Card className="p-3.5 bg-brand-50/50 border-brand-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider">Active Context Loaded</span>
            <Badge size="sm" variant="purple">Connected</Badge>
          </div>
          <p className="text-xs font-semibold text-navy-900 truncate">
            Target: {profile?.target_role || 'Not set yet'}
          </p>
          <p className="text-[11px] text-navy-600 line-clamp-2">
            Goals: {profile?.career_goals || 'Aiming to advance into high-impact engineering.'}
          </p>
        </Card>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto space-y-1 bg-[#121814] p-2 rounded-lg border border-navy-200">
          <span className="text-[10px] font-bold text-navy-400 uppercase tracking-wider px-2 py-1 block">
            Previous Sessions
          </span>
          {conversations.map(c => (
            <button
              key={c.id}
              onClick={() => {
                setCurrentConvoId(c.id);
                loadMessages(c.id);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                currentConvoId === c.id
                  ? 'bg-brand-50 text-brand-800 font-semibold'
                  : 'text-navy-600 hover:bg-navy-50 hover:text-navy-900'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 text-navy-400" />
                <span className="truncate">{c.title}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Conversation Window */}
      <Card className="flex-1 flex flex-col overflow-hidden bg-[#121814]">
        {/* Chat Header */}
        <div className="p-4 border-b border-navy-100 flex items-center justify-between bg-navy-50/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-orange-500 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-navy-900">GapZero Senior AI Career Mentor</h3>
              <p className="text-[11px] text-navy-500">Continuous context of your verified skills, roadmap, and resume</p>
            </div>
          </div>
          <Badge variant="outline" size="sm">Career coach</Badge>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.length === 0 ? (
            <div className="py-10 text-center max-w-md mx-auto space-y-4">
              <Bot className="w-12 h-12 text-brand-600 mx-auto" />
              <h4 className="text-base font-bold text-navy-900">How can I guide your career today?</h4>
              <p className="text-xs text-navy-500">
                Ask about technical interview preparation, project system design, addressing resume weaknesses, or negotiating offers.
              </p>

              {/* Quick Prompt Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left pt-2">
                {quickPrompts.map((qp, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(qp)}
                    className="p-2.5 rounded-md border border-navy-200 bg-[#121814] hover:border-brand-300 hover:bg-brand-50/50 text-[11px] text-navy-700 font-medium transition-all"
                  >
                    "{qp}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map(m => (
              <div
                key={m.id}
                className={`flex gap-3 max-w-3xl ${m.sender === 'user' ? 'ml-auto justify-end' : 'mr-auto'}`}
              >
                {m.sender === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    m.sender === 'user'
                      ? 'bg-brand-600 text-white rounded-br-none'
                      : 'bg-navy-50 text-navy-900 rounded-bl-none border border-navy-100'
                  }`}
                >
                  {m.content}
                </div>

                {m.sender === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-navy-200 text-navy-700 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))
          )}

          {sending && (
            <div className="flex gap-3 mr-auto max-w-md">
              <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0 animate-pulse">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="p-3 bg-navy-50 text-navy-500 rounded-xl text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
                <span>Coach is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-navy-100 bg-[#121814]">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              placeholder="Ask your coach anything about skills, roadmaps, or interview prep..."
              disabled={sending}
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm border border-navy-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <Button type="submit" disabled={!inputMessage.trim() || sending} icon={<Send className="w-4 h-4" />}>
              Send
            </Button>
          </form>
          <p className="text-[10px] text-navy-400 mt-2 text-center">
            AI responses provide structured career mentorship and estimates. Never guarantees employment outcomes.
          </p>
        </div>
      </Card>
    </div>
  );
};
