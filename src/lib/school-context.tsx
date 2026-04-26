import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type SchoolBoard = 'Federal' | 'Punjab' | 'Sindh' | 'KPK' | 'Balochistan' | 'AJK' | 'Cambridge' | 'Aga Khan';
export type SchoolMedium = 'Urdu' | 'English' | 'Bilingual';
export type SchoolType = 'Pre-School' | 'Primary' | 'Middle' | 'Secondary (Matric)' | 'Higher Secondary (FSc)' | 'O/A Levels';
export type ExamSystem = 'Annual' | 'Semester' | 'Term-Based (3 Terms)' | 'Continuous Assessment';
export type GradingScale = 'Pakistani (A+/A/B/C/D/F)' | 'Percentage' | 'GPA (4.0)' | 'Cambridge (A*-U)';

export interface SchoolSettings {
  // Identity
  name: string;
  nameUrdu: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  province: string;
  logoUrl: string;
  motto: string;
  principalName: string;
  estYear: string;
  // Pakistan-specific
  board: SchoolBoard;
  medium: SchoolMedium;
  schoolType: SchoolType;
  registrationNo: string;
  emisCode: string; // EMIS = Education Management Info System (Pak govt)
  // Academic
  academicYearStart: string; // e.g. "April"
  academicYear: string; // e.g. "2025-2026"
  examSystem: ExamSystem;
  gradingScale: GradingScale;
  passingPercentage: number;
  weeklyOff: string; // "Friday" or "Sunday"
  // Fees
  currency: string;
  monthlyFeeDefault: number;
  admissionFee: number;
  lateFeeFine: number;
  feeDueDate: number; // day of month
  // Communication
  whatsappEnabled: boolean;
  smsEnabled: boolean;
  parentPortalEnabled: boolean;
  // Subjects
  subjects: string[];
  // Religious / Cultural
  islamiatCompulsory: boolean;
  qaidaTimings: boolean; // Qaida/Nazra period
  prayerBreak: boolean; // Zuhr prayer break in schedule
  ramadanSchedule: boolean; // shorter Ramadan timings
}

const DEFAULT_SETTINGS: SchoolSettings = {
  name: 'Al-Noor Academy',
  nameUrdu: 'النور اکیڈمی',
  email: 'admin@alnoor.edu.pk',
  phone: '042-35781234',
  whatsapp: '+92 300 1234567',
  address: '123 Main Road, Gulberg III, Lahore',
  city: 'Lahore',
  province: 'Punjab',
  logoUrl: '',
  motto: 'Knowledge · Character · Service',
  principalName: 'Prof. Tariq Mehmood',
  estYear: '1998',
  board: 'Punjab',
  medium: 'Bilingual',
  schoolType: 'Secondary (Matric)',
  registrationNo: 'PEF-LHR-2451',
  emisCode: '',
  academicYearStart: 'April',
  academicYear: '2025-2026',
  examSystem: 'Term-Based (3 Terms)',
  gradingScale: 'Pakistani (A+/A/B/C/D/F)',
  passingPercentage: 40,
  weeklyOff: 'Sunday',
  currency: 'PKR (₨)',
  monthlyFeeDefault: 3500,
  admissionFee: 5000,
  lateFeeFine: 200,
  feeDueDate: 10,
  whatsappEnabled: true,
  smsEnabled: false,
  parentPortalEnabled: true,
  subjects: ['Urdu', 'English', 'Mathematics', 'Science', 'Islamiat', 'Pakistan Studies', 'Computer', 'Social Studies'],
  islamiatCompulsory: true,
  qaidaTimings: false,
  prayerBreak: true,
  ramadanSchedule: true,
};

const STORAGE_KEY = 'Scholara_school_settings_v1';

interface SchoolContextType {
  settings: SchoolSettings;
  update: (patch: Partial<SchoolSettings>) => void;
  reset: () => void;
}

const SchoolContext = createContext<SchoolContextType | null>(null);

export function SchoolProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SchoolSettings>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {}
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); } catch {}
  }, [settings]);

  const update = useCallback((patch: Partial<SchoolSettings>) => {
    setSettings(prev => ({ ...prev, ...patch }));
  }, []);

  const reset = useCallback(() => setSettings(DEFAULT_SETTINGS), []);

  return (
    <SchoolContext.Provider value={{ settings, update, reset }}>
      {children}
    </SchoolContext.Provider>
  );
}

export function useSchool() {
  const ctx = useContext(SchoolContext);
  if (!ctx) throw new Error('useSchool must be used within SchoolProvider');
  return ctx;
}

export const PAKISTAN_PROVINCES = ['Punjab', 'Sindh', 'KPK', 'Balochistan', 'Islamabad Capital Territory', 'Gilgit-Baltistan', 'Azad Kashmir'];
export const PAKISTAN_CITIES = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala', 'Hyderabad', 'Bahawalpur', 'Sargodha', 'Jhelum', 'Abbottabad', 'Mardan', 'Sukkur'];
export const BOARDS: SchoolBoard[] = ['Federal', 'Punjab', 'Sindh', 'KPK', 'Balochistan', 'AJK', 'Cambridge', 'Aga Khan'];
export const SCHOOL_TYPES: SchoolType[] = ['Pre-School', 'Primary', 'Middle', 'Secondary (Matric)', 'Higher Secondary (FSc)', 'O/A Levels'];
export const EXAM_SYSTEMS: ExamSystem[] = ['Annual', 'Semester', 'Term-Based (3 Terms)', 'Continuous Assessment'];
export const GRADING_SCALES: GradingScale[] = ['Pakistani (A+/A/B/C/D/F)', 'Percentage', 'GPA (4.0)', 'Cambridge (A*-U)'];
export const COMMON_SUBJECTS = ['Urdu', 'English', 'Mathematics', 'Science', 'Islamiat', 'Pakistan Studies', 'Computer', 'Social Studies', 'Physics', 'Chemistry', 'Biology', 'Arabic', 'Sindhi', 'Pashto', 'Punjabi', 'Art & Craft', 'Physical Education', 'Nazra Quran', 'General Knowledge'];
