export type UserRole = 'admin' | 'teacher' | 'student';

export interface Student {
  id: string;
  name: string;
  nameUrdu: string;
  fatherName: string;
  fatherNameUrdu: string;
  class: string;
  section: string;
  rollNo: number;
  phone: string;
  avatar: string;
  attendance: number;
  gpa: number;
  status: 'active' | 'left';
  dob: string;
  address: string;
  emergencyContact: string;
  schoolId: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  subject: string;
  subjects: string[];
  classes: string[];
  phone: string;
  salary: number;
  cnic: string;
  joiningDate: string;
  avatar: string;
  status: 'active' | 'inactive';
}

export interface AttendanceRecord {
  date: string;
  class: string;
  present: number;
  absent: number;
  leave: number;
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
  paymentMethod?: string;
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

export interface Announcement {
  id: string;
  title: string;
  message: string;
  target: 'all' | 'teachers' | string;
  date: string;
  author: string;
  attachment?: string;
}

export interface LeaveRequest {
  id: string;
  applicant: string;
  role: string;
  type: 'sick' | 'casual' | 'emergency';
  from: string;
  to: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedOn: string;
}

export interface ScheduleItem {
  id: string;
  day: string;
  period: number;
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
  { grade: 'B', minPercentage: 70, maxPercentage: 79, gpa: 3.3, remarks: 'Very Good' },
  { grade: 'C', minPercentage: 60, maxPercentage: 69, gpa: 3.0, remarks: 'Good' },
  { grade: 'D', minPercentage: 50, maxPercentage: 59, gpa: 2.0, remarks: 'Satisfactory' },
  { grade: 'F', minPercentage: 0, maxPercentage: 49, gpa: 0.0, remarks: 'Fail' },
];

export function getGrade(percentage: number): GradeScale {
  return gradeScale.find(g => percentage >= g.minPercentage && percentage <= g.maxPercentage) || gradeScale[gradeScale.length - 1];
}

// --- STUDENTS ---
export const students: Student[] = [
  { id: '1', name: 'Ali Hassan', nameUrdu: 'علی حسن', fatherName: 'Muhammad Hassan', fatherNameUrdu: 'محمد حسن', class: 'Class 10', section: 'A', rollNo: 1, phone: '0300-1234567', avatar: '👨‍🎓', attendance: 94, gpa: 3.8, status: 'active', dob: '2010-05-15', address: 'House 12, Street 5, Lahore', emergencyContact: '0321-9876543', schoolId: 'sch1' },
  { id: '2', name: 'Fatima Zahra', nameUrdu: 'فاطمہ زہرا', fatherName: 'Ahmad Ali', fatherNameUrdu: 'احمد علی', class: 'Class 10', section: 'A', rollNo: 2, phone: '0301-2345678', avatar: '👩‍🎓', attendance: 97, gpa: 3.9, status: 'active', dob: '2010-08-22', address: 'House 45, Block D, Islamabad', emergencyContact: '0333-1122334', schoolId: 'sch1' },
  { id: '3', name: 'Usman Tariq', nameUrdu: 'عثمان طارق', fatherName: 'Tariq Mehmood', fatherNameUrdu: 'طارق محمود', class: 'Class 9', section: 'A', rollNo: 1, phone: '0302-3456789', avatar: '👨‍🎓', attendance: 88, gpa: 3.4, status: 'active', dob: '2011-03-10', address: 'Flat 3, Gulberg, Lahore', emergencyContact: '0345-5566778', schoolId: 'sch1' },
  { id: '4', name: 'Ayesha Siddiqui', nameUrdu: 'عائشہ صدیقی', fatherName: 'Siddique Ahmed', fatherNameUrdu: 'صدیق احمد', class: 'Class 9', section: 'B', rollNo: 2, phone: '0303-4567890', avatar: '👩‍🎓', attendance: 92, gpa: 3.7, status: 'active', dob: '2011-07-18', address: 'House 78, DHA, Karachi', emergencyContact: '0312-9988776', schoolId: 'sch1' },
  { id: '5', name: 'Hamza Sheikh', nameUrdu: 'حمزہ شیخ', fatherName: 'Sheikh Imran', fatherNameUrdu: 'شیخ عمران', class: 'Class 8', section: 'A', rollNo: 1, phone: '0304-5678901', avatar: '👨‍🎓', attendance: 85, gpa: 3.2, status: 'active', dob: '2012-01-25', address: 'House 23, Model Town, Faisalabad', emergencyContact: '0322-4455667', schoolId: 'sch1' },
  { id: '6', name: 'Zainab Malik', nameUrdu: 'زینب ملک', fatherName: 'Malik Riaz', fatherNameUrdu: 'ملک ریاض', class: 'Class 10', section: 'B', rollNo: 3, phone: '0305-6789012', avatar: '👩‍🎓', attendance: 96, gpa: 3.95, status: 'active', dob: '2010-11-30', address: 'House 56, Bahria Town, Rawalpindi', emergencyContact: '0311-7788990', schoolId: 'sch1' },
  { id: '7', name: 'Bilal Ahmed', nameUrdu: 'بلال احمد', fatherName: 'Ahmed Raza', fatherNameUrdu: 'احمد رضا', class: 'Class 7', section: 'A', rollNo: 1, phone: '0306-7890123', avatar: '👨‍🎓', attendance: 91, gpa: 3.6, status: 'active', dob: '2013-04-12', address: 'House 89, Johar Town, Lahore', emergencyContact: '0334-2233445', schoolId: 'sch1' },
  { id: '8', name: 'Sana Bibi', nameUrdu: 'ثنا بی بی', fatherName: 'Muhammad Akram', fatherNameUrdu: 'محمد اکرم', class: 'Class 6', section: 'A', rollNo: 1, phone: '0307-8901234', avatar: '👩‍🎓', attendance: 93, gpa: 3.75, status: 'active', dob: '2014-09-05', address: 'House 34, Satellite Town, Multan', emergencyContact: '0346-6677889', schoolId: 'sch1' },
  { id: '9', name: 'Hassan Raza', nameUrdu: 'حسن رضا', fatherName: 'Raza Khan', fatherNameUrdu: 'رضا خان', class: 'Class 5', section: 'A', rollNo: 1, phone: '0308-9012345', avatar: '👨‍🎓', attendance: 89, gpa: 3.5, status: 'active', dob: '2015-02-28', address: 'House 67, Wapda Town, Gujranwala', emergencyContact: '0323-8899001', schoolId: 'sch1' },
  { id: '10', name: 'Maryam Khan', nameUrdu: 'مریم خان', fatherName: 'Imran Khan', fatherNameUrdu: 'عمران خان', class: 'Class 4', section: 'A', rollNo: 1, phone: '0309-0123456', avatar: '👩‍🎓', attendance: 95, gpa: 3.85, status: 'active', dob: '2016-06-14', address: 'House 12, Cantt Area, Peshawar', emergencyContact: '0335-1122334', schoolId: 'sch1' },
];

export const teachers: Teacher[] = [
  { id: '1', name: 'Fatima Noor', email: 'fatima@school.pk', subject: 'Mathematics', subjects: ['Mathematics'], classes: ['Class 9', 'Class 10'], phone: '0311-1234567', salary: 65000, cnic: '35201-1234567-1', joiningDate: '2020-03-15', avatar: '👩‍🏫', status: 'active' },
  { id: '2', name: 'Muhammad Aslam', email: 'aslam@school.pk', subject: 'Urdu', subjects: ['Urdu'], classes: ['Class 8', 'Class 9', 'Class 10'], phone: '0312-2345678', salary: 55000, cnic: '35202-2345678-2', joiningDate: '2018-08-01', avatar: '👨‍🏫', status: 'active' },
  { id: '3', name: 'Sara Batool', email: 'sara@school.pk', subject: 'English', subjects: ['English'], classes: ['Class 7', 'Class 8', 'Class 9'], phone: '0313-3456789', salary: 60000, cnic: '35203-3456789-3', joiningDate: '2019-06-10', avatar: '👩‍🏫', status: 'active' },
  { id: '4', name: 'Umar Farooq', email: 'umar@school.pk', subject: 'Science', subjects: ['General Science', 'Physics'], classes: ['Class 9', 'Class 10'], phone: '0314-4567890', salary: 62000, cnic: '35204-4567890-4', joiningDate: '2021-01-20', avatar: '👨‍🏫', status: 'active' },
  { id: '5', name: 'Amna Rashid', email: 'amna@school.pk', subject: 'Islamiat', subjects: ['Islamiat', 'Social Studies'], classes: ['Class 5', 'Class 6', 'Class 7'], phone: '0315-5678901', salary: 50000, cnic: '35205-5678901-5', joiningDate: '2022-04-05', avatar: '👩‍🏫', status: 'active' },
  { id: '6', name: 'Kashif Ali', email: 'kashif@school.pk', subject: 'Computer', subjects: ['Computer Science'], classes: ['Class 8', 'Class 9', 'Class 10'], phone: '0316-6789012', salary: 58000, cnic: '35206-6789012-6', joiningDate: '2021-09-15', avatar: '👨‍🏫', status: 'active' },
];

export const attendanceData: AttendanceRecord[] = [
  { date: '25/03/2026', class: 'Class 10', present: 28, absent: 2, leave: 1, total: 31 },
  { date: '24/03/2026', class: 'Class 10', present: 27, absent: 3, leave: 1, total: 31 },
  { date: '23/03/2026', class: 'Class 10', present: 30, absent: 0, leave: 1, total: 31 },
  { date: '25/03/2026', class: 'Class 9', present: 25, absent: 3, leave: 2, total: 30 },
  { date: '24/03/2026', class: 'Class 9', present: 27, absent: 1, leave: 2, total: 30 },
  { date: '25/03/2026', class: 'Class 8', present: 29, absent: 1, leave: 0, total: 30 },
];

export const feeRecords: FeeRecord[] = [
  { id: '1', studentName: 'Ali Hassan', class: 'Class 10', amount: 5000, paid: 5000, status: 'paid', dueDate: '01/03/2026', paymentMethod: 'Cash' },
  { id: '2', studentName: 'Fatima Zahra', class: 'Class 10', amount: 5000, paid: 5000, status: 'paid', dueDate: '01/03/2026', paymentMethod: 'JazzCash' },
  { id: '3', studentName: 'Usman Tariq', class: 'Class 9', amount: 4500, paid: 2000, status: 'pending', dueDate: '15/03/2026' },
  { id: '4', studentName: 'Ayesha Siddiqui', class: 'Class 9', amount: 4500, paid: 0, status: 'overdue', dueDate: '28/02/2026' },
  { id: '5', studentName: 'Hamza Sheikh', class: 'Class 8', amount: 4000, paid: 4000, status: 'paid', dueDate: '01/03/2026', paymentMethod: 'EasyPaisa' },
  { id: '6', studentName: 'Zainab Malik', class: 'Class 10', amount: 5000, paid: 3000, status: 'pending', dueDate: '20/03/2026' },
  { id: '7', studentName: 'Bilal Ahmed', class: 'Class 7', amount: 3500, paid: 3500, status: 'paid', dueDate: '01/03/2026', paymentMethod: 'Cash' },
  { id: '8', studentName: 'Sana Bibi', class: 'Class 6', amount: 3000, paid: 0, status: 'overdue', dueDate: '28/02/2026' },
];

// --- SUBJECTS ---
const pakSubjects: SubjectResult[] = [
  { subject: 'Urdu', teacher: 'Muhammad Aslam', marksObtained: 85, totalMarks: 100, grade: 'A', gpa: 3.7 },
  { subject: 'English', teacher: 'Sara Batool', marksObtained: 78, totalMarks: 100, grade: 'B', gpa: 3.3 },
  { subject: 'Mathematics', teacher: 'Fatima Noor', marksObtained: 92, totalMarks: 100, grade: 'A+', gpa: 4.0 },
  { subject: 'Science', teacher: 'Umar Farooq', marksObtained: 80, totalMarks: 100, grade: 'A', gpa: 3.7 },
  { subject: 'Islamiat', teacher: 'Amna Rashid', marksObtained: 88, totalMarks: 100, grade: 'A', gpa: 3.7 },
  { subject: 'Social Studies', teacher: 'Amna Rashid', marksObtained: 75, totalMarks: 100, grade: 'B', gpa: 3.3 },
  { subject: 'Computer', teacher: 'Kashif Ali', marksObtained: 90, totalMarks: 100, grade: 'A+', gpa: 4.0 },
];

function makeSubjects(base: SubjectResult[], offset: number): SubjectResult[] {
  return base.map(s => {
    const marks = Math.max(20, Math.min(100, s.marksObtained + offset));
    const g = getGrade(marks);
    return { ...s, marksObtained: marks, grade: g.grade, gpa: g.gpa };
  });
}

export const examResults: ExamResult[] = [
  { id: 'r1', studentId: '1', studentName: 'Ali Hassan', rollNo: 1, class: 'Class 10', examName: 'Mid-Term 2026', subjects: makeSubjects(pakSubjects, 0), totalMarks: 700, obtainedMarks: 588, percentage: 84, grade: 'A', gpa: 3.7, rank: 2, status: 'published', remarks: 'بہترین کارکردگی! جاری رکھیں۔', attendance: 94 },
  { id: 'r2', studentId: '2', studentName: 'Fatima Zahra', rollNo: 2, class: 'Class 10', examName: 'Mid-Term 2026', subjects: makeSubjects(pakSubjects, 5), totalMarks: 700, obtainedMarks: 623, percentage: 89, grade: 'A', gpa: 3.8, rank: 1, status: 'published', remarks: 'شاندار! کلاس میں اول۔', attendance: 97 },
  { id: 'r3', studentId: '3', studentName: 'Usman Tariq', rollNo: 1, class: 'Class 9', examName: 'Mid-Term 2026', subjects: makeSubjects(pakSubjects, -10), totalMarks: 700, obtainedMarks: 518, percentage: 74, grade: 'B', gpa: 3.3, rank: 2, status: 'published', remarks: 'اچھی کوشش۔ سائنس میں بہتری ضروری۔', attendance: 88 },
  { id: 'r4', studentId: '4', studentName: 'Ayesha Siddiqui', rollNo: 2, class: 'Class 9', examName: 'Mid-Term 2026', subjects: makeSubjects(pakSubjects, -5), totalMarks: 700, obtainedMarks: 553, percentage: 79, grade: 'B', gpa: 3.3, rank: 1, status: 'approved', remarks: 'کلاس 9 میں اول!', attendance: 92 },
  { id: 'r5', studentId: '5', studentName: 'Hamza Sheikh', rollNo: 1, class: 'Class 8', examName: 'Mid-Term 2026', subjects: makeSubjects(pakSubjects, -15), totalMarks: 700, obtainedMarks: 483, percentage: 69, grade: 'C', gpa: 3.0, rank: 1, status: 'draft', remarks: 'مزید محنت کی ضرورت۔', attendance: 85 },
  { id: 'r6', studentId: '6', studentName: 'Zainab Malik', rollNo: 3, class: 'Class 10', examName: 'Mid-Term 2026', subjects: makeSubjects(pakSubjects, 3), totalMarks: 700, obtainedMarks: 609, percentage: 87, grade: 'A', gpa: 3.7, rank: 3, status: 'published', remarks: 'بہت اچھا! ریاضی میں خاص محنت۔', attendance: 96 },
];

export const announcements: Announcement[] = [
  { id: 'a1', title: 'Annual Day Celebration', message: 'Annual day will be held on 15th April 2026. All students must participate. Rehearsals start from 1st April.', target: 'all', date: '25/03/2026', author: 'Ahmed Khan' },
  { id: 'a2', title: 'Fee Submission Deadline', message: 'Last date for fee submission for March is 31st March. Late fee of PKR 500 will be charged.', target: 'all', date: '23/03/2026', author: 'Ahmed Khan' },
  { id: 'a3', title: 'Staff Meeting', message: 'All teachers are requested to attend the staff meeting on 28th March at 2:00 PM in the conference room.', target: 'teachers', date: '22/03/2026', author: 'Ahmed Khan' },
  { id: 'a4', title: 'Mid-Term Results', message: 'Class 10 mid-term results have been published. Parents can check results on the portal.', target: 'Class 10', date: '20/03/2026', author: 'Fatima Noor' },
  { id: 'a5', title: 'Sports Week', message: 'Sports week will be held from 5th-10th May 2026. Registration forms available at the office.', target: 'all', date: '18/03/2026', author: 'Ahmed Khan' },
];

export const leaveRequests: LeaveRequest[] = [
  { id: 'l1', applicant: 'Fatima Noor', role: 'Teacher', type: 'sick', from: '25/03/2026', to: '27/03/2026', days: 3, reason: 'Medical appointment and recovery', status: 'approved', appliedOn: '22/03/2026' },
  { id: 'l2', applicant: 'Ali Hassan', role: 'Student', type: 'casual', from: '28/03/2026', to: '28/03/2026', days: 1, reason: 'Family event (walima)', status: 'pending', appliedOn: '25/03/2026' },
  { id: 'l3', applicant: 'Umar Farooq', role: 'Teacher', type: 'emergency', from: '29/03/2026', to: '31/03/2026', days: 3, reason: 'Family emergency', status: 'pending', appliedOn: '27/03/2026' },
  { id: 'l4', applicant: 'Fatima Zahra', role: 'Student', type: 'sick', from: '20/03/2026', to: '21/03/2026', days: 2, reason: 'Flu symptoms', status: 'approved', appliedOn: '19/03/2026' },
];

export const schedule: ScheduleItem[] = [
  { id: '1', day: 'Monday', period: 1, time: '08:00 - 08:40', subject: 'Urdu', teacher: 'Muhammad Aslam', room: 'Room 101', class: 'Class 10' },
  { id: '2', day: 'Monday', period: 2, time: '08:45 - 09:25', subject: 'Mathematics', teacher: 'Fatima Noor', room: 'Room 101', class: 'Class 10' },
  { id: '3', day: 'Monday', period: 3, time: '09:30 - 10:10', subject: 'English', teacher: 'Sara Batool', room: 'Room 101', class: 'Class 10' },
  { id: '4', day: 'Monday', period: 4, time: '10:30 - 11:10', subject: 'Science', teacher: 'Umar Farooq', room: 'Lab 1', class: 'Class 10' },
  { id: '5', day: 'Monday', period: 5, time: '11:15 - 11:55', subject: 'Islamiat', teacher: 'Amna Rashid', room: 'Room 101', class: 'Class 10' },
  { id: '6', day: 'Monday', period: 6, time: '12:00 - 12:40', subject: 'Social Studies', teacher: 'Amna Rashid', room: 'Room 101', class: 'Class 10' },
  { id: '7', day: 'Monday', period: 7, time: '01:00 - 01:40', subject: 'Computer', teacher: 'Kashif Ali', room: 'Computer Lab', class: 'Class 10' },
  { id: '8', day: 'Monday', period: 8, time: '01:45 - 02:25', subject: 'Physical Education', teacher: 'Umar Farooq', room: 'Ground', class: 'Class 10' },
  { id: '9', day: 'Tuesday', period: 1, time: '08:00 - 08:40', subject: 'Mathematics', teacher: 'Fatima Noor', room: 'Room 101', class: 'Class 10' },
  { id: '10', day: 'Tuesday', period: 2, time: '08:45 - 09:25', subject: 'English', teacher: 'Sara Batool', room: 'Room 101', class: 'Class 10' },
  { id: '11', day: 'Tuesday', period: 3, time: '09:30 - 10:10', subject: 'Urdu', teacher: 'Muhammad Aslam', room: 'Room 101', class: 'Class 10' },
  { id: '12', day: 'Tuesday', period: 4, time: '10:30 - 11:10', subject: 'Islamiat', teacher: 'Amna Rashid', room: 'Room 101', class: 'Class 10' },
];

export const notifications: Notification[] = [
  { id: '1', title: 'Fee Reminder', message: 'March fees due by 31st March - late fee PKR 500 applicable', type: 'warning', time: '2 hours ago', read: false },
  { id: '2', title: 'Exam Schedule', message: 'Annual exams start from 15th April 2026', type: 'info', time: '5 hours ago', read: false },
  { id: '3', title: 'Holiday Notice', message: 'School closed on 23rd March - Pakistan Day', type: 'info', time: '1 day ago', read: true },
  { id: '4', title: 'Results Published', message: 'Class 10 mid-term results are now available', type: 'success', time: '2 days ago', read: true },
  { id: '5', title: 'Parent Meeting', message: 'PTA meeting scheduled for 2nd April', type: 'info', time: '3 days ago', read: true },
];

export const feeChartData = [
  { month: 'Oct', collected: 850000, expected: 950000 },
  { month: 'Nov', collected: 920000, expected: 950000 },
  { month: 'Dec', collected: 780000, expected: 950000 },
  { month: 'Jan', collected: 900000, expected: 950000 },
  { month: 'Feb', collected: 870000, expected: 950000 },
  { month: 'Mar', collected: 650000, expected: 950000 },
];

export const attendanceChartData = [
  { month: 'Oct', attendance: 92 },
  { month: 'Nov', attendance: 89 },
  { month: 'Dec', attendance: 85 },
  { month: 'Jan', attendance: 91 },
  { month: 'Feb', attendance: 94 },
  { month: 'Mar', attendance: 87 },
];

export const allClasses = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];

export const allSubjects = ['Urdu', 'English', 'Mathematics', 'Science', 'Islamiat', 'Social Studies', 'Computer'];

export const results = examResults.map(r => ({
  id: r.id,
  studentName: r.studentName,
  class: r.class,
  subject: r.subjects[0]?.subject || '',
  marks: r.obtainedMarks,
  total: r.totalMarks,
  grade: r.grade,
}));

export const performanceChartData = [
  { subject: 'Urdu', avg: 82 },
  { subject: 'English', avg: 75 },
  { subject: 'Math', avg: 85 },
  { subject: 'Science', avg: 78 },
  { subject: 'Islamiat', avg: 88 },
  { subject: 'Computer', avg: 80 },
];
