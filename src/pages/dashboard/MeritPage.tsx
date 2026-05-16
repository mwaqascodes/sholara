import { useState } from 'react';
import { Trophy, Plus, Search, Star, Award, TrendingUp, Medal, ShieldAlert, Heart, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { C, PageHeader, StatCard, SearchBar, Badge, Btn, Table, Tr, Td, Modal, Field, Input, Select, Avatar } from '@/lib/design-system';

interface MeritRecord {
  id: number;
  studentName: string;
  class: string;
  points: number;
  reason: string;
  date: string;
  type: 'merit' | 'demerit';
}

const INITIAL: MeritRecord[] = [
  { id: 1, studentName: 'Muhammad Ahmad', class: 'Class 5A', points: 50, reason: 'First place in Science Fair', date: '2026-04-15', type: 'merit' },
  { id: 2, studentName: 'Fatima Malik', class: 'Class 4B', points: 30, reason: 'Consistently helpful behavior', date: '2026-04-18', type: 'merit' },
  { id: 3, studentName: 'Ali Hassan', class: 'Class 8A', points: -10, reason: 'Late to class multiple times', date: '2026-04-20', type: 'demerit' },
  { id: 4, studentName: 'Sara Bibi', class: 'Class 10C', points: 100, reason: 'National level debate winner', date: '2026-04-10', type: 'merit' },
];

export default function MeritPage() {
  const [merits, setMerits] = useState<MeritRecord[]>(INITIAL);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const filtered = merits.filter(m => 
    m.studentName.toLowerCase().includes(search.toLowerCase()) || 
    m.reason.toLowerCase().includes(search.toLowerCase())
  );

  const totalPoints = merits.reduce((s, m) => s + m.points, 0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const type = formData.get('type') as 'merit' | 'demerit';
    const pts = parseInt(formData.get('points') as string) || 0;
    
    const newRecord: MeritRecord = {
      id: Date.now(),
      studentName: formData.get('student') as string,
      class: 'Class 5',
      points: type === 'merit' ? Math.abs(pts) : -Math.abs(pts),
      reason: formData.get('reason') as string,
      date: new Date().toISOString().split('T')[0],
      type
    };
    
    setMerits([newRecord, ...merits]);
    toast.success('Conduct record added successfully');
    setShowAdd(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Delete this conduct record?')) {
      setMerits(merits.filter(m => m.id !== id));
      toast.success('Record removed');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader title="Merit & Conduct" sub="Monitor and reward student achievements and discipline">
        <Btn icon={Plus} onClick={() => setShowAdd(true)}>Track Behavior</Btn>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        <StatCard label="Merit Points" value={merits.filter(m => m.type === 'merit').length} icon={Trophy} color="#22c55e" trend={{ type:'up', val:'+5 this week' }} />
        <StatCard label="Discipline Issues" value={merits.filter(m => m.type === 'demerit').length} icon={ShieldAlert} color="#ef4444" />
        <StatCard label="Net Score" value={totalPoints} icon={Star} color="#fbbf24" trend={{ type:'up', val:'Positive balance' }} />
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', background: '#f8fafc', padding: '12px 16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by student name or reason..." width="100%" />
      </div>

      <Table headers={['Student Account', 'Category', 'Points', 'Description', 'Date', 'Action']}>
        {filtered.length > 0 ? filtered.map(m => (
          <Tr key={m.id}>
            <Td>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar name={m.studentName} size={36} color={m.type === 'merit' ? '#22c55e' : '#ef4444'} />
                <div>
                    <p style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>{m.studentName}</p>
                    <p style={{ margin: 0, fontSize: 11, color: C.sub }}>{m.class}</p>
                </div>
              </div>
            </Td>
            <Td><Badge label={m.type} variant={m.type === 'merit' ? 'success' : 'danger'} /></Td>
            <Td>
                <div style={{ 
                    fontSize: 16, fontWeight: 900, 
                    color: m.type === 'merit' ? '#22c55e' : '#ef4444',
                    display: 'flex', alignItems: 'center', gap: 4
                }}>
                    {m.type === 'merit' ? '+' : ''}{m.points}
                    {m.type === 'merit' ? <TrendingUp size={14} /> : <TrendingUp size={14} style={{ transform: 'rotate(90deg)' }} />}
                </div>
            </Td>
            <Td style={{ color: C.sub, maxWidth: 300 }}>{m.reason}</Td>
            <Td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.muted }}>
                    <Calendar size={14} />
                    <span style={{ fontSize: 12 }}>{m.date}</span>
                </div>
            </Td>
            <Td>
                <button onClick={() => handleDelete(m.id)} style={{ padding: 8, background: 'rgba(239,68,68,0.1)', borderRadius: 10, border: 'none', cursor: 'pointer', color: C.red }}><Trash2 size={16} /></button>
            </Td>
          </Tr>
        )) : (
          <Tr><Td colspan={6} style={{ textAlign: 'center', padding: '48px', color: C.muted }}>No behavior records found.</Td></Tr>
        )}
      </Table>

      {showAdd && (
        <Modal title="Report Student Behavior" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Field label="Target Student">
              <Input name="student" placeholder="Find student..." required />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Assessment Type">
                    <Select name="type">
                        <option value="merit">Merit Card (Positive)</option>
                        <option value="demerit">Demerit / Warning (Negative)</option>
                    </Select>
                </Field>
                <Field label="Points Weightage">
                    <Input name="points" type="number" defaultValue="10" required />
                </Field>
            </div>
            <Field label="Detailed Reason / Remarks">
                <textarea 
                    name="reason"
                    placeholder="Provide specific details about the behavior..." 
                    style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 12, padding: 12, color: '#1e293b', fontSize: 14, outline: 'none', width: '100%', height: 100, resize: 'none' }} 
                    required 
                />
            </Field>
            <div style={{ marginTop: 10 }}>
                <Btn type="submit" style={{ width: '100%' }}>Register Conduct Entry</Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
