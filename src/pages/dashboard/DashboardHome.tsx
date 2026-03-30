import { motion } from 'framer-motion';
import { Users, GraduationCap, DollarSign, TrendingUp, Calendar, BookOpen, AlertTriangle, CheckCircle, Plus, ClipboardList, BarChart3, Bell, Target, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useI18n } from '@/lib/i18n-context';
import { students, teachers, feeRecords, feeChartData, notifications, attendanceChartData } from '@/lib/demo-data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { useNavigate } from 'react-router-dom';
import AnimatedCounter from '@/components/AnimatedCounter';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08 } }),
};

const COLORS = ['#22c55e', '#ef4444', '#f59e0b'];

export default function DashboardHome() {
  const { user } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  const totalFees = feeRecords.reduce((s, f) => s + f.amount, 0);
  const collectedFees = feeRecords.reduce((s, f) => s + f.paid, 0);
  const pendingFees = totalFees - collectedFees;
  const defaultersCount = feeRecords.filter(f => f.status !== 'paid').length;

  const attendancePie = [
    { name: 'Present', value: 87 },
    { name: 'Absent', value: 8 },
    { name: 'Leave', value: 5 },
  ];

  const recentActivity = [
    { text: 'Fatima Noor marked attendance for Class 10', time: '10 min ago', color: '#22c55e' },
    { text: 'Fee collected from Ali Hassan - PKR 5,000', time: '30 min ago', color: '#f59e0b' },
    { text: 'Mid-Term results published for Class 10', time: '2 hours ago', color: '#3b82f6' },
    { text: 'New student Bilal Ahmed enrolled in Class 7', time: '5 hours ago', color: '#22c55e' },
    { text: 'Hamza Sheikh marked absent', time: '6 hours ago', color: '#ef4444' },
  ];

  const aiInsights = [
    { text: '3 students absent 3 days straight — Class 5A', icon: AlertTriangle, color: '#ef4444' },
    { text: 'Fee collection 15% below last month', icon: DollarSign, color: '#f59e0b' },
    { text: 'Annual exam in 12 days — 8 students at risk', icon: Target, color: '#3b82f6' },
  ];

  const healthScore = Math.round((87 + (collectedFees / totalFees) * 100 + 92) / 3);

  // Student dashboard
  if (user?.role === 'student') {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="font-display text-2xl font-bold" style={{ color: '#f1f5f9' }}>{t('dash.welcome')}, <span style={{ color: '#22c55e' }}>{user.name}</span></h2>
          <p className="text-sm mt-1" style={{ color: 'rgba(241,245,249,0.5)' }}>Student Dashboard</p>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'My Attendance', value: '94%', icon: Calendar },
            { label: 'Current GPA', value: '3.8', icon: TrendingUp },
            { label: 'Subjects', value: '7', icon: BookOpen },
            { label: 'Fee Status', value: 'Paid ✓', icon: DollarSign },
          ].map((s, i) => (
            <motion.div key={s.label} variants={fadeUp} custom={i} initial="hidden" animate="visible" className="glass-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm" style={{ color: 'rgba(241,245,249,0.5)' }}>{s.label}</p>
                  <p className="text-2xl font-bold font-display mt-1" style={{ color: '#22c55e' }}>{s.value}</p>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(22,163,74,0.15)' }}>
                  <s.icon className="w-5 h-5" style={{ color: '#22c55e' }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card">
            <h3 className="font-display font-semibold mb-4" style={{ color: '#f1f5f9' }}>Latest Results</h3>
            <div className="text-center py-6">
              <p className="text-4xl font-bold font-display" style={{ color: '#22c55e' }}>84%</p>
              <p className="text-sm mt-1" style={{ color: 'rgba(241,245,249,0.5)' }}>Mid-Term 2026 · Grade A</p>
            </div>
          </div>
          <div className="glass-card">
            <h3 className="font-display font-semibold mb-4" style={{ color: '#f1f5f9' }}>Announcements</h3>
            <div className="space-y-3">
              {notifications.slice(0, 3).map(n => (
                <div key={n.id} className="flex items-start gap-3 p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <Bell className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#22c55e' }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#f1f5f9' }}>{n.title}</p>
                    <p className="text-xs" style={{ color: 'rgba(241,245,249,0.4)' }}>{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Teacher dashboard
  if (user?.role === 'teacher') {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="font-display text-2xl font-bold" style={{ color: '#f1f5f9' }}>{t('dash.welcome')}, <span style={{ color: '#22c55e' }}>{user.name}</span></h2>
          <p className="text-sm mt-1" style={{ color: 'rgba(241,245,249,0.5)' }}>Teacher Dashboard</p>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'My Classes', value: 2, icon: BookOpen },
            { label: 'Total Students', value: 61, icon: Users },
            { label: 'Attendance Today', value: 90, icon: Calendar, suffix: '%' },
            { label: 'Results Pending', value: 1, icon: BarChart3 },
          ].map((s, i) => (
            <motion.div key={s.label} variants={fadeUp} custom={i} initial="hidden" animate="visible" className="glass-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm" style={{ color: 'rgba(241,245,249,0.5)' }}>{s.label}</p>
                  <p className="text-2xl font-bold font-display mt-1" style={{ color: '#22c55e' }}>
                    <AnimatedCounter end={s.value} suffix={s.suffix || ''} />
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(22,163,74,0.15)' }}>
                  <s.icon className="w-5 h-5" style={{ color: '#22c55e' }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <button onClick={() => navigate('/dashboard/attendance')} className="glass-card-hover flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(22,163,74,0.15)' }}><ClipboardList className="w-5 h-5" style={{ color: '#22c55e' }} /></div>
            <span className="font-medium text-sm" style={{ color: '#f1f5f9' }}>{t('dash.markAttendance')}</span>
          </button>
          <button onClick={() => navigate('/dashboard/results')} className="glass-card-hover flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(22,163,74,0.15)' }}><BarChart3 className="w-5 h-5" style={{ color: '#22c55e' }} /></div>
            <span className="font-medium text-sm" style={{ color: '#f1f5f9' }}>{t('dash.enterResults')}</span>
          </button>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ borderLeft: '4px solid #16a34a' }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold" style={{ color: '#f1f5f9' }}>
              Good morning, {user?.name}! 👋
            </h2>
            <p className="text-sm mt-1" style={{ color: 'rgba(241,245,249,0.5)' }}>
              Today is {new Date().toLocaleDateString('en', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}. Here's your school overview.
            </p>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: t('dash.totalStudents'), value: 847, icon: Users, trend: '+12', color: '#22c55e', suffix: '' },
          { label: t('dash.totalTeachers'), value: 42, icon: GraduationCap, trend: '+3', color: '#3b82f6', suffix: '' },
          { label: t('dash.feesCollected'), value: 420, icon: DollarSign, trend: '82%', color: '#f59e0b', prefix: '₨ ', suffix: 'K' },
          { label: t('dash.attendanceToday'), value: 91.2, icon: Calendar, trend: '+1.5%', color: '#8b5cf6', suffix: '%', decimals: 1 },
          { label: 'Fee Defaulters', value: defaultersCount, icon: AlertTriangle, trend: 'overdue', color: '#ef4444', suffix: '' },
          { label: 'Upcoming Exams', value: 2, icon: BookOpen, trend: 'this week', color: '#06b6d4', suffix: '' },
        ].map((s, i) => (
          <motion.div key={s.label} variants={fadeUp} custom={i} initial="hidden" animate="visible" className="glass-card relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1" style={{ background: `linear-gradient(90deg, ${s.color}, ${s.color}88)` }} />
            <div className="flex items-start justify-between mb-2">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${s.color}22` }}>
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
            </div>
            <p className="text-2xl font-bold font-display" style={{ color: '#f1f5f9' }}>
              <AnimatedCounter end={s.value} prefix={s.prefix || ''} suffix={s.suffix} decimals={(s as any).decimals || 0} />
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(241,245,249,0.45)' }}>{s.label}</p>
            <div className="mt-2 flex items-center gap-1 text-xs font-medium" style={{ color: s.color === '#ef4444' ? '#ef4444' : '#22c55e' }}>
              <TrendingUp className="w-3 h-3" /> {s.trend}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div variants={fadeUp} custom={6} initial="hidden" animate="visible" className="glass-card">
          <h3 className="font-display font-semibold mb-4" style={{ color: '#f1f5f9' }}>{t('dash.monthlyFees')}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={feeChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'rgba(241,245,249,0.5)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'rgba(241,245,249,0.5)' }} tickFormatter={(v) => `${(v / 1000)}K`} />
              <Tooltip contentStyle={{ background: 'rgba(15,20,35,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#f1f5f9' }} formatter={(v: number) => `PKR ${v.toLocaleString()}`} />
              <Bar dataKey="collected" fill="#22c55e" radius={[4, 4, 0, 0]} name="Collected" />
              <Bar dataKey="expected" fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} name="Expected" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={fadeUp} custom={7} initial="hidden" animate="visible" className="glass-card">
          <h3 className="font-display font-semibold mb-4" style={{ color: '#f1f5f9' }}>Attendance Trend (30 Days)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={attendanceChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'rgba(241,245,249,0.5)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'rgba(241,245,249,0.5)' }} domain={[70, 100]} />
              <Tooltip contentStyle={{ background: 'rgba(15,20,35,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#f1f5f9' }} />
              <Area type="monotone" dataKey="attendance" stroke="#22c55e" fill="rgba(34,197,94,0.15)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div variants={fadeUp} custom={8} initial="hidden" animate="visible" className="glass-card">
          <h3 className="font-display font-semibold mb-4" style={{ color: '#f1f5f9' }}>{t('dash.quickActions')}</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: t('dash.addStudent'), icon: Plus, path: '/dashboard/students' },
              { label: t('dash.markAttendance'), icon: ClipboardList, path: '/dashboard/attendance' },
              { label: t('dash.enterResults'), icon: BarChart3, path: '/dashboard/results' },
              { label: t('dash.collectFee'), icon: DollarSign, path: '/dashboard/fees' },
              { label: 'Result Card', icon: BookOpen, path: '/dashboard/result-card' },
            ].map(a => (
              <button key={a.label} onClick={() => navigate(a.path)} className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all hover:translate-y-[-4px]" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(22,163,74,0.15)' }}>
                  <a.icon className="w-5 h-5" style={{ color: '#22c55e' }} />
                </div>
                <span className="text-xs font-medium" style={{ color: 'rgba(241,245,249,0.7)' }}>{a.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div variants={fadeUp} custom={9} initial="hidden" animate="visible" className="glass-card">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4" style={{ color: '#22c55e' }} />
            <h3 className="font-display font-semibold" style={{ color: '#f1f5f9' }}>AI Insights Today</h3>
          </div>
          <div className="space-y-3">
            {aiInsights.map((insight, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${insight.color}22` }}>
                  <insight.icon className="w-4 h-4" style={{ color: insight.color }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs" style={{ color: 'rgba(241,245,249,0.75)' }}>{insight.text}</p>
                  <button className="text-[10px] font-semibold mt-1" style={{ color: '#22c55e' }}>Take Action →</button>
                </div>
              </div>
            ))}
          </div>
          {/* Health Score */}
          <div className="mt-4 p-3 rounded-xl text-center" style={{ background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.2)' }}>
            <p className="text-3xl font-bold font-display" style={{ color: '#22c55e' }}><AnimatedCounter end={healthScore} /></p>
            <p className="text-[10px] mt-0.5" style={{ color: 'rgba(241,245,249,0.5)' }}>School Health Score</p>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={fadeUp} custom={10} initial="hidden" animate="visible" className="glass-card">
          <h3 className="font-display font-semibold mb-4" style={{ color: '#f1f5f9' }}>{t('dash.recentActivity')}</h3>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-2">
                <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: a.color }} />
                <div>
                  <p className="text-xs" style={{ color: 'rgba(241,245,249,0.75)' }}>{a.text}</p>
                  <p className="text-[10px]" style={{ color: 'rgba(241,245,249,0.35)' }}>{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
