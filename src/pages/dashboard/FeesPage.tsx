import { feeRecords } from '@/lib/demo-data';
import { DollarSign, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

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
      <h2 className="font-display text-2xl font-bold">Fee Management</h2>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Fees', value: `$${total.toLocaleString()}`, color: 'from-primary to-secondary' },
          { label: 'Collected', value: `$${collected.toLocaleString()}`, color: 'from-success to-accent' },
          { label: 'Pending', value: `$${pending.toLocaleString()}`, color: 'from-warning to-destructive' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className={`text-3xl font-bold font-display bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-card">
        <h3 className="font-display font-semibold mb-4">Fee Records</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">Student</th>
                <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">Class</th>
                <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">Amount</th>
                <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">Paid</th>
                <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">Due Date</th>
                <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {feeRecords.map(f => {
                const cfg = statusConfig[f.status];
                return (
                  <tr key={f.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-2 text-sm font-medium">{f.studentName}</td>
                    <td className="py-3 px-2 text-sm">{f.class}</td>
                    <td className="py-3 px-2 text-sm">${f.amount.toLocaleString()}</td>
                    <td className="py-3 px-2 text-sm">${f.paid.toLocaleString()}</td>
                    <td className="py-3 px-2 text-sm">{f.dueDate}</td>
                    <td className="py-3 px-2">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize flex items-center gap-1 w-fit ${cfg.cls}`}>
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
