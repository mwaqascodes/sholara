export default function ExpensesPage() {
  const expenses = [
    { category: 'Infrastructure', item: 'Building Maintenance', amount: 12000, date: '2026-03-15' },
    { category: 'Technology', item: 'Computer Lab Equipment', amount: 8500, date: '2026-03-10' },
    { category: 'Supplies', item: 'Lab Chemicals & Materials', amount: 3200, date: '2026-03-08' },
    { category: 'Transport', item: 'School Bus Fuel', amount: 2800, date: '2026-03-05' },
    { category: 'Events', item: 'Annual Day Preparations', amount: 5000, date: '2026-03-01' },
    { category: 'Utilities', item: 'Electricity Bill', amount: 4200, date: '2026-02-28' },
  ];

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Expenses</h2>
      <div className="stat-card w-fit">
        <p className="text-sm text-muted-foreground">Total Expenses (March)</p>
        <p className="text-3xl font-bold font-display gradient-text">${total.toLocaleString()}</p>
      </div>
      <div className="glass-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">Category</th>
                <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">Item</th>
                <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">Amount</th>
                <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-2">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">{e.category}</span>
                  </td>
                  <td className="py-3 px-2 text-sm">{e.item}</td>
                  <td className="py-3 px-2 text-sm font-medium">${e.amount.toLocaleString()}</td>
                  <td className="py-3 px-2 text-sm text-muted-foreground">{e.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
