import { useState, useRef } from 'react';
import { Plus, Trash2, Printer, Download, GraduationCap, RotateCcw } from 'lucide-react';
import { PageHeader, Btn, Field, Input, Select } from '@/lib/design-system';

interface Subject {
  id: number;
  name: string;
  maxMarks: string;
  obtained: string;
}

interface StudentInfo {
  name: string;
  fatherName: string;
  motherName: string;
  className: string;
  section: string;
  rollNo: string;
  examTitle: string;
  year: string;
  school: string;
}

const EMPTY_STUDENT: StudentInfo = {
  name: '', fatherName: '', motherName: '', className: '', section: '',
  rollNo: '', examTitle: 'Annual Examination', year: '2026',
  school: 'Islamia Public School, Mirpur AJK',
};

const DEFAULT_SUBJECTS: Subject[] = [
  { id: 1, name: 'Urdu', maxMarks: '100', obtained: '' },
  { id: 2, name: 'English', maxMarks: '100', obtained: '' },
  { id: 3, name: 'Mathematics', maxMarks: '100', obtained: '' },
  { id: 4, name: 'Science', maxMarks: '100', obtained: '' },
  { id: 5, name: 'Islamiyat', maxMarks: '100', obtained: '' },
];

function getGrade(pct: number): { grade: string; label: string } {
  if (pct >= 90) return { grade: 'A+', label: 'Outstanding' };
  if (pct >= 80) return { grade: 'A',  label: 'Excellent'   };
  if (pct >= 70) return { grade: 'B',  label: 'Very Good'   };
  if (pct >= 60) return { grade: 'C',  label: 'Good'        };
  if (pct >= 50) return { grade: 'D',  label: 'Average'     };
  return { grade: 'F', label: 'Fail' };
}

function getGradeColor(grade: string): string {
  const map: Record<string, string> = {
    'A+': '#059669', A: '#10b981', B: '#2563eb',
    C: '#d97706', D: '#ea580c', F: '#dc2626',
  };
  return map[grade] ?? '#374151';
}

function getDivision(pct: number): string {
  if (pct >= 60) return '1st Division';
  if (pct >= 45) return '2nd Division';
  if (pct >= 33) return '3rd Division';
  return 'Fail';
}

