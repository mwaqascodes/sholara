import { useState } from 'react';
import { UserPlus, Search, Download, Eye, CheckCircle, XCircle, Clock, Filter, Trash2, Phone, User, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { C, PageHeader, StatCard, SearchBar, Badge, Btn, Table, Tr, Td, Avatar, Modal, Field, Input, Select } from '@/lib/design-system';

interface AdmissionRequest {
  id: number;
  studentName: string;
  fatherName: string;
  class: string;
  phone: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

const INITIAL: AdmissionRequest[] = [
  { id: 1, studentName: 'Zeeshan Ali', fatherName: 'Ali Khan', class: 'Class 1', phone: '0300-1234567', date: '2026-04-18', status: 'pending' },
  { id: 2, studentName: 'Hina Fatima', fatherName: 'Muhammad Rizwan', class: 'Class 4', phone: '0312-9876543', date: '2026-04-19', status: 'approved' },
  { id: 3, studentName: 'Umar Farooq', fatherName: 'Farooq Ahmad', class: 'Class 6', phone: '0333-1122334', date: '2026-04-20', status: 'pending' },
  { id: 4, studentName: 'Ayesha Bibi', fatherName: 'Sajid Mehmood', class: 'Class 2', phone: '0345-5566778', date: '2026-04-15', status: 'rejected' },
];

export default function AdmissionsPage() {
  const [items, setItems] = useState<AdmissionRequest[]>(INITIAL);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selected, setSelected] = useState<AdmissionRequest | null>(null);

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this admission record permanently?')) {
      setItems(prev => prev.filter(i => i.id !== id));
      toast.success('Admission record purged from system');
    }
  };

  const filtered = items.filter(i => {
    const ms = i.studentName.toLowerCase().includes(search.toLowerCase());
    const mst = filter === 'all' || i.status === filter;
    return ms && mst;
  });

  const handleStatus = (id: number, status: 'approved' | 'rejected') => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    toast.success(`Admission application has been ${status}`);
    setSelected(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader title="New Admissions" sub="Manage and review incoming enrollment applications for the 2026 academic year">
        <div style={{ display: 'flex', gap: 10 }}>
            <Btn variant="secondary" icon={Download}>Export Applicants</Btn>
            <Btn icon={UserPlus} onClick={() => toast.info('Direct offline admission entry coming soon!')}>New Application</Btn>
        </div>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        <StatCard label="Total Applicants" value={items.length} icon={UserPlus} color="#3b82f6" trend={{ type:'up', val:'+12%' }} />
        <StatCard label="Pending Review" value={items.filter(i => i.status === 'pending').length} icon={Clock} color="#f59e0b" />
        <StatCard label="Enrollment Rate" value="65%" icon={CheckCircle2} color="#22c55e" />
      </div>

      <div style={{ 
        display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', 
        padding: '12px 16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' 
      }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by student or father's name..." width={320} />
        <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
            {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                    padding: '8px 16px', borderRadius: 12, border: `1px solid ${filter === f ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.1)'}`, cursor: 'pointer', fontSize: 13, fontWeight: 700,
                    background: filter === f ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.02)',
                    color: filter === f ? C.amber : C.sub,
                    transition: 'all 0.2s ease',
                    textTransform: 'capitalize'
                }}>{f}</button>
            ))}
        </div>
      </div>

      <Table headers={['Applicant Details', 'Parental Info', 'Phone Number', 'Applied On', 'Status', 'Actions']}>
        {filtered.length > 0 ? filtered.map(i => (
          <Tr key={i.id} onClick={() => setSelected(i)}>
            <Td>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar name={i.studentName} size={36} color="#3b82f6" />
                <div>
                   <p style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>{i.studentName}</p>
                   <p style={{ margin: 0, fontSize: 11, color: C.sub }}>Applying for {i.class}</p>
                </div>
              </div>
            </Td>
            <Td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#1e293b', fontSize: 13, fontWeight: 500 }}>
                    <User size={14} color={C.muted} /> {i.fatherName}
                </div>
            </Td>
            <Td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.sub, fontSize: 13 }}>
                    <Phone size={14} color={C.muted} /> {i.phone}
                </div>
            </Td>
            <Td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.muted }}>
                    <Calendar size={14} />
                    <span style={{ fontSize: 12 }}>{i.date}</span>
                </div>
            </Td>
            <Td><Badge label={i.status} variant={i.status === 'approved' ? 'success' : i.status === 'pending' ? 'warning' : 'danger'} /></Td>
            <Td>
                <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
                    <button style={{ padding: 8, background: '#f1f5f9', borderRadius: 10, border: 'none', cursor: 'pointer', color: C.sub }} onClick={() => setSelected(i)}><Eye size={16} /></button>
                    {i.status === 'pending' && (
                        <>
                            <button style={{ padding: 8, background: 'rgba(34,197,94,0.1)', borderRadius: 10, border: 'none', cursor: 'pointer', color: C.green }} onClick={() => handleStatus(i.id, 'approved')} title="Approve"><CheckCircle size={16} /></button>
                            <button style={{ padding: 8, background: 'rgba(239,68,68,0.1)', borderRadius: 10, border: 'none', cursor: 'pointer', color: C.red }} onClick={() => handleStatus(i.id, 'rejected')} title="Reject"><XCircle size={16} /></button>
                        </>
                    )}
                    <button style={{ padding: 8, background: 'rgba(239,68,68,0.1)', borderRadius: 10, border: 'none', cursor: 'pointer', color: C.red }} onClick={() => handleDelete(i.id)} title="Delete Record"><Trash2 size={16} /></button>
                </div>
            </Td>
          </Tr>
        )) : (
          <Tr><Td colspan={6} style={{ textAlign: 'center', padding: '48px', color: C.muted }}>No admission applications found.</Td></Tr>
        )}
      </Table>

      {selected && (
          <Modal title="Admission Application Details" onClose={() => setSelected(null)}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '24px', background: 'linear-gradient(135deg, rgba(59,130,246,0.1), transparent)', borderRadius: 16, border: '1px solid rgba(59,130,246,0.2)' }}>
                      <Avatar name={selected.studentName} size={64} color="#3b82f6" />
                      <div>
                          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: '#1e293b' }}>{selected.studentName}</h3>
                          <p style={{ margin: 0, fontSize: 13, color: C.sub }}>Applying for Entry in {selected.class}</p>
                      </div>
                      <div style={{ marginLeft: 'auto' }}>
                          <Badge label={selected.status} variant={selected.status === 'approved' ? 'success' : selected.status === 'pending' ? 'warning' : 'danger'} />
                      </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      {[
                          { label: 'Parent/Guardian', value: selected.fatherName, icon: User },
                          { label: 'Primary Contact', value: selected.phone, icon: Phone },
                          { label: 'Submission Date', value: selected.date, icon: Calendar },
                          { label: 'Academic Standing', value: 'Document Verified', icon: FileText }
                      ].map(f => (
                          <div key={f.label} style={{ padding: '14px 18px', background: '#f8fafc', borderRadius: 12, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                              <f.icon size={18} color={C.muted} />
                              <div>
                                  <p style={{ margin: 0, fontSize: 10, fontWeight: 800, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</p>
                                  <p style={{ margin: '2px 0 0', fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{f.value}</p>
                              </div>
                          </div>
                      ))}
                  </div>
                  {selected.status === 'pending' && (
                      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                          <Btn variant="success" style={{ flex: 1 }} onClick={() => handleStatus(selected.id, 'approved')}>Approve Admission</Btn>
                          <Btn variant="danger" style={{ flex: 1 }} onClick={() => handleStatus(selected.id, 'rejected')}>Deny Application</Btn>
                      </div>
                  )}
                  {selected.status !== 'pending' && (
                      <Btn variant="secondary" style={{ width: '100%' }} onClick={() => setSelected(null)}>Close View</Btn>
                  )}
              </div>
          </Modal>
      )}
    </div>
  );
}
