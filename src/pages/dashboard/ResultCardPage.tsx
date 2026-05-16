import { useState, useRef, useCallback } from 'react';
import { Plus, Trash2, Download, Printer, MessageCircle } from 'lucide-react';
import { getGrade } from '@/lib/demo-data';
import { useSchool } from '@/lib/school-context';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const defaultSubjects = ['Urdu', 'English', 'Mathematics'];
const allSubjects = ['Urdu', 'English', 'Mathematics', 'General Science', 'Islamiat', 'Social Studies', 'Computer', 'Physics', 'Chemistry', 'Biology', 'Pak Studies', 'Arabic'];
const classes = ['Nursery', 'KG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];
const examTypes = ['Monthly Test', 'Mid-Term', 'Final/Annual', 'First Term', 'Second Term'];

interface SubjectRow {
  id: string;
  name: string;
  obtained: number;
  total: number;
}

export default function ResultCardPage() {
  const cardRef = useRef<HTMLDivElement>(null);
  const { settings } = useSchool();
  const [schoolNameOverride, setSchoolNameOverride] = useState<string | null>(null);
  const schoolName = schoolNameOverride ?? settings.name;
  const [form, setForm] = useState({
    studentName: '', fatherName: '', rollNo: '', phone: '',
    className: 'Class 5', examType: 'Mid-Term',
    academicYear: settings.academicYear || '2025-2026',
  });

  const [subjects, setSubjects] = useState<SubjectRow[]>(
    defaultSubjects.map((s, i) => ({ id: String(i), name: s, obtained: 0, total: 100 }))
  );

  const addSubject = () => {
    setSubjects(prev => [...prev, { id: Date.now().toString(), name: '', obtained: 0, total: 100 }]);
  };

  const removeSubject = (id: string) => {
    if (subjects.length <= 3) return;
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  const updateSubject = (id: string, field: keyof SubjectRow, value: string | number) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const totalObtained = subjects.reduce((s, sub) => s + sub.obtained, 0);
  const totalMax = subjects.reduce((s, sub) => s + sub.total, 0);
  const overallPct = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
  const overallGrade = getGrade(overallPct);
  const allPassed = subjects.every(s => s.total > 0 && (s.obtained / s.total) * 100 >= 40) && overallPct >= 40;

  const downloadPDF = useCallback(async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = (canvas.height * pdfW) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);
    pdf.save(`ResultCard_${form.studentName || 'Student'}_${form.rollNo || '0'}.pdf`);
  }, [form.studentName, form.rollNo]);

  const shareWhatsApp = () => {
    const msg = encodeURIComponent(`Hello! ${form.studentName}'s ${form.examType} result is ready. Please contact the school to collect the result card. — ${schoolName}`);
    const phone = form.phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/92${phone}?text=${msg}`, '_blank');
  };

  const today = new Date();
  const dateStr = `${today.getDate()} ${today.toLocaleString('en', { month: 'long' })} ${today.getFullYear()}`;

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold" style={{ color: '#f1f5f9' }}>Result Card Generator</h2>

      <div className="grid xl:grid-cols-2 gap-6">
        {/* Form */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card space-y-4">
          <h3 className="font-display font-semibold text-lg" style={{ color: '#f1f5f9' }}>Student Information</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: 'rgba(241,245,249,0.6)' }}>Student Name</label>
              <input className="glass-input" placeholder="Ali Hassan" value={form.studentName} onChange={e => setForm(p => ({ ...p, studentName: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: 'rgba(241,245,249,0.6)' }}>Father's Name</label>
              <input className="glass-input" placeholder="Muhammad Hassan" value={form.fatherName} onChange={e => setForm(p => ({ ...p, fatherName: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: 'rgba(241,245,249,0.6)' }}>Roll Number</label>
              <input className="glass-input" placeholder="001" value={form.rollNo} onChange={e => setForm(p => ({ ...p, rollNo: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: 'rgba(241,245,249,0.6)' }}>Phone / Contact</label>
              <input className="glass-input" placeholder="0300-1234567" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: 'rgba(241,245,249,0.6)' }}>Class</label>
              <select className="glass-select" value={form.className} onChange={e => setForm(p => ({ ...p, className: e.target.value }))}>
                {classes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: 'rgba(241,245,249,0.6)' }}>Exam Type</label>
              <select className="glass-select" value={form.examType} onChange={e => setForm(p => ({ ...p, examType: e.target.value }))}>
                {examTypes.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium mb-1 block" style={{ color: 'rgba(241,245,249,0.6)' }}>School Name (shown on certificate)</label>
              <input
                className="glass-input"
                placeholder="School name"
                value={schoolName}
                onChange={e => setSchoolNameOverride(e.target.value)}
              />
              <p className="text-[10px] mt-1" style={{ color: 'rgba(241,245,249,0.4)' }}>
                Default comes from school settings. Edit here to override for this card only.
              </p>
            </div>
          </div>

          <h3 className="font-display font-semibold text-lg pt-2" style={{ color: '#f1f5f9' }}>Subject Marks</h3>
          <div className="space-y-2">
            {/* Header */}
            <div className="grid grid-cols-[1fr_80px_80px_60px_50px_40px] gap-2 text-xs font-semibold" style={{ color: 'rgba(241,245,249,0.5)' }}>
              <span>Subject</span><span>Obtained</span><span>Total</span><span>%</span><span>Grade</span><span></span>
            </div>
            {subjects.map(sub => {
              const pct = sub.total > 0 ? (sub.obtained / sub.total) * 100 : 0;
              const grade = getGrade(pct);
              return (
                <div key={sub.id} className="grid grid-cols-[1fr_80px_80px_60px_50px_40px] gap-2 items-center">
                  <select className="glass-select text-sm py-1.5" value={sub.name} onChange={e => updateSubject(sub.id, 'name', e.target.value)}>
                    <option value="">Select</option>
                    {allSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <input type="number" className="glass-input text-center py-1.5" value={sub.obtained || ''} onChange={e => updateSubject(sub.id, 'obtained', Number(e.target.value))} />
                  <input type="number" className="glass-input text-center py-1.5" value={sub.total || ''} onChange={e => updateSubject(sub.id, 'total', Number(e.target.value))} />
                  <span className="text-sm text-center" style={{ color: pct < 40 ? '#ef4444' : '#22c55e' }}>{pct.toFixed(0)}%</span>
                  <span className={`text-xs text-center font-bold ${pct < 40 ? 'text-red-400' : 'text-green-400'}`}>{grade.grade}</span>
                  <button onClick={() => removeSubject(sub.id)} className="p-1 rounded hover:bg-red-500/20" disabled={subjects.length <= 3}>
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              );
            })}
          </div>
          <button onClick={addSubject} className="glass-btn-secondary flex items-center gap-2 text-sm w-full justify-center">
            <Plus className="w-4 h-4" /> Add Subject
          </button>

          {/* Actions */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <button onClick={downloadPDF} className="glass-btn-primary flex items-center justify-center gap-2 text-sm">
              <Download className="w-4 h-4" /> PDF
            </button>
            <button onClick={() => window.print()} className="glass-btn-secondary flex items-center justify-center gap-2 text-sm">
              <Printer className="w-4 h-4" /> Print
            </button>
            <button onClick={shareWhatsApp} className="flex items-center justify-center gap-2 text-sm font-semibold rounded-xl py-2.5 transition-all" style={{ background: '#25D366', color: 'white' }}>
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </button>
          </div>
        </motion.div>

        {/* Preview */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <div ref={cardRef} className="bg-white rounded-2xl overflow-hidden shadow-2xl" style={{ color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>
            {/* Header */}
            <div className="relative py-6 px-8 text-center text-white overflow-hidden" style={{ background: 'linear-gradient(135deg, #14532d, #166534, #15803d)' }}>
              <div className="absolute top-2 right-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ background: 'rgba(255,255,255,0.2)' }}>Official Result</div>
              <div className="w-14 h-14 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl font-bold" style={{ background: 'rgba(255,255,255,0.15)' }}>
                {schoolName.split(' ').map(w => w[0]).filter(Boolean).join('').slice(0, 2) || 'SC'}
              </div>
              <h2 className="text-xl font-bold">{schoolName || 'School Name'}</h2>
              <p className="text-white/60 text-xs mt-1">Excellence in Education</p>
            </div>

            {/* Exam title */}
            <div className="text-center py-3" style={{ borderBottom: '2px solid #16a34a' }}>
              <p className="text-sm font-bold uppercase tracking-wider" style={{ color: '#16a34a' }}>{form.examType || 'Exam'} — Result Card</p>
            </div>

            {/* Student info grid */}
            <div className="grid grid-cols-2 text-sm" style={{ borderBottom: '1px solid #e2e8f0' }}>
              {[
                ['Student Name', form.studentName || '—'],
                ["Father's Name", form.fatherName || '—'],
                ['Roll Number', form.rollNo || '—'],
                ['Class', form.className],
                ['Contact', form.phone || '—'],
                ['Academic Year', form.academicYear],
              ].map(([label, val], i) => (
                <div key={label} className="px-4 py-2.5 flex flex-col" style={{ background: i % 2 === 0 ? '#f0fdf4' : 'white', borderBottom: '1px solid #e2e8f0' }}>
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">{label}</span>
                  <span className="font-semibold text-gray-800 mt-0.5">{val}</span>
                </div>
              ))}
            </div>

            {/* Marks table */}
            <div className="px-4 py-3">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: '#14532d', color: 'white' }}>
                    <th className="py-2 px-3 text-left text-xs font-semibold rounded-l-lg">#</th>
                    <th className="py-2 px-3 text-left text-xs font-semibold">Subject</th>
                    <th className="py-2 px-3 text-center text-xs font-semibold">Marks</th>
                    <th className="py-2 px-3 text-center text-xs font-semibold">Total</th>
                    <th className="py-2 px-3 text-center text-xs font-semibold">%</th>
                    <th className="py-2 px-3 text-center text-xs font-semibold rounded-r-lg">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((sub, i) => {
                    const pct = sub.total > 0 ? (sub.obtained / sub.total) * 100 : 0;
                    const grade = getGrade(pct);
                    const failed = pct < 40;
                    return (
                      <tr key={sub.id} style={{ background: i % 2 === 0 ? 'white' : '#f9fffe' }}>
                        <td className="py-2 px-3 text-gray-400">{i + 1}</td>
                        <td className="py-2 px-3 font-medium">{sub.name || '—'}</td>
                        <td className={`py-2 px-3 text-center font-semibold ${failed ? 'text-red-600' : ''}`}>{sub.obtained}</td>
                        <td className="py-2 px-3 text-center text-gray-500">{sub.total}</td>
                        <td className={`py-2 px-3 text-center font-semibold ${failed ? 'text-red-600' : ''}`}>{pct.toFixed(0)}%</td>
                        <td className="py-2 px-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                            grade.grade === 'A+' ? 'bg-green-100 text-green-800' :
                            grade.grade === 'A' ? 'bg-green-50 text-green-700' :
                            grade.grade === 'B' ? 'bg-blue-50 text-blue-700' :
                            grade.grade === 'C' ? 'bg-yellow-50 text-yellow-700' :
                            grade.grade === 'D' ? 'bg-orange-50 text-orange-700' :
                            'bg-red-50 text-red-700'
                          }`}>{grade.grade}</span>
                        </td>
                      </tr>
                    );
                  })}
                  {/* Total row */}
                  <tr style={{ background: '#f0fdf4' }}>
                    <td className="py-2 px-3 font-bold" colSpan={2}>TOTAL</td>
                    <td className="py-2 px-3 text-center font-bold">{totalObtained}</td>
                    <td className="py-2 px-3 text-center font-bold">{totalMax}</td>
                    <td className="py-2 px-3 text-center font-bold">{overallPct.toFixed(1)}%</td>
                    <td className="py-2 px-3 text-center font-bold">{overallGrade.grade}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-4 gap-2 px-4 pb-3">
              {[
                { label: 'Marks Obtained', value: totalObtained },
                { label: 'Total Marks', value: totalMax },
                { label: 'Percentage', value: `${overallPct.toFixed(1)}%` },
                { label: 'Grade', value: overallGrade.grade },
              ].map(s => (
                <div key={s.label} className="text-center py-2 rounded-lg" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                  <p className="text-lg font-bold" style={{ color: '#166534' }}>{s.value}</p>
                  <p className="text-[10px] text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Result banner */}
            <div className="mx-4 mb-3 rounded-xl py-3 text-center" style={{
              background: allPassed ? 'linear-gradient(135deg, #dcfce7, #bbf7d0)' : 'linear-gradient(135deg, #fef2f2, #fecaca)',
            }}>
              <p className="text-lg font-bold" style={{ color: allPassed ? '#14532d' : '#991b1b' }}>
                RESULT: {allPassed ? 'PASS ✓' : 'FAIL ✗'}
              </p>
              <p className="text-xs mt-0.5" style={{ color: allPassed ? '#166534' : '#b91c1c' }}>
                {allPassed ? 'Congratulations! Promoted to the next class.' : 'Some subjects scored below 40% — please retake.'}
              </p>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-8 px-8 pb-3">
              {['Class Teacher', 'Principal'].map(role => (
                <div key={role} className="text-center pt-8">
                  <div style={{ borderTop: '1px dashed #94a3b8' }} className="pt-2">
                    <p className="text-xs font-medium text-gray-500">{role} Signature</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="text-center py-2 text-[9px] text-gray-400" style={{ borderTop: '1px solid #e2e8f0' }}>
              Issue Date: {dateStr} | {schoolName} | Generated by IlmDesk
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
