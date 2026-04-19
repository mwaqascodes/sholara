import { useState } from 'react';
import { allClasses } from '@/lib/demo-data';
import { useActionStore, actionStore } from '@/lib/action-store';
import { Search, Plus, Download, MoreHorizontal, Eye, Edit, Trash2, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudentsPage() {
  const { students } = useActionStore();
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<typeof students[0] | null>(null);

  const filtered = students.filter(s => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.fatherName.toLowerCase().includes(search.toLowerCase())) return false;
    if (classFilter !== 'all' && s.class !== classFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold">Students</h2>
          <p className="text-sm text-muted-foreground">{students.length} total students</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-outline flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Student
          </button>
        </div>
      </div>

      {/* Add Student Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card-white max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-lg">Add New Student</h3>
              <button onClick={() => setShowForm(false)} className="p-1 rounded hover:bg-muted"><X className="w-5 h-5" /></button>
            </div>
            <form className="space-y-3" onSubmit={e => { e.preventDefault(); setShowForm(false); }}>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm text-muted-foreground">Full Name (English)</label><input className="input-field mt-1" placeholder="e.g. Ali Hassan" /></div>
                <div><label className="text-sm text-muted-foreground">Full Name (Urdu)</label><input className="input-field mt-1 font-urdu" placeholder="علی حسن" dir="rtl" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm text-muted-foreground">Father's Name</label><input className="input-field mt-1" placeholder="e.g. Muhammad Hassan" /></div>
                <div><label className="text-sm text-muted-foreground">Date of Birth</label><input type="date" className="input-field mt-1" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-muted-foreground">Class</label>
                  <select className="input-field mt-1">{allClasses.map(c => <option key={c}>{c}</option>)}</select>
                </div>
                <div><label className="text-sm text-muted-foreground">Section</label><input className="input-field mt-1" placeholder="A" /></div>
              </div>
              <div><label className="text-sm text-muted-foreground">Address</label><input className="input-field mt-1" placeholder="House #, Street, City" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm text-muted-foreground">Phone Number</label><input className="input-field mt-1" placeholder="0300-1234567" /></div>
                <div><label className="text-sm text-muted-foreground">Emergency Contact</label><input className="input-field mt-1" placeholder="0321-9876543" /></div>
              </div>
              <button type="submit" className="btn-primary w-full mt-2">Save Student</button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Student Profile Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedStudent(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card-white max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-lg">Student Profile</h3>
              <button onClick={() => setSelectedStudent(null)} className="p-1 rounded hover:bg-muted"><X className="w-5 h-5" /></button>
            </div>
            <div className="text-center mb-4">
              <span className="text-5xl">{selectedStudent.avatar}</span>
              <h4 className="font-display text-xl font-bold mt-2">{selectedStudent.name}</h4>
              <p className="font-urdu text-lg text-muted-foreground">{selectedStudent.nameUrdu}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">Father:</span> <span className="font-medium">{selectedStudent.fatherName}</span></div>
              <div><span className="text-muted-foreground">Class:</span> <span className="font-medium">{selectedStudent.class} ({selectedStudent.section})</span></div>
              <div><span className="text-muted-foreground">Roll No:</span> <span className="font-medium">{selectedStudent.rollNo}</span></div>
              <div><span className="text-muted-foreground">Phone:</span> <span className="font-medium">{selectedStudent.phone}</span></div>
              <div><span className="text-muted-foreground">DOB:</span> <span className="font-medium">{selectedStudent.dob}</span></div>
              <div><span className="text-muted-foreground">Attendance:</span> <span className="font-medium">{selectedStudent.attendance}%</span></div>
              <div><span className="text-muted-foreground">GPA:</span> <span className="font-medium">{selectedStudent.gpa}</span></div>
              <div><span className="text-muted-foreground">Status:</span> <span className={`badge ${selectedStudent.status === 'active' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>{selectedStudent.status}</span></div>
            </div>
            <div className="mt-3 text-sm"><span className="text-muted-foreground">Address:</span> <span>{selectedStudent.address}</span></div>
          </motion.div>
        </div>
      )}

      <div className="card-white">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" />
          </div>
          <select value={classFilter} onChange={e => setClassFilter(e.target.value)} className="input-field w-auto">
            <option value="all">All Classes</option>
            {allClasses.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="table-header">Photo</th>
                <th className="table-header">Name</th>
                <th className="table-header">Father Name</th>
                <th className="table-header">Class</th>
                <th className="table-header">Roll No</th>
                <th className="table-header">Phone</th>
                <th className="table-header">Attendance</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="table-cell"><span className="text-xl">{s.avatar}</span></td>
                  <td className="table-cell font-medium">{s.name}</td>
                  <td className="table-cell text-muted-foreground">{s.fatherName}</td>
                  <td className="table-cell">{s.class}</td>
                  <td className="table-cell">{s.rollNo}</td>
                  <td className="table-cell text-muted-foreground">{s.phone}</td>
                  <td className="table-cell">
                    <span className={`badge ${s.attendance >= 90 ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>{s.attendance}%</span>
                  </td>
                  <td className="table-cell">
                    <span className={`badge ${s.status === 'active' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>{s.status}</span>
                  </td>
                  <td className="table-cell">
                    <div className="flex gap-1">
                      <button onClick={() => setSelectedStudent(s)} className="p-1.5 rounded hover:bg-muted" title="View"><Eye className="w-4 h-4 text-muted-foreground" /></button>
                      <button className="p-1.5 rounded hover:bg-muted" title="Edit"><Edit className="w-4 h-4 text-muted-foreground" /></button>
                      <button className="p-1.5 rounded hover:bg-muted" title="Delete"><Trash2 className="w-4 h-4 text-destructive" /></button>
                    </div>
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
