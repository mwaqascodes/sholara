import { announcements } from '@/lib/demo-data';
import { Megaphone, Plus, Users, GraduationCap } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);

  const targetIcon: Record<string, React.ReactNode> = {
    all: <Users className="w-4 h-4" />,
    teachers: <GraduationCap className="w-4 h-4" />,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-bold">Announcements</h2>
        {user?.role === 'admin' && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Announcement
          </button>
        )}
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card-white max-w-lg">
          <h3 className="font-display font-semibold mb-4">Post Announcement</h3>
          <form className="space-y-3" onSubmit={e => { e.preventDefault(); setShowForm(false); }}>
            <div>
              <label className="text-sm text-muted-foreground">Title</label>
              <input className="input-field mt-1" placeholder="Announcement title" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Message</label>
              <textarea rows={4} className="input-field mt-1 resize-none" placeholder="Type your announcement..." />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Target Audience</label>
              <select className="input-field mt-1">
                <option value="all">All (Students + Teachers)</option>
                <option value="teachers">Teachers Only</option>
                <option value="Class 10">Class 10</option>
                <option value="Class 9">Class 9</option>
                <option value="Class 8">Class 8</option>
              </select>
            </div>
            <button type="submit" className="btn-primary w-full">Post Announcement</button>
          </form>
        </motion.div>
      )}

      <div className="space-y-4">
        {announcements.map((a, i) => (
          <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card-white">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Megaphone className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">{a.title}</h4>
                  <span className="badge bg-primary/10 text-primary flex items-center gap-1">
                    {targetIcon[a.target] || <Users className="w-3 h-3" />}
                    {a.target === 'all' ? 'All' : a.target === 'teachers' ? 'Teachers' : a.target}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{a.message}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>By {a.author}</span>
                  <span>•</span>
                  <span>{a.date}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
