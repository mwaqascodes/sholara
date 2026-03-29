import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { useI18n } from '@/lib/i18n-context';
import {
  GraduationCap, LayoutDashboard, Users, BookOpen, Calendar, BarChart3,
  DollarSign, Briefcase, Receipt, UserCheck, Clock, Bell, Settings,
  LogOut, Sun, Moon, Menu, X, Megaphone, ArrowUpCircle, FileText, Globe
} from 'lucide-react';
import { useState } from 'react';

interface NavItem {
  label: string;
  i18nKey: string;
  path: string;
  icon: React.ElementType;
  roles: string[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', i18nKey: 'nav.dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'teacher', 'student'] },
  { label: 'Students', i18nKey: 'nav.students', path: '/dashboard/students', icon: Users, roles: ['admin', 'teacher'] },
  { label: 'Teachers', i18nKey: 'nav.teachers', path: '/dashboard/teachers', icon: UserCheck, roles: ['admin'] },
  { label: 'Attendance', i18nKey: 'nav.attendance', path: '/dashboard/attendance', icon: Calendar, roles: ['admin', 'teacher', 'student'] },
  { label: 'Exam Results', i18nKey: 'nav.results', path: '/dashboard/results', icon: BarChart3, roles: ['admin', 'teacher', 'student'] },
  { label: 'Fee Management', i18nKey: 'nav.fees', path: '/dashboard/fees', icon: DollarSign, roles: ['admin', 'student'] },
  { label: 'Payroll', i18nKey: 'nav.payroll', path: '/dashboard/payroll', icon: Briefcase, roles: ['admin'] },
  { label: 'Timetable', i18nKey: 'nav.timetable', path: '/dashboard/schedule', icon: Clock, roles: ['admin', 'teacher', 'student'] },
  { label: 'Announcements', i18nKey: 'nav.announcements', path: '/dashboard/announcements', icon: Megaphone, roles: ['admin', 'teacher', 'student'] },
  { label: 'Leave', i18nKey: 'nav.leave', path: '/dashboard/leave', icon: BookOpen, roles: ['admin', 'teacher', 'student'] },
  { label: 'Expenses', i18nKey: 'nav.expenses', path: '/dashboard/expenses', icon: Receipt, roles: ['admin'] },
  { label: 'Class Promotion', i18nKey: 'nav.promotion', path: '/dashboard/promotion', icon: ArrowUpCircle, roles: ['admin'] },
  { label: 'Certificates / SLC', i18nKey: 'nav.certificates', path: '/dashboard/certificates', icon: FileText, roles: ['admin'] },
  { label: 'Settings', i18nKey: 'nav.settings', path: '/dashboard/settings', icon: Settings, roles: ['admin'] },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const { t, lang, setLang } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const filteredNav = navItems.filter(item => item.roles.includes(user.role));

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Dark green sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 z-50 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center justify-between h-16 px-5 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sidebar-foreground/20 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-sidebar-foreground" />
            </div>
            <span className="font-display text-lg font-bold text-sidebar-foreground">PakEducate</span>
          </Link>
          <button className="lg:hidden text-sidebar-foreground" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* School name */}
        <div className="px-4 py-3 border-b border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/50">Current School</p>
          <p className="text-sm font-semibold text-sidebar-foreground truncate">Al-Noor Academy Lahore</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {filteredNav.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={active ? 'nav-item-active' : 'nav-item'}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {t(item.i18nKey)}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border space-y-1">
          <button onClick={() => setLang(lang === 'en' ? 'ur' : 'en')} className="nav-item w-full">
            <Globe className="w-4 h-4" />
            {t('common.language')}
          </button>
          <button onClick={toggle} className="nav-item w-full">
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {isDark ? t('common.lightMode') : t('common.darkMode')}
          </button>
          <button onClick={handleLogout} className="nav-item w-full text-destructive hover:text-destructive">
            <LogOut className="w-4 h-4" />
            {t('common.logout')}
          </button>
        </div>
      </aside>

      <div className="lg:ml-64 min-h-screen flex flex-col">
        {/* White top navbar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-display font-semibold text-lg">
              {filteredNav.find(n => n.path === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted">
              <span className="text-xl">{user.avatar}</span>
              <div className="hidden sm:block">
                <p className="text-sm font-medium leading-tight">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
