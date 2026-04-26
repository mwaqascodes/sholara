import { useState } from 'react';
import { Send, Inbox, Star, Trash2, Plus, Search, User, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import { C, PageHeader, Badge, Btn, Modal, Field, Input, Select } from '@/lib/design-system';

interface Message {
  id: string;
  senderName: string;
  senderRole: string;
  recipientName: string;
  subject: string;
  body: string;
  isRead: boolean;
  isStarred: boolean;
  createdAt: string;
  folder: 'inbox' | 'sent';
}

const MSGS_KEY = 'Scholara_messages_v1';

const DEMO_CONTACTS = [
  { name: 'Mrs. Fatima Malik (Parent)', role: 'parent' },
  { name: 'Mr. Ahmed Raza (Parent)', role: 'parent' },
  { name: 'Mr. Tariq Ali — Mathematics Teacher', role: 'teacher' },
  { name: 'Mrs. Nadia Iqbal — Science Teacher', role: 'teacher' },
  { name: 'Admin Office', role: 'admin' },
];

function loadMessages(): Message[] {
  try { const raw = localStorage.getItem(MSGS_KEY); if (raw) return JSON.parse(raw); } catch {}
  return [
    { id: 'm1', senderName: 'Mrs. Fatima Malik', senderRole: 'Parent', recipientName: 'Class Teacher', subject: 'Ahmed is sick today', body: 'Respected Teacher,\n\nI want to inform you that my son Ahmed is unwell today and will not be attending school. He has a fever and will visit the doctor this afternoon.\n\nI will send a medical certificate tomorrow. Please mark him as sick leave.\n\nThank you.', isRead: false, isStarred: false, createdAt: '2026-04-22T09:30:00', folder: 'inbox' },
    { id: 'm2', senderName: 'Mr. Ahmed Raza', senderRole: 'Parent', recipientName: 'Principal', subject: 'Fee receipt not received', body: 'Dear Sir,\n\nI paid the monthly fee for April 2026 in cash on April 5th, but I have not received the official receipt yet. Could you please arrange to send it?\n\nThank you for your assistance.', isRead: true, isStarred: true, createdAt: '2026-04-21T14:15:00', folder: 'inbox' },
    { id: 'm3', senderName: 'Class Teacher', senderRole: 'Teacher', recipientName: 'Mrs. Fatima Malik', subject: 'Progress Report — Semester 1', body: 'Dear Mrs. Malik,\n\nI am writing to inform you about your son Umar\'s performance this semester. He has shown significant improvement in Mathematics and English. However, his attendance could be better.\n\nPlease schedule a meeting at your earliest convenience.\n\nRegards,\nClass Teacher', isRead: true, isStarred: false, createdAt: '2026-04-20T11:00:00', folder: 'sent' },
    { id: 'm4', senderName: 'Admin Office', senderRole: 'Admin', recipientName: 'All Staff', subject: 'Staff Meeting — Friday 3PM', body: 'Dear All,\n\nThis is to inform all teaching and non-teaching staff that there will be a mandatory staff meeting on Friday, April 25, 2026 at 3:00 PM in the conference room.\n\nAgenda: Monthly review, exam schedule, parent-teacher meeting planning.\n\nPlease ensure attendance.\n\nAdmin Office', isRead: false, isStarred: false, createdAt: '2026-04-22T08:00:00', folder: 'inbox' },
  ];
}

function saveMessages(data: Message[]) { localStorage.setItem(MSGS_KEY, JSON.stringify(data)); }

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function MessagesPage() {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [folder, setFolder] = useState<'inbox' | 'sent'>('inbox');
  const [selected, setSelected] = useState<Message | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ recipient: '', subject: '', body: '' });

  const visibleMessages = messages.filter(m => m.folder === folder && (
    m.subject.toLowerCase().includes(search.toLowerCase()) ||
    m.senderName.toLowerCase().includes(search.toLowerCase()) ||
    m.body.toLowerCase().includes(search.toLowerCase())
  ));

  const unreadCount = messages.filter(m => m.folder === 'inbox' && !m.isRead).length;

  const openMessage = (msg: Message) => {
    setSelected(msg);
    if (!msg.isRead) {
      const updated = messages.map(m => m.id === msg.id ? { ...m, isRead: true } : m);
      setMessages(updated);
      saveMessages(updated);
    }
  };

  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = messages.map(m => m.id === id ? { ...m, isStarred: !m.isStarred } : m);
    setMessages(updated);
    saveMessages(updated);
  };

  const deleteMessage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = messages.filter(m => m.id !== id);
    setMessages(updated);
    saveMessages(updated);
    if (selected?.id === id) setSelected(null);
    toast.success('Message deleted');
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.recipient || !form.subject || !form.body) { toast.error('All fields required'); return; }
    const senderName = profile?.full_name || 'Teacher';
    const newMsg: Message = {
      id: `m${Date.now()}`,
      senderName,
      senderRole: profile?.role || 'teacher',
      recipientName: form.recipient.split('(')[0].trim(),
      subject: form.subject,
      body: form.body,
      isRead: true,
      isStarred: false,
      createdAt: new Date().toISOString(),
      folder: 'sent',
    };
    const updated = [newMsg, ...messages];
    setMessages(updated);
    saveMessages(updated);
    toast.success(`Message sent to ${newMsg.recipientName}`);
    setShowCompose(false);
    setForm({ recipient: '', subject: '', body: '' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader title="Messages" sub="Communicate with parents, teachers, and staff">
        <Btn icon={Plus} onClick={() => setShowCompose(true)}>Compose</Btn>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16, minHeight: 500 }}>
        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { id: 'inbox', label: 'Inbox', icon: Inbox, count: unreadCount },
            { id: 'sent',  label: 'Sent',  icon: Send, count: 0 },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setFolder(tab.id as any); setSelected(null); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px',
                borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700,
                background: folder === tab.id ? '#fffbeb' : 'transparent',
                color: folder === tab.id ? '#d97706' : C.sub,
                transition: 'all 0.2s',
              }}
            >
              <tab.icon size={15} />
              {tab.label}
              {tab.count > 0 && (
                <span style={{ marginLeft: 'auto', background: '#ef4444', color: '#fff', borderRadius: 20, fontSize: 10, fontWeight: 900, padding: '2px 7px' }}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Message List + View */}
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden' }}>
          {/* List */}
          <div style={{ borderRight: selected ? '1px solid #e2e8f0' : 'none', overflowY: 'auto' }}>
            {/* Search */}
            <div style={{ padding: '12px 14px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '8px 12px' }}>
                <Search size={14} color={C.muted} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages..." style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: C.txt, flex: 1 }} />
              </div>
            </div>

            {visibleMessages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 48, color: C.muted }}>No messages in {folder}</div>
            ) : visibleMessages.map(msg => (
              <div
                key={msg.id}
                onClick={() => openMessage(msg)}
                style={{
                  padding: '14px 16px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer',
                  background: selected?.id === msg.id ? '#fffbeb' : msg.isRead ? '#fff' : '#f0f9ff',
                  transition: 'background 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 13, fontWeight: 800, color: C.sub }}>
                    {msg.senderName.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: msg.isRead ? 600 : 800, color: C.txt, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {folder === 'inbox' ? msg.senderName : msg.recipientName}
                      </p>
                      <span style={{ fontSize: 10, color: C.muted, flexShrink: 0 }}>{timeAgo(msg.createdAt)}</span>
                    </div>
                    <p style={{ margin: '3px 0 0', fontSize: 12, fontWeight: msg.isRead ? 500 : 700, color: C.sub, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.subject}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: C.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.body.slice(0, 60)}...</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <button onClick={e => toggleStar(msg.id, e)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: msg.isStarred ? '#f59e0b' : C.muted, padding: 0 }}>★</button>
                    <button onClick={e => deleteMessage(msg.id, e)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: C.muted, padding: 0 }}><Trash2 size={12} /></button>
                  </div>
                </div>
                {!msg.isRead && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', marginTop: 4, marginLeft: 46 }} />}
              </div>
            ))}
          </div>

          {/* Message View */}
          {selected && (
            <div style={{ padding: 24, overflowY: 'auto' }}>
              <button onClick={() => setSelected(null)} style={{ fontSize: 12, color: C.sub, background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16 }}>← Back</button>
              <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 800, color: C.txt }}>{selected.subject}</h3>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: C.sub }}>
                  {selected.senderName.charAt(0)}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: C.txt }}>{selected.senderName}</p>
                  <p style={{ margin: 0, fontSize: 11, color: C.sub }}><Clock size={10} style={{ display: 'inline', marginRight: 4 }} />{new Date(selected.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0' }}>
                <p style={{ margin: 0, fontSize: 14, color: C.txt, lineHeight: 1.8, whiteSpace: 'pre-line' }}>{selected.body}</p>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <Btn icon={Send} onClick={() => { setForm({ recipient: selected.senderName, subject: `Re: ${selected.subject}`, body: '' }); setShowCompose(true); }}>Reply</Btn>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <Modal title="Compose Message" onClose={() => setShowCompose(false)} width={560}>
          <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="To">
              <Select value={form.recipient} onChange={(e: any) => setForm({ ...form, recipient: e.target.value })}>
                <option value="">— Select Recipient —</option>
                {DEMO_CONTACTS.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </Select>
            </Field>
            <Field label="Subject"><Input value={form.subject} onChange={(e: any) => setForm({ ...form, subject: e.target.value })} placeholder="Message subject..." required /></Field>
            <Field label="Message">
              <textarea
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                rows={6}
                required
                placeholder="Type your message here..."
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 13, color: C.txt, resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </Field>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <Btn variant="secondary" onClick={() => setShowCompose(false)}>Cancel</Btn>
              <Btn type="submit" icon={Send}>Send Message</Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
