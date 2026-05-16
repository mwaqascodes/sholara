import { useState } from 'react';
import { Calendar, CheckCircle, XCircle, Clock, Download, Save, Users, Filter, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { getStudents } from '@/lib/store';
import { attendanceChartData } from '@/lib/demo-data';
import { C, PageHeader, StatCard, SearchBar, Badge, Btn, Table, Tr, Td, Avatar, Select } from '@/lib/design-system';
import { AreaChart, Area, XAxis, YAxis, Tooltip as ChartTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const CLASSES = ['Class 1','Class 2','Class 3','Class 4','Class 5','Class 6','Class 7','Class 8','Class 9','Class 10'];

export default function AttendancePage() {
  const allStudents = getStudents();
  const [selectedClass, setSelectedClass] = useState('Class 1');
  const [search, setSearch] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<number, 'present'|'absent'|'late'>>({});
  const today = new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' });

  const students = allStudents.filter(s =>
    s.class === selectedClass &&
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id: number, status: 'present'|'absent'|'late') => {
    setAttendance(a => ({ ...a, [id]: a[id] === status ? 'present' : status }));
  };

  const markAll = (status: 'present'|'absent') => {
    const a: Record<number, 'present'|'absent'|'late'> = {};
    students.forEach(s => { a[s.id] = status; });
    setAttendance(a);
    toast.info(`Marked all ${students.length} students as ${status}`);
  };

  const getStatus = (id: number) => attendance[id] || 'present';

  const present = students.filter(s => getStatus(s.id) === 'present').length;
  const absent  = students.filter(s => getStatus(s.id) === 'absent').length;
  const late    = students.filter(s => getStatus(s.id) === 'late').length;

  const handleSave = () => {
    toast.success(`Attendance repository updated for ${selectedClass}. Data synced with Parent App!`);
  };

  const handleExport = () => {
    toast.info("Generating comprehensive attendance report...");
    setTimeout(() => toast.success("Attendance report downloaded!"), 1500);
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap: 24 }}>
      <PageHeader title="Attendance Governance" sub={`Daily Roll Call Matrix · Current: ${today}`}>
        <div style={{ display: 'flex', gap: 10 }}>
            <Btn icon={Download} variant="secondary" onClick={handleExport}>Download Report</Btn>
            <Btn icon={Save} variant="primary" onClick={handleSave}>Sync Attendance</Btn>
        </div>
      </PageHeader>

      {/* Real-time Statistics */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
        <StatCard label="Present Today" value={present} icon={CheckCircle2} color="#22c55e" trend={{ type:'up', val:'94% Ratio' }} />
        <StatCard label="Absent Records"  value={absent}  icon={XCircle}     color="#ef4444" />
        <StatCard label="Tardy/Late"          value={late}    icon={Clock}        color="#f59e0b" />
        <StatCard label="Class Roster"   value={students.length} icon={Users} color="#3b82f6" />
      </div>

      {/* Analytics Visualization */}
      <div style={{ ...C.glass, padding: 24, background: '#f8fafc' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#1e293b' }}>Institutional Attendance Trend</p>
            <Badge label="7 Day Window" variant="info" />
        </div>
        <div style={{ height: 200, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={attendanceChartData} margin={{ top:4, right:4, left:-20, bottom:0 }}>
                <defs>
                <linearGradient id="pGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill:C.muted, fontSize:10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:C.muted, fontSize:10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <ChartTooltip 
                    contentStyle={{ background: '#0a0f1e', border: `1px solid ${C.border}`, borderRadius: 12, color: '#1e293b', fontSize: 12 }} 
                    itemStyle={{ padding: 0 }}
                />
                <Area type="monotone" dataKey="present" stroke="#22c55e" strokeWidth={3} fill="url(#pGrad)" dot={{ fill: '#22c55e', r: 4 }} name="Present" />
                <Area type="monotone" dataKey="absent"  stroke="#ef4444" strokeWidth={2} fill="none" dot={false} strokeDasharray="5 5" name="Absent" />
            </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* Roll Call Controls */}
      <div style={{ 
          display:'flex', gap: 12, flexWrap:'wrap', alignItems:'center',
          padding: '16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Filter size={14} color={C.sub} />
            <Select value={selectedClass} onChange={(e: any)=>setSelectedClass(e.target.value)} style={{ width: 140, height: 38 }}>
                {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
            <div style={{ position: 'relative' }}>
                <Calendar size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.sub }} />
                <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{
                    background:'rgba(255,255,255,0.05)', border:`1px solid rgba(255,255,255,0.1)`, borderRadius: 12,
                    padding:'8px 12px 8px 34px', color:'#fff', fontSize: 13, outline:'none', width: 160
                }} />
            </div>
        </div>
        
        <SearchBar value={search} onChange={setSearch} placeholder="Find student in class..." width={240} />
        
        <div style={{ marginLeft:'auto', display:'flex', gap: 8 }}>
          <Btn variant="secondary" style={{ borderColor: 'rgba(34,197,94,0.3)', color: '#22c55e' }} onClick={() => markAll('present')}>Presence All</Btn>
          <Btn variant="secondary" style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }} onClick={() => markAll('absent')}>Absence All</Btn>
        </div>
      </div>

      {/* Attendance Roster Table */}
      <Table headers={['Student Identity','Roll No','Current Status','Interaction']}>
        {students.length === 0 ? (
          <Tr><Td colSpan={4} style={{ textAlign:'center', padding:48, color: C.muted }}>No student roster available for the selected parameters.</Td></Tr>
        ) : (
          students.map((s, i) => {
            const st = getStatus(s.id);
            return (
              <Tr key={s.id}>
                <Td>
                  <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
                    <Avatar name={s.name} size={36} color="#3b82f6" />
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#1e293b' }}>{s.name}</span>
                  </div>
                </Td>
                <Td style={{ color: C.sub, fontWeight: 600 }}>#{s.rollNo}</Td>
                <Td>
                  <Badge
                    label={st.toUpperCase()}
                    variant={st==='present' ? 'success' : st==='absent' ? 'danger' : 'warning'}
                  />
                </Td>
                <Td>
                  <div style={{ display:'flex', gap: 8 }}>
                    {(['present','absent','late'] as const).map(status => (
                      <button key={status} onClick={() => toggle(s.id, status)} style={{
                        padding:'8px 16px', borderRadius: 12, border: `1px solid ${st === status ? (status==='present' ? 'rgba(34,197,94,0.3)' : status==='absent' ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)') : 'rgba(255,255,255,0.05)'}`,
                        cursor:'pointer', fontSize: 12, fontWeight: 800,
                        background: st === status
                          ? status==='present' ? 'rgba(34,197,94,0.15)' : status==='absent' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)'
                          : 'rgba(255,255,255,0.02)',
                        color: st === status
                          ? status==='present' ? '#22c55e' : status==='absent' ? '#ef4444' : '#f59e0b'
                          : C.sub,
                        transition: 'all 0.2s ease',
                      }}>{status.charAt(0).toUpperCase() + status.slice(1)}</button>
                    ))}
                  </div>
                </Td>
              </Tr>
            );
          })
        )}
      </Table>
    </div>
  );
}
