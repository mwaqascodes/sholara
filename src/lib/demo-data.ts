export type UserRole = 'superadmin' | 'admin' | 'teacher' | 'student' | 'parent';

export interface School {
  id: string;
  name: string;
  code: string;
  address: string;
  students: number;
  teachers: number;
  status: 'active' | 'suspended' | 'trial';
  plan: 'basic' | 'pro' | 'enterprise';
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  class: string;
  section: string;
  rollNo: number;
  parentName: string;
  phone: string;
  avatar: string;
  attendance: number;
  gpa: number;
  schoolId: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  subject: string;
  classes: string[];
  phone: string;
  avatar: string;
}

export interface AttendanceRecord {
  date: string;
  class: string;
  present: number;
  absent: number;
  total: number;
}

export interface FeeRecord {
  id: string;
  studentName: string;
  class: string;
  amount: number;
  paid: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
}

export interface ExamResult {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: number;
  class: string;
  examName: string;
  subjects: SubjectResult[];
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade: string;
  gpa: number;
  rank: number;
  status: 'draft' | 'approved' | 'published';
  remarks: string;
  attendance: number;
}

export interface SubjectResult {
  subject: string;
  teacher: string;
  marksObtained: number;
  totalMarks: number;
  grade: string;
  gpa: number;
}

export interface GradeScale {
  grade: string;
  minPercentage: number;
  maxPercentage: number;
  gpa: number;
  remarks: string;
}

export interface LeaveRequest {
  id: string;
  applicant: string;
  role: string;
  type: 'sick' | 'casual' | 'emergency' | 'maternity';
  from: string;
  to: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedOn: string;
}

export interface ScheduleItem {
  id: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
  class: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  time: string;
  read: boolean;
}

// --- GRADE SCALE ---
export const gradeScale: GradeScale[] = [
  { grade: 'A+', minPercentage: 90, maxPercentage: 100, gpa: 4.0, remarks: 'Outstanding' },
  { grade: 'A', minPercentage: 80, maxPercentage: 89, gpa: 3.7, remarks: 'Excellent' },
  { grade: 'B+', minPercentage: 70, maxPercentage: 79, gpa: 3.3, remarks: 'Very Good' },
  { grade: 'B', minPercentage: 60, maxPercentage: 69, gpa: 3.0, remarks: 'Good' },
  { grade: 'C+', minPercentage: 50, maxPercentage: 59, gpa: 2.5, remarks: 'Satisfactory' },
  { grade: 'C', minPercentage: 40, maxPercentage: 49, gpa: 2.0, remarks: 'Pass' },
  { grade: 'F', minPercentage: 0, maxPercentage: 39, gpa: 0.0, remarks: 'Fail' },
];

export function getGrade(percentage: number): GradeScale {
  return gradeScale.find(g => percentage >= g.minPercentage && percentage <= g.maxPercentage) || gradeScale[gradeScale.length - 1];
}

// --- SCHOOLS ---
export const schools: School[] = [
  { id: 'sch1', name: 'Lincoln Academy', code: 'LA-001', address: '123 Education St, NY', students: 1247, teachers: 68, status: 'active', plan: 'enterprise', createdAt: '2024-01-15' },
  { id: 'sch2', name: 'Sunrise International', code: 'SI-002', address: '456 Learning Ave, CA', students: 890, teachers: 45, status: 'active', plan: 'pro', createdAt: '2024-06-20' },
  { id: 'sch3', name: 'Green Valley School', code: 'GV-003', address: '789 Knowledge Rd, TX', students: 620, teachers: 32, status: 'trial', plan: 'basic', createdAt: '2025-11-01' },
  { id: 'sch4', name: 'Blue Ridge Academy', code: 'BR-004', address: '321 Scholar Ln, FL', students: 0, teachers: 0, status: 'suspended', plan: 'basic', createdAt: '2025-01-10' },
];

// --- STUDENTS ---
const avatars = ['👨‍🎓', '👩‍🎓', '🧑‍🎓', '👦', '👧', '🧒'];

