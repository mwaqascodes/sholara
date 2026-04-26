import { useState } from 'react';
import { Download, TrendingUp, Users, CreditCard, UserCheck, BarChart2, PieChart as PieIcon, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useStudents, useTeachers } from '@/lib/store';
import { C, PageHeader, StatCard, Badge, Btn } from '@/lib/design-system';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6'];

export default function ReportsPage() {
  const students = useStudents();
  const teachers = useTeachers();
  const [tab, setTab] = useState<'overview'|'academic'|'financial'>('overview');

  const activeStudents = students.filter(s => s.status === 'active').length;
  const paidStudents = students.filter(s => s.feeStatus === 'Paid').length;
  const unpaidStudents = students.filter(s => s.feeStatus !== 'Paid').length;
  const activeTeachers = teachers.filter(t => t.status === 'active').length;
  const totalPayroll = teachers.reduce((a, t) => a + (t.salary || 0), 0);
  const feeCollection = paidStudents * 3000;

  // Class-wise enrollment
  const classData = ['Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8','Class 9','Class 10'].map(cls => ({
    name: cls.replace('Class ', 'Cls '),
    students: students.filter(s => s.class === cls).length,
    active: students.filter(s => s.class === cls && s.status === 'active').length,
  })).filter(d => d.students > 0);

  // Fee status distribution
  const feeData = [
    { name: 'Paid', value: paidStudents, color: '#10b981' },
    { name: 'Unpaid', value: unpaidStudents, color: '#ef4444' },
  ];

  // Monthly revenue (mock data)
  const monthlyRevenue = [
    { month: 'Oct', revenue: 285000, expenses: 165000 },
    { month: 'Nov', revenue: 310000, expenses: 175000 },
    { month: 'Dec', revenue: 290000, expenses: 170000 },
    { month: 'Jan', revenue: 320000, expenses: 180000 },
    { month: 'Feb', revenue: 335000, expenses: 185000 },
    { month: 'Mar', revenue: 350000, expenses: 190000 },
    { month: 'Apr', revenue: feeCollection, expenses: totalPayroll },
  ];

  // Attendance trend (mock)
  const attendanceData = ['Mon','Tue','Wed','Thu','Fri'].map((day, i) => ({
    day,
    attendance: 85 + Math.floor(Math.random() * 10),
  }));

  // Subject-wise teacher count
  const subjectTeachers = teachers.reduce((acc, t) => {
    acc[t.subject] = (acc[t.subject] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const teacherSubjectData = Object.entries(subjectTeachers).slice(0, 6).map(([name, count]) => ({ name: name.split(' ')[0], count }));

  const exportReport = () => {
    const report = `Scholara — Monthly Report\nDate: ${new Date().toLocaleDateString()}\n\n=== STUDENT SUMMARY ===\nTotal Students: ${students.length}\nActive: ${activeStudents}\nPaid Fees: ${paidStudents}\nUnpaid Fees: ${unpaidStudents}\n\n=== TEACHER SUMMARY ===\nTotal Teachers: ${teachers.length}\nActive: ${activeTeachers}\nMonthly Payroll: PKR ${totalPayroll.toLocaleString()}\n\n=== FINANCIAL ===\nFee Collection: PKR ${feeCollection.toLocaleString()}\nNet Revenue: PKR ${(feeCollection - totalPayroll).toLocaleString()}\n`;
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'school-report.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report exported!');
  };

  const TABS = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    { id: 'academic', label: 'Academic', icon: UserCheck },
    { id: 'financial', label: 'Financial', icon: CreditCard },
  ] as const;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader title="Admin Reports" sub="Comprehensive institutional analytics and insights">
        <Btn icon={Download} variant="secondary" onClick={exportReport}>Export Report</Btn>
        <Btn icon={FileText} onClick={() => toast.success('PDF report generating...')}>PDF Report</Btn>
      </PageHeader>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <StatCard label="Total Students" value={students.length}                  icon={Users}     color="#3b82f6" trend={{ type: 'up', val: '+12 this month' }} />
        <StatCard label="Active Teachers" value={activeTeachers}                   icon={UserCheck} color="#8b5cf6" />
        <StatCard label="Fee Collected"   value={`₨ ${(feeCollection/1000).toFixed(0)}k`} icon={CreditCard} color="#10b981" trend={{ type: 'up', val: '+8%' }} />
        <StatCard label="Net Revenue"     value={`₨ ${((feeCollection-totalPayroll)/1000).toFixed(0)}k`} icon={TrendingUp} color="#f59e0b" />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, borderBottom: `1px solid ${C.border}` }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px',
            border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700,
            background: 'transparent', borderBottom: tab === t.id ? '2px solid #f59e0b' : '2px solid transparent',
            color: tab === t.id ? '#d97706' : C.sub, marginBottom: -1, transition: 'all 0.2s',
          }}>
            <t.icon size={14} />{t.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Revenue Chart */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 24 }}>
            <p style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 800, color: C.txt }}>Monthly Revenue vs Expenses (Last 7 months)</p>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `₨${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => `₨ ${v.toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} name="Revenue" />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="5 5" name="Expenses" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Class Enrollment */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 24 }}>
              <p style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 800, color: C.txt }}>Class-wise Enrollment</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={classData} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <Tooltip />
                  <Bar dataKey="students" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Students" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Fee Status */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 24 }}>
              <p style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 800, color: C.txt }}>Fee Collection Status</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie data={feeData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                      {feeData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => `${v} students`} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {feeData.map(d => (
                    <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: C.sub }}>{d.name}</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: C.txt, marginLeft: 'auto' }}>{d.value}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 8 }}>
                    <p style={{ margin: 0, fontSize: 11, color: C.muted }}>Collection Rate</p>
                    <p style={{ margin: '2px 0 0', fontSize: 18, fontWeight: 900, color: '#10b981' }}>
                      {students.length > 0 ? Math.round((paidStudents / students.length) * 100) : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Academic Tab */}
      {tab === 'academic' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 24 }}>
              <p style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 800, color: C.txt }}>Weekly Attendance Trend</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <YAxis domain={[70, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `${v}%`} />
                  <Tooltip formatter={(v: number) => `${v}%`} />
                  <Bar dataKey="attendance" fill="#10b981" radius={[4, 4, 0, 0]} name="Attendance %" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 24 }}>
              <p style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 800, color: C.txt }}>Teachers by Subject</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={teacherSubjectData} layout="vertical" barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#94a3b8' }} width={60} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Teachers" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Student Gender Distribution */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 24 }}>
            <p style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 800, color: C.txt }}>Student Gender Distribution</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
              {[
                { label: 'Male Students', value: students.filter(s => s.gender === 'Male').length, color: '#3b82f6' },
                { label: 'Female Students', value: students.filter(s => s.gender === 'Female').length, color: '#ec4899' },
                { label: 'Active Students', value: activeStudents, color: '#10b981' },
                { label: 'Withdrawn', value: students.filter(s => s.status !== 'active').length, color: '#ef4444' },
              ].map(d => (
                <div key={d.label} style={{ padding: 16, background: `${d.color}08`, border: `1px solid ${d.color}30`, borderRadius: 12 }}>
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 800, color: C.muted, textTransform: 'uppercase' }}>{d.label}</p>
                  <p style={{ margin: '6px 0 0', fontSize: 28, fontWeight: 900, color: d.color }}>{d.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Financial Tab */}
      {tab === 'financial' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {[
              { label: 'Gross Revenue', value: `₨ ${(feeCollection/1000).toFixed(0)}k`, color: '#10b981', sub: 'From fee collection' },
              { label: 'Total Payroll', value: `₨ ${(totalPayroll/1000).toFixed(0)}k`, color: '#ef4444', sub: 'Teacher salaries' },
              { label: 'Net Profit', value: `₨ ${((feeCollection-totalPayroll)/1000).toFixed(0)}k`, color: '#3b82f6', sub: 'After expenses' },
              { label: 'Pending Fees', value: `₨ ${(unpaidStudents*3000/1000).toFixed(0)}k`, color: '#f59e0b', sub: `${unpaidStudents} students` },
            ].map(d => (
              <div key={d.label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 20, borderTop: `3px solid ${d.color}` }}>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 800, color: C.muted, textTransform: 'uppercase' }}>{d.label}</p>
                <p style={{ margin: '8px 0 4px', fontSize: 26, fontWeight: 900, color: d.color }}>{d.value}</p>
                <p style={{ margin: 0, fontSize: 11, color: C.sub }}>{d.sub}</p>
              </div>
            ))}
          </div>

          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 24 }}>
            <p style={{ margin: '0 0 20px', fontSize: 14, fontWeight: 800, color: C.txt }}>Revenue & Expense Breakdown</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `₨${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => `₨ ${v.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="Revenue" />
                <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
