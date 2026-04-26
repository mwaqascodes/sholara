import { useState } from 'react';
import { Calendar, CheckCircle, X, Clock, Plus, Eye, Trash2, User, FileText, CalendarDays, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { C, PageHeader, StatCard, Badge, Btn, Table, Tr, Td, Modal, Field, Input, Select, Avatar } from '@/lib/design-system';

interface Leave {
  id: number; name: string; role: 'teacher'|'student'; class?: string;
  type: string; from: string; to: string; reason: string;
  status: 'pending'|'approved'|'rejected'; appliedOn: string;
}

const INITIAL: Leave[] = [
  { id:1, name:'Ahmad Raza',    role:'teacher', type:'Medical',  from:'2026-04-22', to:'2026-04-23', reason:'Stomach flu, doctor advised rest',    status:'pending',  appliedOn:'Apr 21, 2026' },
  { id:2, name:'Fatima Malik',  role:'teacher', type:'Personal', from:'2026-04-25', to:'2026-04-25', reason:'Family function in hometown',          status:'pending',  appliedOn:'Apr 21, 2026' },
  { id:3, name:'Ali Hassan',    role:'student', class:'Class 8', type:'Medical',  from:'2026-04-20', to:'2026-04-21', reason:'Fever and cold',     status:'approved', appliedOn:'Apr 19, 2026' },
  { id:4, name:'Sara Bibi',     role:'teacher', type:'Casual',   from:'2026-04-18', to:'2026-04-18', reason:'Personal work',                       status:'approved', appliedOn:'Apr 17, 2026' },
  { id:5, name:'Usman Khan',    role:'student', class:'Class 5', type:'Medical',  from:'2026-04-15', to:'2026-04-16', reason:'Dental appointment',  status:'rejected', appliedOn:'Apr 14, 2026' },
];

export default function LeavePage() {
  const [leaves, setLeaves] = useState<Leave[]>(INITIAL);
  const [selected, setSelected] = useState<Leave|null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState<'all'|'pending'|'approved'|'rejected'>('all');
  const [form, setForm] = useState({ name:'', role:'teacher' as 'teacher'|'student', type:'Medical', from:'', to:'', reason:'' });

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this leave application permanently?')) {
      setLeaves(prev => prev.filter(l => l.id !== id));
      toast.success('Leave record purged from system');
    }
  };

  const filtered = filter === 'all' ? leaves : leaves.filter(l => l.status === filter);
  const pending  = leaves.filter(l => l.status==='pending').length;
  const approved = leaves.filter(l => l.status==='approved').length;
  const rejected = leaves.filter(l => l.status==='rejected').length;

  const updateStatus = (id: number, status: 'approved'|'rejected') => {
    setLeaves(prev => prev.map(l => l.id===id ? { ...l, status } : l));
    toast.success(`Leave application has been ${status}`);
    setSelected(null);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setLeaves(prev => [{ id: Date.now(), ...form, status:'pending', appliedOn: new Date().toLocaleDateString('en-US',{ month:'short', day:'numeric', year:'numeric'}) }, ...prev]);
    toast.success('Leave request submitted to administrative queue');
    setShowAdd(false);
  };

  const days = (from: string, to: string) => {
    if (!from || !to) return '0 days';
    const d = Math.ceil((new Date(to).getTime() - new Date(from).getTime()) / 86400000) + 1;
    return `${d} ${d === 1 ? 'day' : 'days'}`;
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap: 24 }}>
      <PageHeader title="Leave Administration" sub="Review and adjudicate institutional absence requests for faculty and students">
        <Btn icon={Plus} onClick={()=>setShowAdd(true)}>Initiate Request</Btn>
      </PageHeader>

      {/* Leave Analytics */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
        <StatCard label="Total Applications" value={leaves.length} icon={Calendar} color="#3b82f6" />
        <StatCard label="Awaiting Review"        value={pending}       icon={Clock}    color="#f59e0b" trend={{ type:'up', val: 'Priority' }} />
        <StatCard label="Authorised"       value={approved}      icon={CheckCircle2} color="#22c55e" />
        <StatCard label="Denied"       value={rejected}      icon={AlertCircle}        color="#ef4444" />
      </div>

      {/* Filter Matrix */}
      <div style={{ 
          display:'flex', gap: 10, flexWrap:'wrap',
          padding: '16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0'
      }}>
        {(['all','pending','approved','rejected'] as const).map(f => (
          <button key={f} onClick={()=>setFilter(f)} style={{
            padding:'10px 20px', borderRadius: 12, border:`1px solid ${filter === f ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.1)'}`, cursor:'pointer', fontSize: 13, fontWeight: 700,
            background: filter===f ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.02)',
            color: filter===f ? C.amber : C.sub, transition: 'all 0.2s ease',
            textTransform:'capitalize',
          }}>{f === 'pending' && pending > 0 ? `${f} (${pending})` : f}</button>
        ))}
      </div>

      {/* Absentees Registry Table */}
      <Table headers={['Applicant Details','Leave Category','Validity Period','Duration','Justification','Audit Status','Interaction']}>
        {filtered.length === 0 ? (
          <Tr><Td colSpan={7} style={{ textAlign:'center', padding: 64, color: C.muted }}>No leave applications found in this category.</Td></Tr>
        ) : (
          filtered.map(l => (
            <Tr key={l.id} onClick={()=>setSelected(l)}>
              <Td>
                <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
                  <Avatar name={l.name} size={38} color={l.role==='teacher' ? '#a855f7' : '#3b82f6'} />
                  <div>
                    <p style={{ margin:0, fontSize: 14, fontWeight: 800, color: '#1e293b' }}>{l.name}</p>
                    <p style={{ margin:'1px 0 0', fontSize: 11, color: C.sub, textTransform:'capitalize' }}>{l.role}{l.class ? ` – ${l.class}` : ''}</p>
                  </div>
                </div>
              </Td>
              <Td>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{l.type}</span>
              </Td>
              <Td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.sub, fontSize: 12 }}>
                      <CalendarDays size={14} /> {l.from} – {3}
                  </div>
              </Td>
              <Td>
                <Badge label={days(l.from, l.to)} variant="info" />
              </Td>
              <Td>
                <div style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12, color: C.muted }}>
                    {l.reason}
                </div>
              </Td>
              <Td><Badge label={l.status.toUpperCase()} variant={l.status==='approved'?'success':l.status==='rejected'?'danger':'warning'} /></Td>
              <Td>
                {l.status === 'pending' ? (
                  <div style={{ display:'flex', gap: 6 }} onClick={e=>e.stopPropagation()}>
                    <button onClick={()=>updateStatus(l.id,'approved')} style={{ padding:'8px 12px', borderRadius: 10, border: 'none', background:'rgba(34,197,94,0.1)', color: '#22c55e', fontSize: 12, fontWeight: 800, cursor:'pointer' }} title="Approve">✓</button>
                    <button onClick={()=>updateStatus(l.id,'rejected')} style={{ padding:'8px 12px', borderRadius: 10, border: 'none', background:'rgba(239,68,68,0.1)', color: '#ef4444', fontSize: 12, fontWeight: 800, cursor:'pointer' }} title="Reject">✗</button>
                  </div>
                ) : (
                  <div style={{ display:'flex', gap: 8 }} onClick={e=>e.stopPropagation()}>
                    <button onClick={()=>setSelected(l)} style={{ padding: 8, background: '#f1f5f9', borderRadius: 10, border:'none', cursor:'pointer', color:C.sub }}><Eye size={16}/></button>
                    <button onClick={()=>handleDelete(l.id)} style={{ padding: 8, background: 'rgba(239,68,68,0.1)', borderRadius: 10, border:'none', cursor:'pointer', color: C.red }}><Trash2 size={16}/></button>
                  </div>
                )}
              </Td>
            </Tr>
          ))
        )}
      </Table>

      {/* Case Review Modal */}
      {selected && (
        <Modal title="Leave Application Perspective" onClose={()=>setSelected(null)}>
          <div style={{ display:'flex', flexDirection:'column', gap: 24 }}>
            <div style={{ display:'flex', alignItems:'center', gap: 20, padding:'24px', background: 'linear-gradient(135deg, rgba(59,130,246,0.1), transparent)', borderRadius: 16, border:'1px solid rgba(59,130,246,0.2)' }}>
              <Avatar name={selected.name} size={56} color={selected.role==='teacher'?'#a855f7':'#3b82f6'} />
              <div>
                <p style={{ margin:0, fontSize: 18, fontWeight: 900, color: '#1e293b' }}>{selected.name}</p>
                <p style={{ margin:'4px 0 0', fontSize: 13, color: C.sub, textTransform:'capitalize' }}>{selected.role} · Category: <span style={{ color: '#1e293b' }}>{selected.type} Leave</span></p>
              </div>
              <div style={{ marginLeft:'auto' }}>
                <Badge label={selected.status.toUpperCase()} variant={selected.status==='approved'?'success':selected.status==='rejected'?'danger':'warning'} />
              </div>
            </div>
            
            <div style={{ display:'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                {[
                { label:'Effective From', value:selected.from, icon: Calendar },
                { label:'Effective To', value:selected.to, icon: Calendar },
                { label:'Aggregated Duration', value:days(selected.from, selected.to), icon: CalendarDays },
                { label:'Application Date', value:selected.appliedOn, icon: FileText },
                ].map(f => (
                <div key={f.label} style={{ padding:'14px 18px', background:'rgba(255,255,255,0.02)', borderRadius: 12, border:`1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <f.icon size={18} color={C.muted} />
                    <div>
                        <p style={{ margin:0, fontSize:10, fontWeight: 800, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</p>
                        <p style={{ margin: '2px 0 0', fontSize:14, fontWeight:700, color: '#1e293b' }}>{f.value}</p>
                    </div>
                </div>
                ))}
            </div>

            <div style={{ padding: '20px', background: '#f8fafc', borderRadius: 16, border: `1px solid ${C.border}` }}>
                <p style={{ margin:'0 0 10px', fontSize:11, fontWeight:800, color: C.muted, textTransform:'uppercase', letterSpacing:'0.1em' }}>Justification / Reason</p>
                <p style={{ margin:0, fontSize:15, color: '#1e293b', lineHeight: 1.7 }}>{selected.reason}</p>
            </div>

            {selected.status === 'pending' && (
              <div style={{ display:'flex', gap: 12, marginTop: 8 }}>
                <Btn variant="success" style={{ flex: 1 }} onClick={()=>updateStatus(selected.id,'approved')}>Grant Authorization</Btn>
                <Btn variant="danger" style={{ flex: 1 }} onClick={()=>updateStatus(selected.id,'rejected')}>Deny Authorization</Btn>
              </div>
            )}
            {selected.status !== 'pending' && (
                <Btn variant="secondary" style={{ width: '100% '}} onClick={() => setSelected(null)}>Close Appraisal</Btn>
            )}
          </div>
        </Modal>
      )}

      {/* Initiation Modal */}
      {showAdd && (
        <Modal title="Initiate Leave Protocol" onClose={()=>setShowAdd(false)}>
          <form onSubmit={handleAdd} style={{ display:'flex', flexDirection:'column', gap: 20 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 16 }}>
              <Field label="Applicant Legal Name"><Input value={form.name} onChange={(e:any)=>setForm({...form,name:e.target.value})} placeholder="Enter full name" required /></Field>
              <Field label="Institutional Role"><Select value={form.role} onChange={(e:any)=>setForm({...form,role:e.target.value})}><option value="teacher">Teaching Faculty</option><option value="student">Student Body</option></Select></Field>
              <Field label="Category of Absence"><Select value={form.type} onChange={(e:any)=>setForm({...form,type:e.target.value})}><option>Medical</option><option>Casual</option><option>Personal</option><option>Emergency</option></Select></Field>
              <div />
              <Field label="Commencement Date"><Input type="date" value={form.from} onChange={(e:any)=>setForm({...form,from:e.target.value})} required /></Field>
              <Field label="Conclusion Date"><Input type="date" value={form.to} onChange={(e:any)=>setForm({...form,to:e.target.value})} required /></Field>
            </div>
            <Field label="Professional Justification">
              <textarea 
                value={form.reason} 
                onChange={(e:any)=>setForm({...form,reason:e.target.value})} 
                rows={4} 
                placeholder="State the comprehensive reason for leave request…" 
                style={{ 
                    background:'rgba(255,255,255,0.05)', border:`1px solid rgba(255,255,255,0.1)`, 
                    borderRadius: 12, padding: 12, color: '#1e293b', fontSize: 14, outline:'none', 
                    resize:'none', width:'100%' 
                }} 
                required 
              />
            </Field>
            <div style={{ marginTop: 12 }}>
              <Btn type="submit" icon={Plus} style={{ width: '100%' }}>Submit for Adjudication</Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
