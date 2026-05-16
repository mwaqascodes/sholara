import { useState } from 'react';
import { BookOpen, Plus, Search, Eye, Trash2, Edit, GraduationCap, Users, BookMarked, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { C, PageHeader, StatCard, SearchBar, Badge, Btn, Table, Tr, Td, Modal, Field, Input, Select, Avatar } from '@/lib/design-system';

interface Subject {
  id: number;
  name: string;
  code: string;
  teacher: string;
  type: 'core' | 'elective';
  classes: string[];
}

const INITIAL: Subject[] = [
  { id: 1, name: 'Mathematics', code: 'MAT-101', teacher: 'Amna Rashid', type: 'core', classes: ['Class 1', 'Class 2', 'Class 3'] },
  { id: 2, name: 'English Literature', code: 'ENG-202', teacher: 'Sara Batool', type: 'core', classes: ['Class 4', 'Class 5', 'Class 6'] },
  { id: 3, name: 'General Science', code: 'SCI-303', teacher: 'Muhammad Aslam', type: 'core', classes: ['Class 1', 'Class 2', 'Class 3'] },
  { id: 4, name: 'Computer Science', code: 'CS-404', teacher: 'Fatima Noor', type: 'elective', classes: ['Class 9', 'Class 10'] },
  { id: 5, name: 'Urdu Language', code: 'URD-101', teacher: 'Kashif Ali', type: 'core', classes: ['All Classes'] },
];

export default function SubjectsPage() {
  const [items, setItems] = useState<Subject[]>(INITIAL);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this subject? This may affect student results.')) {
      setItems(prev => prev.filter(i => i.id !== id));
      toast.success('Subject removed from academic record');
    }
  };

  const filtered = items.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) || 
    i.teacher.toLowerCase().includes(search.toLowerCase()) ||
    i.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const newSubject: Subject = {
        id: Date.now(),
        name: fd.get('name') as string,
        code: fd.get('code') as string,
        teacher: fd.get('teacher') as string,
        type: (fd.get('type') as 'core' | 'elective') || 'core',
        classes: ['Standard']
    };
    setItems([newSubject, ...items]);
    toast.success('New subject created and faculty assigned!');
    setShowAdd(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader title="Curriculum Management" sub="Define syllabus, core subjects, and faculty assignments">
        <Btn icon={Plus} onClick={() => setShowAdd(true)}>Create New Subject</Btn>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        <StatCard label="Total Subjects" value={items.length} icon={BookBookmark} color="#3b82f6" trend={{ type:'up', val:'+1 new' }} />
        <StatCard label="Core Curriculum" value={items.filter(i => i.type === 'core').length} icon={GraduationCap} color="#22c55e" />
        <StatCard label="Specialized Electives" value={items.filter(i => i.type === 'elective').length} icon={BookOpen} color="#a855f7" />
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', background: '#f8fafc', padding: '12px 16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by subject name, code or teacher..." width="100%" />
      </div>

      <Table headers={['Subject Detail', 'Academic Code', 'Faculty Lead', 'Classification', 'Target Groups', 'Actions']}>
        {filtered.length > 0 ? filtered.map(i => (
          <Tr key={i.id}>
            <Td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BookMarked size={18} color={C.blue} />
                    </div>
                    <span style={{ fontWeight: 700, color: '#1e293b' }}>{i.name}</span>
                </div>
            </Td>
            <Td>
                <code style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: 6, fontSize: 11, color: C.sub }}>{i.code}</code>
            </Td>
            <Td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Avatar name={i.teacher} size={28} color="#22c55e" />
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#1e293b' }}>{i.teacher}</span>
                </div>
            </Td>
            <Td><Badge label={i.type} variant={i.type === 'core' ? 'success' : 'info'} /></Td>
            <Td>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {i.classes.map(c => (
                        <span key={c} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, background: '#f1f5f9', border: '1px solid #e2e8f0', color: C.sub, fontWeight: 600 }}>{c}</span>
                    ))}
                </div>
            </Td>
            <Td>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ padding: 8, background: '#f1f5f9', borderRadius: 10, border: 'none', cursor: 'pointer', color: C.sub }}><Edit size={16} /></button>
                    <button onClick={() => handleDelete(i.id)} style={{ padding: 8, background: 'rgba(239,68,68,0.1)', borderRadius: 10, border: 'none', cursor: 'pointer', color: C.red }}><Trash2 size={16} /></button>
                </div>
            </Td>
          </Tr>
        )) : (
          <Tr><Td colspan={6} style={{ textAlign: 'center', padding: '48px', color: C.muted }}>No subjects found matching your criteria.</Td></Tr>
        )}
      </Table>

      {showAdd && (
        <Modal title="Configure New Subject" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Field label="Subject Title">
              <Input name="name" placeholder="e.g. Applied Physics" required />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Subject Catalog ID">
                  <Input name="code" placeholder="e.g. PHY-202" required />
                </Field>
                <Field label="Curriculum Type">
                  <Select name="type">
                    <option value="core">Core Subject</option>
                    <option value="elective">Elective / Optional</option>
                  </Select>
                </Field>
            </div>
            <Field label="Assigned Faculty Lead">
                <Select name="teacher" required>
                    <option value="Amna Rashid">Amna Rashid</option>
                    <option value="Sara Batool">Sara Batool</option>
                    <option value="Muhammad Aslam">Muhammad Aslam</option>
                    <option value="Fatima Noor">Fatima Noor</option>
                </Select>
            </Field>
            <div style={{ marginTop: 10 }}>
                <Btn type="submit" style={{ width: '100%' }}>Register & Assign Subject</Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// Icon fallbacks if needed
const BookBookmark = ({ size, color, ...props }: any) => <BookMarked size={size} color={color} {...props} />;
