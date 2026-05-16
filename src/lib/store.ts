import { useEffect, useState } from 'react';
import { students as seedStudents, teachers as seedTeachers, feeRecords as seedFees, type Student, type Teacher, type FeeRecord, allClasses, allSubjects } from './demo-data';

// --- Types ---
export interface StoreStudent extends Student {
  urduName: string;
  admissionDate: string;
  feeStatus: 'Paid' | 'Unpaid';
  motherName?: string;
  bFormNo?: string;
  city?: string;
  gender: 'Male' | 'Female';
  subjects: string[];
}

export interface StoreTeacher extends Teacher {
  address?: string;
}

export interface TimetableEntry {
  id: string;
  className: string;
  section: string;
  day: string;
  period: number;
  startTime: string;
  endTime: string;
  subject: string;
  teacherName: string;
}

export interface DiaryEntry {
  id: string;
  className: string;
  section: string;
  date: string;
  subject: string;
  homework: string;
  teacherName: string;
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  category: string;
  copies: number;
  available: number;
  status: 'available' | 'limited' | 'out';
  addedOn: string;
}

export interface BookIssue {
  id: string;
  bookId: string;
  bookTitle: string;
  studentId: string;
  studentName: string;
  issuedOn: string;
  dueOn: string;
  returnedOn?: string;
  status: 'issued' | 'returned' | 'overdue';
  fine?: number;
}

export interface TransportRoute {
  id: string;
  name: string;
  vehicleNo: string;
  driverName: string;
  driverPhone: string;
  capacity: number;
  occupied: number;
  pickupTime: string;
  stops: string[];
  monthlyFee: number;
  status: 'active' | 'maintenance' | 'inactive';
}

export interface ActivityLog {
  id: string;
  actor: string;
  action: string;
  target?: string;
  module: string;
  ts: string;
  type: 'create' | 'update' | 'delete' | 'login' | 'system';
}

interface State {
  students: StoreStudent[];
  teachers: StoreTeacher[];
  fees: FeeRecord[];
  timetable: TimetableEntry[];
  diary: DiaryEntry[];
  books: LibraryBook[];
  bookIssues: BookIssue[];
  routes: TransportRoute[];
  activity: ActivityLog[];
}

const STORAGE_KEY = 'Scholara_system_store_v2';

// --- Helper: Initial Data ---
const initialStudents: StoreStudent[] = seedStudents.map(s => ({
  ...s,
  urduName: s.nameUrdu,
  admissionDate: '2025-08-15',
  feeStatus: (s.id === '1' || s.id === '2' || s.id === '5' || s.id === '7' || s.id === '9' || s.id === '10') ? 'Paid' : 'Unpaid',
  gender: (s.id === '2' || s.id === '4' || s.id === '6' || s.id === '8' || s.id === '10') ? 'Female' : 'Male',
  subjects: [...allSubjects],
}));

const initialTeachers: StoreTeacher[] = seedTeachers.map(t => ({
  ...t,
  address: 'Lahore, Pakistan',
}));

// --- Seed: Library ---
const initialBooks: LibraryBook[] = [
  { id: 'b1', title: 'Pakistan Studies (Class 9)',  author: 'Ferozsons',         isbn: '978-969-002-001', category: 'Textbook',  copies: 25, available: 18, status: 'available', addedOn: '2025-08-01' },
  { id: 'b2', title: 'Mathematics for Class 10',    author: 'Punjab Textbook',   isbn: '978-969-002-002', category: 'Textbook',  copies: 30, available: 6,  status: 'limited',   addedOn: '2025-08-01' },
  { id: 'b3', title: 'The Diary of a Young Girl',   author: 'Anne Frank',        isbn: '978-014-0264-93', category: 'Literature',copies: 12, available: 9,  status: 'available', addedOn: '2025-09-12' },
  { id: 'b4', title: 'Physics Concepts (Class 9)',  author: 'Oxford Press',      isbn: '978-019-066-001', category: 'Textbook',  copies: 20, available: 0,  status: 'out',       addedOn: '2025-08-15' },
  { id: 'b5', title: 'Quranic Studies — Volume 1',  author: 'Al-Huda',           isbn: '978-969-411-019', category: 'Religious', copies: 40, available: 36, status: 'available', addedOn: '2025-07-20' },
  { id: 'b6', title: 'Allama Iqbal — Selected Works',author: 'Iqbal Academy',    isbn: '978-969-416-128', category: 'Literature',copies: 15, available: 12, status: 'available', addedOn: '2025-10-04' },
];

