import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { useI18n } from '@/lib/i18n-context';
import { useSchool } from '@/lib/school-context';
import {
  LayoutDashboard, Users, GraduationCap, CalendarCheck, CreditCard,
  FileText, Clock, Bell, BookOpen, Sparkles, Settings, LogOut, Menu, X,
  Search, BarChart2, ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import AIAssistant from './AIAssistant';
import { toast } from 'sonner';

interface NavItem {
  label: string;
  labelUr: string;
  path: string;
  icon: React.ElementType;
  roles: string[];
  badge?: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', labelUr: 'ڈیش بورڈ', path: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'teacher', 'student'] },
  { label: 'Students', labelUr: 'طلباء', path: '/dashboard/students', icon: Users, roles: ['admin', 'teacher'] },
  { label: 'Attendance', labelUr: 'حاضری', path: '/dashboard/attendance', icon: CalendarCheck, roles: ['admin', 'teacher', 'student'] },
  { label: 'Fee Management', labelUr: 'فیس', path: '/dashboard/fees', icon: CreditCard, roles: ['admin', 'student'] },
  { label: 'Results', labelUr: 'نتائج', path: '/dashboard/results', icon: FileText, roles: ['admin', 'teacher', 'student'] },
  { label: 'Teachers', labelUr: 'اساتذہ', path: '/dashboard/teachers', icon: GraduationCap, roles: ['admin'] },
  { label: 'Timetable', labelUr: 'ٹائم ٹیبل', path: '/dashboard/schedule', icon: Clock, roles: ['admin', 'teacher', 'student'] },
  { label: 'Reports', labelUr: 'رپورٹس', path: '/dashboard/analytics', icon: BarChart2, roles: ['admin'] },
  { label: 'AI Assistant', labelUr: 'AI معاون', path: '#ai', icon: Sparkles, roles: ['admin', 'teacher', 'student'], badge: 'NEW' },
  { label: 'Settings', labelUr: 'ترتیبات', path: '/dashboard/settings', icon: Settings, roles: ['admin'] },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, signOut } = useAuth();
  const { lang, setLang } = useI18n();
  const { settings } = useSchool();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userRole = (profile?.role as string) || 'admin';
  const userName = profile?.full_name || user?.email?.split('@')[0] || 'Admin';
  const userInitials = userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const avatarUrl = profile?.avatar_url;

  const handleLogout = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  const currentPage = navItems.find(n => n.path === location.pathname)?.label || 'Dashboard';
  const visibleNav = navItems.filter(n => n.roles.includes(userRole));

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full z-50 w-[260px] bg-sidebar flex flex-col transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-sidebar-border">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="w-4.5 h-4.5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-sidebar-foreground text-base">IlmDesk</span>
              <p className="text-[10px] text-sidebar-muted leading-none mt-0.5">School Management System</p>
            </div>
          </Link>
          <button className="lg:hidden text-sidebar-foreground/70 hover:text-sidebar-foreground" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {visibleNav.map(item => {
            const active = item.path !== '#ai' && location.pathname === item.path;
            const isAI = item.path === '#ai';
            return (
              <button
                key={item.path}
                onClick={() => {
                  if (isAI) {
                    // AI handled by floating widget
                    return;
                  }
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group ${
                  active
                    ? 'bg-primary/15 text-primary font-semibold border-l-[3px] border-primary pl-[9px]'
                    : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                }`}
              >
                <item.icon className={`w-[18px] h-[18px] shrink-0 ${active ? 'text-primary' : ''}`} />
                <div className="flex-1 text-left min-w-0">
                  <span className="block truncate">{item.label}</span>
                  <span className="block text-[10px] opacity-50 truncate font-urdu">{item.labelUr}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary/20 text-primary">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar bottom — user */}
        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-2 py-2">
            {avatarUrl ? (
              <img src={avatarUrl} alt={userName} className="w-9 h-9 rounded-full object-cover border-2 border-primary/30" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
                {userInitials}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{userName}</p>
              <p className="text-[11px] text-sidebar-muted capitalize">{userRole}</p>
            </div>
            <button onClick={handleLogout} className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors" title="Logout">
              <LogOut className="w-4 h-4 text-sidebar-muted" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-foreground text-lg">{currentPage}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border hover:bg-muted transition-colors text-muted-foreground"
            >
              {lang === 'en' ? 'English | اردو' : 'اردو | English'}
            </button>
            {/* Notification bell */}
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">3</span>
            </button>
            {/* User avatar */}
            {avatarUrl ? (
              <img src={avatarUrl} alt={userName} className="w-8 h-8 rounded-full object-cover border border-border" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                {userInitials}
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 animate-fade-in-up bg-background">{children}</main>
      </div>

      <AIAssistant />
    </div>
  );
}
