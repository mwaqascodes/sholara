import { useState } from 'react';
import { Settings, School, Bell, Palette, Globe, Save, Building, Phone, Mail, MapPin, Database, ShieldCheck, Languages, Zap, CreditCard, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/lib/theme-context';
import { useI18n } from '@/lib/i18n-context';
import { useSchool } from '@/lib/school-context';
import { C, PageHeader, Field, Btn, Badge, Card, Input, Select } from '@/lib/design-system';

export default function SettingsPage() {
  const { isDark, toggle } = useTheme();
  const { lang, setLang } = useI18n();
  const { settings, update: updateSettings } = useSchool();

  const [tab, setTab] = useState<'school'|'appearance'|'academic'|'system'>('school');
  const [schoolForm, setSchoolForm] = useState({
    name:        settings?.name        || 'Scholara Premier Academy',
    address:     settings?.address     || 'Main Campus, Sector H-8, Islamabad, Pakistan',
    phone:       settings?.phone       || '+92 51 1234567',
    email:       settings?.email       || 'admin@scholara.edu.pk',
    principalName: settings?.principalName || 'Prof. Dr. Zahid Ahmed',
    sessionStart:  settings?.sessionStart  || '2026-04-01',
    sessionEnd:    settings?.sessionEnd    || '2027-03-31',
    currency:      settings?.currency      || 'PKR',
    timezone:      'Asia/Karachi',
  });

  const TABS = [
    { id:'school',     label:'Organization',  icon:School },
    { id:'appearance', label:'Interface',     icon:Palette },
    { id:'academic',   label:'Academics',     icon:Building },
    { id:'system',     label:'System',        icon:Settings },
  ] as const;

  const ToggleRow = ({ label, sub, value, onChange }: { label:string; sub:string; value:boolean; onChange:()=>void }) => (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 0', borderBottom:`1px solid ${C.border}` }}>
      <div>
        <p style={{ margin:0, fontSize: 15, fontWeight: 700, color: '#1e293b' }}>{label}</p>
        <p style={{ margin:'4px 0 0', fontSize: 12, color: C.sub }}>{sub}</p>
      </div>
      <button onClick={onChange} style={{ 
        width: 52, height: 28, borderRadius: 20, border:'none', cursor:'pointer', position:'relative', 
        background: value ? C.amber : 'rgba(255,255,255,0.1)', transition:'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        flexShrink: 0 
      }}>
        <div style={{ 
            position:'absolute', top: 4, left: value ? 28 : 4, width: 20, height: 20, borderRadius:'50%', 
            background:'#fff', transition:'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow:'0 2px 8px rgba(0,0,0,0.4)' 
        }} />
      </button>
    </div>
  );

  return (
    <div style={{ display:'flex', flexDirection:'column', gap: 24 }}>
      <PageHeader title="Global Settings" sub="Manage institutional identity, system configuration, and user experience" />

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

      <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          {/* School Info */}
          {tab === 'school' && (
            <div style={{ display:'flex', flexDirection:'column', gap: 24 }}>
              <div style={{ ...C.glass, padding: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <School size={20} color="#3b82f6" />
                    </div>
                   <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1e293b' }}>Institutional Identity</h3>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
                  <Field label="School Name">
                    <div style={{ position:'relative' }}>
                      <School size={16} style={{ position:'absolute', left: 14, top:'50%', transform:'translateY(-50%)', color: C.muted }} />
                      <Input value={schoolForm.name} onChange={(e: any)=>setSchoolForm({...schoolForm,name:e.target.value})} style={{ paddingLeft: 42 }} />
                    </div>
                  </Field>
                  <Field label="Principal / Head of Institution">
                    <Input value={schoolForm.principalName} onChange={(e: any)=>setSchoolForm({...schoolForm,principalName:e.target.value})} placeholder="Full name of principal" />
                  </Field>
                  <Field label="Official Contact Number">
                    <div style={{ position:'relative' }}>
                      <Phone size={16} style={{ position:'absolute', left: 14, top:'50%', transform:'translateY(-50%)', color: C.muted }} />
                      <Input value={schoolForm.phone} onChange={(e: any)=>setSchoolForm({...schoolForm,phone:e.target.value})} style={{ paddingLeft: 42 }} placeholder="+92 51 XXXXXXX" />
                    </div>
                  </Field>
                  <Field label="Institutional Email">
                    <div style={{ position:'relative' }}>
                      <Mail size={16} style={{ position:'absolute', left: 14, top:'50%', transform:'translateY(-50%)', color: C.muted }} />
                      <Input value={schoolForm.email} onChange={(e: any)=>setSchoolForm({...schoolForm,email:e.target.value})} style={{ paddingLeft: 42 }} placeholder="contact@scholara.edu.pk" />
                    </div>
                  </Field>
                  <div style={{ gridColumn:'1/-1' }}>
                    <Field label="Physical Campus Address">
                      <div style={{ position:'relative' }}>
                        <MapPin size={16} style={{ position:'absolute', left: 14, top: 14, color: C.muted }} />
                        <Input value={schoolForm.address} onChange={(e: any)=>setSchoolForm({...schoolForm,address:e.target.value})} style={{ paddingLeft: 42 }} placeholder="Full campus address" />
                      </div>
                    </Field>
                  </div>
                </div>
              </div>
              <div style={{ display:'flex', justifyContent:'flex-end' }}>
                <Btn icon={Save} onClick={() => { updateSettings?.(schoolForm); toast.success('Institutional configuration updated!'); }}>Synchronize Changes</Btn>
              </div>
            </div>
          )}

          {/* Appearance */}
          {tab === 'appearance' && (
            <div style={{ ...C.glass, padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Palette size={20} color="#8b5cf6" />
                    </div>
                   <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1e293b' }}>Interface & Experience</h3>
              </div>
              
              <ToggleRow label="Dynamic Dark Mode" sub="Optimize the dashboard for night-time and low-light environments" value={isDark} onChange={toggle} />
              
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 0', borderBottom:`1px solid ${C.border}` }}>
                <div>
                  <p style={{ margin:0, fontSize: 15, fontWeight: 700, color: '#1e293b' }}>Primary System Language</p>
                  <p style={{ margin:'4px 0 0', fontSize: 12, color: C.sub }}>Select the universal language for the interface</p>
                </div>
                <div style={{ display:'flex', gap: 10 }}>
                  {(['en','ur'] as const).map(l => (
                    <button key={l} onClick={() => setLang(l)} style={{
                      padding:'10px 24px', borderRadius: 12, border:`1px solid ${lang===l ? C.amber : 'rgba(255,255,255,0.1)'}`, cursor:'pointer',
                      fontSize: 13, fontWeight: 800,
                      background: lang===l ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.02)',
                      color: lang===l ? C.amber : C.sub,
                      transition: 'all 0.2s ease'
                    }}>{l==='en'?'English':'اردو'}</button>
                  ))}
                </div>
              </div>

              <div style={{ padding:'24px 0 0' }}>
                <p style={{ margin:'0 0 16px', fontSize: 15, fontWeight: 700, color: '#1e293b' }}>Brand Accent Colors</p>
                <div style={{ display:'flex', gap: 16 }}>
                  {['Amber', 'Sky Blue', 'Teal Mint', 'Royal Purple'].map((colorName, i) => {
                    const colors = ['#f59e0b','#3b82f6','#10b981','#a855f7'];
                    const active = i === 0; // amber as default for Scholara
                    return (
                        <div key={colorName} style={{ textAlign:'center' }}>
                        <div style={{
                            width: 42, height: 42, borderRadius: 12, margin:'0 auto 10px', cursor:'pointer',
                            background: colors[i],
                            border: active ? '3px solid #fff' : '3px solid transparent',
                            boxShadow: active ? `0 0 20px ${colors[i]}60` : 'none',
                            transition: 'all 0.2s ease'
                        }} />
                        <p style={{ margin:0, fontSize: 11, color: active ? '#fff' : C.sub, fontWeight: active ? 700 : 500 }}>{colorName}</p>
                        </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Academic */}
          {tab === 'academic' && (
            <div style={{ display:'flex', flexDirection:'column', gap: 24 }}>
              <div style={{ ...C.glass, padding: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Building size={20} color="#f59e0b" />
                        </div>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1e293b' }}>Academic Session Config</h3>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
                  <Field label="Session Start Date">
                      <Input type="date" value={schoolForm.sessionStart} onChange={(e: any)=>setSchoolForm({...schoolForm,sessionStart:e.target.value})} />
                  </Field>
                  <Field label="Session End Date">
                      <Input type="date" value={schoolForm.sessionEnd} onChange={(e: any)=>setSchoolForm({...schoolForm,sessionEnd:e.target.value})} />
                  </Field>
                  <Field label="Financial Currency">
                    <Select value={schoolForm.currency} onChange={(e: any)=>setSchoolForm({...schoolForm,currency:e.target.value})}>
                      <option value="PKR">Pakistani Rupee (PKR)</option>
                      <option value="USD">US Dollar (USD)</option>
                    </Select>
                  </Field>
                </div>
              </div>
              <div style={{ ...C.glass, padding: '32px' }}>
                <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 800, color: '#1e293b' }}>Administrative Polices</h3>
                <p style={{ margin: '0 0 16px', fontSize: 13, color: C.sub }}>Automated rules for student promotion and system access.</p>
                <ToggleRow label="Enable Public Admissions" sub="Allow parents to submit admission forms online" value={true} onChange={()=>{}} />
                <ToggleRow label="Auto-calculate GPA" sub="Automatically compute grade point averages on result publishing" value={true} onChange={()=>{}} />
                <ToggleRow label="SMS Portal Integration" sub="Send automatic SMS alerts for attendance and fee reminders" value={false} onChange={()=>toast.info('SMS API connection pending setup')} />
              </div>
              <div style={{ display:'flex', justifyContent:'flex-end' }}>
                <Btn icon={Save} onClick={() => toast.success('Academic policies updated!')}>Commit Academic Changes</Btn>
              </div>
            </div>
          )}

          {/* System */}
          {tab === 'system' && (
            <div style={{ ...C.glass, padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Database size={20} color="#fff" />
                    </div>
                   <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1e293b' }}>Infrastructure & Heartbeat</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                    { label:'System Core Version', value:'Scholara AI v4.0.1', icon: Zap },
                    { label:'Database Status', value:'Online (Supabase Cloud)', icon: Database },
                    { label:'Active Security Layer', value:'AES-256 SSL Encryption', icon: ShieldCheck },
                    { label:'Current Server Time', value: new Date().toLocaleTimeString(), icon: Clock },
                    { label:'Storage Capacity', value:'1.2GB of 10GB Used', icon: CreditCard },
                ].map((info, idx) => (
                    <div key={info.label} style={{ 
                        display:'flex', justifyContent:'space-between', alignItems:'center', 
                        padding:'18px 0', borderBottom: idx === 4 ? 'none' : `1px solid ${C.border}` 
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <info.icon size={16} color={C.sub} />
                        <p style={{ margin:0, fontSize: 14, color: C.sub, fontWeight: 500 }}>{info.label}</p>
                    </div>
                    <p style={{ margin:0, fontSize: 14, fontWeight: 800, color: '#1e293b' }}>{info.value}</p>
                    </div>
                ))}
              </div>
              <div style={{ marginTop: 32, display:'flex', gap: 12 }}>
                <Btn variant="secondary" icon={Database} onClick={()=>toast.success('Local database snapshot created!')}>Database Backup</Btn>
                <Btn variant="danger" icon={Zap} onClick={()=>toast.info('System cache purged successfully!')}>Purge Cache</Btn>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
