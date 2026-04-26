import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useSchool } from '@/lib/school-context';
import { Camera, Save, User, Mail, Phone, MapPin, Shield, Key, Bell, CheckCircle2, Globe, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { C, PageHeader, Field, Input, Select, Btn, Badge, Avatar, Card } from '@/lib/design-system';

export default function ProfilePage() {
  const { profile, user } = useAuth();
  const { settings } = useSchool();

  const displayName  = profile?.full_name  || user?.user_metadata?.full_name  || 'Admin User';
  const displayEmail = profile?.email       || user?.email || '';
  const displayRole  = profile?.role        || 'Administrator';
  const displaySchool= settings?.name || profile?.school_name || 'Scholara Intelligence';

  const [tab, setTab] = useState<'profile'|'security'|'notifications'>('profile');
  const [form, setForm] = useState({
    full_name: displayName,
    email: displayEmail,
    phone: profile?.phone || '0300 1234567',
    address: profile?.address || 'Lahore, Pakistan',
    bio: profile?.bio || 'Head of Department at Scholara.',
  });
  const [pwForm, setPwForm] = useState({ current:'', newPw:'', confirm:'' });
  const [notifSettings, setNotifSettings] = useState({
    feeAlerts: true, 
    attendanceAlerts: true, 
    leaveRequests: true, 
    announcements: true, 
    results: false,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Your profile has been updated successfully!');
  };

  const handlePwChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPw !== pwForm.confirm) { toast.error('New passwords do not match'); return; }
    if (pwForm.newPw.length < 6) { toast.error('Security requirement: Password must be at least 6 characters'); return; }
    toast.success('Security credential updated!');
    setPwForm({ current:'', newPw:'', confirm:'' });
  };

  const TABS = [
    { id:'profile', label:'Personal Info', icon: User },
    { id:'security', label:'Security & Access', icon: Shield },
    { id:'notifications', label:'Alerts & Prefs', icon: Bell },
  ] as const;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap: 24 }}>
      <PageHeader title="Identity & Settings" sub="Control your personal presence and security protocols" />

      {/* Profile summary card */}
      <div style={{ 
        ...C.glass, 
        padding:'32px', 
        display:'flex', 
        alignItems:'center', 
        gap: 32,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%)'
      }}>
        <div style={{ position:'relative' }}>
          <Avatar name={displayName} size={88} color="#f59e0b" />
          <button style={{ 
              position:'absolute', bottom: 0, right: 0, width: 32, height: 32, 
              borderRadius:'50%', background: C.amber, border:`3px solid #0a0f1e`, 
              display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
            }}>
            <Camera size={14} style={{ color: '#1e293b' }} />
          </button>
        </div>
        <div style={{ flex:1 }}>
          <h2 style={{ margin:0, fontSize: 26, fontWeight: 900, color: '#1e293b', letterSpacing: '-0.02em' }}>{displayName}</h2>
          <p style={{ margin:'4px 0 0', fontSize: 14, color: C.sub }}>{displayEmail}</p>
          <div style={{ marginTop: 16, display:'flex', gap: 10 }}>
            <Badge label={displayRole} variant="warning" />
            <Badge label={displaySchool} variant="info" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: C.amber, fontWeight: 700, marginLeft: 10 }}>
                <CheckCircle2 size={14} /> Verified Account
            </div>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div style={{ display:'flex', gap: 8, paddingBottom: 0, borderBottom: `1px solid ${C.border}` }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display:'flex', alignItems:'center', gap: 8,
            padding:'12px 24px', border:'none', cursor:'pointer', fontSize: 13, fontWeight: 800,
            background:'transparent', borderBottom: tab===t.id ? `3px solid ${C.amber}` : '3px solid transparent',
            color: tab===t.id ? '#fff' : C.sub, marginBottom:-1,
            transition: 'all 0.2s ease'
          }}>
            <t.icon size={16}/>{t.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          {tab === 'profile' && (
            <form onSubmit={handleSave} style={{ display:'flex', flexDirection:'column', gap: 24 }}>
              <div style={{ 
                  ...C.glass, 
                  padding:'32px', 
                  display:'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                  gap: 20 
              }}>
                <Field label="Full Legal Name">
                  <div style={{ position:'relative' }}>
                    <User size={16} style={{ position:'absolute', left: 14, top:'50%', transform:'translateY(-50%)', color: C.muted }} />
                    <Input value={form.full_name} onChange={(e: any)=>setForm({...form,full_name:e.target.value})} style={{ paddingLeft: 42 }} placeholder="Your full name" />
                  </div>
                </Field>
                <Field label="Official Email Address">
                  <div style={{ position:'relative' }}>
                    <Mail size={16} style={{ position:'absolute', left: 14, top:'50%', transform:'translateY(-50%)', color: C.muted }} />
                    <Input value={form.email} onChange={(e: any)=>setForm({...form,email:e.target.value})} style={{ paddingLeft: 42 }} placeholder="your@email.com" />
                  </div>
                </Field>
                <Field label="Contact Phone">
                  <div style={{ position:'relative' }}>
                    <Phone size={16} style={{ position:'absolute', left: 14, top:'50%', transform:'translateY(-50%)', color: C.muted }} />
                    <Input value={form.phone} onChange={(e: any)=>setForm({...form,phone:e.target.value})} style={{ paddingLeft: 42 }} placeholder="030X XXXXXXX" />
                  </div>
                </Field>
                <Field label="Current Work Station">
                    <div style={{ position:'relative' }}>
                        <Globe size={16} style={{ position:'absolute', left: 14, top:'50%', transform:'translateY(-50%)', color: C.muted }} />
                        <Input value={displaySchool} readOnly style={{ paddingLeft: 42, opacity: 0.6, cursor: 'not-allowed' }} />
                    </div>
                </Field>
                <div style={{ gridColumn:'1/-1' }}>
                  <Field label="Residential Address">
                    <div style={{ position:'relative' }}>
                      <MapPin size={16} style={{ position:'absolute', left: 14, top: 14, color: C.muted }} />
                      <Input value={form.address} onChange={(e: any)=>setForm({...form,address:e.target.value})} style={{ paddingLeft: 42 }} placeholder="City, Province, Country" />
                    </div>
                  </Field>
                </div>
                <div style={{ gridColumn:'1/-1' }}>
                  <Field label="Professional Bio">
                    <textarea 
                        value={form.bio} 
                        onChange={e=>setForm({...form,bio:e.target.value})} 
                        rows={4}
                        placeholder="Detail your academic background and roles…"
                        style={{ 
                            background: '#f1f5f9', border: '1px solid #e2e8f0',
                            borderRadius: 12, padding: 12, color: '#1e293b', fontSize: 14, outline: 'none', width: '100%', resize: 'none'
                        }} 
                    />
                  </Field>
                </div>
              </div>
              <div style={{ display:'flex', justifyContent:'flex-end' }}>
                <Btn type="submit" icon={Save}>Synchronize Profile</Btn>
              </div>
            </form>
          )}

          {tab === 'security' && (
            <form onSubmit={handlePwChange} style={{ display:'flex', flexDirection:'column', gap: 24 }}>
              <div style={{ 
                  ...C.glass, 
                  padding:'32px', 
                  display:'flex', 
                  flexDirection:'column', 
                  gap: 20, 
                  maxWidth: 540 
              }}>
                <div style={{ marginBottom: 8 }}>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1e293b' }}>Access Security</h3>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: C.sub }}>Update your account password to maintain security standards.</p>
                </div>
                <Field label="Current Password">
                  <div style={{ position:'relative' }}>
                    <Lock size={16} style={{ position:'absolute', left: 14, top:'50%', transform:'translateY(-50%)', color: C.muted }} />
                    <Input type="password" value={pwForm.current} onChange={(e: any)=>setPwForm({...pwForm,current:e.target.value})} style={{ paddingLeft: 42 }} placeholder="••••••••" />
                  </div>
                </Field>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Field label="New Secure Password">
                     <Input type="password" value={pwForm.newPw} onChange={(e: any)=>setPwForm({...pwForm,newPw:e.target.value})} placeholder="New password" />
                    </Field>
                    <Field label="Verify Password">
                        <Input type="password" value={pwForm.confirm} onChange={(e: any)=>setPwForm({...pwForm,confirm:e.target.value})} placeholder="Repeat password" />
                    </Field>
                </div>
              </div>
              <div style={{ display:'flex', justifyContent:'flex-start' }}>
                <Btn type="submit" icon={Shield}>Update Credentials</Btn>
              </div>
            </form>
          )}

          {tab === 'notifications' && (
            <div style={{ 
                ...C.glass, 
                padding:'32px', 
                display:'flex', 
                flexDirection:'column', 
                gap: 0 
            }}>
              <div style={{ marginBottom: 20 }}>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1e293b' }}>Smart Notifications</h3>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: C.sub }}>Configure how you receive system alerts and academic updates.</p>
              </div>
              {Object.entries(notifSettings).map(([key, val]) => (
                <div key={key} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 0', borderBottom:`1px solid ${C.border}` }}>
                  <div>
                    <p style={{ margin:0, fontSize: 15, fontWeight: 700, color: '#1e293b' }}>{key.replace(/([A-Z])/g,' $1').replace(/^./,s=>s.toUpperCase())}</p>
                    <p style={{ margin:'4px 0 0', fontSize: 12, color: C.sub }}>Real-time push and email alerts for {key.replace(/([A-Z])/g,' $1').toLowerCase()}</p>
                  </div>
                  <button onClick={() => setNotifSettings({...notifSettings,[key]:!val})} style={{
                    width: 52, height: 28, borderRadius: 20, border:'none', cursor:'pointer', position:'relative',
                    background: val ? C.amber : 'rgba(255,255,255,0.1)', transition:'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}>
                    <div style={{
                      position:'absolute', top: 4, left: val ? 28 : 4, width: 20, height: 20, borderRadius:'50%',
                      background:'#fff', transition:'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow:'0 2px 8px rgba(0,0,0,0.4)',
                    }} />
                  </button>
                </div>
              ))}
              <div style={{ marginTop: 24, display:'flex', justifyContent:'flex-end' }}>
                <Btn icon={Save} onClick={() => toast.success('Smart notifications synchronized!')}>Save Preferences</Btn>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
