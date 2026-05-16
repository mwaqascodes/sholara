import { useState } from 'react';
import { Megaphone, Plus, Trash2, Eye, Pin, Bell, Users, User, Calendar, AlertTriangle, Send } from 'lucide-react';
import { toast } from 'sonner';
import { C, PageHeader, StatCard, Badge, Btn, Modal, Field, Avatar, Input, Select } from '@/lib/design-system';

interface Announcement {
  id: number; title: string; body: string; author: string;
  target: 'all'|'teachers'|'students'|'parents';
  priority: 'normal'|'important'|'urgent';
  date: string; pinned: boolean;
}

const INIT: Announcement[] = [
  { id:1, title:'Fee Submission Deadline: May 5, 2026',  body:'All students must submit their April fees by May 5, 2026. Late submissions will incur a PKR 500 fine.', author:'Principal', target:'all',       priority:'urgent',    date:'Apr 21, 2026', pinned:true },
  { id:2, title:'Mid-Term Exams Start April 28',          body:'Mid-term examinations will commence from April 28, 2026. Date sheets are available in the office.', author:'Examination Dept', target:'students', priority:'important',  date:'Apr 20, 2026', pinned:true },
  { id:3, title:'Parents Meeting — Saturday April 26',    body:'All parents are requested to attend the PTM on Saturday. Attendance is mandatory.',                  author:'Admin',      target:'parents',    priority:'important',  date:'Apr 19, 2026', pinned:false },
  { id:4, title:'Staff Training Workshop',                body:'Mandatory professional development training for all teaching staff on April 25 from 9 AM to 2 PM.',  author:'HR Dept',    target:'teachers',   priority:'normal',     date:'Apr 18, 2026', pinned:false },
  { id:5, title:'Annual Sports Day — May 10',             body:'Annual sports day celebrations on May 10. Students are encouraged to participate in events.',         author:'Sports Dept', target:'all',      priority:'normal',     date:'Apr 15, 2026', pinned:false },
];

const priorityMap = { urgent:'danger', important:'warning', normal:'info' } as const;
const targetColors: Record<string, string> = { all:'#6b7280', teachers:'#a855f7', students:'#3b82f6', parents:'#22c55e' };

