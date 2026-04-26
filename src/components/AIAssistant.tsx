import { useState, useRef, useEffect, useMemo } from 'react';
import { X, Send, Loader2, Sparkles, RotateCcw, Bot } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { feeRecords, examResults } from '@/lib/demo-data';
import { actionStore, parseAndExecuteActions, useActionStore } from '@/lib/action-store';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface AIAssistantProps {
  open: boolean;
  onClose: () => void;
}

const PAGE_CHIPS: Record<string, string[]> = {
  '/dashboard':              ["Today's summary", 'Fee defaulters', 'How many students?', 'Help'],
  '/dashboard/students':     ['Add student Ahmed Ali class 9A', 'How many students?', 'At-risk students', 'Show absent today'],
  '/dashboard/fees':         ['Fee defaulters list', 'This month collection', 'Collect fee Ahmed 5000', 'Total pending amount'],
  '/dashboard/attendance':   ['Mark Class 9A present', 'Who is absent today?', 'Below 75% attendance', 'Mark Fatima absent'],
  '/dashboard/results':      ['Class topper', 'Pass/fail ratio', 'Generate result card'],
  '/dashboard/teachers':     ['Add teacher Sara Maths 45000', 'Total teachers', 'Subject-wise teachers'],
  '/dashboard/certificates': ['Issue certificate Ahmed Excellence', 'Print last certificate'],
  '/dashboard/analytics':    ['Monthly fee trend', 'Attendance analysis'],
};

const DEFAULT_CHIPS = ["Today's summary", 'Fee defaulters', 'Add student Ahmed Ali class 9', 'Help'];

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const CHAT_URL = `${SUPABASE_URL}/functions/v1/ai-chat`;
const HAS_SUPABASE = !!SUPABASE_URL && !!SUPABASE_KEY;

/* ── Offline mock responses ── */
const MOCK: Record<string, string> = {
  default:    "**Hello! 👋 I'm Scholara AI.**\n\nI can **add students & teachers**, **record fees**, **mark attendance**, and navigate the system.\n\n**Try these commands:**\n• *\"Add student Ahmed Ali class 9A\"*\n• *\"Add teacher Sara subject Maths salary 45000\"*\n• *\"Collect fee from Ahmed 5000\"*\n• *\"Mark Class 8A present\"*\n• *\"Go to fees page\"*",
  absent:     "📋 **Absent Students Today (April 22):**\n\n• Usman Raza — Class 7-C\n• Ayesha Bibi — Class 9-A\n• Bilal Arshad — Class 5-B\n• Sara Baig — Class 3-A\n• Hamza Malik — Class 6-B\n• Nida Aslam — Class 8-C\n\nTotal: **6 absent** out of 1,247 students (99.5% present today).",
  fee:        "💰 **Fee Report — April 2026:**\n\nCollected: **₨ 19,40,000** (81%)\nPending: ₨ 4,60,000 (19%)\n\n**183 payments** currently pending.\nDeadline: 10th of each month.",
  top:        "🏆 **Top 5 Performers — 2026:**\n\n1. 🥇 Fatima Ali (Class 10-A) — **95.2%**\n2. 🥈 Ahmed Khan (Class 9-B) — **93.8%**\n3. 🥉 Zainab Noor (Class 8-A) — **91.5%**\n4. Ali Hassan (Class 10-B) — **90.1%**\n5. Sara Bibi (Class 9-A) — **89.7%**",
  defaulters: "⚠️ **Fee Defaulters (April 2026):**\n\n1. Ayesha Bibi — Class 9-A — **₨ 5,000** (2 months)\n2. Usman Raza — Class 7-C — **₨ 4,500** (1 month)\n3. Bilal Arshad — Class 5-B — **₨ 3,500** (1 month)\n4. Hamza Malik — Class 6-B — **₨ 3,500** (1 month)\n5. Nida Aslam — Class 8-C — **₨ 7,000** (3 months)\n\nTotal overdue: **₨ 28,500**",
  timetable:  "🕐 **Today's Schedule:**\n\n| Time | Subject | Class |\n|------|---------|-------|\n| 8:00–8:45 | Urdu | 8-A |\n| 8:50–9:35 | Maths | 9-B |\n| 9:40–10:25 | English | 7-A |\n| 10:30–11:15 | Islamiyat | 6-C |\n| 11:30–12:15 | Science | 10-A |",
  attendance: "📊 **Attendance Summary — Today:**\n\n• Present: **1,241** (99.5%)\n• Absent: **6** (0.5%)\n• Leave: **0**\n\n**Best class:** 9-A (100% present)\n**Concern:** 6-B (2 absent)",
  help:       "**🤖 Scholara AI — Command Guide:**\n\n**➕ Add Records:**\n• `Add student [Name] class [X]`\n• `Add student [Name] class [X] section [A/B]`\n• `Add teacher [Name] subject [S] salary [amount]`\n\n**💰 Fee Management:**\n• `Collect fee [Name] [amount]`\n• `Record payment [Name] PKR [amount]`\n• `Who are the fee defaulters?`\n\n**✅ Attendance:**\n• `Mark [Name] present/absent`\n• `Mark Class [X]-[Section] present`\n• `Who is absent today?`\n\n**🧭 Navigation:**\n• `Go to fees` / `Open students` / `Navigate to attendance`\n• `Show analytics` / `Open settings`\n\n**📊 Reports:**\n• `Fee report` / `Top performers`\n• `How many students?` / `Today's timetable`",
};