const initialIssues: BookIssue[] = [
  { id: 'bi1', bookId: 'b1', bookTitle: 'Pakistan Studies (Class 9)', studentId: '1', studentName: 'Ahmed Khan',  issuedOn: '2026-04-10', dueOn: '2026-04-24', status: 'issued' },
  { id: 'bi2', bookId: 'b2', bookTitle: 'Mathematics for Class 10',   studentId: '3', studentName: 'Sara Ahmad',  issuedOn: '2026-04-02', dueOn: '2026-04-16', status: 'overdue', fine: 90 },
  { id: 'bi3', bookId: 'b3', bookTitle: 'The Diary of a Young Girl',  studentId: '5', studentName: 'Hira Bilal',  issuedOn: '2026-04-15', dueOn: '2026-04-29', status: 'issued' },
  { id: 'bi4', bookId: 'b5', bookTitle: 'Quranic Studies — Volume 1', studentId: '2', studentName: 'Fatima Ali',  issuedOn: '2026-03-28', dueOn: '2026-04-11', returnedOn: '2026-04-09', status: 'returned' },
];

// --- Seed: Transport ---
const initialRoutes: TransportRoute[] = [
  { id: 'r1', name: 'Route 1 — Gulberg Loop',    vehicleNo: 'LE-2018', driverName: 'Asif Khan',     driverPhone: '0301-2345678', capacity: 32, occupied: 28, pickupTime: '07:10', stops: ['Liberty', 'Main Boulevard', 'Mini Market'],     monthlyFee: 3500, status: 'active' },
  { id: 'r2', name: 'Route 2 — DHA Phase 5',     vehicleNo: 'LE-3042', driverName: 'Rashid Mahmood',driverPhone: '0322-7654321', capacity: 32, occupied: 24, pickupTime: '07:00', stops: ['Phase 5 Park', 'CCA Block', 'Y Block'],         monthlyFee: 4500, status: 'active' },
  { id: 'r3', name: 'Route 3 — Model Town',      vehicleNo: 'LE-4561', driverName: 'Iqbal Hussain', driverPhone: '0345-1112233', capacity: 28, occupied: 19, pickupTime: '07:15', stops: ['Faisal Town', 'B Block', 'A Block'],            monthlyFee: 3200, status: 'active' },
  { id: 'r4', name: 'Route 4 — Bahria Town',     vehicleNo: 'LE-5901', driverName: 'Tariq Sultan',  driverPhone: '0303-4445566', capacity: 32, occupied: 0,  pickupTime: '07:00', stops: ['Sector A', 'Sector B', 'Sector C'],             monthlyFee: 5000, status: 'maintenance' },
];

// --- Seed: Activity ---
const initialActivity: ActivityLog[] = [
  { id: 'a1', actor: 'Principal Ahmed', action: 'Added new student',     target: 'Ahmed Ali — Class 9A',   module: 'Students',   ts: new Date(Date.now() - 5 * 60_000).toISOString(),       type: 'create' },
  { id: 'a2', actor: 'AI Assistant',    action: 'Sent fee reminders to', target: '183 parents',            module: 'Fees',       ts: new Date(Date.now() - 22 * 60_000).toISOString(),      type: 'system' },
  { id: 'a3', actor: 'Sara Khan',       action: 'Marked attendance for', target: 'Class 7B',               module: 'Attendance', ts: new Date(Date.now() - 60 * 60_000).toISOString(),      type: 'update' },
  { id: 'a4', actor: 'Principal Ahmed', action: 'Created exam',          target: 'Mid-Term — Class 9',     module: 'Exams',      ts: new Date(Date.now() - 2 * 3600_000).toISOString(),     type: 'create' },
  { id: 'a5', actor: 'Imran Sahib',     action: 'Issued book',           target: 'Pakistan Studies → Ahmed Khan', module: 'Library', ts: new Date(Date.now() - 4 * 3600_000).toISOString(),   type: 'create' },
  { id: 'a6', actor: 'AI Assistant',    action: 'Generated report',      target: 'Monthly fee summary',    module: 'Reports',    ts: new Date(Date.now() - 8 * 3600_000).toISOString(),     type: 'system' },
  { id: 'a7', actor: 'System',          action: 'Backup completed',      target: 'All school data',        module: 'System',     ts: new Date(Date.now() - 18 * 3600_000).toISOString(),    type: 'system' },
];

