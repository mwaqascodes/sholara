import { useState, useEffect } from 'react';
import {
  Users, Clock, Calendar, CreditCard, ArrowRight, AlertCircle,
  TrendingUp, TrendingDown, Plus, CheckCircle, BarChart2, Bell as BellIcon,
  Sparkles, X, RefreshCw, UserX
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useSchool } from '@/lib/school-context';
import { useNavigate } from 'react-router-dom';
import AnimatedCounter from '@/components/AnimatedCounter';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

/* ─── Mock data ─── */
const weeklyAttendance = [
  { day: 'Mon', students: 92, teachers: 98 },
  { day: 'Tue', students: 88, teachers: 96 },
  { day: 'Wed', students: 91, teachers: 100 },
  { day: 'Thu', students: 96, teachers: 98 },
  { day: 'Fri', students: 85, teachers: 94 },
  { day: 'Sat', students: 71, teachers: 88 },
];

const feeStatusData = [
  { name: 'Collected', value: 81, amount: 'PKR 19.4L', color: '#F59E0B' },
  { name: 'Pending', value: 19, amount: 'PKR 4.6L', color: '#E5E7EB' },
];

const recentStudents = [
  { name: 'Ahmed Khan', class: 'Class 5-A', date: '18 Apr', color: '#F59E0B' },
  { name: 'Fatima Ali', class: 'Class 3-B', date: '16 Apr', color: '#3B82F6' },
  { name: 'Usman Raza', class: 'Class 7-C', date: '14 Apr', color: '#8B5CF6' },
  { name: 'Sara Malik', class: 'Class 4-A', date: '12 Apr', color: '#10B981' },
  { name: 'Hassan Iqbal', class: 'Class 6-B', date: '10 Apr', color: '#EF4444' },
];

const feeTransactions = [
  { name: 'Ahmed Khan', class: 'Class 5-A', amount: 'PKR 3,500', date: '21 Apr', status: 'paid' as const },
  { name: 'Fatima Ali', class: 'Class 3-B', amount: 'PKR 3,500', date: '20 Apr', status: 'paid' as const },
  { name: 'Usman Raza', class: 'Class 7-C', amount: 'PKR 4,000', date: '19 Apr', status: 'pending' as const },
  { name: 'Sara Malik', class: 'Class 4-A', amount: 'PKR 3,500', date: '18 Apr', status: 'overdue' as const },
  { name: 'Hassan Iqbal', class: 'Class 6-B', amount: 'PKR 4,000', date: '17 Apr', status: 'paid' as const },
];

