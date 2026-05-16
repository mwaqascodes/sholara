import { useState } from 'react';
import { Library, Plus, Search, BookOpen, ArrowDownLeft, ArrowUpRight, Trash2, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useBooks, useBookIssues, addBook, deleteBook, issueBook, returnBook, useStudents } from '@/lib/store';

const fmtPkr = (n: number) => `₨${n.toLocaleString('en-PK')}`;
const today = () => new Date().toISOString().split('T')[0];
const addDays = (n: number) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().split('T')[0]; };

export default function LibraryPage() {
  const books = useBooks();
  const issues = useBookIssues();
  const students = useStudents();

  const [tab, setTab] = useState<'catalog' | 'issued'>('catalog');
  const [search, setSearch] = useState('');
  const [showAddBook, setShowAddBook] = useState(false);
  const [showIssue, setShowIssue] = useState(false);

  const [bookForm, setBookForm] = useState({ title: '', author: '', isbn: '', category: 'Textbook', copies: 1 });
  const [issueForm, setIssueForm] = useState({ bookId: '', studentId: '' });

  const filteredBooks = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase()) ||
    b.category.toLowerCase().includes(search.toLowerCase())
  );

  const filteredIssues = issues.filter(i =>
    i.bookTitle.toLowerCase().includes(search.toLowerCase()) ||
    i.studentName.toLowerCase().includes(search.toLowerCase())
  );

  const totalBooks = books.reduce((s, b) => s + b.copies, 0);
  const availableBooks = books.reduce((s, b) => s + b.available, 0);
  const issuedActive = issues.filter(i => i.status !== 'returned').length;
  const overdue = issues.filter(i => i.status === 'overdue').length;
  const totalFines = issues.reduce((s, i) => s + (i.fine || 0), 0);

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookForm.title.trim() || !bookForm.author.trim()) { toast.error('Title and author are required'); return; }
    addBook({
      ...bookForm,
      available: bookForm.copies,
      status: bookForm.copies < 5 ? 'limited' : 'available',
      addedOn: today(),
    });
    toast.success(`${bookForm.title} added to the catalog`);
    setShowAddBook(false);
    setBookForm({ title: '', author: '', isbn: '', category: 'Textbook', copies: 1 });
  };

  const handleIssueBook = (e: React.FormEvent) => {
    e.preventDefault();
    const book = books.find(b => b.id === issueForm.bookId);
    const student = students.find(s => s.id === issueForm.studentId);
    if (!book || !student) { toast.error('Select a book and a student'); return; }
    if (book.available <= 0) { toast.error('No copies available'); return; }
    issueBook({
      bookId: book.id,
      bookTitle: book.title,
      studentId: student.id,
      studentName: student.name,
      issuedOn: today(),
      dueOn: addDays(14),
      status: 'issued',
    });
    toast.success(`Issued "${book.title}" to ${student.name}`);
    setShowIssue(false);
    setIssueForm({ bookId: '', studentId: '' });
  };

  const handleReturn = (id: string) => {
    returnBook(id);
    toast.success('Book returned to library');
  };

  const handleDeleteBook = (id: string) => {
    if (!window.confirm('Remove this book from the catalog?')) return;
    deleteBook(id);
    toast.success('Book removed');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.28em] text-amber-600 mb-2">Library</p>
          <h1 className="font-display font-semibold text-slate-900 text-3xl md:text-4xl tracking-[-0.03em] leading-[1.05]">
            Catalog &amp; circulation.
          </h1>
          <p className="text-slate-500 text-[15px] mt-2 leading-[1.55] max-w-[60ch]">
            Manage every book in the school library — track copies, issue to students, and recover overdue returns.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowIssue(true)}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-amber-300 hover:text-amber-700 transition-colors text-[13px] font-semibold inline-flex items-center gap-2"
          >
            <ArrowUpRight size={14} /> Issue book
          </button>
          <button
            onClick={() => setShowAddBook(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 text-slate-950 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/30 transition-all text-[13px] font-semibold inline-flex items-center gap-2"
          >
            <Plus size={14} /> Add book
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total Copies',  value: totalBooks,                    color: 'text-slate-900' },
          { label: 'Available',     value: availableBooks,                color: 'text-emerald-600' },
          { label: 'Out on Loan',   value: issuedActive,                  color: 'text-blue-600' },
          { label: 'Overdue',       value: overdue,                       color: 'text-red-600' },
          { label: 'Pending Fines', value: fmtPkr(totalFines),            color: 'text-amber-600' },
        ].map(k => (
          <div key={k.label} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-slate-400 mb-2">{k.label}</p>
            <p className={`font-display font-semibold ${k.color} text-2xl tracking-[-0.03em]`}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs + search */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div className="inline-flex items-center bg-slate-50 rounded-lg p-1 self-start">
            {(['catalog', 'issued'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 text-[13px] font-medium rounded-md transition-all capitalize
                  ${tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {t === 'catalog' ? `Catalog (${books.length})` : `Issued (${issues.length})`}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 sm:w-80">
            <Search size={14} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={tab === 'catalog' ? 'Search by title, author, category…' : 'Search by book or student…'}
              className="flex-1 bg-transparent outline-none text-[13px] text-slate-700 placeholder-slate-400"
            />
          </div>
        </div>

        {/* CATALOG TABLE */}
        {tab === 'catalog' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/70">
                <tr>
                  {['Title', 'Author', 'Category', 'Copies', 'Available', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.18em] text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBooks.length === 0 ? (
                  <tr><td colSpan={7} className="px-5 py-16 text-center text-slate-400 text-sm">No books match the current search.</td></tr>
                ) : filteredBooks.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-11 rounded-md bg-gradient-to-br from-amber-100 to-amber-200 border border-amber-300/40 flex items-center justify-center flex-shrink-0">
                          <BookOpen size={15} className="text-amber-700" />
                        </div>
                        <div>
                          <p className="text-[14px] font-semibold text-slate-900 leading-tight">{b.title}</p>
                          {b.isbn && <p className="text-[11px] text-slate-400 mt-0.5">ISBN {b.isbn}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[13px] text-slate-600">{b.author}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">{b.category}</span>
                    </td>
                    <td className="px-5 py-4 text-[14px] font-semibold text-slate-900">{b.copies}</td>
                    <td className="px-5 py-4">
                      <span className={`text-[14px] font-semibold ${b.available === 0 ? 'text-red-600' : b.available < 5 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {b.available}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-semibold uppercase tracking-[0.14em]
                        ${b.status === 'available' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : b.status === 'limited'  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-red-50 text-red-700 border border-red-200'}`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => handleDeleteBook(b.id)} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ISSUED TABLE */}
        {tab === 'issued' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/70">
                <tr>
                  {['Book', 'Borrower', 'Issued', 'Due', 'Status', 'Fine', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.18em] text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredIssues.length === 0 ? (
                  <tr><td colSpan={7} className="px-5 py-16 text-center text-slate-400 text-sm">No issued records match the current search.</td></tr>
                ) : filteredIssues.map(i => (
                  <tr key={i.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4 text-[14px] font-semibold text-slate-900">{i.bookTitle}</td>
                    <td className="px-5 py-4 text-[13px] text-slate-600">{i.studentName}</td>
                    <td className="px-5 py-4 text-[13px] text-slate-500">{i.issuedOn}</td>
                    <td className="px-5 py-4 text-[13px] text-slate-500">{i.dueOn}</td>
                    <td className="px-5 py-4">
                      {i.status === 'returned' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10.5px] font-semibold uppercase tracking-[0.14em]">
                          <CheckCircle2 size={11} /> Returned
                        </span>
                      ) : i.status === 'overdue' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-[10.5px] font-semibold uppercase tracking-[0.14em]">
                          <AlertTriangle size={11} /> Overdue
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10.5px] font-semibold uppercase tracking-[0.14em]">
                          <Clock size={11} /> On Loan
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-[13px] font-semibold text-amber-700">{i.fine ? fmtPkr(i.fine) : '—'}</td>
                    <td className="px-5 py-4">
                      {i.status !== 'returned' ? (
                        <button onClick={() => handleReturn(i.id)} className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 text-[12px] font-semibold inline-flex items-center gap-1.5 transition-colors">
                          <ArrowDownLeft size={12} /> Return
                        </button>
                      ) : <span className="text-slate-300 text-xs">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD BOOK MODAL */}
      {showAddBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && setShowAddBook(false)}>
          <form onSubmit={handleAddBook} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                  <Library size={18} className="text-amber-600" />
                </div>
                <h3 className="font-display font-semibold text-slate-900 text-lg tracking-[-0.02em]">Add new book</h3>
              </div>
              <button type="button" onClick={() => setShowAddBook(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Title</label>
                <input value={bookForm.title} onChange={e => setBookForm({ ...bookForm, title: e.target.value })} required className="w-full mt-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-400" placeholder="e.g. Pakistan Studies (Class 9)" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Author</label>
                  <input value={bookForm.author} onChange={e => setBookForm({ ...bookForm, author: e.target.value })} required className="w-full mt-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-400" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">ISBN</label>
                  <input value={bookForm.isbn} onChange={e => setBookForm({ ...bookForm, isbn: e.target.value })} className="w-full mt-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-400" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Category</label>
                  <select value={bookForm.category} onChange={e => setBookForm({ ...bookForm, category: e.target.value })} className="w-full mt-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-400">
                    {['Textbook', 'Literature', 'Religious', 'Reference', 'Fiction', 'Science'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Copies</label>
                  <input type="number" min={1} value={bookForm.copies} onChange={e => setBookForm({ ...bookForm, copies: Number(e.target.value) })} className="w-full mt-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-400" />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50/50">
              <button type="button" onClick={() => setShowAddBook(false)} className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 text-[13px] font-medium">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-gradient-to-b from-amber-400 to-amber-600 text-slate-950 text-[13px] font-semibold">Add to catalog</button>
            </div>
          </form>
        </div>
      )}

      {/* ISSUE BOOK MODAL */}
      {showIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && setShowIssue(false)}>
          <form onSubmit={handleIssueBook} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                  <ArrowUpRight size={18} className="text-blue-600" />
                </div>
                <h3 className="font-display font-semibold text-slate-900 text-lg tracking-[-0.02em]">Issue book to student</h3>
              </div>
              <button type="button" onClick={() => setShowIssue(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Book</label>
                <select value={issueForm.bookId} onChange={e => setIssueForm({ ...issueForm, bookId: e.target.value })} required className="w-full mt-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-400">
                  <option value="">Select a book…</option>
                  {books.filter(b => b.available > 0).map(b => <option key={b.id} value={b.id}>{b.title} ({b.available} available)</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Student</label>
                <select value={issueForm.studentId} onChange={e => setIssueForm({ ...issueForm, studentId: e.target.value })} required className="w-full mt-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-400">
                  <option value="">Select a student…</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name} — Roll #{s.rollNo} · {s.class}</option>)}
                </select>
              </div>
              <p className="text-[12.5px] text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5">
                <strong className="text-slate-700">Default loan period:</strong> 14 days. The borrower will be marked overdue automatically after that.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50/50">
              <button type="button" onClick={() => setShowIssue(false)} className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 text-[13px] font-medium">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-gradient-to-b from-amber-400 to-amber-600 text-slate-950 text-[13px] font-semibold">Issue book</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