function buildSchoolContext(): string {
  const { students, teachers } = actionStore.getState();
  const collected = feeRecords.reduce((s, f) => s + f.paid, 0);
  const expected  = feeRecords.reduce((s, f) => s + f.amount, 0);
  const defaulters = feeRecords.filter(f => f.status !== 'paid').length;
  return [
    `School: Scholara Demo School`,
    `Students: ${students.length} | Teachers: ${teachers.length}`,
    `Fees: PKR ${collected.toLocaleString()} of PKR ${expected.toLocaleString()}`,
    `Defaulters: ${defaulters}`,
  ].join('\n');
}

function extractName(text: string): string {
  // Remove common words to extract a proper name
  return text
    .replace(/^(student|teacher|mr|mrs|ms|dr|prof)\.?\s*/i, '')
    .replace(/\s+(class|section|subject|salary|grade|roll).*$/i, '')
    .trim();
}

function getOfflineResponse(msg: string, students: any[], teachers: any[]): string {
  const lower = msg.toLowerCase().trim();
  const words = lower.split(/\s+/);

  // ── ADD STUDENT ──
  // Patterns: "add student Ahmed Ali class 9 section A"
  //           "enroll student Fatima class 5"
  //           "new student Usman 8B"
  const addStudentRe = /(?:add|enroll|register|new|admit)\s+student\s+(.+?)(?:\s+(?:in\s+)?(?:class|grade|std)\s*(\d+[a-z]?))?(?:\s+section\s*([a-d]))?(?:\s+([a-d]))?$/i;
  const addStudentM = msg.match(addStudentRe);
  // Also detect "add [name] to class X" or just "add [name] class X"
  const addStudentRe2 = /(?:add|enroll)\s+([A-Za-z\s]{3,30}?)\s+(?:to\s+)?(?:class|grade)\s*(\d+[a-z]?)(?:\s*[-–]\s*|\s+section\s*)?([a-d])?/i;
  const addStudentM2 = msg.match(addStudentRe2);

  if (addStudentM || addStudentM2 || (words.includes('add') && words.includes('student'))) {
    let name = 'New Student', cls = '1', section = 'A';
    if (addStudentM) {
      name = extractName(addStudentM[1] || 'New Student');
      cls  = addStudentM[2] || '1';
      section = (addStudentM[3] || addStudentM[4] || 'A').toUpperCase();
    } else if (addStudentM2) {
      name = extractName(addStudentM2[1] || 'New Student');
      cls  = addStudentM2[2] || '1';
      section = (addStudentM2[3] || 'A').toUpperCase();
    } else {
      // Last resort: grab anything between "student" and "class"
      const m = msg.match(/student\s+([A-Za-z\s]+?)(?:\s+class\s*(\d+))?(?:\s+([A-D]))?$/i);
      name = extractName(m?.[1] || 'New Student');
      cls  = m?.[2] || '1';
      section = (m?.[3] || 'A').toUpperCase();
    }
    // Normalize class number
    const clsNum = cls.replace(/[^0-9]/g, '') || '1';
    return `\`\`\`action\n{"type":"add_student","data":{"name":"${name}","class":"Class ${clsNum}","section":"${section}"}}\n\`\`\`\n✅ Student **${name}** enrolled in **Class ${clsNum}–${section}** successfully!`;
  }

  // ── ADD TEACHER ──
  // Patterns: "add teacher Sara subject Maths salary 45000"
  //           "add teacher Muhammad Ali Maths 40000"
  //           "new teacher Fatima Physics"
  const addTeacherRe = /(?:add|hire|new|register)\s+teacher\s+(.+?)(?:\s+(?:subject\s+)?([A-Za-z]+))?(?:\s+(?:salary\s+)?(\d{4,6}))?$/i;
  const addTeacherM = msg.match(addTeacherRe);
  if (addTeacherM || (words.includes('add') && words.includes('teacher'))) {
    let name = 'New Teacher', subject = 'General', salary = 35000;
    if (addTeacherM) {
      // Parse out the teacher's name — stop at subject or salary
      const rawName = addTeacherM[1] || 'New Teacher';
      // subject may be embedded in name
      const subjectWords = ['maths', 'math', 'english', 'urdu', 'science', 'physics', 'chemistry', 'biology', 'computer', 'islamiat', 'history', 'geography'];
      const parts = rawName.trim().split(/\s+/);
      const subIdx = parts.findIndex(p => subjectWords.includes(p.toLowerCase()));
      if (subIdx > 0) {
        name = parts.slice(0, subIdx).join(' ');
        subject = parts[subIdx];
        if (parts[subIdx + 1] && /^\d+$/.test(parts[subIdx + 1])) salary = parseInt(parts[subIdx + 1]);
      } else {
        name = rawName.split(/\s+(?=\d{4,6}$)/)[0];
      }
      if (addTeacherM[2]) subject = addTeacherM[2];
      if (addTeacherM[3]) salary = parseInt(addTeacherM[3]);
    }
    // Capitalize subject
    subject = subject.charAt(0).toUpperCase() + subject.slice(1);
    return `\`\`\`action\n{"type":"add_teacher","data":{"name":"${name}","subject":"${subject}","salary":${salary}}}\n\`\`\`\n✅ Teacher **${name}** added · Subject: **${subject}** · Salary: **₨ ${salary.toLocaleString()}**`;
  }

  // ── COLLECT / RECORD FEE ──
  // Patterns: "collect fee Ahmed 5000", "record payment Fatima PKR 3000"
  //           "Ahmed paid 5000", "fee from Usman 7000"
  const feeRe1 = /(?:collect|record|receive|take)\s+(?:fee|payment|fees)?\s*(?:from\s+)?([A-Za-z\s]{2,25?}?)\s+(?:PKR\s*|Rs\s*|₨\s*)?(\d{3,6})/i;
  const feeRe2 = /([A-Za-z\s]{2,20}?)\s+(?:has\s+)?paid\s+(?:PKR\s*|Rs\s*|₨\s*)?(\d{3,6})/i;
  const feeM = msg.match(feeRe1) || msg.match(feeRe2);
  if (feeM) {
    const name   = extractName(feeM[1]);
    const amount = parseInt(feeM[2]);
    if (!isNaN(amount) && amount > 0) {
      return `\`\`\`action\n{"type":"record_fee_payment","data":{"studentName":"${name}","amount":${amount},"method":"Cash"}}\n\`\`\`\n✅ Fee **₨ ${amount.toLocaleString()}** recorded for **${name}**`;
    }
  }

  // ── MARK ATTENDANCE ──
  // Patterns: "mark Ahmed present", "mark class 8A absent", "mark Fatima leave"
  const attendRe = /mark\s+(.+?)\s+(present|absent|leave)/i;
  const attendM = msg.match(attendRe);
  if (attendM) {
    const who    = attendM[1].trim();
    const status = attendM[2].toLowerCase() as 'present' | 'absent' | 'leave';
    const isClass = /class\s*\d/i.test(who) || /^\d+[a-d]$/i.test(who);
    const payload = isClass
      ? `{"type":"mark_attendance","data":{"class":"${who}","status":"${status}"}}`
      : `{"type":"mark_attendance","data":{"studentName":"${who}","status":"${status}"}}`;
    const icon = status === 'present' ? '✅' : status === 'absent' ? '❌' : '🟡';
    return `\`\`\`action\n${payload}\n\`\`\`\n${icon} **${who}** marked **${status}** in attendance`;
  }

  // ── NAVIGATE ──
  const navMap: Record<string, string> = {
    fees: '/dashboard/fees', fee: '/dashboard/fees',
    students: '/dashboard/students', student: '/dashboard/students',
    teachers: '/dashboard/teachers', teacher: '/dashboard/teachers',
    attendance: '/dashboard/attendance',
    results: '/dashboard/results', result: '/dashboard/results',
    settings: '/dashboard/settings', setting: '/dashboard/settings',
    analytics: '/dashboard/analytics',
    schedule: '/dashboard/schedule', timetable: '/dashboard/schedule',
    dashboard: '/dashboard', home: '/dashboard',
    certificates: '/dashboard/certificates', certificate: '/dashboard/certificates',
    calendar: '/dashboard/calendar',
    announcements: '/dashboard/announcements',
    homework: '/dashboard/homework',
    admissions: '/dashboard/admissions', admission: '/dashboard/admissions',
    'result card': '/dashboard/result-card',
    leave: '/dashboard/leave',
    notifications: '/dashboard/notifications',
  };
  for (const [key, path] of Object.entries(navMap)) {
    if (
      lower.includes(`go to ${key}`) || lower.includes(`open ${key}`) ||
      lower.includes(`navigate to ${key}`) || lower.includes(`show ${key}`) ||
      lower.includes(`take me to ${key}`) || lower === key
    ) {
      const label = key.charAt(0).toUpperCase() + key.slice(1);
      return `\`\`\`action\n{"type":"navigate","path":"${path}"}\n\`\`\`\n🧭 Opening **${label}** page...`;
    }
  }

  // ── INFO QUERIES ──
  if (lower.includes('absent') && !lower.includes('mark')) return MOCK.absent;
  if (lower.includes('present today') || lower.includes('attendance today')) return MOCK.attendance;
  if ((lower.includes('fee') && (lower.includes('report') || lower.includes('collection') || lower.includes('status')))) return MOCK.fee;
  if (lower.includes('top') && (lower.includes('student') || lower.includes('performer'))) return MOCK.top;
  if (lower.includes('best student') || lower.includes('rank')) return MOCK.top;
  if (lower.includes('default') || lower.includes('overdue') || lower.includes('pending fee') || (lower.includes('fee') && lower.includes('not paid'))) return MOCK.defaulters;
  if (lower.includes('timetable') || lower.includes('today') && lower.includes('schedule')) return MOCK.timetable;
  if (lower.includes('summary') || lower === "today's summary") return `📊 **Today's Summary — April 22, 2026:**\n\n👥 **Students:** ${students.length} enrolled · 6 absent today\n👩‍🏫 **Teachers:** ${teachers.length} active · All present\n💰 **Fees:** ₨ 19.4L collected (81%) · ₨ 4.6L pending\n📚 **Classes:** 12 running today\n\n_Everything running smoothly!_ ✅`;
  if (lower.includes('help') || lower.includes('what can') || lower.includes('commands')) return MOCK.help;
  if (lower.includes('how many student') || lower.includes('total student') || lower.includes('count student')) {
    const active = students.filter((s: any) => s.status === 'active').length;
    return `👥 **Student Count:**\n\n• Total enrolled: **${students.length}**\n• Active: **${active}**\n• Inactive/Withdrawn: **${students.length - active}**`;
  }
  if (lower.includes('how many teacher') || lower.includes('total teacher') || lower.includes('count teacher')) {
    const active = teachers.filter((t: any) => t.status === 'active').length;
    return `👨‍🏫 **Teacher Count:**\n\n• Total: **${teachers.length}**\n• Active: **${active}**`;
  }
  if (lower.includes('fee') && lower.includes('total') || lower.includes('how much fee')) {
    return `💰 **Fee Summary:**\n\nTotal Due: **₨ 24,00,000**\nCollected: **₨ 19,40,000** (81%)\nPending: **₨ 4,60,000** (19%)\n\n183 students yet to pay.`;
  }
  if (lower.includes('class') && lower.includes('how many') || lower.includes('total class')) {
    return `🏫 **Classes:** 12 active classes (Class 1–10 + 2 sections)\n\n📊 Avg students per class: **~104**`;
  }

  return MOCK.default;
}

