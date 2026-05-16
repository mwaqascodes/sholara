import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, CalendarCheck, CreditCard, AlertCircle,
  TrendingUp, TrendingDown, ArrowRight,
  BarChart2, UserMinus, Clock, Calendar,
  UserPlus, UserCheck, Megaphone, ChevronDown, Sparkles,
  Library, Bus, Activity as ActivityIcon, CheckCircle2, Circle,
  Plus, Pencil, Trash2, LogIn, Cpu
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell,
  AreaChart, Area
} from 'recharts';
import { useStudents, useTeachers, useFees, useActivity, useBooks, useRoutes } from '@/lib/store';
import { leaveRequests } from '@/lib/demo-data';
import { useAuth } from '@/lib/auth-context';

const fmtPkr = (n: number) => `₨${n.toLocaleString('en-PK')}`;

const QUICK_ACTIONS = [
  { label: 'Add student',    icon: UserPlus,      path: '/dashboard/students',     color: '#3b82f6', bg: '#eff6ff' },
  { label: 'Attendance',     icon: CalendarCheck, path: '/dashboard/attendance',   color: '#10b981', bg: '#ecfdf5' },
  { label: 'Collect fee',    icon: CreditCard,    path: '/dashboard/fees',         color: '#f59e0b', bg: '#fffbeb' },
  { label: 'Add teacher',    icon: UserCheck,     path: '/dashboard/teachers',     color: '#8b5cf6', bg: '#f5f3ff' },
  { label: 'View results',   icon: BarChart2,     path: '/dashboard/results',      color: '#06b6d4', bg: '#ecfeff' },
  { label: 'Send notice',    icon: Megaphone,     path: '/dashboard/announcements',color: '#ef4444', bg: '#fef2f2' },
  { label: 'Issue book',     icon: Library,       path: '/dashboard/library',      color: '#0ea5e9', bg: '#f0f9ff' },
  { label: 'Manage fleet',   icon: Bus,           path: '/dashboard/transport',    color: '#f97316', bg: '#fff7ed' },
];

const TODAY_SCHEDULE = [
  { time: '08:30', subject: 'Mathematics',    cls: 'Class 9 — A',  teacher: 'Sara Khan',    color: '#3b82f6' },
  { time: '09:30', subject: 'English',        cls: 'Class 8 — B',  teacher: 'Imran Ali',    color: '#8b5cf6' },
  { time: '10:30', subject: 'Physics Lab',    cls: 'Class 10 — A', teacher: 'Aslam Sahab',  color: '#10b981' },
  { time: '11:30', subject: 'Islamiyat',      cls: 'Class 7 — A',  teacher: 'Fatima Bibi',  color: '#f59e0b' },
  { time: '12:30', subject: 'Computer',       cls: 'Class 9 — B',  teacher: 'Bilal Ahmad',  color: '#06b6d4' },
];

const TYPE_ICON: Record<string, { Icon: any; bg: string; text: string }> = {
  create: { Icon: Plus,    bg: 'bg-emerald-50', text: 'text-emerald-600' },
  update: { Icon: Pencil,  bg: 'bg-blue-50',    text: 'text-blue-600' },
  delete: { Icon: Trash2,  bg: 'bg-red-50',     text: 'text-red-500' },
  login:  { Icon: LogIn,   bg: 'bg-violet-50',  text: 'text-violet-600' },
  system: { Icon: Cpu,     bg: 'bg-slate-100',  text: 'text-slate-500' },
};

function relativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
}

const statusStyle: Record<string, string> = {
  paid:    'bg-emerald-50 text-emerald-700 border border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  overdue: 'bg-red-50 text-red-700 border border-red-200',
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-lg text-xs">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.fill || p.stroke }} className="font-semibold">
          {p.dataKey === 'students' ? 'Students' : p.dataKey === 'teachers' ? 'Teachers' : p.dataKey}: {p.value}{typeof p.value === 'number' && p.value <= 100 ? '%' : ''}
        </p>
      ))}
    </div>
  );
}

