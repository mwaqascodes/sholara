import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { useI18n } from '@/lib/i18n-context';
import { useSchool } from '@/lib/school-context';
import {
  GraduationCap, LayoutDashboard, Users, BookOpen, Calendar, BarChart3,
  DollarSign, Briefcase, Receipt, UserCheck, Clock, Bell, Settings,
  LogOut, Sun, Moon, Menu, X, Megaphone, ArrowUpCircle, FileText, Globe,
  ChevronLeft, TrendingUp, Trophy, Package, UserPlus, ClipboardList, Sparkles
} from 'lucide-react';
import { useState } from 'react';
import BackgroundOrbs from './BackgroundOrbs';
import AIAssistant from './AIAssistant';

interface NavGroup {
  title: string;
  titleUr: string;
  items: NavItem[];
}

interface NavItem {
  label: string;
  i18nKey: string;
  path: string;
  icon: React.ElementType;
  roles: string[];
}

const navGroups: NavGroup[] = [
  {
    title: 'OVERVIEW', titleUr: 'جائزہ',
    items: [
      { label: 'Dashboard', i18nKey: 'nav.dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'teacher', 'student'] },
      { label: 'Analytics', i18nKey: 'nav.analytics', path: '/dashboard/analytics', icon: TrendingUp, roles: ['admin'] },
    ],
  },
  {
    title: 'ACADEMICS', titleUr: 'تعلیمی',
    items: [
      { label: 'Students', i18nKey: 'nav.students', path: '/dashboard/students', icon: Users, roles: ['admin', 'teacher'] },
      { label: 'Teachers', i18nKey: 'nav.teachers', path: '/dashboard/teachers', icon: UserCheck, roles: ['admin'] },
      { label: 'Attendance', i18nKey: 'nav.attendance', path: '/dashboard/attendance', icon: Calendar, roles: ['admin', 'teacher', 'student'] },
      { label: 'Exam Results', i18nKey: 'nav.results', path: '/dashboard/results', icon: BarChart3, roles: ['admin', 'teacher', 'student'] },
      { label: 'Homework', i18nKey: 'nav.homework', path: '/dashboard/homework', icon: BookOpen, roles: ['admin', 'teacher', 'student'] },
    ],
  },
  {
    title: 'FINANCE', titleUr: 'مالیات',
    items: [
      { label: 'Fee Management', i18nKey: 'nav.fees', path: '/dashboard/fees', icon: DollarSign, roles: ['admin', 'student'] },
      { label: 'Payroll', i18nKey: 'nav.payroll', path: '/dashboard/payroll', icon: Briefcase, roles: ['admin'] },
      { label: 'Expenses', i18nKey: 'nav.expenses', path: '/dashboard/expenses', icon: Receipt, roles: ['admin'] },
    ],
  },
  {
    title: 'SCHOOL OPS', titleUr: 'اسکول آپریشنز',
    items: [
      { label: 'Academic Calendar', i18nKey: 'nav.calendar', path: '/dashboard/calendar', icon: Calendar, roles: ['admin', 'teacher', 'student'] },
      { label: 'Timetable', i18nKey: 'nav.timetable', path: '/dashboard/schedule', icon: Clock, roles: ['admin', 'teacher', 'student'] },
      { label: 'Merit System', i18nKey: 'nav.merit', path: '/dashboard/merit', icon: Trophy, roles: ['admin', 'teacher'] },
      { label: 'Inventory', i18nKey: 'nav.inventory', path: '/dashboard/inventory', icon: Package, roles: ['admin'] },
      { label: 'Class Promotion', i18nKey: 'nav.promotion', path: '/dashboard/promotion', icon: ArrowUpCircle, roles: ['admin'] },
    ],
  },
  {
    title: 'COMMUNICATION', titleUr: 'مواصلات',
    items: [
      { label: 'Announcements', i18nKey: 'nav.announcements', path: '/dashboard/announcements', icon: Megaphone, roles: ['admin', 'teacher', 'student'] },
      { label: 'Notifications', i18nKey: 'nav.notifications', path: '/dashboard/notifications', icon: Bell, roles: ['admin'] },
      { label: 'Leave', i18nKey: 'nav.leave', path: '/dashboard/leave', icon: ClipboardList, roles: ['admin', 'teacher', 'student'] },
    ],
  },
  {
    title: 'ADMIN', titleUr: 'انتظامی',
    items: [
      { label: 'Admissions', i18nKey: 'nav.admissions', path: '/dashboard/admissions', icon: UserPlus, roles: ['admin'] },
      { label: 'Result Card', i18nKey: 'nav.resultCard', path: '/dashboard/result-card', icon: FileText, roles: ['admin', 'teacher'] },
      { label: 'Certificates / SLC', i18nKey: 'nav.certificates', path: '/dashboard/certificates', icon: FileText, roles: ['admin'] },
      { label: 'Settings', i18nKey: 'nav.settings', path: '/dashboard/settings', icon: Settings, roles: ['admin'] },
    ],
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const { t, lang, setLang } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="app-bg min-h-screen relative">
      <BackgroundOrbs />

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full z-50 glass-sidebar flex flex-col transition-all duration-300 ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            {!collapsed && <span className="font-display text-lg font-bold text-white whitespace-nowrap">PakEducate</span>}
          </Link>
          <button className="lg:hidden text-white/70 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
          <button className="hidden lg:block text-white/40 hover:text-white/70 transition-colors" onClick={() => setCollapsed(!collapsed)}>
            <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* School name */}
        {!collapsed && <SchoolBadge />}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-1" style={{ scrollbarWidth: 'thin' }}>
          {navGroups.map(group => {
            const visibleItems = group.items.filter(item => item.roles.includes(user.role));
            if (visibleItems.length === 0) return null;
            return (
              <div key={group.title} className="mb-1">
                {!collapsed && (
                  <p className="text-[10px] uppercase tracking-wider px-3 pt-3 pb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    {lang === 'ur' ? group.titleUr : group.title}
                  </p>
                )}
                {visibleItems.map(item => {
                  const active = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={active ? 'nav-item-active' : 'nav-item'}
                      title={collapsed ? t(item.i18nKey) : undefined}
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      {!collapsed && <span className="truncate">{t(item.i18nKey)}</span>}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-2 space-y-0.5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={() => setLang(lang === 'en' ? 'ur' : 'en')} className="nav-item w-full">
            <Globe className="w-4 h-4 shrink-0" />
            {!collapsed && t('common.language')}
          </button>
          <button onClick={toggle} className="nav-item w-full">
            {isDark ? <Sun className="w-4 h-4 shrink-0" /> : <Moon className="w-4 h-4 shrink-0" />}
            {!collapsed && (isDark ? t('common.lightMode') : t('common.darkMode'))}
          </button>
          {!collapsed && (
            <div className="flex items-center gap-2 px-3 py-2 mt-1">
              <span className="text-xl">{user.avatar}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white/90 truncate">{user.name}</p>
                <p className="text-[10px] capitalize" style={{ color: 'rgba(255,255,255,0.4)' }}>{user.role}</p>
              </div>
              <button onClick={handleLogout} className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors" title="Logout">
                <LogOut className="w-4 h-4 text-red-400" />
              </button>
            </div>
          )}
          {collapsed && (
            <button onClick={handleLogout} className="nav-item w-full text-red-400">
              <LogOut className="w-4 h-4 shrink-0" />
            </button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className={`transition-all duration-300 min-h-screen flex flex-col relative z-10 ${collapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'}`}>
        {/* Top navbar */}
        <header className="h-16 glass-navbar flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5 text-white/70" />
            </button>
            <h1 className="font-display font-semibold text-lg" style={{ color: '#f1f5f9' }}>
              {navGroups.flatMap(g => g.items).find(n => n.path === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Bell className="w-5 h-5" style={{ color: 'rgba(241,245,249,0.6)' }} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span className="text-lg">{user.avatar}</span>
              <div className="hidden sm:block">
                <p className="text-xs font-medium" style={{ color: '#f1f5f9' }}>{user.name}</p>
                <p className="text-[10px] capitalize" style={{ color: 'rgba(241,245,249,0.5)' }}>{user.role}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 animate-fade-in-up">
          {children}
        </main>
      </div>

      <AIAssistant />
    </div>
  );
}
