import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface CalendarEvent {
  id: string; date: number; month: number; year: number;
  title: string; type: 'exam' | 'holiday' | 'event' | 'fee';
}

const events: CalendarEvent[] = [
  { id: '1', date: 23, month: 2, year: 2026, title: 'Pakistan Day', type: 'holiday' },
  { id: '2', date: 1, month: 3, year: 2026, title: 'Fee Due Date', type: 'fee' },
  { id: '3', date: 15, month: 3, year: 2026, title: 'Annual Exams Start', type: 'exam' },
  { id: '4', date: 25, month: 3, year: 2026, title: 'Annual Day', type: 'event' },
  { id: '5', date: 1, month: 4, year: 2026, title: 'Labour Day', type: 'holiday' },
  { id: '6', date: 14, month: 7, year: 2026, title: 'Independence Day', type: 'holiday' },
  { id: '7', date: 5, month: 1, year: 2026, title: 'Kashmir Day', type: 'holiday' },
  { id: '8', date: 10, month: 3, year: 2026, title: 'Sports Week Start', type: 'event' },
];

const typeColors: Record<string, { bg: string; text: string; border: string }> = {
  exam: { bg: 'rgba(34,197,94,0.15)', text: '#22c55e', border: 'rgba(34,197,94,0.4)' },
  holiday: { bg: 'rgba(239,68,68,0.15)', text: '#ef4444', border: 'rgba(239,68,68,0.4)' },
  event: { bg: 'rgba(59,130,246,0.15)', text: '#3b82f6', border: 'rgba(59,130,246,0.4)' },
  fee: { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b', border: 'rgba(245,158,11,0.4)' },
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); // March 2026
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthName = currentDate.toLocaleString('en', { month: 'long', year: 'numeric' });

  const monthEvents = events.filter(e => e.month === month && e.year === year);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const prev = () => setCurrentDate(new Date(year, month - 1, 1));
  const next = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold" style={{ color: '#f1f5f9' }}>Academic Calendar</h2>
        <button className="glass-btn-primary flex items-center gap-2 text-sm"><Plus className="w-4 h-4" /> Add Event</button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Calendar grid */}
        <div className="lg:col-span-3 glass-card">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prev} className="p-2 rounded-lg hover:bg-white/10"><ChevronLeft className="w-5 h-5" style={{ color: '#f1f5f9' }} /></button>
            <h3 className="font-display font-bold text-lg" style={{ color: '#f1f5f9' }}>{monthName}</h3>
            <button onClick={next} className="p-2 rounded-lg hover:bg-white/10"><ChevronRight className="w-5 h-5" style={{ color: '#f1f5f9' }} /></button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-center text-xs font-semibold py-2" style={{ color: 'rgba(241,245,249,0.4)' }}>{d}</div>
            ))}
            {blanks.map(b => <div key={`b${b}`} />)}
            {days.map(day => {
              const dayEvents = monthEvents.filter(e => e.date === day);
              const isToday = day === 30 && month === 2 && year === 2026;
              return (
                <div key={day} className={`min-h-[60px] p-1.5 rounded-lg text-sm ${isToday ? 'ring-2 ring-green-500' : ''}`} style={{ background: isToday ? 'rgba(22,163,74,0.1)' : 'rgba(255,255,255,0.02)' }}>
                  <span className="text-xs font-medium" style={{ color: isToday ? '#22c55e' : 'rgba(241,245,249,0.6)' }}>{day}</span>
                  {dayEvents.map(e => {
                    const tc = typeColors[e.type];
                    return (
                      <div key={e.id} className="mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium truncate" style={{ background: tc.bg, color: tc.text, border: `1px solid ${tc.border}` }}>
                        {e.title}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar events */}
        <div className="glass-card space-y-3">
          <h3 className="font-display font-semibold" style={{ color: '#f1f5f9' }}>Upcoming Events</h3>
          {events.slice(0, 6).map(e => {
            const tc = typeColors[e.type];
            return (
              <div key={e.id} className="flex items-start gap-3 p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: tc.text }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: '#f1f5f9' }}>{e.title}</p>
                  <p className="text-xs" style={{ color: 'rgba(241,245,249,0.4)' }}>{e.date}/{e.month + 1}/{e.year}</p>
                </div>
              </div>
            );
          })}
          <div className="grid grid-cols-2 gap-2 pt-2">
            {Object.entries(typeColors).map(([type, tc]) => (
              <div key={type} className="flex items-center gap-2 text-xs" style={{ color: tc.text }}>
                <div className="w-2 h-2 rounded-full" style={{ background: tc.text }} />
                <span className="capitalize">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
