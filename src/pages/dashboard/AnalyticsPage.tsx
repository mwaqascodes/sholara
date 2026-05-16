import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { feeChartData, attendanceChartData, performanceChartData, students, feeRecords } from '@/lib/demo-data';
import { Download, TrendingUp, TrendingDown } from 'lucide-react';

const enrollmentData = [
  { month: 'Jul', count: 780 }, { month: 'Aug', count: 810 }, { month: 'Sep', count: 825 },
  { month: 'Oct', count: 830 }, { month: 'Nov', count: 838 }, { month: 'Dec', count: 840 },
  { month: 'Jan', count: 842 }, { month: 'Feb', count: 845 }, { month: 'Mar', count: 847 },
];

const classPerformance = [
  { class: 'Class 5', avg: 72 }, { class: 'Class 6', avg: 75 }, { class: 'Class 7', avg: 68 },
  { class: 'Class 8', avg: 69 }, { class: 'Class 9', avg: 77 }, { class: 'Class 10', avg: 84 },
];

const tooltipStyle = { background: 'rgba(15,20,35,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#f1f5f9' };

export default function AnalyticsPage() {
  const totalCollected = feeRecords.reduce((s, f) => s + f.paid, 0);
  const totalExpected = feeRecords.reduce((s, f) => s + f.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold" style={{ color: '#f1f5f9' }}>Analytics & Reports</h2>
        <button className="glass-btn-secondary flex items-center gap-2 text-sm">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Enrollment Growth', value: '+8.6%', trend: 'up', color: '#22c55e' },
          { label: 'Fee Collection Rate', value: `${Math.round((totalCollected / totalExpected) * 100)}%`, trend: totalCollected / totalExpected > 0.8 ? 'up' : 'down', color: '#f59e0b' },
          { label: 'Avg Attendance', value: '89.7%', trend: 'up', color: '#3b82f6' },
          { label: 'Pass Rate', value: '92%', trend: 'up', color: '#8b5cf6' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card">
            <p className="text-xs" style={{ color: 'rgba(241,245,249,0.5)' }}>{s.label}</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-2xl font-bold font-display" style={{ color: s.color }}>{s.value}</p>
              {s.trend === 'up' ? <TrendingUp className="w-4 h-4" style={{ color: '#22c55e' }} /> : <TrendingDown className="w-4 h-4" style={{ color: '#ef4444' }} />}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card">
          <h3 className="font-display font-semibold mb-4" style={{ color: '#f1f5f9' }}>Enrollment Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'rgba(241,245,249,0.5)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'rgba(241,245,249,0.5)' }} domain={['dataMin - 20', 'dataMax + 10']} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="count" stroke="#22c55e" fill="rgba(34,197,94,0.15)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card">
          <h3 className="font-display font-semibold mb-4" style={{ color: '#f1f5f9' }}>Revenue: Collected vs Expected</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={feeChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'rgba(241,245,249,0.5)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'rgba(241,245,249,0.5)' }} tickFormatter={v => `${v / 1000}K`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `PKR ${v.toLocaleString()}`} />
              <Bar dataKey="collected" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expected" fill="rgba(255,255,255,0.08)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card">
          <h3 className="font-display font-semibold mb-4" style={{ color: '#f1f5f9' }}>Class Comparison</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={classPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis type="number" tick={{ fontSize: 12, fill: 'rgba(241,245,249,0.5)' }} domain={[0, 100]} />
              <YAxis dataKey="class" type="category" tick={{ fontSize: 12, fill: 'rgba(241,245,249,0.5)' }} width={70} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="avg" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card">
          <h3 className="font-display font-semibold mb-4" style={{ color: '#f1f5f9' }}>Subject Performance</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={performanceChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="subject" tick={{ fontSize: 11, fill: 'rgba(241,245,249,0.5)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'rgba(241,245,249,0.5)' }} domain={[0, 100]} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="avg" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