export const students: Student[] = [
  { id: '1', name: 'Aarav Patel', email: 'aarav@school.com', class: '10-A', section: 'A', rollNo: 1, parentName: 'Raj Patel', phone: '+1234567890', avatar: avatars[0], attendance: 94, gpa: 3.8, schoolId: 'sch1' },
  { id: '2', name: 'Sophia Chen', email: 'sophia@school.com', class: '10-A', section: 'A', rollNo: 2, parentName: 'Wei Chen', phone: '+1234567891', avatar: avatars[1], attendance: 97, gpa: 3.9, schoolId: 'sch1' },
  { id: '3', name: 'Marcus Johnson', email: 'marcus@school.com', class: '10-B', section: 'B', rollNo: 3, parentName: 'Lisa Johnson', phone: '+1234567892', avatar: avatars[2], attendance: 88, gpa: 3.4, schoolId: 'sch1' },
  { id: '4', name: 'Priya Sharma', email: 'priya@school.com', class: '9-A', section: 'A', rollNo: 4, parentName: 'Vikram Sharma', phone: '+1234567893', avatar: avatars[3], attendance: 92, gpa: 3.7, schoolId: 'sch1' },
  { id: '5', name: 'Ethan Williams', email: 'ethan@school.com', class: '9-B', section: 'B', rollNo: 5, parentName: 'Sarah Williams', phone: '+1234567894', avatar: avatars[4], attendance: 85, gpa: 3.2, schoolId: 'sch1' },
  { id: '6', name: 'Aisha Khan', email: 'aisha@school.com', class: '11-A', section: 'A', rollNo: 6, parentName: 'Omar Khan', phone: '+1234567895', avatar: avatars[5], attendance: 96, gpa: 3.95, schoolId: 'sch1' },
  { id: '7', name: 'Lucas Brown', email: 'lucas@school.com', class: '11-A', section: 'A', rollNo: 7, parentName: 'James Brown', phone: '+1234567896', avatar: avatars[0], attendance: 91, gpa: 3.6, schoolId: 'sch1' },
  { id: '8', name: 'Emma Davis', email: 'emma@school.com', class: '10-B', section: 'B', rollNo: 8, parentName: 'Michael Davis', phone: '+1234567897', avatar: avatars[1], attendance: 93, gpa: 3.75, schoolId: 'sch1' },
];

export const teachers: Teacher[] = [
  { id: '1', name: 'Dr. Sarah Mitchell', email: 'sarah@school.com', subject: 'Mathematics', classes: ['10-A', '10-B', '11-A'], phone: '+1234567800', avatar: '👩‍🏫' },
  { id: '2', name: 'Prof. James Wilson', email: 'james@school.com', subject: 'Physics', classes: ['10-A', '11-A'], phone: '+1234567801', avatar: '👨‍🏫' },
  { id: '3', name: 'Ms. Priya Reddy', email: 'priya.r@school.com', subject: 'English', classes: ['9-A', '9-B', '10-A'], phone: '+1234567802', avatar: '👩‍🏫' },
  { id: '4', name: 'Mr. David Park', email: 'david@school.com', subject: 'Chemistry', classes: ['10-B', '11-A'], phone: '+1234567803', avatar: '👨‍🏫' },
  { id: '5', name: 'Ms. Elena Rodriguez', email: 'elena@school.com', subject: 'Biology', classes: ['9-A', '10-A', '10-B'], phone: '+1234567804', avatar: '👩‍🏫' },
];

export const attendanceData: AttendanceRecord[] = [
  { date: '2026-03-23', class: '10-A', present: 28, absent: 2, total: 30 },
  { date: '2026-03-24', class: '10-A', present: 27, absent: 3, total: 30 },
  { date: '2026-03-25', class: '10-A', present: 30, absent: 0, total: 30 },
  { date: '2026-03-26', class: '10-A', present: 29, absent: 1, total: 30 },
  { date: '2026-03-27', class: '10-A', present: 26, absent: 4, total: 30 },
  { date: '2026-03-23', class: '10-B', present: 25, absent: 3, total: 28 },
  { date: '2026-03-24', class: '10-B', present: 27, absent: 1, total: 28 },
  { date: '2026-03-25', class: '10-B', present: 26, absent: 2, total: 28 },
];

export const feeRecords: FeeRecord[] = [
  { id: '1', studentName: 'Aarav Patel', class: '10-A', amount: 5000, paid: 5000, status: 'paid', dueDate: '2026-03-01' },
  { id: '2', studentName: 'Sophia Chen', class: '10-A', amount: 5000, paid: 5000, status: 'paid', dueDate: '2026-03-01' },
  { id: '3', studentName: 'Marcus Johnson', class: '10-B', amount: 5000, paid: 2500, status: 'pending', dueDate: '2026-03-15' },
  { id: '4', studentName: 'Priya Sharma', class: '9-A', amount: 4500, paid: 0, status: 'overdue', dueDate: '2026-02-28' },
  { id: '5', studentName: 'Ethan Williams', class: '9-B', amount: 4500, paid: 4500, status: 'paid', dueDate: '2026-03-01' },
  { id: '6', studentName: 'Aisha Khan', class: '11-A', amount: 5500, paid: 3000, status: 'pending', dueDate: '2026-03-20' },
];

