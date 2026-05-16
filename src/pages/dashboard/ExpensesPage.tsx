export default function ExpensesPage() {
  const expenses = [
    { category: 'Infrastructure', item: 'Building Maintenance', amount: 120000, date: '15/03/2026' },
    { category: 'Technology', item: 'Computer Lab Equipment', amount: 85000, date: '10/03/2026' },
    { category: 'Supplies', item: 'Lab Chemicals & Materials', amount: 32000, date: '08/03/2026' },
    { category: 'Transport', item: 'School Van Fuel', amount: 28000, date: '05/03/2026' },
    { category: 'Events', item: 'Annual Day Preparations', amount: 50000, date: '01/03/2026' },
    { category: 'Utilities', item: 'Electricity Bill', amount: 42000, date: '28/02/2026' },
    { category: 'Supplies', item: 'Stationery & Books', amount: 15000, date: '25/02/2026' },
  ];

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Expenses</h2>
      <div className="stat-card w-fit">
        <p className="text-sm text-muted-foreground">Total Expenses (March 2026)</p>
        <p className="text-2xl font-bold font-display text-primary">PKR {total.toLocaleString()}</p>
      </div>
      <div className="card-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="table-header">Category</th>
                <th className="table-header">Item</th>
                <th className="table-header">Amount</th>
                <th className="table-header">Date</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="table-cell"><span className="badge bg-primary/10 text-primary">{e.category}</span></td>
                  <td className="table-cell">{e.item}</td>
                  <td className="table-cell font-medium">PKR {e.amount.toLocaleString()}</td>
                  <td className="table-cell text-muted-foreground">{e.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
