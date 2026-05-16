import { attendanceData, students, allClasses } from '@/lib/demo-data';
import { useState } from 'react';
import { Check, X, Minus } from 'lucide-react';
import { useI18n } from '@/lib/i18n-context';

export default function AttendancePage() {
  const { t } = useI18n();
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const classStudents = students.filter(s => s.class === selectedClass);
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'leave'>>(
    Object.fromEntries(classStudents.map(s => [s.id, 'present']))
  );
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">{t('nav.attendance')}</h2>

      <div className="flex gap-2 flex-wrap">
        {allClasses.map(c => (
          <button
            key={c}
            onClick={() => { setSelectedClass(c); setSaved(false); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedClass === c ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-muted'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="card-white">
        <h3 className="font-display font-semibold mb-4">Mark Attendance — {selectedClass}</h3>
        <p className="text-sm text-muted-foreground mb-3">Date: {new Date().toLocaleDateString('en-GB')}</p>
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
                  onClick={() => { setAttendance(p => ({ ...p, [s.id]: 'present' })); setSaved(false); }}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                    attendance[s.id] === 'present' ? 'bg-success text-success-foreground' : 'border border-border'
                  }`}
                  title="Present"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { setAttendance(p => ({ ...p, [s.id]: 'absent' })); setSaved(false); }}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                    attendance[s.id] === 'absent' ? 'bg-destructive text-destructive-foreground' : 'border border-border'
                  }`}
                  title="Absent"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { setAttendance(p => ({ ...p, [s.id]: 'leave' })); setSaved(false); }}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                    attendance[s.id] === 'leave' ? 'bg-warning text-warning-foreground' : 'border border-border'
                  }`}
                  title="Leave"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        {classStudents.length > 0 && (
          <button onClick={() => setSaved(true)} className="mt-4 w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors">
            {saved ? '✓ Attendance Saved!' : 'Save Attendance'}
          </button>
        )}
        {classStudents.length === 0 && (
          <p className="text-muted-foreground text-sm text-center py-8">No students in {selectedClass}</p>
        )}
      </div>

      {/* History */}
      <div className="card-white">
        <h3 className="font-display font-semibold mb-4">Recent Records</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="table-header">Date</th>
                <th className="table-header">Class</th>
                <th className="table-header">Present</th>
                <th className="table-header">Absent</th>
                <th className="table-header">Leave</th>
                <th className="table-header">Rate</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.filter(a => a.class === selectedClass).map((a, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="table-cell">{a.date}</td>
                  <td className="table-cell">{a.class}</td>
                  <td className="table-cell text-success font-medium">{a.present}</td>
                  <td className="table-cell text-destructive font-medium">{a.absent}</td>
                  <td className="table-cell text-warning font-medium">{a.leave}</td>
                  <td className="table-cell font-medium">{Math.round(a.present / a.total * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
