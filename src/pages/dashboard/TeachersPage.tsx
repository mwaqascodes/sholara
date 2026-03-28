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
        <button className="px-4 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Add Teacher
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search teachers..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-transparent"
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card-hover"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{t.avatar}</span>
              <div>
                <p className="font-semibold">{t.name}</p>
                <p className="text-sm text-muted-foreground">{t.subject}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">📧 {t.email}</p>
              <p className="text-muted-foreground">📱 {t.phone}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {t.classes.map(c => (
                  <span key={c} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">{c}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
