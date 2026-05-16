import { useState } from 'react';
import { Clock, Plus, Download, Calendar, BookOpen, User, MapPin, Printer, Edit, MoreVertical, LayoutGrid } from 'lucide-react';
import { toast } from 'sonner';
import { C, PageHeader, StatCard, Btn, Table, Tr, Td, Badge, Modal, Field, Select, Input } from '@/lib/design-system';

interface ScheduleEntry {
  id: number;
  timeSlot: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  subject?: string;
  teacher?: string;
}

const INITIAL: ScheduleEntry[] = [
  { id: 1, timeSlot: '08:30 - 09:15', monday: 'Mathematics', tuesday: 'English', wednesday: 'Urdu', thursday: 'Science', friday: 'Islamiyat' },
  { id: 2, timeSlot: '09:15 - 10:00', monday: 'English', tuesday: 'Mathematics', wednesday: 'Science', thursday: 'Urdu', friday: 'Mathematics' },
  { id: 3, timeSlot: '10:00 - 10:45', monday: 'Science', tuesday: 'Science', wednesday: 'Mathematics', thursday: 'English', friday: 'Urdu' },
  { id: 4, timeSlot: '10:45 - 11:15', monday: 'BREAK', tuesday: 'BREAK', wednesday: 'BREAK', thursday: 'BREAK', friday: 'BREAK' },
  { id: 5, timeSlot: '11:15 - 12:00', monday: 'Urdu', tuesday: 'Islamiyat', wednesday: 'English', thursday: 'Mathematics', friday: 'Science' },
  { id: 6, timeSlot: '12:00 - 12:45', monday: 'Islamiyat', tuesday: 'English', wednesday: 'Urdu', thursday: 'Science', friday: 'English' },
];

export default function SchedulePage() {
  const [activeClass, setActiveClass] = useState('Class 5');
  const [activeSection, setActiveSection] = useState('A');
  const [showAdd, setShowAdd] = useState(false);
  const [schedule, setSchedule] = useState<ScheduleEntry[]>(INITIAL);

  const handleExport = () => {
    toast.loading("Compiling high-resolution PDF...");
    setTimeout(() => {
        toast.dismiss();
        toast.success("Timetable exported successfully!");
    }, 2000);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Schedule modifications saved and synced with mobile app!");
    setShowAdd(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader title="Academic Timetable" sub="Real-time synchronized class scheduling and venue management">
        <div style={{ display: 'flex', gap: 10 }}>
            <Btn variant="secondary" icon={Printer} onClick={handleExport}>Print / Export PDF</Btn>
            <Btn icon={Edit} onClick={() => setShowAdd(true)}>Modify Schedule</Btn>
        </div>
      </PageHeader>

      <div style={{ 
        display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', 
        padding: '12px 20px', background: '#f8fafc', borderRadius: 16, border: '1px solid #e2e8f0' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <LayoutGrid size={18} color={C.amber} />
            <Select value={activeClass} onChange={(e: any) => setActiveClass(e.target.value)} style={{ width: 140, height: 38 }}>
                {['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map(c => <option key={c}>{c}</option>)}
            </Select>
            <Select value={activeSection} onChange={(e: any) => setActiveSection(e.target.value)} style={{ width: 120, height: 38 }}>
                {['A', 'B', 'C'].map(s => <option key={s} value={s}>Section {s}</option>)}
            </Select>
        </div>
        <div style={{ marginLeft: 'auto' }}>
            <Badge label={`Current View: ${activeClass} - ${activeSection}`} variant="info" />
        </div>
      </div>

      <Table headers={['Time Slot', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']}>
        {schedule.map(s => (
          <Tr key={s.id}>
            <Td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Clock size={14} color={C.amber} />
                    <span style={{ fontWeight: 800, color: C.amber, fontSize: 11 }}>{s.timeSlot}</span>
                </div>
            </Td>
            {[s.monday, s.tuesday, s.wednesday, s.thursday, s.friday].map((subject, idx) => (
                <Td key={idx}>
                    <div style={{ 
                        padding: '10px', 
                        borderRadius: 12, 
                        background: subject === 'BREAK' ? 'rgba(255,255,255,0.02)' : 'rgba(59,130,246,0.08)',
                        border: `1px solid ${subject === 'BREAK' ? 'rgba(255,255,255,0.05)' : 'rgba(59,130,246,0.2)'}`,
                        textAlign: 'center',
                        minWidth: 100,
                        transition: 'all 0.2s ease'
                    }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: subject === 'BREAK' ? C.sub : '#fff' }}>{subject}</p>
                        {subject !== 'BREAK' && (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 4 }}>
                                <MapPin size={10} color={C.sub} />
                                <span style={{ fontSize: 9, color: C.sub, fontWeight: 500 }}>Room 204</span>
                            </div>
                        )}
                    </div>
                </Td>
            ))}
          </Tr>
        ))}
      </Table>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          <div style={{ ...C.glass, padding: 24, background: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: C.amberBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={20} style={{ color: C.amber }} />
                  </div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1e293b' }}>Faculty Allocation</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {['Mathematics - Amna Rashid', 'English - Sara Batool', 'Science - Muhammad Aslam', 'Urdu - Kashif Ali'].map(item => (
                      <div key={item} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f8fafc', borderRadius: 12 }}>
                          <span style={{ color: C.sub, fontSize: 14 }}>{item.split(' - ')[0]}</span>
                          <span style={{ fontWeight: 700, color: '#1e293b', fontSize: 14 }}>{item.split(' - ')[1]}</span>
                      </div>
                  ))}
              </div>
          </div>

          <div style={{ ...C.glass, padding: 24, background: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: C.blueBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Calendar size={20} style={{ color: C.blue }} />
                  </div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1e293b' }}>Schedule Health</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
                      <span style={{ color: C.sub, fontSize: 14 }}>Total Daily Periods</span>
                      <span style={{ fontWeight: 800, color: C.txt }}>6 Session(s)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
                      <span style={{ color: C.sub, fontSize: 14 }}>Instructional Intensity</span>
                      <span style={{ fontWeight: 800, color: C.green }}>High (85%)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                      <span style={{ color: C.sub, fontSize: 14 }}>Weekly Academic Load</span>
                      <span style={{ fontWeight: 800, color: C.amber }}>30 Periods</span>
                  </div>
              </div>
          </div>
      </div>

      {showAdd && (
        <Modal title="Advanced Schedule Editor" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Academic Class"><Select><option>Class 5A</option><option>Class 5B</option></Select></Field>
                <Field label="Weekday"><Select><option>Monday</option><option>Tuesday</option><option>Wednesday</option></Select></Field>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Session Time"><Input placeholder="e.g. 08:30 - 09:15" required /></Field>
                <Field label="Classroom/Lab"><Input placeholder="Main Hall (Room 204)" required /></Field>
            </div>
            <Field label="Primary Subject"><Input placeholder="Mathematics" required /></Field>
            <Field label="Invigilator/Teacher"><Input placeholder="Search staff database..." required /></Field>
            <div style={{ marginTop: 10 }}>
                <Btn type="submit" style={{ width: '100%' }}>Commit Changes</Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
