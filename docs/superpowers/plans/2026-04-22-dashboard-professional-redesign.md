# Dashboard Professional Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign PakEducate dashboard to premium professional quality with a working slide-in AI assistant that executes real actions (add student, teacher, fees, attendance via natural language).

**Architecture:** Keep the existing white/light-mode dashboard aesthetic that matches the user's screenshot. Upgrade the DashboardLayout sidebar + header for visual polish, redesign DashboardHome with richer KPI cards and charts, then rebuild AIAssistant as a slide-in right panel wired to the existing `actionStore` and `parseAndExecuteActions` — so the AI actually performs real operations.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Framer Motion (already installed), Recharts, Lucide React, existing `actionStore` in `src/lib/action-store.ts`

---

### Task 1: Upgrade DashboardLayout — Sidebar + Header + AI Panel Slot

**Files:**
- Modify: `src/components/DashboardLayout.tsx`

- [ ] **Step 1: Expand NAV_GROUPS** to include all pages with correct icons

Replace NAV_GROUPS with:
```tsx
const NAV_GROUPS = [
  {
    title: 'OVERVIEW',
    items: [
      { label: 'Dashboard',     path: '/dashboard',              icon: LayoutDashboard },
    ]
  },
  {
    title: 'ACADEMICS',
    items: [
      { label: 'Students',      path: '/dashboard/students',     icon: Users },
      { label: 'Admissions',    path: '/dashboard/admissions',   icon: GraduationCap },
      { label: 'Classes',       path: '/dashboard/classes',      icon: BookOpen },
      { label: 'Subjects',      path: '/dashboard/subjects',     icon: FileText },
      { label: 'Attendance',    path: '/dashboard/attendance',   icon: CalendarCheck },
      { label: 'Results',       path: '/dashboard/results',      icon: BarChart2 },
      { label: 'Homework',      path: '/dashboard/homework',     icon: ClipboardList },
    ]
  },
  {
    title: 'MANAGEMENT',
    items: [
      { label: 'Teachers',      path: '/dashboard/teachers',     icon: UserCheck },
      { label: 'Fees',          path: '/dashboard/fees',         icon: CreditCard },
      { label: 'Payroll',       path: '/dashboard/payroll',      icon: Banknote },
      { label: 'Expenses',      path: '/dashboard/expenses',     icon: Receipt },
      { label: 'Timetable',     path: '/dashboard/schedule',     icon: Clock },
      { label: 'Leave',         path: '/dashboard/leave',        icon: CalendarX },
    ]
  },
  {
    title: 'TOOLS',
    items: [
      { label: 'Analytics',     path: '/dashboard/analytics',    icon: TrendingUp },
      { label: 'Calendar',      path: '/dashboard/calendar',     icon: CalendarDays },
      { label: 'Certificates',  path: '/dashboard/certificates', icon: Award },
      { label: 'Announcements', path: '/dashboard/announcements',icon: Megaphone },
      { label: 'Notifications', path: '/dashboard/notifications',icon: Bell },
      { label: 'Settings',      path: '/dashboard/settings',     icon: Settings },
    ]
  },
];
```

- [ ] **Step 2: Redesign SidebarContent** with proper branding, avatar, group labels

```tsx
const SidebarContent = () => (
  <div className="flex flex-col h-full bg-white overflow-hidden">
    {/* Brand */}
    <div className="px-6 pt-7 pb-5 border-b border-slate-100">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 flex-shrink-0">
          <ShieldCheck size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">Pak<span className="text-amber-500">Educate</span></h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{displaySchool.split(',')[0]}</p>
        </div>
      </div>
    </div>

    {/* Nav */}
    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-hide">
      {NAV_GROUPS.map(group => (
        <div key={group.title}>
          <p className="px-3 mb-2 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">{group.title}</p>
          <div className="space-y-0.5">
            {group.items.map(item => {
              const active = location.pathname === item.path ||
                (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 text-[13px] font-semibold
                    ${active
                      ? 'bg-amber-50 text-amber-700 shadow-sm'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                >
                  <item.icon size={16} className={active ? 'text-amber-500' : 'text-slate-400 group-hover:text-slate-600'} />
                  {item.label}
                  {item.badge && (
                    <span className="ml-auto text-[8px] font-black px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-600 uppercase tracking-widest">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>

    {/* User profile at bottom */}
    <div className="px-4 py-4 border-t border-slate-100">
      <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center text-xs font-black flex-shrink-0">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-800 truncate">{displayName}</p>
          <p className="text-[10px] text-slate-400 capitalize">{displayRole}</p>
        </div>
        <Settings size={14} className="text-slate-300" />
      </div>
    </div>
  </div>
);
```

