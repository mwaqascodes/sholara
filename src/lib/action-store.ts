// Lightweight client-side action store the AI Assistant can dispatch into.
// Pages subscribe to add new students/teachers/fees etc. without page reload.
import { useEffect, useState } from 'react';
import { students as seedStudents, teachers as seedTeachers, feeRecords as seedFees, type Student, type Teacher, type FeeRecord } from './demo-data';

type Listener = () => void;

interface State {
  students: Student[];
  teachers: Teacher[];
  fees: FeeRecord[];
  toasts: { id: string; type: 'success' | 'error' | 'info'; message: string }[];
}

const STORAGE_KEY = 'pakeducate_action_store_v1';

function load(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        students: parsed.students ?? [...seedStudents],
        teachers: parsed.teachers ?? [...seedTeachers],
        toasts: [],
      };
    }
  } catch {}
  return { students: [...seedStudents], teachers: [...seedTeachers], toasts: [] };
}

let state: State = load();
const listeners = new Set<Listener>();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ students: state.students, teachers: state.teachers }));
  } catch {}
}

function emit() {
  listeners.forEach(l => l());
}

function pushToast(type: 'success' | 'error' | 'info', message: string) {
  const id = Date.now().toString() + Math.random();
  state = { ...state, toasts: [...state.toasts, { id, type, message }] };
  emit();
  setTimeout(() => {
    state = { ...state, toasts: state.toasts.filter(t => t.id !== id) };
    emit();
  }, 4500);
}

export const actionStore = {
  getState: () => state,
  subscribe(l: Listener) {
    listeners.add(l);
    return () => listeners.delete(l);
  },

  addStudent(input: Partial<Student>): { ok: boolean; message: string; student?: Student } {
    if (!input.name) return { ok: false, message: 'Student name required' };
    const newStudent: Student = {
      id: `s${Date.now()}`,
      name: input.name,
      nameUrdu: input.nameUrdu || input.name,
      fatherName: input.fatherName || '—',
      fatherNameUrdu: input.fatherNameUrdu || input.fatherName || '—',
      class: input.class || 'Class 1',
      section: input.section || 'A',
      rollNo: input.rollNo || state.students.length + 1,
      phone: input.phone || '0300-0000000',
      avatar: input.avatar || '🧑‍🎓',
      attendance: input.attendance ?? 100,
      gpa: input.gpa ?? 0,
      status: 'active',
      dob: input.dob || '01/01/2015',
      address: input.address || '—',
      emergencyContact: input.emergencyContact || input.phone || '0300-0000000',
      schoolId: input.schoolId || 'school-1',
    };
    state = { ...state, students: [newStudent, ...state.students] };
    persist(); emit();
    pushToast('success', `Student "${newStudent.name}" added (${newStudent.class})`);
    return { ok: true, message: `Added ${newStudent.name}`, student: newStudent };
  },

  deleteStudent(id: string) {
    const s = state.students.find(x => x.id === id);
    state = { ...state, students: state.students.filter(x => x.id !== id) };
    persist(); emit();
    pushToast('info', `Student ${s?.name ?? id} removed`);
    return { ok: true, message: `Removed ${s?.name ?? id}` };
  },

  addTeacher(input: Partial<Teacher>): { ok: boolean; message: string } {
    if (!input.name) return { ok: false, message: 'Teacher name required' };
    const t: Teacher = {
      id: `t${Date.now()}`,
      name: input.name,
      email: input.email || '',
      subject: input.subject || 'General',
      subjects: input.subjects || [input.subject || 'General'],
      classes: input.classes || ['Class 1'],
      phone: input.phone || '0300-0000000',
      salary: input.salary ?? 35000,
      cnic: input.cnic || '',
      joiningDate: input.joiningDate || new Date().toLocaleDateString('en-GB'),
      avatar: input.avatar || '👨‍🏫',
      status: 'active',
    };
    state = { ...state, teachers: [t, ...state.teachers] };
    persist(); emit();
    pushToast('success', `Teacher "${t.name}" added`);
    return { ok: true, message: `Added teacher ${t.name}` };
  },

  markAttendance(payload: { class?: string; studentName?: string; status: 'present' | 'absent' | 'leave' }) {
    pushToast('success', `Attendance: ${payload.studentName || payload.class || 'class'} marked ${payload.status}`);
    return { ok: true, message: 'Attendance updated' };
  },

  recordFeePayment(payload: { studentName: string; amount: number; method?: string }) {
    pushToast('success', `Fee ₨${payload.amount.toLocaleString()} received from ${payload.studentName}`);
    return { ok: true, message: `Recorded ₨${payload.amount} for ${payload.studentName}` };
  },

  navigate(path: string) {
    window.dispatchEvent(new CustomEvent('ai-navigate', { detail: { path } }));
    return { ok: true, message: `Opening ${path}` };
  },

  resetData() {
    state = { students: [...seedStudents], teachers: [...seedTeachers], toasts: state.toasts };
    persist(); emit();
    pushToast('info', 'Demo data reset');
    return { ok: true, message: 'Data reset' };
  },
};

export type AIAction =
  | { type: 'add_student'; data: Partial<Student> }
  | { type: 'delete_student'; id: string }
  | { type: 'add_teacher'; data: Partial<Teacher> }
  | { type: 'mark_attendance'; data: { class?: string; studentName?: string; status: 'present' | 'absent' | 'leave' } }
  | { type: 'record_fee_payment'; data: { studentName: string; amount: number; method?: string } }
  | { type: 'navigate'; path: string }
  | { type: 'reset_data' };

export function executeAction(action: AIAction): { ok: boolean; message: string } {
  switch (action.type) {
    case 'add_student': return actionStore.addStudent(action.data);
    case 'delete_student': return actionStore.deleteStudent(action.id);
    case 'add_teacher': return actionStore.addTeacher(action.data);
    case 'mark_attendance': return actionStore.markAttendance(action.data);
    case 'record_fee_payment': return actionStore.recordFeePayment(action.data);
    case 'navigate': return actionStore.navigate(action.path);
    case 'reset_data': return actionStore.resetData();
    default: return { ok: false, message: 'Unknown action' };
  }
}

// Extract ```action ... ``` JSON blocks from an AI message and execute them.
// Returns the cleaned content (action blocks removed) and the results.
export function parseAndExecuteActions(content: string): { cleaned: string; results: { ok: boolean; message: string }[] } {
  const results: { ok: boolean; message: string }[] = [];
  const regex = /```action\s*([\s\S]*?)```/gi;
  const cleaned = content.replace(regex, (_match, body) => {
    try {
      const parsed = JSON.parse(body.trim());
      const list: AIAction[] = Array.isArray(parsed) ? parsed : [parsed];
      list.forEach(a => results.push(executeAction(a)));
      return ''; // strip the action block from displayed text
    } catch (e) {
      results.push({ ok: false, message: 'Invalid action JSON' });
      return '';
    }
  });
  return { cleaned: cleaned.trim(), results };
}

export function useActionStore() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const unsub = actionStore.subscribe(() => setTick(t => t + 1));
    return () => { unsub(); };
  }, []);
  return state;
}
