import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import {
  LayoutDashboard, School, CreditCard, Users, Settings,
  LogOut, ShieldCheck, Bell, BarChart2
} from 'lucide-react';

const NAV = [
  { label: 'Overview',     path: '/super-admin',               icon: LayoutDashboard },
  { label: 'All Schools',  path: '/super-admin/schools',       icon: School },
  { label: 'Subscriptions',path: '/super-admin/subscriptions', icon: CreditCard },
  { label: 'Users',        path: '/super-admin/users',         icon: Users },
  { label: 'Analytics',    path: '/super-admin/analytics',     icon: BarChart2 },
  { label: 'Settings',     path: '/super-admin/settings',      icon: Settings },
];

export default function SuperAdminLayout() {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Super Admin';

  return (
    <div className="min-h-screen bg-slate-50 flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <aside className="w-[240px] bg-slate-900 flex flex-col fixed inset-y-0 left-0 z-30">
        {/* Brand */}
        <div className="px-5 pt-6 pb-5 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-500 flex items-center justify-center shadow-lg flex-shrink-0">
              <ShieldCheck size={17} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white tracking-tight leading-none">
                Schol<span className="text-red-400">ara</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                Super Admin
              </p>
            </div>
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 border border-red-500/30 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <span className="text-[9px] font-black text-red-400 uppercase tracking-widest">Global Access</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {NAV.map(item => {
            const active = location.pathname === item.path ||
              (item.path !== '/super-admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 text-[13px] font-semibold
                  ${active
                    ? 'bg-red-500/15 text-red-400'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
              >
                <item.icon size={15} className={active ? 'text-red-400' : 'text-slate-500 group-hover:text-slate-400'} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-4 py-4 border-t border-slate-700">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs font-black flex-shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">{displayName}</p>
              <p className="text-[10px] text-slate-500">Super Admin</p>
            </div>
            <button
              onClick={() => { signOut(); navigate('/login'); }}
              className="text-slate-500 hover:text-red-400 transition-colors"
              title="Sign out"
            >
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 ml-[240px] flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-100 h-16 flex items-center px-6 gap-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Super Admin Panel</h2>
          <div className="flex-1" />
          <button
            onClick={() => navigate('/dashboard')}
            className="text-xs font-bold px-4 py-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            ← School Dashboard
          </button>
          <button className="relative p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
            <Bell size={18} />
          </button>
        </header>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
