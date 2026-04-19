import { useState, useRef, useEffect, useMemo } from 'react';
import { Sparkles, X, Send, Bot, Mic, MessageCircle, Minimize2, Trash2, CheckCircle2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { feeRecords, examResults, attendanceData } from '@/lib/demo-data';
import { actionStore, parseAndExecuteActions, useActionStore } from '@/lib/action-store';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const PAGE_LABELS: Record<string, { label: string; chips: string[] }> = {
  '/dashboard': { label: 'Dashboard', chips: ['Aaj ka summary', 'At-risk students', 'Top performers', 'Generate monthly report'] },
  '/dashboard/students': { label: 'Students', chips: ['Add student', 'Incomplete profiles', 'Search by class', 'WhatsApp absent parents'] },
  '/dashboard/teachers': { label: 'Teachers', chips: ['List teachers', 'Total payroll', 'Add teacher'] },
  '/dashboard/attendance': { label: 'Attendance', chips: ['Today absent', 'Below 75%', '3-day absentees', 'Mark Class 6 present'] },
  '/dashboard/results': { label: 'Results', chips: ['Class topper', 'Pass/fail ratio', 'Failed subjects', 'Predict at-risk'] },
  '/dashboard/fees': { label: 'Fees', chips: ['Defaulters', 'WhatsApp reminder', 'This month collection', 'Forecast'] },
  '/dashboard/payroll': { label: 'Payroll', chips: ['Process October', 'Total expense', 'Bonus calc'] },
  '/dashboard/result-card': { label: 'Result Card', chips: ['Generate for top 5', 'Class 10 cards', 'Print all'] },
};

function buildSchoolContext(): string {
  const { students, teachers } = actionStore.getState();
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalSalary = teachers.reduce((s, t) => s + t.salary, 0);
  const collected = feeRecords.reduce((s, f) => s + f.paid, 0);
  const expected = feeRecords.reduce((s, f) => s + f.amount, 0);
  const defaulters = feeRecords.filter(f => f.status !== 'paid');
  const top = [...examResults].sort((a, b) => b.percentage - a.percentage).slice(0, 5);
  const atRisk = students.filter(s => s.attendance < 80 || s.gpa < 3.0);

  return [
    `School: Urdu AI School (Demo) — Lahore`,
    `Students: ${totalStudents} | Teachers: ${totalTeachers}`,
    `Recent students (id|name|class): ${students.slice(0, 8).map(s => `${s.id}|${s.name}|${s.class}`).join('; ')}`,
    `Monthly payroll: ₨${totalSalary.toLocaleString()}`,
    `Fees collected (March): ₨${collected.toLocaleString()} of ₨${expected.toLocaleString()} (${Math.round(collected / expected * 100)}%)`,
    `Defaulters (${defaulters.length}): ${defaulters.map(d => `${d.studentName} ${d.class} ₨${d.amount - d.paid}`).join('; ')}`,
    `Top students: ${top.map(t => `${t.studentName} ${t.percentage}%`).join('; ')}`,
    `At-risk (low attendance/GPA): ${atRisk.map(s => `${s.name} ${s.class} (${s.attendance}% att, ${s.gpa} GPA)`).join('; ') || 'none'}`,
    `Today's absentees: ${attendanceData.filter(a => a.date === '25/03/2026').map(a => `${a.class}: ${a.absent}`).join(', ')}`,
  ].join('\n');
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const CHAT_URL = `${SUPABASE_URL}/functions/v1/ai-chat`;

export default function AIAssistant() {
  const location = useLocation();
  const navigate = useNavigate();
  const store = useActionStore();
  const [open, setOpen] = useState(false);
  const [whatsappMode, setWhatsappMode] = useState(false);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "**Assalam o Alaikum!** 👋\n\nMain aapka **PakEducate AI** hoon. Ab main *real actions* bhi kar sakta hoon — student add karna, attendance mark karna, fees record karna, ya kisi page par le jana.\n\nBas bolein: *\"Class 5 mein Ali Hassan add karo\"* ya *\"Open fees page\"*.",
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const pageInfo = useMemo(() => PAGE_LABELS[location.pathname] || { label: 'School', chips: ['Aaj ka summary', 'Defaulters', 'At-risk students', 'Generate report'] }, [location.pathname]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.path) navigate(detail.path);
    };
    window.addEventListener('ai-navigate', handler);
    return () => window.removeEventListener('ai-navigate', handler);
  }, [navigate]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streaming]);

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
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          mode: whatsappMode ? 'whatsapp' : 'normal',
          page: pageInfo.label,
          schoolContext: buildSchoolContext(),
        }),
      });

      if (resp.status === 429) {
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: '⚠️ Bohat ziada requests hain. Thori der baad try karein.' } : m));
        setStreaming(false);
        return;
      }
      if (resp.status === 402) {
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: '⚠️ AI credits khatam ho gaye. Workspace settings → Usage mein top-up karein.' } : m));
        setStreaming(false);
        return;
      }
      if (!resp.ok || !resp.body) throw new Error('Stream failed');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let done = false;

      while (!done) {
        const { done: streamDone, value } = await reader.read();
        if (streamDone) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') { done = true; break; }
          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (delta) {
              assistantSoFar += delta;
              setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: assistantSoFar } : m));
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }
      // Stream complete — extract & execute any action blocks, then replace content with cleaned version
      const { cleaned, results } = parseAndExecuteActions(assistantSoFar);
      const finalContent = results.length > 0
        ? `${cleaned}\n\n${results.map(r => `${r.ok ? '✅' : '❌'} ${r.message}`).join('\n')}`
        : cleaned || assistantSoFar;
      setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: finalContent } : m));
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: '⚠️ Connection error. Dobara try karein.' } : m));
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const clearChat = () => {
    setMessages([messages[0]]);
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center group"
          style={{
            background: 'linear-gradient(135deg, #16a34a, #15803d)',
            boxShadow: '0 0 0 0 rgba(22,163,74,0.6), 0 8px 32px rgba(22,163,74,0.4)',
            animation: 'aiPulse 2s ease-out infinite',
          }}
          aria-label="Open AI Assistant"
        >
          <Sparkles className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
        </button>
      )}

      {open && (
        <div
          className="fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] flex flex-col overflow-hidden animate-slide-in-right"
          style={{
            background: 'rgba(4,10,22,0.95)',
            backdropFilter: 'blur(28px) saturate(180%)',
            WebkitBackdropFilter: 'blur(28px) saturate(180%)',
            borderLeft: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4 shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'linear-gradient(135deg, rgba(22,163,74,0.18), rgba(22,163,74,0.04))' }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', boxShadow: '0 4px 16px rgba(22,163,74,0.4)' }}>
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2" style={{ borderColor: '#040a16' }} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm" style={{ color: '#f1f5f9' }}>PakEducate AI</h3>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-md font-semibold" style={{ background: 'rgba(245,158,11,0.18)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.4)' }}>
                    GEMINI
                  </span>
                </div>
                <p className="text-[11px] truncate" style={{ color: 'rgba(241,245,249,0.5)' }}>
                  Pakistani schools ke liye trained · {pageInfo.label}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={clearChat}
                title="Clear chat"
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" style={{ color: 'rgba(241,245,249,0.5)' }} />
              </button>
              <button
                onClick={() => setOpen(false)}
                title="Minimize"
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Minimize2 className="w-4 h-4" style={{ color: 'rgba(241,245,249,0.5)' }} />
              </button>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" style={{ color: 'rgba(241,245,249,0.7)' }} />
              </button>
            </div>
          </div>

          {/* WhatsApp toggle */}
          <div className="px-5 py-2.5 flex items-center justify-between shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-3.5 h-3.5" style={{ color: whatsappMode ? '#22c55e' : 'rgba(241,245,249,0.4)' }} />
              <span className="text-xs" style={{ color: 'rgba(241,245,249,0.7)' }}>WhatsApp Mode</span>
            </div>
            <button
              onClick={() => setWhatsappMode(!whatsappMode)}
              className="relative w-9 h-5 rounded-full transition-colors"
              style={{ background: whatsappMode ? '#16a34a' : 'rgba(255,255,255,0.1)' }}
              aria-pressed={whatsappMode}
            >
              <span
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                style={{ left: whatsappMode ? '18px' : '2px' }}
              />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ scrollbarWidth: 'thin' }}>
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[88%] px-4 py-2.5 text-sm ${m.role === 'user' ? 'rounded-2xl rounded-br-md' : 'rounded-2xl rounded-bl-md'}`}
                  style={
                    m.role === 'user'
                      ? { background: 'linear-gradient(135deg, #16a34a, #15803d)', color: 'white' }
                      : { background: 'rgba(255,255,255,0.06)', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.08)' }
                  }
                >
                  {m.role === 'assistant' ? (
                    <div className="prose prose-sm prose-invert max-w-none [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0 [&_table]:text-xs [&_th]:text-left [&_th]:px-2 [&_th]:py-1 [&_td]:px-2 [&_td]:py-1 [&_table]:border-collapse [&_th]:border [&_th]:border-white/10 [&_td]:border [&_td]:border-white/10 [&_strong]:text-green-300">
                      {m.content ? (
                        <ReactMarkdown>{m.content.replace(/```action[\s\S]*?```/g, '⚙️ *Executing action...*')}</ReactMarkdown>
                      ) : (
                        <div className="flex gap-1.5 py-1">
                          {[0, 1, 2].map(i => (
                            <span key={i} className="w-2 h-2 rounded-full" style={{ background: '#22c55e', animation: `aiDot 1s ease-in-out ${i * 0.18}s infinite` }} />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="whitespace-pre-wrap">{m.content}</span>
                  )}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Quick chips (contextual) */}
          <div className="px-4 pb-2 shrink-0">
            <div className="flex gap-2 overflow-x-auto pb-1.5" style={{ scrollbarWidth: 'none' }}>
              {pageInfo.chips.map(chip => (
                <button
                  key={chip}
                  onClick={() => send(chip)}
                  disabled={streaming}
                  className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 disabled:opacity-50"
                  style={{ background: 'rgba(22,163,74,0.12)', color: '#4ade80', border: '1px solid rgba(22,163,74,0.3)' }}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="px-4 pb-4 shrink-0">
            <div className="flex gap-2 items-end rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <button
                title="Voice coming soon — Urdu mein bolein"
                className="p-1.5 rounded-lg hover:bg-white/5 transition-colors shrink-0"
              >
                <Mic className="w-4 h-4" style={{ color: 'rgba(241,245,249,0.4)' }} />
              </button>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder={whatsappMode ? 'WhatsApp message banaiye...' : 'Sawal poochein, ya command dein...'}
                rows={1}
                disabled={streaming}
                className="flex-1 bg-transparent text-sm outline-none resize-none max-h-24 py-1"
                style={{ color: '#f1f5f9' }}
              />
              <button
                onClick={() => send(input)}
                disabled={streaming || !input.trim()}
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', boxShadow: '0 2px 12px rgba(22,163,74,0.4)' }}
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
            <p className="text-[10px] mt-1.5 text-center" style={{ color: 'rgba(241,245,249,0.3)' }}>
              AI may make mistakes. Verify before taking action.
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes aiPulse {
          0% { box-shadow: 0 0 0 0 rgba(22,163,74,0.6), 0 8px 32px rgba(22,163,74,0.4); }
          70% { box-shadow: 0 0 0 18px rgba(22,163,74,0), 0 8px 32px rgba(22,163,74,0.4); }
          100% { box-shadow: 0 0 0 0 rgba(22,163,74,0), 0 8px 32px rgba(22,163,74,0.4); }
        }
        @keyframes aiDot {
          0%, 100% { opacity: 0.3; transform: scale(0.7); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right { animation: slide-in-right 0.35s ease; }
      `}</style>
    </>
  );
}
