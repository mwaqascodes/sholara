import { useState } from 'react';
import { Bell, CheckCircle, AlertCircle, Info, Trash2, CheckCheck, Clock, ShieldCheck, Mail, Send } from 'lucide-react';
import { toast } from 'sonner';
import { C, PageHeader, Btn, Badge, Avatar } from '@/lib/design-system';

const NOTIFS = [
  { id:1, type:'warning', title:'6 students absent today',             body:'Class 5A has the highest absenteeism this week', time:'10 min ago', read:false },
  { id:2, type:'success', title:'Fee collected from Ali Hassan',        body:'PKR 5,000 received for April 2026',              time:'30 min ago', read:false },
  { id:3, type:'info',    title:'Mid-term results published',           body:'Class 10 results are now visible to students',   time:'2 hours ago', read:false },
  { id:4, type:'warning', title:'Leave request from Ustad Ahmad',       body:'Pending your approval for April 22-23',         time:'3 hours ago', read:false },
  { id:5, type:'info',    title:'New student admission registered',     body:'Fatima Malik admitted to Class 7A',             time:'Yesterday',   read:true },
  { id:6, type:'success', title:'Payroll processed successfully',       body:'28 teachers paid for March 2026',               time:'2 days ago',  read:true },
  { id:7, type:'warning', title:'Inventory alert: Low supplies',        body:'Chalk sticks stock below minimum threshold',    time:'3 days ago',  read:true },
  { id:8, type:'info',    title:'Academic calendar updated',            body:'Summer break dates revised to June 15',        time:'1 week ago',  read:true },
];

const typeConfig: Record<string, any> = {
  warning: { icon: AlertCircle, color:'#f59e0b', bg:'rgba(245,158,11,0.15)', bd: 'rgba(245,158,11,0.3)' },
  success: { icon: CheckCircle, color:'#22c55e', bg:'rgba(34,197,94,0.15)', bd: 'rgba(34,197,94,0.3)'  },
  info:    { icon: Info,        color:'#3b82f6', bg:'rgba(59,130,246,0.15)', bd: 'rgba(59,130,246,0.3)' },
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(NOTIFS);
  const [filter, setFilter] = useState<'all'|'unread'>('all');

  const unread     = notifs.filter(n => !n.read).length;
  const displayed  = filter === 'unread' ? notifs.filter(n => !n.read) : notifs;

  const markAll   = () => {
    setNotifs(n => n.map(x => ({ ...x, read:true })));
    toast.success('All notifications marked as read');
  };

  const markRead  = (id: number) => setNotifs(n => n.map(x => x.id === id ? { ...x, read:true } : x));
  
  const deleteOne = (id: number) => {
    setNotifs(n => n.filter(x => x.id !== id));
    toast.info('Notification removed');
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap: 24, maxWidth: 800 }}>
      {/* Dynamic Header */}
      <PageHeader title="Notification Intelligence" sub={`System Monitoring Hub · ${unread} pending alerts requiring attention`}>
        <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={markAll} style={{
                display:'flex', alignItems:'center', gap: 8, padding:'10px 20px', borderRadius: 12,
                background:'rgba(255,255,255,0.05)', border:`1px solid rgba(255,255,255,0.1)`,
                color: '#1e293b', fontSize: 13, fontWeight: 700, cursor:'pointer', transition: 'all 0.2s'
            }}>
                <CheckCheck size={16}/> Clear Unread
            </button>
            <Btn variant="primary" icon={Bell}>Alert Settings</Btn>
        </div>
      </PageHeader>

      {/* Persistence Controls */}
      <div style={{ 
          display:'flex', gap: 12, alignItems:'center',
          padding: '12px 16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0'
      }}>
        <div style={{ display:'flex', gap: 8 }}>
          {(['all','unread'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding:'8px 18px', borderRadius: 10, border:`1px solid ${filter === f ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.1)'}`, cursor:'pointer', fontSize: 12, fontWeight: 700,
              background: filter===f ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.02)',
              color: filter===f ? C.amber : C.sub, transition: 'all 0.2s'
            }}>{f==='all' ? 'Universal Feed' : `Unread Alerts (${unread})`}</button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Badge label="Auto-Sync: Active" variant="success" />
        </div>
      </div>

      {/* Unified Feed */}
      <div style={{ display:'flex', flexDirection:'column', gap: 10 }}>
        {displayed.length === 0 ? (
          <div style={{ ...C.glass, textAlign:'center', padding: 80, color: C.sub }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Bell size={32} style={{ opacity: 0.2 }} />
            </div>
            <p style={{ margin:0, fontSize:15, fontWeight: 700, color: '#1e293b' }}>No Active Intelligence</p>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: C.muted }}>Your notification repository is currently empty.</p>
          </div>
        ) : (
          displayed.map(n => {
            const tc = typeConfig[n.type];
            return (
              <div key={n.id} style={{
                ...C.glass,
                background: n.read ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.03)',
                border:`1px solid ${n.read ? 'rgba(255,255,255,0.05)' : tc.bd}`,
                borderRadius: 16, padding: '20px 24px',
                display:'flex', alignItems:'flex-start', gap: 16,
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                opacity: n.read ? 0.6 : 1,
                transform: n.read ? 'none' : 'scale(1.005)'
              }} onClick={() => markRead(n.id)}>
                <div style={{ 
                    width: 44, height: 44, borderRadius:12, 
                    background: tc.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 
                }}>
                  <tc.icon size={20} style={{ color:tc.color }} />
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap: 10, marginBottom: 4 }}>
                    <p style={{ margin:0, fontSize: 15, fontWeight: n.read ? 700 : 900, color: '#1e293b' }}>{n.title}</p>
                    {!n.read && <div style={{ width: 8, height: 8, borderRadius:'50%', background:C.amber, boxShadow: `0 0 10px ${C.amber}` }} />}
                  </div>
                  <p style={{ margin:0, fontSize: 14, color: C.sub, lineHeight: 1.6 }}>{n.body}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
                      <Clock size={12} color={C.muted} />
                      <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{n.time}</p>
                  </div>
                </div>
                <div style={{ display:'flex', gap: 6, flexShrink:0 }} onClick={e => e.stopPropagation()}>
                  {!n.read && (
                    <button onClick={() => markRead(n.id)} style={{
                      padding: 8, background:'rgba(255,255,255,0.05)', border:'none', cursor:'pointer', color:C.sub, borderRadius: 10, transition: 'all 0.2s'
                    }} title="Mark read"><CheckCircle size={18}/></button>
                  )}
                  <button onClick={() => deleteOne(n.id)} style={{
                    padding: 8, background:'rgba(239,68,68,0.05)', border:'none', cursor:'pointer', color: C.red, borderRadius: 10, transition: 'all 0.2s'
                  }} title="Archive Notification"><Trash2 size={18}/></button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Integrity Footer */}
      <div style={{ padding: '24px', background: 'rgba(59,130,246,0.05)', borderRadius: 16, border: '1px solid rgba(59,130,246,0.1)', display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={22} color="#3b82f6" />
          </div>
          <div>
              <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#1e293b' }}>Secure Alert Infrastructure</h4>
              <p style={{ margin: 0, fontSize: 12, color: C.sub }}>All notifications are encrypted and synchronized across institutional administrative nodes.</p>
          </div>
      </div>
    </div>
  );
}

const CheckCheck = ({ size, color }: any) => <CheckCircle size={size} color={color} />;
