import { useState } from 'react';
import { UserCheck, Plus, Trash2, Eye, Download, Briefcase, GraduationCap, Phone, Mail, Calendar, ShieldCheck, Award, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { useTeachers, addTeacher, deleteTeacher, type StoreTeacher } from '@/lib/store';
import { C, PageHeader, StatCard, SearchBar, Badge, Btn, Table, Tr, Td, Modal, Field, Input, Select, Avatar } from '@/lib/design-system';

const SUBJECTS = ['Mathematics','English','Urdu','Science','Social Studies','Islamiyat','Physics','Chemistry','Biology','Computer Science','History','Geography','Arabic','Art & Craft','Physical Education'];

export default function TeachersPage() {
  const teachers = useTeachers();
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<StoreTeacher | null>(null);

  const filtered = teachers.filter(t => {
    const ms = t.name.toLowerCase().includes(search.toLowerCase()) ||
               t.subject.toLowerCase().includes(search.toLowerCase()) ||
               (t.email || '').toLowerCase().includes(search.toLowerCase());
    const ms2 = subjectFilter === 'all' || t.subject === subjectFilter;
    return ms && ms2;
  });

  const active    = teachers.filter(t => t.status === 'active').length;
  const totalPay  = teachers.reduce((s, t) => s + (t.salary || 0), 0);
  const avgSalary = teachers.length ? Math.round(totalPay / teachers.length) : 0;

  const [form, setForm] = useState({
    name: '', email: '', phone: '', subject: 'Mathematics',
    qualification: 'B.Ed', salary: 35000, joinDate: '', gender: 'Male' as const,
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Please enter teacher name'); return; }
    addTeacher({
      ...form,
      subjects: [form.subject],
      status: 'active',
      avatar: form.gender === 'Female' ? '👩‍🏫' : '👨‍🏫',
      classes: [],
      schoolId: 'demo-school',
      cnic: '',
      joiningDate: form.joinDate || new Date().toLocaleDateString('en-GB'),
      address: '—',
    });
    toast.success(`${form.name} added to the faculty!`);
    setShowAdd(false);
    setForm({ name: '', email: '', phone: '', subject: 'Mathematics', qualification: 'B.Ed', salary: 35000, joinDate: '', gender: 'Male' });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Remove this faculty member permanently?')) return;
    deleteTeacher(id);
    toast.success('Faculty record removed');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader title="Faculty Directory" sub={`${teachers.length} professional educators · ${active} active`}>
        <div style={{ display: 'flex', gap: 10 }}>
          <Btn icon={Download} variant="secondary" onClick={() => toast.success('Exporting staff directory...')}>Export CSV</Btn>
          <Btn icon={Plus} onClick={() => setShowAdd(true)}>Add Faculty</Btn>
        </div>
      </PageHeader>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px, 1fr))', gap: 16 }}>
        <StatCard label="Total Staff"     value={teachers.length}                          icon={UserCheck}     color="#a855f7" trend={{ type:'up', val:'+2 this month' }} />
        <StatCard label="Active"          value={active}                                   icon={ShieldCheck}   color="#22c55e" />
        <StatCard label="Monthly Payroll" value={`₨ ${(totalPay/1000).toFixed(0)}k`}       icon={Briefcase}     color="#3b82f6" />
        <StatCard label="Avg Salary"      value={`₨ ${(avgSalary/1000).toFixed(0)}k`}      icon={GraduationCap} color="#f59e0b" />
      </div>

      {/* Search & filter bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center gap-3 shadow-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, subject or email..." width={300} />
        <Select value={subjectFilter} onChange={(e: any) => setSubjectFilter(e.target.value)} style={{ width: 170, height: 38 }}>
          <option value="all">All Subjects</option>
          {SUBJECTS.map(s => <option key={s}>{s}</option>)}
        </Select>
        <div style={{ marginLeft: 'auto' }}>
          <Badge label={`${filtered.length} staff found`} variant="info" />
        </div>
      </div>

      {/* Table */}
      <Table headers={['Teacher', 'Subject', 'Qualification', 'Contact', 'Salary', 'Status', 'Actions']}>
        {filtered.length === 0 ? (
          <Tr><Td colSpan={7} style={{ textAlign: 'center', padding: 48, color: C.muted }}>No faculty records match your search.</Td></Tr>
        ) : filtered.map(t => (
          <Tr key={t.id} onClick={() => setSelected(t)}>
            <Td>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar name={t.name} size={38} color="#a855f7" />
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{t.name}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: C.sub }}>{t.email || 'faculty@school.edu.pk'}</p>
                </div>
              </div>
            </Td>
            <Td>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <BookOpen size={13} color={C.blue} />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{t.subject}</span>
              </div>
            </Td>
            <Td style={{ color: C.sub, fontSize: 13 }}>{t.qualification || 'B.Ed'}</Td>
            <Td style={{ color: C.sub, fontSize: 13 }}>{t.phone || '—'}</Td>
            <Td>
              <span style={{ fontWeight: 700, color: '#1e293b', fontSize: 13 }}>₨ {((t.salary || 0) / 1000).toFixed(0)}k</span>
              <span style={{ fontSize: 10, color: C.muted, marginLeft: 3 }}>/mo</span>
            </Td>
            <Td><Badge label={t.status === 'active' ? 'Active' : 'On Leave'} variant={t.status === 'active' ? 'success' : 'warning'} /></Td>
            <Td>
              <div style={{ display: 'flex', gap: 8 }} onClick={e => e.stopPropagation()}>
                <button onClick={() => setSelected(t)} style={{ padding: 8, background: '#f1f5f9', borderRadius: 8, border: '1px solid #e2e8f0', cursor: 'pointer', color: C.sub }} title="View"><Eye size={15} /></button>
                <button onClick={() => handleDelete(t.id)} style={{ padding: 8, background: '#fef2f2', borderRadius: 8, border: '1px solid #fecaca', cursor: 'pointer', color: C.red }} title="Delete"><Trash2 size={15} /></button>
              </div>
            </Td>
          </Tr>
        ))}
      </Table>

      {/* Add Modal */}
      {showAdd && (
        <Modal title="Add New Faculty Member" onClose={() => setShowAdd(false)} width={620}>
          <div style={{ padding: '14px 16px', background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 12, marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Award size={18} color="#a855f7" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#6b21a8' }}>Faculty Registration</p>
              <p style={{ margin: 0, fontSize: 12, color: '#a855f7' }}>Enter professional details to register a new teacher.</p>
            </div>
          </div>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              <Field label="Full Name"><Input value={form.name} onChange={(e: any) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Dr. Rashid Khan" required /></Field>
              <Field label="Email"><Input type="email" value={form.email} onChange={(e: any) => setForm({ ...form, email: e.target.value })} placeholder="teacher@school.edu.pk" /></Field>
              <Field label="Phone"><Input value={form.phone} onChange={(e: any) => setForm({ ...form, phone: e.target.value })} placeholder="03XXXXXXXXX" /></Field>
              <Field label="Subject">
                <Select value={form.subject} onChange={(e: any) => setForm({ ...form, subject: e.target.value })}>
                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </Select>
              </Field>
              <Field label="Qualification"><Input value={form.qualification} onChange={(e: any) => setForm({ ...form, qualification: e.target.value })} placeholder="e.g. M.Phil" /></Field>
              <Field label="Salary (PKR)"><Input type="number" value={form.salary} onChange={(e: any) => setForm({ ...form, salary: Number(e.target.value) })} /></Field>
              <Field label="Gender">
                <Select value={form.gender} onChange={(e: any) => setForm({ ...form, gender: e.target.value })}>
                  <option>Male</option><option>Female</option>
                </Select>
              </Field>
              <Field label="Join Date"><Input type="date" value={form.joinDate} onChange={(e: any) => setForm({ ...form, joinDate: e.target.value })} /></Field>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 12, borderTop: '1px solid #e2e8f0' }}>
              <Btn variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Btn>
              <Btn type="submit" icon={UserCheck}>Add Teacher</Btn>
            </div>
          </form>
        </Modal>
      )}

      {/* Profile Modal */}
      {selected && (
        <Modal title="Teacher Profile" onClose={() => setSelected(null)} width={580}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '24px', background: 'linear-gradient(135deg, #faf5ff, #f5f3ff)', borderRadius: 16, border: '1px solid #e9d5ff' }}>
              <Avatar name={selected.name} size={80} color="#a855f7" />
              <div>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#1e293b' }}>{selected.name}</h2>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: C.sub }}>{selected.subject} Teacher</p>
                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                  <Badge label={selected.status === 'active' ? 'Active' : 'On Leave'} variant={selected.status === 'active' ? 'success' : 'warning'} />
                  <Badge label="Verified Faculty" variant="info" />
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
              {[
                { label: 'Email', value: selected.email || '—', icon: Mail },
                { label: 'Phone', value: selected.phone || '—', icon: Phone },
                { label: 'Monthly Salary', value: `₨ ${((selected.salary || 0) / 1000).toFixed(0)}k`, icon: Briefcase },
                { label: 'Qualification', value: selected.qualification || 'B.Ed', icon: GraduationCap },
                { label: 'Joined', value: selected.joiningDate || selected.joinDate || '—', icon: Calendar },
                { label: 'Subject', value: selected.subject, icon: BookOpen },
              ].map(f => (
                <div key={f.label} style={{ padding: '14px', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ padding: 8, background: '#e2e8f0', borderRadius: 8, flexShrink: 0 }}>
                    <f.icon size={15} color="#64748b" />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 10, fontWeight: 800, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{f.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <Btn variant="secondary" onClick={() => setSelected(null)} style={{ alignSelf: 'flex-end' }}>Close</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
