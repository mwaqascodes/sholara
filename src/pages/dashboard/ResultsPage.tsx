import { results } from '@/lib/demo-data';
import { useState } from 'react';
import { Search, Download } from 'lucide-react';

export default function ResultsPage() {
  const [search, setSearch] = useState('');
  const filtered = results.filter(r =>
    r.studentName.toLowerCase().includes(search.toLowerCase()) ||
    r.subject.toLowerCase().includes(search.toLowerCase())
  );

  const gradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-success/10 text-success';
    if (grade.startsWith('B')) return 'bg-info/10 text-info';
    return 'bg-warning/10 text-warning';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-bold">Results</h2>
        <button className="px-4 py-2 rounded-lg glass border border-border text-sm font-medium flex items-center gap-2 hover:bg-muted transition-colors">
          <Download className="w-4 h-4" /> Export Report Cards
        </button>
      </div>

      <div className="glass-card">
        <div className="relative mb-4 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by student or subject..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-transparent"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">Student</th>
                <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">Class</th>
                <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">Subject</th>
                <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">Marks</th>
                <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">Percentage</th>
                <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">Grade</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-2 text-sm font-medium">{r.studentName}</td>
                  <td className="py-3 px-2 text-sm">{r.class}</td>
                  <td className="py-3 px-2 text-sm">{r.subject}</td>
                  <td className="py-3 px-2 text-sm">{r.marks}/{r.total}</td>
                  <td className="py-3 px-2 text-sm">{r.marks}%</td>
                  <td className="py-3 px-2">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${gradeColor(r.grade)}`}>{r.grade}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
