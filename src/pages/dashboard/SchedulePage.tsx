import { schedule } from '@/lib/demo-data';
import { Clock } from 'lucide-react';

export default function SchedulePage() {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Class Schedule</h2>
      <p className="text-sm text-muted-foreground">Today's timetable for Class 10-A</p>

      <div className="grid gap-3">
        {schedule.map((s, i) => (
          <div key={s.id} className="glass-card-hover flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center opacity-80 shrink-0">
              <span className="text-primary-foreground font-bold text-sm">{i + 1}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{s.subject}</p>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {s.time}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{s.teacher} · {s.room}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