// --- EXAM RESULTS (FULL) ---
const subjects10A: SubjectResult[] = [
  { subject: 'Mathematics', teacher: 'Dr. Sarah Mitchell', marksObtained: 92, totalMarks: 100, grade: 'A+', gpa: 4.0 },
  { subject: 'Physics', teacher: 'Prof. James Wilson', marksObtained: 85, totalMarks: 100, grade: 'A', gpa: 3.7 },
  { subject: 'English', teacher: 'Ms. Priya Reddy', marksObtained: 88, totalMarks: 100, grade: 'A', gpa: 3.7 },
  { subject: 'Chemistry', teacher: 'Mr. David Park', marksObtained: 78, totalMarks: 100, grade: 'B+', gpa: 3.3 },
  { subject: 'Biology', teacher: 'Ms. Elena Rodriguez', marksObtained: 91, totalMarks: 100, grade: 'A+', gpa: 4.0 },
  { subject: 'History', teacher: 'Mr. Robert Lee', marksObtained: 82, totalMarks: 100, grade: 'A', gpa: 3.7 },
];

function makeSubjects(base: SubjectResult[], offset: number): SubjectResult[] {
  return base.map(s => {
    const marks = Math.max(25, Math.min(100, s.marksObtained + offset));
    const pct = marks;
    const g = getGrade(pct);
    return { ...s, marksObtained: marks, grade: g.grade, gpa: g.gpa };
  });
}

export const examResults: ExamResult[] = [
  { id: 'r1', studentId: '1', studentName: 'Aarav Patel', rollNo: 1, class: '10-A', examName: 'Mid-Term 2026', subjects: makeSubjects(subjects10A, 0), totalMarks: 600, obtainedMarks: 516, percentage: 86, grade: 'A', gpa: 3.73, rank: 2, status: 'published', remarks: 'Excellent performance. Keep it up!', attendance: 94 },
  { id: 'r2', studentId: '2', studentName: 'Sophia Chen', rollNo: 2, class: '10-A', examName: 'Mid-Term 2026', subjects: makeSubjects(subjects10A, 6), totalMarks: 600, obtainedMarks: 552, percentage: 92, grade: 'A+', gpa: 3.9, rank: 1, status: 'published', remarks: 'Outstanding! Class topper.', attendance: 97 },
  { id: 'r3', studentId: '3', studentName: 'Marcus Johnson', rollNo: 3, class: '10-B', examName: 'Mid-Term 2026', subjects: makeSubjects(subjects10A, -15), totalMarks: 600, obtainedMarks: 426, percentage: 71, grade: 'B+', gpa: 3.3, rank: 5, status: 'published', remarks: 'Good effort. Needs improvement in Chemistry.', attendance: 88 },
  { id: 'r4', studentId: '8', studentName: 'Emma Davis', rollNo: 8, class: '10-B', examName: 'Mid-Term 2026', subjects: makeSubjects(subjects10A, -5), totalMarks: 600, obtainedMarks: 486, percentage: 81, grade: 'A', gpa: 3.7, rank: 3, status: 'published', remarks: 'Very good performance overall.', attendance: 93 },
  { id: 'r5', studentId: '4', studentName: 'Priya Sharma', rollNo: 4, class: '9-A', examName: 'Mid-Term 2026', subjects: makeSubjects(subjects10A, -3), totalMarks: 600, obtainedMarks: 498, percentage: 83, grade: 'A', gpa: 3.7, rank: 1, status: 'approved', remarks: 'Class topper in 9-A!', attendance: 92 },
  { id: 'r6', studentId: '5', studentName: 'Ethan Williams', rollNo: 5, class: '9-B', examName: 'Mid-Term 2026', subjects: makeSubjects(subjects10A, -20), totalMarks: 600, obtainedMarks: 396, percentage: 66, grade: 'B', gpa: 3.0, rank: 3, status: 'draft', remarks: 'Needs to focus more on studies.', attendance: 85 },
  { id: 'r7', studentId: '6', studentName: 'Aisha Khan', rollNo: 6, class: '11-A', examName: 'Mid-Term 2026', subjects: makeSubjects(subjects10A, 4), totalMarks: 600, obtainedMarks: 540, percentage: 90, grade: 'A+', gpa: 4.0, rank: 1, status: 'published', remarks: 'Brilliant! Top performer.', attendance: 96 },
  { id: 'r8', studentId: '7', studentName: 'Lucas Brown', rollNo: 7, class: '11-A', examName: 'Mid-Term 2026', subjects: makeSubjects(subjects10A, -8), totalMarks: 600, obtainedMarks: 468, percentage: 78, grade: 'B+', gpa: 3.3, rank: 2, status: 'approved', remarks: 'Good performance. Can improve in Math.', attendance: 91 },
];

