import React from 'react';
import { toast } from 'sonner';

// Shared Scholara design system constants & reusable components
// Restored to the original clean, institutional aesthetic.

export const C = {
  // Global Colors
  bg: '#f8fafc',
  sidebar: '#1e293b',
  card: '#ffffff',
  
  // Design Tokens
  glass: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },

  // Color Palette
  txt: '#1e293b',         // Primary
  sub: '#64748b',         // Secondary
  muted: '#94a3b8',       // Muted
  border: '#e2e8f0',
  
  // Accents
  green: '#10b981',
  greenBg: '#ecfdf5',
  greenBd: '#a7f3d0',
  
  red: '#ef4444',
  redBg: '#fef2f2',
  redBd: '#fecaca',
  
  amber: '#f59e0b',
  amberBg: '#fffbeb',
  amberBd: '#fde68a',
  
  blue: '#3b82f6',
  blueBg: '#eff6ff',
  blueBd: '#bfdbfe',
  
  purple: '#8b5cf6',
  purpleBg: '#f5f3ff',
  purpleBd: '#ddd6fe',
};

export function PageHeader({ title, sub, children }: { title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {sub && <p className="text-sm text-slate-500 mt-1">{sub}</p>}
      </div>
      {children && <div className="flex gap-2 flex-wrap">{children}</div>}
    </div>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div 
      className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"
      style={style}
    >
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

export function StatCard({ label, value, sub, icon: Icon, color, trend }: {
  label: string; value: string|number; sub?: string; icon: any; color: string;
  trend?: { type: 'up'|'down'; val: string };
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}15` }}>
        <Icon size={22} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <h2 className="text-2xl font-black text-slate-900 leading-tight">{value}</h2>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
        {trend && (
          <p className={`text-xs font-bold mt-0.5 ${trend.type === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
            {trend.type === 'up' ? '↑' : '↓'} {trend.val}
          </p>
        )}
      </div>
    </div>
  );
}

export function SearchBar({ value, onChange, placeholder = 'Search…', width = 240 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; width?: number | string;
}) {
  return (
    <div className="relative" style={{ width }}>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
      />
    </div>
  );
}

export function Badge({ label, variant = 'default' }: { label: string; variant?: 'success' | 'warning' | 'danger' | 'info' | 'default' }) {
  const styles = {
    success: "bg-amber-50 text-amber-700 border-amber-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-red-50 text-red-700 border-red-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
    default: "bg-slate-50 text-slate-700 border-slate-200"
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[variant]}`}>
      {label}
    </span>
  );
}

export function Btn({ children, onClick, variant = 'primary', icon: Icon, type = 'button', disabled = false, style }: any) {
  const variants = {
    primary: "bg-amber-600 text-white hover:bg-amber-700 shadow-sm",
    secondary: "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-sm",
    danger: "bg-red-50 text-red-600 border-red-200 hover:bg-red-100",
  };
  
  const v = (variants[variant as keyof typeof variants] || variants.primary) as string;

  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 ${v}`}
      style={style}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

export function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-bottom border-slate-200">
            <tr>
              {headers.map(h => (
                <th key={h} className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">{children}</tbody>
        </table>
      </div>
    </div>
  );
}

export function Tr({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <tr 
      onClick={onClick}
      className={`hover:bg-slate-50 transition-colors ${onClick ? 'cursor-pointer' : ''}`}
    >
      {children}
    </tr>
  );
}

export function Td({ children, style, colSpan, colspan }: { children?: React.ReactNode; style?: React.CSSProperties; colSpan?: number; colspan?: number }) {
  return <td className="px-6 py-4 text-sm text-slate-700" style={style} colSpan={colSpan ?? colspan}>{children}</td>;
}

export function Modal({ title, onClose, children, width = 560 }: { title: string; onClose: () => void; children: React.ReactNode; width?: number }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-xl w-full flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200" style={{ maxWidth: width }}>
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">✕</button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[80vh]">{children}</div>
      </div>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

export function Input({ ...props }: any) {
  return (
    <input 
      {...props}
      className={`w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all placeholder:text-slate-400 ${props.className || ''}`}
    />
  );
}

export function Select({ children, ...props }: any) {
  return (
    <div className="relative">
      <select 
        {...props}
        className={`w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all appearance-none ${props.className || ''}`}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  );
}

export function Avatar({ name, size = 48, color = '#f59e0b' }: { name: string; size?: number; color?: string }) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  return (
    <div 
      className="flex items-center justify-center rounded-xl font-bold tracking-tight flex-shrink-0"
      style={{ width: size, height: size, background: `${color}15`, color, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  );
}
