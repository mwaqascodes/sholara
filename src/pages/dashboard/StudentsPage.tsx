import { useState } from 'react';
import { students } from '@/lib/demo-data';
import { Search, Plus, Download, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudentsPage() {
  const [search, setSearch] = useState('');
  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.class.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold">Students</h2>
          <p className="text-sm text-muted-foreground">{students.length} total students</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg glass border border-border text-sm font-medium flex items-center gap-2 hover:bg-muted transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="px-4 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> Add Student
          </button>
        </div>
      </div>

      <div className="glass-card">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search students..."
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
                <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">Roll No</th>
                <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">Attendance</th>
                <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">GPA</th>
                <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">Parent</th>
                <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <motion.tr
                  key={s.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{s.avatar}</span>
                      <div>
                        <p className="text-sm font-medium">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-sm">{s.class}</td>
                  <td className="py-3 px-2 text-sm">{s.rollNo}</td>
                  <td className="py-3 px-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${s.attendance >= 90 ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                      {s.attendance}%
                    </span>
                  </td>
                  <td className="py-3 px-2 text-sm font-medium">{s.gpa}</td>
                  <td className="py-3 px-2 text-sm text-muted-foreground">{s.parentName}</td>
                  <td className="py-3 px-2">
                    <button className="p-1 rounded hover:bg-muted transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
