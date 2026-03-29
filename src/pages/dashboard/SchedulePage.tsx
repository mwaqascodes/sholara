import { schedule, allClasses } from '@/lib/demo-data';
import { Clock } from 'lucide-react';
import { useState } from 'react';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function SchedulePage() {
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const classSchedule = schedule.filter(s => s.class === selectedClass);

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Timetable</h2>

      <div className="flex gap-2 flex-wrap">
        {allClasses.map(c => (
          <button key={c} onClick={() => setSelectedClass(c)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedClass === c ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-muted'}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="card-white">
        <h3 className="font-display font-semibold mb-4">Weekly Schedule — {selectedClass}</h3>
        {classSchedule.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="table-header">Period</th>
                  <th className="table-header">Time</th>
                  <th className="table-header">Subject</th>
                  <th className="table-header">Teacher</th>
                  <th className="table-header">Room</th>
                  <th className="table-header">Day</th>
                </tr>
              </thead>
              <tbody>
                {classSchedule.map(s => (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="table-cell">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-bold text-sm">{s.period}</span>
                      </div>
                    </td>
                    <td className="table-cell text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {s.time}</td>
                    <td className="table-cell font-medium">{s.subject}</td>
                    <td className="table-cell text-muted-foreground">{s.teacher}</td>
                    <td className="table-cell">{s.room}</td>
                    <td className="table-cell"><span className="badge bg-primary/10 text-primary">{s.day}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm text-center py-8">No schedule found for {selectedClass}. Schedule is available for Class 10.</p>
        )}
      </div>
    </div>
  );
}
