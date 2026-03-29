import { students } from '@/lib/demo-data';
import { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CertificatesPage() {
  const [selectedStudent, setSelectedStudent] = useState(students[0]);
  const [generated, setGenerated] = useState(false);

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Certificates / SLC</h2>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card-white">
          <h3 className="font-display font-semibold mb-4">Generate School Leaving Certificate</h3>
          <form className="space-y-3" onSubmit={e => { e.preventDefault(); setGenerated(true); }}>
            <div>
              <label className="text-sm text-muted-foreground">Select Student</label>
              <select className="input-field mt-1" value={selectedStudent.id} onChange={e => setSelectedStudent(students.find(s => s.id === e.target.value) || students[0])}>
                {students.map(s => <option key={s.id} value={s.id}>{s.name} — {s.class}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Reason for Leaving</label>
              <select className="input-field mt-1">
                <option>Transfer to another school</option>
                <option>Family relocation</option>
                <option>Completed education</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Date of Leaving</label>
              <input type="date" className="input-field mt-1" defaultValue="2026-03-29" />
            </div>
            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" /> Generate SLC
            </button>
          </form>
        </div>

        {generated && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-white">
            <div className="border-2 border-primary/20 rounded-xl p-6">
              <div className="text-center border-b-2 border-primary/20 pb-4 mb-4">
                <h3 className="font-display text-xl font-bold text-primary">Al-Noor Academy Lahore</h3>
                <p className="text-xs text-muted-foreground">123 Main Road, Gulberg III, Lahore</p>
                <p className="font-display font-semibold mt-2 text-sm">SCHOOL LEAVING CERTIFICATE</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-border/50 py-1">
                  <span className="text-muted-foreground">Student Name:</span>
                  <span className="font-medium">{selectedStudent.name}</span>
                </div>
                <div className="flex justify-between border-b border-border/50 py-1">
                  <span className="text-muted-foreground">Father's Name:</span>
                  <span className="font-medium">{selectedStudent.fatherName}</span>
                </div>
                <div className="flex justify-between border-b border-border/50 py-1">
                  <span className="text-muted-foreground">Date of Birth:</span>
                  <span className="font-medium">{selectedStudent.dob}</span>
                </div>
                <div className="flex justify-between border-b border-border/50 py-1">
                  <span className="text-muted-foreground">Class:</span>
                  <span className="font-medium">{selectedStudent.class}</span>
                </div>
                <div className="flex justify-between border-b border-border/50 py-1">
                  <span className="text-muted-foreground">Roll No:</span>
                  <span className="font-medium">{selectedStudent.rollNo}</span>
                </div>
                <div className="flex justify-between border-b border-border/50 py-1">
                  <span className="text-muted-foreground">Date of Leaving:</span>
                  <span className="font-medium">29/03/2026</span>
                </div>
                <div className="flex justify-between border-b border-border/50 py-1">
                  <span className="text-muted-foreground">Reason:</span>
                  <span className="font-medium">Transfer to another school</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Character:</span>
                  <span className="font-medium text-success">Good</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-8 mt-6 border-t border-border">
                <div className="text-center">
                  <div className="border-t border-foreground/30 pt-2 mt-8">
                    <p className="text-xs font-medium">Class Teacher</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="border-t border-foreground/30 pt-2 mt-8">
                    <p className="text-xs font-medium">Principal</p>
                  </div>
                </div>
              </div>

              <button className="btn-outline w-full mt-4 flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
