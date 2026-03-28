import { schools } from '@/lib/demo-data';
import { useAuth } from '@/lib/auth-context';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, GraduationCap, CheckCircle, XCircle, Clock, BarChart3, Settings, Plus, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08 } }),
};

export default function SuperAdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== 'superadmin') {
    navigate('/login');
    return null;
  }

  const totalStudents = schools.reduce((s, sc) => s + sc.students, 0);
  const totalTeachers = schools.reduce((s, sc) => s + sc.teachers, 0);
  const activeSchools = schools.filter(s => s.status === 'active').length;

  const statusConfig = {
    active: { icon: CheckCircle, cls: 'bg-success/10 text-success' },
    trial: { icon: Clock, cls: 'bg-warning/10 text-warning' },
    suspended: { icon: XCircle, cls: 'bg-destructive/10 text-destructive' },
  };

  const planColors = {
    basic: 'bg-muted text-muted-foreground',
    pro: 'bg-primary/10 text-primary',
    enterprise: 'bg-secondary/10 text-secondary',
  };

  return (
    <div className="min-h-screen bg-background gradient-mesh p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">
              🛡️ <span className="gradient-text">Super Admin Panel</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Manage all schools on the EduFlow platform</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity">
              <Plus className="w-4 h-4" /> Register School
            </button>
            <button onClick={() => { logout(); navigate('/'); }} className="px-4 py-2 rounded-lg glass border border-border text-sm font-medium hover:bg-muted transition-colors">
              Logout
            </button>
          </div>
        </div>

        {/* Platform stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Schools', value: schools.length, icon: Building2, color: 'from-primary to-secondary' },
            { label: 'Active Schools', value: activeSchools, icon: CheckCircle, color: 'from-success to-accent' },
            { label: 'Total Students', value: totalStudents.toLocaleString(), icon: Users, color: 'from-secondary to-accent' },
            { label: 'Total Teachers', value: totalTeachers, icon: GraduationCap, color: 'from-accent to-primary' },
          ].map((s, i) => (
            <motion.div key={s.label} variants={fadeUp} custom={i} initial="hidden" animate="visible" className="stat-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className={`text-3xl font-bold font-display bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>{s.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center opacity-80`}>
                  <s.icon className="w-5 h-5 text-primary-foreground" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs text-success font-medium">
                <TrendingUp className="w-3 h-3" /> Growing
              </div>
            </motion.div>
          ))}
        </div>

        {/* Schools table */}
        <div className="glass-card">
          <h3 className="font-display font-semibold text-lg mb-4">Registered Schools</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">School</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">Code</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">Students</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">Teachers</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">Plan</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">Status</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">Since</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2"></th>
                </tr>
              </thead>
              <tbody>
                {schools.map((s, i) => {
                  const cfg = statusConfig[s.status];
                  return (
                    <motion.tr
                      key={s.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-3 px-2">
                        <div>
                          <p className="text-sm font-medium">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.address}</p>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-sm font-mono">{s.code}</td>
                      <td className="py-3 px-2 text-sm">{s.students.toLocaleString()}</td>
                      <td className="py-3 px-2 text-sm">{s.teachers}</td>
                      <td className="py-3 px-2">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${planColors[s.plan]}`}>{s.plan}</span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize flex items-center gap-1 w-fit ${cfg.cls}`}>
                          <cfg.icon className="w-3 h-3" /> {s.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-sm text-muted-foreground">{s.createdAt}</td>
                      <td className="py-3 px-2">
                        <button className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Manage">
                          <Settings className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
