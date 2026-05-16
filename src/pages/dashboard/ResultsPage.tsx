import { useState } from 'react';
import { examResults, gradeScale, students, getGrade, allClasses, allSubjects } from '@/lib/demo-data';
import type { ExamResult } from '@/lib/demo-data';
import { useAuth } from '@/lib/auth-context';
import { Search, Download, FileText, BarChart3, Award, Eye, CheckCircle, Clock, Edit3, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Tab = 'overview' | 'marks-entry' | 'report-cards' | 'analytics' | 'grading';

export default function ResultsPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('overview');
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null);

  const isTeacherOrAdmin = user?.role === 'admin' || user?.role === 'teacher';
  const isStudent = user?.role === 'student';

  const filtered = examResults.filter(r => {
    if (search && !r.studentName.toLowerCase().includes(search.toLowerCase()) && !String(r.rollNo).includes(search)) return false;
    if (classFilter !== 'all' && r.class !== classFilter) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (isStudent) return r.studentId === '1' || r.status === 'published';
    return true;
  });

  const classes = [...new Set(examResults.map(r => r.class))];

  const tabs: { id: Tab; label: string; icon: React.ElementType; roles: string[] }[] = [
    { id: 'overview', label: 'Results', icon: FileText, roles: ['admin', 'teacher', 'student'] },
    { id: 'marks-entry', label: 'Marks Entry', icon: Edit3, roles: ['admin', 'teacher'] },
    { id: 'report-cards', label: 'Report Cards', icon: Award, roles: ['admin', 'teacher', 'student'] },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, roles: ['admin', 'teacher'] },
    { id: 'grading', label: 'Grading Scale', icon: TrendingUp, roles: ['admin'] },
  ];

  const visibleTabs = tabs.filter(t => t.roles.includes(user?.role || ''));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold">Exam Results</h2>
          <p className="text-sm text-muted-foreground">Mid-Term 2026 Examination</p>
        </div>
        {isTeacherOrAdmin && (
          <div className="flex gap-2">
            <button className="btn-outline flex items-center gap-2"><Download className="w-4 h-4" /> Export</button>
            <button className="btn-primary flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Publish All</button>
          </div>
        )}
      </div>

      <div className="flex gap-1 flex-wrap card-white p-1.5">
        {visibleTabs.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setSelectedResult(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.id ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted text-muted-foreground'
            }`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {selectedResult && <ReportCardView result={selectedResult} onBack={() => setSelectedResult(null)} />}

      {!selectedResult && tab === 'overview' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" placeholder="Search by name or roll number..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" />
            </div>
            <select value={classFilter} onChange={e => setClassFilter(e.target.value)} className="input-field w-auto">
              <option value="all">All Classes</option>
              {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {isTeacherOrAdmin && (
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field w-auto">
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="approved">Approved</option>
                <option value="published">Published</option>
              </select>
            )}
          </div>

          <div className="card-white overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="table-header">Roll#</th>
                  <th className="table-header">Student</th>
                  <th className="table-header">Class</th>
                  <th className="table-header">Obtained</th>
                  <th className="table-header">%</th>
                  <th className="table-header">Grade</th>
                  <th className="table-header">GPA</th>
                  <th className="table-header">Rank</th>
                  {isTeacherOrAdmin && <th className="table-header">Status</th>}
                  <th className="table-header"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="table-cell font-mono">{r.rollNo}</td>
                    <td className="table-cell font-medium">{r.studentName}</td>
                    <td className="table-cell">{r.class}</td>
                    <td className="table-cell">{r.obtainedMarks}/{r.totalMarks}</td>
                    <td className="table-cell font-semibold">{r.percentage}%</td>
                    <td className="table-cell">
                      <span className={`badge ${r.grade.startsWith('A') ? 'bg-success/10 text-success' : r.grade === 'B' ? 'bg-info/10 text-info' : r.grade === 'F' ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'}`}>{r.grade}</span>
                    </td>
                    <td className="table-cell font-medium">{r.gpa.toFixed(1)}</td>
                    <td className="table-cell">
                      {r.rank <= 3 ? (
                        <span className="flex items-center gap-1"><Award className={`w-4 h-4 ${r.rank === 1 ? 'text-warning' : 'text-muted-foreground'}`} />#{r.rank}</span>
                      ) : <span>#{r.rank}</span>}
                    </td>
                    {isTeacherOrAdmin && (
                      <td className="table-cell">
                        <span className={`badge capitalize ${r.status === 'published' ? 'bg-success/10 text-success' : r.status === 'approved' ? 'bg-info/10 text-info' : 'bg-warning/10 text-warning'}`}>{r.status}</span>
                      </td>
                    )}
                    <td className="table-cell">
                      <button onClick={() => setSelectedResult(r)} className="p-1.5 rounded-lg hover:bg-muted" title="View Report Card"><Eye className="w-4 h-4 text-muted-foreground" /></button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!selectedResult && tab === 'marks-entry' && <MarksEntryTab />}

      {!selectedResult && tab === 'report-cards' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.filter(r => r.status === 'published' || isTeacherOrAdmin).map(r => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-white-hover cursor-pointer" onClick={() => setSelectedResult(r)}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">#{r.rollNo}</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">{r.studentName}</p>
                  <p className="text-xs text-muted-foreground">{r.class} · {r.examName}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-muted/50">
                  <p className="text-lg font-bold font-display text-primary">{r.percentage}%</p>
                  <p className="text-[10px] text-muted-foreground">Percentage</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/50">
                  <p className="text-lg font-bold font-display">{r.grade}</p>
                  <p className="text-[10px] text-muted-foreground">Grade</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/50">
                  <p className="text-lg font-bold font-display">#{r.rank}</p>
                  <p className="text-[10px] text-muted-foreground">Rank</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!selectedResult && tab === 'analytics' && <AnalyticsTab />}

      {!selectedResult && tab === 'grading' && (
        <div className="card-white max-w-2xl">
          <h3 className="font-display font-semibold mb-4">Grading Scale</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="table-header">Grade</th>
                <th className="table-header">Percentage</th>
                <th className="table-header">GPA</th>
                <th className="table-header">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {gradeScale.map(g => (
                <tr key={g.grade} className="border-b border-border/50">
                  <td className="table-cell">
                    <span className={`badge ${g.grade.startsWith('A') ? 'bg-success/10 text-success' : g.grade === 'B' ? 'bg-info/10 text-info' : g.grade === 'F' ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'}`}>{g.grade}</span>
                  </td>
                  <td className="table-cell">{g.minPercentage}% - {g.maxPercentage}%</td>
                  <td className="table-cell font-semibold">{g.gpa.toFixed(1)}</td>
                  <td className="table-cell text-muted-foreground">{g.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function MarksEntryTab() {
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const classStudents = students.filter(s => s.class === selectedClass);
  const [marks, setMarks] = useState<Record<string, number>>(
    Object.fromEntries(classStudents.map(s => [s.id, Math.floor(Math.random() * 30) + 65]))
  );
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="input-field w-auto">
          {allClasses.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="input-field w-auto">
          {allSubjects.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="input-field w-auto">
          <option>Monthly Test</option>
          <option>Mid-Term</option>
          <option>Annual</option>
        </select>
      </div>

      <div className="card-white">
        <h3 className="font-display font-semibold mb-4">Enter Marks — {selectedClass} · {selectedSubject}</h3>
        <div className="space-y-2">
          {classStudents.map(s => {
            const m = marks[s.id] || 0;
            const g = getGrade(m);
            return (
              <div key={s.id} className="flex items-center gap-4 py-2 px-3 rounded-lg hover:bg-muted/30 transition-colors">
                <span className="text-sm w-8 text-muted-foreground">#{s.rollNo}</span>
                <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{s.name}</p></div>
                <input type="number" min={0} max={100} value={m} onChange={e => { setMarks(p => ({ ...p, [s.id]: Number(e.target.value) })); setSaved(false); }}
                  className="w-20 px-2 py-1.5 rounded-lg border border-border text-sm text-center bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <span className="text-sm text-muted-foreground w-8">/100</span>
                <span className={`badge w-10 text-center ${g.grade.startsWith('A') ? 'bg-success/10 text-success' : g.grade === 'B' ? 'bg-info/10 text-info' : g.grade === 'F' ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'}`}>{g.grade}</span>
              </div>
            );
          })}
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={() => setSaved(true)} className="btn-outline"><Clock className="w-4 h-4 inline mr-1" /> Save Draft</button>
          <button onClick={() => setSaved(true)} className="btn-primary"><CheckCircle className="w-4 h-4 inline mr-1" /> Submit for Approval</button>
        </div>
        {saved && <p className="text-sm text-success mt-2 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Marks saved!</p>}
      </div>
    </div>
  );
}

function ReportCardView({ result, onBack }: { result: ExamResult; onBack: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <button onClick={onBack} className="text-sm text-primary hover:underline">← Back to results</button>

      <div className="card-white rounded-2xl p-6 lg:p-8 max-w-3xl mx-auto" id="report-card">
        <div className="text-center border-b-2 border-primary/20 pb-4 mb-6">
          <h2 className="font-display text-2xl font-bold text-primary">Al-Noor Academy Lahore</h2>
          <p className="text-sm text-muted-foreground">123 Main Road, Gulberg III, Lahore · Phone: 042-35781234</p>
          <div className="mt-3 inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
            {result.examName} — Report Card
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Student', value: result.studentName },
            { label: 'Class', value: result.class },
            { label: 'Roll No', value: `#${result.rollNo}` },
            { label: 'Attendance', value: `${result.attendance}%` },
          ].map(f => (
            <div key={f.label} className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">{f.label}</p>
              <p className="text-sm font-semibold">{f.value}</p>
            </div>
          ))}
        </div>

        <table className="w-full mb-6">
          <thead>
            <tr className="border-b-2 border-primary/20">
              <th className="table-header">Subject</th>
              <th className="table-header">Teacher</th>
              <th className="table-header text-center">Marks</th>
              <th className="table-header text-center">%</th>
              <th className="table-header text-center">Grade</th>
            </tr>
          </thead>
          <tbody>
            {result.subjects.map(s => (
              <tr key={s.subject} className="border-b border-border/50">
                <td className="table-cell font-medium">{s.subject}</td>
                <td className="table-cell text-muted-foreground">{s.teacher}</td>
                <td className="table-cell text-center">{s.marksObtained}/{s.totalMarks}</td>
                <td className="table-cell text-center font-medium">{s.marksObtained}%</td>
                <td className="table-cell text-center">
                  <span className={`badge ${s.grade.startsWith('A') ? 'bg-success/10 text-success' : s.grade === 'B' ? 'bg-info/10 text-info' : s.grade === 'F' ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'}`}>{s.grade}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-primary/5 rounded-lg text-center">
            <p className="text-2xl font-bold font-display text-primary">{result.percentage}%</p>
            <p className="text-xs text-muted-foreground">Percentage</p>
          </div>
          <div className="p-4 bg-primary/5 rounded-lg text-center">
            <p className="text-2xl font-bold font-display">{result.grade}</p>
            <p className="text-xs text-muted-foreground">Grade</p>
          </div>
          <div className="p-4 bg-primary/5 rounded-lg text-center">
            <p className="text-2xl font-bold font-display">{result.gpa.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">GPA</p>
          </div>
          <div className="p-4 bg-primary/5 rounded-lg text-center">
            <p className="text-2xl font-bold font-display">{result.percentage >= 50 ? '✅ Pass' : '❌ Fail'}</p>
            <p className="text-xs text-muted-foreground">Result</p>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <p className="text-sm"><span className="font-medium">Teacher Remarks:</span> {result.remarks}</p>
        </div>

        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-border">
          <div className="text-center">
            <div className="border-t border-foreground/30 pt-2 mt-8">
              <p className="text-sm font-medium">Class Teacher</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t border-foreground/30 pt-2 mt-8">
              <p className="text-sm font-medium">Principal</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AnalyticsTab() {
  const classAvg = examResults.reduce((acc, r) => {
    if (!acc[r.class]) acc[r.class] = { total: 0, count: 0 };
    acc[r.class].total += r.percentage;
    acc[r.class].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const chartData = Object.entries(classAvg).map(([cls, d]) => ({ class: cls, avg: Math.round(d.total / d.count) }));
  const topStudents = [...examResults].sort((a, b) => b.percentage - a.percentage).slice(0, 5);
  const weakStudents = examResults.filter(r => r.percentage < 60);

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card-white">
          <h3 className="font-display font-semibold mb-4">Class Average Performance</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" />
              <XAxis dataKey="class" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="avg" fill="hsl(142, 72%, 29%)" radius={[4, 4, 0, 0]} name="Average %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card-white">
          <h3 className="font-display font-semibold mb-4">🏆 Top Students</h3>
          <div className="space-y-2">
            {topStudents.map((s, i) => (
              <div key={s.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-warning/20 text-warning' : 'bg-muted text-muted-foreground'}`}>
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{s.studentName}</p>
                    <p className="text-xs text-muted-foreground">{s.class}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-primary">{s.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {weakStudents.length > 0 && (
        <div className="card-white">
          <h3 className="font-display font-semibold mb-4 text-destructive">⚠️ Students Needing Attention (Below 60%)</h3>
          <div className="space-y-2">
            {weakStudents.map(s => (
              <div key={s.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-destructive/5">
                <div>
                  <p className="text-sm font-medium">{s.studentName}</p>
                  <p className="text-xs text-muted-foreground">{s.class}</p>
                </div>
                <span className="badge bg-destructive/10 text-destructive">{s.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
