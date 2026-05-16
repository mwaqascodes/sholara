import { useState } from 'react';
import { Users, UserCheck, UserX, Download, Plus, Eye, Trash2, GraduationCap, Filter, ShieldCheck, UserPlus, User, Phone, MapPin, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useStudents, addStudent, deleteStudent, getSubjectsForClass, type StoreStudent } from '@/lib/store';
import { C, PageHeader, StatCard, SearchBar, Badge, Btn, Table, Tr, Td, Modal, Field, Input, Select, Avatar } from '@/lib/design-system';

const CLASSES = ['Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8','Class 9','Class 10'];

export default function StudentsPage() {
  const students = useStudents();
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<StoreStudent | null>(null);

  const filtered = students.filter(s => {
    const ms = s.name.toLowerCase().includes(search.toLowerCase()) || s.fatherName.toLowerCase().includes(search.toLowerCase());
    const mc = classFilter === 'all' || s.class === classFilter;
    const mst = statusFilter === 'all' || s.status === statusFilter;
    return ms && mc && mst;
  });

  const active   = students.filter(s => s.status === 'active').length;
  const inactive = students.filter(s => s.status !== 'active').length;
  const paid     = students.filter(s => s.feeStatus === 'Paid').length;

  const [form, setForm] = useState({
    name:'', fatherName:'', phone:'', email:'',
    class:'Class 1', section:'A', dob:'', address:'', gender:'Male' as 'Male' | 'Female',
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addStudent({
      ...form, nameUrdu: form.name, fatherNameUrdu: '',
      rollNo: students.length + 1001,
      avatar: form.gender === 'Male' ? '👨‍🎓' : '👩‍🎓',
      attendance: 100, gpa: 0, status: 'active', schoolId: 'demo-school',
      feeStatus: 'Unpaid', admissionDate: new Date().toISOString().split('T')[0],
      subjects: getSubjectsForClass(form.class),
    });
    toast.success(`${form.name} has been enrolled in ${form.class}! 🎓`);
    setShowAdd(false);
    setForm({ name:'', fatherName:'', phone:'', email:'', class:'Class 1', section:'A', dob:'', address:'', gender:'Male' });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Institutional Protocol: Permanently remove this student record? This action cannot be undone.')) return;
    deleteStudent(id);
    toast.success('Student record successfully purged from institutional registry');
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap: 24 }}>
      <PageHeader title="Student Admission Registry" sub={`Managing ${students.length} active enrollments for the current session`}>
        <div style={{ display: 'flex', gap: 10 }}>
            <Btn icon={Download} variant="secondary" onClick={() => toast.success("Generating student database export...")}>Export Dataset</Btn>
            <Btn icon={Plus} onClick={() => setShowAdd(true)}>Enroll New Student</Btn>
        </div>
      </PageHeader>

      {/* High-level Analytics */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px, 1fr))', gap: 16 }}>
        <StatCard label="Live Enrollment" value={students.length} icon={Users} color="#3b82f6" trend={{ type:'up', val:'+4 today' }} />
        <StatCard label="Active Presence" value={active} icon={UserCheck} color="#22c55e" trend={{ type:'up', val:'92% avg' }} />
        <StatCard label="Payment Status" value={paid} sub="Paid this month" icon={GraduationCap} color="#f59e0b" />
        <StatCard label="Withdrawals" value={inactive} icon={UserX} color="#ef4444" />
      </div>

      {/* Filtering */}
      <div style={{
          display:'flex', gap: 12, flexWrap:'wrap', alignItems:'center',
          padding: '16px', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, father or roll no..." width={320} />
        
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Filter size={14} color={C.sub} />
            <Select value={classFilter} onChange={(e: any) => setClassFilter(e.target.value)} style={{ width: 140, height: 38 }}>
                <option value="all">All Grades</option>
                {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
            <Select value={statusFilter} onChange={(e: any) => setStatusFilter(e.target.value)} style={{ width: 140, height: 38 }}>
                <option value="all">Any Status</option>
                <option value="active">Active Learners</option>
                <option value="inactive">Withdrawn</option>
            </Select>
        </div>
        
        <div style={{ marginLeft:'auto', fontSize:12, color:C.sub, fontWeight: 600 }}>
            <Badge label={`${filtered.length} matches found`} variant="info" />
        </div>
      </div>

      {/* Global Student Data Table */}
      <Table headers={['Student Identity','Academic Unit','Parental Info','Contact','Subsidies','Fees','Status','Metadata']}>
        {filtered.length === 0 ? (
          <Tr><Td colSpan={8} style={{ textAlign:'center', padding: 64, color: C.muted }}>No matching student records found in the registry.</Td></Tr>
        ) : (
          filtered.map(s => (
            <Tr key={s.id} onClick={() => setSelected(s)}>
              <Td>
                <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
                  <Avatar name={s.name} size={38} color="#3b82f6" />
                  <div>
                    <p style={{ margin:0, fontSize: 14, fontWeight: 800, color: C.txt }}>{s.name}</p>
                    <p style={{ margin:'2px 0 0', fontSize: 11, color: C.sub }}>Roll No: <span style={{ color: C.amber }}>{s.rollNo}</span></p>
                  </div>
                </div>
              </Td>
              <Td>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.txt }}>{s.class}</span>
                  <span style={{ fontSize: 11, color: C.sub }}>Section {s.section}</span>
                </div>
              </Td>
              <Td style={{ color: C.txt, fontSize: 13, fontWeight: 600 }}>{s.fatherName}</Td>
              <Td style={{ color: C.sub, fontSize: 13 }}>{s.phone || '—'}</Td>
              <Td>
                <div style={{ display:'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ width: 60, height: 6, borderRadius: 10, background:'#e2e8f0', overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${s.attendance}%`, background: s.attendance >= 80 ? '#22c55e' : s.attendance >= 60 ? '#f59e0b' : '#ef4444', borderRadius: 10 }} />
                  </div>
                  <span style={{ fontSize: 10, color: C.muted, fontWeight: 700 }}>{s.attendance}%</span>
                </div>
              </Td>
              <Td><Badge label={s.feeStatus} variant={s.feeStatus==='Paid' ? 'success' : 'danger'} /></Td>
              <Td><Badge label={s.status} variant={s.status==='active' ? 'success' : 'danger'} /></Td>
              <Td>
                <div style={{ display:'flex', gap: 8 }} onClick={e => e.stopPropagation()}>
                  <button onClick={() => setSelected(s)} style={{ padding: 8, background: '#f1f5f9', borderRadius: 10, border:'1px solid #e2e8f0', cursor:'pointer', color: C.sub }}><Eye size={16}/></button>
                  <button onClick={() => handleDelete(s.id)} style={{ padding: 8, background: '#fef2f2', borderRadius: 10, border:'1px solid #fecaca', cursor:'pointer', color: C.red }}><Trash2 size={16}/></button>
                </div>
              </Td>
            </Tr>
          ))
        )}
      </Table>

      {/* Enrollment Protocol Modal */}
      {showAdd && (
        <Modal title="Enroll New Student" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleAdd} style={{ padding: '0 4px', display:'flex', flexDirection:'column', gap: 20 }}>
              <div style={{ padding: '14px 16px', background: '#eff6ff', borderRadius: 12, border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <ShieldCheck size={18} color="#3b82f6" />
                  </div>
                  <div>
                      <h4 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#1e40af' }}>Student Registration Form</h4>
                      <p style={{ margin: 0, fontSize: 12, color: '#3b82f6' }}>Fill in the details below to enroll a new student.</p>
                  </div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                <Field label="Full Name"><Input value={form.name} onChange={(e:any)=>setForm({...form,name:e.target.value})} placeholder="e.g. Abdullah Khan" required /></Field>
                <Field label="Father's Legal Name"><Input value={form.fatherName} onChange={(e:any)=>setForm({...form,fatherName:e.target.value})} placeholder="Father's full name" required /></Field>
                <Field label="Primary Contact Number"><Input value={form.phone} onChange={(e:any)=>setForm({...form,phone:e.target.value})} placeholder="03XXXXXXXXX" /></Field>

                <Field label="Grade Level">
                  <Select value={form.class} onChange={(e:any)=>setForm({...form,class:e.target.value})}>
                      {CLASSES.map(c=><option key={c} value={c}>{c}</option>)}
                  </Select>
                </Field>
                <Field label="Campus Section">
                  <Select value={form.section} onChange={(e:any)=>setForm({...form,section:e.target.value})}>
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                      <option value="C">Section C</option>
                  </Select>
                </Field>

                <Field label="Gender Identification">
                  <Select value={form.gender} onChange={(e:any)=>setForm({...form,gender:e.target.value})}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                  </Select>
                </Field>
                <Field label="Date of Birth"><Input type="date" value={form.dob} onChange={(e:any)=>setForm({...form,dob:e.target.value})} /></Field>
              </div>

              <Field label="Permanent Residential Address" >
                  <Input value={form.address} onChange={(e:any)=>setForm({...form,address:e.target.value})} placeholder="House, Street, Sector, City" />
              </Field>

              <div style={{ display:'flex', gap: 12, justifyContent:'flex-end', paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                <Btn variant="secondary" onClick={() => setShowAdd(false)}>Discard</Btn>
                <Btn type="submit" icon={UserPlus}>Confirm Enrollment</Btn>
              </div>
          </form>
        </Modal>
      )}

      {/* Enhanced Profile View */}
      {selected && (
        <Modal title="Student Profile" onClose={() => setSelected(null)} width={600}>
          <div style={{ display:'flex', flexDirection:'column', gap: 20 }}>
            {/* Header */}
            <div style={{ display:'flex', alignItems:'center', gap: 20, padding:'24px', background: 'linear-gradient(135deg, #eff6ff, #f0fdf4)', borderRadius: 16, border:'1px solid #bfdbfe' }}>
              <Avatar name={selected.name} size={80} color="#3b82f6" />
              <div style={{ flex: 1 }}>
                <h2 style={{ margin:0, fontSize: 22, fontWeight: 900, color: '#1e293b' }}>{selected.name}</h2>
                <p style={{ margin:'4px 0 0', fontSize: 13, color: C.sub, fontWeight: 600 }}>
                  {selected.class} · Section {selected.section} · Roll #{selected.rollNo}
                </p>
                <div style={{ marginTop: 12, display:'flex', gap: 8 }}>
                  <Badge label={selected.status} variant={selected.status==='active'?'success':'danger'} />
                  <Badge label={`Fee: ${selected.feeStatus}`} variant={selected.feeStatus==='Paid'?'success':'danger'} />
                </div>
              </div>
            </div>

            {/* Details grid */}
            <div style={{ display:'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12 }}>
              {[
                { label:'Father / Guardian', value: selected.fatherName, icon: User },
                { label:'Contact Number', value: selected.phone||'—', icon: Phone },
                { label:'Attendance', value:`${selected.attendance}%`, icon: UserCheck },
                { label:'GPA', value: selected.gpa?.toFixed(2)||'N/A', icon: GraduationCap },
                { label:'Enrolled On', value: selected.admissionDate, icon: Calendar },
                { label:'Address', value: selected.address||'Not provided', icon: MapPin },
              ].map(f => (
                <div key={f.label} style={{ padding:'14px', background:'#f8fafc', borderRadius: 12, border:'1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ padding: 8, background: '#e2e8f0', borderRadius: 8, flexShrink: 0 }}>
                    <f.icon size={16} color="#64748b" />
                  </div>
                  <div>
                    <p style={{ margin:0, fontSize:10, fontWeight: 800, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</p>
                    <p style={{ margin: '2px 0 0', fontSize:13, fontWeight:700, color: C.txt }}>{f.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <Btn variant="secondary" style={{ flex: 1 }} onClick={() => setSelected(null)}>Close</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

const UserPlus = ({ size, color }: any) => <Plus size={size} color={color} />;
