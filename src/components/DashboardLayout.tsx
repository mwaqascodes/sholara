import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { useSchool } from '@/lib/school-context';
import {
  LayoutDashboard, Users, UserPlus, BookOpen, FileText, CalendarCheck,
  ClipboardList, Clock, Bell, Settings, LogOut, Menu, X, GraduationCap,
  CreditCard, BarChart2, Sparkles, Globe
} from 'lucide-react';
import { useState } from 'react';
import AIAssistant from './AIAssistant';
import { toast } from 'sonner';

interface NavGroup {
  title: string;
  items: { label: string; path: string; icon: React.ElementType; roles: string[]; badge?: string }[];
}

const navGroups: NavGroup[] = [
  {
    title: 'OVERVIEW',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'teacher', 'student'] },
    ],
  },
  {
    title: 'ACADEMICS',
    items: [
      { label: 'Students', path: '/dashboard/students', icon: Users, roles: ['admin', 'teacher'] },
      { label: 'Admissions', path: '/dashboard/admissions', icon: UserPlus, roles: ['admin'] },
      { label: 'Classes', path: '/dashboard/classes', icon: BookOpen, roles: ['admin'] },
      { label: 'Attendance', path: '/dashboard/attendance', icon: CalendarCheck, roles: ['admin', 'teacher', 'student'] },
      { label: 'Results', path: '/dashboard/results', icon: ClipboardList, roles: ['admin', 'teacher', 'student'] },
    ],
  },
  {
    title: 'FINANCE',
    items: [
      { label: 'Fee Management', path: '/dashboard/fees', icon: CreditCard, roles: ['admin', 'student'] },
      { label: 'Payroll', path: '/dashboard/payroll', icon: CreditCard, roles: ['admin'] },
      { label: 'Expenses', path: '/dashboard/expenses', icon: CreditCard, roles: ['admin'] },
    ],
  },
  {
    title: 'SCHOOL',
    items: [
      { label: 'Teachers', path: '/dashboard/teachers', icon: GraduationCap, roles: ['admin'] },
      { label: 'Timetable', path: '/dashboard/schedule', icon: Clock, roles: ['admin', 'teacher', 'student'] },
      { label: 'Announcements', path: '/dashboard/announcements', icon: Bell, roles: ['admin', 'teacher', 'student'] },
      { label: 'Reports', path: '/dashboard/analytics', icon: BarChart2, roles: ['admin'] },
    ],
  },
  {
    title: 'OTHER',
    items: [
      { label: 'Result Card', path: '/dashboard/result-card', icon: FileText, roles: ['admin', 'teacher'] },
      { label: 'Certificates', path: '/dashboard/certificates', icon: FileText, roles: ['admin'] },
      { label: 'Settings', path: '/dashboard/settings', icon: Settings, roles: ['admin'] },
    ],
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, signOut } = useAuth();
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

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ─── WHITE SIDEBAR ─── */}
      <aside className={`fixed top-0 left-0 h-full z-50 w-[260px] bg-card border-r border-border flex flex-col transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        {/* Logo */}
        <div className="px-5 pt-5 pb-3">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-extrabold text-foreground tracking-tight">
              Ilm<span className="text-primary">Desk</span>
            </span>
          </Link>
          <p className="text-[11px] text-muted-foreground mt-0.5">{settings.name || 'School Management System'}</p>
          <span className="inline-block mt-1.5 text-[10px] font-bold uppercase tracking-wider text-primary">
            DEMO
          </span>
        </div>

        <button className="absolute top-4 right-3 lg:hidden text-muted-foreground hover:text-foreground" onClick={() => setSidebarOpen(false)}>
          <X className="w-5 h-5" />
        </button>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 pb-3" style={{ scrollbarWidth: 'thin' }}>
          {navGroups.map(group => {
            const visibleItems = group.items.filter(item => item.roles.includes(userRole));
            if (visibleItems.length === 0) return null;
            return (
              <div key={group.title} className="mt-5 first:mt-2">
                <p className="text-[10px] uppercase tracking-[1.2px] font-bold text-muted-foreground/60 px-3 mb-1.5">
                  {group.title}
                </p>
                {visibleItems.map(item => {
                  const active = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] transition-all duration-150 ${
                        active
                          ? 'bg-accent text-primary font-semibold border-l-[3px] border-primary ml-0 pl-[9px]'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                      }`}
                    >
                      <item.icon className={`w-[18px] h-[18px] shrink-0 ${active ? 'text-primary' : ''}`} />
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary/15 text-primary">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* ─── MAIN AREA ─── */}
      <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-semibold text-foreground">{settings.name || 'IlmDesk School'}</span>
              <span className="text-[11px] text-muted-foreground">{userName} · {userRole}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
            </button>
            {/* Logout */}
            <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 animate-fade-in-up">{children}</main>
      </div>

      <AIAssistant />
    </div>
  );
}