- [ ] **Step 3: Redesign header** with search bar, notification bell, AI toggle button, language

```tsx
<header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 h-16 flex items-center px-6 gap-4">
  {/* Mobile hamburger */}
  <button className="lg:hidden p-2 text-slate-400 hover:bg-slate-50 rounded-lg" onClick={() => setDrawerOpen(true)}>
    <Menu size={20} />
  </button>

  {/* Search */}
  <div className="hidden md:flex items-center gap-2 flex-1 max-w-sm bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm text-slate-400">
    <Search size={15} />
    <span className="text-sm">Search students, teachers...</span>
  </div>

  <div className="flex-1" />

  {/* Actions */}
  <div className="flex items-center gap-2">
    {/* AI button */}
    <button
      onClick={() => setAiOpen(o => !o)}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border
        ${aiOpen
          ? 'bg-amber-500 text-slate-900 border-amber-500 shadow-lg shadow-amber-500/20'
          : 'bg-white text-slate-600 border-slate-200 hover:border-amber-300 hover:text-amber-600'
        }`}
    >
      <Sparkles size={15} />
      AI Assistant
    </button>

    {/* Notifications */}
    <button className="relative p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
      <Bell size={18} />
      {notifCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />}
    </button>

    {/* Lang */}
    <button className="px-3 py-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 text-xs font-bold transition-colors">
      🌐 UR
    </button>

    {/* Logout */}
    <button onClick={() => { signOut(); navigate('/login'); }} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
      <LogOut size={18} />
    </button>
  </div>
