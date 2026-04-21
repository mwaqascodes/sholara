import React, { createContext, useContext, useState, useCallback } from 'react';

export type UserRole = 'admin' | 'teacher' | 'student';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  schoolId: string;
}

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const demoUsers: Record<UserRole, User> = {
  admin: { id: '1', name: 'Ahmed Khan', email: 'admin@learnique.pk', role: 'admin', avatar: '👨‍💼', schoolId: 'sch1' },
  teacher: { id: '2', name: 'Fatima Noor', email: 'fatima@school.pk', role: 'teacher', avatar: '👩‍🏫', schoolId: 'sch1' },
  student: { id: '3', name: 'Ali Hassan', email: 'ali@school.pk', role: 'student', avatar: '👨‍🎓', schoolId: 'sch1' },
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
