import { leaveRequests } from '@/lib/demo-data';
import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';
import { CheckCircle, XCircle, Clock, Plus, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LeavePage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [showForm, setShowForm] = useState(false);
  const [requests, setRequests] = useState(leaveRequests);

  const statusConfig = {
    pending: { icon: Clock, cls: 'bg-warning/10 text-warning' },
    approved: { icon: CheckCircle, cls: 'bg-success/10 text-success' },
    rejected: { icon: XCircle, cls: 'bg-destructive/10 text-destructive' },
  };

  const typeColors: Record<string, string> = {
    sick: 'bg-destructive/10 text-destructive',
    casual: 'bg-info/10 text-info',
    emergency: 'bg-warning/10 text-warning',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-bold">Leave Management</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Apply Leave
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card text-center">
          <p className="text-2xl font-bold font-display text-warning">{requests.filter(r => r.status === 'pending').length}</p>
          <p className="text-xs text-muted-foreground">Pending</p>
        </div>
        <div className="stat-card text-center">
          <p className="text-2xl font-bold font-display text-success">{requests.filter(r => r.status === 'approved').length}</p>
          <p className="text-xs text-muted-foreground">Approved</p>
        </div>
        <div className="stat-card text-center">
          <p className="text-2xl font-bold font-display text-destructive">{requests.filter(r => r.status === 'rejected').length}</p>
          <p className="text-xs text-muted-foreground">Rejected</p>
        </div>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="card-white max-w-lg">
          <h3 className="font-display font-semibold mb-4">Apply for Leave</h3>
          <form className="space-y-3" onSubmit={e => { e.preventDefault(); setShowForm(false); }}>
            <div>
              <label className="text-sm text-muted-foreground">Leave Type</label>
              <select className="input-field mt-1">
                <option value="sick">Sick Leave</option>
                <option value="casual">Casual Leave</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-sm text-muted-foreground">From</label><input type="date" className="input-field mt-1" /></div>
              <div><label className="text-sm text-muted-foreground">To</label><input type="date" className="input-field mt-1" /></div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Reason</label>
              <textarea rows={3} className="input-field mt-1 resize-none" placeholder="Describe your reason..." />
            </div>
            <button type="submit" className="btn-primary w-full">Submit Request</button>
          </form>
        </motion.div>
      )}

      <div className="space-y-3">
        {requests.map((r, i) => {
          const cfg = statusConfig[r.status];
          return (
            <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="card-white flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-sm">{r.applicant}</p>
                  <span className="text-xs text-muted-foreground">({r.role})</span>
                  <span className={`badge capitalize ${typeColors[r.type]}`}>{r.type}</span>
                </div>
                <p className="text-sm text-muted-foreground">{r.reason}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {r.from} → {r.to}</span>
                  <span>{r.days} day{r.days > 1 ? 's' : ''}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`badge capitalize flex items-center gap-1 ${cfg.cls}`}><cfg.icon className="w-3 h-3" /> {r.status}</span>
                {isAdmin && r.status === 'pending' && (
                  <div className="flex gap-1">
                    <button onClick={() => setRequests(prev => prev.map(x => x.id === r.id ? { ...x, status: 'approved' as const } : x))} className="p-1.5 rounded-lg bg-success/10 text-success hover:bg-success/20"><CheckCircle className="w-4 h-4" /></button>
                    <button onClick={() => setRequests(prev => prev.map(x => x.id === r.id ? { ...x, status: 'rejected' as const } : x))} className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20"><XCircle className="w-4 h-4" /></button>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
