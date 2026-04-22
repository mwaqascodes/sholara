import { useState, useEffect } from 'react';
import {
  Users, CalendarCheck, CreditCard, AlertCircle, TrendingUp, TrendingDown,
  ArrowRight, Plus, CheckCircle, BarChart2, Bell as BellIcon, Sparkles,
  Clock, X, RefreshCw
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useSchool } from '@/lib/school-context';
import { useNavigate } from 'react-router-dom';
import AnimatedCounter from '@/components/AnimatedCounter';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

// Mock data
const weeklyAttendance = [
  { day: 'Mon', students: 92, teachers: 98 },
  { day: 'Tue', students: 88, teachers: 96 },
  { day: 'Wed', students: 91, teachers: 100 },
  { day: 'Thu', students: 96, teachers: 98 },
  { day: 'Fri', students: 85, teachers: 94 },
  { day: 'Sat', students: 71, teachers: 88 },
  { day: 'Sun', students: 0, teachers: 0 },
];

const feeStatusData = [
  { name: 'Collected', value: 94, amount: 'PKR 8,50,000', color: '#10B981' },
  { name: 'Pending', value: 4, amount: 'PKR 1,50,000', color: '#F59E0B' },
  { name: 'Overdue', value: 2, amount: 'PKR 28,500', color: '#EF4444' },
];

const recentStudents = [
  { name: 'Ahmed Khan', class: 'Class 5-A', date: '18 Apr 2026', color: '#10B981' },
  { name: 'Fatima Ali', class: 'Class 3-B', date: '16 Apr 2026', color: '#3B82F6' },
  { name: 'Usman Raza', class: 'Class 7-C', date: '14 Apr 2026', color: '#8B5CF6' },
  { name: 'Sara Malik', class: 'Class 4-A', date: '12 Apr 2026', color: '#F59E0B' },
  { name: 'Hassan Iqbal', class: 'Class 6-B', date: '10 Apr 2026', color: '#EF4444' },
];

const todaySchedule = [
  { time: '8:00–8:45', subject: 'Urdu', teacher: 'Mr. Tariq Mahmood', class: 'Class 5-A', color: '#10B981' },
  { time: '8:45–9:30', subject: 'Mathematics', teacher: 'Ms. Rukhsana Bibi', class: 'Class 7-B', color: '#3B82F6' },
  { time: '9:45–10:30', subject: 'English', teacher: 'Mr. Imran Shahid', class: 'Class 9-A', color: '#8B5CF6' },
  { time: '10:30–11:15', subject: 'Islamiyat', teacher: 'Mr. Tariq Mahmood', class: 'Class 3-B', color: '#F59E0B' },
  { time: '11:30–12:15', subject: 'Science', teacher: 'Ms. Rukhsana Bibi', class: 'Class 6-A', color: '#EF4444' },
];

const feeTransactions = [
  { name: 'Ahmed Khan', class: 'Class 5-A', amount: 'PKR 3,500', date: '21 Apr', status: 'paid' },
  { name: 'Fatima Ali', class: 'Class 3-B', amount: 'PKR 3,500', date: '20 Apr', status: 'paid' },
  { name: 'Usman Raza', class: 'Class 7-C', amount: 'PKR 4,000', date: '19 Apr', status: 'pending' },
  { name: 'Sara Malik', class: 'Class 4-A', amount: 'PKR 3,500', date: '18 Apr', status: 'overdue' },
  { name: 'Hassan Iqbal', class: 'Class 6-B', amount: 'PKR 4,000', date: '17 Apr', status: 'paid' },
];

const announcements = [
  { title: 'Monthly Test Schedule', desc: 'Class 5–8 tests start Monday', priority: 'red', audience: 'All Students', date: '21 Apr' },
  { title: 'Fee Reminder', desc: 'Last date for April fee is 25th', priority: 'amber', audience: 'All Students', date: '20 Apr' },
  { title: 'Holiday Notice', desc: 'School closed Friday for national holiday', priority: 'green', audience: 'All', date: '19 Apr' },
];

