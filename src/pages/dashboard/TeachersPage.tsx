import { teachers } from '@/lib/demo-data';
import { Search, Plus } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function TeachersPage() {
  const [search, setSearch] = useState('');
  const filtered = teachers.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-bold">Teachers</h2>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Teacher
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input type="text" placeholder="Search teachers..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" />
      </div>

      {/* Table view */}
      <div className="card-white overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="table-header">Photo</th>
              <th className="table-header">Name</th>
              <th className="table-header">Subject</th>
              <th className="table-header">Phone</th>
              <th className="table-header">Salary (PKR)</th>
              <th className="table-header">Classes</th>
              <th className="table-header">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => (
              <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="table-cell"><span className="text-2xl">{t.avatar}</span></td>
                <td className="table-cell">
                  <p className="font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.email}</p>
                </td>
                <td className="table-cell">{t.subject}</td>
                <td className="table-cell text-muted-foreground">{t.phone}</td>
                <td className="table-cell font-medium">PKR {t.salary.toLocaleString()}</td>
                <td className="table-cell">
                  <div className="flex flex-wrap gap-1">
                    {t.classes.map(c => (
                      <span key={c} className="badge bg-primary/10 text-primary">{c}</span>
                    ))}
                  </div>
                </td>
                <td className="table-cell">
                  <span className={`badge ${t.status === 'active' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>{t.status}</span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
