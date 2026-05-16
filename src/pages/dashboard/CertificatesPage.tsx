import { useState, useRef, useCallback } from 'react';
import { Award, Plus, Eye, Trash2, Printer, ShieldCheck, Mail, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { C, PageHeader, StatCard, SearchBar, Badge, Btn, Table, Tr, Td, Modal, Field, Input, Select, Avatar } from '@/lib/design-system';
import { useSchool } from '@/lib/school-context';

interface Certificate {
  id: number;
  studentName: string;
  fatherName: string;
  type: string;
  reason: string;
  issueDate: string;
  grade?: string;
  status: 'issued' | 'pending';
  serial: string;
}

const INITIAL: Certificate[] = [
  { id: 1, studentName: 'Muhammad Ahmad', fatherName: 'Muhammad Akram', type: 'Excellence in Mathematics', reason: 'Achieved highest marks in Annual Mathematics Examination 2026', issueDate: '2026-04-15', grade: 'A+', status: 'issued', serial: 'PK-CRT-1001' },
  { id: 2, studentName: 'Fatima Malik', fatherName: 'Malik Zulfiqar', type: 'Sports Achievement', reason: 'Outstanding performance in Inter-School Athletics Championship', issueDate: '2026-04-18', grade: '-', status: 'issued', serial: 'PK-CRT-1002' },
  { id: 3, studentName: 'Ali Hassan', fatherName: 'Hassan Raza', type: 'Perfect Attendance', reason: 'Maintained 100% attendance throughout the academic year 2025-2026', issueDate: '2026-05-01', grade: '-', status: 'pending', serial: 'PK-CRT-1003' },
  { id: 4, studentName: 'Sara Bibi', fatherName: 'Rasheed Ahmed', type: 'Science Fair Winner', reason: 'First position in Regional Science Exhibition 2026', issueDate: '2026-04-10', grade: 'A', status: 'issued', serial: 'PK-CRT-1004' },
];

const CERT_TYPES = [
  'Certificate of Excellence', 'Character Certificate', 'Sports Achievement Award',
  'Academic Merit Certificate', 'Participation Certificate', 'Perfect Attendance Award',
  'Science Fair Winner', 'Leadership Award', 'Best Student Award', 'Quran Recitation Award',
];

type CertTheme = { bg: string; border: string; text: string; accent: string; header: string };

function getCertTheme(type: string): CertTheme {
  const t = type.toLowerCase();
  if (t.includes('excellence') || t.includes('merit') || t.includes('best') || t.includes('quran'))
    return { bg: '#fffbeb', border: '#d97706', text: '#78350f', accent: '#d97706', header: '#92400e' };
  if (t.includes('science') || t.includes('academic') || t.includes('leadership'))
    return { bg: '#eff6ff', border: '#2563eb', text: '#1e3a5f', accent: '#2563eb', header: '#1e3a5f' };
  return { bg: '#f0fff4', border: '#059669', text: '#064e3b', accent: '#059669', header: '#065f46' };
}

function buildCertHtml(cert: Certificate, schoolName: string): string {
  const th = getCertTheme(cert.type);
  const hasGrade = cert.grade && cert.grade !== '-';
  return `<!DOCTYPE html><html><head>
<title>Certificate — ${cert.studentName}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  @page { size: A4 landscape; margin: 0; }
  body { font-family: 'Times New Roman', Georgia, serif; background: #fff; }
  .page { width: 297mm; height: 210mm; display: flex; align-items: center; justify-content: center; }
  .cert {
    width: 270mm; height: 190mm; margin: auto;
    background: ${th.bg};
    border: 8px double ${th.border};
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 12mm 18mm;
    text-align: center;
    position: relative;
  }
  .corner { position: absolute; font-size: 36px; color: ${th.border}; opacity: 0.3; line-height: 1; }
  .brand { font-size: 28px; font-weight: 900; color: ${th.header}; letter-spacing: 1px; }
  .brand span { color: ${th.border}; }
  .brand-sub { font-size: 9px; letter-spacing: 5px; color: ${th.text}; opacity: 0.6; margin-top: 3px; font-family: sans-serif; text-transform: uppercase; }
  .divider { width: 80px; border-top: 2px solid ${th.border}; margin: 10px auto; }
  .cert-title { font-size: 22px; font-weight: 900; letter-spacing: 2px; color: ${th.header}; text-transform: uppercase; margin: 6px 0; }
  .presented { font-size: 12px; font-style: italic; color: ${th.text}; opacity: 0.7; margin: 8px 0; font-family: sans-serif; }
  .student-name { font-size: 36px; font-weight: 900; color: ${th.accent}; border-bottom: 2px solid ${th.border}; padding-bottom: 5px; margin-bottom: 5px; }
  .father { font-size: 12px; color: ${th.text}; opacity: 0.7; margin-bottom: 12px; font-family: sans-serif; }
  .reason { max-width: 420px; font-size: 13px; line-height: 1.7; color: ${th.text}; font-family: sans-serif; }
  .grade-badge { display: inline-block; margin-top: 10px; padding: 5px 20px; border: 2px solid ${th.border}; font-size: 14px; font-weight: 900; color: ${th.accent}; letter-spacing: 2px; font-family: sans-serif; }
  .sigs { display: flex; gap: 70px; justify-content: center; margin-top: 20px; }
  .sig { text-align: center; }
  .sig-line { width: 120px; border-bottom: 1px solid ${th.border}; margin-bottom: 5px; }
  .sig-label { font-size: 11px; font-weight: 600; color: ${th.text}; font-family: sans-serif; }
  .footer { display: flex; justify-content: space-between; font-size: 9px; color: #aaa; font-family: monospace; position: absolute; bottom: 14px; left: 24px; right: 24px; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style></head><body>
<div class="page"><div class="cert">
  <span class="corner" style="top:10px;left:10px">❋</span>
  <span class="corner" style="top:10px;right:10px">❋</span>
  <span class="corner" style="bottom:10px;left:10px">❋</span>
  <span class="corner" style="bottom:10px;right:10px">❋</span>
  <div class="brand">Schol<span>ara</span></div>
  <div class="brand-sub">${schoolName}</div>
  <div class="divider"></div>
  <div class="cert-title">${cert.type}</div>
  <div class="presented">This certificate is proudly presented to</div>
  <div class="student-name">${cert.studentName}</div>
  <div class="father">S/O ${cert.fatherName}</div>
  <div class="reason">${cert.reason || 'for demonstrating exceptional dedication and outstanding achievement.'}</div>
  ${hasGrade ? `<div class="grade-badge">GRADE: ${cert.grade}</div>` : ''}
  <div class="sigs">
    <div class="sig"><div class="sig-line"></div><div class="sig-label">Class Teacher</div></div>
    <div class="sig"><div class="sig-line"></div><div class="sig-label">Principal</div></div>
  </div>
  <div class="footer">
    <span>Date: ${cert.issueDate}</span>
    <span>Serial No: ${cert.serial}</span>
  </div>
</div></div>
</body></html>`;
}

export default function CertificatesPage() {
  const { settings } = useSchool();
  const schoolName = settings?.name || 'Scholara School';

  const [certs, setCerts] = useState<Certificate[]>(INITIAL);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<Certificate | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const filtered = certs.filter(c =>
    c.studentName.toLowerCase().includes(search.toLowerCase()) ||
    c.type.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (!window.confirm('Permanently revoke and delete this certificate?')) return;
    setCerts(prev => prev.filter(c => c.id !== id));
    toast.success('Certificate revoked');
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const newCert: Certificate = {
      id: Date.now(),
      studentName: (form.elements.namedItem('student') as HTMLInputElement).value,
      fatherName: (form.elements.namedItem('father') as HTMLInputElement).value,
      type: (form.elements.namedItem('type') as HTMLSelectElement).value,
      reason: (form.elements.namedItem('reason') as HTMLInputElement).value,
      grade: (form.elements.namedItem('grade') as HTMLInputElement).value || undefined,
      issueDate: new Date().toISOString().split('T')[0],
      status: 'issued',
      serial: 'PK-CRT-' + (1000 + certs.length + 1),
    };
    setCerts([newCert, ...certs]);
    toast.success('Certificate issued!');
    setShowAdd(false);
  };

  // Print using hidden iframe — no popup blocker issues
  const handlePrint = useCallback((cert: Certificate) => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const html = buildCertHtml(cert, schoolName);
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;
    doc.open();
    doc.write(html);
    doc.close();
    setTimeout(() => {
      try { iframe.contentWindow?.print(); }
      catch { toast.error('Could not open print dialog. Please allow popups for this site.'); }
    }, 400);
  }, [schoolName]);

  const th = selected ? getCertTheme(selected.type) : getCertTheme('default');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Hidden print iframe */}
      <iframe ref={iframeRef} style={{ display: 'none' }} title="cert-print" />

      <PageHeader title="Certificates & Awards" sub="Issue and manage academic credentials and recognition">
        <Btn icon={Plus} onClick={() => setShowAdd(true)}>Issue New Certificate</Btn>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        <StatCard label="Total Issued" value={certs.filter(c => c.status === 'issued').length} icon={Award} color="#3b82f6" trend={{ type: 'up', val: '+2 this week' }} />
        <StatCard label="Pending Requests" value={certs.filter(c => c.status === 'pending').length} icon={ShieldCheck} color="#f59e0b" />
        <StatCard label="Certificate Types" value={CERT_TYPES.length} icon={Award} color="#22c55e" />
      </div>

      <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by student name or certificate type..." width="100%" />
      </div>

      <Table headers={['Student', 'Certificate', 'Issue Date', 'Status', 'Actions']}>
        {filtered.length > 0 ? filtered.map(c => (
          <Tr key={c.id}>
            <Td>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar name={c.studentName} size={36} color="#3b82f6" />
                <div>
                  <p style={{ margin: 0, fontWeight: 700, color: '#fff' }}>{c.studentName}</p>
                  <p style={{ margin: 0, fontSize: 11, color: C.sub }}>S/O {c.fatherName}</p>
                </div>
              </div>
            </Td>
            <Td>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#fff' }}>{c.serial}</p>
              <p style={{ margin: 0, fontSize: 11, color: C.amber }}>{c.type}</p>
            </Td>
            <Td>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.sub }}>
                <Calendar size={14} />
                <span style={{ fontSize: 13 }}>{c.issueDate}</span>
              </div>
            </Td>
            <Td><Badge label={c.status} variant={c.status === 'issued' ? 'success' : 'warning'} /></Td>
            <Td>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setSelected(c)} style={{ padding: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 10, border: 'none', cursor: 'pointer', color: C.sub }} title="Preview"><Eye size={16} /></button>
                <button onClick={() => handlePrint(c)} style={{ padding: 8, background: 'rgba(34,197,94,0.1)', borderRadius: 10, border: 'none', cursor: 'pointer', color: C.green }} title="Print"><Printer size={16} /></button>
                <button onClick={() => handleDelete(c.id)} style={{ padding: 8, background: 'rgba(239,68,68,0.1)', borderRadius: 10, border: 'none', cursor: 'pointer', color: C.red }} title="Delete"><Trash2 size={16} /></button>
              </div>
            </Td>
          </Tr>
        )) : (
          <Tr><Td colspan={5} style={{ textAlign: 'center', padding: '48px', color: C.muted }}>No certificates match your search.</Td></Tr>
        )}
      </Table>

      {/* Issue Modal */}
      {showAdd && (
        <Modal title="Issue New Certificate" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Field label="Student Name">
              <Input name="student" placeholder="Full name of student" required />
            </Field>
            <Field label="Father's Name">
              <Input name="father" placeholder="Father's full name" />
            </Field>
            <Field label="Certificate Type">
              <Select name="type">
                {CERT_TYPES.map(t => <option key={t}>{t}</option>)}
              </Select>
            </Field>
            <Field label="Reason / Achievement Description">
              <Input name="reason" placeholder="e.g. Achieved highest marks in Annual Examination 2026" />
            </Field>
            <Field label="Grade / Score (Optional)">
              <Input name="grade" placeholder="e.g. A+ or Distinction" />
            </Field>
            <div style={{ marginTop: 8 }}>
              <Btn type="submit" style={{ width: '100%' }}>Issue Certificate</Btn>
            </div>
          </form>
        </Modal>
      )}

      {/* Preview Modal */}
      {selected && (
        <Modal title="Certificate Preview" onClose={() => setSelected(null)} width={720}>
          {/* Certificate visual preview */}
          <div style={{
            background: th.bg, border: `6px double ${th.border}`,
            borderRadius: 4, padding: '36px 48px', textAlign: 'center',
            position: 'relative', color: th.text, fontFamily: "'Times New Roman', serif",
          }}>
            {(['tl','tr','bl','br'] as const).map(pos => (
              <span key={pos} style={{
                position: 'absolute', fontSize: 30, color: th.border, opacity: 0.25,
                top: pos.startsWith('t') ? 10 : undefined,
                bottom: pos.startsWith('b') ? 10 : undefined,
                left: pos.endsWith('l') ? 10 : undefined,
                right: pos.endsWith('r') ? 10 : undefined,
              }}>❋</span>
            ))}

            <div style={{ fontSize: 26, fontWeight: 900, color: th.header }}>
              Schol<span style={{ color: th.border }}>ara</span>
            </div>
            <div style={{ fontSize: 9, letterSpacing: 4, opacity: 0.6, marginTop: 2, fontFamily: 'sans-serif' }}>
              {schoolName.toUpperCase()}
            </div>

            <div style={{ width: 60, borderTop: `2px solid ${th.border}`, margin: '10px auto' }} />

            <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase', color: th.header, margin: '8px 0 6px' }}>
              {selected.type}
            </div>
            <p style={{ fontSize: 12, fontStyle: 'italic', opacity: 0.7, marginBottom: 10, fontFamily: 'sans-serif' }}>
              This certificate is proudly presented to
            </p>
            <div style={{ fontSize: 30, fontWeight: 900, color: th.accent, borderBottom: `2px solid ${th.border}`, paddingBottom: 5, marginBottom: 5 }}>
              {selected.studentName}
            </div>
            <p style={{ fontSize: 12, opacity: 0.7, marginBottom: 12, fontFamily: 'sans-serif' }}>S/O {selected.fatherName}</p>
            <p style={{ maxWidth: 400, margin: '0 auto', lineHeight: 1.7, fontSize: 13, fontFamily: 'sans-serif' }}>
              {selected.reason || 'for demonstrating exceptional dedication and outstanding achievement.'}
            </p>
            {selected.grade && selected.grade !== '-' && (
              <div style={{
                display: 'inline-block', marginTop: 10,
                padding: '4px 18px', border: `2px solid ${th.border}`,
                fontSize: 13, fontWeight: 900, color: th.accent,
                letterSpacing: 2, fontFamily: 'sans-serif',
              }}>
                GRADE: {selected.grade}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 60, marginTop: 20 }}>
              {['Class Teacher', 'Principal'].map(r => (
                <div key={r} style={{ textAlign: 'center' }}>
                  <div style={{ width: 110, borderBottom: `1px solid ${th.border}`, marginBottom: 4 }} />
                  <div style={{ fontSize: 11, fontWeight: 600, fontFamily: 'sans-serif' }}>{r}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, fontSize: 9, opacity: 0.4, fontFamily: 'monospace' }}>
              <span>Date: {selected.issueDate}</span>
              <span>Serial: {selected.serial}</span>
            </div>
          </div>

          <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
            <Btn onClick={() => handlePrint(selected)} icon={Printer} style={{ flex: 1 }}>
              Print Certificate
            </Btn>
            <Btn variant="secondary" icon={Mail} style={{ flex: 1 }}>
              Email to Parent
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
