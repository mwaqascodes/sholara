import { DollarSign, AlertTriangle, CheckCircle, Clock, Plus, Receipt, X, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useActionStore, actionStore } from '@/lib/action-store';
import type { FeeRecord } from '@/lib/demo-data';

export default function FeesPage() {
  const { fees, students } = useActionStore();
  const [collectOpen, setCollectOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [activeFee, setActiveFee] = useState<FeeRecord | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | FeeRecord['status']>('all');

  const total = fees.reduce((s, f) => s + f.amount, 0);
  const collected = fees.reduce((s, f) => s + f.paid, 0);
  const pending = total - collected;
  const collectionRate = total > 0 ? Math.round((collected / total) * 100) : 0;

  const filtered = useMemo(() => fees.filter(f => {
    if (statusFilter !== 'all' && f.status !== statusFilter) return false;
    if (search && !f.studentName.toLowerCase().includes(search.toLowerCase()) && !f.class.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [fees, search, statusFilter]);

  const statusConfig = {
    paid: { icon: CheckCircle, cls: 'bg-success/10 text-success border-success/30' },
    pending: { icon: Clock, cls: 'bg-warning/10 text-warning border-warning/30' },
    overdue: { icon: AlertTriangle, cls: 'bg-destructive/10 text-destructive border-destructive/30' },
  };

  const openCollect = (fee?: FeeRecord) => {
    setActiveFee(fee || null);
    setCollectOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Fee Management</h2>
          <p className="text-sm text-white/50 mt-1">Collect payments, track defaulters, and manage fee records</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setAddOpen(true)}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all hover:brightness-110"
            style={{ background: 'rgba(22,163,74,0.12)', border: '1px solid rgba(22,163,74,0.35)', color: '#4ade80' }}
          >
            <Plus className="w-4 h-4" /> Add Fee Record
          </button>
          <button
            onClick={() => openCollect()}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', boxShadow: '0 4px 20px rgba(22,163,74,0.4)' }}
          >
            <Receipt className="w-4 h-4" /> Collect Fee
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Fees', value: `PKR ${total.toLocaleString()}`, color: 'text-white', icon: DollarSign },
          { label: 'Collected', value: `PKR ${collected.toLocaleString()}`, color: 'text-success', icon: CheckCircle },
          { label: 'Pending', value: `PKR ${pending.toLocaleString()}`, color: 'text-destructive', icon: AlertTriangle },
          { label: 'Collection Rate', value: `${collectionRate}%`, color: 'text-warning', icon: Clock },
        ].map(s => (
          <div key={s.label} className="glass-card p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-wider text-white/50 font-semibold">{s.label}</p>
              <s.icon className="w-4 h-4 text-white/30" />
            </div>
            <p className={`text-2xl font-bold font-display ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Defaulters */}
      {fees.filter(f => f.status === 'overdue').length > 0 && (
        <div className="glass-card p-5 border-l-4 border-destructive">
          <h3 className="font-display font-semibold text-destructive mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Fee Defaulters
          </h3>
          <div className="space-y-2">
            {fees.filter(f => f.status === 'overdue').map(f => (
              <div key={f.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-sm font-medium text-white">{f.studentName}</p>
                  <p className="text-xs text-white/50">{f.class} • Due {f.dueDate}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-destructive">PKR {(f.amount - f.paid).toLocaleString()}</span>
                  <button
                    onClick={() => openCollect(f)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
                  >
                    Collect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter bar */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by student name or class..."
            className="w-full pl-10 pr-3 py-2.5 rounded-xl text-sm text-white placeholder:text-white/30 outline-none focus:border-success/50"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as any)}
          className="px-4 py-2.5 rounded-xl text-sm text-white outline-none cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          <option value="all" className="bg-[#0f1e35]">All Status</option>
          <option value="paid" className="bg-[#0f1e35]">Paid</option>
          <option value="pending" className="bg-[#0f1e35]">Pending</option>
          <option value="overdue" className="bg-[#0f1e35]">Overdue</option>
        </select>
      </div>

      {/* Records table */}
      <div className="glass-card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-display font-semibold text-white">Fee Records</h3>
          <span className="text-xs text-white/50">{filtered.length} of {fees.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'rgba(22,163,74,0.08)' }}>
                <th className="text-left text-[11px] uppercase tracking-wider font-bold text-white/55 px-4 py-3">Student</th>
                <th className="text-left text-[11px] uppercase tracking-wider font-bold text-white/55 px-4 py-3">Class</th>
                <th className="text-left text-[11px] uppercase tracking-wider font-bold text-white/55 px-4 py-3">Amount</th>
                <th className="text-left text-[11px] uppercase tracking-wider font-bold text-white/55 px-4 py-3">Paid</th>
                <th className="text-left text-[11px] uppercase tracking-wider font-bold text-white/55 px-4 py-3">Balance</th>
                <th className="text-left text-[11px] uppercase tracking-wider font-bold text-white/55 px-4 py-3">Due</th>
                <th className="text-left text-[11px] uppercase tracking-wider font-bold text-white/55 px-4 py-3">Method</th>
                <th className="text-left text-[11px] uppercase tracking-wider font-bold text-white/55 px-4 py-3">Status</th>
                <th className="text-right text-[11px] uppercase tracking-wider font-bold text-white/55 px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(f => {
                const cfg = statusConfig[f.status];
                const balance = f.amount - f.paid;
                return (
                  <tr key={f.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-white">{f.studentName}</td>
                    <td className="px-4 py-3 text-sm text-white/70">{f.class}</td>
                    <td className="px-4 py-3 text-sm text-white/80">PKR {f.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-success">PKR {f.paid.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm font-medium text-white">PKR {balance.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-white/60">{f.dueDate}</td>
                    <td className="px-4 py-3 text-sm text-white/50">{f.paymentMethod || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 capitalize text-[11px] font-semibold px-2.5 py-1 rounded-full border ${cfg.cls}`}>
                        <cfg.icon className="w-3 h-3" /> {f.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {f.status !== 'paid' && (
                        <button
                          onClick={() => openCollect(f)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                          style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
                        >
                          Collect
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="text-center py-12 text-white/40">No fee records match your filter</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {collectOpen && (
        <CollectFeeModal
          fee={activeFee}
          students={students.map(s => ({ name: s.name, class: s.class }))}
          onClose={() => { setCollectOpen(false); setActiveFee(null); }}
        />
      )}
      {addOpen && (
        <AddFeeRecordModal
          students={students.map(s => ({ name: s.name, class: s.class }))}
          onClose={() => setAddOpen(false)}
        />
      )}
    </div>
  );
}

/* ─────────────────── Collect Fee Modal ─────────────────── */
function CollectFeeModal({ fee, students, onClose }: { fee: FeeRecord | null; students: { name: string; class: string }[]; onClose: () => void }) {
  const [studentName, setStudentName] = useState(fee?.studentName || '');
  const [studentClass, setStudentClass] = useState(fee?.class || '');
  const [amount, setAmount] = useState<number>(fee ? fee.amount - fee.paid : 0);
  const [method, setMethod] = useState(fee?.paymentMethod || 'Cash');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<{ no: string; name: string; cls: string; amount: number; method: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || amount <= 0) return;
    setSubmitting(true);
    actionStore.recordFeePayment({ studentName, amount, method, class: studentClass });
    setReceipt({
      no: `RC-${Date.now().toString().slice(-6)}`,
      name: studentName, cls: studentClass || 'N/A', amount, method,
    });
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-lg rounded-2xl p-7 max-h-[90vh] overflow-y-auto relative" style={{ background: '#0f1e35', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 30px 90px rgba(0,0,0,0.65)' }}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 text-white/60"><X className="w-5 h-5" /></button>

        {!receipt ? (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
                <Receipt className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-white">Collect Fee</h3>
                <p className="text-xs text-white/50">Record a payment from a student</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Student Name *">
                <input
                  list="fees-student-list"
                  value={studentName}
                  onChange={e => {
                    setStudentName(e.target.value);
                    const s = students.find(x => x.name === e.target.value);
                    if (s) setStudentClass(s.class);
                  }}
                  required
                  placeholder="Type or pick a student"
                  className={inputCls}
                />
                <datalist id="fees-student-list">
                  {students.map(s => <option key={s.name} value={s.name}>{s.class}</option>)}
                </datalist>
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Class">
                  <input value={studentClass} onChange={e => setStudentClass(e.target.value)} placeholder="Class 10" className={inputCls} />
                </Field>
                <Field label="Amount (PKR) *">
                  <input type="number" min={1} value={amount || ''} onChange={e => setAmount(Number(e.target.value))} required placeholder="5000" className={inputCls} />
                </Field>
              </div>

              <Field label="Payment Method">
                <div className="grid grid-cols-4 gap-2">
                  {['Cash', 'JazzCash', 'EasyPaisa', 'Bank'].map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMethod(m)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${method === m ? 'text-white' : 'text-white/60'}`}
                      style={method === m
                        ? { background: 'linear-gradient(135deg, #16a34a, #15803d)', border: '1px solid rgba(22,163,74,0.6)' }
                        : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Notes (optional)">
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Any reference or remark..." className={inputCls} />
              </Field>

              {fee && (
                <div className="p-3 rounded-xl text-xs text-white/70" style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)' }}>
                  Outstanding for {fee.studentName}: <span className="font-bold text-white">PKR {(fee.amount - fee.paid).toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white/70 hover:bg-white/5">Cancel</button>
                <button type="submit" disabled={submitting} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', boxShadow: '0 4px 20px rgba(22,163,74,0.4)' }}>
                  {submitting ? 'Processing...' : `Collect PKR ${(amount || 0).toLocaleString()}`}
                </button>
              </div>
            </form>
          </>
        ) : (
          /* Receipt */
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-full flex items-center justify-center bg-success/15 border border-success/40">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-white">Payment Received</h3>
                <p className="text-xs text-white/50">Receipt #{receipt.no}</p>
              </div>
            </div>
            <div className="rounded-xl p-5 space-y-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Row label="Student" value={receipt.name} />
              <Row label="Class" value={receipt.cls} />
              <Row label="Method" value={receipt.method} />
              <Row label="Date" value={new Date().toLocaleDateString('en-GB')} />
              <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                <span className="text-xs uppercase tracking-wider text-white/50 font-semibold">Total Paid</span>
                <span className="font-display text-2xl font-bold text-success">PKR {receipt.amount.toLocaleString()}</span>
              </div>
            </div>
            <p className="text-center text-xs text-white/40 mt-4">Thank you for your payment 🙏</p>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => window.print()} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white/80" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>Print</button>
              <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>Done</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────── Add Fee Record Modal ─────────────────── */
function AddFeeRecordModal({ students, onClose }: { students: { name: string; class: string }[]; onClose: () => void }) {
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || amount <= 0) return;
    actionStore.addFeeRecord({
      studentName, class: studentClass, amount, paid: 0, status: 'pending',
      dueDate: dueDate || new Date().toLocaleDateString('en-GB'),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-md rounded-2xl p-7 relative" style={{ background: '#0f1e35', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 30px 90px rgba(0,0,0,0.65)' }}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 text-white/60"><X className="w-5 h-5" /></button>
        <h3 className="font-display text-xl font-bold text-white mb-5">Add Fee Record</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Student Name *">
            <input
              list="add-fee-student-list"
              value={studentName}
              onChange={e => {
                setStudentName(e.target.value);
                const s = students.find(x => x.name === e.target.value);
                if (s) setStudentClass(s.class);
              }}
              required placeholder="Pick student" className={inputCls}
            />
            <datalist id="add-fee-student-list">
              {students.map(s => <option key={s.name} value={s.name}>{s.class}</option>)}
            </datalist>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Class"><input value={studentClass} onChange={e => setStudentClass(e.target.value)} className={inputCls} placeholder="Class 5" /></Field>
            <Field label="Amount (PKR) *"><input type="number" min={1} value={amount || ''} onChange={e => setAmount(Number(e.target.value))} required className={inputCls} placeholder="5000" /></Field>
          </div>
          <Field label="Due Date"><input type="text" value={dueDate} onChange={e => setDueDate(e.target.value)} className={inputCls} placeholder="DD/MM/YYYY" /></Field>
          <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white/70 hover:bg-white/5">Cancel</button>
            <button type="submit" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', boxShadow: '0 4px 20px rgba(22,163,74,0.4)' }}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────── Helpers ─────────────────── */
const inputCls = 'w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-white/30 outline-none transition-all focus:border-success/60 focus:bg-white/[0.09]';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/55 mb-1.5">{label}</label>
      <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 12 }}>
        {children}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-white/50">{label}</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}
