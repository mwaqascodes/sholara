import { useState } from 'react';
import { Settings as SettingsIcon, School, Palette, Globe, BookOpen, Wallet, MessageCircle, Calendar, Award, Moon, RefreshCw, Save, Plus, X } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import { useI18n } from '@/lib/i18n-context';
import { useSchool, BOARDS, SCHOOL_TYPES, EXAM_SYSTEMS, GRADING_SCALES, COMMON_SUBJECTS, PAKISTAN_PROVINCES, PAKISTAN_CITIES } from '@/lib/school-context';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { isDark, toggle } = useTheme();
  const { lang, setLang } = useI18n();
  const { settings, update, reset } = useSchool();
  const [draft, setDraft] = useState(settings);
  const [newSubject, setNewSubject] = useState('');

  const set = <K extends keyof typeof draft>(key: K, value: typeof draft[K]) =>
    setDraft(prev => ({ ...prev, [key]: value }));

  const save = () => {
    update(draft);
    toast.success('School settings saved successfully', { description: `${draft.name} • ${draft.academicYear}` });
  };

  const handleReset = () => {
    if (!confirm('Reset all school settings to defaults? This cannot be undone.')) return;
    reset();
    setTimeout(() => setDraft(settings), 0);
    toast.info('Settings reset to defaults');
  };

  const addSubject = (s: string) => {
    const v = s.trim();
    if (!v || draft.subjects.includes(v)) return;
    set('subjects', [...draft.subjects, v]);
    setNewSubject('');
  };
  const removeSubject = (s: string) => set('subjects', draft.subjects.filter(x => x !== s));

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold flex items-center gap-2"><SettingsIcon className="w-6 h-6 text-primary" /> School Settings</h2>
          <p className="text-sm text-muted-foreground mt-1">Configure your school identity, academics, and Pakistan-specific options</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleReset} className="btn-secondary flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Reset</button>
          <button onClick={save} className="btn-primary flex items-center gap-2"><Save className="w-4 h-4" /> Save Changes</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Identity */}
        <Section icon={<School className="w-5 h-5 text-primary" />} title="School Identity">
          <Field label="School Name (English)"><input className="input-field" value={draft.name} onChange={e => set('name', e.target.value)} /></Field>
          <Field label="اسکول کا نام (اردو)"><input className="input-field" dir="rtl" value={draft.nameUrdu} onChange={e => set('nameUrdu', e.target.value)} /></Field>
          <Field label="Principal Name"><input className="input-field" value={draft.principalName} onChange={e => set('principalName', e.target.value)} /></Field>
          <Field label="School Motto"><input className="input-field" value={draft.motto} onChange={e => set('motto', e.target.value)} /></Field>
          <Field label="Established Year"><input type="number" className="input-field" value={draft.estYear} onChange={e => set('estYear', e.target.value)} /></Field>
          <Field label="Logo URL (optional)"><input className="input-field" placeholder="https://..." value={draft.logoUrl} onChange={e => set('logoUrl', e.target.value)} /></Field>
        </Section>

        {/* Contact */}
        <Section icon={<MessageCircle className="w-5 h-5 text-primary" />} title="Contact & Location">
          <Field label="Email"><input type="email" className="input-field" value={draft.email} onChange={e => set('email', e.target.value)} /></Field>
          <Field label="Phone"><input type="tel" className="input-field" placeholder="042-35781234" value={draft.phone} onChange={e => set('phone', e.target.value)} /></Field>
          <Field label="WhatsApp Number"><input type="tel" className="input-field" placeholder="+92 300 1234567" value={draft.whatsapp} onChange={e => set('whatsapp', e.target.value)} /></Field>
          <Field label="Full Address"><input className="input-field" value={draft.address} onChange={e => set('address', e.target.value)} /></Field>
          <Field label="City">
            <select className="input-field" value={draft.city} onChange={e => set('city', e.target.value)}>
              {PAKISTAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Province / Region">
            <select className="input-field" value={draft.province} onChange={e => set('province', e.target.value)}>
              {PAKISTAN_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>
        </Section>

        {/* Pakistani Education System */}
        <Section icon={<BookOpen className="w-5 h-5 text-primary" />} title="Pakistani Education System">
          <Field label="Examination Board">
            <select className="input-field" value={draft.board} onChange={e => set('board', e.target.value as typeof draft.board)}>
              {BOARDS.map(b => <option key={b} value={b}>{b} Board</option>)}
            </select>
          </Field>
          <Field label="School Type / Level">
            <select className="input-field" value={draft.schoolType} onChange={e => set('schoolType', e.target.value as typeof draft.schoolType)}>
              {SCHOOL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Medium of Instruction">
            <div className="flex gap-2 flex-wrap">
              {(['Urdu', 'English', 'Bilingual'] as const).map(m => (
                <button key={m} type="button" onClick={() => set('medium', m)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${draft.medium === m ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/70'}`}>
                  {m}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Registration / PEF / Affiliation No."><input className="input-field" value={draft.registrationNo} onChange={e => set('registrationNo', e.target.value)} /></Field>
          <Field label="EMIS Code (Govt)"><input className="input-field" placeholder="e.g. 31410001" value={draft.emisCode} onChange={e => set('emisCode', e.target.value)} /></Field>
        </Section>

        {/* Academic */}
        <Section icon={<Calendar className="w-5 h-5 text-primary" />} title="Academic Year & Exams">
          <Field label="Academic Year"><input className="input-field" placeholder="2025-2026" value={draft.academicYear} onChange={e => set('academicYear', e.target.value)} /></Field>
          <Field label="Academic Year Starts In">
            <select className="input-field" value={draft.academicYearStart} onChange={e => set('academicYearStart', e.target.value)}>
              {['March', 'April', 'August', 'September'].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </Field>
          <Field label="Examination System">
            <select className="input-field" value={draft.examSystem} onChange={e => set('examSystem', e.target.value as typeof draft.examSystem)}>
              {EXAM_SYSTEMS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Grading Scale">
            <select className="input-field" value={draft.gradingScale} onChange={e => set('gradingScale', e.target.value as typeof draft.gradingScale)}>
              {GRADING_SCALES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </Field>
          <Field label="Passing Percentage (%)"><input type="number" min={0} max={100} className="input-field" value={draft.passingPercentage} onChange={e => set('passingPercentage', Number(e.target.value))} /></Field>
          <Field label="Weekly Off Day">
            <select className="input-field" value={draft.weeklyOff} onChange={e => set('weeklyOff', e.target.value)}>
              {['Friday', 'Saturday', 'Sunday', 'Friday & Sunday'].map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </Field>
        </Section>

        {/* Fees */}
        <Section icon={<Wallet className="w-5 h-5 text-primary" />} title="Fees & Currency">
          <Field label="Currency"><input className="input-field" value={draft.currency} onChange={e => set('currency', e.target.value)} /></Field>
          <Field label="Default Monthly Fee (₨)"><input type="number" className="input-field" value={draft.monthlyFeeDefault} onChange={e => set('monthlyFeeDefault', Number(e.target.value))} /></Field>
          <Field label="Admission Fee (₨)"><input type="number" className="input-field" value={draft.admissionFee} onChange={e => set('admissionFee', Number(e.target.value))} /></Field>
          <Field label="Late Fee Fine (₨/day)"><input type="number" className="input-field" value={draft.lateFeeFine} onChange={e => set('lateFeeFine', Number(e.target.value))} /></Field>
          <Field label="Fee Due Date (day of month)"><input type="number" min={1} max={28} className="input-field" value={draft.feeDueDate} onChange={e => set('feeDueDate', Number(e.target.value))} /></Field>
        </Section>

        {/* Religious / Cultural — Pakistan-specific */}
        <Section icon={<Award className="w-5 h-5 text-primary" />} title="Cultural & Religious Settings">
          <Toggle label="Islamiat as Compulsory Subject" hint="Auto-add to every class timetable" value={draft.islamiatCompulsory} onChange={v => set('islamiatCompulsory', v)} />
          <Toggle label="Nazra / Qaida Period" hint="Daily Quran reading slot in schedule" value={draft.qaidaTimings} onChange={v => set('qaidaTimings', v)} />
          <Toggle label="Zuhr Prayer Break" hint="Reserve break time for congregational prayer" value={draft.prayerBreak} onChange={v => set('prayerBreak', v)} />
          <Toggle label="Ramadan Schedule" hint="Auto-shorten timings during Ramadan" value={draft.ramadanSchedule} onChange={v => set('ramadanSchedule', v)} />
        </Section>

        {/* Subjects */}
        <Section icon={<BookOpen className="w-5 h-5 text-primary" />} title="Subjects Offered" full>
          <div className="flex flex-wrap gap-2 mb-3">
            {draft.subjects.map(s => (
              <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm border border-primary/20">
                {s}
                <button type="button" onClick={() => removeSubject(s)} className="hover:text-destructive"><X className="w-3.5 h-3.5" /></button>
              </span>
            ))}
            {draft.subjects.length === 0 && <span className="text-sm text-muted-foreground">No subjects added yet</span>}
          </div>
          <div className="flex gap-2">
            <input className="input-field flex-1" placeholder="Add new subject (e.g. Arabic)" value={newSubject}
              onChange={e => setNewSubject(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSubject(newSubject))} />
            <button type="button" onClick={() => addSubject(newSubject)} className="btn-secondary flex items-center gap-1"><Plus className="w-4 h-4" /> Add</button>
          </div>
          <div className="mt-3">
            <p className="text-xs text-muted-foreground mb-2">Quick add common Pakistani subjects:</p>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_SUBJECTS.filter(s => !draft.subjects.includes(s)).map(s => (
                <button key={s} type="button" onClick={() => addSubject(s)} className="text-xs px-2.5 py-1 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors">+ {s}</button>
              ))}
            </div>
          </div>
        </Section>

        {/* Communication */}
        <Section icon={<MessageCircle className="w-5 h-5 text-primary" />} title="Communication Channels">
          <Toggle label="WhatsApp Notifications" hint="Send fee reminders, attendance alerts via WhatsApp" value={draft.whatsappEnabled} onChange={v => set('whatsappEnabled', v)} />
          <Toggle label="SMS Notifications" hint="Send via Pakistani SMS gateways (Jazz/Zong/Telenor)" value={draft.smsEnabled} onChange={v => set('smsEnabled', v)} />
          <Toggle label="Parent Portal Access" hint="Allow parents to view results, fees, attendance" value={draft.parentPortalEnabled} onChange={v => set('parentPortalEnabled', v)} />
        </Section>

        {/* Appearance */}
        <Section icon={<Palette className="w-5 h-5 text-primary" />} title="Appearance & Language">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium flex items-center gap-2"><Moon className="w-4 h-4" /> Dark Mode</p>
              <p className="text-xs text-muted-foreground">Toggle light/dark theme</p>
            </div>
            <button onClick={toggle} className={`w-12 h-6 rounded-full transition-colors relative ${isDark ? 'bg-primary' : 'bg-muted'}`}>
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-card shadow transition-transform ${isDark ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Interface Language / زبان</p>
              <p className="text-xs text-muted-foreground">{lang === 'en' ? 'Currently English' : 'موجودہ زبان: اردو'}</p>
            </div>
            <button onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
              className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors flex items-center gap-2">
              <Globe className="w-4 h-4" />
              {lang === 'en' ? 'اردو میں دیکھیں' : 'View in English'}
            </button>
          </div>
        </Section>
      </div>

      {/* Sticky save bar */}
      <div className="sticky bottom-4 flex justify-end">
        <button onClick={save} className="btn-primary flex items-center gap-2 shadow-lg">
          <Save className="w-4 h-4" /> Save All Changes
        </button>
      </div>
    </div>
  );
}

function Section({ icon, title, children, full }: { icon: React.ReactNode; title: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={`card-white ${full ? 'lg:col-span-2' : ''}`}>
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h3 className="font-display font-semibold">{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function Toggle({ label, hint, value, onChange }: { label: string; hint?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="pr-3">
        <p className="text-sm font-medium">{label}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      <button onClick={() => onChange(!value)} className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${value ? 'bg-primary' : 'bg-muted'}`}>
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-card shadow transition-transform ${value ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
    </div>
  );
}
