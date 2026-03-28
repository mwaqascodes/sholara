import React, { createContext, useContext, useState, useCallback } from 'react';
import type { UserRole } from './demo-data';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  schoolId?: string;
}

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const demoUsers: Record<UserRole, User> = {
  superadmin: { id: '0', name: 'Platform Admin', email: 'super@eduflow.com', role: 'superadmin', avatar: '🛡️' },
  admin: { id: '1', name: 'Admin User', email: 'admin@school.com', role: 'admin', avatar: '👨‍💼', schoolId: 'sch1' },
  teacher: { id: '2', name: 'Dr. Sarah Mitchell', email: 'sarah@school.com', role: 'teacher', avatar: '👩‍🏫', schoolId: 'sch1' },
  student: { id: '3', name: 'Aarav Patel', email: 'aarav@school.com', role: 'student', avatar: '👨‍🎓', schoolId: 'sch1' },
  parent: { id: '4', name: 'Raj Patel', email: 'raj@school.com', role: 'parent', avatar: '👨‍👧', schoolId: 'sch1' },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((role: UserRole) => {
    setUser(demoUsers[role]);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