</header>
```

- [ ] **Step 4: Add AI panel state and slide-in panel** to the layout return JSX

Add `const [aiOpen, setAiOpen] = useState(false);` to the component state.

Add AIAssistant import and render inside the main layout div:
```tsx
import AIAssistant from './AIAssistant';
// ... inside the flex div wrapping sidebar + main:
<AIAssistant open={aiOpen} onClose={() => setAiOpen(false)} />
```

- [ ] **Step 5: Verify** the page renders without errors at http://localhost:5173/dashboard

---

### Task 2: Upgrade DashboardHome — Professional Stats + Charts

**Files:**
- Modify: `src/pages/dashboard/DashboardHome.tsx`

- [ ] **Step 1: Add 4 KPI stat cards** at the top with color-coded left borders and trend indicators

```tsx
const KPI_CARDS = [
  { label: 'Total Students', value: '1,247', trend: '+12 this month', trendUp: true, icon: Users, color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
  { label: 'Attendance Today', value: '94%', trend: '1,171 present', trendUp: true, icon: CalendarCheck, color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0' },
  { label: 'Fee Collected', value: 'PKR 19.4L', trend: '81% of total', trendUp: true, icon: CreditCard, color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
  { label: 'Fee Pending', value: 'PKR 4.6L', trend: '183 students', trendUp: false, icon: AlertCircle, color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
];
```

Render as:
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
  {KPI_CARDS.map(kpi => (
    <div key={kpi.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-start gap-4 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: kpi.bg }}>
        <kpi.icon size={22} style={{ color: kpi.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{kpi.label}</p>
        <p className="text-2xl font-black text-slate-900 leading-none mb-1.5">{kpi.value}</p>
        <div className={`flex items-center gap-1 text-xs font-bold ${kpi.trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
          {kpi.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {kpi.trend}
        </div>
      </div>
    </div>
  ))}
</div>
```

- [ ] **Step 2: Improve Today's Situation card** with better visual polish (colored left bar, action buttons)

Keep same data but wrap in a card with:
- `rounded-2xl border border-slate-100 shadow-sm p-7`
- Each situation row gets a colored left-border indicator
- Action button styled: `px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100`

- [ ] **Step 3: Improve Attendance chart section** — add CartesianGrid, proper label formatting, legend

```tsx
<BarChart data={weeklyAttendance} barGap={6}>
  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
  <YAxis domain={[60, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={v => `${v}%`} />
  <Tooltip
    cursor={{ fill: 'rgba(241,245,249,0.8)', radius: 8 }}
    contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: 12 }}
    formatter={(v: number, name: string) => [`${v}%`, name === 'students' ? 'Students' : 'Teachers']}
  />
  <Bar dataKey="students" fill="#f59e0b" radius={[6,6,0,0]} barSize={20} />
  <Bar dataKey="teachers" fill="#e2e8f0" radius={[6,6,0,0]} barSize={20} />
</BarChart>
```

- [ ] **Step 4: Improve Fee Status donut** — bigger center text, cleaner legend, add summary row

Center label: `text-2xl font-black` for the 81%, `text-xs` for "Collected"

Add a PKR summary below the legend:
```tsx
<div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
  <span className="text-xs font-bold text-slate-400">Total Due</span>
  <span className="text-sm font-black text-slate-800">PKR 24.0L</span>
</div>
```

- [ ] **Step 5: Add Quick Actions row** between KPIs and Situation card

```tsx
const QUICK_ACTIONS = [
  { label: 'Add Student', icon: UserPlus, path: '/dashboard/students', color: '#3b82f6', bg: '#eff6ff' },
  { label: 'Mark Attendance', icon: CalendarCheck, path: '/dashboard/attendance', color: '#10b981', bg: '#ecfdf5' },
  { label: 'Collect Fee', icon: CreditCard, path: '/dashboard/fees', color: '#f59e0b', bg: '#fffbeb' },
  { label: 'Add Teacher', icon: UserCheck, path: '/dashboard/teachers', color: '#8b5cf6', bg: '#f5f3ff' },
  { label: 'New Result', icon: BarChart2, path: '/dashboard/results', color: '#06b6d4', bg: '#ecfeff' },
  { label: 'Send Notice', icon: Megaphone, path: '/dashboard/announcements', color: '#ef4444', bg: '#fef2f2' },
];

<div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8">
  {QUICK_ACTIONS.map(a => (
    <button
      key={a.label}
      onClick={() => navigate(a.path)}
      className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: a.bg }}>
        <a.icon size={20} style={{ color: a.color }} />
      </div>
      <span className="text-[10px] font-bold text-slate-500 text-center leading-tight">{a.label}</span>
    </button>
  ))}
</div>
```

- [ ] **Step 6: Improve Recent Transactions table** — add avatar initials, status badges with color, hover rows

Status badge classes:
- paid: `bg-emerald-50 text-emerald-700 border border-emerald-200`
- pending: `bg-amber-50 text-amber-700 border border-amber-200`
- overdue: `bg-red-50 text-red-700 border border-red-200`

---

### Task 3: Upgrade AIAssistant — Slide-in Panel + Real Action Execution

**Files:**
- Modify: `src/components/AIAssistant.tsx`

- [ ] **Step 1: Change component signature** to accept `open` and `onClose` props

```tsx
interface AIAssistantProps {
  open: boolean;
  onClose: () => void;
}

export default function AIAssistant({ open, onClose }: AIAssistantProps) {
```

Remove the internal FAB button (the toggle is now in the header). Remove the internal `open` state.

- [ ] **Step 2: Change panel from absolute bottom-right popup to fixed right slide-in**

```tsx
<div
  className={`fixed top-[40px] right-0 bottom-0 z-40 w-[400px] bg-white border-l border-slate-100 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out
    ${open ? 'translate-x-0' : 'translate-x-full'}`}
>
```

Also add a backdrop overlay when open:
```tsx
{open && (
  <div
    className="fixed inset-0 z-30 bg-slate-900/10 backdrop-blur-[1px]"
    onClick={onClose}
  />
)}
```

- [ ] **Step 3: Wire real action execution** — import `parseAndExecuteActions` and `useActionStore`

```tsx
import { parseAndExecuteActions, useActionStore } from '@/lib/action-store';

export default function AIAssistant({ open, onClose }: AIAssistantProps) {
  const storeState = useActionStore(); // keeps panel reactive to store changes
  // ...
}
```

- [ ] **Step 4: Expand the NLP parser** to handle all action types

Replace `getResponse` with `getAIResponse` that calls `parseAndExecuteActions` when it detects an action command:

```tsx
function buildActionResponse(msg: string): string {
  const lower = msg.toLowerCase();

  // Add student: "add student Ahmed Ali class 9A"
  const addStudentMatch = lower.match(/add\s+student[:\s]+([a-z\s]+?)(?:\s+class\s+(\d+[a-z-]*))?(?:\s+section\s+([a-z]))?/i);
  if (addStudentMatch || lower.includes('enroll')) {
    const name = addStudentMatch?.[1]?.trim() || 'New Student';
    const cls = addStudentMatch?.[2] ? `Class ${addStudentMatch[2]}` : 'Class 1';
    const section = addStudentMatch?.[3]?.toUpperCase() || 'A';
    return `\`\`\`action\n{"type":"add_student","data":{"name":"${name}","class":"${cls}","section":"${section}"}}\n\`\`\`\nStudent **${name}** enrolled in **${cls}-${section}** ✓`;
  }

  // Add teacher: "add teacher Sara Khan math 45000"
  const addTeacherMatch = lower.match(/add\s+teacher[:\s]+([a-z\s]+?)(?:\s+([a-z]+))?(?:\s+(\d+))?/i);
  if (addTeacherMatch) {
    const name = addTeacherMatch?.[1]?.trim() || 'New Teacher';
    const subject = addTeacherMatch?.[2] || 'General';
    const salary = parseInt(addTeacherMatch?.[3] || '35000');
    return `\`\`\`action\n{"type":"add_teacher","data":{"name":"${name}","subject":"${subject}","salary":${salary}}}\n\`\`\`\nTeacher **${name}** added (${subject}) ✓`;
  }

  // Record fee: "collect fee Ahmed 5000" or "fee payment Usman 3000"
  const feeMatch = lower.match(/(?:collect|record|fee|payment)[:\s]+([a-z\s]+?)\s+(?:pkr\s*)?(\d+)/i);
  if (feeMatch) {
    const name = feeMatch[1].trim();
    const amount = parseInt(feeMatch[2]);
    return `\`\`\`action\n{"type":"record_fee_payment","data":{"studentName":"${name}","amount":${amount},"method":"Cash"}}\n\`\`\`\nFee **PKR ${amount.toLocaleString()}** recorded for **${name}** ✓`;
  }

  // Mark attendance: "mark 9A absent" / "mark Usman present"
  const attendanceMatch = lower.match(/mark\s+([a-z0-9\s-]+?)\s+(present|absent|leave)/i);
  if (attendanceMatch) {
    const who = attendanceMatch[1].trim();
    const status = attendanceMatch[2].toLowerCase() as 'present' | 'absent' | 'leave';
    const isClass = /class\s*\d/i.test(who) || /^\d+[a-z]?$/i.test(who);
    const payload = isClass
      ? `{"type":"mark_attendance","data":{"class":"Class ${who}","status":"${status}"}}`
      : `{"type":"mark_attendance","data":{"studentName":"${who}","status":"${status}"}}`;
    return `\`\`\`action\n${payload}\n\`\`\`\n**${who}** marked **${status}** ✓`;
  }

  // Navigate: "go to fees" / "open students"
  const navMap: Record<string, string> = {
    'fees': '/dashboard/fees', 'students': '/dashboard/students',
    'teachers': '/dashboard/teachers', 'attendance': '/dashboard/attendance',
    'results': '/dashboard/results', 'settings': '/dashboard/settings',
    'analytics': '/dashboard/analytics', 'schedule': '/dashboard/schedule',
  };
  for (const [key, path] of Object.entries(navMap)) {
    if (lower.includes(key)) {
      return `\`\`\`action\n{"type":"navigate","path":"${path}"}\n\`\`\`\nOpening ${key} page...`;
    }
  }

  // Info queries — static responses
  if (lower.includes('absent')) return MOCK_RESPONSES.absent;
  if (lower.includes('fee') || lower.includes('payment')) return MOCK_RESPONSES.fee;
  if (lower.includes('top') || lower.includes('best') || lower.includes('performer')) return MOCK_RESPONSES.top;
  if (lower.includes('default')) return MOCK_RESPONSES.defaulters;
  if (lower.includes('timetable') || lower.includes('schedule')) return MOCK_RESPONSES.timetable;
  if (lower.includes('student')) return `Total students: **${storeState.students.length}**\nActive: ${storeState.students.filter(s => s.status === 'active').length}`;

  return MOCK_RESPONSES.default;
}
```

- [ ] **Step 5: In `send` function**, call `parseAndExecuteActions` on the AI response

```tsx
const send = (text: string = input.trim()) => {
  if (!text) return;
  const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text, time: now }]);
  setInput('');
  setTyping(true);
  setTimeout(() => {
    setTyping(false);
    const raw = buildActionResponse(text);
    const { cleaned, results } = parseAndExecuteActions(raw);
    const displayText = cleaned || (results.map(r => r.message).join('\n'));
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      text: displayText,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      actions: results,
    }]);
  }, 900 + Math.random() * 600);
};
```

- [ ] **Step 6: Redesign the panel header** to look premium

```tsx
<div className="bg-gradient-to-r from-slate-900 to-slate-800 px-5 py-4 flex items-center gap-3 flex-shrink-0">
  <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30 flex-shrink-0">
    <Sparkles size={16} className="text-slate-900" />
  </div>
  <div className="flex-1">
    <p className="text-sm font-black text-white tracking-tight">AI Assistant</p>
    <div className="flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Online · Actions enabled</span>
    </div>
  </div>
  <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
    <X size={18} />
  </button>
