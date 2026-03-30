import { useState } from 'react';
import { Plus, BookOpen, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Homework {
  id: string; title: string; subject: string; class: string;
  dueDate: string; teacher: string; completionRate: number;
  status: 'active' | 'overdue' | 'completed';
}

const homeworks: Homework[] = [
  { id: '1', title: 'Math Chapter 5 Exercises', subject: 'Mathematics', class: 'Class 10', dueDate: '02/04/2026', teacher: 'Fatima Noor', completionRate: 72, status: 'active' },
  { id: '2', title: 'English Essay: My Country', subject: 'English', class: 'Class 10', dueDate: '01/04/2026', teacher: 'Sara Batool', completionRate: 85, status: 'active' },
  { id: '3', title: 'Urdu Grammar Worksheet', subject: 'Urdu', class: 'Class 9', dueDate: '28/03/2026', teacher: 'Muhammad Aslam', completionRate: 45, status: 'overdue' },
  { id: '4', title: 'Science Lab Report', subject: 'Science', class: 'Class 9', dueDate: '25/03/2026', teacher: 'Umar Farooq', completionRate: 100, status: 'completed' },
  { id: '5', title: 'Islamiat Chapter 8 Summary', subject: 'Islamiat', class: 'Class 8', dueDate: '03/04/2026', teacher: 'Amna Rashid', completionRate: 30, status: 'active' },
];

export default function HomeworkPage() {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? homeworks : homeworks.filter(h => h.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold" style={{ color: '#f1f5f9' }}>Homework & Assignments</h2>
        <button className="glass-btn-primary flex items-center gap-2 text-sm"><Plus className="w-4 h-4" /> Assign Homework</button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['all', 'active', 'overdue', 'completed'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filter === f ? 'glass-btn-primary' : 'glass-btn-secondary'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((hw, i) => (
          <motion.div key={hw.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card-hover">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" style={{ color: '#22c55e' }} />
                <span className="text-xs font-medium" style={{ color: 'rgba(241,245,249,0.5)' }}>{hw.subject}</span>
              </div>
              <span className={hw.status === 'active' ? 'badge-info' : hw.status === 'overdue' ? 'badge-danger' : 'badge-success'}>
                {hw.status}
              </span>
            </div>
            <h3 className="font-semibold text-sm mb-2" style={{ color: '#f1f5f9' }}>{hw.title}</h3>
            <div className="flex items-center gap-4 text-xs mb-3" style={{ color: 'rgba(241,245,249,0.4)' }}>
              <span>{hw.class}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {hw.dueDate}</span>
            </div>
            <div className="mb-1 flex items-center justify-between text-xs" style={{ color: 'rgba(241,245,249,0.5)' }}>
              <span>Completion</span>
              <span>{hw.completionRate}%</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="h-full rounded-full transition-all" style={{
                width: `${hw.completionRate}%`,
                background: hw.completionRate === 100 ? '#22c55e' : hw.completionRate > 60 ? '#3b82f6' : '#f59e0b',
              }} />
            </div>
            <p className="text-[10px] mt-2" style={{ color: 'rgba(241,245,249,0.35)' }}>Assigned by {hw.teacher}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
