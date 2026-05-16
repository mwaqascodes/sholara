import { useState } from 'react';
import { DollarSign, CheckCircle, CheckCircle2, Clock, AlertTriangle, Plus, Download, CreditCard, Receipt, Trash2, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useFees, addFee, deleteFee, updateFee } from '@/lib/store';
import type { FeeRecord } from '@/lib/demo-data';
import { C, PageHeader, StatCard, SearchBar, Badge, Btn, Table, Tr, Td, Modal, Field, Input, Select, Avatar } from '@/lib/design-system';

type FeeStatus = FeeRecord['status']; // 'paid' | 'pending' | 'overdue'

const STATUS_LABELS: Record<FeeStatus, string> = {
  paid: 'PAID',
  pending: 'PARTIAL',
  overdue: 'UNPAID',
};

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function deriveStatus(amount: number, paid: number): FeeStatus {
  if (paid >= amount) return 'paid';
  if (paid > 0) return 'pending';
  return 'overdue';
}

export default function FeesPage() {
  const fees = useFees();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all'|FeeStatus>('all');
  const [selected, setSelected] = useState<FeeRecord|null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ studentName:'', class:'Class 1', amount:5000, month:'April', paid:0 });

  const filtered = fees.filter(f => {
    const ms = f.studentName.toLowerCase().includes(search.toLowerCase()) || f.class.toLowerCase().includes(search.toLowerCase());
    const mst = statusFilter === 'all' || f.status === statusFilter;
    return ms && mst;
  });

  const totalAmount  = fees.reduce((s,f) => s + f.amount, 0);
  const totalPaid    = fees.reduce((s,f) => s + f.paid, 0);
  const totalPending = totalAmount - totalPaid;
  const unpaidCount  = fees.filter(f => f.status==='overdue').length;

  const handleCollect = (id: string, amt: number) => {
    const fee = fees.find(f => f.id === id);
    if (!fee) return;
    const newPaid = Math.min(fee.paid + amt, fee.amount);
    updateFee(id, { paid: newPaid, status: deriveStatus(fee.amount, newPaid) });
    toast.success(`Payment recorded: PKR ${amt.toLocaleString()} credited.`);
    setSelected(null);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentName.trim()) { toast.error('Student name is required'); return; }
    addFee({
      studentName: form.studentName,
      class: form.class,
      month: form.month,
      amount: form.amount,
      paid: form.paid,
      status: deriveStatus(form.amount, form.paid),
      dueDate: '2026-05-31',
    });
    toast.success('New fee record added.');
    setShowAdd(false);
    setForm({ studentName:'', class:'Class 1', amount:5000, month:'April', paid:0 });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Permanently delete this fee record? This cannot be undone.')) {
      deleteFee(id);
      toast.success('Fee record deleted');
    }
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap: 24 }}>
      <PageHeader title="Financial Ledger" sub="Audit and manage student tuition collections for the current fiscal session">
        <div style={{ display: 'flex', gap: 10 }}>
            <Btn icon={Download} variant="secondary" onClick={() => toast.success("Compiling financial report...")}>Bank Export</Btn>
            <Btn icon={Plus} onClick={()=>setShowAdd(true)}>Direct Entry</Btn>
        </div>
      </PageHeader>

      {/* Financial Analytics Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
        <StatCard label="Institutional Revenue" value={`PKR ${(totalAmount/100000).toFixed(1)}L`} icon={DollarSign} color="#3b82f6" trend={{ type:'up', val:'+8% YoY' }} />
        <StatCard label="Secured Collections" value={`PKR ${(totalPaid/100000).toFixed(1)}L`} icon={CheckCircle} color="#22c55e" />
        <StatCard label="Outstanding Dues" value={`PKR ${(totalPending/100000).toFixed(1)}L`} icon={AlertTriangle} color="#ef4444" />
        <StatCard label="Defaulter Velocity" value={unpaidCount} icon={Clock} color="#f59e0b" sub="Action required" />
      </div>

      {/* Dynamic Collection Progress */}
      <div style={{ ...C.glass, padding:'24px', background: '#f8fafc' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <p style={{ margin:0, fontSize:16, fontWeight:900, color:'#fff' }}>Capital Recovery Progress</p>
            <p style={{ margin:0, fontSize:12, color: C.sub }}>Tracking monthly tuition realization vs institutional target</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: 24, fontWeight: 900, color: '#22c55e' }}>{Math.round((totalPaid/totalAmount)*100)}%</span>
            <p style={{ margin: 0, fontSize: 10, fontWeight: 800, color: C.sub, textTransform: 'uppercase' }}>Consolidated</p>
          </div>
        </div>
        <div style={{ height:12, borderRadius: 20, background:'rgba(255,255,255,0.05)', overflow:'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ 
              height:'100%', width:`${(totalPaid/totalAmount)*100}%`, 
              background:'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)', 
              borderRadius: 20, transition:'width 1s cubic-bezier(0.4, 0, 0.2, 1)' 
          }} />
        </div>
      </div>

      {/* Ledger Controls */}
      <div style={{ 
          display:'flex', gap: 12, flexWrap:'wrap', alignItems:'center',
          padding: '16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0'
      }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Filter by student, roll no or class..." width={320} />
        
        <div style={{ display: 'flex', gap: 8 }}>
            {(['all','paid','pending','overdue'] as const).map(s => (
            <button key={s} onClick={()=>setStatusFilter(s)} style={{
                padding:'8px 16px', borderRadius: 12, border:`1px solid ${statusFilter === s ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.1)'}`, cursor:'pointer', fontSize: 12, fontWeight: 700,
                background: statusFilter===s ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.02)',
                color: statusFilter===s ? C.amber : C.sub, transition: 'all 0.2s',
                textTransform:'capitalize',
            }}>{s === 'all' ? 'All' : s === 'pending' ? 'Partial' : s === 'overdue' ? 'Unpaid' : 'Paid'}</button>
            ))}
        </div>
        
        <div style={{ marginLeft:'auto' }}>
           <Badge label={`${filtered.length} Ledger Items`} variant="info" />
        </div>
      </div>

      {/* Ledger Table */}
      <Table headers={['Student Identity','Academic Unit','Billing Month','Liability','Liquidity','Residue','Audit Status','Interaction']}>
        {filtered.length === 0 ? (
          <Tr><Td colSpan={8} style={{ textAlign:'center', padding: 64, color: C.muted }}>Financial registry is clear for the selected parameters.</Td></Tr>
        ) : (
          filtered.map(f => (
            <Tr key={f.id} onClick={() => setSelected(f)}>
              <Td>
                <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
                  <Avatar name={f.studentName} size={36} color="#3b82f6" />
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#1e293b' }}>{f.studentName}</span>
                </div>
              </Td>
              <Td style={{ color: C.sub, fontWeight: 600 }}>{f.class}</Td>
              <Td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.sub }}>
                      <Calendar size={12} /> {f.month || '—'}
                  </div>
              </Td>
              <Td style={{ fontWeight: 800, color: '#1e293b' }}>PKR {f.amount.toLocaleString()}</Td>
              <Td style={{ color: '#22c55e', fontWeight: 700 }}>PKR {f.paid.toLocaleString()}</Td>
              <Td style={{ color: f.amount-f.paid > 0 ? '#ef4444' : C.sub, fontWeight: 800 }}>
                PKR {(f.amount-f.paid).toLocaleString()}
              </Td>
              <Td><Badge label={STATUS_LABELS[f.status]} variant={f.status==='paid'?'success':f.status==='pending'?'warning':'danger'} /></Td>
              <Td>
                <div style={{ display: 'flex', gap: 6 }}>
                    <button
                        onClick={e => { e.stopPropagation(); setSelected(f); }}
                        style={{ 
                            background: f.status === 'paid' ? 'rgba(255,255,255,0.05)' : 'rgba(245,158,11,0.1)', 
                            border:`1px solid ${f.status === 'paid' ? 'rgba(255,255,255,0.1)' : 'rgba(245,158,11,0.2)'}`, 
                            borderRadius: 10, padding:'6px 14px', color: f.status === 'paid' ? C.sub : C.amber, 
                            fontSize: 11, fontWeight: 800, cursor:'pointer', transition: 'all 0.2s'
                        }}
                    >{f.status==='paid' ? 'Review' : 'Process'}</button>
                    <button onClick={e => { e.stopPropagation(); handleDelete(f.id); }} style={{ padding: 8, background: 'rgba(239,68,68,0.1)', borderRadius: 10, border: 'none', cursor: 'pointer', color: C.red }}><Trash2 size={14}/></button>
                </div>
              </Td>
            </Tr>
          ))
        )}
      </Table>

      {/* Transaction Portal Modal */}
      {selected && (
        <Modal title="Financial Instrument Processing" onClose={() => setSelected(null)}>
          <div style={{ display:'flex', flexDirection:'column', gap: 24 }}>
            <div style={{ display:'flex', alignItems:'center', gap: 20, padding:'24px', background: 'linear-gradient(135deg, rgba(59,130,246,0.1), transparent)', borderRadius: 16, border:'1px solid rgba(59,130,246,0.2)' }}>
              <Avatar name={selected.studentName} size={56} color="#3b82f6" />
              <div>
                <p style={{ margin:0, fontSize: 18, fontWeight: 900, color: '#1e293b' }}>{selected.studentName}</p>
                <p style={{ margin:0, fontSize: 13, color: C.sub }}>{selected.class} · Billing Cycle: {selected.month || '—'} 2026</p>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <Badge label={STATUS_LABELS[selected.status]} variant={selected.status==='paid'?'success':selected.status==='pending'?'warning':'danger'} /></div>
            </div>
            
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 16 }}>
              <div style={{ padding:'20px', background:'rgba(255,255,255,0.02)', borderRadius: 16, border:`1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <p style={{ margin:0, fontSize:10, fontWeight:900, color:C.muted, textTransform:'uppercase', letterSpacing:'0.1em' }}>Total Commitment</p>
                <p style={{ margin:0, fontSize:22, fontWeight:900, color:'#fff' }}>PKR {selected.amount.toLocaleString()}</p>
              </div>
              <div style={{ padding:'20px', background:'rgba(34,197,94,0.05)', borderRadius: 16, border:'1px solid rgba(34,197,94,0.1)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <p style={{ margin:0, fontSize:10, fontWeight:900, color:C.muted, textTransform:'uppercase', letterSpacing:'0.1em' }}>Equity Realized</p>
                <p style={{ margin:0, fontSize:22, fontWeight:900, color:'#22c55e' }}>PKR {selected.paid.toLocaleString()}</p>
              </div>
            </div>

            {selected.status !== 'paid' && (
              <div style={{ display:'flex', flexDirection: 'column', gap: 12 }}>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: C.sub, textTransform: 'uppercase' }}>Inject Liquidity</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                    {[selected.amount - selected.paid, 2500, 1000].filter((v,i,a)=>a.indexOf(v)===i && v>0).map(amt => (
                    <button key={amt} onClick={() => handleCollect(selected.id, amt)} style={{
                        padding: '16px 10px', borderRadius: 12, border: `1px solid ${C.amberBd}`,
                        background: 'rgba(245,158,11,0.05)', color: C.amber, fontSize: 13, fontWeight: 900, cursor:'pointer',
                        transition: 'all 0.2s'
                    }}>
                        PKR {amt.toLocaleString()}
                    </button>
                    ))}
                </div>
              </div>
            )}
            
            {selected.status === 'paid' && (
              <div style={{ textAlign:'center', padding:'24px', background: 'rgba(34,197,94,0.05)', borderRadius: 16, border:`1px solid rgba(34,197,94,0.1)`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={24} color="#22c55e" />
                </div>
                <div>
                    <p style={{ margin:0, fontSize:16, fontWeight:900, color: '#22c55e' }}>Account Cleared</p>
                    <p style={{ margin:0, fontSize: 12, color: C.sub }}>No outstanding liabilities for this cycle.</p>
                </div>
                <div style={{ width: '100%', height: 1, background: '#f1f5f9', margin: '8px 0' }} />
                <Btn variant="secondary" icon={Receipt} style={{ width: '100%' }} onClick={() => toast.success("Generating digital invoice...")}>Dispatch Receipt</Btn>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Entry Modal */}
      {showAdd && (
        <Modal title="Establish New Fee Record" onClose={()=>setShowAdd(false)}>
          <form onSubmit={handleAdd} style={{ display:'flex', flexDirection:'column', gap: 20 }}>
            <Field label="Target Student"><Input value={form.studentName} onChange={(e:any)=>setForm({...form,studentName:e.target.value})} placeholder="Search student ledger..." required /></Field>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 16 }}>
              <Field label="Academic Unit"><Select value={form.class} onChange={(e:any)=>setForm({...form,class:e.target.value})}>{['Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8','Class 9','Class 10'].map(c=><option key={c}>{c}</option>)}</Select></Field>
              <Field label="Billing Cycle"><Select value={form.month} onChange={(e:any)=>setForm({...form,month:e.target.value})}>{MONTHS.map(m=><option key={m}>{m}</option>)}</Select></Field>
              <Field label="Total Commitment (PKR)"><Input type="number" value={form.amount} onChange={(e:any)=>setForm({...form,amount:Number(e.target.value)})} placeholder="5000" /></Field>
              <Field label="Initial Liquidity (PKR)"><Input type="number" value={form.paid} onChange={(e:any)=>setForm({...form,paid:Number(e.target.value)})} placeholder="0" /></Field>
            </div>
            <div style={{ marginTop: 12 }}>
              <Btn type="submit" icon={CreditCard} style={{ width: '100%' }}>Establish Ledger Item</Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
