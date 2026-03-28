export default function PayrollPage() {
  const staff = [
    { name: 'Dr. Sarah Mitchell', role: 'Teacher', salary: 5200, status: 'paid' },
    { name: 'Prof. James Wilson', role: 'Teacher', salary: 5500, status: 'paid' },
    { name: 'Ms. Priya Reddy', role: 'Teacher', salary: 4800, status: 'pending' },
    { name: 'Mr. David Park', role: 'Teacher', salary: 5000, status: 'paid' },
    { name: 'Ms. Elena Rodriguez', role: 'Teacher', salary: 4900, status: 'pending' },
    { name: 'John Admin', role: 'Admin Staff', salary: 3500, status: 'paid' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Payroll</h2>
      <div className="glass-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">Name</th>
                <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">Role</th>
                <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">Salary</th>
                <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-2 text-sm font-medium">{s.name}</td>
                  <td className="py-3 px-2 text-sm text-muted-foreground">{s.role}</td>
                  <td className="py-3 px-2 text-sm">${s.salary.toLocaleString()}</td>
                  <td className="py-3 px-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                      s.status === 'paid' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                    }`}>{s.status}</span>
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
