import { teachers } from '@/lib/demo-data';

export default function PayrollPage() {
  const totalSalary = teachers.reduce((s, t) => s + t.salary, 0);
  const staff = [
    ...teachers.map(t => ({ name: t.name, role: 'Teacher', salary: t.salary, status: 'paid' as const })),
    { name: 'Nadeem Abbas', role: 'Admin Staff', salary: 30000, status: 'paid' as const },
    { name: 'Rashid Khan', role: 'Peon', salary: 18000, status: 'pending' as const },
  ];

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Payroll</h2>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Total Monthly Payroll</p>
          <p className="text-2xl font-bold font-display text-primary">PKR {(totalSalary + 48000).toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Paid</p>
          <p className="text-2xl font-bold font-display text-success">PKR {(totalSalary + 30000).toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold font-display text-warning">PKR 18,000</p>
        </div>
      </div>

      <div className="card-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="table-header">Name</th>
                <th className="table-header">Role</th>
                <th className="table-header">Salary (PKR)</th>
                <th className="table-header">Status</th>
                <th className="table-header">Action</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="table-cell font-medium">{s.name}</td>
                  <td className="table-cell text-muted-foreground">{s.role}</td>
                  <td className="table-cell font-medium">PKR {s.salary.toLocaleString()}</td>
                  <td className="table-cell">
                    <span className={`badge capitalize ${s.status === 'paid' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>{s.status}</span>
                  </td>
                  <td className="table-cell">
                    {s.status === 'pending' ? (
                      <button className="btn-primary text-xs py-1 px-3">Mark Paid</button>
                    ) : (
                      <button className="btn-outline text-xs py-1 px-3">View Payslip</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
