import { useState } from 'react';
import { BookOpen, Users, UserCheck, Plus, Search, Trash2, Edit, MoreVertical, GraduationCap, School } from 'lucide-react';
import { toast } from 'sonner';
import { C, PageHeader, StatCard, SearchBar, Badge, Btn, Modal, Field, Input, Select } from '@/lib/design-system';

const INITIAL = [
  { id:1,  name: 'Class 1',  students: 35, teacher: 'Amna Rashid',     subjects: 5, section: 'A' },
  { id:2,  name: 'Class 2',  students: 32, teacher: 'Amna Rashid',     subjects: 5, section: 'A' },
  { id:3,  name: 'Class 3',  students: 30, teacher: 'Sara Batool',     subjects: 5, section: 'A' },
  { id:4,  name: 'Class 4',  students: 28, teacher: 'Sara Batool',     subjects: 6, section: 'B' },
  { id:5,  name: 'Class 5',  students: 33, teacher: 'Muhammad Aslam',  subjects: 6, section: 'A' },
  { id:6,  name: 'Class 6',  students: 30, teacher: 'Muhammad Aslam',  subjects: 7, section: 'B' },
  { id:7,  name: 'Class 7',  students: 28, teacher: 'Kashif Ali',      subjects: 7, section: 'A' },
  { id:8,  name: 'Class 8',  students: 30, teacher: 'Umar Farooq',     subjects: 7, section: 'A' },
  { id:9,  name: 'Class 9',  students: 30, teacher: 'Fatima Noor',     subjects: 7, section: 'A' },
  { id:10, name: 'Class 10', students: 31, teacher: 'Fatima Noor',     subjects: 7, section: 'A' },
];

export default function ClassesPage() {
  const [classes, setClasses] = useState(INITIAL);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this class? This will affect attendance and result records.')) {
      setClasses(prev => prev.filter(c => c.id !== id));
      toast.success('Class removed from academic structure');
    }
  };

  const filtered = classes.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.teacher.toLowerCase().includes(search.toLowerCase())
  );

  const totalStudents = classes.reduce((s, c) => s + c.students, 0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const newClass = {
        id: classes.length + 1,
        name: fd.get('name') as string,
        section: fd.get('section') as string,
        teacher: fd.get('teacher') as string,
        students: 0,
        subjects: 5
    };
    setClasses([...classes, newClass]);
    toast.success('New class registered successfully!');
    setShowAdd(false);
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap: 24 }}>
      <PageHeader title="Academic Classes" sub={`${classes.length} total classes under active management`}>
        <Btn icon={Plus} onClick={() => setShowAdd(true)}>Register New Class</Btn>
      </PageHeader>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
        <StatCard label="Total Classes" value={classes.length} icon={School} color="#3b82f6" trend={{ type:'up', val:'+1 new' }} />
        <StatCard label="Total Enrolled" value={totalStudents} icon={Users} color="#22c55e" trend={{ type:'up', val:'+12%' }} />
        <StatCard label="Faculty Assigned" value={[...new Set(classes.map(c=>c.teacher))].length} icon={UserCheck} color="#a855f7" />
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', background: '#f8fafc', padding: '12px 16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by class name or lead teacher..." width="100%" />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
        {filtered.map(cls => (
          <div key={cls.id} style={{
            ...C.glass, padding: '24px',
            cursor:'pointer', transition:'all 0.3s ease', position: 'relative', overflow: 'hidden'
          }}
            className="glass-card-hover"
          >
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 20 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: 'rgba(245,158,11,0.1)', border: `1px solid rgba(245,158,11,0.3)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 800, color: C.amber,
              }}>{cls.id}</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Badge label={`Section ${cls.section}`} variant="info" />
                <button onClick={(e) => { e.stopPropagation(); handleDelete(cls.id); }} style={{ padding: 8, background: 'rgba(239,68,68,0.1)', border: 'none', cursor: 'pointer', color: C.red, borderRadius: 10 }} title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <h3 style={{ margin:'0 0 4px', fontSize: 20, fontWeight: 800, color: '#1e293b' }}>{cls.name}</h3>
            <p style={{ margin:'0 0 20px', fontSize: 13, color: C.sub, display: 'flex', alignItems: 'center', gap: 6 }}>
                <UserCheck size={14} color={C.green} /> {cls.teacher}
            </p>
            
            <div style={{ display:'flex', borderTop: `1px solid ${C.border}`, paddingTop: 20, gap: 12 }}>
              <div style={{ flex: 1, textAlign:'center', background: '#f8fafc', padding: '10px', borderRadius: 12 }}>
                <p style={{ margin:0, fontSize: 18, fontWeight: 800, color: '#1e293b' }}>{cls.students}</p>
                <p style={{ margin:0, fontSize: 10, fontWeight: 700, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Students</p>
              </div>
              <div style={{ flex: 1, textAlign:'center', background: '#f8fafc', padding: '10px', borderRadius: 12 }}>
                <p style={{ margin:0, fontSize: 18, fontWeight: 800, color: '#1e293b' }}>{cls.subjects}</p>
                <p style={{ margin:0, fontSize: 10, fontWeight: 700, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subjects</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <Modal title="Register New Academic Class" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Field label="Class Identifier">
                <Input name="name" placeholder="e.g. Class 11 - Pre Medical" required />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Assigned Section">
                    <Input name="section" placeholder="e.g. A" required />
                </Field>
                <Field label="Physical Room ID">
                    <Input name="room" placeholder="e.g. Block-B, Room 302" />
                </Field>
            </div>
            <Field label="Lead Class Teacher">
                <Select name="teacher" required>
                    <option value="Amna Rashid">Amna Rashid</option>
                    <option value="Sara Batool">Sara Batool</option>
                    <option value="Muhammad Aslam">Muhammad Aslam</option>
                    <option value="Fatima Noor">Fatima Noor</option>
                    <option value="Kashif Ali">Kashif Ali</option>
                </Select>
            </Field>
            <div style={{ marginTop: 10 }}>
                <Btn type="submit" style={{ width: '100%' }}>Initialize Class</Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// Icon fallbacks
const UserCheckIcon = ({ size, color }: any) => <UserCheck size={size} color={color} />;
