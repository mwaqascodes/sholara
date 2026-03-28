export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';

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

export interface ResultRecord {
  id: string;
  studentName: string;
  class: string;
  subject: string;
  marks: number;
  total: number;
  grade: string;
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

const avatars = [
  '👨‍🎓', '👩‍🎓', '🧑‍🎓', '👦', '👧', '🧒',
];

export const students: Student[] = [
  { id: '1', name: 'Aarav Patel', email: 'aarav@school.com', class: '10-A', section: 'A', rollNo: 1, parentName: 'Raj Patel', phone: '+1234567890', avatar: avatars[0], attendance: 94, gpa: 3.8 },
  { id: '2', name: 'Sophia Chen', email: 'sophia@school.com', class: '10-A', section: 'A', rollNo: 2, parentName: 'Wei Chen', phone: '+1234567891', avatar: avatars[1], attendance: 97, gpa: 3.9 },
  { id: '3', name: 'Marcus Johnson', email: 'marcus@school.com', class: '10-B', section: 'B', rollNo: 3, parentName: 'Lisa Johnson', phone: '+1234567892', avatar: avatars[2], attendance: 88, gpa: 3.4 },
  { id: '4', name: 'Priya Sharma', email: 'priya@school.com', class: '9-A', section: 'A', rollNo: 4, parentName: 'Vikram Sharma', phone: '+1234567893', avatar: avatars[3], attendance: 92, gpa: 3.7 },
  { id: '5', name: 'Ethan Williams', email: 'ethan@school.com', class: '9-B', section: 'B', rollNo: 5, parentName: 'Sarah Williams', phone: '+1234567894', avatar: avatars[4], attendance: 85, gpa: 3.2 },
  { id: '6', name: 'Aisha Khan', email: 'aisha@school.com', class: '11-A', section: 'A', rollNo: 6, parentName: 'Omar Khan', phone: '+1234567895', avatar: avatars[5], attendance: 96, gpa: 3.95 },
  { id: '7', name: 'Lucas Brown', email: 'lucas@school.com', class: '11-A', section: 'A', rollNo: 7, parentName: 'James Brown', phone: '+1234567896', avatar: avatars[0], attendance: 91, gpa: 3.6 },
  { id: '8', name: 'Emma Davis', email: 'emma@school.com', class: '10-B', section: 'B', rollNo: 8, parentName: 'Michael Davis', phone: '+1234567897', avatar: avatars[1], attendance: 93, gpa: 3.75 },
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

export const results: ResultRecord[] = [
  { id: '1', studentName: 'Aarav Patel', class: '10-A', subject: 'Mathematics', marks: 92, total: 100, grade: 'A+' },
  { id: '2', studentName: 'Aarav Patel', class: '10-A', subject: 'Physics', marks: 85, total: 100, grade: 'A' },
  { id: '3', studentName: 'Sophia Chen', class: '10-A', subject: 'Mathematics', marks: 98, total: 100, grade: 'A+' },
  { id: '4', studentName: 'Sophia Chen', class: '10-A', subject: 'English', marks: 94, total: 100, grade: 'A+' },
  { id: '5', studentName: 'Marcus Johnson', class: '10-B', subject: 'Mathematics', marks: 72, total: 100, grade: 'B' },
  { id: '6', studentName: 'Marcus Johnson', class: '10-B', subject: 'Chemistry', marks: 68, total: 100, grade: 'B-' },
  { id: '7', studentName: 'Priya Sharma', class: '9-A', subject: 'English', marks: 88, total: 100, grade: 'A' },
  { id: '8', studentName: 'Aisha Khan', class: '11-A', subject: 'Biology', marks: 96, total: 100, grade: 'A+' },
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