export default function ResultCardPage() {
  const [student, setStudent] = useState<StudentInfo>(EMPTY_STUDENT);
  const [subjects, setSubjects] = useState<Subject[]>(DEFAULT_SUBJECTS);
  const [generated, setGenerated] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const setSField = (k: keyof StudentInfo) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setStudent(prev => ({ ...prev, [k]: e.target.value }));

  const addSubject = () =>
    setSubjects(prev => [...prev, { id: Date.now(), name: '', maxMarks: '100', obtained: '' }]);

  const removeSubject = (id: number) =>
    setSubjects(prev => prev.filter(s => s.id !== id));

  const updateSubject = (id: number, key: keyof Subject, val: string) =>
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, [key]: val } : s));

  const validSubjects = subjects.filter(s => s.name && s.maxMarks && s.obtained !== '');
  const totalMax = validSubjects.reduce((sum, s) => sum + Number(s.maxMarks), 0);
  const totalObt = validSubjects.reduce((sum, s) => sum + Number(s.obtained), 0);
  const percentage = totalMax > 0 ? Math.round((totalObt / totalMax) * 100) : 0;
  const { grade, label } = getGrade(percentage);
  const isPassed = validSubjects.length > 0 &&
    validSubjects.every(s => (Number(s.obtained) / Number(s.maxMarks)) * 100 >= 33) &&
    percentage >= 33;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (validSubjects.length === 0) {
      alert('Please add at least one subject with marks.');
      return;
    }
    setGenerated(true);
    setTimeout(() => {
      document.getElementById('result-preview')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html><html><head>
      <title>Result Card - ${student.name}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Times New Roman', serif; background: #fff; color: #1a1a1a; }
        .result-card { width: 210mm; min-height: 297mm; margin: 0 auto; padding: 20mm 15mm; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #999; padding: 8px 12px; font-size: 13px; }
        th { background: #1a365d; color: #fff; font-weight: 700; }
        .label { background: #f0f4f8; font-weight: 700; color: #2d3748; }
        .grade-box { border: 3px double #1a365d; padding: 16px; text-align: center; }
        @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
      </style></head><body>
      ${content.innerHTML}
      </body></html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); }, 500);
  };

  const handleReset = () => {
    setStudent(EMPTY_STUDENT);
    setSubjects(DEFAULT_SUBJECTS);
    setGenerated(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Result Card Generator"
        sub="Generate professional printable result cards for students"
      >
        {generated && (
          <>
            <Btn variant="secondary" icon={RotateCcw} onClick={handleReset}>Reset</Btn>
            <Btn icon={Printer} onClick={handlePrint}>Print Result Card</Btn>
          </>
        )}
      </PageHeader>

      {/* Form */}
      <form onSubmit={handleGenerate}>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* Student Information */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                <GraduationCap size={18} className="text-amber-600" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800">Student Information</h2>
                <p className="text-xs text-slate-400">Fill in the student's details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field label="Student Full Name">
                  <Input value={student.name} onChange={setSField('name')} placeholder="e.g. Muhammad Ahmad" required />
                </Field>
              </div>
              <Field label="Father's Name">
                <Input value={student.fatherName} onChange={setSField('fatherName')} placeholder="e.g. Muhammad Akram" required />
              </Field>
              <Field label="Mother's Name">
                <Input value={student.motherName} onChange={setSField('motherName')} placeholder="e.g. Fatima Bibi" />
              </Field>
              <Field label="Class / Grade">
                <Select value={student.className} onChange={setSField('className')} required>
                  <option value="">Select Class</option>
                  {['Nursery','KG','Class 1','Class 2','Class 3','Class 4','Class 5',
                    'Class 6','Class 7','Class 8','Class 9','Class 10'].map(c =>
                    <option key={c}>{c}</option>
                  )}
                </Select>
              </Field>
              <Field label="Section">
                <Select value={student.section} onChange={setSField('section')}>
                  <option value="">Select</option>
                  {['A','B','C','D'].map(s => <option key={s}>{s}</option>)}
                </Select>
              </Field>
              <Field label="Roll Number">
                <Input value={student.rollNo} onChange={setSField('rollNo')} placeholder="e.g. 15" required />
              </Field>
              <Field label="Examination Year">
                <Input value={student.year} onChange={setSField('year')} placeholder="2026" required />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Examination Title">
                  <Select value={student.examTitle} onChange={setSField('examTitle')}>
                    <option>Annual Examination</option>
                    <option>Half-Yearly Examination</option>
                    <option>Monthly Test</option>
                    <option>Unit Test</option>
                    <option>Pre-Board Examination</option>
                  </Select>
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="School Name">
                  <Input value={student.school} onChange={setSField('school')} placeholder="School name" required />
                </Field>
              </div>
            </div>
          </div>

          {/* Subjects */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Download size={18} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800">Subject Marks</h2>
                  <p className="text-xs text-slate-400">Enter marks for each subject</p>
                </div>
              </div>
              <button
                type="button"
                onClick={addSubject}
                className="flex items-center gap-1.5 text-xs font-bold text-amber-600 border border-amber-200 bg-amber-50 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors"
              >
                <Plus size={13} /> Add Subject
              </button>
            </div>

            {/* Column headers */}
            <div className="grid grid-cols-12 gap-2 mb-2 px-1">
              <span className="col-span-5 text-[10px] font-black text-slate-400 uppercase tracking-wider">Subject</span>
              <span className="col-span-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">Max</span>
              <span className="col-span-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">Obtained</span>
              <span className="col-span-1" />
            </div>

            <div className="flex flex-col gap-2 flex-1 overflow-y-auto max-h-[420px] pr-1">
              {subjects.map(s => {
                const pct = s.maxMarks && s.obtained !== '' ? (Number(s.obtained) / Number(s.maxMarks)) * 100 : -1;
                const subGrade = pct >= 0 ? getGrade(pct).grade : '';
                const subColor = pct >= 0 ? getGradeColor(subGrade) : '#94a3b8';
                return (
                  <div key={s.id} className="grid grid-cols-12 gap-2 items-center group">
                    <div className="col-span-5">
                      <input
                        value={s.name}
                        onChange={e => updateSubject(s.id, 'name', e.target.value)}
                        placeholder="Subject name"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:border-amber-400 focus:bg-white transition-colors"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number" min="1" max="1000"
                        value={s.maxMarks}
                        onChange={e => updateSubject(s.id, 'maxMarks', e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:border-amber-400 focus:bg-white transition-colors"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number" min="0"
                        max={s.maxMarks || undefined}
                        value={s.obtained}
                        onChange={e => updateSubject(s.id, 'obtained', e.target.value)}
                        placeholder="--"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:border-amber-400 focus:bg-white transition-colors"
                        style={{ borderColor: pct >= 0 && pct < 33 ? '#fca5a5' : '' }}
                      />
                    </div>
                    <div className="col-span-1 flex items-center justify-between">
                      {subGrade && (
                        <span className="text-[10px] font-black" style={{ color: subColor }}>{subGrade}</span>
                      )}
                      {subjects.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSubject(s.id)}
                          className="p-1 text-slate-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Running summary */}
            {validSubjects.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-slate-50 rounded-xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Total</p>
                  <p className="text-lg font-black text-slate-800">{totalObt}<span className="text-xs text-slate-400">/{totalMax}</span></p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Percentage</p>
                  <p className="text-lg font-black" style={{ color: getGradeColor(grade) }}>{percentage}%</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Grade</p>
                  <p className="text-lg font-black" style={{ color: getGradeColor(grade) }}>{grade}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-black text-sm rounded-xl shadow-lg shadow-amber-500/30 transition-all hover:scale-105 active:scale-95"
          >
            <GraduationCap size={18} />
            Generate Result Card
          </button>
        </div>
      </form>

      {/* Result Card Preview */}
      {generated && (
        <div id="result-preview" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-slate-800">Result Card Preview</h2>
            <div className="flex gap-2">
              <Btn variant="secondary" icon={RotateCcw} onClick={handleReset}>New Card</Btn>
              <Btn icon={Printer} onClick={handlePrint}>Print</Btn>
            </div>
          </div>

          {/* The printable card */}
          <div
            ref={printRef}
            className="result-card-print mx-auto"
            style={{
              maxWidth: 760,
              background: '#fff',
              color: '#1a1a2e',
              fontFamily: "'Times New Roman', serif",
              border: '1px solid #e2e8f0',
              borderRadius: 4,
            }}
          >
            {/* Decorative top border */}
            <div style={{ height: 8, background: 'linear-gradient(90deg, #1a365d 0%, #2b6cb0 50%, #1a365d 100%)' }} />

            <div style={{ padding: '28px 32px' }}>
              {/* Header */}
              <div style={{ textAlign: 'center', borderBottom: '2px solid #1a365d', paddingBottom: 16, marginBottom: 20 }}>
                {/* Logo placeholder */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 8 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, fontWeight: 900, color: '#fff', flexShrink: 0,
                  }}>P</div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: '#1a365d', letterSpacing: -0.5 }}>
                      Schol<span style={{ color: '#d97706' }}>ara</span>
                    </div>
                    <div style={{ fontSize: 11, color: '#4a5568', fontFamily: 'sans-serif', letterSpacing: 1 }}>
                      SCHOOL MANAGEMENT SYSTEM
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 14, color: '#4a5568', margin: '0 0 4px', fontFamily: 'sans-serif' }}>
                  {student.school}
                </p>
                <div style={{
                  display: 'inline-block', marginTop: 8,
                  background: '#1a365d', color: '#fff',
                  padding: '4px 24px', borderRadius: 2,
                  fontSize: 13, fontWeight: 700, letterSpacing: 2,
                  fontFamily: 'sans-serif',
                }}>
                  {student.examTitle.toUpperCase()} — {student.year}
                </div>
                <div style={{ marginTop: 6, fontSize: 16, fontWeight: 900, color: '#2b6cb0', letterSpacing: 1 }}>
                  RESULT CARD
                </div>
              </div>

              {/* Student Info Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20, fontSize: 13, fontFamily: 'sans-serif' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '6px 10px', background: '#f7fafc', border: '1px solid #e2e8f0', fontWeight: 700, width: '18%', color: '#4a5568' }}>Student Name</td>
                    <td style={{ padding: '6px 10px', border: '1px solid #e2e8f0', fontWeight: 700, color: '#1a202c', width: '32%' }}>{student.name}</td>
                    <td style={{ padding: '6px 10px', background: '#f7fafc', border: '1px solid #e2e8f0', fontWeight: 700, width: '18%', color: '#4a5568' }}>Roll No.</td>
                    <td style={{ padding: '6px 10px', border: '1px solid #e2e8f0', fontWeight: 700, color: '#1a202c', width: '32%' }}>{student.rollNo}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px 10px', background: '#f7fafc', border: '1px solid #e2e8f0', fontWeight: 700, color: '#4a5568' }}>Father's Name</td>
                    <td style={{ padding: '6px 10px', border: '1px solid #e2e8f0', color: '#1a202c' }}>{student.fatherName}</td>
                    <td style={{ padding: '6px 10px', background: '#f7fafc', border: '1px solid #e2e8f0', fontWeight: 700, color: '#4a5568' }}>Mother's Name</td>
                    <td style={{ padding: '6px 10px', border: '1px solid #e2e8f0', color: '#1a202c' }}>{student.motherName || '—'}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px 10px', background: '#f7fafc', border: '1px solid #e2e8f0', fontWeight: 700, color: '#4a5568' }}>Class</td>
                    <td style={{ padding: '6px 10px', border: '1px solid #e2e8f0', color: '#1a202c' }}>
                      {student.className}{student.section ? ` — Section ${student.section}` : ''}
                    </td>
                    <td style={{ padding: '6px 10px', background: '#f7fafc', border: '1px solid #e2e8f0', fontWeight: 700, color: '#4a5568' }}>Exam Year</td>
                    <td style={{ padding: '6px 10px', border: '1px solid #e2e8f0', color: '#1a202c' }}>{student.year}</td>
                  </tr>
                </tbody>
              </table>

              {/* Marks Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20, fontSize: 13, fontFamily: 'sans-serif' }}>
                <thead>
                  <tr>
                    {['S.No', 'Subject', 'Max Marks', 'Marks Obtained', 'Grade', 'Remarks'].map(h => (
                      <th key={h} style={{
                        background: '#1a365d', color: '#fff',
                        padding: '9px 10px', border: '1px solid #1a365d',
                        textAlign: 'center', fontWeight: 700, letterSpacing: 0.5,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {validSubjects.map((s, i) => {
                    const sPct = (Number(s.obtained) / Number(s.maxMarks)) * 100;
                    const sGrade = getGrade(sPct);
                    const passed = sPct >= 33;
                    return (
                      <tr key={s.id} style={{ background: i % 2 === 0 ? '#fff' : '#f7fafc' }}>
                        <td style={{ padding: '8px 10px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#718096' }}>{i + 1}</td>
                        <td style={{ padding: '8px 10px', border: '1px solid #e2e8f0', fontWeight: 600, color: '#1a202c' }}>{s.name}</td>
                        <td style={{ padding: '8px 10px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#4a5568' }}>{s.maxMarks}</td>
                        <td style={{ padding: '8px 10px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 700, color: '#1a202c' }}>{s.obtained}</td>
                        <td style={{ padding: '8px 10px', border: '1px solid #e2e8f0', textAlign: 'center', fontWeight: 900, color: getGradeColor(sGrade.grade) }}>{sGrade.grade}</td>
                        <td style={{ padding: '8px 10px', border: '1px solid #e2e8f0', textAlign: 'center', color: passed ? '#059669' : '#dc2626', fontWeight: 700, fontSize: 12 }}>
                          {passed ? 'Pass' : 'Fail'}
                        </td>
                      </tr>
                    );
                  })}
                  {/* Total row */}
                  <tr>
                    <td colSpan={2} style={{ padding: '9px 10px', border: '1px solid #e2e8f0', background: '#ebf4ff', fontWeight: 900, color: '#1a365d', textAlign: 'right', letterSpacing: 0.5 }}>TOTAL</td>
                    <td style={{ padding: '9px 10px', border: '1px solid #e2e8f0', background: '#ebf4ff', textAlign: 'center', fontWeight: 900, color: '#1a365d' }}>{totalMax}</td>
                    <td style={{ padding: '9px 10px', border: '1px solid #e2e8f0', background: '#ebf4ff', textAlign: 'center', fontWeight: 900, color: '#1a365d' }}>{totalObt}</td>
                    <td colSpan={2} style={{ padding: '9px 10px', border: '1px solid #e2e8f0', background: '#ebf4ff' }} />
                  </tr>
                </tbody>
              </table>

              {/* Result Summary */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'sans-serif' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '7px 10px', background: '#f7fafc', border: '1px solid #e2e8f0', fontWeight: 700, color: '#4a5568', width: '55%' }}>Total Marks Obtained</td>
                      <td style={{ padding: '7px 10px', border: '1px solid #e2e8f0', fontWeight: 900, color: '#1a202c' }}>{totalObt} / {totalMax}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '7px 10px', background: '#f7fafc', border: '1px solid #e2e8f0', fontWeight: 700, color: '#4a5568' }}>Percentage</td>
                      <td style={{ padding: '7px 10px', border: '1px solid #e2e8f0', fontWeight: 900, color: getGradeColor(grade) }}>{percentage}%</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '7px 10px', background: '#f7fafc', border: '1px solid #e2e8f0', fontWeight: 700, color: '#4a5568' }}>Grade</td>
                      <td style={{ padding: '7px 10px', border: '1px solid #e2e8f0', fontWeight: 900, color: getGradeColor(grade) }}>{grade} — {label}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '7px 10px', background: '#f7fafc', border: '1px solid #e2e8f0', fontWeight: 700, color: '#4a5568' }}>Division</td>
                      <td style={{ padding: '7px 10px', border: '1px solid #e2e8f0', fontWeight: 700, color: '#2b6cb0' }}>{getDivision(percentage)}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Result Badge */}
                <div style={{
                  border: `3px double ${isPassed ? '#059669' : '#dc2626'}`,
                  borderRadius: 6,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  padding: 20,
                  background: isPassed ? '#f0fff4' : '#fff5f5',
                }}>
                  <div style={{
                    fontSize: 40, fontWeight: 900,
                    color: isPassed ? '#059669' : '#dc2626',
                    lineHeight: 1,
                  }}>{grade}</div>
                  <div style={{
                    fontSize: 22, fontWeight: 900, marginTop: 8,
                    color: isPassed ? '#059669' : '#dc2626',
                    letterSpacing: 3,
                  }}>{isPassed ? 'PASS' : 'FAIL'}</div>
                  <div style={{ fontSize: 11, color: '#718096', marginTop: 4, fontFamily: 'sans-serif' }}>
                    {percentage}% — {label}
                  </div>
                </div>
              </div>

              {/* Grade Scale */}
              <div style={{
                background: '#f7fafc', border: '1px solid #e2e8f0',
                borderRadius: 4, padding: '10px 14px', marginBottom: 24,
                fontSize: 11, fontFamily: 'sans-serif', color: '#718096',
              }}>
                <strong style={{ color: '#4a5568' }}>Grade Scale: </strong>
                A+ (90-100%) · A (80-89%) · B (70-79%) · C (60-69%) · D (50-59%) · F (Below 50%) &nbsp;|&nbsp;
                <strong>Pass Criteria:</strong> Min. 33% in each subject and overall
              </div>

              {/* Signatures */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, fontFamily: 'sans-serif' }}>
                {['Class Teacher', 'Controller of Examinations', 'Principal'].map(role => (
                  <div key={role} style={{ textAlign: 'center' }}>
                    <div style={{ height: 50 }} />
                    <div style={{ borderTop: '1px solid #718096', paddingTop: 6 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: '#4a5568', margin: 0 }}>{role}</p>
                      <p style={{ fontSize: 10, color: '#a0aec0', margin: '2px 0 0' }}>Signature &amp; Stamp</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div style={{
                marginTop: 20, paddingTop: 12,
                borderTop: '1px solid #e2e8f0',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                fontSize: 10, color: '#a0aec0', fontFamily: 'sans-serif',
              }}>
                <span>Generated by Scholara — {new Date().toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span>This is a computer-generated document. No signature is required.</span>
              </div>
            </div>

            {/* Decorative bottom border */}
            <div style={{ height: 8, background: 'linear-gradient(90deg, #1a365d 0%, #2b6cb0 50%, #1a365d 100%)' }} />
          </div>
        </div>
      )}
    </div>
  );
}
