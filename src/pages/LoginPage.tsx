import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import type { UserRole } from '@/lib/demo-data';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const { login } = useAuth();
  const navigate = useNavigate();

  const roles: { value: UserRole; label: string; icon: string }[] = [
    { value: 'admin', label: 'Admin', icon: '👨‍💼' },
    { value: 'teacher', label: 'Teacher', icon: '👩‍🏫' },
    { value: 'student', label: 'Student', icon: '👨‍🎓' },
    { value: 'parent', label: 'Parent', icon: '👨‍👧' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex gradient-mesh">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-90" />
        <div className="relative z-10 flex flex-col justify-center p-16 text-primary-foreground">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 backdrop-blur flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="font-display text-2xl font-bold">EduFlow</span>
          </Link>
          <h2 className="font-display text-4xl font-bold mb-4">Welcome to the future of school management</h2>
          <p className="text-primary-foreground/80 text-lg">Manage students, teachers, attendance, fees, and more — all in one platform.</p>
          <div className="mt-12 grid grid-cols-2 gap-4">
            {[
              { n: '500+', l: 'Schools' },
              { n: '200K+', l: 'Students' },
              { n: '99.9%', l: 'Uptime' },
              { n: '4.9★', l: 'Rating' },
            ].map(s => (
              <div key={s.l} className="bg-primary-foreground/10 backdrop-blur rounded-xl p-4">
                <p className="text-2xl font-bold font-display">{s.n}</p>
                <p className="text-sm text-primary-foreground/70">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="glass-strong rounded-2xl p-8">
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold">EduFlow</span>
            </div>
            <h2 className="font-display text-2xl font-bold mb-1">
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              {isSignup ? 'Start your free trial today' : 'Sign in to your account'}
            </p>

            {/* Role selector */}
            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block">Select Role (Demo)</label>
              <div className="grid grid-cols-4 gap-2">
                {roles.map(r => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setSelectedRole(r.value)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl text-xs font-medium transition-all ${
                      selectedRole === r.value
                        ? 'bg-primary/10 border-2 border-primary text-primary shadow-sm'
                        : 'glass hover:bg-primary/5 border-2 border-transparent'
                    }`}
                  >
                    <span className="text-xl">{r.icon}</span>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-transparent"
                  />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Email address"
                  defaultValue={`${selectedRole}@school.com`}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-transparent"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="Password"
                  defaultValue="demo123"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-transparent"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl gradient-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                {isSignup ? 'Create Account' : 'Sign In'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-6">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button onClick={() => setIsSignup(!isSignup)} className="text-primary font-medium hover:underline">
                {isSignup ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
