import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { useI18n } from '@/lib/i18n-context';
import { useSchool } from '@/lib/school-context';
import {
  LayoutDashboard, Users, CalendarCheck, CreditCard, FileText,
  GraduationCap, Clock, BarChart2, Sparkles, Settings, LogOut,
  Bell, Search, Menu, RefreshCw, BookOpen,
  UserCheck, CalendarX, TrendingUp,
  CalendarDays, Award, Megaphone, ClipboardList, ScrollText,
  MessageSquare, Newspaper, Crown, Library, Bus, Activity
} from 'lucide-react';
import { useState, useEffect } from 'react';
import AIAssistant from './AIAssistant';

const NAV_GROUPS = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard',     path: '/dashboard',               icon: LayoutDashboard },
      { label: 'Activity Log',  path: '/dashboard/activity',      icon: Activity },
    ]
  },
  {
    title: 'Academics',
    items: [
      { label: 'Students',      path: '/dashboard/students',      icon: Users },
      { label: 'Admissions',    path: '/dashboard/admissions',    icon: GraduationCap },
      { label: 'Classes',       path: '/dashboard/classes',       icon: BookOpen },
      { label: 'Subjects',      path: '/dashboard/subjects',      icon: FileText },
      { label: 'Attendance',    path: '/dashboard/attendance',    icon: CalendarCheck },
      { label: 'Results',       path: '/dashboard/results',       icon: BarChart2 },
      { label: 'Result Cards',  path: '/dashboard/result-card',   icon: ScrollText },
      { label: 'Exams',         path: '/dashboard/exams',         icon: ClipboardList },
      { label: 'Homework',      path: '/dashboard/homework',      icon: ClipboardList },
    ]
  },
  {
    title: 'Operations',
    items: [
      { label: 'Teachers',      path: '/dashboard/teachers',        icon: UserCheck },
      { label: 'Fees',          path: '/dashboard/fees',            icon: CreditCard },
      { label: 'Fee Invoices',  path: '/dashboard/fee-invoices',    icon: FileText },
      { label: 'Timetable',     path: '/dashboard/schedule',        icon: Clock },
      { label: 'Leave',         path: '/dashboard/leave',           icon: CalendarX },
      { label: 'Library',       path: '/dashboard/library',         icon: Library },
      { label: 'Transport',     path: '/dashboard/transport',       icon: Bus },
    ]
  },
  {
    title: 'Communication',
    items: [
      { label: 'Messages',      path: '/dashboard/messages',      icon: MessageSquare },
      { label: 'Notice Board',  path: '/dashboard/notice-board',  icon: Newspaper },
      { label: 'Announcements', path: '/dashboard/announcements', icon: Megaphone },
      { label: 'Notifications', path: '/dashboard/notifications', icon: Bell },
    ]
  },
  {
    title: 'Insights',
    items: [
      { label: 'Analytics',     path: '/dashboard/analytics',     icon: TrendingUp },
      { label: 'Reports',       path: '/dashboard/reports',       icon: BarChart2 },
      { label: 'Calendar',      path: '/dashboard/calendar',      icon: CalendarDays },
      { label: 'Certificates',  path: '/dashboard/certificates',  icon: Award },
    ]
  },
  {
    title: 'Account',
    items: [
      { label: 'Subscription',  path: '/subscription',            icon: Crown },
      { label: 'Settings',      path: '/dashboard/settings',      icon: Settings },
    ]
  },
];