// --- Store Implementation ---
function load(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        students: parsed.students || initialStudents,
        teachers: parsed.teachers || initialTeachers,
        fees: parsed.fees || seedFees,
        timetable: parsed.timetable || [],
        diary: parsed.diary || [],
        books: parsed.books || initialBooks,
        bookIssues: parsed.bookIssues || initialIssues,
        routes: parsed.routes || initialRoutes,
        activity: parsed.activity || initialActivity,
      };
    }
  } catch {}
  return {
    students: initialStudents, teachers: initialTeachers, fees: seedFees, timetable: [], diary: [],
    books: initialBooks, bookIssues: initialIssues, routes: initialRoutes, activity: initialActivity,
  };
}

let state: State = load();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

const listeners = new Set<() => void>();
function emit() {
  listeners.forEach(l => l());
}

// --- Exports ---
export const getStudents = () => state.students;
export const addStudent = (s: Omit<StoreStudent, 'id'>) => {
  const newStudent = { ...s, id: `s${Date.now()}` } as StoreStudent;
  state.students = [newStudent, ...state.students];
  persist(); emit();
};
export const deleteStudent = (id: string) => {
  state.students = state.students.filter(s => s.id !== id);
  persist(); emit();
};

export const getTeachers = () => state.teachers;
export const addTeacher = (t: Omit<StoreTeacher, 'id'>) => {
  const newTeacher = { ...t, id: `t${Date.now()}` } as StoreTeacher;
  state.teachers = [newTeacher, ...state.teachers];
  persist(); emit();
};
export const deleteTeacher = (id: string) => {
  state.teachers = state.teachers.filter(t => t.id !== id);
  persist(); emit();
};

export const getFees = () => state.fees;
export const addFee = (f: Omit<FeeRecord, 'id'>) => {
  const newFee = { ...f, id: `f${Date.now()}` } as FeeRecord;
  state.fees = [newFee, ...state.fees];
  persist(); emit();
};
export const deleteFee = (id: string) => {
  state.fees = state.fees.filter(f => f.id !== id);
  persist(); emit();
};
export const updateFee = (id: string, patch: Partial<FeeRecord>) => {
  state.fees = state.fees.map(f => f.id === id ? { ...f, ...patch } : f);
  persist(); emit();
};

export const getTimetable = () => state.timetable;
export const addTimetableEntry = (e: Omit<TimetableEntry, 'id'>) => {
  const newEntry = { ...e, id: `tt${Date.now()}` } as TimetableEntry;
  state.timetable = [newEntry, ...state.timetable];
  persist(); emit();
};

export const getDiary = () => state.diary;
export const addDiaryEntry = (e: Omit<DiaryEntry, 'id'>) => {
  const newEntry = { ...e, id: `d${Date.now()}` } as DiaryEntry;
  state.diary = [newEntry, ...state.diary];
  persist(); emit();
};

export const getSubjectsForClass = (cls: string) => {
  return [...allSubjects];
};

export const setAuth = (auth: any) => {
  localStorage.setItem('Scholara_auth', JSON.stringify(auth));
};

export function useStudents() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const cb = () => setTick(t => t + 1);
    listeners.add(cb);
    return () => { listeners.delete(cb); };
  }, []);
  return state.students;
}

export function useTeachers() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const cb = () => setTick(t => t + 1);
    listeners.add(cb);
    return () => { listeners.delete(cb); };
  }, []);
  return state.teachers;
}

export function useFees() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const cb = () => setTick(t => t + 1);
    listeners.add(cb);
    return () => { listeners.delete(cb); };
  }, []);
  return state.fees;
}

