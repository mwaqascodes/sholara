import { useState } from 'react';
import { Bus, Plus, Search, MapPin, Phone, Trash2, Users, Wrench } from 'lucide-react';
import { toast } from 'sonner';
import { useRoutes, addRoute, deleteRoute, updateRoute } from '@/lib/store';

const fmtPkr = (n: number) => `₨${n.toLocaleString('en-PK')}`;

export default function TransportPage() {
  const routes = useRoutes();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'maintenance' | 'inactive'>('all');

  const [form, setForm] = useState({
    name: '', vehicleNo: '', driverName: '', driverPhone: '',
    capacity: 32, pickupTime: '07:00', monthlyFee: 3500, stops: '',
  });

  const filtered = routes.filter(r => {
    const ms = r.name.toLowerCase().includes(search.toLowerCase()) ||
               r.vehicleNo.toLowerCase().includes(search.toLowerCase()) ||
               r.driverName.toLowerCase().includes(search.toLowerCase());
    const mst = statusFilter === 'all' || r.status === statusFilter;
    return ms && mst;
  });

  const totalCapacity = routes.reduce((s, r) => s + r.capacity, 0);
  const totalOccupied = routes.reduce((s, r) => s + r.occupied, 0);
  const utilization = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;
  const activeFleet = routes.filter(r => r.status === 'active').length;
  const monthlyRevenue = routes.reduce((s, r) => s + r.occupied * r.monthlyFee, 0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.vehicleNo.trim()) { toast.error('Route name and vehicle number are required'); return; }
    addRoute({
      name: form.name,
      vehicleNo: form.vehicleNo,
      driverName: form.driverName,
      driverPhone: form.driverPhone,
      capacity: form.capacity,
      occupied: 0,
      pickupTime: form.pickupTime,
      stops: form.stops.split(',').map(s => s.trim()).filter(Boolean),
      monthlyFee: form.monthlyFee,
      status: 'active',
    });
    toast.success(`${form.name} added to fleet`);
    setShowAdd(false);
    setForm({ name: '', vehicleNo: '', driverName: '', driverPhone: '', capacity: 32, pickupTime: '07:00', monthlyFee: 3500, stops: '' });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Remove this route from the fleet?')) return;
    deleteRoute(id);
    toast.success('Route removed');
  };

  const toggleMaintenance = (id: string, current: string) => {
    updateRoute(id, { status: current === 'maintenance' ? 'active' : 'maintenance' });
    toast.success(current === 'maintenance' ? 'Route reactivated' : 'Route moved to maintenance');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.28em] text-amber-600 mb-2">Transport</p>
          <h1 className="font-display font-semibold text-slate-900 text-3xl md:text-4xl tracking-[-0.03em] leading-[1.05]">
            Fleet &amp; routes.
          </h1>
          <p className="text-slate-500 text-[15px] mt-2 leading-[1.55] max-w-[60ch]">
            Manage every bus, driver, and route — from morning pickups to monthly billing.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 text-slate-950 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/30 transition-all text-[13px] font-semibold inline-flex items-center gap-2 self-start"
        >
          <Plus size={14} /> Add route
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Active Fleet',  value: `${activeFleet} of ${routes.length}`, color: 'text-slate-900' },
          { label: 'Total Seats',   value: totalCapacity,                         color: 'text-slate-900' },
          { label: 'Occupied',      value: totalOccupied,                         color: 'text-blue-600' },
          { label: 'Utilization',   value: `${utilization}%`,                     color: utilization >= 75 ? 'text-emerald-600' : 'text-amber-600' },
          { label: 'Monthly Income',value: fmtPkr(monthlyRevenue),                color: 'text-emerald-600' },
        ].map(k => (
          <div key={k.label} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-slate-400 mb-2">{k.label}</p>
            <p className={`font-display font-semibold ${k.color} text-[22px] tracking-[-0.03em]`}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Filter row */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 sm:w-80">
          <Search size={14} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search route, vehicle, or driver…"
            className="flex-1 bg-transparent outline-none text-[13px] text-slate-700 placeholder-slate-400"
          />
        </div>
        <div className="inline-flex items-center bg-slate-50 rounded-lg p-1">
          {(['all', 'active', 'maintenance', 'inactive'] as const).map(t => (
            <button
              key={t}
              onClick={() => setStatusFilter(t)}
              className={`px-3.5 py-1.5 text-[12.5px] font-medium rounded-md transition-all capitalize
                ${statusFilter === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="sm:ml-auto text-[13px] text-slate-500 font-medium">{filtered.length} of {routes.length} routes</div>
      </div>

      {/* Routes grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full bg-white border border-slate-100 rounded-2xl p-16 text-center text-slate-400 text-sm">
            No routes match the current filter.
          </div>
        ) : filtered.map(r => {
          const occPct = Math.round((r.occupied / r.capacity) * 100);
          return (
            <div key={r.id} className="bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0">
                      <Bus size={18} className="text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-slate-900 text-[15px] tracking-[-0.02em] leading-tight">{r.name}</h3>
                      <p className="text-[11.5px] font-semibold uppercase tracking-[0.18em] text-slate-400 mt-1">{r.vehicleNo}</p>
                    </div>
                  </div>
                  <span className={`text-[10.5px] font-semibold uppercase tracking-[0.14em] px-2 py-0.5 rounded-full
                    ${r.status === 'active'      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : r.status === 'maintenance' ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-slate-100 text-slate-500 border border-slate-200'}`}
                  >
                    {r.status}
                  </span>
                </div>

                {/* Driver */}
                <div className="rounded-xl bg-slate-50 px-4 py-3 mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[12.5px] font-semibold text-slate-700">{r.driverName}</p>
                    <p className="text-[11px] text-slate-400">Driver · pickup {r.pickupTime}</p>
                  </div>
                  <a href={`tel:${r.driverPhone}`} className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-emerald-600 hover:border-emerald-300 transition-colors" title={r.driverPhone}>
                    <Phone size={13} />
                  </a>
                </div>

                {/* Occupancy bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-[11.5px] mb-1.5">
                    <span className="text-slate-500"><Users size={11} className="inline mr-1.5 -mt-0.5" /> {r.occupied} / {r.capacity} seats</span>
                    <span className={`font-semibold ${occPct >= 90 ? 'text-red-600' : occPct >= 70 ? 'text-amber-600' : 'text-emerald-600'}`}>{occPct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full transition-all ${occPct >= 90 ? 'bg-red-500' : occPct >= 70 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${occPct}%` }} />
                  </div>
                </div>

                {/* Stops */}
                <div className="mb-4">
                  <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-slate-400 mb-2">Stops</p>
                  <div className="flex flex-wrap gap-1.5">
                    {r.stops.map(s => (
                      <span key={s} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                        <MapPin size={9} className="text-slate-400" /> {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div>
                    <p className="text-[10.5px] uppercase tracking-[0.18em] text-slate-400 font-semibold">Monthly Fee</p>
                    <p className="font-display font-semibold text-slate-900 text-[16px] tracking-[-0.02em]">{fmtPkr(r.monthlyFee)}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => toggleMaintenance(r.id, r.status)} className="p-2 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-colors" title={r.status === 'maintenance' ? 'Reactivate' : 'Move to maintenance'}>
                      <Wrench size={13} />
                    </button>
                    <button onClick={() => handleDelete(r.id)} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD ROUTE MODAL */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
          <form onSubmit={handleAdd} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                  <Bus size={18} className="text-amber-600" />
                </div>
                <h3 className="font-display font-semibold text-slate-900 text-lg tracking-[-0.02em]">Add transport route</h3>
              </div>
              <button type="button" onClick={() => setShowAdd(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Route name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full mt-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-400" placeholder="e.g. Route 5 — Defence" />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Vehicle no.</label>
                <input value={form.vehicleNo} onChange={e => setForm({ ...form, vehicleNo: e.target.value })} required className="w-full mt-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-400" placeholder="LE-1234" />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Pickup time</label>
                <input type="time" value={form.pickupTime} onChange={e => setForm({ ...form, pickupTime: e.target.value })} className="w-full mt-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-400" />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Driver name</label>
                <input value={form.driverName} onChange={e => setForm({ ...form, driverName: e.target.value })} className="w-full mt-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-400" />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Driver phone</label>
                <input value={form.driverPhone} onChange={e => setForm({ ...form, driverPhone: e.target.value })} className="w-full mt-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-400" placeholder="03XX-XXXXXXX" />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Capacity</label>
                <input type="number" min={1} value={form.capacity} onChange={e => setForm({ ...form, capacity: Number(e.target.value) })} className="w-full mt-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-400" />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Monthly fee (₨)</label>
                <input type="number" min={0} value={form.monthlyFee} onChange={e => setForm({ ...form, monthlyFee: Number(e.target.value) })} className="w-full mt-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-400" />
              </div>
              <div className="col-span-2">
                <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Stops <span className="text-slate-400 normal-case font-normal tracking-normal">(comma-separated)</span></label>
                <input value={form.stops} onChange={e => setForm({ ...form, stops: e.target.value })} className="w-full mt-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-400" placeholder="Liberty, Main Boulevard, Mini Market" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50/50">
              <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 text-[13px] font-medium">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-gradient-to-b from-amber-400 to-amber-600 text-slate-950 text-[13px] font-semibold">Add to fleet</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
