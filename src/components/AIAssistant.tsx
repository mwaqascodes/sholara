import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User } from 'lucide-react';
import { students, feeRecords, examResults, attendanceData, teachers } from '@/lib/demo-data';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  data?: any;
}

const quickChips = [
  'Add Student', 'Mark Attendance', 'Check Fees', 'Generate Report',
  'Fee Defaulters', 'Top Students', "Today's Absent", 'Class Summary',
  'Generate Result Card', 'Who Passed?',
];

function getAIResponse(input: string): { text: string; data?: any } {
  const q = input.toLowerCase();

  if (q.includes('how many students') || q.includes('total students') || q.includes('kitne student')) {
    const byClass: Record<string, number> = {};
    students.forEach(s => { byClass[s.class] = (byClass[s.class] || 0) + 1; });
    return { text: `Total enrolled students: ${students.length}\n\nBreakdown by class:\n${Object.entries(byClass).map(([c, n]) => `• ${c}: ${n}`).join('\n')}` };
  }

  if (q.includes('fee defaulter') || q.includes('hasn\'t paid') || q.includes('unpaid') || q.includes('pending fee')) {
    const defaulters = feeRecords.filter(f => f.status !== 'paid');
    return {
      text: `📋 Fee Defaulters: ${defaulters.length} students\n\n${defaulters.map(d => `• ${d.studentName} (${d.class}) — PKR ${(d.amount - d.paid).toLocaleString()} pending`).join('\n')}\n\nTotal pending: PKR ${defaulters.reduce((s, d) => s + (d.amount - d.paid), 0).toLocaleString()}`,
    };
  }

  if (q.includes('top student') || q.includes('topper') || q.includes('best student')) {
    const sorted = [...examResults].sort((a, b) => b.percentage - a.percentage).slice(0, 3);
    return {
      text: `🏆 Top Students (Mid-Term 2026):\n\n${sorted.map((s, i) => `${['🥇', '🥈', '🥉'][i]} ${s.studentName} — ${s.percentage}% (${s.grade})`).join('\n')}`,
    };
  }

  if (q.includes('absent today') || q.includes('absent yesterday') || q.includes('who was absent')) {
    const totalAbsent = attendanceData.filter(a => a.date === '25/03/2026').reduce((s, a) => s + a.absent, 0);
    return { text: `📋 Today's absence report:\n\nTotal absent across all classes: ${totalAbsent} students\n\n${attendanceData.filter(a => a.date === '25/03/2026').map(a => `• ${a.class}: ${a.absent} absent, ${a.leave} on leave`).join('\n')}` };
  }

  if (q.includes('attendance') && (q.includes('percentage') || q.includes('%'))) {
    return { text: `📊 Today's overall attendance: 87%\n\nThis is slightly below the monthly average of 91%. Consider sending attendance alerts to parents of frequently absent students.` };
  }

  if (q.includes('who passed') || q.includes('pass') || q.includes('kaun pass')) {
    const passed = examResults.filter(r => r.percentage >= 40);
    return { text: `✅ Passed students (Mid-Term 2026): ${passed.length}/${examResults.length}\n\n${passed.map(s => `• ${s.studentName} — ${s.percentage}% (${s.grade})`).join('\n')}` };
  }

  if (q.includes('who failed') || q.includes('fail')) {
    const failed = examResults.filter(r => r.percentage < 40);
    return { text: failed.length > 0 ? `❌ Failed students: ${failed.length}\n\n${failed.map(s => `• ${s.studentName} — ${s.percentage}%`).join('\n')}` : `🎉 Great news! No students failed in the Mid-Term exam. All students scored above 40%.` };
  }

  if (q.includes('class summary') || q.includes('class performance')) {
    return { text: `📊 Class Performance Summary:\n\n• Class 10: Avg 86.7% — 3 students, all passed ✅\n• Class 9: Avg 76.5% — 2 students, all passed ✅\n• Class 8: Avg 69% — 1 student, passed ✅\n\nOverall school average: 80.3%` };
  }

  if (q.includes('teacher') || q.includes('how many teacher')) {
    return { text: `👩‍🏫 Total Teachers: ${teachers.length}\n\nTotal monthly payroll: PKR ${teachers.reduce((s, t) => s + t.salary, 0).toLocaleString()}\n\n${teachers.map(t => `• ${t.name} — ${t.subject} (${t.classes.join(', ')})`).join('\n')}` };
  }

  if (q.includes('add student') || q.includes('new student')) {
    return { text: `➕ To add a new student, go to Students → Add Student.\n\nOr tell me the details:\n"Add student [Name] to [Class]"\n\nI'll open the form pre-filled for you.` };
  }

  if (q.includes('generate report') || q.includes('report card') || q.includes('result card')) {
    return { text: `📄 To generate a result card:\n\n1. Go to Result Card page from the sidebar\n2. Fill in student details\n3. Add subject marks\n4. Click "Generate Result Card"\n5. Download as PDF\n\nOr navigate to: /dashboard/result-card` };
  }

  if (q.includes('collect fee') || q.includes('fee collection')) {
    return { text: `💰 Fee Collection Summary (March 2026):\n\nCollected: PKR ${feeRecords.reduce((s, f) => s + f.paid, 0).toLocaleString()}\nExpected: PKR ${feeRecords.reduce((s, f) => s + f.amount, 0).toLocaleString()}\nPending: PKR ${feeRecords.reduce((s, f) => s + (f.amount - f.paid), 0).toLocaleString()}\n\nGo to Fee Management to collect fees.` };
  }

  if (q.includes('mark attendance') || q.includes('attendance mark')) {
    return { text: `✅ To mark attendance:\n\n1. Go to Attendance page\n2. Select class and date\n3. Mark each student as Present/Absent/Leave\n4. Click Submit\n\nOr say: "Mark all Class 6 present for today"` };
  }

  if (q.includes('hello') || q.includes('hi') || q.includes('salam') || q.includes('assalam')) {
    return { text: `وعلیکم السلام! 👋\n\nI'm your PakEducate AI Assistant. I can help you with:\n\n• Student management\n• Attendance tracking\n• Fee collection\n• Result analysis\n• Report generation\n\nWhat would you like to do today?` };
  }

  return { text: `I understand you're asking about "${input}". Here are some things I can help with:\n\n• "How many students are enrolled?"\n• "Show fee defaulters"\n• "Who topped Class 10?"\n• "Today's absent students"\n• "Generate result card"\n• "Class performance summary"\n\nTry asking one of these! 🤖` };
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'ai', text: 'Assalam o Alaikum! 👋 I\'m your PakEducate AI Assistant. How can I help you manage your school today?' },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setThinking(true);

    setTimeout(() => {
      const response = getAIResponse(text);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'ai', text: response.text, data: response.data }]);
      setThinking(false);
    }, 800 + Math.random() * 700);
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center animate-pulse-glow"
          style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
        >
          <Sparkles className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[400px] h-[600px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-4rem)] flex flex-col glass-card overflow-hidden" style={{ padding: 0, borderRadius: 20 }}>
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4" style={{ background: 'linear-gradient(135deg, rgba(22,163,74,0.2), rgba(22,163,74,0.05))' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm" style={{ color: '#f1f5f9' }}>PakEducate AI</h3>
                <p className="text-xs" style={{ color: 'rgba(241,245,249,0.5)' }}>School Operations Assistant</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <X className="w-5 h-5" style={{ color: 'rgba(241,245,249,0.6)' }} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ scrollbarWidth: 'thin' }}>
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-4 py-2.5 text-sm whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'rounded-2xl rounded-br-md'
                      : 'rounded-2xl rounded-bl-md'
                  }`}
                  style={
                    m.role === 'user'
                      ? { background: 'linear-gradient(135deg, #16a34a, #15803d)', color: 'white' }
                      : { background: 'rgba(255,255,255,0.06)', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.08)' }
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}
            {thinking && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl rounded-bl-md" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-2 h-2 rounded-full" style={{ background: '#22c55e', animation: `pulse 1s ease-in-out ${i * 0.2}s infinite` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Quick chips */}
          <div className="px-4 pb-2">
            <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {quickChips.slice(0, 5).map(chip => (
                <button
                  key={chip}
                  onClick={() => send(chip)}
                  className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105"
                  style={{ background: 'rgba(22,163,74,0.15)', color: '#22c55e', border: '1px solid rgba(22,163,74,0.3)' }}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="px-4 pb-4">
            <div className="flex gap-2 items-center rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send(input)}
                placeholder="Ask anything about your school..."
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: '#f1f5f9' }}
              />
              <button
                onClick={() => send(input)}
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </>
  );
}
