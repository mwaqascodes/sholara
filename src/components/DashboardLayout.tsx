import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { useI18n } from '@/lib/i18n-context';
import { useSchool } from '@/lib/school-context';
import {
  GraduationCap, LayoutDashboard, Users, BookOpen, Calendar, BarChart3,
  DollarSign, Briefcase, Receipt, UserCheck, Clock, Bell, Settings,
  LogOut, Sun, Moon, Menu, X, Megaphone, ArrowUpCircle, FileText, Globe,
  ChevronLeft, TrendingUp, Trophy, Package, UserPlus, ClipboardList, Sparkles, Search
} from 'lucide-react';
import { useState } from 'react';
import BackgroundOrbs from './BackgroundOrbs';
import AIAssistant from './AIAssistant';
import { toast } from 'sonner';

interface NavGroup { title: string; items: NavItem[]; }
interface NavItem { label: string; path: string; icon: React.ElementType; roles: string[]; }

const navGroups: NavGroup[] = [
  {
    title: 'OVERVIEW',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'teacher', 'student'] },
      { label: 'Analytics', path: '/dashboard/analytics', icon: TrendingUp, roles: ['admin'] },
    ],
  },
  {
    title: 'ACADEMICS',
    items: [
      { label: 'Students', path: '/dashboard/students', icon: Users, roles: ['admin', 'teacher'] },
      { label: 'Teachers', path: '/dashboard/teachers', icon: UserCheck, roles: ['admin'] },
      { label: 'Classes', path: '/dashboard/classes', icon: BookOpen, roles: ['admin'] },
      { label: 'Attendance', path: '/dashboard/attendance', icon: Calendar, roles: ['admin', 'teacher', 'student'] },
      { label: 'Exam Results', path: '/dashboard/results', icon: BarChart3, roles: ['admin', 'teacher', 'student'] },
      { label: 'Homework', path: '/dashboard/homework', icon: BookOpen, roles: ['admin', 'teacher', 'student'] },
    ],
  },
  {
    title: 'FINANCE',
    items: [
      { label: 'Fee Management', path: '/dashboard/fees', icon: DollarSign, roles: ['admin', 'student'] },
      { label: 'Payroll', path: '/dashboard/payroll', icon: Briefcase, roles: ['admin'] },
      { label: 'Expenses', path: '/dashboard/expenses', icon: Receipt, roles: ['admin'] },
    ],
  },
  {
    title: 'SCHOOL OPS',
    items: [
      { label: 'Academic Calendar', path: '/dashboard/calendar', icon: Calendar, roles: ['admin', 'teacher', 'student'] },
      { label: 'Timetable', path: '/dashboard/schedule', icon: Clock, roles: ['admin', 'teacher', 'student'] },
      { label: 'Merit System', path: '/dashboard/merit', icon: Trophy, roles: ['admin', 'teacher'] },
      { label: 'Inventory', path: '/dashboard/inventory', icon: Package, roles: ['admin'] },
      { label: 'Class Promotion', path: '/dashboard/promotion', icon: ArrowUpCircle, roles: ['admin'] },
    ],
  },
  {
    title: 'COMMUNICATION',
    items: [
      { label: 'Announcements', path: '/dashboard/announcements', icon: Megaphone, roles: ['admin', 'teacher', 'student'] },
      { label: 'Notifications', path: '/dashboard/notifications', icon: Bell, roles: ['admin'] },
      { label: 'Leave Requests', path: '/dashboard/leave', icon: ClipboardList, roles: ['admin', 'teacher', 'student'] },
    ],
  },
  {
    title: 'ADMIN',
    items: [
      { label: 'Admissions', path: '/dashboard/admissions', icon: UserPlus, roles: ['admin'] },
      { label: 'Result Card', path: '/dashboard/result-card', icon: FileText, roles: ['admin', 'teacher'] },
      { label: 'Certificates', path: '/dashboard/certificates', icon: FileText, roles: ['admin'] },
      { label: 'Settings', path: '/dashboard/settings', icon: Settings, roles: ['admin'] },
    ],
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, signOut } = useAuth();
  const { isDark, toggle } = useTheme();
  const { t, lang, setLang } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const userRole = (profile?.role as string) || 'admin';
  const userName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const userInitials = userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const avatarUrl = profile?.avatar_url;

  const handleLogout = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  const currentPage = navGroups.flatMap(g => g.items).find(n => n.path === location.pathname)?.label || 'Dashboard';

  const AvatarComponent = ({ size = 'sm' }: { size?: 'sm' | 'lg' }) => {
    const s = size === 'lg' ? 'w-10 h-10 text-sm' : 'w-8 h-8 text-xs';
    return avatarUrl ? (
      <img src={avatarUrl} alt={userName} className={`${s} rounded-full object-cover`} style={{ border: '2px solid rgba(99,153,34,0.5)' }} />
    ) : (
      <div className={`${s} rounded-full flex items-center justify-center font-bold text-white shrink-0`} style={{ background: 'linear-gradient(135deg, #639922, #4d7a18)' }}>
        {userInitials}
      </div>
    );
  };

  return (
    <div className="app-bg min-h-screen relative">
      <BackgroundOrbs />

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full z-50 glass-sidebar flex flex-col transition-all duration-300 ${
        collapsed ? 'w-[74px]' : 'w-[268px]'
      } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center justify-between h-20 px-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #639922, #4d7a18)' }}>
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="flex items-baseline gap-0.5">
                <span className="font-display text-lg font-bold text-white whitespace-nowrap">Learnique</span>
                <span className="font-display text-lg font-bold whitespace-nowrap" style={{ color: '#86c94a' }}>-Vista</span>
              </div>
            )}
          </Link>
          <button className="lg:hidden text-white/70 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
          <button className="hidden lg:block text-white/40 hover:text-white/70 transition-colors" onClick={() => setCollapsed(!collapsed)}>
            <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {!collapsed && <SchoolBadge />}

        <nav className="flex-1 overflow-y-auto py-2 space-y-1" style={{ scrollbarWidth: 'thin' }}>
          {navGroups.map(group => {
            const visibleItems = group.items.filter(item => item.roles.includes(userRole));
            if (visibleItems.length === 0) return null;
            return (
              <div key={group.title} className="mb-1">
                {!collapsed && (
                  <p className="text-[10px] uppercase tracking-[1.5px] font-bold px-5 pt-5 pb-2" style={{ color: 'rgba(255,255,255,0.24)' }}>
                    {group.title}
                  </p>
                )}
                {visibleItems.map(item => {
                  const active = location.pathname === item.path;
                  return (
                    <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
                      className={active ? 'nav-item-active' : 'nav-item'} title={collapsed ? item.label : undefined}>
                      <item.icon className="w-4 h-4 shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        <div className="p-3 space-y-0.5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={toggle} className="nav-item w-full">
            {isDark ? <Sun className="w-4 h-4 shrink-0" /> : <Moon className="w-4 h-4 shrink-0" />}
            {!collapsed && (isDark ? 'Light Mode' : 'Dark Mode')}
          </button>
          {!collapsed && (
            <div className="flex items-center gap-2 px-3 py-2 mt-1">
              <AvatarComponent size="lg" />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-white/90 truncate">{userName}</p>
                <p className="text-[11px] capitalize" style={{ color: 'rgba(255,255,255,0.4)' }}>{userRole}</p>
              </div>
              <button onClick={() => navigate('/dashboard/settings')} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" title="Settings">
                <Settings className="w-4 h-4 text-white/40" />
              </button>
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

      <div className={`transition-all duration-300 min-h-screen flex flex-col relative z-10 ${collapsed ? 'lg:ml-[74px]' : 'lg:ml-[268px]'}`}>
        <header className="h-16 glass-navbar flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5 text-white/70" />
            </button>
            <h1 className="font-display font-semibold text-lg" style={{ color: '#f1f5f9' }}>{currentPage}</h1>
          </div>
          <div className="hidden md:flex items-center flex-1 max-w-sm mx-6">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(241,245,249,0.3)' }} />
              <input placeholder="Search students, fees..." className="w-full pl-10 pr-4 py-2 rounded-xl text-sm outline-none" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9' }} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-xl hover:bg-white/10 transition-colors" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <Bell className="w-4.5 h-4.5" style={{ color: 'rgba(241,245,249,0.6)' }} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <AvatarComponent />
              <div className="hidden sm:block">
                <p className="text-xs font-medium" style={{ color: '#f1f5f9' }}>{userName}</p>
                <p className="text-[10px] capitalize" style={{ color: 'rgba(241,245,249,0.5)' }}>{userRole}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 animate-fade-in-up">{children}</main>
      </div>

      <AIAssistant />
    </div>
  );
}

function SchoolBadge() {
  const { settings } = useSchool();
  return (
    <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(255,255,255,0.25)' }}>Current School</p>
      <p className="text-sm font-semibold text-white/90 truncate mt-0.5">{settings.name}</p>
      <div className="flex items-center gap-2 mt-1">
        <p className="text-[10px] truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>{settings.city} • {settings.board} Board</p>
      </div>
    </div>
  );
}
