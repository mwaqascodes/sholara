import { useState } from 'react';
import { TrendingUp, Plus, Users, CheckCircle, ArrowRight, ShieldCheck, AlertCircle, GraduationCap, ArrowUpRight, Search, Filter, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { C, PageHeader, StatCard, Badge, Btn, Table, Tr, Td, Avatar, Select } from '@/lib/design-system';

interface PromotionRecord {
  id: number;
  studentName: string;
  fromClass: string;
  toClass: string;
  status: 'eligible' | 'promoted' | 'on-hold';
  gpa: number;
  attendance: number;
}

const INITIAL: PromotionRecord[] = [
  { id: 1, studentName: 'Muhammad Ahmad', fromClass: 'Class 4A', toClass: 'Class 5A', status: 'promoted', gpa: 3.8, attendance: 95 },
  { id: 2, studentName: 'Fatima Malik', fromClass: 'Class 3B', toClass: 'Class 4B', status: 'eligible', gpa: 3.5, attendance: 92 },
  { id: 3, studentName: 'Ali Hassan', fromClass: 'Class 7A', toClass: 'Class 8A', status: 'on-hold', gpa: 2.1, attendance: 75 },
  { id: 4, studentName: 'Sara Bibi', fromClass: 'Class 9C', toClass: 'Class 10C', status: 'eligible', gpa: 3.9, attendance: 98 },
];

export default function PromotionPage() {
  const [items, setItems] = useState<PromotionRecord[]>(INITIAL);
  const [fromClass, setFromClass] = useState('Class 4');
  const [toClass, setToClass] = useState('Class 5');

  const handlePromote = (id: number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'promoted' } : i));
    toast.success('Academic evolution successful! Student transitioned to next grade level.');
  };

  const handleBulkPromote = () => {
    const eligibleCount = items.filter(i => i.status === 'eligible').length;
    if (eligibleCount === 0) {
        toast.error('No candidate cohorts currently eligible for automated promotion.');
        return;
    }
    setItems(prev => prev.map(i => i.status === 'eligible' ? { ...i, status: 'promoted' } : i));
    toast.success(`Institutional Batch Promotion Complete: ${eligibleCount} students evolved.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader title="Academic Promotion Hub" sub="Administer grade transitions and evaluate cohort eligibility for the 2026-27 session">
        <Btn variant="primary" icon={ShieldCheck} onClick={handleBulkPromote}>Authorize Batch Promotion</Btn>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        <StatCard label="Eligibility Clearance" value={items.filter(i => i.status === 'eligible').length} icon={GraduationCap} color="#3b82f6" trend={{ type:'up', val:'Ranked' }} />
        <StatCard label="Transitioned (Promoted)" value={items.filter(i => i.status === 'promoted').length} icon={CheckCircle2} color="#22c55e" />
        <StatCard label="Under Manual Review" value={items.filter(i => i.status === 'on-hold').length} icon={AlertCircle} color="#ef4444" />
      </div>

      <div style={{ 
          ...C.glass, 
          padding: '24px', 
          display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap',
          background: '#f8fafc'
      }}>
          <div style={{ display: 'flex', flex: 1, gap: 16, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.sub, textTransform: 'uppercase' }}>Source Grade</span>
                <Select value={fromClass} onChange={(e: any) => setFromClass(e.target.value)} style={{ width: 140 }}>
                    {['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9'].map(c => <option key={c} value={c}>{c}</option>)}
                </Select>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowRight size={20} color="#3b82f6" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.sub, textTransform: 'uppercase' }}>Target Grade</span>
                <Select value={toClass} onChange={(e: any) => setToClass(e.target.value)} style={{ width: 140 }}>
                    {['Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map(c => <option key={c} value={c}>{c}</option>)}
                </Select>
            </div>
          </div>
          <Btn variant="secondary" icon={Users} onClick={() => toast.info("Refreshing cohort data...")}>Load Candidate Roster</Btn>
      </div>

      <Table headers={['Candidate Identity', 'Performance (GPA)', 'Attendance Ratio', 'Origin Class', 'Destination', 'Evaluation', 'Interaction']}>
        {items.length === 0 ? (
          <Tr><Td colSpan={7} style={{ textAlign: 'center', padding: 64, color: C.muted }}>No candidate rosters currently active in the promotion buffer.</Td></Tr>
        ) : (
          items.map(i => (
            <Tr key={i.id}>
              <Td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Avatar name={i.studentName} size={36} color="#3b82f6" />
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#1e293b' }}>{i.studentName}</span>
                </div>
              </Td>
              <Td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ArrowUpRight size={14} color={i.gpa >= 3.0 ? '#22c55e' : C.muted} />
                    <span style={{ fontSize: 15, fontWeight: 900, color: '#1e293b' }}>{i.gpa.toFixed(2)}</span>
                  </div>
              </Td>
              <Td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ width: 100, height: 6, borderRadius: 10, background: '#f1f5f9', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${i.attendance}%`, background: i.attendance >= 90 ? '#22c55e' : i.attendance >= 75 ? C.amber : '#ef4444', borderRadius: 10 }} />
                      </div>
                      <span style={{ fontSize: 10, color: C.muted, fontWeight: 700 }}>{i.attendance}% Attendance</span>
                  </div>
              </Td>
              <Td style={{ color: C.sub, fontWeight: 600 }}>{i.fromClass}</Td>
              <Td style={{ color: '#1e293b', fontWeight: 700 }}>{i.toClass}</Td>
              <Td><Badge label={i.status.toUpperCase()} variant={i.status === 'promoted' ? 'success' : i.status === 'eligible' ? 'info' : 'danger'} /></Td>
              <Td>
                  {i.status === 'eligible' ? (
                      <button onClick={() => handlePromote(i.id)} style={{ 
                          background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', 
                          borderRadius: 10, padding: '8px 16px', color: '#22c55e', 
                          fontSize: 12, fontWeight: 800, cursor: 'pointer',
                          transition: 'all 0.2s ease'
                      }}>Authorize Promotion</button>
                  ) : i.status === 'promoted' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#22c55e', fontSize: 12, fontWeight: 700 }}>
                          <CheckCircle2 size={14} /> Completed
                      </div>
                  ) : (
                      <Btn variant="secondary" style={{ padding: '6px 12px', fontSize: 10 }} onClick={() => toast.warning("Manual appraisal required due to low metrics.")}>Review Case</Btn>
                  )}
              </Td>
            </Tr>
          ))
        )}
      </Table>

      <div style={{ padding: '24px', background: 'rgba(59,130,246,0.05)', borderRadius: 16, border: '1px solid rgba(59,130,246,0.1)', display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={22} color="#3b82f6" />
          </div>
          <div>
              <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#1e293b' }}>Institutional Promotion Protocol</h4>
              <p style={{ margin: 0, fontSize: 12, color: C.sub }}>Student promotion is legally binding and updates all academic records, fees, and subject assignments automatically.</p>
          </div>
      </div>
    </div>
  );
}