// --- Library ---
export const getBooks = () => state.books;
export const addBook = (b: Omit<LibraryBook, 'id'>) => {
  const newBook = { ...b, id: `b${Date.now()}` } as LibraryBook;
  state.books = [newBook, ...state.books];
  logActivity({ actor: 'You', action: 'Added book', target: b.title, module: 'Library', type: 'create' });
  persist(); emit();
};
export const deleteBook = (id: string) => {
  const book = state.books.find(b => b.id === id);
  state.books = state.books.filter(b => b.id !== id);
  if (book) logActivity({ actor: 'You', action: 'Removed book', target: book.title, module: 'Library', type: 'delete' });
  persist(); emit();
};
export const updateBook = (id: string, patch: Partial<LibraryBook>) => {
  state.books = state.books.map(b => b.id === id ? { ...b, ...patch } : b);
  persist(); emit();
};

export const getBookIssues = () => state.bookIssues;
export const issueBook = (i: Omit<BookIssue, 'id'>) => {
  const newIssue = { ...i, id: `bi${Date.now()}` } as BookIssue;
  state.bookIssues = [newIssue, ...state.bookIssues];
  state.books = state.books.map(b => b.id === i.bookId ? { ...b, available: Math.max(b.available - 1, 0), status: b.available - 1 === 0 ? 'out' : b.available - 1 < 5 ? 'limited' : 'available' } : b);
  logActivity({ actor: 'You', action: 'Issued book', target: `${i.bookTitle} → ${i.studentName}`, module: 'Library', type: 'create' });
  persist(); emit();
};
export const returnBook = (id: string) => {
  const issue = state.bookIssues.find(i => i.id === id);
  if (!issue) return;
  state.bookIssues = state.bookIssues.map(i => i.id === id ? { ...i, status: 'returned', returnedOn: new Date().toISOString().split('T')[0] } : i);
  state.books = state.books.map(b => b.id === issue.bookId ? { ...b, available: b.available + 1, status: b.available + 1 < 5 ? 'limited' : 'available' } : b);
  logActivity({ actor: 'You', action: 'Returned book', target: `${issue.bookTitle} ← ${issue.studentName}`, module: 'Library', type: 'update' });
  persist(); emit();
};

// --- Transport ---
export const getRoutes = () => state.routes;
export const addRoute = (r: Omit<TransportRoute, 'id'>) => {
  const newRoute = { ...r, id: `r${Date.now()}` } as TransportRoute;
  state.routes = [newRoute, ...state.routes];
  logActivity({ actor: 'You', action: 'Added transport route', target: r.name, module: 'Transport', type: 'create' });
  persist(); emit();
};
export const deleteRoute = (id: string) => {
  const route = state.routes.find(r => r.id === id);
  state.routes = state.routes.filter(r => r.id !== id);
  if (route) logActivity({ actor: 'You', action: 'Removed transport route', target: route.name, module: 'Transport', type: 'delete' });
  persist(); emit();
};
export const updateRoute = (id: string, patch: Partial<TransportRoute>) => {
  state.routes = state.routes.map(r => r.id === id ? { ...r, ...patch } : r);
  persist(); emit();
};

// --- Activity ---
export const getActivity = () => state.activity;
export const logActivity = (a: Omit<ActivityLog, 'id' | 'ts'>) => {
  const entry: ActivityLog = { ...a, id: `a${Date.now()}`, ts: new Date().toISOString() };
  state.activity = [entry, ...state.activity].slice(0, 200);
  persist(); emit();
};
export const clearActivity = () => {
  state.activity = [];
  persist(); emit();
};

export function useBooks() {
  const [, setTick] = useState(0);
  useEffect(() => { const cb = () => setTick(t => t + 1); listeners.add(cb); return () => { listeners.delete(cb); }; }, []);
  return state.books;
}
export function useBookIssues() {
  const [, setTick] = useState(0);
  useEffect(() => { const cb = () => setTick(t => t + 1); listeners.add(cb); return () => { listeners.delete(cb); }; }, []);
  return state.bookIssues;
}
export function useRoutes() {
  const [, setTick] = useState(0);
  useEffect(() => { const cb = () => setTick(t => t + 1); listeners.add(cb); return () => { listeners.delete(cb); }; }, []);
  return state.routes;
}
export function useActivity() {
  const [, setTick] = useState(0);
  useEffect(() => { const cb = () => setTick(t => t + 1); listeners.add(cb); return () => { listeners.delete(cb); }; }, []);
  return state.activity;
}

export const useStore = () => state;
