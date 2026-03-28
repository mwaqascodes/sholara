import { Settings as SettingsIcon, School, Users, Palette } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';

export default function SettingsPage() {
  const { isDark, toggle } = useTheme();

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Settings</h2>

      <div className="space-y-4 max-w-2xl">
        <div className="glass-card">
          <div className="flex items-center gap-3 mb-4">
            <School className="w-5 h-5 text-primary" />
            <h3 className="font-display font-semibold">School Information</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">School Name</label>
              <input type="text" defaultValue="Lincoln Academy" className="w-full mt-1 px-3 py-2 rounded-lg border border-border text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Email</label>
              <input type="email" defaultValue="admin@lincoln.edu" className="w-full mt-1 px-3 py-2 rounded-lg border border-border text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Phone</label>
              <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full mt-1 px-3 py-2 rounded-lg border border-border text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Address</label>
              <input type="text" defaultValue="123 Education St" className="w-full mt-1 px-3 py-2 rounded-lg border border-border text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
        </div>

        <div className="glass-card">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-5 h-5 text-primary" />
            <h3 className="font-display font-semibold">Appearance</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Dark Mode</p>
              <p className="text-xs text-muted-foreground">Toggle between light and dark theme</p>
            </div>
            <button
              onClick={toggle}
              className={`w-12 h-6 rounded-full transition-colors relative ${isDark ? 'bg-primary' : 'bg-muted'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-primary-foreground shadow transition-transform ${isDark ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>
        </div>

        <button className="px-6 py-2.5 rounded-lg gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
          Save Changes
        </button>
      </div>
    </div>
  );
}