export default function AnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>(INIT);
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<Announcement|null>(null);
  const [filter, setFilter] = useState<'all'|'teachers'|'students'|'parents'>('all');
  const [form, setForm] = useState({ title:'', body:'', target:'all' as Announcement['target'], priority:'normal' as Announcement['priority'] });

  const filtered = filter === 'all' ? items : items.filter(a => a.target === filter || a.target === 'all');
  const pinned   = filtered.filter(a => a.pinned);
  const regular  = filtered.filter(a => !a.pinned);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.body) return;
    setItems(prev => [{ id:Date.now(), ...form, author:'System Administrator', date: new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}), pinned:false }, ...prev]);
    toast.success('Announcement broadcasted to ' + (form.target === 'all' ? 'everyone' : form.target) + '!');
    setShowAdd(false);
    setForm({ title:'', body:'', target:'all', priority:'normal' });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Remove this announcement?')) {
        setItems(prev => prev.filter(a => a.id !== id));
        toast.success('Announcement deleted');
    }
  };

  const togglePin = (id: number) => {
    setItems(prev => prev.map(a => a.id === id ? { ...a, pinned: !a.pinned } : a));
    toast.info('Announcement pin status updated');
  };

  const AnnouncementCard = ({ a }: { a: Announcement }) => (
    <div style={{ 
        ...C.glass, 
        padding:'20px 24px', 
        position:'relative', 
        overflow:'hidden',
        border: a.pinned ? `1px solid rgba(245,158,11,0.3)` : `1px solid rgba(255,255,255,0.1)`,
        background: a.pinned ? 'linear-gradient(135deg, rgba(245,158,11,0.05) 0%, transparent 100%)' : 'rgba(255,255,255,0.02)',
        transition: 'all 0.2s ease'
    }}>
      <div style={{ display:'flex', alignItems:'flex-start', gap:16 }}>
        <div style={{ 
            width:48, height:48, borderRadius:14, 
            background: a.priority === 'urgent' ? 'rgba(239,68,68,0.1)' : `${targetColors[a.target]}15`, 
            display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 
        }}>
          <Megaphone size={22} style={{ color: a.priority === 'urgent' ? '#ef4444' : targetColors[a.target] }} />
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', marginBottom:8 }}>
            <h4 style={{ margin:0, fontSize: 16, fontWeight: 800, color: '#1e293b' }}>{a.title}</h4>
            {a.pinned && <Badge label="Pinned" variant="warning" />}
          </div>
          <p style={{ margin:'0 0 16px', fontSize: 14, color: C.sub, lineHeight: 1.6 }}>{a.body}</p>
          <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
            <Badge label={a.priority} variant={priorityMap[a.priority]} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: targetColors[a.target] }}>
               <Users size={14} /> {a.target === 'all' ? 'Everyone' : a.target.toUpperCase()}
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, color: C.muted, fontSize: 12 }}>
                <User size={12} /> {a.author}
                <span style={{ opacity: 0.3 }}>|</span>
                <Calendar size={12} /> {a.date}
            </div>
          </div>
        </div>
        <div style={{ display:'flex', gap: 8, flexShrink:0 }}>
          <button onClick={() => togglePin(a.id)} style={{ padding: 8, background:'rgba(255,255,255,0.05)', border:'none', cursor:'pointer', color: a.pinned ? C.amber : C.sub, borderRadius: 10 }} title={a.pinned?'Unpin':'Pin'}><Pin size={16}/></button>
          <button onClick={() => setSelected(a)} style={{ padding: 8, background:'rgba(255,255,255,0.05)', border:'none', cursor:'pointer', color:C.sub, borderRadius: 10 }}><Eye size={16}/></button>
          <button onClick={() => handleDelete(a.id)} style={{ padding: 8, background:'rgba(239,68,68,0.1)', border:'none', cursor:'pointer', color:C.red, borderRadius: 10 }}><Trash2 size={16}/></button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display:'flex', flexDirection:'column', gap: 24 }}>
      <PageHeader title="School Announcements" sub="Broadcast important news, updates, and emergency alerts across the institution">
        <Btn icon={Send} onClick={() => setShowAdd(true)}>New Announcement</Btn>
      </PageHeader>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
        <StatCard label="Total Posts" value={items.length} icon={Megaphone} color="#3b82f6" />
        <StatCard label="Priority Alerts" value={items.filter(a=>a.priority==='urgent').length} icon={AlertTriangle} color="#ef4444" trend={{ type:'up', val:'Actively monitored' }} />
        <StatCard label="Target Reach" value="98%" icon={Users} color="#22c55e" />
      </div>

      <div style={{ 
        display:'flex', gap: 10, overflowX: 'auto', padding: '4px',
        scrollbarWidth: 'none'
      }}>
        {(['all','teachers','students','parents'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding:'10px 20px', borderRadius: 12, border:`1px solid ${filter === f ? 'rgba(22,163,74,0.3)' : 'rgba(255,255,255,0.1)'}`, cursor:'pointer', fontSize: 13, fontWeight: 700,
            background: filter===f ? 'rgba(22,163,74,0.15)' : 'rgba(255,255,255,0.02)',
            color: filter===f ? '#22c55e' : C.sub, transition:'all 0.2s',
            textTransform:'capitalize', whiteSpace: 'nowrap'
          }}>{f === 'all' ? 'Universal Feed' : `${f} channel`}</button>
        ))}
      </div>

      {pinned.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ margin:0, fontSize: 11, fontWeight: 800, color: C.amber, letterSpacing:'0.1em', textTransform:'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Pin size={14} /> Institutional Priorities
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap: 12 }}>
            {pinned.map(a => <AnnouncementCard key={a.id} a={a} />)}
          </div>
        </div>
      )}

      {regular.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ margin:0, fontSize: 11, fontWeight: 800, color: C.sub, letterSpacing:'0.1em', textTransform:'uppercase' }}>Latest Updates</p>
          <div style={{ display:'flex', flexDirection:'column', gap: 12 }}>
            {regular.map(a => <AnnouncementCard key={a.id} a={a} />)}
          </div>
        </div>
      )}

      {selected && (
        <Modal title="Announcement Perspective" onClose={() => setSelected(null)}>
          <div style={{ display:'flex', flexDirection:'column', gap: 20 }}>
            <div style={{ display:'flex', gap: 10 }}>
              <Badge label={selected.priority} variant={priorityMap[selected.priority]} />
              <Badge label={selected.target.toUpperCase()} variant="info" />
            </div>
            <h3 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#1e293b' }}>{selected.title}</h3>
            <div style={{ padding: '20px', background: '#f8fafc', borderRadius: 16, border: '1px solid #e2e8f0' }}>
                <p style={{ margin:0, fontSize: 15, color: '#1e293b', lineHeight: 1.8 }}>{selected.body}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0 0' }}>
               <Avatar name={selected.author} size={32} color="#3b82f6" />
               <p style={{ margin:0, fontSize: 13, color: C.sub, fontWeight: 600 }}>Issued by {selected.author} on {selected.date}</p>
            </div>
          </div>
        </Modal>
      )}

      {showAdd && (
        <Modal title="Broadcast New Announcement" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleAdd} style={{ display:'flex', flexDirection:'column', gap: 20 }}>
            <Field label="Announcement Headline">
                <Input value={form.title} onChange={(e: any)=>setForm({...form,title:e.target.value})} placeholder="e.g. Early Summer Break Notification" required />
            </Field>
            <Field label="Detailed Message">
              <textarea 
                value={form.body} 
                onChange={e=>setForm({...form,body:e.target.value})} 
                rows={5} 
                placeholder="Convey your message clearly here…" 
                required 
                style={{ 
                    background: '#f1f5f9', border: '1px solid #e2e8f0', 
                    borderRadius: 12, padding: 12, color: '#1e293b', fontSize: 15, outline: 'none', 
                    width: '100%', resize:'none' 
                }} 
              />
            </Field>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 16 }}>
              <Field label="Target Broadcast Group">
                <Select value={form.target} onChange={(e: any)=>setForm({...form,target:e.target.value as any})} style={{ height: 42 }}>
                  <option value="all">Global (Everyone)</option>
                  <option value="students">Students only</option>
                  <option value="teachers">Teaching Faculty</option>
                  <option value="parents">Guardian network</option>
                </Select>
              </Field>
              <Field label="Alert Level">
                <Select value={form.priority} onChange={(e: any)=>setForm({...form,priority:e.target.value as any})} style={{ height: 42 }}>
                  <option value="normal">Standard</option>
                  <option value="important">Important Action</option>
                  <option value="urgent">Urgent / Critical</option>
                </Select>
              </Field>
            </div>
            <div style={{ marginTop: 10 }}>
              <Btn type="submit" icon={Send} style={{ width: '100%' }}>Broadcast Now</Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
