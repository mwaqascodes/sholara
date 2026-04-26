import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, MapPin, Users, Info, Bell, Target } from 'lucide-react';
import { toast } from 'sonner';
import { C, PageHeader, Btn, Modal, Field, Input, Badge } from '@/lib/design-system';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  type: 'academic' | 'holiday' | 'exam' | 'event';
  location?: string;
  description?: string;
}

const EVENTS: Event[] = [
  { id: 1, title: 'Mid-term Exams Begin', date: '2026-04-28', time: '08:30 AM', type: 'exam', description: 'Annual mid-term examinations for all classes.' },
  { id: 2, title: 'Parents Meeting', date: '2026-04-26', time: '10:00 AM', type: 'event', location: 'Hall A', description: 'Final progress meeting before mid-terms.' },
  { id: 3, title: 'Labor Day', date: '2026-05-01', time: 'Full Day', type: 'holiday', description: 'National Holiday' },
  { id: 4, title: 'Science Fair', date: '2026-04-15', time: '09:00 AM', type: 'academic', location: 'Science Lab' },
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 21)); // April 21, 2026
  const [showAdd, setShowAdd] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const renderCalendar = () => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const totalDays = daysInMonth(month, year);
    const startDay = firstDayOfMonth(month, year);
    const days = [];

    for (let i = 0; i < startDay; i++) {
        days.push(<div key={`empty-${i}`} style={{ height: 120, border: `1px solid ${C.border}`, padding: 8, background: 'rgba(255,255,255,0.01)' }}></div>);
    }

    for (let d = 1; d <= totalDays; d++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const dayEvents = EVENTS.filter(e => e.date === dateStr);
        const isToday = d === 21 && month === 3 && year === 2026;

        days.push(
            <div key={d} style={{ 
                height: 120, 
                border: `1px solid ${isToday ? 'rgba(245,158,11,0.3)' : C.border}`, 
                padding: '10px', 
                background: isToday ? 'rgba(245,158,11,0.08)' : 'transparent',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                overflow: 'hidden',
                transition: 'all 0.2s ease',
                position: 'relative'
            }}>
                <span style={{ 
                    fontSize: 14, 
                    fontWeight: isToday ? 900 : 600, 
                    color: isToday ? C.amber : C.sub,
                    opacity: isToday ? 1 : 0.7 
                }}>{d}</span>
                {dayEvents.map(e => (
                    <div key={e.id} onClick={() => setSelectedEvent(e)} style={{
                        fontSize: 10,
                        padding: '4px 8px',
                        borderRadius: 8,
                        background: e.type === 'academic' ? 'rgba(59,130,246,0.1)' : e.type === 'exam' ? 'rgba(239,68,68,0.1)' : e.type === 'holiday' ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)',
                        color: e.type === 'academic' ? C.blue : e.type === 'exam' ? C.red : e.type === 'holiday' ? C.amber : C.green,
                        border: `1px solid ${e.type === 'academic' ? 'rgba(59,130,246,0.2)' : e.type === 'exam' ? 'rgba(239,68,68,0.2)' : e.type === 'holiday' ? 'rgba(245,158,11,0.2)' : 'rgba(34,197,94,0.2)'}`,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontWeight: 700
                    }}>
                        {e.title}
                    </div>
                ))}
                {isToday && <div style={{ position: 'absolute', bottom: 4, right: 4, width: 6, height: 6, borderRadius: '50%', background: C.amber }} />}
            </div>
        );
    }

    return days;
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Event scheduled and added to the academic calendar!");
    setShowAdd(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader title="Academic Calendar" sub="Synchronized institutional timeline for the 2026-2027 fiscal year">
        <Btn icon={Plus} onClick={() => setShowAdd(true)}>Schedule New Event</Btn>
      </PageHeader>

      <div style={{ ...C.glass, overflow: 'hidden', border: `1px solid ${C.border}` }}>
        <div style={{ 
            padding: '24px 32px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            background: '#f8fafc',
            borderBottom: `1px solid ${C.border}` 
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CalendarIcon size={22} color={C.amber} />
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1e293b', margin: 0, letterSpacing: '-0.02em' }}>
                    {monthNames[currentDate.getMonth()]} <span style={{ color: C.sub }}>{currentDate.getFullYear()}</span>
                </h2>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', border: `1px solid ${C.border}`, borderRadius: 12, color: '#1e293b', cursor: 'pointer' }}><ChevronLeft size={18} /></button>
                <button onClick={() => setCurrentDate(new Date(2026, 3, 21))} style={{ padding: '0 20px', background: '#f8fafc', border: `1px solid ${C.border}`, borderRadius: 12, color: '#1e293b', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Jump to Today</button>
                <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', border: `1px solid ${C.border}`, borderRadius: 12, color: '#1e293b', cursor: 'pointer' }}><ChevronRight size={18} /></button>
            </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: 'rgba(0,0,0,0.2)', borderBottom: `1px solid ${C.border}` }}>
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => (
                <div key={d} style={{ padding: '16px', textAlign: 'center', fontSize: 12, fontWeight: 800, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{d}</div>
            ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {renderCalendar()}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {[
              { type: 'Exam', color: C.red },
              { type: 'Holiday', color: C.amber },
              { type: 'Academic', color: C.blue },
              { type: 'Event', color: C.green }
          ].map(l => (
              <div key={l.type} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', padding: '8px 16px', borderRadius: 12, border: `1px solid ${C.border}` }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.sub }}>{l.type}</span>
              </div>
          ))}
      </div>

      {selectedEvent && (
          <Modal title="Event Blueprint" onClose={() => setSelectedEvent(null)}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ 
                      padding: '24px', 
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%)', 
                      borderRadius: 16, 
                      border: `1px solid ${C.border}`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 16
                  }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Badge label={selectedEvent.type.toUpperCase()} variant={selectedEvent.type === 'exam' ? 'danger' : selectedEvent.type === 'holiday' ? 'warning' : 'info'} />
                          <div style={{ color: C.sub, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                              <Target size={14} /> ID: EXM-00{selectedEvent.id}
                          </div>
                      </div>
                      <h3 style={{ fontSize: 24, fontWeight: 900, color: '#1e293b', margin: 0, letterSpacing: '-0.02em' }}>{selectedEvent.title}</h3>
                      <div style={{ height: 1, background: 'rgba(255,255,255,0.1)' }} />
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#1e293b' }}>
                              <div style={{ padding: 8, background: 'rgba(59,130,246,0.1)', borderRadius: 10 }}><CalendarIcon size={16} color={C.blue} /></div>
                              <span style={{ fontSize: 14, fontWeight: 600 }}>{selectedEvent.date}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#1e293b' }}>
                              <div style={{ padding: 8, background: 'rgba(245,158,11,0.1)', borderRadius: 10 }}><Clock size={16} color={C.amber} /></div>
                              <span style={{ fontSize: 14, fontWeight: 600 }}>{selectedEvent.time}</span>
                          </div>
                      </div>
                      {selectedEvent.location && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#1e293b' }}>
                              <div style={{ padding: 8, background: 'rgba(34,197,94,0.1)', borderRadius: 10 }}><MapPin size={16} color={C.green} /></div>
                              <span style={{ fontSize: 14, fontWeight: 600 }}>{selectedEvent.location}</span>
                          </div>
                      )}
                  </div>
                  {selectedEvent.description && (
                      <div style={{ padding: '0 8px' }}>
                        <p style={{ margin: 0, fontSize: 15, color: C.sub, lineHeight: 1.7 }}>{selectedEvent.description}</p>
                      </div>
                  )}
                  <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                      <Btn variant="primary" icon={Bell} style={{ flex: 1 }} onClick={() => toast.success("Reminders sent to all stakeholders!")}>Broadcast Alert</Btn>
                      <Btn variant="secondary" onClick={() => setSelectedEvent(null)}>Dismiss</Btn>
                  </div>
              </div>
          </Modal>
      )}

      {showAdd && (
          <Modal title="Schedule New Academic Event" onClose={() => setShowAdd(false)}>
              <form onSubmit={handleAddEvent} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <Field label="Event Title"><Input placeholder="e.g., Annual Prize Distribution" required /></Field>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <Field label="Specific Date"><Input type="date" required /></Field>
                      <Field label="Commencement Time"><Input type="time" /></Field>
                  </div>
                  <Field label="Categorization">
                      <Select>
                          <option value="academic">Academic / Curricular</option>
                          <option value="holiday">Institutional Holiday</option>
                          <option value="exam">Examination Protocol</option>
                          <option value="event">Extracurricular Event</option>
                      </Select>
                  </Field>
                  <Field label="Context / Additional Details">
                      <textarea placeholder="Provide comprehensive details about the scheduled event..." style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 12, padding: 12, color: '#1e293b', fontSize: 14, outline: 'none', width: '100%', height: 100, resize: 'none' }}></textarea>
                  </Field>
                  <div style={{ marginTop: 10 }}>
                    <Btn type="submit" style={{ width: '100%' }}>Finalize & Publish Event</Btn>
                  </div>
              </form>
          </Modal>
      )}
    </div>
  );
}
