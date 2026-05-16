import { useState } from 'react';
import { Printer, Plus, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useStudents } from '@/lib/store';
import { useSchool } from '@/lib/school-context';
import { C, PageHeader, StatCard, Badge, Btn, Table, Tr, Td, Modal, Field, Input, Select } from '@/lib/design-system';

interface Invoice {
  id: string;
  invoiceNo: string;
  studentName: string;
  studentId: string;
  className: string;
  month: string;
  feeType: 'monthly' | 'term' | 'admission' | 'other';
  amount: number;
  paidAmount: number;
  status: 'paid' | 'pending' | 'partial' | 'overdue';
  dueDate: string;
  paidDate?: string;
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
}

const INVOICES_KEY = 'Scholara_invoices_v1';
const MONTHS = ['January 2026','February 2026','March 2026','April 2026','May 2026','June 2026','July 2026','August 2026','September 2026','October 2026','November 2026','December 2026'];
const FEE_TYPES = { monthly: 'Monthly Fee', term: 'Term Fee', admission: 'Admission Fee', other: 'Other' };

function loadInvoices(): Invoice[] {
  try { const raw = localStorage.getItem(INVOICES_KEY); if (raw) return JSON.parse(raw); } catch {}
  return [
    { id: 'i1', invoiceNo: 'INV-2026-001', studentName: 'Ahmed Ali', studentId: '', className: 'Class 9', month: 'April 2026', feeType: 'monthly', amount: 3500, paidAmount: 3500, status: 'paid', dueDate: '2026-04-10', paidDate: '2026-04-08', paymentMethod: 'cash', createdAt: '2026-04-01' },
    { id: 'i2', invoiceNo: 'INV-2026-002', studentName: 'Fatima Malik', studentId: '', className: 'Class 7', month: 'April 2026', feeType: 'monthly', amount: 3000, paidAmount: 0, status: 'pending', dueDate: '2026-04-10', createdAt: '2026-04-01' },
    { id: 'i3', invoiceNo: 'INV-2026-003', studentName: 'Umar Farooq', studentId: '', className: 'Class 5', month: 'April 2026', feeType: 'monthly', amount: 2500, paidAmount: 1500, status: 'partial', dueDate: '2026-04-10', createdAt: '2026-04-01' },
    { id: 'i4', invoiceNo: 'INV-2026-004', studentName: 'Sara Khan', studentId: '', className: 'Class 8', month: 'March 2026', feeType: 'monthly', amount: 3000, paidAmount: 0, status: 'overdue', dueDate: '2026-03-10', createdAt: '2026-03-01' },
  ];
}
function saveInvoices(data: Invoice[]) { localStorage.setItem(INVOICES_KEY, JSON.stringify(data)); }

const STATUS_VARIANT: Record<string, 'success'|'danger'|'warning'|'info'> = {
  paid: 'success', overdue: 'danger', partial: 'warning', pending: 'info',
};

