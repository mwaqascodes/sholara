import { attendanceData, students } from '@/lib/demo-data';
import { useState } from 'react';
import { Check, X } from 'lucide-react';

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState('10-A');
  const classStudents = students.filter(s => s.class === selectedClass);
  const [attendance, setAttendance] = useState<Record<string, boolean>>(
    Object.fromEntries(classStudents.map(s => [s.id, true]))
  );

  const classes = ['10-A', '10-B', '9-A', '9-B', '11-A'];

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Attendance</h2>

      <div className="flex gap-2 flex-wrap">
        {classes.map(c => (
          <button
            key={c}
            onClick={() => setSelectedClass(c)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedClass === c ? 'gradient-primary text-primary-foreground' : 'glass border border-border hover:bg-muted'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="glass-card">
        <h3 className="font-display font-semibold mb-4">Mark Attendance — {selectedClass}</h3>
        <div className="space-y-2">
          {classStudents.map(s => (
            <div key={s.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-xl">{s.avatar}</span>
                <div>
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">Roll #{s.rollNo}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setAttendance(p => ({ ...p, [s.id]: true }))}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                    attendance[s.id] ? 'bg-success text-success-foreground' : 'glass border border-border'
                  }`}
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setAttendance(p => ({ ...p, [s.id]: false }))}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                    attendance[s.id] === false ? 'bg-destructive text-destructive-foreground' : 'glass border border-border'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        {classStudents.length > 0 && (
          <button className="mt-4 w-full py-2.5 rounded-lg gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
            Save Attendance
          </button>
        )}
        {classStudents.length === 0 && (
          <p className="text-muted-foreground text-sm text-center py-8">No students found in {selectedClass}</p>
        )}
      </div>

      {/* Recent records */}
      <div className="glass-card">
        <h3 className="font-display font-semibold mb-4">Recent Records</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground py-2 px-2">Date</th>
                <th className="text-left text-xs font-semibold text-muted-foreground py-2 px-2">Class</th>
                <th className="text-left text-xs font-semibold text-muted-foreground py-2 px-2">Present</th>
                <th className="text-left text-xs font-semibold text-muted-foreground py-2 px-2">Absent</th>
                <th className="text-left text-xs font-semibold text-muted-foreground py-2 px-2">Rate</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.filter(a => a.class === selectedClass).map((a, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="py-2 px-2 text-sm">{a.date}</td>
                  <td className="py-2 px-2 text-sm">{a.class}</td>
                  <td className="py-2 px-2 text-sm text-success font-medium">{a.present}</td>
                  <td className="py-2 px-2 text-sm text-destructive font-medium">{a.absent}</td>
                  <td className="py-2 px-2 text-sm font-medium">{Math.round(a.present / a.total * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
