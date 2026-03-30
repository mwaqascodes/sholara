import { useState } from 'react';
import { Package, Plus, Search, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Item {
  id: string; name: string; quantity: number; condition: 'Good' | 'Fair' | 'Damaged';
  location: string; purchaseDate: string; value: number; threshold: number;
}

const items: Item[] = [
  { id: '1', name: 'Desktop Computers', quantity: 25, condition: 'Good', location: 'Computer Lab', purchaseDate: '15/01/2024', value: 1250000, threshold: 10 },
  { id: '2', name: 'Projectors', quantity: 5, condition: 'Good', location: 'Store Room', purchaseDate: '10/06/2023', value: 450000, threshold: 3 },
  { id: '3', name: 'Chairs (Student)', quantity: 450, condition: 'Fair', location: 'Classrooms', purchaseDate: '01/03/2022', value: 900000, threshold: 400 },
  { id: '4', name: 'Tables (Teacher)', quantity: 15, condition: 'Good', location: 'Staff Room', purchaseDate: '15/08/2023', value: 225000, threshold: 10 },
  { id: '5', name: 'Whiteboards', quantity: 12, condition: 'Fair', location: 'Classrooms', purchaseDate: '20/02/2023', value: 120000, threshold: 10 },
  { id: '6', name: 'Library Books', quantity: 2500, condition: 'Good', location: 'Library', purchaseDate: '01/01/2020', value: 500000, threshold: 1000 },
  { id: '7', name: 'Sports Equipment', quantity: 8, condition: 'Damaged', location: 'Sports Room', purchaseDate: '10/05/2024', value: 80000, threshold: 5 },
];

export default function InventoryPage() {
  const [search, setSearch] = useState('');
  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
  const lowStock = items.filter(i => i.quantity <= i.threshold);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold" style={{ color: '#f1f5f9' }}>Inventory / School Assets</h2>
        <button className="glass-btn-primary flex items-center gap-2 text-sm"><Plus className="w-4 h-4" /> Add Item</button>
      </div>

      {lowStock.length > 0 && (
        <div className="glass-card flex items-center gap-3" style={{ borderLeft: '4px solid #ef4444' }}>
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <p className="text-sm" style={{ color: '#f1f5f9' }}>
            <strong>{lowStock.length} items</strong> are at or below minimum stock level
          </p>
        </div>
      )}

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(241,245,249,0.3)' }} />
        <input className="glass-input pl-10" placeholder="Search inventory..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="glass-card overflow-x-auto">
        <table className="glass-table w-full">
          <thead>
            <tr>
              <th>Item</th><th>Qty</th><th>Condition</th><th>Location</th><th>Value (PKR)</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id}>
                <td className="font-medium flex items-center gap-2">
                  <Package className="w-4 h-4" style={{ color: '#22c55e' }} />
                  {item.name}
                </td>
                <td>{item.quantity}</td>
                <td>
                  <span className={item.condition === 'Good' ? 'badge-success' : item.condition === 'Fair' ? 'badge-warning' : 'badge-danger'}>
                    {item.condition}
                  </span>
                </td>
                <td style={{ color: 'rgba(241,245,249,0.5)' }}>{item.location}</td>
                <td>₨ {item.value.toLocaleString()}</td>
                <td>
                  {item.quantity <= item.threshold
                    ? <span className="badge-danger">Low Stock</span>
                    : <span className="badge-success">In Stock</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
