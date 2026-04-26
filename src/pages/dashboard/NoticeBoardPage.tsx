import { useState } from 'react';
import { Pin, Bell, Plus, Trash2, Megaphone, Users, BookOpen, CreditCard, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { C, PageHeader, StatCard, Badge, Btn, Modal, Field, Input, Select } from '@/lib/design-system';

interface Notice {
  id: string;
  title: string;
  body: string;
  type: 'general' | 'urgent' | 'academic' | 'fee' | 'event';
  audience: 'all' | 'teachers' | 'students' | 'parents';
  pinned: boolean;
  authorName: string;
  publishedAt: string;
  expiresAt?: string;
}

const NOTICES_KEY = 'Scholara_notices_v1';

const TYPE_ICONS: Record<string, any> = {
  general: Bell, urgent: Bell, academic: BookOpen, fee: CreditCard, event: Calendar,
};

const TYPE_COLORS: Record<string, string> = {
  general: '#64748b', urgent: '#ef4444', academic: '#3b82f6', fee: '#f59e0b', event: '#8b5cf6',
};

const TYPE_VARIANTS: Record<string, 'default'|'danger'|'info'|'warning'|'success'> = {
  general: 'default', urgent: 'danger', academic: 'info', fee: 'warning', event: 'success',
};

function loadNotices(): Notice[] {
  try { const raw = localStorage.getItem(NOTICES_KEY); if (raw) return JSON.parse(raw); } catch {}
  return [
    { id: 'n1', title: 'Mid-Term Examination Schedule 2026', body: 'Dear students and parents,\n\nThe mid-term examinations will commence from May 10, 2026. Detailed timetable has been shared in classrooms. Students are advised to start preparation well in advance.\n\nAll students must bring their student cards on exam days.', type: 'academic', audience: 'all', pinned: true, authorName: 'Principal Office', publishedAt: '2026-04-20T09:00:00', expiresAt: '2026-05-20T00:00:00' },
    { id: 'n2', title: 'Fee Submission Deadline — April 2026', body: 'All parents are requested to submit the monthly fee for April 2026 by April 15, 2026. A late fee of ₨200 will be charged after the deadline.\n\nPayment can be made via cash, JazzCash, or EasyPaisa.', type: 'fee', audience: 'parents', pinned: true, authorName: 'Accounts Department', publishedAt: '2026-04-01T08:00:00' },
    { id: 'n3', title: 'Annual Sports Day — May 15, 2026', body: 'We are pleased to announce the Annual Sports Day on May 15, 2026. All students are encouraged to participate in various sports events.\n\nRegistration forms available from the sports teacher. Last date for registration: May 5, 2026.', type: 'event', audience: 'all', pinned: false, authorName: 'Sports Department', publishedAt: '2026-04-18T10:00:00' },
    { id: 'n4', title: 'URGENT: School Closed Tomorrow', body: 'Due to unexpected maintenance work in the school building, the school will remain closed tomorrow (April 23, 2026). Online classes will be conducted as per the normal timetable.\n\nParents are requested to inform their children accordingly.', type: 'urgent', audience: 'all', pinned: false, authorName: 'Principal', publishedAt: '2026-04-22T06:00:00' },
    { id: 'n5', title: 'Parent-Teacher Meeting — April 28', body: 'The quarterly Parent-Teacher Meeting is scheduled for April 28, 2026 from 9:00 AM to 1:00 PM. Parents are requested to attend and discuss their child\'s academic progress with the respective teachers.', type: 'general', audience: 'parents', pinned: false, authorName: 'Admin Office', publishedAt: '2026-04-15T11:00:00' },
  ];
}

function saveNotices(data: Notice[]) { localStorage.setItem(NOTICES_KEY, JSON.stringify(data)); }

function timeSince(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours} hours ago`;
  return `${Math.floor(hours / 24)} days ago`;
}

const AUDIENCE_LABELS: Record<string, string> = { all: 'Everyone', teachers: 'Teachers', students: 'Students', parents: 'Parents' };

export default function NoticeBoardPage() {
  const [notices, setNotices] = useState<Notice[]>(loadNotices);
  const [showAdd, setShowAdd] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');
  const [form, setForm] = useState({ title: '', body: '', type: 'general' as Notice['type'], audience: 'all' as Notice['audience'], expiresAt: '' });

  const sorted = [...notices].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  const filtered = typeFilter === 'all' ? sorted : sorted.filter(n => n.type === typeFilter);

  const pinCount = notices.filter(n => n.pinned).length;
  const urgentCount = notices.filter(n => n.type === 'urgent').length;

  const togglePin = (id: string) => {
    const updated = notices.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n);
    setNotices(updated);
    saveNotices(updated);
    toast.success('Notice updated');
  };

  const deleteNotice = (id: string) => {
    if (!window.confirm('Delete this notice?')) return;
    const updated = notices.filter(n => n.id !== id);
    setNotices(updated);
    saveNotices(updated);
    toast.success('Notice removed');
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) { toast.error('Title and content required'); return; }
    const newNotice: Notice = {
      id: `n${Date.now()}`,
      ...form,
      pinned: false,
      authorName: 'Admin',
      publishedAt: new Date().toISOString(),
    };
    const updated = [newNotice, ...notices];
    setNotices(updated);
    saveNotices(updated);
    toast.success('Notice published!');
    setShowAdd(false);
    setForm({ title: '', body: '', type: 'general', audience: 'all', expiresAt: '' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader title="Notice Board" sub="School-wide announcements and notifications">
        <Btn icon={Plus} onClick={() => setShowAdd(true)}>Post Notice</Btn>
      </PageHeader>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        <StatCard label="Total Notices"  value={notices.length}  icon={Megaphone} color="#3b82f6" />
        <StatCard label="Pinned"         value={pinCount}        icon={Pin}       color="#f59e0b" />
        <StatCard label="Urgent Alerts"  value={urgentCount}     icon={Bell}      color="#ef4444" />
        <StatCard label="Active Today"   value={notices.filter(n => !n.expiresAt || new Date(n.expiresAt) > new Date()).length} icon={Calendar} color="#10b981" />
      </div>

      {/* Type Filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {['all', 'general', 'urgent', 'academic', 'fee', 'event'].map(t => (
          <button key={t} onClick={() => setTypeFilter(t)} style={{
            padding: '8px 16px', borderRadius: 20, border: `1px solid ${typeFilter === t ? TYPE_COLORS[t] || '#f59e0b' : '#e2e8f0'}`,
            background: typeFilter === t ? `${TYPE_COLORS[t] || '#f59e0b'}15` : '#fff',
            color: typeFilter === t ? TYPE_COLORS[t] || '#d97706' : C.sub,
            fontSize: 12, fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize',
          }}>
            {t === 'all' ? 'All Notices' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Notice Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(notice => {
          const TypeIcon = TYPE_ICONS[notice.type] || Bell;
          const color = TYPE_COLORS[notice.type];
          return (
            <div key={notice.id} style={{
              background: '#fff', border: `1px solid ${notice.type === 'urgent' ? '#fecaca' : '#e2e8f0'}`,
              borderRadius: 16, padding: 20, borderLeft: `4px solid ${color}`,
              boxShadow: notice.pinned ? '0 4px 12px rgba(0,0,0,0.06)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                {/* Icon */}
                <div style={{ width: 42, height: 42, borderRadius: 12, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <TypeIcon size={18} color={color} />
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: C.txt, flex: 1 }}>{notice.title}</h3>
                    {notice.pinned && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 800, color: '#f59e0b', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 20, padding: '2px 8px' }}>
                        <Pin size={10} /> PINNED
                      </span>
                    )}
                    <Badge label={notice.type.toUpperCase()} variant={TYPE_VARIANTS[notice.type]} />
                    <Badge label={AUDIENCE_LABELS[notice.audience]} variant="default" />
                  </div>
                  <p style={{ margin: '0 0 10px', fontSize: 13, color: C.sub, lineHeight: 1.7, whiteSpace: 'pre-line' }}>{notice.body}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ fontSize: 11, color: C.muted }}>By {notice.authorName} · {timeSince(notice.publishedAt)}</span>
                    {notice.expiresAt && (
                      <span style={{ fontSize: 11, color: C.muted }}>Expires: {new Date(notice.expiresAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <button onClick={() => togglePin(notice.id)} title={notice.pinned ? 'Unpin' : 'Pin'} style={{ padding: 7, background: notice.pinned ? '#fffbeb' : '#f8fafc', borderRadius: 8, border: `1px solid ${notice.pinned ? '#fde68a' : '#e2e8f0'}`, cursor: 'pointer', color: notice.pinned ? '#f59e0b' : C.muted }}>
                    <Pin size={14} />
                  </button>
                  <button onClick={() => deleteNotice(notice.id)} style={{ padding: 7, background: '#fef2f2', borderRadius: 8, border: '1px solid #fecaca', cursor: 'pointer', color: '#ef4444' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Post Notice Modal */}
      {showAdd && (
        <Modal title="Post New Notice" onClose={() => setShowAdd(false)} width={580}>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="Notice Title"><Input value={form.title} onChange={(e: any) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Holiday Announcement" required /></Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Type">
                <Select value={form.type} onChange={(e: any) => setForm({ ...form, type: e.target.value })}>
                  <option value="general">General</option>
                  <option value="urgent">Urgent</option>
                  <option value="academic">Academic</option>
                  <option value="fee">Fee</option>
                  <option value="event">Event</option>
                </Select>
              </Field>
              <Field label="Audience">
                <Select value={form.audience} onChange={(e: any) => setForm({ ...form, audience: e.target.value })}>
                  <option value="all">Everyone</option>
                  <option value="teachers">Teachers Only</option>
                  <option value="students">Students Only</option>
                  <option value="parents">Parents Only</option>
                </Select>
              </Field>
            </div>
            <Field label="Expires On (optional)"><Input type="date" value={form.expiresAt} onChange={(e: any) => setForm({ ...form, expiresAt: e.target.value })} /></Field>
            <Field label="Notice Content">
              <textarea
                value={form.body}
                onChange={e => setForm({ ...form, body: e.target.value })}
                rows={5}
                required
                placeholder="Write the full notice content here..."
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 13, color: C.txt, resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </Field>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8 }}>
              <Btn variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Btn>
              <Btn type="submit" icon={Megaphone}>Publish Notice</Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