export default function FeeInvoicesPage() {
  const students = useStudents();
  const { settings } = useSchool();
  const [invoices, setInvoices] = useState<Invoice[]>(loadInvoices);
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({
    studentId: '', month: 'April 2026', feeType: 'monthly' as Invoice['feeType'],
    amount: 3000, paymentMethod: 'cash', notes: '',
  });

  const filtered = filter === 'all' ? invoices : invoices.filter(i => i.status === filter);
  const totalCollected = invoices.filter(i => i.status === 'paid').reduce((a, i) => a + i.amount, 0);
  const totalPending = invoices.filter(i => i.status !== 'paid').reduce((a, i) => a + (i.amount - i.paidAmount), 0);
  const totalOverdue = invoices.filter(i => i.status === 'overdue').length;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === form.studentId);
    if (!student) { toast.error('Select a student'); return; }
    const num = invoices.length + 1;
    const newInv: Invoice = {
      id: `i${Date.now()}`,
      invoiceNo: `INV-2026-${String(num).padStart(3, '0')}`,
      studentName: student.name,
      studentId: student.id,
      className: student.class,
      month: form.month,
      feeType: form.feeType,
      amount: form.amount,
      paidAmount: form.amount,
      status: 'paid',
      dueDate: new Date().toISOString().split('T')[0],
      paidDate: new Date().toISOString().split('T')[0],
      paymentMethod: form.paymentMethod,
      notes: form.notes,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newInv, ...invoices];
    setInvoices(updated);
    saveInvoices(updated);
    toast.success(`Invoice ${newInv.invoiceNo} created!`);
    setShowCreate(false);
  };

  const handlePrint = (inv: Invoice) => {
    const schoolName = settings?.name || 'Scholara Academy';
    const html = `<!DOCTYPE html><html><head><title>Fee Invoice ${inv.invoiceNo}</title>
<style>
  body{font-family:Arial,sans-serif;margin:0;padding:30px;background:#fff;color:#1e293b;}
  .header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #1e293b;padding-bottom:16px;margin-bottom:20px;}
  .school-name{font-size:20px;font-weight:900;text-transform:uppercase;letter-spacing:1px;}
  .invoice-badge{background:#1e293b;color:#fff;padding:8px 16px;border-radius:8px;font-size:14px;font-weight:700;}
  .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px;}
  .info-box{background:#f8fafc;border-radius:8px;padding:14px;border:1px solid #e2e8f0;}
  .info-label{font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;}
  .info-value{font-size:14px;font-weight:700;color:#1e293b;margin-top:4px;}
  .amount-box{background:#f0fdf4;border:2px solid #10b981;border-radius:12px;padding:20px;text-align:center;margin-bottom:20px;}
  .amount-label{font-size:12px;color:#64748b;font-weight:700;text-transform:uppercase;}
  .amount-value{font-size:36px;font-weight:900;color:#10b981;margin-top:4px;}
  .status-badge{display:inline-block;background:#10b981;color:#fff;padding:6px 16px;border-radius:20px;font-size:14px;font-weight:800;text-transform:uppercase;}
  .footer{text-align:center;margin-top:32px;padding-top:16px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;}
  @media print{@page{size:A5;margin:10mm}}
</style></head><body>
<div class="header">
  <div>
    <div class="school-name">${schoolName}</div>
    <div style="font-size:12px;color:#64748b;margin-top:4px;">Official Fee Receipt</div>
  </div>
  <div class="invoice-badge">INVOICE<br>${inv.invoiceNo}</div>
</div>
<div class="info-grid">
  <div class="info-box"><div class="info-label">Student Name</div><div class="info-value">${inv.studentName}</div></div>
  <div class="info-box"><div class="info-label">Class</div><div class="info-value">${inv.className}</div></div>
  <div class="info-box"><div class="info-label">Fee Month</div><div class="info-value">${inv.month}</div></div>
  <div class="info-box"><div class="info-label">Fee Type</div><div class="info-value">${FEE_TYPES[inv.feeType]}</div></div>
  <div class="info-box"><div class="info-label">Payment Method</div><div class="info-value">${inv.paymentMethod || '—'}</div></div>
  <div class="info-box"><div class="info-label">Payment Date</div><div class="info-value">${inv.paidDate || '—'}</div></div>
</div>
<div class="amount-box">
  <div class="amount-label">Amount Paid</div>
  <div class="amount-value">₨ ${inv.paidAmount.toLocaleString()}</div>
  <div style="margin-top:8px;"><span class="status-badge">PAID</span></div>
</div>
${inv.notes ? `<p style="font-size:13px;color:#64748b;"><strong>Notes:</strong> ${inv.notes}</p>` : ''}
<div class="footer">This is a computer-generated receipt. No signature required.<br>Thank you for your payment. — ${schoolName}</div>
</body></html>`;
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;border:none;';
    document.body.appendChild(iframe);
    iframe.contentDocument!.open();
    iframe.contentDocument!.write(html);
    iframe.contentDocument!.close();
    setTimeout(() => { iframe.contentWindow!.print(); setTimeout(() => document.body.removeChild(iframe), 2000); }, 500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader title="Fee Invoices & Receipts" sub="Manage and print fee payment records">
        <Btn icon={Plus} onClick={() => setShowCreate(true)}>Create Invoice</Btn>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <StatCard label="Total Invoices"  value={invoices.length}              icon={FileText}    color="#3b82f6" />
        <StatCard label="Collected"       value={`₨ ${(totalCollected/1000).toFixed(0)}k`} icon={CheckCircle} color="#10b981" />
        <StatCard label="Pending"         value={`₨ ${(totalPending/1000).toFixed(0)}k`}   icon={Clock}       color="#f59e0b" />
        <StatCard label="Overdue"         value={totalOverdue}                 icon={XCircle}    color="#ef4444" />
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8 }}>
        {['all','paid','pending','partial','overdue'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '8px 18px', borderRadius: 10, border: `1px solid ${filter===f ? '#f59e0b' : '#e2e8f0'}`,
            background: filter===f ? '#fffbeb' : '#fff', color: filter===f ? '#d97706' : C.sub,
            fontSize: 12, fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize',
          }}>{f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}</button>
        ))}
      </div>

      <Table headers={['Invoice No', 'Student', 'Month / Type', 'Amount', 'Paid', 'Status', 'Actions']}>
        {filtered.map(inv => (
          <Tr key={inv.id}>
            <Td style={{ fontWeight: 700, color: '#3b82f6', fontFamily: 'monospace' }}>{inv.invoiceNo}</Td>
            <Td>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: C.txt }}>{inv.studentName}</p>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: C.sub }}>{inv.className}</p>
              </div>
            </Td>
            <Td>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.txt }}>{inv.month}</p>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: C.sub }}>{FEE_TYPES[inv.feeType]}</p>
              </div>
            </Td>
            <Td style={{ fontWeight: 700, color: C.txt }}>₨ {inv.amount.toLocaleString()}</Td>
            <Td style={{ fontWeight: 700, color: inv.status === 'paid' ? '#10b981' : '#f59e0b' }}>₨ {inv.paidAmount.toLocaleString()}</Td>
            <Td><Badge label={inv.status.toUpperCase()} variant={STATUS_VARIANT[inv.status]} /></Td>
            <Td>
              <button onClick={() => handlePrint(inv)} style={{ padding: '7px 12px', background: '#eff6ff', borderRadius: 8, border: '1px solid #bfdbfe', cursor: 'pointer', color: '#3b82f6', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Printer size={13} /> Print
              </button>
            </Td>
          </Tr>
        ))}
      </Table>

      {showCreate && (
        <Modal title="Create Fee Invoice" onClose={() => setShowCreate(false)} width={520}>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Field label="Student">
              <Select value={form.studentId} onChange={(e: any) => setForm({ ...form, studentId: e.target.value })}>
                <option value="">— Select Student —</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.class})</option>)}
              </Select>
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Month">
                <Select value={form.month} onChange={(e: any) => setForm({ ...form, month: e.target.value })}>
                  {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                </Select>
              </Field>
              <Field label="Fee Type">
                <Select value={form.feeType} onChange={(e: any) => setForm({ ...form, feeType: e.target.value })}>
                  {Object.entries(FEE_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </Select>
              </Field>
              <Field label="Amount (₨)"><Input type="number" value={form.amount} onChange={(e: any) => setForm({ ...form, amount: Number(e.target.value) })} /></Field>
              <Field label="Payment Method">
                <Select value={form.paymentMethod} onChange={(e: any) => setForm({ ...form, paymentMethod: e.target.value })}>
                  {['cash','jazzcash','easypaisa','bank'].map(m => <option key={m} value={m}>{m.charAt(0).toUpperCase()+m.slice(1)}</option>)}
                </Select>
              </Field>
            </div>
            <Field label="Notes (optional)"><Input value={form.notes} onChange={(e: any) => setForm({ ...form, notes: e.target.value })} placeholder="Any notes..." /></Field>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8 }}>
              <Btn variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Btn>
              <Btn type="submit" icon={FileText}>Create Invoice</Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
