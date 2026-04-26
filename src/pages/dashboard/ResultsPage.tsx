import { useState } from 'react';
import { BarChart3, Plus, Search, Eye, Trash2, Download, FileText, TrendingUp, Award, CheckCircle2, XCircle, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { C, PageHeader, StatCard, SearchBar, Badge, Btn, Table, Tr, Td, Modal, Field, Input, Select, Avatar } from '@/lib/design-system';

interface ExamResult {
  id: number;
  studentName: string;
  class: string;
  exam: string;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade: string;
  status: 'pass' | 'fail';
}

const INITIAL: ExamResult[] = [
  { id: 1, studentName: 'Muhammad Ahmad', class: 'Class 8A', exam: 'Mid-term 2026', totalMarks: 500, obtainedMarks: 445, percentage: 89, grade: 'A+', status: 'pass' },
  { id: 2, studentName: 'Fatima Malik', class: 'Class 8A', exam: 'Mid-term 2026', totalMarks: 500, obtainedMarks: 412, percentage: 82.4, grade: 'A', status: 'pass' },
  { id: 3, studentName: 'Ali Hassan', class: 'Class 8A', exam: 'Mid-term 2026', totalMarks: 500, obtainedMarks: 320, percentage: 64, grade: 'B', status: 'pass' },
  { id: 4, studentName: 'Sara Bibi', class: 'Class 8A', exam: 'Mid-term 2026', totalMarks: 500, obtainedMarks: 478, percentage: 95.6, grade: 'A+', status: 'pass' },
];

export default function ResultsPage() {
  const [items, setItems] = useState<ExamResult[]>(INITIAL);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const navigate = useNavigate();

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this result entry?')) {
      setItems(prev => prev.filter(i => i.id !== id));
      toast.success('Result entry deleted');
    }
  };

  const filtered = items.filter(i => 
    i.studentName.toLowerCase().includes(search.toLowerCase()) || 
    i.exam.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const obt = parseInt(fd.get('obtained') as string);
    const tot = parseInt(fd.get('total') as string);
    const perc = (obt / tot) * 100;
    
    const getG = (p: number) => {
        if (p >= 90) return 'A+';
        if (p >= 80) return 'A';
        if (p >= 70) return 'B';
        if (p >= 60) return 'C';
        return 'F';
    };

    const newResult: ExamResult = {
      id: Date.now(),
      studentName: fd.get('student') as string,
      class: 'Class 8A',
      exam: fd.get('exam') as string,
      totalMarks: tot,
      obtainedMarks: obt,
      percentage: Math.round(perc * 10) / 10,
      grade: getG(perc),
      status: perc >= 40 ? 'pass' : 'fail'
    };
    
    setItems([newResult, ...items]);
    toast.success('Student result published successfully');
    setShowAdd(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader title="Exam & Performance" sub="Comprehensive student performance tracking and grade management">
        <Btn variant="secondary" icon={FileText} onClick={() => navigate('/dashboard/result-card')}>Result Cards</Btn>
        <Btn icon={Plus} onClick={() => setShowAdd(true)}>Enter New Marks</Btn>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        <StatCard label="School Average" value="78.5%" icon={TrendingUp} color="#3b82f6" trend={{ type:'up', val:'+5%' }} />
        <StatCard label="Passing Rate" value="94%" icon={CheckCircle2} color="#22c55e" trend={{ type:'up', val:'+2%' }} />
        <StatCard label="Results Published" value={items.length} icon={BarChart3} color="#a855f7" />
        <StatCard label="Distinctions" value="12" icon={Award} color="#fbbf24" />
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', background: '#f8fafc', padding: '12px 16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by student name or examination title..." width="100%" />
      </div>

      <Table headers={['Student Name', 'Exam Details', 'Marks Progress', 'Grade', 'Status', 'Actions']}>
        {filtered.length > 0 ? filtered.map(i => (
          <Tr key={i.id}>
            <Td>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar name={i.studentName} size={36} color="#3b82f6" />
                <div>
                   <p style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>{i.studentName}</p>
                   <p style={{ margin: 0, fontSize: 11, color: C.sub }}>{i.class}</p>
                </div>
              </div>
            </Td>
            <Td>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{i.exam}</p>
              <p style={{ margin: 0, fontSize: 11, color: C.sub }}>Academic Year 2026</p>
            </Td>
            <Td>
               <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1, width: 100, height: 6, background: '#f1f5f9', borderRadius: 10, overflow: 'hidden' }}>
                    <div style={{ width: `${i.percentage}%`, height: '100%', background: i.status === 'pass' ? C.green : C.red }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800 }}>{i.obtainedMarks}/{i.totalMarks}</span>
               </div>
               <span style={{ fontSize: 11, color: C.sub }}>{i.percentage}% Score</span>
            </Td>
            <Td>
                <div style={{ 
                    width: 36, height: 36, borderRadius: '50%', background: '#f1f5f9', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.amber, fontWeight: 800, fontSize: 14,
                    border: '1px solid #e2e8f0'
                }}>
                    {i.grade}
                </div>
            </Td>
            <Td><Badge label={i.status} variant={i.status === 'pass' ? 'success' : 'danger'} /></Td>
            <Td>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ padding: 8, background: '#f1f5f9', borderRadius: 10, border: 'none', cursor: 'pointer', color: C.sub }}><Eye size={16} /></button>
                    <button onClick={() => handleDelete(i.id)} style={{ padding: 8, background: 'rgba(239,68,68,0.1)', borderRadius: 10, border: 'none', cursor: 'pointer', color: C.red }}><Trash2 size={16} /></button>
                    <button onClick={() => { toast.success('Report downloaded'); }} style={{ padding: 8, background: '#f1f5f9', borderRadius: 10, border: 'none', cursor: 'pointer', color: C.sub }}><Download size={16} /></button>
                </div>
            </Td>
          </Tr>
        )) : (
          <Tr><Td colspan={6} style={{ textAlign: 'center', padding: '48px', color: C.muted }}>No examination records found.</Td></Tr>
        )}
      </Table>

      {showAdd && (
        <Modal title="Enter Examination Marks" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Field label="Target Student">
              <Input name="student" placeholder="Find student in database..." required />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Assessment Type">
                    <Select name="exam">
                        <option>Mid-term Exam 2026</option>
                        <option>Annual Exam 2026</option>
                        <option>Special Assessment</option>
                    </Select>
                </Field>
                <Field label="Academic Subject">
                    <Select name="subject">
                        <option>Mathematics</option>
                        <option>English Language</option>
                        <option>General Science</option>
                        <option>Urdu Adab</option>
                        <option>Islamiat</option>
                    </Select>
                </Field>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Total Allocated Marks">
                    <Input name="total" type="number" defaultValue="100" required />
                </Field>
                <Field label="Obtained Score">
                    <Input name="obtained" type="number" placeholder="Enter marks gained" required />
                </Field>
            </div>
            <div style={{ marginTop: 10 }}>
                <Btn type="submit" style={{ width: '100%' }}>Finalize & Publish Result</Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
