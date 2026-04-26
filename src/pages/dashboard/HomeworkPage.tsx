import { useState } from 'react';
import { ClipboardList, Plus, Search, Eye, Trash2, Download, BookOpen, Clock, CheckCircle, FileText, Send, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { C, PageHeader, StatCard, SearchBar, Badge, Btn, Table, Tr, Td, Modal, Field, Input, Select, Avatar } from '@/lib/design-system';

interface Homework {
  id: number;
  title: string;
  class: string;
  subject: string;
  assignedDate: string;
  dueDate: string;
  submissions: number;
  totalStudents: number;
  status: 'active' | 'completed' | 'expired';
}

const INITIAL: Homework[] = [
  { id: 1, title: 'Linear Equations Exercise 4.2', class: 'Class 8A', subject: 'Mathematics', assignedDate: '2026-04-20', dueDate: '2026-04-22', submissions: 25, totalStudents: 30, status: 'active' },
  { id: 2, title: 'English Essay: My School', class: 'Class 5B', subject: 'English', assignedDate: '2026-04-18', dueDate: '2026-04-21', submissions: 32, totalStudents: 32, status: 'completed' },
  { id: 3, title: 'Science Lab Report: Plant Cells', class: 'Class 7A', subject: 'Science', assignedDate: '2026-04-15', dueDate: '2026-04-17', submissions: 20, totalStudents: 28, status: 'expired' },
  { id: 4, title: 'Urdu Poetry Analysis', class: 'Class 9C', subject: 'Urdu', assignedDate: '2026-04-21', dueDate: '2026-04-24', submissions: 5, totalStudents: 25, status: 'active' },
];

export default function HomeworkPage() {
  const [items, setItems] = useState<Homework[]>(INITIAL);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this homework assignment and all associated submissions?')) {
      setItems(prev => prev.filter(a => a.id !== id));
      toast.success('Assignment deleted');
    }
  };

  const filtered = items.filter(i => 
    i.title.toLowerCase().includes(search.toLowerCase()) || 
    i.subject.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const newEntry: Homework = {
      id: Date.now(),
      title: fd.get('title') as string,
      class: fd.get('class') as string,
      subject: fd.get('subject') as string,
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate: fd.get('dueDate') as string,
      submissions: 0,
      totalStudents: 32,
      status: 'active'
    };
    setItems([newEntry, ...items]);
    toast.success('Homework assigned and notified to parents via SMS!');
    setShowAdd(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader title="Homework & Assignments" sub="Manage school-wide assignments and monitor student submission progress">
        <Btn icon={Plus} onClick={() => setShowAdd(true)}>Assign New Homework</Btn>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        <StatCard label="Live Assignments" value={items.filter(i => i.status === 'active').length} icon={ClipboardList} color="#3b82f6" trend={{ type:'up', val:'+4 today' }} />
        <StatCard label="Pending Review" value="8" icon={Clock} color="#f59e0b" />
        <StatCard label="Avg. Submission" value="88%" icon={CheckCircle} color="#22c55e" />
        <StatCard label="Total Posted" value={items.length} icon={FileText} color="#a855f7" />
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', background: '#f8fafc', padding: '12px 16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by topic, subject or class..." width="100%" />
      </div>

      <Table headers={['Assignment Topic', 'Class', 'Subject', 'Deadline', 'Submission Progress', 'Status', 'Actions']}>
        {filtered.length > 0 ? filtered.map(i => (
          <Tr key={i.id}>
            <Td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileText size={18} color="#f59e0b" />
                    </div>
                    <span style={{ fontWeight: 700, color: '#1e293b' }}>{i.title}</span>
                </div>
            </Td>
            <Td style={{ color: C.sub, fontWeight: 500 }}>{i.class}</Td>
            <Td>
                <Badge label={i.subject} variant="info" />
            </Td>
            <Td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.red }}>
                    <Calendar size={14} />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{i.dueDate}</span>
                </div>
            </Td>
            <Td>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: C.sub }}>
                        <span>{Math.round((i.submissions/i.totalStudents)*100)}%</span>
                        <span>{i.submissions}/{i.totalStudents}</span>
                    </div>
                    <div style={{ width: '100%', height: 6, borderRadius: 10, background: '#f1f5f9', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(i.submissions/i.totalStudents)*100}%`, background: 'linear-gradient(90deg, #16a34a, #22c55e)', borderRadius: 10 }} />
                    </div>
                </div>
            </Td>
            <Td><Badge label={i.status} variant={i.status === 'active' ? 'warning' : i.status === 'completed' ? 'success' : 'default'} /></Td>
            <Td>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ padding: 8, background: '#f1f5f9', borderRadius: 10, border: 'none', cursor: 'pointer', color: C.sub }}><Eye size={16} /></button>
                    <button style={{ padding: 8, background: '#f1f5f9', borderRadius: 10, border: 'none', cursor: 'pointer', color: C.sub }}><Download size={16} /></button>
                    <button onClick={() => handleDelete(i.id)} style={{ padding: 8, background: 'rgba(239,68,68,0.1)', borderRadius: 10, border: 'none', cursor: 'pointer', color: C.red }}><Trash2 size={16} /></button>
                </div>
            </Td>
          </Tr>
        )) : (
          <Tr><Td colspan={7} style={{ textAlign: 'center', padding: '48px', color: C.muted }}>No active homework assignments found.</Td></Tr>
        )}
      </Table>

      {showAdd && (
        <Modal title="Assign Academic Homework" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Field label="Assignment Title">
                <Input name="title" placeholder="e.g. Linear Algebra Worksheet 5" required />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Target Class">
                    <Select name="class">
                        <option>Class 8A</option>
                        <option>Class 8B</option>
                        <option>Class 9C</option>
                        <option>Class 10-A</option>
                    </Select>
                </Field>
                <Field label="Subject">
                    <Select name="subject">
                        <option>Mathematics</option>
                        <option>English</option>
                        <option>Science</option>
                        <option>Urdu</option>
                        <option>Islamiat</option>
                    </Select>
                </Field>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Assignment Release">
                    <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                </Field>
                <Field label="Submission Deadline">
                    <Input name="dueDate" type="date" required />
                </Field>
            </div>
            <Field label="Task Instructions / Material Links">
                <textarea 
                    placeholder="Provide clear instructions for students..." 
                    style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 12, padding: 12, color: '#1e293b', fontSize: 14, outline: 'none', width: '100%', height: 100, resize: 'none' }} 
                    required 
                />
            </Field>
            <div style={{ marginTop: 10 }}>
                <Btn type="submit" style={{ width: '100%' }}>Post Assignment & Notify</Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
