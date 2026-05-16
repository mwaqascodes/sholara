import { useState } from 'react';
import { Plus, Trash2, Eye, ClipboardList, CheckCircle, Clock, BookOpen, FileText, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { C, PageHeader, StatCard, Badge, Btn, Table, Tr, Td, Modal, Field, Input, Select } from '@/lib/design-system';

export interface Exam {
  id: string;
  title: string;
  type: 'quiz' | 'midterm' | 'final' | 'monthly' | 'unit';
  className: string;
  section: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  subjects: { name: string; totalMarks: number; passingMarks: number }[];
  createdAt: string;
}

const EXAMS_KEY = 'Scholara_exams_v1';
const CLASSES = ['Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8','Class 9','Class 10'];
const DEFAULT_SUBJECTS = ['Mathematics','English','Urdu','Science','Social Studies','Islamiyat'];

function loadExams(): Exam[] {
  try {
    const raw = localStorage.getItem(EXAMS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [
    {
      id: 'e1', title: 'Mid-Term Examination 2026', type: 'midterm',
      className: 'Class 9', section: 'A', academicYear: '2025-2026',
      startDate: '2026-05-10', endDate: '2026-05-20', status: 'upcoming',
      subjects: [
        { name: 'Mathematics', totalMarks: 100, passingMarks: 40 },
        { name: 'English', totalMarks: 100, passingMarks: 40 },
        { name: 'Urdu', totalMarks: 100, passingMarks: 40 },
        { name: 'Physics', totalMarks: 100, passingMarks: 40 },
        { name: 'Chemistry', totalMarks: 100, passingMarks: 40 },
      ],
      createdAt: '2026-04-01',
    },
    {
      id: 'e2', title: 'Monthly Test — April 2026', type: 'monthly',
      className: 'Class 7', section: 'B', academicYear: '2025-2026',
      startDate: '2026-04-25', endDate: '2026-04-30', status: 'ongoing',
      subjects: [
        { name: 'Mathematics', totalMarks: 50, passingMarks: 20 },
        { name: 'English', totalMarks: 50, passingMarks: 20 },
        { name: 'Science', totalMarks: 50, passingMarks: 20 },
      ],
      createdAt: '2026-04-10',
    },
    {
      id: 'e3', title: 'Unit Test 3 — Maths', type: 'unit',
      className: 'Class 5', section: 'A', academicYear: '2025-2026',
      startDate: '2026-04-15', endDate: '2026-04-15', status: 'completed',
      subjects: [{ name: 'Mathematics', totalMarks: 30, passingMarks: 12 }],
      createdAt: '2026-04-05',
    },
  ];
}

function saveExams(exams: Exam[]) {
  localStorage.setItem(EXAMS_KEY, JSON.stringify(exams));
}

const TYPE_LABELS: Record<string, string> = {
  quiz: 'Quiz', midterm: 'Mid-Term', final: 'Final', monthly: 'Monthly Test', unit: 'Unit Test',
};

const STATUS_VARIANT: Record<string, 'success'|'warning'|'info'|'default'> = {
  completed: 'success', ongoing: 'warning', upcoming: 'info',
};

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>(loadExams);
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<Exam | null>(null);
  const [filter, setFilter] = useState('all');

  const [form, setForm] = useState({
    title: '', type: 'midterm' as Exam['type'], className: 'Class 9',
    section: 'A', startDate: '', endDate: '', academicYear: '2025-2026',
  });
  const [subjects, setSubjects] = useState(
    DEFAULT_SUBJECTS.map(name => ({ name, totalMarks: 100, passingMarks: 40 }))
  );

  const filtered = filter === 'all' ? exams : exams.filter(e => e.status === filter);

  const handleAdd = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!form.title.trim()) { toast.error('Exam title required'); return; }
    const newExam: Exam = {
      id: `e${Date.now()}`, ...form,
      status: 'upcoming',
      subjects: subjects.filter(s => s.name.trim()),
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newExam, ...exams];
    setExams(updated);
    saveExams(updated);
    toast.success(`${form.title} created!`);
    setShowAdd(false);
    setForm({ title: '', type: 'midterm', className: 'Class 9', section: 'A', startDate: '', endDate: '', academicYear: '2025-2026' });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this exam?')) return;
    const updated = exams.filter(e => e.id !== id);
    setExams(updated);
    saveExams(updated);
    toast.success('Exam deleted');
  };

  const markComplete = (id: string) => {
    const updated = exams.map(e => e.id === id ? { ...e, status: 'completed' as const } : e);
    setExams(updated);
    saveExams(updated);
    toast.success('Exam marked as completed');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader title="Exam Management" sub={`${exams.length} exams · ${exams.filter(e => e.status === 'upcoming').length} upcoming`}>
        <Btn icon={Plus} onClick={() => setShowAdd(true)}>Create Exam</Btn>
      </PageHeader>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <StatCard label="Total Exams"   value={exams.length}                                  icon={ClipboardList} color="#8b5cf6" />
        <StatCard label="Upcoming"      value={exams.filter(e=>e.status==='upcoming').length}  icon={Clock}        color="#3b82f6" />
        <StatCard label="Ongoing"       value={exams.filter(e=>e.status==='ongoing').length}   icon={BookOpen}     color="#f59e0b" />
        <StatCard label="Completed"     value={exams.filter(e=>e.status==='completed').length} icon={CheckCircle}  color="#10b981" />
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8 }}>
        {['all','upcoming','ongoing','completed'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '8px 18px', borderRadius: 10, border: `1px solid ${filter===f ? '#f59e0b' : '#e2e8f0'}`,
            background: filter===f ? '#fffbeb' : '#fff', color: filter===f ? '#d97706' : C.sub,
            fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
            textTransform: 'capitalize',
          }}>
            {f === 'all' ? 'All Exams' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <Table headers={['Exam Title', 'Type', 'Class', 'Dates', 'Subjects', 'Status', 'Actions']}>
        {filtered.length === 0 ? (
          <Tr><Td colSpan={7} style={{ textAlign: 'center', padding: 48, color: C.muted }}>No exams found.</Td></Tr>
        ) : filtered.map(exam => (
          <Tr key={exam.id} onClick={() => setSelected(exam)}>
            <Td>
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.txt }}>{exam.title}</p>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: C.sub }}>{exam.academicYear}</p>
              </div>
            </Td>
            <Td><Badge label={TYPE_LABELS[exam.type]} variant="info" /></Td>
            <Td style={{ color: C.txt, fontWeight: 600 }}>{exam.className} — Sec {exam.section}</Td>
            <Td>
              <div style={{ fontSize: 12, color: C.sub }}>
                <p style={{ margin: 0 }}>{exam.startDate}</p>
                <p style={{ margin: '2px 0 0' }}>→ {exam.endDate}</p>
              </div>
            </Td>
            <Td style={{ color: C.txt, fontWeight: 600 }}>{exam.subjects.length} subjects</Td>
            <Td><Badge label={exam.status} variant={STATUS_VARIANT[exam.status]} /></Td>
            <Td>
              <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
                <button onClick={() => setSelected(exam)} style={{ padding: 7, background: '#f1f5f9', borderRadius: 8, border: '1px solid #e2e8f0', cursor: 'pointer', color: C.sub }} title="View"><Eye size={14} /></button>
                {exam.status !== 'completed' && (
                  <button onClick={() => markComplete(exam.id)} style={{ padding: 7, background: '#ecfdf5', borderRadius: 8, border: '1px solid #a7f3d0', cursor: 'pointer', color: '#10b981' }} title="Mark Complete"><CheckCircle size={14} /></button>
                )}
                <button onClick={() => handleDelete(exam.id)} style={{ padding: 7, background: '#fef2f2', borderRadius: 8, border: '1px solid #fecaca', cursor: 'pointer', color: '#ef4444' }} title="Delete"><Trash2 size={14} /></button>
              </div>
            </Td>
          </Tr>
        ))}
      </Table>

      {/* Create Modal */}
      {showAdd && (
        <Modal title="Create New Exam" onClose={() => setShowAdd(false)} width={680}>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
              <Field label="Exam Title"><Input value={form.title} onChange={(e:any)=>setForm({...form,title:e.target.value})} placeholder="e.g. Mid-Term Examination 2026" required /></Field>
              <Field label="Exam Type">
                <Select value={form.type} onChange={(e:any)=>setForm({...form,type:e.target.value})}>
                  {Object.entries(TYPE_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                </Select>
              </Field>
              <Field label="Class">
                <Select value={form.className} onChange={(e:any)=>setForm({...form,className:e.target.value})}>
                  {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                </Select>
              </Field>
              <Field label="Section">
                <Select value={form.section} onChange={(e:any)=>setForm({...form,section:e.target.value})}>
                  {['A','B','C'].map(s => <option key={s} value={s}>Section {s}</option>)}
                </Select>
              </Field>
              <Field label="Start Date"><Input type="date" value={form.startDate} onChange={(e:any)=>setForm({...form,startDate:e.target.value})} required /></Field>
              <Field label="End Date"><Input type="date" value={form.endDate} onChange={(e:any)=>setForm({...form,endDate:e.target.value})} required /></Field>
            </div>

            {/* Subjects config */}
            <div>
              <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 800, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subjects & Marks</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {subjects.map((sub, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 36px', gap: 8, alignItems: 'center' }}>
                    <Input value={sub.name} onChange={(e:any) => setSubjects(s => s.map((x,j) => j===i ? {...x,name:e.target.value} : x))} placeholder="Subject name" />
                    <Input type="number" value={sub.totalMarks} onChange={(e:any) => setSubjects(s => s.map((x,j) => j===i ? {...x,totalMarks:Number(e.target.value)} : x))} placeholder="Max" />
                    <Input type="number" value={sub.passingMarks} onChange={(e:any) => setSubjects(s => s.map((x,j) => j===i ? {...x,passingMarks:Number(e.target.value)} : x))} placeholder="Pass" />
                    <button type="button" onClick={() => setSubjects(s => s.filter((_,j) => j!==i))} style={{ padding: 7, background: '#fef2f2', borderRadius: 8, border: '1px solid #fecaca', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={13} /></button>
                  </div>
                ))}
                <button type="button" onClick={() => setSubjects(s => [...s, { name:'', totalMarks:100, passingMarks:40 }])} style={{ padding: '8px 14px', border: '1px dashed #e2e8f0', borderRadius: 8, background: '#f8fafc', cursor: 'pointer', fontSize: 12, color: C.sub, fontWeight: 600 }}>
                  + Add Subject
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
              <Btn variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Btn>
              <Btn type="submit" icon={ClipboardList}>Create Exam</Btn>
            </div>
          </form>
        </Modal>
      )}

      {/* Exam Detail Modal */}
      {selected && (
        <Modal title={selected.title} onClose={() => setSelected(null)} width={560}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { label: 'Type', value: TYPE_LABELS[selected.type] },
                { label: 'Status', value: selected.status },
                { label: 'Class', value: `${selected.className} — Sec ${selected.section}` },
                { label: 'Academic Year', value: selected.academicYear },
                { label: 'Start Date', value: selected.startDate },
                { label: 'End Date', value: selected.endDate },
              ].map(f => (
                <div key={f.label} style={{ padding: 12, background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                  <p style={{ margin: 0, fontSize: 10, fontWeight: 800, color: C.muted, textTransform: 'uppercase' }}>{f.label}</p>
                  <p style={{ margin: '4px 0 0', fontSize: 13, fontWeight: 700, color: C.txt }}>{f.value}</p>
                </div>
              ))}
            </div>
            <div>
              <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 800, color: C.muted, textTransform: 'uppercase' }}>Subjects</p>
              {selected.subjects.map(sub => (
                <div key={sub.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: 8, marginBottom: 6, border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.txt }}>{sub.name}</span>
                  <span style={{ fontSize: 12, color: C.sub }}>Max: {sub.totalMarks} | Pass: {sub.passingMarks}</span>
                </div>
              ))}
            </div>
            <Btn variant="secondary" onClick={() => setSelected(null)} style={{ alignSelf: 'flex-end' }}>Close</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
