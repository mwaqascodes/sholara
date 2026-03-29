import { Settings as SettingsIcon, School, Palette, Globe } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import { useI18n } from '@/lib/i18n-context';

export default function SettingsPage() {
  const { isDark, toggle } = useTheme();
  const { lang, setLang } = useI18n();

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Settings</h2>

      <div className="space-y-4 max-w-2xl">
        <div className="card-white">
          <div className="flex items-center gap-3 mb-4">
            <School className="w-5 h-5 text-primary" />
            <h3 className="font-display font-semibold">School Information</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="text-sm text-muted-foreground">School Name</label><input type="text" defaultValue="Al-Noor Academy" className="input-field mt-1" /></div>
            <div><label className="text-sm text-muted-foreground">Email</label><input type="email" defaultValue="admin@alnoor.edu.pk" className="input-field mt-1" /></div>
            <div><label className="text-sm text-muted-foreground">Phone</label><input type="tel" defaultValue="042-35781234" className="input-field mt-1" /></div>
            <div><label className="text-sm text-muted-foreground">Address</label><input type="text" defaultValue="123 Main Road, Gulberg III, Lahore" className="input-field mt-1" /></div>
          </div>
        </div>

        <div className="card-white">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-5 h-5 text-primary" />
            <h3 className="font-display font-semibold">Appearance</h3>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium">Dark Mode</p>
              <p className="text-xs text-muted-foreground">Toggle light/dark theme</p>
            </div>
            <button onClick={toggle} className={`w-12 h-6 rounded-full transition-colors relative ${isDark ? 'bg-primary' : 'bg-muted'}`}>
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-card shadow transition-transform ${isDark ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Language / زبان</p>
              <p className="text-xs text-muted-foreground">{lang === 'en' ? 'Switch to Urdu' : 'Switch to English'}</p>
            </div>
            <button onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
              className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors flex items-center gap-2">
              <Globe className="w-4 h-4" />
              {lang === 'en' ? 'اردو' : 'English'}
            </button>
          </div>
        </div>

        <button className="btn-primary">Save Changes</button>
      </div>
    </div>
  );
}
