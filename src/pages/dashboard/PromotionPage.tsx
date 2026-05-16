import { students, allClasses } from '@/lib/demo-data';
import { useState } from 'react';
import { ArrowUpCircle, CheckCircle } from 'lucide-react';

export default function PromotionPage() {
  const [fromClass, setFromClass] = useState('Class 9');
  const toClass = allClasses[allClasses.indexOf(fromClass) + 1] || 'Graduated';
  const classStudents = students.filter(s => s.class === fromClass);
  const [selected, setSelected] = useState<Set<string>>(new Set(classStudents.map(s => s.id)));
  const [promoted, setPromoted] = useState(false);

  const toggleStudent = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === classStudents.length) setSelected(new Set());
    else setSelected(new Set(classStudents.map(s => s.id)));
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Class Promotion</h2>

      <div className="card-white max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div>
            <label className="text-sm text-muted-foreground">From Class</label>
            <select value={fromClass} onChange={e => { setFromClass(e.target.value); setPromoted(false); }} className="input-field mt-1">
              {allClasses.slice(0, -1).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <ArrowUpCircle className="w-8 h-8 text-primary mt-5" />
          <div>
            <label className="text-sm text-muted-foreground">To Class</label>
            <div className="input-field mt-1 bg-muted text-muted-foreground">{toClass}</div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium">{classStudents.length} students in {fromClass}</p>
          <button onClick={toggleAll} className="text-sm text-primary hover:underline">
            {selected.size === classStudents.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        <div className="space-y-2 mb-4">
          {classStudents.map(s => (
            <label key={s.id} className={`flex items-center gap-3 py-2 px-3 rounded-lg cursor-pointer transition-colors ${selected.has(s.id) ? 'bg-primary/5' : 'hover:bg-muted/30'}`}>
              <input type="checkbox" checked={selected.has(s.id)} onChange={() => toggleStudent(s.id)} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
              <span className="text-xl">{s.avatar}</span>
              <div className="flex-1">
                <p className="text-sm font-medium">{s.name}</p>
                <p className="text-xs text-muted-foreground">Roll #{s.rollNo} · GPA {s.gpa}</p>
              </div>
              {s.gpa < 2.0 && <span className="badge bg-destructive/10 text-destructive">Failed</span>}
            </label>
          ))}
        </div>

        {classStudents.length === 0 && (
          <p className="text-muted-foreground text-sm text-center py-4">No students in {fromClass}</p>
        )}

        {classStudents.length > 0 && (
          <button onClick={() => setPromoted(true)} className="btn-primary w-full flex items-center justify-center gap-2">
            <ArrowUpCircle className="w-4 h-4" />
            Promote {selected.size} Students to {toClass}
          </button>
        )}

        {promoted && (
          <p className="text-sm text-success mt-3 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> {selected.size} students promoted to {toClass}!</p>
        )}
      </div>
    </div>
  );
}
