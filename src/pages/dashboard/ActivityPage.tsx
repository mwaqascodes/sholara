import { useState, useMemo } from 'react';
import { Activity, Search, Trash2, Plus, Pencil, LogIn, Cpu, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { useActivity, clearActivity } from '@/lib/store';

const TYPE_META: Record<string, { label: string; bg: string; text: string; border: string; Icon: any }> = {
  create: { label: 'Created', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', Icon: Plus },
  update: { label: 'Updated', bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',    Icon: Pencil },
  delete: { label: 'Deleted', bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200',     Icon: Trash2 },
  login:  { label: 'Sign-in', bg: 'bg-violet-50',  text: 'text-violet-700',  border: 'border-violet-200',  Icon: LogIn },
  system: { label: 'System',  bg: 'bg-slate-100',  text: 'text-slate-700',   border: 'border-slate-200',   Icon: Cpu },
};

function relativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hour${hr === 1 ? '' : 's'} ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day} day${day === 1 ? '' : 's'} ago`;
  return new Date(iso).toLocaleDateString();
}

function formatExact(iso: string): string {
  return new Date(iso).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function ActivityPage() {
  const activity = useActivity();
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState<'all' | keyof typeof TYPE_META>('all');

  const modules = useMemo(() => {
    const set = new Set(activity.map(a => a.module));
    return ['all', ...Array.from(set).sort()];
  }, [activity]);

  const filtered = activity.filter(a => {
    const ms = a.actor.toLowerCase().includes(search.toLowerCase())
      || a.action.toLowerCase().includes(search.toLowerCase())
      || (a.target?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const mm = moduleFilter === 'all' || a.module === moduleFilter;
    const mt = typeFilter === 'all' || a.type === typeFilter;
    return ms && mm && mt;
  });

  const today = activity.filter(a => new Date(a.ts).toDateString() === new Date().toDateString()).length;
  const last24h = activity.filter(a => Date.now() - new Date(a.ts).getTime() < 24 * 3600_000).length;
  const systemEvents = activity.filter(a => a.type === 'system').length;

  const handleClear = () => {
    if (!window.confirm('Clear the entire activity log? This cannot be undone.')) return;
    clearActivity();
    toast.success('Activity log cleared');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.28em] text-amber-600 mb-2">Audit · Activity</p>
          <h1 className="font-display font-semibold text-slate-900 text-3xl md:text-4xl tracking-[-0.03em] leading-[1.05]">
            Every change, on the record.
          </h1>
          <p className="text-slate-500 text-[15px] mt-2 leading-[1.55] max-w-[60ch]">
            A continuous, time-stamped log of every action across the platform — who did what, when, and to what.
          </p>
        </div>
        <button
          onClick={handleClear}
          disabled={activity.length === 0}
          className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-red-200 hover:text-red-600 transition-colors text-[13px] font-semibold inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed self-start"
        >
          <Trash2 size={14} /> Clear log
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Events',  value: activity.length, color: 'text-slate-900' },
          { label: 'Today',         value: today,           color: 'text-blue-600' },
          { label: 'Last 24 Hours', value: last24h,         color: 'text-amber-600' },
          { label: 'System Events', value: systemEvents,    color: 'text-slate-600' },
        ].map(k => (
          <div key={k.label} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-slate-400 mb-2">{k.label}</p>
            <p className={`font-display font-semibold ${k.color} text-2xl tracking-[-0.03em]`}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 flex flex-col md:flex-row gap-3 md:items-center">
        <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 md:w-80">
          <Search size={14} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search actor, action, or target…"
            className="flex-1 bg-transparent outline-none text-[13px] text-slate-700 placeholder-slate-400"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 inline-flex items-center gap-1.5">
            <Filter size={11} /> Module
          </span>
          <select value={moduleFilter} onChange={e => setModuleFilter(e.target.value)} className="px-3 py-1.5 rounded-lg border border-slate-200 text-[13px] text-slate-700 bg-white focus:outline-none focus:border-amber-400">
            {modules.map(m => <option key={m} value={m}>{m === 'all' ? 'All modules' : m}</option>)}
          </select>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 ml-2">Type</span>
          <div className="inline-flex items-center bg-slate-50 rounded-lg p-1">
            {(['all', 'create', 'update', 'delete', 'system'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1 text-[12px] font-medium rounded-md transition-all capitalize
                  ${typeFilter === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="md:ml-auto text-[13px] text-slate-500 font-medium">{filtered.length} of {activity.length} events</div>
      </div>

      {/* Timeline */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm">
        {filtered.length === 0 ? (
          <div className="p-16 text-center text-slate-400 text-sm">
            <Activity size={32} className="mx-auto mb-3 text-slate-300" />
            No events match the current filter.
          </div>
        ) : (
          <ol className="relative">
            {filtered.map((a, i) => {
              const meta = TYPE_META[a.type] || TYPE_META.system;
              const Icon = meta.Icon;
              return (
                <li key={a.id} className="relative px-5 py-4 hover:bg-slate-50/40 transition-colors">
                  {/* Timeline rail */}
                  {i < filtered.length - 1 && (
                    <span className="absolute left-[36px] top-[52px] bottom-[-4px] w-px bg-slate-100" />
                  )}
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full ${meta.bg} ${meta.border} border flex items-center justify-center flex-shrink-0 z-10 relative`}>
                      <Icon size={15} className={meta.text} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                        <p className="text-[14px] text-slate-800 leading-snug">
                          <span className="font-semibold text-slate-900">{a.actor}</span>{' '}
                          <span className="text-slate-600">{a.action}</span>{' '}
                          {a.target && <span className="font-medium text-slate-900">{a.target}</span>}
                        </p>
                        <span className="text-[12px] text-slate-400 sm:ml-auto sm:flex-shrink-0" title={formatExact(a.ts)}>
                          {relativeTime(a.ts)}
                        </span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-2 text-[11px]">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full ${meta.bg} ${meta.text} ${meta.border} border font-semibold uppercase tracking-[0.14em]`}>
                          {meta.label}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500 font-medium">{a.module}</span>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      <p className="text-center text-[12.5px] text-slate-400">
        Logs auto-truncate at 200 most recent events. Export will be available in a future release.
      </p>
    </div>
  );
}