</div>
```

- [ ] **Step 7: Add action result badges** in AI messages when actions were executed

```tsx
// In Message interface add:
actions?: { ok: boolean; message: string }[];

// In message render, after text:
{m.actions && m.actions.length > 0 && (
  <div className="mt-2 flex flex-wrap gap-1.5">
    {m.actions.map((a, i) => (
      <span key={i} className={`text-[10px] font-bold px-2 py-1 rounded-full ${a.ok ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
        {a.ok ? '✓' : '✗'} {a.message}
      </span>
    ))}
  </div>
)}
```

- [ ] **Step 8: Update SUGGESTIONS** to include real action examples

```tsx
const SUGGESTIONS = [
  'Who is absent today?',
  'Add student Ahmed Ali class 9A',
  'Fee report',
  'Collect fee Usman 4500',
  'Add teacher Sara Math 45000',
  'Go to students',
];
```

- [ ] **Step 9: Verify AI actions work** — open the AI panel, type "add student Test User class 5A", then navigate to Students page and confirm the student appears.

---

### Task 4: Upgrade Landing Page to Match Approved Mockup

**Files:**
- Modify: `src/pages/LandingPage.tsx`

- [ ] **Step 1: Replace entire LandingPage.tsx** with the full mockup HTML translated to React/TSX. Key sections:
  - Navbar: sticky, glassmorphism `bg-black/20 backdrop-blur-md`, logo + links + CTA buttons
  - Hero: badge pill, large title with gradient, subtitle, two CTA buttons, browser-chrome dashboard preview
  - Stats strip: 500+ schools, 99.9% uptime, 3.2ms, E2E encrypted
  - Features grid: 6 cards (AI Governance, Liquidity Matrix, Academic Intelligence, Smart Attendance, Communication Hub, Bilingual)
  - AI section: split layout — text left, live chat demo right
  - Testimonials: 3 cards from Pakistan principals
  - CTA section: gradient glow, two buttons
  - Footer: logo, copyright, links

- [ ] **Step 2: Verify** the landing page at http://localhost:5173/ looks like the approved mockup.

---

## Self-Review Checklist

- [x] All 4 tasks cover the full redesign scope
- [x] AI assistant wired to existing `action-store.ts` — no new backend needed
- [x] `parseAndExecuteActions` used correctly (parses ```action``` blocks)
- [x] Slide-in panel receives `open`/`onClose` from `DashboardLayout` — clean interface
- [x] No TBD or TODO items remain
- [x] All file paths are exact
- [x] Component prop names are consistent across tasks (`open`, `onClose` in Task 1 Step 4 and Task 3 Step 1)
