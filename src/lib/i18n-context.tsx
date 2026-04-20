import React, { createContext, useContext, useState, useEffect } from 'react';

type Lang = 'en' | 'ur';

interface I18nContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations: Record<string, Record<Lang, string>> = {
  'nav.dashboard': { en: 'Dashboard', ur: 'ڈیش بورڈ' },
  'nav.analytics': { en: 'Analytics', ur: 'تجزیات' },
  'nav.students': { en: 'Students', ur: 'طلباء' },
  'nav.teachers': { en: 'Teachers', ur: 'اساتذہ' },
  'nav.attendance': { en: 'Attendance', ur: 'حاضری' },
  'nav.results': { en: 'Exam Results', ur: 'امتحانی نتائج' },
  'nav.homework': { en: 'Homework', ur: 'ہوم ورک' },
  'nav.fees': { en: 'Fee Management', ur: 'فیس مینجمنٹ' },
  'nav.payroll': { en: 'Payroll', ur: 'تنخواہ' },
  'nav.expenses': { en: 'Expenses', ur: 'اخراجات' },
  'nav.calendar': { en: 'Academic Calendar', ur: 'تعلیمی کیلنڈر' },
  'nav.timetable': { en: 'Timetable', ur: 'ٹائم ٹیبل' },
  'nav.merit': { en: 'Merit System', ur: 'میرٹ سسٹم' },
  'nav.inventory': { en: 'Inventory', ur: 'انوینٹری' },
  'nav.announcements': { en: 'Announcements', ur: 'اعلانات' },
  'nav.notifications': { en: 'Notifications', ur: 'اطلاعات' },
  'nav.promotion': { en: 'Class Promotion', ur: 'کلاس پروموشن' },
  'nav.admissions': { en: 'Admissions', ur: 'داخلے' },
  'nav.resultCard': { en: 'Result Card', ur: 'رزلٹ کارڈ' },
  'nav.certificates': { en: 'Certificates / SLC', ur: 'سرٹیفکیٹ' },
  'nav.settings': { en: 'Settings', ur: 'ترتیبات' },
  'nav.leave': { en: 'Leave', ur: 'چھٹی' },

  'dash.welcome': { en: 'Welcome back', ur: 'خوش آمدید' },
  'dash.totalStudents': { en: 'Total Students', ur: 'کل طلباء' },
  'dash.totalTeachers': { en: 'Total Teachers', ur: 'کل اساتذہ' },
  'dash.feesCollected': { en: 'Fees Collected', ur: 'وصول شدہ فیس' },
  'dash.attendanceToday': { en: 'Attendance Today', ur: 'آج کی حاضری' },
  'dash.quickActions': { en: 'Quick Actions', ur: 'فوری کارروائیاں' },
  'dash.addStudent': { en: 'Add Student', ur: 'طالبعلم شامل کریں' },
  'dash.markAttendance': { en: 'Mark Attendance', ur: 'حاضری لگائیں' },
  'dash.enterResults': { en: 'Enter Results', ur: 'نتائج درج کریں' },
  'dash.collectFee': { en: 'Collect Fee', ur: 'فیس وصول کریں' },
  'dash.recentActivity': { en: 'Recent Activity', ur: 'حالیہ سرگرمی' },
  'dash.monthlyFees': { en: 'Monthly Fee Collection', ur: 'ماہانہ فیس وصولی' },
  'dash.attendanceBreakdown': { en: 'Attendance Breakdown', ur: 'حاضری کی تفصیل' },

  'login.title': { en: 'Welcome to PakEducate', ur: 'پاک ایجوکیٹ میں خوش آمدید' },
  'login.subtitle': { en: "Pakistan's AI-Powered School Management", ur: 'پاکستان کا AI سکول مینجمنٹ' },
  'login.email': { en: 'Email Address', ur: 'ای میل ایڈریس' },
  'login.password': { en: 'Password', ur: 'پاس ورڈ' },
  'login.role': { en: 'Select Role', ur: 'کردار منتخب کریں' },
  'login.signin': { en: 'Sign In', ur: 'سائن ان' },

  'common.search': { en: 'Search...', ur: 'تلاش کریں...' },
  'common.add': { en: 'Add', ur: 'شامل کریں' },
  'common.edit': { en: 'Edit', ur: 'ترمیم' },
  'common.delete': { en: 'Delete', ur: 'حذف' },
  'common.save': { en: 'Save', ur: 'محفوظ کریں' },
  'common.cancel': { en: 'Cancel', ur: 'منسوخ' },
  'common.export': { en: 'Export', ur: 'ایکسپورٹ' },
  'common.present': { en: 'Present', ur: 'حاضر' },
  'common.absent': { en: 'Absent', ur: 'غیر حاضر' },
  'common.leave': { en: 'Leave', ur: 'چھٹی' },
  'common.paid': { en: 'Paid', ur: 'ادا شدہ' },
  'common.pending': { en: 'Pending', ur: 'زیر التوا' },
  'common.overdue': { en: 'Overdue', ur: 'واجب الادا' },
  'common.language': { en: 'اردو', ur: 'English' },
  'common.darkMode': { en: 'Dark Mode', ur: 'ڈارک موڈ' },
  'common.lightMode': { en: 'Light Mode', ur: 'لائٹ موڈ' },
  'common.logout': { en: 'Logout', ur: 'لاگ آؤٹ' },
  'common.school': { en: 'School', ur: 'اسکول' },
};

const I18nContext = createContext<I18nContextType>({
  lang: 'en', setLang: () => {}, t: (k) => k, isRTL: false,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // English-only mode — Urdu support disabled per product decision.
  const lang: Lang = 'en';
  const isRTL = false;
  const setLang = (_l: Lang) => {};

  useEffect(() => {
    document.documentElement.dir = 'ltr';
    document.documentElement.classList.remove('rtl');
    document.documentElement.lang = 'en';
  }, []);

  const t = (key: string): string => translations[key]?.en || key;

  return (
    <I18nContext.Provider value={{ lang, setLang, t, isRTL }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);
