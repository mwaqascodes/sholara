import { useState } from 'react';
import { UserPlus, CheckCircle, XCircle, Clock, Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface Application {
  id: string; name: string; fatherName: string; class: string;
  phone: string; appliedDate: string; status: 'pending' | 'approved' | 'rejected';
}

const applications: Application[] = [
  { id: '1', name: 'Ahmad Raza', fatherName: 'Raza Khan', class: 'Class 5', phone: '0300-1112233', appliedDate: '25/03/2026', status: 'pending' },
  { id: '2', name: 'Hira Batool', fatherName: 'Batool Shah', class: 'Class 3', phone: '0301-4445566', appliedDate: '24/03/2026', status: 'pending' },
  { id: '3', name: 'Waqar Ahmed', fatherName: 'Ahmed Hussain', class: 'Class 7', phone: '0302-7778899', appliedDate: '22/03/2026', status: 'approved' },
  { id: '4', name: 'Khadija Bibi', fatherName: 'Ali Raza', class: 'Class 1', phone: '0303-0001122', appliedDate: '20/03/2026', status: 'rejected' },
  { id: '5', name: 'Hamid Khan', fatherName: 'Khan Muhammad', class: 'Class 8', phone: '0304-3334455', appliedDate: '19/03/2026', status: 'approved' },
];

export default function AdmissionsPage() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const filtered = applications
    .filter(a => filter === 'all' || a.status === filter)
    .filter(a => a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold" style={{ color: '#f1f5f9' }}>Admissions</h2>
        <button className="glass-btn-primary flex items-center gap-2 text-sm"><UserPlus className="w-4 h-4" /> New Application</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending', count: applications.filter(a => a.status === 'pending').length, icon: Clock, color: '#f59e0b' },
          { label: 'Approved', count: applications.filter(a => a.status === 'approved').length, icon: CheckCircle, color: '#22c55e' },
          { label: 'Rejected', count: applications.filter(a => a.status === 'rejected').length, icon: XCircle, color: '#ef4444' },
        ].map(s => (
          <div key={s.label} className="glass-card text-center">
            <s.icon className="w-6 h-6 mx-auto mb-1" style={{ color: s.color }} />
            <p className="text-2xl font-bold font-display" style={{ color: s.color }}>{s.count}</p>
            <p className="text-xs" style={{ color: 'rgba(241,245,249,0.5)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(241,245,249,0.3)' }} />
          <input className="glass-input pl-10" placeholder="Search applications..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {['all', 'pending', 'approved', 'rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize ${filter === f ? 'glass-btn-primary' : 'glass-btn-secondary'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="glass-card overflow-x-auto">
        <table className="glass-table w-full">
          <thead>
            <tr><th>Name</th><th>Father</th><th>Class</th><th>Phone</th><th>Applied</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map(app => (
              <tr key={app.id}>
                <td className="font-medium">{app.name}</td>
                <td style={{ color: 'rgba(241,245,249,0.6)' }}>{app.fatherName}</td>
                <td>{app.class}</td>
                <td style={{ color: 'rgba(241,245,249,0.5)' }}>{app.phone}</td>
                <td style={{ color: 'rgba(241,245,249,0.5)' }}>{app.appliedDate}</td>
                <td>
                  <span className={app.status === 'approved' ? 'badge-success' : app.status === 'rejected' ? 'badge-danger' : 'badge-warning'}>
                    {app.status}
                  </span>
                </td>
                <td>
                  {app.status === 'pending' && (
                    <div className="flex gap-2">
                      <button className="badge-success cursor-pointer text-[10px]">Approve</button>
                      <button className="badge-danger cursor-pointer text-[10px]">Reject</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