const quickActions = [
  { label: 'Add Student', labelUr: 'طالب علم شامل کریں', icon: Plus, path: '/dashboard/students', color: '#3B82F6' },
  { label: 'Mark Attendance', labelUr: 'حاضری لگائیں', icon: CheckCircle, path: '/dashboard/attendance', color: '#10B981' },
  { label: 'Add Fee Payment', labelUr: 'فیس جمع کریں', icon: CreditCard, path: '/dashboard/fees', color: '#10B981' },
  { label: 'Generate Result', labelUr: 'نتیجہ بنائیں', icon: BarChart2, path: '/dashboard/result-card', color: '#8B5CF6' },
  { label: 'Send Notice', labelUr: 'اطلاع بھیجیں', icon: BellIcon, path: '/dashboard/announcements', color: '#F59E0B' },
  { label: 'Ask AI', labelUr: 'AI سے پوچھیں', icon: Sparkles, path: '#ai', color: '#3B82F6', gradient: true },
];

export default function DashboardHome() {
  const { user, profile } = useAuth();
  const { settings } = useSchool();
  const navigate = useNavigate();
  const userName = profile?.full_name || user?.email?.split('@')[0] || 'Admin';
  const [showAlert, setShowAlert] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const now = new Date();
  const dateEn = now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const Skeleton = ({ className = '' }: { className?: string }) => (
    <div className={`animate-shimmer rounded-lg ${className}`} />
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
        <div className="grid lg:grid-cols-5 gap-6">
          <Skeleton className="lg:col-span-3 h-72" />
          <Skeleton className="lg:col-span-2 h-72" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Dismissible alert */}
      {showAlert && (
        <div className="flex items-center justify-between bg-warning/10 border border-warning/20 rounded-lg px-4 py-3 animate-fade-in-up">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-warning" />
            <span className="text-sm font-medium text-foreground">
              ⚠️ 12 students have overdue fees —
            </span>
            <button onClick={() => navigate('/dashboard/fees')} className="text-sm font-semibold text-primary hover:underline">
              Review Now →
            </button>
          </div>
          <button onClick={() => setShowAlert(false)} className="p-1 rounded hover:bg-muted transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="bg-primary/5 border border-primary/10 rounded-xl p-5 animate-fade-in-up">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              السلام علیکم، {userName}! 👋
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              آج کا خلاصہ — Today's Summary
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{dateEn}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
              🟢 1,240 Students
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-info/10 text-info">
              🔵 48 Teachers
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-warning/10 text-warning">
              🟡 Session 2025–26
            </span>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', labelUr: 'کل طلباء', value: 1240, icon: Users, trend: '+28 this month', trendUp: true, iconBg: '#DBEAFE', iconColor: '#3B82F6' },
          { label: 'Present Today', labelUr: 'آج حاضر', value: 1087, icon: CalendarCheck, trend: '87.7% rate', trendUp: true, iconBg: '#D1FAE5', iconColor: '#10B981' },
          { label: 'Fee Collected', labelUr: 'اس ماہ وصول', value: 482000, icon: CreditCard, trend: '94% collected', trendUp: true, iconBg: '#D1FAE5', iconColor: '#10B981', prefix: 'PKR ', format: true },
          { label: 'Pending Fees', labelUr: 'باقی فیس', value: 28500, icon: AlertCircle, trend: '12 defaulters', trendUp: false, iconBg: '#FEF3C7', iconColor: '#F59E0B', prefix: 'PKR ', format: true },
        ].map((card, i) => (
          <div
            key={card.label}
            className="bg-card border border-border rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: card.iconBg }}>
                <card.icon className="w-5 h-5" style={{ color: card.iconColor }} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${card.trendUp ? 'text-primary' : 'text-warning'}`}>
                {card.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {card.trend}
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {card.format ? (
                <>{card.prefix}<AnimatedCounter end={card.value} /></>
              ) : (
                <AnimatedCounter end={card.value} />
              )}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{card.label} / <span className="font-urdu">{card.labelUr}</span></p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Attendance Chart */}
        <div className="lg:col-span-3 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Attendance Overview / <span className="font-urdu text-muted-foreground">حاضری کا جائزہ</span></h2>
            </div>
            <button className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
              View Full Report <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={weeklyAttendance} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13 }}
                formatter={(v: number) => `${v}%`}
              />
              <Bar dataKey="students" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Students" barSize={20} />
              <Bar dataKey="teachers" fill="#10B981" radius={[4, 4, 0, 0]} name="Teachers" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-3">
            <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">Avg: 88.4%</span>
            <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">Best: Thu 96%</span>
            <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">Lowest: Sat 71%</span>
          </div>
        </div>

        {/* Fee Status Donut */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Fee Status / <span className="font-urdu text-muted-foreground">فیس کی حالت</span></h2>
            <span className="text-xs text-muted-foreground">April 2026</span>
          </div>
          <div className="flex justify-center">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie
                  data={feeStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {feeStatusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center -mt-2 mb-4">
            <p className="text-lg font-bold text-foreground">PKR 10.28L</p>
            <p className="text-xs text-muted-foreground">Total</p>
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

      {/* Three Column Row */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Recent Students */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Recent Students / <span className="font-urdu text-muted-foreground">حالیہ طلباء</span></h2>
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
          <button
            onClick={() => navigate('/dashboard/students')}
            className="w-full mt-4 py-2 rounded-lg border border-primary/30 text-primary text-sm font-medium hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Student
          </button>
        </div>

        {/* Today's Classes */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Today's Classes / <span className="font-urdu text-muted-foreground">آج کی کلاسیں</span></h2>
            <span className="text-xs text-muted-foreground">{now.toLocaleDateString('en', { day: 'numeric', month: 'short' })}</span>
          </div>
          <div className="space-y-3">
            {todaySchedule.map(s => (
              <div key={s.time} className="flex items-start gap-3">
                <div className="w-1 h-full min-h-[40px] rounded-full shrink-0" style={{ background: s.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-muted text-muted-foreground">{s.time}</span>
                  </div>
                  <p className="text-sm font-medium text-foreground mt-1">{s.subject}</p>
                  <p className="text-xs text-muted-foreground">{s.teacher} · {s.class}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/dashboard/schedule')} className="text-xs text-primary font-medium hover:underline mt-3 flex items-center gap-1">
            View Timetable <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Quick Actions / <span className="font-urdu text-muted-foreground">فوری اقدامات</span></h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map(action => (
              <button
                key={action.label}
                onClick={() => action.path !== '#ai' && navigate(action.path)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:shadow-md hover:scale-[1.02] active:scale-[0.97] transition-all duration-200 ${
                  action.gradient ? 'bg-gradient-to-br from-primary/10 to-info/10' : 'bg-card hover:bg-muted/50'
                }`}
              >
                <action.icon className="w-5 h-5" style={{ color: action.color }} />
                <span className="text-xs font-medium text-foreground">{action.label}</span>
                <span className="text-[9px] text-muted-foreground font-urdu">{action.labelUr}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Fee Transactions */}
        <div className="lg:col-span-3 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Fee Transactions / <span className="font-urdu text-muted-foreground">فیس لین دین</span></h2>
            <button onClick={() => navigate('/dashboard/fees')} className="text-xs text-primary font-medium hover:underline">View All →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Student</th>
                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Class</th>
                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {feeTransactions.map((t, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-foreground">{t.name}</td>
                    <td className="py-2.5 px-3 text-muted-foreground">{t.class}</td>
                    <td className="py-2.5 px-3 text-foreground">{t.amount}</td>
                    <td className="py-2.5 px-3 text-muted-foreground">{t.date}</td>
                    <td className="py-2.5 px-3">
                      <span className={
                        t.status === 'paid' ? 'badge-success' :
                        t.status === 'pending' ? 'badge-warning' : 'badge-danger'
                      }>
                        {t.status === 'paid' ? 'Paid / ادا' : t.status === 'pending' ? 'Pending / باقی' : 'Overdue / تاخیر'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Announcements */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Announcements / <span className="font-urdu text-muted-foreground">اعلانات</span></h2>
            <button onClick={() => navigate('/dashboard/announcements')} className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-lg hover:bg-primary/20 transition-colors">
              + New
            </button>
          </div>
          <div className="space-y-3">
            {announcements.map((a, i) => (
              <div key={i} className="border-l-[3px] pl-3 py-2" style={{
                borderColor: a.priority === 'red' ? '#EF4444' : a.priority === 'amber' ? '#F59E0B' : '#10B981'
              }}>
                <p className="text-sm font-medium text-foreground">{a.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-muted-foreground">{a.date}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{a.audience}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Last updated */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pb-4">
        <RefreshCw className="w-3 h-3" />
        Last updated: Just now
      </div>
    </div>
  );
}