export default function DashboardHome() {
  const { user, profile } = useAuth();
  const { settings } = useSchool();
  const navigate = useNavigate();
  const userName = profile?.full_name || user?.email?.split('@')[0] || 'Admin';
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const now = new Date();
  const hours = now.getHours();
  const greeting = hours < 12 ? 'Good Morning' : hours < 17 ? 'Good Afternoon' : 'Good Evening';
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const Skeleton = ({ className = '' }: { className?: string }) => (
    <div className={`animate-shimmer rounded-xl ${className}`} />
  );

  if (loading) {
    return (
      <div className="space-y-6 max-w-[1100px] mx-auto">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-56 w-full" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-28" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1100px] mx-auto">
      {/* ─── WELCOME HEADER (matches screenshot) ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-accent/30 rounded-2xl p-5 lg:p-6">
        <div className="flex items-center gap-4">
          {/* Avatar circle */}
          <div className="w-14 h-14 rounded-full bg-foreground flex items-center justify-center text-card text-lg font-bold shrink-0">
            {userInitials}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {greeting}, {userName}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {settings.name || 'IlmDesk School'} · {dateStr}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-sm text-muted-foreground hover:bg-muted transition-colors">
            <Calendar className="w-4 h-4" />
            Last 7 days
          </button>
        </div>
      </div>

      {/* ─── TODAY'S SITUATION (matches screenshot exactly) ─── */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Today's Situation</h2>
            <p className="text-sm text-muted-foreground">{dateStr}</p>
          </div>
          <span className="text-xs text-muted-foreground border border-border rounded-full px-3 py-1">3 items</span>
        </div>

        {/* Alert items with gradient left border */}
        <div className="px-6 pb-5">
          <div className="relative pl-4 border-l-[3px]" style={{ borderImage: 'linear-gradient(to bottom, #EF4444, #F59E0B) 1' }}>
            <div className="space-y-0">
              {/* Item 1: Absent students */}
              <div className="flex items-center justify-between py-4 border-b border-border/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                    <UserX className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-destructive inline-block" />
                      6 students absent today
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">29 of 133 present (22%)</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/dashboard/attendance')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0"
                >
                  Notify parents <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Item 2: Pending fees */}
              <div className="flex items-center justify-between py-4 border-b border-border/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                      183 fee payments still pending
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">PKR 19.4L collected of PKR 24.0L (81%)</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/dashboard/fees')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0"
                >
                  View pending fees <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Item 3: Leave requests */}
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                      2 leave requests need approval
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">Review and approve or reject</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/dashboard/leave')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0"
                >
                  Review leaves <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── KPI STAT CARDS ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: 1240, icon: Users, trend: '+28 this month', trendUp: true, iconBg: 'bg-primary/10', iconColor: 'text-primary' },
          { label: 'Present Today', value: 1087, icon: CheckCircle, trend: '87.7%', trendUp: true, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500' },
          { label: 'Fee Collected', value: 482, icon: CreditCard, trend: '81% collected', trendUp: true, iconBg: 'bg-primary/10', iconColor: 'text-primary', prefix: 'PKR ', suffix: 'K' },
          { label: 'Pending Fees', value: 28, icon: AlertCircle, trend: '12 defaulters', trendUp: false, iconBg: 'bg-red-50', iconColor: 'text-destructive', prefix: 'PKR ', suffix: 'K' },
        ].map((card, i) => (
          <div
            key={card.label}
            className="bg-card border border-border rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              <div className={`flex items-center gap-1 text-[11px] font-medium ${card.trendUp ? 'text-emerald-600' : 'text-destructive'}`}>
                {card.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {card.trend}
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {card.prefix || ''}<AnimatedCounter end={card.value} />{card.suffix || ''}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* ─── CHARTS ROW ─── */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Attendance Chart */}
        <div className="lg:col-span-3 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Weekly Attendance</h2>
            <button className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
              View Report <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyAttendance} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13 }} formatter={(v: number) => `${v}%`} />
              <Bar dataKey="students" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Students" barSize={18} />
              <Bar dataKey="teachers" fill="#FDE68A" radius={[4, 4, 0, 0]} name="Teachers" barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Fee Status Donut */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Fee Collection</h2>
          <div className="flex justify-center">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={feeStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={2} dataKey="value">
                  {feeStatusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center -mt-1 mb-3">
            <p className="text-xl font-bold text-foreground">81%</p>
            <p className="text-xs text-muted-foreground">Collected</p>
          </div>
          <div className="space-y-2">
            {feeStatusData.map(item => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-medium text-foreground">{item.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── BOTTOM ROW ─── */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Students */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Recent Students</h2>
            <button onClick={() => navigate('/dashboard/students')} className="text-xs text-primary font-medium hover:underline">View All →</button>
          </div>
          <div className="space-y-3">
            {recentStudents.map(s => (
              <div key={s.name} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: s.color }}>
                  {s.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.class}</p>
                </div>
                <span className="text-[11px] text-muted-foreground">{s.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fee Transactions */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Recent Fee Transactions</h2>
            <button onClick={() => navigate('/dashboard/fees')} className="text-xs text-primary font-medium hover:underline">View All →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Student</th>
                  <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Amount</th>
                  <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {feeTransactions.map((t, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-2.5 px-2">
                      <p className="font-medium text-foreground text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.class}</p>
                    </td>
                    <td className="py-2.5 px-2 text-sm text-foreground">{t.amount}</td>
                    <td className="py-2.5 px-2">
                      <span className={
                        t.status === 'paid' ? 'badge-success' :
                        t.status === 'pending' ? 'badge-warning' : 'badge-danger'
                      }>
                        {t.status === 'paid' ? 'Paid' : t.status === 'pending' ? 'Pending' : 'Overdue'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pb-4">
        <RefreshCw className="w-3 h-3" /> Last updated: Just now
      </div>
    </div>
  );
}
