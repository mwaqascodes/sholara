import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import {
  GraduationCap, LayoutDashboard, Users, BookOpen, Calendar, BarChart3,
  DollarSign, Briefcase, Receipt, UserCheck, Clock, Bell, Settings,
  LogOut, Sun, Moon, Menu, X, Palmtree
} from 'lucide-react';
import { useState } from 'react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  roles: string[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'teacher', 'student', 'parent'] },
  { label: 'Students', path: '/dashboard/students', icon: Users, roles: ['admin', 'teacher'] },
  { label: 'Teachers', path: '/dashboard/teachers', icon: UserCheck, roles: ['admin'] },
  { label: 'Classes', path: '/dashboard/classes', icon: BookOpen, roles: ['admin', 'teacher'] },
  { label: 'Attendance', path: '/dashboard/attendance', icon: Calendar, roles: ['admin', 'teacher', 'student', 'parent'] },
  { label: 'Results', path: '/dashboard/results', icon: BarChart3, roles: ['admin', 'teacher', 'student', 'parent'] },
  { label: 'Fees', path: '/dashboard/fees', icon: DollarSign, roles: ['admin', 'parent'] },
  { label: 'Schedule', path: '/dashboard/schedule', icon: Clock, roles: ['admin', 'teacher', 'student'] },
  { label: 'Leave', path: '/dashboard/leave', icon: Palmtree, roles: ['admin', 'teacher', 'student'] },
  { label: 'Payroll', path: '/dashboard/payroll', icon: Briefcase, roles: ['admin'] },
  { label: 'Expenses', path: '/dashboard/expenses', icon: Receipt, roles: ['admin'] },
  { label: 'Notifications', path: '/dashboard/notifications', icon: Bell, roles: ['admin', 'teacher', 'student', 'parent'] },
  { label: 'Settings', path: '/dashboard/settings', icon: Settings, roles: ['admin'] },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { isDark, toggle } = useTheme();
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
    <div className="min-h-screen bg-background gradient-mesh">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed top-0 left-0 h-full w-64 z-50 glass-strong border-r border-border flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center justify-between h-16 px-5 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold">EduFlow</span>
          </Link>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* School indicator */}
        <div className="px-4 py-3 border-b border-border">
          <p className="text-xs text-muted-foreground">Current School</p>
          <p className="text-sm font-semibold truncate">Lincoln Academy</p>
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
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border space-y-1">
          <button onClick={toggle} className="nav-item w-full">
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button onClick={handleLogout} className="nav-item w-full text-destructive hover:text-destructive">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="lg:ml-64 min-h-screen flex flex-col">
        <header className="h-16 glass-strong border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
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
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass">
              <span className="text-xl">{user.avatar}</span>
              <div className="hidden sm:block">
                <p className="text-sm font-medium leading-tight">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