// Keep old results array for backward compat
export const results = examResults.map(r => ({
  id: r.id,
  studentName: r.studentName,
  class: r.class,
  subject: r.subjects[0]?.subject || '',
  marks: r.obtainedMarks,
  total: r.totalMarks,
  grade: r.grade,
}));

// --- LEAVE REQUESTS ---
export const leaveRequests: LeaveRequest[] = [
  { id: 'l1', applicant: 'Dr. Sarah Mitchell', role: 'Teacher', type: 'sick', from: '2026-03-25', to: '2026-03-27', days: 3, reason: 'Medical appointment and recovery', status: 'approved', appliedOn: '2026-03-22' },
  { id: 'l2', applicant: 'Aarav Patel', role: 'Student', type: 'casual', from: '2026-03-28', to: '2026-03-28', days: 1, reason: 'Family event', status: 'pending', appliedOn: '2026-03-25' },
  { id: 'l3', applicant: 'Mr. David Park', role: 'Teacher', type: 'emergency', from: '2026-03-29', to: '2026-03-31', days: 3, reason: 'Family emergency', status: 'pending', appliedOn: '2026-03-27' },
  { id: 'l4', applicant: 'Sophia Chen', role: 'Student', type: 'sick', from: '2026-03-20', to: '2026-03-21', days: 2, reason: 'Flu symptoms', status: 'approved', appliedOn: '2026-03-19' },
  { id: 'l5', applicant: 'Ms. Elena Rodriguez', role: 'Teacher', type: 'casual', from: '2026-04-01', to: '2026-04-02', days: 2, reason: 'Personal work', status: 'rejected', appliedOn: '2026-03-20' },
];

export const schedule: ScheduleItem[] = [
  { id: '1', time: '08:00 - 08:45', subject: 'Mathematics', teacher: 'Dr. Sarah Mitchell', room: 'Room 101', class: '10-A' },
  { id: '2', time: '08:50 - 09:35', subject: 'Physics', teacher: 'Prof. James Wilson', room: 'Lab 1', class: '10-A' },
  { id: '3', time: '09:40 - 10:25', subject: 'English', teacher: 'Ms. Priya Reddy', room: 'Room 103', class: '10-A' },
  { id: '4', time: '10:40 - 11:25', subject: 'Chemistry', teacher: 'Mr. David Park', room: 'Lab 2', class: '10-A' },
  { id: '5', time: '11:30 - 12:15', subject: 'Biology', teacher: 'Ms. Elena Rodriguez', room: 'Lab 3', class: '10-A' },
  { id: '6', time: '13:00 - 13:45', subject: 'History', teacher: 'Mr. Robert Lee', room: 'Room 201', class: '10-A' },
];

export const notifications: Notification[] = [
  { id: '1', title: 'Fee Reminder', message: 'Quarterly fees due by March 15th', type: 'warning', time: '2 hours ago', read: false },
  { id: '2', title: 'Exam Schedule', message: 'Mid-term exams start from April 5th', type: 'info', time: '5 hours ago', read: false },
  { id: '3', title: 'Holiday Notice', message: 'School closed on March 30th for Spring Break', type: 'info', time: '1 day ago', read: true },
  { id: '4', title: 'Results Published', message: 'Class 10 unit test results are now available', type: 'success', time: '2 days ago', read: true },
  { id: '5', title: 'Parent Meeting', message: 'PTA meeting scheduled for April 2nd', type: 'info', time: '3 days ago', read: true },
];

export const attendanceChartData = [
  { month: 'Oct', attendance: 92 },
  { month: 'Nov', attendance: 89 },
  { month: 'Dec', attendance: 85 },
  { month: 'Jan', attendance: 91 },
  { month: 'Feb', attendance: 94 },
  { month: 'Mar', attendance: 93 },
];

export const performanceChartData = [
  { subject: 'Math', avg: 82 },
  { subject: 'Physics', avg: 78 },
  { subject: 'English', avg: 85 },
  { subject: 'Chemistry', avg: 74 },
  { subject: 'Biology', avg: 88 },
  { subject: 'History', avg: 80 },
];