export default function AIAssistant({ open, onClose }: AIAssistantProps) {
  const location = useLocation();
  const navigate  = useNavigate();
  const storeState = useActionStore();

  const [input, setInput]       = useState('');
  const [streaming, setStreaming] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    id: '0', role: 'assistant',
    content: "**Hello! 👋 I'm Scholara AI.**\n\nI'm fully trained to manage your school. I can:\n\n• **Add students** → *\"Add student Ahmed Ali class 9A\"*\n• **Add teachers** → *\"Add teacher Sara subject Maths salary 45000\"*\n• **Record fees** → *\"Collect fee from Ahmed 5000\"*\n• **Attendance** → *\"Mark Class 9A present\"*\n• **Navigate** → *\"Go to fees\"*\n• **Reports** → *\"Fee defaulters\"* or *\"Today's summary\"*\n\nWhat would you like to do?",
  }]);

  const endRef   = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const chips = useMemo(() => PAGE_CHIPS[location.pathname] ?? DEFAULT_CHIPS, [location.pathname]);

  // Scroll to bottom
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, streaming]);

  // Focus input when opened
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 320); }, [open]);

  // Listen for AI navigation events
  useEffect(() => {
    const handler = (e: Event) => {
      const path = (e as CustomEvent).detail?.path;
      if (path) navigate(path);
    };
    window.addEventListener('ai-navigate', handler);
    return () => window.removeEventListener('ai-navigate', handler);
  }, [navigate]);

  const send = async (text: string) => {
    if (!text.trim() || streaming) return;
    setInput('');

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setStreaming(true);

    const assistantId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

    // Try Supabase streaming if configured, otherwise use offline logic
    if (HAS_SUPABASE) {
      const controller = new AbortController();
      abortRef.current  = controller;
      let assistantSoFar = '';
      try {
        const resp = await fetch(CHAT_URL, {
          method: 'POST',
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SUPABASE_KEY}` },
          body: JSON.stringify({
            messages:      newMessages.map(m => ({ role: m.role, content: m.content })),
            page:          location.pathname,
            schoolContext: buildSchoolContext(),
          }),
        });

        if (resp.status === 429 || resp.status === 402 || !resp.ok || !resp.body) {
          throw new Error('stream_failed');
        }

        const reader  = resp.body.getReader();
        const decoder = new TextDecoder();
        let textBuffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          textBuffer += decoder.decode(value, { stream: true });
          let idx: number;
          while ((idx = textBuffer.indexOf('\n')) !== -1) {
            let line = textBuffer.slice(0, idx).replace(/\r$/, '');
            textBuffer = textBuffer.slice(idx + 1);
            if (!line.startsWith('data: ')) continue;
            const j = line.slice(6).trim();
            if (j === '[DONE]') break;
            try {
              const p = JSON.parse(j);
              const d = p.choices?.[0]?.delta?.content;
              if (d) {
                assistantSoFar += d;
                setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: assistantSoFar } : m));
              }
            } catch { /* skip malformed SSE lines */ }
          }
        }

        // Parse and execute any ```action``` blocks in the streamed response
        const { cleaned, results } = parseAndExecuteActions(assistantSoFar);
        const final = results.length > 0
          ? `${cleaned}\n\n${results.map(r => `${r.ok ? '✅' : '❌'} ${r.message}`).join('\n')}`
          : cleaned || assistantSoFar;
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: final } : m));

      } catch (e: any) {
        if (e.name === 'AbortError') { setStreaming(false); return; }
        // Fall through to offline mode
        const raw     = getOfflineResponse(text, storeState.students, storeState.teachers);
        const { cleaned, results } = parseAndExecuteActions(raw);
        const final   = cleaned || results.map(r => r.message).join('\n');
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: final } : m));
      } finally {
        setStreaming(false);
        abortRef.current = null;
      }
    } else {
      // Offline mode — simulate typing delay
      await new Promise(r => setTimeout(r, 700 + Math.random() * 600));
      const raw     = getOfflineResponse(text, storeState.students, storeState.teachers);
      const { cleaned, results } = parseAndExecuteActions(raw);
      const final   = cleaned || results.map(r => r.message).join('\n');
      setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: final } : m));
      setStreaming(false);
    }
  };

  const reset = () => {
    abortRef.current?.abort();
    setStreaming(false);
    setMessages([{
      id: '0', role: 'assistant',
      content: "**Hello! 👋 I'm Scholara AI.**\n\nI'm fully trained to manage your school. I can:\n\n• **Add students** → *\"Add student Ahmed Ali class 9A\"*\n• **Add teachers** → *\"Add teacher Sara subject Maths salary 45000\"*\n• **Record fees** → *\"Collect fee from Ahmed 5000\"*\n• **Attendance** → *\"Mark Class 9A present\"*\n• **Navigate** → *\"Go to fees\"*\n• **Reports** → *\"Fee defaulters\"* or *\"Today's summary\"*\n\nWhat would you like to do?",
    }]);
  };

  return (
    <>
      {/* Backdrop — only when open */}
      {open && (
        <div className="fixed inset-0 z-30 bg-slate-900/10" onClick={onClose} />
      )}

      {/* Slide-in Panel — pointer-events-none when closed so it never blocks clicks */}
      <div
        className={`fixed top-[40px] right-0 bottom-0 z-40 w-[380px] bg-white border-l border-slate-100 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'}`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-5 py-4 flex items-center gap-3 flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30 flex-shrink-0">
            <Sparkles size={16} className="text-slate-900" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-black text-white tracking-tight">AI Assistant</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {HAS_SUPABASE ? 'Online · Powered by Claude AI' : 'Online · Actions enabled'}
              </span>
            </div>
          </div>
          <button onClick={reset} className="p-1.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors mr-1" title="Clear chat">
            <RotateCcw size={15} />
          </button>
          <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Suggestion chips */}
        <div className="flex gap-2 px-4 py-3 overflow-x-auto border-b border-slate-100 flex-shrink-0 scrollbar-hide bg-slate-50">
          {chips.map(chip => (
            <button
              key={chip}
              onClick={() => send(chip)}
              disabled={streaming}
              className="flex-shrink-0 px-3 py-1.5 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100 rounded-full hover:bg-amber-100 transition-colors whitespace-nowrap disabled:opacity-50"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide">
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5 shadow-sm">
                  <Sparkles size={12} className="text-white" />
                </div>
              )}
              <div className={`max-w-[82%] ${m.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed
                  ${m.role === 'user'
                    ? 'bg-amber-500 text-slate-900 font-semibold rounded-tr-sm whitespace-pre-wrap'
                    : 'bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-sm'
                  }`}
                >
                  {m.role === 'assistant' ? (
                    m.content
                      ? (
                        <div className="prose prose-sm max-w-none [&_p]:my-1 [&_strong]:text-amber-600 [&_em]:text-slate-500">
                          <ReactMarkdown>
                            {m.content.replace(/```action[\s\S]*?```/g, '')}
                          </ReactMarkdown>
                        </div>
                      )
                      : (
                        <div className="flex gap-1.5 py-1 items-center">
                          {[0, 150, 300].map(delay => (
                            <span key={delay} className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                          ))}
                        </div>
                      )
                  ) : m.content}
                </div>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-100 bg-white flex gap-3 flex-shrink-0">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send(input))}
            placeholder="Ask anything or give a command..."
            disabled={streaming}
            className="flex-1 text-[13px] bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-300 transition-all placeholder-slate-300 text-slate-700 disabled:opacity-60"
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || streaming}
            className="w-11 h-11 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-100 disabled:text-slate-300 text-slate-900 rounded-xl flex items-center justify-center transition-all active:scale-95 flex-shrink-0 shadow-sm"
          >
            {streaming
              ? <Loader2 size={16} className="animate-spin text-slate-400" />
              : <Send size={16} />
            }
          </button>
        </div>
      </div>
    </>
  );
}
