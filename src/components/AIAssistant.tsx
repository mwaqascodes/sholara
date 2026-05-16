import { useState, useRef, useEffect, useMemo } from 'react';
import { Sparkles, X, Send, Bot, Trash2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { feeRecords, examResults, attendanceData } from '@/lib/demo-data';
import { actionStore, parseAndExecuteActions, useActionStore } from '@/lib/action-store';

interface Message { id: string; role: 'user' | 'assistant'; content: string; }

const PAGE_LABELS: Record<string, { label: string; chips: string[] }> = {
  '/dashboard': { label: 'Dashboard', chips: ["Today's summary", 'Fee defaulters', 'Absent students', 'Top performers'] },
  '/dashboard/students': { label: 'Students', chips: ['Add student', 'Search by class', 'At-risk students'] },
  '/dashboard/fees': { label: 'Fees', chips: ['Defaulters', 'This month collection', 'Send reminder'] },
  '/dashboard/attendance': { label: 'Attendance', chips: ['Today absent', 'Below 75%', 'Mark present'] },
  '/dashboard/results': { label: 'Results', chips: ['Class topper', 'Pass/fail ratio'] },
};

function buildSchoolContext(): string {
  const { students, teachers } = actionStore.getState();
  const collected = feeRecords.reduce((s, f) => s + f.paid, 0);
  const expected = feeRecords.reduce((s, f) => s + f.amount, 0);
  const defaulters = feeRecords.filter(f => f.status !== 'paid');
  const top = [...examResults].sort((a, b) => b.percentage - a.percentage).slice(0, 5);
  return [
    `School: IlmDesk School`, `Students: ${students.length} | Teachers: ${teachers.length}`,
    `Fees: PKR ${collected.toLocaleString()} of PKR ${expected.toLocaleString()}`,
    `Defaulters: ${defaulters.length}`, `Top: ${top.map(t => `${t.studentName} ${t.percentage}%`).join('; ')}`,
  ].join('\n');
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const CHAT_URL = `${SUPABASE_URL}/functions/v1/ai-chat`;

export default function AIAssistant() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'assistant', content: "**Hello! 👋 I'm IlmDesk AI.**\n\nI can help manage your school — add students, check fees, mark attendance & more.\n\nTry: *\"Show fee defaulters\"* or *\"Add student Ahmed to Class 5\"*" },
  ]);
  const endRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const pageInfo = useMemo(() => PAGE_LABELS[location.pathname] || { label: 'School', chips: ["Today's summary", 'Defaulters'] }, [location.pathname]);

  useEffect(() => {
    const handler = (e: Event) => { const d = (e as CustomEvent).detail; if (d?.path) navigate(d.path); };
    window.addEventListener('ai-navigate', handler);
    return () => window.removeEventListener('ai-navigate', handler);
  }, [navigate]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, streaming]);

  const send = async (text: string) => {
    if (!text.trim() || streaming) return;
    setInput('');
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setStreaming(true);
    let assistantSoFar = '';
    const assistantId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '' }]);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST', signal: controller.signal,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SUPABASE_KEY}` },
        body: JSON.stringify({ messages: newMessages.map(m => ({ role: m.role, content: m.content })), page: pageInfo.label, schoolContext: buildSchoolContext() }),
      });
      if (resp.status === 429 || resp.status === 402) {
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: '⚠️ Please try again in a moment.' } : m));
        setStreaming(false); return;
      }
      if (!resp.ok || !resp.body) throw new Error('Stream failed');
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, idx);
          textBuffer = textBuffer.slice(idx + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const j = line.slice(6).trim();
          if (j === '[DONE]') break;
          try { const p = JSON.parse(j); const d = p.choices?.[0]?.delta?.content; if (d) { assistantSoFar += d; setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: assistantSoFar } : m)); } } catch { break; }
        }
      }
      const { cleaned, results } = parseAndExecuteActions(assistantSoFar);
      const final = results.length > 0 ? `${cleaned}\n\n${results.map(r => `${r.ok ? '✅' : '❌'} ${r.message}`).join('\n')}` : cleaned || assistantSoFar;
      setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: final } : m));
    } catch (e: any) {
      if (e.name !== 'AbortError') setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: '⚠️ Connection error.' } : m));
    } finally { setStreaming(false); abortRef.current = null; }
  };

  return (
    <>
      {!open && (
        <button onClick={() => setOpen(true)} className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all" style={{ animation: 'aiPulse 2s ease-out infinite' }} title="IlmDesk AI">
          <Sparkles className="w-6 h-6 text-primary-foreground" />
        </button>
      )}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[360px] h-[480px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
          <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <h3 className="text-sm font-bold">IlmDesk AI Assistant</h3>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setMessages([messages[0]])} className="p-1 rounded hover:bg-white/20"><Trash2 className="w-4 h-4" /></button>
              <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-white/20"><X className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="px-3 py-2 border-b border-border">
            <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {pageInfo.chips.map(c => (
                <button key={c} onClick={() => send(c)} disabled={streaming} className="shrink-0 px-3 py-1 rounded-full text-xs font-medium border border-border hover:bg-primary/10 hover:text-primary transition-all disabled:opacity-50 text-muted-foreground">{c}</button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ scrollbarWidth: 'thin' }}>
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 text-sm rounded-xl ${m.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-muted text-foreground border border-border rounded-bl-sm'}`}>
                  {m.role === 'assistant' ? (
                    <div className="prose prose-sm max-w-none [&_p]:my-1 [&_strong]:text-primary">
                      {m.content ? <ReactMarkdown>{m.content.replace(/```action[\s\S]*?```/g, '⚙️ *Executing...*')}</ReactMarkdown> : (
                        <div className="flex gap-1.5 py-1 items-center">{[0,1,2].map(i => <span key={i} className="w-2 h-2 rounded-full bg-primary" style={{ animation: `aiDot 1s ease-in-out ${i*0.18}s infinite` }} />)}<span className="text-xs ml-1 text-muted-foreground">Thinking…</span></div>
                      )}
                    </div>
                  ) : <span className="whitespace-pre-wrap">{m.content}</span>}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="px-3 pb-3 pt-2 border-t border-border">
            <div className="flex gap-2 items-center rounded-lg border border-border px-3 py-2 bg-background focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }} placeholder="Ask anything about your school..." disabled={streaming} className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
              <button onClick={() => send(input)} disabled={streaming || !input.trim()} className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground disabled:opacity-40 hover:opacity-90 transition-colors shrink-0"><Send className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
