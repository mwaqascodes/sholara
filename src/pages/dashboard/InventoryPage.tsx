import { useState } from 'react';
import { Package, Plus, Search, Eye, Trash2, Edit, AlertCircle, ShoppingCart, BarChart } from 'lucide-react';
import { toast } from 'sonner';
import { C, PageHeader, StatCard, SearchBar, Badge, Btn, Table, Tr, Td, Modal, Field, Input, Select } from '@/lib/design-system';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minStock: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

const INITIAL: InventoryItem[] = [
  { id: 1, name: 'Chalk Sticks (White)', category: 'Stationery', quantity: 15, unit: 'Boxes', minStock: 20, status: 'low-stock' },
  { id: 2, name: 'A4 Printing Paper', category: 'Supplies', quantity: 45, unit: 'Reams', minStock: 10, status: 'in-stock' },
  { id: 3, name: 'Physics Lab Beakers', category: 'Lab Equipment', quantity: 0, unit: 'Units', minStock: 5, status: 'out-of-stock' },
  { id: 4, name: 'School Vests (Medium)', category: 'Uniform', quantity: 120, unit: 'Units', minStock: 50, status: 'in-stock' },
  { id: 5, name: 'Whiteboard Markers', category: 'Stationery', quantity: 8, unit: 'Pack of 12', minStock: 5, status: 'in-stock' },
];

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>(INITIAL);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this item from inventory?')) {
      setItems(prev => prev.filter(i => i.id !== id));
      toast.success('Item deleted successfully');
    }
  };

  const filtered = items.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) || 
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Inventory updated!');
    setShowAdd(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader title="Stock & Inventory" sub="Monitor school supplies, stationery, and laboratory equipment">
        <Btn icon={Plus} onClick={() => setShowAdd(true)}>Restock / Add Item</Btn>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        <StatCard label="Total Stock Units" value={items.reduce((s, i) => s + i.quantity, 0)} icon={Package} color="#3b82f6" trend={{ type:'up', val:'+12%' }} />
        <StatCard label="Low Stock Alert" value={items.filter(i => i.status === 'low-stock').length} icon={AlertCircle} color="#f59e0b" />
        <StatCard label="Out of Stock" value={items.filter(i => i.status === 'out-of-stock').length} icon={AlertCircle} color="#ef4444" />
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', background: '#f8fafc', padding: '12px 16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by item name or category..." width="100%" />
      </div>

      <Table headers={['Item Description', 'Category', 'Quantity', 'Min. Stock', 'Status', 'Actions']}>
        {filtered.length > 0 ? filtered.map(i => (
          <Tr key={i.id}>
            <Td>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Package size={18} color={C.sub} />
                </div>
                <span style={{ fontWeight: 700, color: '#1e293b' }}>{i.name}</span>
              </div>
            </Td>
            <Td style={{ color: C.sub }}>{i.category}</Td>
            <Td>
                <div style={{ fontWeight: 800 }}>{i.quantity} <span style={{ fontSize: 11, fontWeight: 500, color: C.sub }}>{i.unit}</span></div>
            </Td>
            <Td style={{ color: C.muted }}>{i.minStock} {i.unit}</Td>
            <Td><Badge label={i.status} variant={i.status === 'in-stock' ? 'success' : i.status === 'low-stock' ? 'warning' : 'danger'} /></Td>
            <Td>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ padding: 8, background: '#f1f5f9', borderRadius: 10, border: 'none', cursor: 'pointer', color: C.sub }}><Edit size={16} /></button>
                <button onClick={() => handleDelete(i.id)} style={{ padding: 8, background: 'rgba(239,68,68,0.1)', borderRadius: 10, border: 'none', cursor: 'pointer', color: C.red }}><Trash2 size={16} /></button>
              </div>
            </Td>
          </Tr>
        )) : (
          <Tr><Td colspan={6} style={{ textAlign: 'center', padding: '48px', color: C.muted }}>No inventory items found.</Td></Tr>
        )}
      </Table>

      {showAdd && (
        <Modal title="Add Inventory Item" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Field label="Item Name"><Input placeholder="e.g. Physics Beakers" required /></Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Category"><Select><option>Stationery</option><option>Supplies</option><option>Lab Equipment</option><option>Uniform</option></Select></Field>
                <Field label="Unit Type"><Input placeholder="Boxes, Reams, etc." required /></Field>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Quantity"><Input type="number" required /></Field>
                <Field label="Minimum Stock Level"><Input type="number" required /></Field>
            </div>
            <div style={{ marginTop: 10 }}>
                <Btn type="submit" style={{ width: '100%' }}>Register Stock Item</Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
