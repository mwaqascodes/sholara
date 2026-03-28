import { useState } from 'react';
import { examResults, gradeScale, students, getGrade } from '@/lib/demo-data';
import type { ExamResult } from '@/lib/demo-data';
import { useAuth } from '@/lib/auth-context';
import { Search, Download, FileText, BarChart3, Award, Eye, CheckCircle, Clock, Edit3, Filter, TrendingUp, AlertTriangle } from 'lucide-react';
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
  const isStudentOrParent = user?.role === 'student' || user?.role === 'parent';

  const filtered = examResults.filter(r => {
    if (search && !r.studentName.toLowerCase().includes(search.toLowerCase()) && !String(r.rollNo).includes(search)) return false;
    if (classFilter !== 'all' && r.class !== classFilter) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (isStudentOrParent) return r.studentId === '1' || r.status === 'published';
    return true;
  });

  const classes = [...new Set(examResults.map(r => r.class))];

  const tabs: { id: Tab; label: string; icon: React.ElementType; roles: string[] }[] = [
    { id: 'overview', label: 'Results', icon: FileText, roles: ['admin', 'teacher', 'student', 'parent', 'superadmin'] },
    { id: 'marks-entry', label: 'Marks Entry', icon: Edit3, roles: ['admin', 'teacher'] },
    { id: 'report-cards', label: 'Report Cards', icon: Award, roles: ['admin', 'teacher', 'student', 'parent'] },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, roles: ['admin', 'teacher'] },
    { id: 'grading', label: 'Grading Scale', icon: TrendingUp, roles: ['admin'] },
  ];

  const visibleTabs = tabs.filter(t => t.roles.includes(user?.role || ''));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold">Result Management</h2>
          <p className="text-sm text-muted-foreground">Mid-Term 2026 Examination</p>
        </div>
        {isTeacherOrAdmin && (
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg glass border border-border text-sm font-medium flex items-center gap-2 hover:bg-muted transition-colors">
              <Download className="w-4 h-4" /> Export
            </button>
            <button className="px-4 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity">
              <CheckCircle className="w-4 h-4" /> Publish All
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap glass-card p-1.5">
        {visibleTabs.map(t => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setSelectedResult(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.id ? 'gradient-primary text-primary-foreground shadow-sm' : 'hover:bg-muted text-muted-foreground'
            }`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Report Card Detail */}
      {selectedResult && (
        <ReportCardView result={selectedResult} onBack={() => setSelectedResult(null)} />
      )}

      {/* Overview tab */}
      {!selectedResult && tab === 'overview' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name or roll number..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-transparent"
              />
            </div>
            <select value={classFilter} onChange={e => setClassFilter(e.target.value)} className="px-3 py-2.5 rounded-lg border border-border text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="all">All Classes</option>
              {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {isTeacherOrAdmin && (
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2.5 rounded-lg border border-border text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="approved">Approved</option>
                <option value="published">Published</option>
              </select>
            )}
          </div>

          <div className="glass-card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">Roll#</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">Student</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">Class</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">Obtained</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">%</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">Grade</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">GPA</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">Rank</th>
                  {isTeacherOrAdmin && <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">Status</th>}
                  <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3 px-2 text-sm font-mono">{r.rollNo}</td>
                    <td className="py-3 px-2 text-sm font-medium">{r.studentName}</td>
                    <td className="py-3 px-2 text-sm">{r.class}</td>
                    <td className="py-3 px-2 text-sm">{r.obtainedMarks}/{r.totalMarks}</td>
                    <td className="py-3 px-2 text-sm font-semibold">{r.percentage}%</td>
                    <td className="py-3 px-2">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        r.grade.startsWith('A') ? 'bg-success/10 text-success' :
                        r.grade.startsWith('B') ? 'bg-info/10 text-info' :
                        'bg-warning/10 text-warning'
                      }`}>{r.grade}</span>
                    </td>
                    <td className="py-3 px-2 text-sm font-medium">{r.gpa.toFixed(1)}</td>
                    <td className="py-3 px-2">
                      {r.rank <= 3 ? (
                        <span className="flex items-center gap-1 text-sm">
                          <Award className={`w-4 h-4 ${r.rank === 1 ? 'text-warning' : r.rank === 2 ? 'text-muted-foreground' : 'text-warning/60'}`} />
                          #{r.rank}
                        </span>
                      ) : <span className="text-sm">#{r.rank}</span>}
                    </td>
                    {isTeacherOrAdmin && (
                      <td className="py-3 px-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
                          r.status === 'published' ? 'bg-success/10 text-success' :
                          r.status === 'approved' ? 'bg-info/10 text-info' :
                          'bg-warning/10 text-warning'
                        }`}>{r.status}</span>
                      </td>
                    )}
                    <td className="py-3 px-2">
                      <button onClick={() => setSelectedResult(r)} className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="View Report Card">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Marks Entry */}
      {!selectedResult && tab === 'marks-entry' && <MarksEntryTab />}

      {/* Report Cards list */}
      {!selectedResult && tab === 'report-cards' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.filter(r => r.status === 'published' || isTeacherOrAdmin).map(r => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card-hover cursor-pointer" onClick={() => setSelectedResult(r)}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">#{r.rollNo}</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">{r.studentName}</p>
                  <p className="text-xs text-muted-foreground">{r.class} · {r.examName}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-muted/50">
                  <p className="text-lg font-bold font-display gradient-text">{r.percentage}%</p>
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

      {/* Analytics */}
      {!selectedResult && tab === 'analytics' && <AnalyticsTab />}

      {/* Grading Scale */}
      {!selectedResult && tab === 'grading' && (
        <div className="glass-card max-w-2xl">
          <h3 className="font-display font-semibold mb-4">Grading Scale</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground py-2 px-2">Grade</th>
                <th className="text-left text-xs font-semibold text-muted-foreground py-2 px-2">Percentage</th>
                <th className="text-left text-xs font-semibold text-muted-foreground py-2 px-2">GPA</th>
                <th className="text-left text-xs font-semibold text-muted-foreground py-2 px-2">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {gradeScale.map(g => (
                <tr key={g.grade} className="border-b border-border/50">
                  <td className="py-2.5 px-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      g.grade.startsWith('A') ? 'bg-success/10 text-success' :
                      g.grade.startsWith('B') ? 'bg-info/10 text-info' :
                      g.grade === 'C+' || g.grade === 'C' ? 'bg-warning/10 text-warning' :
                      'bg-destructive/10 text-destructive'
                    }`}>{g.grade}</span>
                  </td>
                  <td className="py-2.5 px-2 text-sm">{g.minPercentage}% - {g.maxPercentage}%</td>
                  <td className="py-2.5 px-2 text-sm font-semibold">{g.gpa.toFixed(1)}</td>
                  <td className="py-2.5 px-2 text-sm text-muted-foreground">{g.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// --- MARKS ENTRY COMPONENT ---
function MarksEntryTab() {
  const [selectedClass, setSelectedClass] = useState('10-A');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const classStudents = students.filter(s => s.class === selectedClass);
  const [marks, setMarks] = useState<Record<string, number>>(
    Object.fromEntries(classStudents.map(s => [s.id, Math.floor(Math.random() * 30) + 65]))
  );
  const [saved, setSaved] = useState(false);

  const allClasses = ['10-A', '10-B', '9-A', '9-B', '11-A'];
  const allSubjects = ['Mathematics', 'Physics', 'English', 'Chemistry', 'Biology', 'History'];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="px-3 py-2 rounded-lg border border-border text-sm bg-transparent">
          {allClasses.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="px-3 py-2 rounded-lg border border-border text-sm bg-transparent">
          {allSubjects.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="glass-card">
        <h3 className="font-display font-semibold mb-4">Enter Marks — {selectedClass} · {selectedSubject}</h3>
        <div className="space-y-2">
          {classStudents.map(s => {
            const m = marks[s.id] || 0;
            const g = getGrade(m);
            return (
              <div key={s.id} className="flex items-center gap-4 py-2 px-3 rounded-lg hover:bg-muted/30 transition-colors">
                <span className="text-sm w-8 text-muted-foreground">#{s.rollNo}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{s.name}</p>
                </div>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={m}
                  onChange={e => { setMarks(p => ({ ...p, [s.id]: Number(e.target.value) })); setSaved(false); }}
                  className="w-20 px-2 py-1.5 rounded-lg border border-border text-sm text-center bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <span className="text-sm text-muted-foreground w-8">/100</span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full w-10 text-center ${
                  g.grade.startsWith('A') ? 'bg-success/10 text-success' :
                  g.grade.startsWith('B') ? 'bg-info/10 text-info' :
                  g.grade === 'F' ? 'bg-destructive/10 text-destructive' :
                  'bg-warning/10 text-warning'
                }`}>{g.grade}</span>
              </div>
            );
          })}
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={() => setSaved(true)} className="px-6 py-2.5 rounded-lg glass border border-border text-sm font-medium hover:bg-muted transition-colors">
            <Clock className="w-4 h-4 inline mr-1" /> Save Draft
          </button>
          <button onClick={() => setSaved(true)} className="px-6 py-2.5 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <CheckCircle className="w-4 h-4 inline mr-1" /> Submit for Approval
          </button>
        </div>
        {saved && <p className="text-sm text-success mt-2 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Marks saved successfully!</p>}
      </div>
    </div>
  );
}

// --- REPORT CARD VIEW ---
function ReportCardView({ result, onBack }: { result: ExamResult; onBack: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <button onClick={onBack} className="text-sm text-primary hover:underline">← Back to results</button>

      <div className="glass-strong rounded-2xl p-6 lg:p-8 max-w-3xl mx-auto print:shadow-none" id="report-card">
        {/* Header */}
        <div className="text-center border-b-2 border-primary/20 pb-4 mb-6">
          <h2 className="font-display text-2xl font-bold gradient-text">Lincoln Academy</h2>
          <p className="text-sm text-muted-foreground">123 Education St, NY · Phone: +1 (555) 123-4567</p>
          <div className="mt-3 inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
            {result.examName} — Report Card
          </div>
        </div>

        {/* Student Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { l: 'Student Name', v: result.studentName },
            { l: 'Roll Number', v: `#${result.rollNo}` },
            { l: 'Class / Section', v: result.class },
            { l: 'Attendance', v: `${result.attendance}%` },
          ].map(x => (
            <div key={x.l} className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">{x.l}</p>
              <p className="text-sm font-semibold mt-0.5">{x.v}</p>
            </div>
          ))}
        </div>

        {/* Subject Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground py-2 px-2">#</th>
                <th className="text-left text-xs font-semibold text-muted-foreground py-2 px-2">Subject</th>
                <th className="text-left text-xs font-semibold text-muted-foreground py-2 px-2">Teacher</th>
                <th className="text-center text-xs font-semibold text-muted-foreground py-2 px-2">Marks</th>
                <th className="text-center text-xs font-semibold text-muted-foreground py-2 px-2">Total</th>
                <th className="text-center text-xs font-semibold text-muted-foreground py-2 px-2">%</th>
                <th className="text-center text-xs font-semibold text-muted-foreground py-2 px-2">Grade</th>
                <th className="text-center text-xs font-semibold text-muted-foreground py-2 px-2">GPA</th>
              </tr>
            </thead>
            <tbody>
              {result.subjects.map((s, i) => (
                <tr key={s.subject} className="border-b border-border/50">
                  <td className="py-2.5 px-2 text-sm text-muted-foreground">{i + 1}</td>
                  <td className="py-2.5 px-2 text-sm font-medium">{s.subject}</td>
                  <td className="py-2.5 px-2 text-sm text-muted-foreground">{s.teacher}</td>
                  <td className="py-2.5 px-2 text-sm text-center font-semibold">{s.marksObtained}</td>
                  <td className="py-2.5 px-2 text-sm text-center">{s.totalMarks}</td>
                  <td className="py-2.5 px-2 text-sm text-center">{Math.round(s.marksObtained / s.totalMarks * 100)}%</td>
                  <td className="py-2.5 px-2 text-center">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      s.grade.startsWith('A') ? 'bg-success/10 text-success' :
                      s.grade.startsWith('B') ? 'bg-info/10 text-info' :
                      'bg-warning/10 text-warning'
                    }`}>{s.grade}</span>
                  </td>
                  <td className="py-2.5 px-2 text-sm text-center">{s.gpa.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border font-semibold">
                <td colSpan={3} className="py-2.5 px-2 text-sm">Total</td>
                <td className="py-2.5 px-2 text-sm text-center">{result.obtainedMarks}</td>
                <td className="py-2.5 px-2 text-sm text-center">{result.totalMarks}</td>
                <td className="py-2.5 px-2 text-sm text-center gradient-text">{result.percentage}%</td>
                <td className="py-2.5 px-2 text-center">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">{result.grade}</span>
                </td>
                <td className="py-2.5 px-2 text-sm text-center">{result.gpa.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="stat-card text-center">
            <p className="text-2xl font-bold font-display gradient-text">{result.percentage}%</p>
            <p className="text-xs text-muted-foreground">Percentage</p>
          </div>
          <div className="stat-card text-center">
            <p className="text-2xl font-bold font-display">{result.grade}</p>
            <p className="text-xs text-muted-foreground">Grade</p>
          </div>
          <div className="stat-card text-center">
            <p className="text-2xl font-bold font-display">{result.gpa.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">GPA</p>
          </div>
          <div className="stat-card text-center">
            <p className="text-2xl font-bold font-display">#{result.rank}</p>
            <p className="text-xs text-muted-foreground">Class Rank</p>
          </div>
        </div>

        {/* Remarks */}
        <div className="p-4 rounded-lg bg-muted/50 mb-4">
          <p className="text-xs text-muted-foreground mb-1">Teacher Remarks</p>
          <p className="text-sm italic">"{result.remarks}"</p>
        </div>

        <div className="flex gap-3 print:hidden">
          <button onClick={() => window.print()} className="px-6 py-2.5 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// --- ANALYTICS TAB ---
function AnalyticsTab() {
  const published = examResults.filter(r => r.status === 'published');
  const classGroups = published.reduce<Record<string, ExamResult[]>>((acc, r) => {
    (acc[r.class] = acc[r.class] || []).push(r);
    return acc;
  }, {});

  const classAvg = Object.entries(classGroups).map(([cls, rs]) => ({
    class: cls,
    avg: Math.round(rs.reduce((s, r) => s + r.percentage, 0) / rs.length),
    topStudent: rs.sort((a, b) => b.percentage - a.percentage)[0]?.studentName,
  }));

  const toppers = [...published].sort((a, b) => b.percentage - a.percentage).slice(0, 5);
  const weakStudents = published.filter(r => r.percentage < 50);

  const subjectAvg = examResults[0]?.subjects.map((_, i) => {
    const avg = Math.round(published.reduce((s, r) => s + (r.subjects[i]?.marksObtained || 0), 0) / published.length);
    return { subject: examResults[0].subjects[i]?.subject || '', avg };
  }) || [];

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">School Average</p>
          <p className="text-3xl font-bold font-display gradient-text">{Math.round(published.reduce((s, r) => s + r.percentage, 0) / (published.length || 1))}%</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Pass Rate</p>
          <p className="text-3xl font-bold font-display bg-gradient-to-r from-success to-accent bg-clip-text text-transparent">
            {Math.round(published.filter(r => r.percentage >= 40).length / (published.length || 1) * 100)}%
          </p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Students At Risk</p>
          <p className="text-3xl font-bold font-display text-destructive">{weakStudents.length}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Subject performance chart */}
        <div className="glass-card">
          <h3 className="font-display font-semibold mb-4">Subject-wise Average</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={subjectAvg}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="subject" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="avg" fill="hsl(221, 83%, 53%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top 5 */}
        <div className="glass-card">
          <h3 className="font-display font-semibold mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-warning" /> Top Performers</h3>
          <div className="space-y-3">
            {toppers.map((t, i) => (
              <div key={t.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  i === 0 ? 'bg-warning/20 text-warning' : i === 1 ? 'bg-muted text-muted-foreground' : 'bg-warning/10 text-warning/60'
                }`}>#{i + 1}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{t.studentName}</p>
                  <p className="text-xs text-muted-foreground">{t.class}</p>
                </div>
                <span className="text-sm font-bold gradient-text">{t.percentage}%</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-success/10 text-success">{t.grade}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Class averages */}
      <div className="glass-card">
        <h3 className="font-display font-semibold mb-4">Class-wise Performance</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {classAvg.map(c => (
            <div key={c.class} className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{c.class}</span>
                <span className="text-sm font-bold gradient-text">{c.avg}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted">
                <div className="h-2 rounded-full gradient-primary" style={{ width: `${c.avg}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Topper: {c.topStudent}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Weak students alert */}
      {weakStudents.length > 0 && (
        <div className="glass-card border-destructive/30">
          <h3 className="font-display font-semibold mb-3 flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" /> Students Needing Attention
          </h3>
          <div className="space-y-2">
            {weakStudents.map(s => (
              <div key={s.id} className="flex items-center justify-between p-2 rounded-lg bg-destructive/5">
                <span className="text-sm font-medium">{s.studentName} ({s.class})</span>
                <span className="text-sm font-bold text-destructive">{s.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
