import { feeRecords } from '@/lib/demo-data';
import { DollarSign, AlertTriangle, CheckCircle, Clock, Plus } from 'lucide-react';
import { useState } from 'react';

export default function FeesPage() {
  const total = feeRecords.reduce((s, f) => s + f.amount, 0);
  const collected = feeRecords.reduce((s, f) => s + f.paid, 0);
  const pending = total - collected;

  const statusConfig = {
    paid: { icon: CheckCircle, cls: 'bg-success/10 text-success' },
    pending: { icon: Clock, cls: 'bg-warning/10 text-warning' },
    overdue: { icon: AlertTriangle, cls: 'bg-destructive/10 text-destructive' },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-bold">Fee Management</h2>
        <button className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Collect Fee</button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Fees', value: `PKR ${total.toLocaleString()}` },
          { label: 'Collected', value: `PKR ${collected.toLocaleString()}`, cls: 'text-success' },
          { label: 'Pending', value: `PKR ${pending.toLocaleString()}`, cls: 'text-destructive' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className={`text-2xl font-bold font-display ${s.cls || 'text-primary'}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Defaulters highlight */}
      {feeRecords.filter(f => f.status === 'overdue').length > 0 && (
        <div className="card-white border-l-4 border-destructive">
          <h3 className="font-display font-semibold text-destructive mb-2">⚠️ Fee Defaulters</h3>
          <div className="space-y-2">
            {feeRecords.filter(f => f.status === 'overdue').map(f => (
              <div key={f.id} className="flex items-center justify-between py-1">
                <span className="text-sm font-medium">{f.studentName} ({f.class})</span>
                <span className="text-sm font-bold text-destructive">PKR {(f.amount - f.paid).toLocaleString()} unpaid</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card-white">
        <h3 className="font-display font-semibold mb-4">Fee Records</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="table-header">Student</th>
                <th className="table-header">Class</th>
                <th className="table-header">Amount</th>
                <th className="table-header">Paid</th>
                <th className="table-header">Balance</th>
                <th className="table-header">Due Date</th>
                <th className="table-header">Method</th>
                <th className="table-header">Status</th>
              </tr>
            </thead>
            <tbody>
              {feeRecords.map(f => {
                const cfg = statusConfig[f.status];
                return (
                  <tr key={f.id} className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${f.status === 'overdue' ? 'bg-destructive/5' : ''}`}>
                    <td className="table-cell font-medium">{f.studentName}</td>
                    <td className="table-cell">{f.class}</td>
                    <td className="table-cell">PKR {f.amount.toLocaleString()}</td>
                    <td className="table-cell">PKR {f.paid.toLocaleString()}</td>
                    <td className="table-cell font-medium">PKR {(f.amount - f.paid).toLocaleString()}</td>
                    <td className="table-cell">{f.dueDate}</td>
                    <td className="table-cell text-muted-foreground">{f.paymentMethod || '—'}</td>
                    <td className="table-cell">
                      <span className={`badge capitalize flex items-center gap-1 w-fit ${cfg.cls}`}>
                        <cfg.icon className="w-3 h-3" /> {f.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
