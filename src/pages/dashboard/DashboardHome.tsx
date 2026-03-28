import { motion } from 'framer-motion';
import { Users, GraduationCap, DollarSign, TrendingUp, Calendar, BookOpen, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { students, teachers, feeRecords, attendanceChartData, performanceChartData, notifications } from '@/lib/demo-data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08 } }),
};

export default function DashboardHome() {
  const { user } = useAuth();

  const totalFees = feeRecords.reduce((s, f) => s + f.amount, 0);
  const collectedFees = feeRecords.reduce((s, f) => s + f.paid, 0);

  const stats = [
    { label: 'Total Students', value: '1,247', icon: Users, trend: '+12%', color: 'from-primary to-secondary' },
    { label: 'Total Teachers', value: '68', icon: GraduationCap, trend: '+3', color: 'from-secondary to-accent' },
    { label: 'Attendance Today', value: '94.2%', icon: Calendar, trend: '+1.5%', color: 'from-accent to-primary' },
    { label: 'Fee Collection', value: `$${(collectedFees / 1000).toFixed(1)}K`, icon: DollarSign, trend: `${Math.round(collectedFees / totalFees * 100)}%`, color: 'from-success to-accent' },
  ];

  const studentStats = [
    { label: 'My Attendance', value: '94%', icon: Calendar, trend: '+2%', color: 'from-primary to-secondary' },
    { label: 'Current GPA', value: '3.8', icon: TrendingUp, trend: '+0.1', color: 'from-secondary to-accent' },
    { label: 'Subjects', value: '6', icon: BookOpen, trend: 'On track', color: 'from-accent to-primary' },
    { label: 'Pending Fees', value: '$0', icon: DollarSign, trend: 'Clear', color: 'from-success to-accent' },
  ];

  const displayStats = user?.role === 'student' || user?.role === 'parent' ? studentStats : stats;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-display text-2xl font-bold">
          Welcome back, <span className="gradient-text">{user?.name}</span>
        </h2>
        <p className="text-muted-foreground text-sm mt-1">Here's what's happening today.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayStats.map((s, i) => (
          <motion.div key={s.label} variants={fadeUp} custom={i} initial="hidden" animate="visible" className="stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className={`text-3xl font-bold font-display mt-1 bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>
                  {s.value}
                </p>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center opacity-80`}>
                <s.icon className="w-5 h-5 text-primary-foreground" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-success font-medium">
              <TrendingUp className="w-3 h-3" />
              {s.trend} from last month
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div variants={fadeUp} custom={4} initial="hidden" animate="visible" className="glass-card">
          <h3 className="font-display font-semibold mb-4">Attendance Trends</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={attendanceChartData}>
              <defs>
                <linearGradient id="attendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis domain={[80, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="attendance" stroke="hsl(221, 83%, 53%)" fill="url(#attendGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={fadeUp} custom={5} initial="hidden" animate="visible" className="glass-card">
          <h3 className="font-display font-semibold mb-4">Subject Performance</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={performanceChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="avg" fill="hsl(270, 60%, 55%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent + Notifications */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div variants={fadeUp} custom={6} initial="hidden" animate="visible" className="glass-card">
          <h3 className="font-display font-semibold mb-4">Recent Students</h3>
          <div className="space-y-3">
            {students.slice(0, 5).map(s => (
              <div key={s.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{s.avatar}</span>
                  <div>
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.class}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${s.attendance >= 90 ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                  {s.attendance}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} custom={7} initial="hidden" animate="visible" className="glass-card">
          <h3 className="font-display font-semibold mb-4">Notifications</h3>
          <div className="space-y-3">
            {notifications.map(n => (
              <div key={n.id} className={`flex items-start gap-3 p-3 rounded-lg ${n.read ? '' : 'bg-primary/5'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  n.type === 'warning' ? 'bg-warning/10 text-warning' :
                  n.type === 'success' ? 'bg-success/10 text-success' :
                  'bg-info/10 text-info'
                }`}>
                  {n.type === 'warning' ? <AlertTriangle className="w-4 h-4" /> :
                   n.type === 'success' ? <CheckCircle className="w-4 h-4" /> :
                   <Calendar className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