export default function DashboardLayout() {
  const { user, profile, signOut } = useAuth();
  const { lang, setLang } = useI18n();
  const { settings } = useSchool();
  const location = useLocation();
  const navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [notifCount] = useState(3);

  const displayName   = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Admin';
  const displayRole   = profile?.role || 'Principal';
  const displaySchool = settings?.name || 'Islamia Public School, Mirpur AJK';

  useEffect(() => { setDrawerOpen(false); }, [location.pathname]);

  // Listen for AI navigation events from action-store
  useEffect(() => {
    const handler = (e: Event) => {
      const path = (e as CustomEvent).detail?.path;
      if (path) navigate(path);
    };
    window.addEventListener('ai-navigate', handler);
    return () => window.removeEventListener('ai-navigate', handler);
  }, [navigate]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Brand */}
      <div className="px-5 pt-6 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 flex-shrink-0">
            <GraduationCap size={17} className="text-slate-900" />
          </div>
          <div>
            <h1 className="font-display font-semibold text-slate-900 text-[18px] tracking-[-0.025em] leading-none">
              Scholara
            </h1>
            <p className="text-[11px] text-slate-500 font-medium mt-1 truncate max-w-[160px]">
              {displaySchool.split(',')[0]}
            </p>
          </div>
        </div>
        {/* Demo badge */}
        <div className="mt-3.5 inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-[10px] font-semibold text-amber-700 uppercase tracking-[0.18em]">Demo Workspace</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-4 scrollbar-hide">
        {NAV_GROUPS.map(group => (
          <div key={group.title}>
            <p className="px-3 mb-1.5 text-[10.5px] font-semibold text-slate-400 uppercase tracking-[0.18em]">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const active =
                  location.pathname === item.path ||
                  (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 text-[13px] font-medium tracking-tight
                      ${active
                        ? 'bg-amber-50 text-amber-700 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                  >
                    <item.icon
                      size={15}
                      className={active ? 'text-amber-500' : 'text-slate-400 group-hover:text-slate-600'}
                      strokeWidth={active ? 2.25 : 2}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom user card */}
      <div className="px-4 py-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center text-[12px] font-semibold flex-shrink-0">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-slate-900 truncate tracking-tight">{displayName}</p>
            <p className="text-[11.5px] text-slate-500 capitalize">{displayRole}</p>
          </div>
          <Settings size={14} className="text-slate-300" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col pt-[44px] font-sans antialiased">

      {/* Top Demo Banner */}
      <div className="fixed top-0 left-0 right-0 h-[44px] bg-gradient-to-r from-amber-400 to-amber-500 flex items-center justify-center gap-3 z-[100] px-4">
        <p className="text-[13.5px] font-medium text-slate-900 tracking-tight">
          You're exploring the <span className="font-semibold">Scholara demo workspace</span>.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-slate-900 text-white text-[12px] font-semibold px-3 py-1 rounded-md hover:bg-slate-800 transition-colors tracking-tight"
        >
          Start free trial
        </button>
        <button
          onClick={() => navigate('/')}
          className="text-slate-900 text-[12px] font-medium border border-slate-900/20 px-3 py-1 rounded-md hover:bg-amber-600/20 transition-colors tracking-tight"
        >
          ← Back to Home
        </button>
      </div>

      <div className="flex flex-1">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex flex-col w-[248px] bg-white border-r border-slate-100 fixed inset-y-0 left-0 z-30 pt-[44px]">
          <SidebarContent />
        </aside>

        {/* MOBILE DRAWER */}
        {drawerOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex pt-[44px]">
            <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
            <aside className="relative w-[260px] bg-white flex flex-col shadow-2xl z-50">
              <SidebarContent />
            </aside>
          </div>
        )}

        {/* MAIN */}
        <div className="flex-1 flex flex-col lg:ml-[248px]">

          {/* Header */}
          <header className="sticky top-[44px] z-20 bg-white/85 backdrop-blur-xl border-b border-slate-100 h-16 flex items-center px-4 md:px-6 gap-3">
            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setDrawerOpen(true)}
            >
              <Menu size={20} />
            </button>

            {/* Search bar */}
            <div className="hidden md:flex items-center gap-2 flex-1 max-w-md bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-400 cursor-text hover:border-slate-300 hover:bg-white transition-all group">
              <Search size={15} className="text-slate-400 group-hover:text-slate-500" />
              <span className="text-[13.5px] flex-1">Search students, teachers, fees…</span>
              <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-[10.5px] font-medium text-slate-500">⌘K</kbd>
            </div>

            <div className="flex-1" />

            {/* Right actions */}
            <div className="flex items-center gap-1.5">
              {/* AI Assistant toggle */}
              <button
                onClick={() => setAiOpen(o => !o)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12.5px] font-semibold tracking-tight transition-all border
                  ${aiOpen
                    ? 'bg-gradient-to-b from-amber-400 to-amber-600 text-slate-950 border-amber-500 shadow-lg shadow-amber-500/30'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300 hover:text-amber-700 hover:bg-amber-50/50'
                  }`}
              >
                <Sparkles size={14} />
                <span className="hidden sm:inline">AI Assistant</span>
              </button>

              {/* Notifications */}
              <button
                onClick={() => navigate('/dashboard/notifications')}
                className="relative p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                title="Notifications"
              >
                <Bell size={17} />
                {notifCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 bg-red-500 text-white rounded-full border-2 border-white text-[9px] font-semibold flex items-center justify-center">
                    {notifCount}
                  </span>
                )}
              </button>

              {/* Language */}
              <button className="hidden sm:inline-flex px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-[12.5px] font-medium transition-colors items-center gap-1.5">
                <span>🌐</span> <span>UR</span>
              </button>

              {/* Logout */}
              <button
                onClick={() => { signOut(); navigate('/login'); }}
                className="p-2.5 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                title="Sign out"
              >
                <LogOut size={17} />
              </button>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-4 md:p-8 max-w-[1400px] w-full">
            <Outlet />
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-100 bg-white px-6 py-3 flex items-center justify-between text-[12px] text-slate-400">
            <span>© 2026 Scholara · The intelligent school OS</span>
            <div className="flex items-center gap-1.5">
              <RefreshCw size={11} />
              <span>Synced just now</span>
            </div>
          </footer>
        </div>
      </div>

      {/* AI Assistant Slide-in Panel */}
      <AIAssistant open={aiOpen} onClose={() => setAiOpen(false)} />

      {/* Floating AI Button — always visible in corner */}
      {!aiOpen && (
        <button
          onClick={() => setAiOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-900 shadow-2xl shadow-amber-500/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
          title="Open AI Assistant"
        >
          <Sparkles size={22} />
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full bg-amber-500 animate-ping opacity-20 pointer-events-none" />
          {/* Tooltip */}
          <span className="absolute right-16 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none">
            AI Assistant
          </span>
        </button>
      )}
    </div>
  );
}
