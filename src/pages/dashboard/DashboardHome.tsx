import { motion } from 'framer-motion';
import { Users, GraduationCap, DollarSign, TrendingUp, Calendar, BookOpen, AlertTriangle, CheckCircle, Plus, ClipboardList, BarChart3 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useI18n } from '@/lib/i18n-context';
import { students, teachers, feeRecords, feeChartData, notifications, attendanceChartData } from '@/lib/demo-data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08 } }),
};

const COLORS = ['hsl(142, 72%, 29%)', 'hsl(0, 84%, 60%)', 'hsl(38, 92%, 50%)'];

export default function DashboardHome() {
  const { user } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  const totalFees = feeRecords.reduce((s, f) => s + f.amount, 0);
  const collectedFees = feeRecords.reduce((s, f) => s + f.paid, 0);

  const attendancePie = [
    { name: 'Present', value: 87 },
    { name: 'Absent', value: 8 },
    { name: 'Leave', value: 5 },
  ];

  const recentActivity = [
    { text: 'Fatima Noor marked attendance for Class 10', time: '10 min ago' },
    { text: 'Fee collected from Ali Hassan - PKR 5,000', time: '30 min ago' },
    { text: 'Mid-Term results published for Class 10', time: '2 hours ago' },
    { text: 'New student Bilal Ahmed enrolled in Class 7', time: '5 hours ago' },
    { text: 'Leave approved for Umar Farooq (3 days)', time: '1 day ago' },
  ];

  // Student dashboard
  if (user?.role === 'student') {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="font-display text-2xl font-bold">{t('dash.welcome')}, <span className="text-primary">{user.name}</span></h2>
          <p className="text-muted-foreground text-sm mt-1">Student Dashboard</p>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'My Attendance', value: '94%', icon: Calendar },
            { label: 'Current GPA', value: '3.8', icon: TrendingUp },
            { label: 'Subjects', value: '7', icon: BookOpen },
            { label: 'Fee Status', value: 'Paid ✓', icon: DollarSign },
          ].map((s, i) => (
            <motion.div key={s.label} variants={fadeUp} custom={i} initial="hidden" animate="visible" className="stat-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold font-display text-primary mt-1">{s.value}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card-white">
            <h3 className="font-display font-semibold mb-4">Latest Results</h3>
            <div className="text-center py-6">
              <p className="text-4xl font-bold font-display text-primary">84%</p>
              <p className="text-sm text-muted-foreground mt-1">Mid-Term 2026 · Grade A</p>
            </div>
          </div>
          <div className="card-white">
            <h3 className="font-display font-semibold mb-4">Announcements</h3>
            <div className="space-y-3">
              {notifications.slice(0, 3).map(n => (
                <div key={n.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
                  <Bell className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{n.time}</p>
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
          <h2 className="font-display text-2xl font-bold">{t('dash.welcome')}, <span className="text-primary">{user.name}</span></h2>
          <p className="text-muted-foreground text-sm mt-1">Teacher Dashboard</p>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'My Classes', value: '2', icon: BookOpen },
            { label: 'Total Students', value: '61', icon: Users },
            { label: 'Attendance Today', value: '90%', icon: Calendar },
            { label: 'Results Pending', value: '1', icon: BarChart3 },
          ].map((s, i) => (
            <motion.div key={s.label} variants={fadeUp} custom={i} initial="hidden" animate="visible" className="stat-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold font-display text-primary mt-1">{s.value}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button onClick={() => navigate('/dashboard/attendance')} className="card-white-hover flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><ClipboardList className="w-5 h-5 text-primary" /></div>
            <span className="font-medium text-sm">{t('dash.markAttendance')}</span>
          </button>
          <button onClick={() => navigate('/dashboard/results')} className="card-white-hover flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><BarChart3 className="w-5 h-5 text-primary" /></div>
            <span className="font-medium text-sm">{t('dash.enterResults')}</span>
          </button>
        </div>
        <div className="card-white">
          <h3 className="font-display font-semibold mb-4">Announcements</h3>
          <div className="space-y-3">
            {notifications.map(n => (
              <div key={n.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
                <Bell className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-display text-2xl font-bold">
          {t('dash.welcome')}, <span className="text-primary">{user?.name}</span>
        </h2>
        <p className="text-muted-foreground text-sm mt-1">Al-Noor Academy Lahore — Admin Dashboard</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t('dash.totalStudents'), value: '450', icon: Users, trend: '+12' },
          { label: t('dash.totalTeachers'), value: '28', icon: GraduationCap, trend: '+3' },
          { label: t('dash.feesCollected'), value: `PKR ${(collectedFees).toLocaleString()}`, icon: DollarSign, trend: `${Math.round(collectedFees / totalFees * 100)}%` },
          { label: t('dash.attendanceToday'), value: '87%', icon: Calendar, trend: '+1.5%' },
        ].map((s, i) => (
          <motion.div key={s.label} variants={fadeUp} custom={i} initial="hidden" animate="visible" className="stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold font-display text-primary mt-1">{s.value}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3" /> {s.trend} from last month
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div variants={fadeUp} custom={4} initial="hidden" animate="visible" className="card-white">
          <h3 className="font-display font-semibold mb-4">{t('dash.monthlyFees')}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={feeChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v/1000)}K`} />
              <Tooltip formatter={(v: number) => `PKR ${v.toLocaleString()}`} />
              <Bar dataKey="collected" fill="hsl(142, 72%, 29%)" radius={[4, 4, 0, 0]} name="Collected" />
              <Bar dataKey="expected" fill="hsl(220, 13%, 90%)" radius={[4, 4, 0, 0]} name="Expected" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={fadeUp} custom={5} initial="hidden" animate="visible" className="card-white">
          <h3 className="font-display font-semibold mb-4">{t('dash.attendanceBreakdown')}</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={attendancePie} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
                  {attendancePie.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions + Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div variants={fadeUp} custom={6} initial="hidden" animate="visible" className="card-white">
          <h3 className="font-display font-semibold mb-4">{t('dash.quickActions')}</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: t('dash.addStudent'), icon: Plus, path: '/dashboard/students' },
              { label: t('dash.markAttendance'), icon: ClipboardList, path: '/dashboard/attendance' },
              { label: t('dash.enterResults'), icon: BarChart3, path: '/dashboard/results' },
              { label: t('dash.collectFee'), icon: DollarSign, path: '/dashboard/fees' },
            ].map(a => (
              <button key={a.label} onClick={() => navigate(a.path)} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <a.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium">{a.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} custom={7} initial="hidden" animate="visible" className="card-white">
          <h3 className="font-display font-semibold mb-4">{t('dash.recentActivity')}</h3>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-2">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <div>
                  <p className="text-sm">{a.text}</p>
                  <p className="text-xs text-muted-foreground">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Bell icon import helper
import { Bell } from 'lucide-react';
