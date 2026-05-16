import type { UserRole } from './supabase';

export type { UserRole };

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin:  'Super Admin',
  school_admin: 'School Admin',
  admin:        'Administrator',
  teacher:      'Teacher',
  parent:       'Parent',
  student:      'Student',
};

export const ROLE_HOME: Record<UserRole, string> = {
  super_admin:  '/super-admin',
  school_admin: '/dashboard',
  admin:        '/dashboard',
  teacher:      '/dashboard',
  parent:       '/dashboard',
  student:      '/dashboard',
};

export const ROLE_COLORS: Record<UserRole, string> = {
  super_admin:  '#ef4444',
  school_admin: '#3b82f6',
  admin:        '#f59e0b',
  teacher:      '#8b5cf6',
  parent:       '#10b981',
  student:      '#64748b',
};

export function getRoleHome(role: UserRole): string {
  return ROLE_HOME[role] ?? '/dashboard';
}

export function isSuperAdmin(role?: UserRole | null): boolean {
  return role === 'super_admin';
}

export function isSchoolStaff(role?: UserRole | null): boolean {
  return !!role && ['school_admin', 'admin', 'teacher'].includes(role);
}

export function canManageSchool(role?: UserRole | null): boolean {
  return !!role && ['super_admin', 'school_admin', 'admin'].includes(role);
}

export const ALL_ROLES: UserRole[] = ['super_admin', 'school_admin', 'admin', 'teacher', 'parent', 'student'];
export const DASHBOARD_ROLES: UserRole[] = ['school_admin', 'admin', 'teacher', 'parent', 'student'];
