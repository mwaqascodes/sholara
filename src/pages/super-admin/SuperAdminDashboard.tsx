import { useState } from 'react';
import { School, Users, CreditCard, TrendingUp, CheckCircle, XCircle, Clock, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { C, PageHeader, StatCard, Badge, Btn, Table, Tr, Td, Modal, Field, Input, Select } from '@/lib/design-system';

interface SchoolRecord {
  id: string;
  name: string;
  city: string;
  principal: string;
  students: number;
  teachers: number;
  plan: 'trial' | 'basic' | 'standard' | 'premium';
  status: 'active' | 'expired' | 'suspended';
  joinDate: string;
  monthlyRevenue: number;
}

const DEMO_SCHOOLS: SchoolRecord[] = [
  { id: 's1', name: 'Islamia Public School', city: 'Mirpur AJK', principal: 'Prof. Zahid Ahmed', students: 450, teachers: 22, plan: 'premium', status: 'active', joinDate: '2024-01-15', monthlyRevenue: 10000 },
  { id: 's2', name: 'Al-Noor Academy', city: 'Lahore', principal: 'Mrs. Fatima Siddiqui', students: 280, teachers: 14, plan: 'standard', status: 'active', joinDate: '2024-03-20', monthlyRevenue: 5000 },
  { id: 's3', name: 'Beacon House School', city: 'Karachi', principal: 'Dr. Imran Khan', students: 620, teachers: 35, plan: 'premium', status: 'active', joinDate: '2023-09-01', monthlyRevenue: 10000 },
  { id: 's4', name: 'Roots International', city: 'Islamabad', principal: 'Mr. Asad Mehmood', students: 190, teachers: 11, plan: 'basic', status: 'active', joinDate: '2024-06-10', monthlyRevenue: 2000 },
  { id: 's5', name: 'City Model School', city: 'Rawalpindi', principal: 'Ms. Nadia Iqbal', students: 95, teachers: 8, plan: 'trial', status: 'active', joinDate: '2024-12-01', monthlyRevenue: 0 },
  { id: 's6', name: 'Bright Future School', city: 'Faisalabad', principal: 'Mr. Tariq Mahmood', students: 320, teachers: 18, plan: 'standard', status: 'expired', joinDate: '2023-11-15', monthlyRevenue: 0 },
];

const PLAN_COLORS: Record<string, 'success'|'info'|'warning'|'danger'|'default'> = {
  premium: 'success', standard: 'info', basic: 'warning', trial: 'default',
};

const STATUS_COLORS: Record<string, 'success'|'danger'|'warning'|'default'> = {
  active: 'success', expired: 'danger', suspended: 'warning',
};

export default function SuperAdminDashboard() {
  const [schools] = useState<SchoolRecord[]>(DEMO_SCHOOLS);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', city: '', principal: '', plan: 'trial' as const });

  const filtered = schools.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.city.toLowerCase().includes(search.toLowerCase())
  );

  const totalStudents = schools.reduce((a, s) => a + s.students, 0);
  const totalTeachers = schools.reduce((a, s) => a + s.teachers, 0);
  const monthlyRevenue = schools.reduce((a, s) => a + s.monthlyRevenue, 0);
  const activeSchools = schools.filter(s => s.status === 'active').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader title="Super Admin Overview" sub="Manage all schools, subscriptions, and platform health">
        <Btn icon={Plus} onClick={() => setShowAdd(true)}>Add New School</Btn>
      </PageHeader>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <StatCard label="Total Schools"    value={schools.length}                      icon={School}    color="#3b82f6" trend={{ type: 'up', val: '+2 this month' }} />
        <StatCard label="Active Schools"   value={activeSchools}                       icon={CheckCircle} color="#10b981" />
        <StatCard label="Total Students"   value={totalStudents.toLocaleString()}       icon={Users}     color="#8b5cf6" trend={{ type: 'up', val: '+120 this month' }} />
        <StatCard label="Monthly Revenue"  value={`₨ ${(monthlyRevenue/1000).toFixed(0)}k`} icon={CreditCard} color="#f59e0b" trend={{ type: 'up', val: '+15%' }} />
      </div>

      {/* Plan Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        {(['premium', 'standard', 'basic', 'trial'] as const).map(plan => {
          const count = schools.filter(s => s.plan === plan).length;
          const revenue = schools.filter(s => s.plan === plan).reduce((a, s) => a + s.monthlyRevenue, 0);
          const colors = { premium: '#10b981', standard: '#3b82f6', basic: '#f59e0b', trial: '#94a3b8' };
          return (
            <div key={plan} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, borderTop: `3px solid ${colors[plan]}` }}>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 800, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{plan} Plan</p>
              <p style={{ margin: '8px 0 4px', fontSize: 24, fontWeight: 900, color: C.txt }}>{count}</p>
              <p style={{ margin: 0, fontSize: 11, color: C.sub }}>₨ {(revenue / 1000).toFixed(0)}k/mo</p>
            </div>
          );
        })}
      </div>

      {/* Schools Table */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: C.txt }}>All Schools</h3>
          <div style={{ flex: 1 }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search schools..."
            style={{ padding: '8px 14px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 13, width: 220, outline: 'none', color: C.txt }}
          />
        </div>
        <Table headers={['School', 'City / Principal', 'Students', 'Teachers', 'Plan', 'Status', 'Revenue', 'Actions']}>
          {filtered.map(s => (
            <Tr key={s.id}>
              <Td>
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.txt }}>{s.name}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: C.sub }}>Since {s.joinDate}</p>
                </div>
              </Td>
              <Td>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.txt }}>{s.city}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: C.sub }}>{s.principal}</p>
                </div>
              </Td>
              <Td style={{ fontWeight: 700, color: C.txt }}>{s.students}</Td>
              <Td style={{ fontWeight: 700, color: C.txt }}>{s.teachers}</Td>
              <Td><Badge label={s.plan.toUpperCase()} variant={PLAN_COLORS[s.plan]} /></Td>
              <Td><Badge label={s.status} variant={STATUS_COLORS[s.status]} /></Td>
              <Td style={{ fontWeight: 700, color: '#1e293b' }}>
                {s.monthlyRevenue > 0 ? `₨ ${(s.monthlyRevenue/1000).toFixed(0)}k` : '—'}
              </Td>
              <Td>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => toast.info(`Viewing ${s.name}`)} style={{ padding: 7, background: '#f1f5f9', borderRadius: 8, border: '1px solid #e2e8f0', cursor: 'pointer', color: C.sub }}><Eye size={14} /></button>
                  <button onClick={() => toast.info(`Edit subscription for ${s.name}`)} style={{ padding: 7, background: '#eff6ff', borderRadius: 8, border: '1px solid #bfdbfe', cursor: 'pointer', color: '#3b82f6' }}><CreditCard size={14} /></button>
                  <button onClick={() => toast.error(`Suspend ${s.name}?`)} style={{ padding: 7, background: '#fef2f2', borderRadius: 8, border: '1px solid #fecaca', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={14} /></button>
                </div>
              </Td>
            </Tr>
          ))}
        </Table>
      </div>

      {/* Add School Modal */}
      {showAdd && (
        <Modal title="Register New School" onClose={() => setShowAdd(false)} width={520}>
          <form onSubmit={e => { e.preventDefault(); toast.success(`${form.name} registered successfully!`); setShowAdd(false); }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Field label="School Name"><Input value={form.name} onChange={(e: any) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Al-Noor Academy" required /></Field>
            <Field label="City"><Input value={form.city} onChange={(e: any) => setForm({ ...form, city: e.target.value })} placeholder="e.g. Lahore" required /></Field>
            <Field label="Principal Name"><Input value={form.principal} onChange={(e: any) => setForm({ ...form, principal: e.target.value })} placeholder="e.g. Dr. Ahmed Khan" required /></Field>
            <Field label="Initial Plan">
              <Select value={form.plan} onChange={(e: any) => setForm({ ...form, plan: e.target.value })}>
                <option value="trial">14-Day Free Trial</option>
                <option value="basic">Basic — ₨2,000/mo</option>
                <option value="standard">Standard — ₨5,000/mo</option>
                <option value="premium">Premium — ₨10,000/mo</option>
              </Select>
            </Field>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8 }}>
              <Btn variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Btn>
              <Btn type="submit">Register School</Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