export default function DashboardHome() {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const { profile } = useAuth();
  const students = useStudents();
  const teachers = useTeachers();
  const fees = useFees();
  const activity = useActivity();
  const books = useBooks();
  const routes = useRoutes();
  const firstName = profile?.full_name?.trim().split(/\s+/)[0] || 'there';

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(t);
  }, []);

  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  const avgAttendance = totalStudents === 0
    ? 0
    : Math.round(students.reduce((a, s) => a + (s.attendance || 0), 0) / totalStudents);
  const presentToday = Math.round((avgAttendance / 100) * activeStudents);
  const absentToday = Math.max(activeStudents - presentToday, 0);

  const totalFeesDue = fees.reduce((a, f) => a + f.amount, 0);
  const totalFeesCollected = fees.reduce((a, f) => a + f.paid, 0);
  const totalFeesPending = Math.max(totalFeesDue - totalFeesCollected, 0);
  const collectionPct = totalFeesDue === 0 ? 0 : Math.round((totalFeesCollected / totalFeesDue) * 100);
  const pendingPct = Math.max(100 - collectionPct, 0);
  const pendingStudentsCount = fees.filter(f => f.status !== 'paid').length;
  const pendingLeaves = leaveRequests.filter(l => l.status === 'pending').length;

  const totalBookCopies = books.reduce((s, b) => s + b.copies, 0);
  const availableBooks = books.reduce((s, b) => s + b.available, 0);
  const activeRoutes = routes.filter(r => r.status === 'active').length;

  const KPI_CARDS = [
    { label: 'Total Students', value: totalStudents.toLocaleString(), trend: `${totalTeachers} teachers on staff`,            trendUp: true,  icon: Users,         color: '#3b82f6', bg: '#eff6ff' },
    { label: 'Present Today',  value: `${avgAttendance}%`,            trend: `${presentToday} of ${activeStudents} present`,  trendUp: avgAttendance >= 80, icon: CalendarCheck, color: '#10b981', bg: '#ecfdf5' },
    { label: 'Fee Collected',  value: fmtPkr(totalFeesCollected),     trend: `${collectionPct}% of total billed`,             trendUp: collectionPct >= 50, icon: CreditCard,    color: '#f59e0b', bg: '#fffbeb' },
    { label: 'Fee Pending',    value: fmtPkr(totalFeesPending),       trend: `${pendingStudentsCount} students owing`,        trendUp: false, icon: AlertCircle,   color: '#ef4444', bg: '#fef2f2' },
  ];

  const feeDonut = [
    { name: 'Collected', value: collectionPct || 0.0001, color: '#f59e0b', amount: fmtPkr(totalFeesCollected) },
    { name: 'Pending',   value: pendingPct   || 0.0001, color: '#f1f5f9', amount: fmtPkr(totalFeesPending) },
  ];

  const feeTransactions = [...fees]
    .sort((a, b) => (b.id > a.id ? 1 : -1))
    .slice(0, 5)
    .map(f => ({
      name: f.studentName,
      cls: f.class,
      amount: fmtPkr(f.amount),
      date: f.dueDate,
      status: f.status,
    }));

  const weeklyAttendance = [
    { day: 'Mon', students: Math.max(60, avgAttendance - 4), teachers: 100 },
    { day: 'Tue', students: Math.min(100, avgAttendance + 1), teachers: 96 },
    { day: 'Wed', students: avgAttendance,                    teachers: 98 },
    { day: 'Thu', students: Math.max(60, avgAttendance - 2),  teachers: 100 },
    { day: 'Fri', students: Math.min(100, avgAttendance + 3), teachers: 100 },
    { day: 'Sat', students: Math.max(55, avgAttendance - 8),  teachers: 92 },
  ];

  const enrollmentTrend = [
    { month: 'Nov', value: Math.max(0, totalStudents - 40) },
    { month: 'Dec', value: Math.max(0, totalStudents - 28) },
    { month: 'Jan', value: Math.max(0, totalStudents - 18) },
    { month: 'Feb', value: Math.max(0, totalStudents - 10) },
    { month: 'Mar', value: Math.max(0, totalStudents - 4) },
    { month: 'Apr', value: totalStudents },
  ];

  const situations = [
    absentToday > 0 && {
      icon: UserMinus, title: `${absentToday} student${absentToday === 1 ? '' : 's'} absent today`,
      sub: `${presentToday} of ${activeStudents} present (${avgAttendance}%)`,
      action: 'Notify parents', color: 'text-red-500', bg: 'bg-red-50', path: '/dashboard/attendance',
    },
    pendingStudentsCount > 0 && {
      icon: Clock, title: `${pendingStudentsCount} fee payment${pendingStudentsCount === 1 ? '' : 's'} still pending`,
      sub: `${fmtPkr(totalFeesCollected)} collected of ${fmtPkr(totalFeesDue)} (${collectionPct}%)`,
      action: 'View pending fees', color: 'text-amber-500', bg: 'bg-amber-50', path: '/dashboard/fees',
    },
    pendingLeaves > 0 && {
      icon: Calendar, title: `${pendingLeaves} leave request${pendingLeaves === 1 ? '' : 's'} need approval`,
      sub: 'Review and approve or reject',
      action: 'Review leaves', color: 'text-blue-500', bg: 'bg-blue-50', path: '/dashboard/leave',
    },
  ].filter(Boolean) as Array<{ icon: any; title: string; sub: string; action: string; color: string; bg: string; path: string }>;

  const onboarding = [
    { title: 'Welcome to Scholara',     desc: 'Your demo workspace is ready to explore.',                        done: true,  path: '/dashboard' },
    { title: 'Add your first student',  desc: 'Start building your enrollment registry.',                        done: totalStudents > 0,  path: '/dashboard/students' },
    { title: 'Onboard teaching staff',  desc: 'Add teachers to build timetables and assign subjects.',           done: totalTeachers > 0,  path: '/dashboard/teachers' },
    { title: 'Configure fee structure', desc: 'Set up tuition records to start tracking collection.',           done: fees.length > 0,     path: '/dashboard/fees' },
    { title: 'Set up library catalog',  desc: 'Add books so students can start borrowing.',                      done: books.length > 0,    path: '/dashboard/library' },
    { title: 'Map transport routes',    desc: 'Register buses, drivers, and pickup stops.',                      done: routes.length > 0,   path: '/dashboard/transport' },
  ];
  const onboardingDone = onboarding.filter(o => o.done).length;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300 pb-8 space-y-7 font-sans">

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.28em] text-amber-600 mb-2">Overview</p>
          <h1 className="font-display font-semibold text-slate-900 text-3xl md:text-[34px] tracking-[-0.035em] leading-[1.05]">
            {greeting}, {firstName}<span className="text-slate-300"> ·</span>{' '}
            <span className="font-serif italic font-normal text-amber-500">a quick look.</span>
          </h1>
          <p className="text-slate-500 text-[14.5px] mt-2 leading-[1.55]">{dateStr}</p>
        </div>
        <button className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all text-[13px] font-semibold text-slate-700">
          <Calendar size={14} className="text-slate-400" />
          Last 7 days
          <ChevronDown size={13} className="text-slate-400" />
        </button>
      </div>

      {/* ── KPI CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {KPI_CARDS.map(kpi => (
          <div
            key={kpi.label}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-start gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-default"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: kpi.bg }}
            >
              <kpi.icon size={20} style={{ color: kpi.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-[0.18em] mb-1.5">{kpi.label}</p>
              <p className="font-display font-semibold text-slate-900 text-[26px] leading-none mb-2 tracking-[-0.03em]">{kpi.value}</p>
              <div className={`flex items-center gap-1 text-[12px] font-medium ${kpi.trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
                {kpi.trendUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {kpi.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── ONBOARDING + QUICK ACTIONS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Onboarding */}
        <div className="lg:col-span-1 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-900 rounded-2xl shadow-sm overflow-hidden text-white relative">
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute top-[-30%] right-[-20%] w-[60%] h-[80%] bg-amber-500/30 blur-[80px] rounded-full" />
          </div>
          <div className="relative p-6">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles size={13} className="text-amber-300" />
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-amber-300">Getting Started</p>
            </div>
            <h3 className="font-display font-semibold text-[22px] tracking-[-0.025em] leading-tight mb-1">Set up your school.</h3>
            <p className="text-white/55 text-[13px] mb-4">{onboardingDone} of {onboarding.length} complete</p>
            <div className="h-1 rounded-full bg-white/10 overflow-hidden mb-5">
              <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all" style={{ width: `${(onboardingDone / onboarding.length) * 100}%` }} />
            </div>
            <ul className="space-y-2.5">
              {onboarding.map(item => (
                <li
                  key={item.title}
                  onClick={() => navigate(item.path)}
                  className={`flex items-start gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all
                    ${item.done ? 'bg-white/[0.04]' : 'bg-white/[0.06] hover:bg-white/[0.1]'}`}
                >
                  {item.done
                    ? <CheckCircle2 size={17} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    : <Circle size={17} className="text-white/40 flex-shrink-0 mt-0.5" />
                  }
                  <div className="flex-1 min-w-0">
                    <p className={`text-[13px] font-semibold ${item.done ? 'text-white/65 line-through decoration-white/30' : 'text-white'} tracking-tight`}>{item.title}</p>
                    <p className="text-[11.5px] text-white/45 mt-0.5">{item.desc}</p>
                  </div>
                  <ArrowRight size={13} className="text-white/30 flex-shrink-0 mt-1" />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quick actions */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-baseline justify-between mb-4">
            <h3 className="font-display font-semibold text-slate-900 text-[18px] tracking-[-0.02em]">Quick actions</h3>
            <p className="text-[12px] text-slate-400">One-tap shortcuts</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {QUICK_ACTIONS.map(a => (
              <button
                key={a.label}
                onClick={() => navigate(a.path)}
                className="flex flex-col items-center gap-2.5 p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-slate-200 transition-all active:scale-95 group"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                  style={{ background: a.bg }}
                >
                  <a.icon size={19} style={{ color: a.color }} />
                </div>
                <span className="text-[12px] font-semibold text-slate-700 text-center leading-tight tracking-tight">{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── TODAY'S SITUATION ── */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-display font-semibold text-slate-900 text-[18px] tracking-[-0.02em]">Today's situation</h2>
            <p className="text-[12.5px] text-slate-500 font-medium mt-0.5">{dateStr}</p>
          </div>
          <span className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 uppercase tracking-[0.18em]">
            {situations.length} {situations.length === 1 ? 'alert' : 'alerts'}
          </span>
        </div>

        <div className="divide-y divide-slate-50">
          {situations.length === 0 && (
            <div className="px-6 py-10 text-center text-[14px] font-medium text-slate-400">
              <CheckCircle2 size={28} className="mx-auto mb-2 text-emerald-400" />
              All clear — no pending items today.
            </div>
          )}
          {situations.map((row, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/60 transition-colors">
              <div className={`w-10 h-10 rounded-xl ${row.bg} flex items-center justify-center flex-shrink-0`}>
                <row.icon size={18} className={row.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                  <p className="text-[14px] font-semibold text-slate-900 truncate tracking-tight">{row.title}</p>
                </div>
                <p className="text-[12.5px] font-medium text-slate-500 mt-0.5">{row.sub}</p>
              </div>
              <button
                onClick={() => navigate(row.path)}
                className="flex-shrink-0 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 text-[12.5px] font-semibold transition-all flex items-center gap-1.5"
              >
                {row.action}
                <ArrowRight size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── CHARTS ROW ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Attendance trends */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-semibold text-slate-900 text-[17px] tracking-[-0.02em]">Attendance trends</h3>
              <p className="text-[12.5px] text-slate-500 font-medium mt-0.5">Last 6 days · students vs. teachers</p>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-slate-500 uppercase tracking-[0.16em]">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Students
              </div>
              <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-slate-500 uppercase tracking-[0.16em]">
                <span className="w-2 h-2 rounded-full bg-slate-300" /> Teachers
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyAttendance} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }} />
              <YAxis domain={[50, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={v => `${v}%`} width={36} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(241,245,249,0.6)', radius: 8 }} />
              <Bar dataKey="students" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={22} />
              <Bar dataKey="teachers" fill="#cbd5e1" radius={[6, 6, 0, 0]} barSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Fee donut */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
          <h3 className="font-display font-semibold text-slate-900 text-[17px] tracking-[-0.02em]">Fee status</h3>
          <p className="text-[12.5px] text-slate-500 font-medium mb-4 mt-0.5">April 2026 collection</p>

          <div className="relative h-[160px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={feeDonut}
                  innerRadius={55}
                  outerRadius={72}
                  dataKey="value"
                  paddingAngle={4}
                  startAngle={90}
                  endAngle={-270}
                >
                  {feeDonut.map((entry, index) => (
                    <Cell key={index} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-display font-semibold text-slate-900 text-[26px] tracking-[-0.03em]">{collectionPct}%</span>
              <span className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-[0.18em]">Collected</span>
            </div>
          </div>

          <div className="mt-4 space-y-2.5">
            {feeDonut.map(d => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  <span className="text-[13px] font-semibold text-slate-600">{d.name}</span>
                </div>
                <span className="font-display font-semibold text-slate-900 text-[14px] tracking-[-0.01em]">{d.amount}</span>
              </div>
            ))}
            <div className="pt-2.5 border-t border-slate-100 flex justify-between items-center">
              <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-[0.14em]">Total Due</span>
              <span className="font-display font-semibold text-slate-900 text-[14px] tracking-[-0.01em]">{fmtPkr(totalFeesDue)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── ENROLLMENT TREND + TODAY'S SCHEDULE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Enrollment trend */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
          <h3 className="font-display font-semibold text-slate-900 text-[17px] tracking-[-0.02em]">Enrollment trend</h3>
          <p className="text-[12.5px] text-slate-500 font-medium mb-3 mt-0.5">Past 6 months</p>
          <div className="font-display font-semibold text-slate-900 text-[28px] tracking-[-0.03em] leading-none">{totalStudents}</div>
          <p className="text-[12px] text-emerald-600 font-medium mt-1 mb-4">
            <TrendingUp size={11} className="inline mr-1 -mt-0.5" />
            +40 new students since November
          </p>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={enrollmentTrend}>
              <defs>
                <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2.5} fill="url(#colorTrend)" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
              <Tooltip content={<CustomTooltip />} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Today's schedule */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-display font-semibold text-slate-900 text-[17px] tracking-[-0.02em]">Today's schedule</h3>
              <p className="text-[12.5px] text-slate-500 font-medium mt-0.5">5 classes scheduled · period view</p>
            </div>
            <button
              onClick={() => navigate('/dashboard/schedule')}
              className="text-[12px] font-semibold text-amber-700 hover:text-amber-800 transition-colors flex items-center gap-1"
            >
              Full timetable <ArrowRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {TODAY_SCHEDULE.map((p, i) => (
              <div key={i} className="px-6 py-3.5 flex items-center gap-4 hover:bg-slate-50/60 transition-colors">
                <div className="font-display font-semibold text-slate-900 text-[15px] tracking-[-0.01em] w-14 flex-shrink-0">{p.time}</div>
                <div className="w-1 h-9 rounded-full flex-shrink-0" style={{ background: p.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-slate-900 tracking-tight truncate">{p.subject}</p>
                  <p className="text-[12px] text-slate-500 mt-0.5 truncate">{p.cls} · {p.teacher}</p>
                </div>
                <span className="text-[10.5px] font-semibold text-slate-500 px-2 py-1 rounded-full bg-slate-100 uppercase tracking-[0.14em]">
                  {i === 0 ? 'Now' : i === 1 ? 'Next' : 'Upcoming'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── OPERATIONS SNAPSHOT ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Library catalog',      value: `${availableBooks} / ${totalBookCopies}`, sub: 'copies available now', icon: Library, color: '#0ea5e9', bg: '#f0f9ff', path: '/dashboard/library' },
          { label: 'Transport fleet',      value: `${activeRoutes} active`,                  sub: `${routes.length} routes total`, icon: Bus,     color: '#f97316', bg: '#fff7ed', path: '/dashboard/transport' },
          { label: 'System events today',  value: `${activity.filter(a => new Date(a.ts).toDateString() === new Date().toDateString()).length}`, sub: 'View full audit log', icon: ActivityIcon, color: '#8b5cf6', bg: '#f5f3ff', path: '/dashboard/activity' },
        ].map(s => (
          <button
            key={s.label}
            onClick={() => navigate(s.path)}
            className="text-left bg-white border border-slate-100 rounded-2xl shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
                <s.icon size={19} style={{ color: s.color }} />
              </div>
              <ArrowRight size={14} className="text-slate-300" />
            </div>
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-slate-400 mt-4">{s.label}</p>
            <p className="font-display font-semibold text-slate-900 text-[24px] tracking-[-0.03em] leading-none mt-2">{s.value}</p>
            <p className="text-[12px] text-slate-500 font-medium mt-1.5">{s.sub}</p>
          </button>
        ))}
      </div>

      {/* ── ACTIVITY FEED + RECENT TRANSACTIONS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Activity feed */}
        <div className="lg:col-span-1 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-display font-semibold text-slate-900 text-[17px] tracking-[-0.02em]">Recent activity</h3>
              <p className="text-[12.5px] text-slate-500 font-medium mt-0.5">Live across the platform</p>
            </div>
            <button
              onClick={() => navigate('/dashboard/activity')}
              className="text-[12px] font-semibold text-amber-700 hover:text-amber-800 transition-colors flex items-center gap-1"
            >
              All <ArrowRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-slate-50 max-h-[460px] overflow-y-auto">
            {activity.slice(0, 6).map(a => {
              const meta = TYPE_ICON[a.type] || TYPE_ICON.system;
              const Icon = meta.Icon;
              return (
                <div key={a.id} className="px-6 py-3.5 flex items-start gap-3 hover:bg-slate-50/60 transition-colors">
                  <div className={`w-8 h-8 rounded-full ${meta.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={13} className={meta.text} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-slate-800 leading-snug">
                      <span className="font-semibold text-slate-900">{a.actor}</span>{' '}
                      <span className="text-slate-600">{a.action}</span>
                      {a.target && <> <span className="font-medium text-slate-900">{a.target}</span></>}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">{relativeTime(a.ts)} · {a.module}</p>
                  </div>
                </div>
              );
            })}
            {activity.length === 0 && (
              <div className="px-6 py-12 text-center text-[13px] text-slate-400">No activity yet.</div>
            )}
          </div>
        </div>

        {/* Recent transactions */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-display font-semibold text-slate-900 text-[17px] tracking-[-0.02em]">Recent fee transactions</h3>
              <p className="text-[12.5px] text-slate-500 font-medium mt-0.5">Latest payments and pending dues</p>
            </div>
            <button
              onClick={() => navigate('/dashboard/fees')}
              className="text-[12px] font-semibold text-amber-700 hover:text-amber-800 transition-colors flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/70">
                  <th className="px-6 py-3.5 text-[10.5px] font-semibold text-slate-400 uppercase tracking-[0.18em]">Student</th>
                  <th className="px-6 py-3.5 text-[10.5px] font-semibold text-slate-400 uppercase tracking-[0.18em]">Amount</th>
                  <th className="px-6 py-3.5 text-[10.5px] font-semibold text-slate-400 uppercase tracking-[0.18em] hidden sm:table-cell">Due</th>
                  <th className="px-6 py-3.5 text-[10.5px] font-semibold text-slate-400 uppercase tracking-[0.18em]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {feeTransactions.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-400 text-sm">No fee records yet.</td></tr>
                ) : feeTransactions.map((tx, i) => (
                  <tr key={i} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-[12px] font-semibold flex-shrink-0">
                          {tx.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-[14px] font-semibold text-slate-900 tracking-tight">{tx.name}</p>
                          <p className="text-[11.5px] font-medium text-slate-500">{tx.cls}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 font-display font-semibold text-slate-900 text-[14px] tracking-[-0.01em]">{tx.amount}</td>
                    <td className="px-6 py-3.5 text-[13px] font-medium text-slate-500 hidden sm:table-cell">{tx.date}</td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10.5px] font-semibold uppercase tracking-[0.14em] ${statusStyle[tx.status]}`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
