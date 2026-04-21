import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import type { UserRole } from '@/lib/demo-data';
import { motion } from 'framer-motion';
import BackgroundOrbs from '@/components/BackgroundOrbs';

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const { login } = useAuth();
  const navigate = useNavigate();

  const roles: { value: UserRole; label: string; icon: string; desc: string }[] = [
    { value: 'admin', label: 'Admin', icon: '👨‍💼', desc: 'Full access' },
    { value: 'teacher', label: 'Teacher', icon: '👩‍🏫', desc: 'Classes & results' },
    { value: 'student', label: 'Student', icon: '👨‍🎓', desc: 'View only' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex app-bg relative">
      <BackgroundOrbs />

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden z-10">
        <div className="relative z-10 flex flex-col justify-center p-16">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #639922, #4d7a18)' }}>
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-2xl font-bold" style={{ color: '#f1f5f9' }}>Learnique<span style={{ color: '#86c94a' }}>-Vista</span></span>
          </Link>
          <h2 className="font-display text-4xl font-bold mb-4" style={{ color: '#f1f5f9' }}>
            Professional AI-Powered School Management
          </h2>
          <p className="text-lg" style={{ color: 'rgba(241,245,249,0.5)' }}>
            Manage students, teachers, attendance, fees, results — all in one intelligent platform.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-4">
            {[
              { n: '500+', l: 'Schools' },
              { n: '50K+', l: 'Students' },
              { n: '99.9%', l: 'Uptime' },
              { n: '4.9★', l: 'Rating' },
            ].map(s => (
              <div key={s.l} className="glass-card" style={{ padding: '1rem' }}>
                <p className="text-2xl font-bold font-display" style={{ color: '#86c94a' }}>{s.n}</p>
                <p className="text-sm" style={{ color: 'rgba(241,245,249,0.5)' }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <div className="glass-card">
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #639922, #4d7a18)' }}>
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="font-display text-xl font-bold" style={{ color: '#f1f5f9' }}>Learnique<span style={{ color: '#86c94a' }}>-Vista</span></span>
            </div>

            <h2 className="font-display text-2xl font-bold mb-1" style={{ color: '#f1f5f9' }}>Welcome Back</h2>
            <p className="text-sm mb-6" style={{ color: 'rgba(241,245,249,0.45)' }}>Select a role to explore the demo dashboard</p>

            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block" style={{ color: 'rgba(241,245,249,0.6)' }}>Select Role</label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map(r => (
                  <button key={r.value} type="button" onClick={() => setSelectedRole(r.value)}
                    className="flex flex-col items-center gap-1 p-3 rounded-xl text-sm font-medium transition-all"
                    style={selectedRole === r.value
                      ? { background: 'rgba(99,153,34,0.2)', border: '2px solid #639922', color: '#86c94a' }
                      : { background: 'rgba(255,255,255,0.04)', border: '2px solid transparent', color: 'rgba(241,245,249,0.6)' }
                    }>
                    <span className="text-2xl">{r.icon}</span>
                    <span>{r.label}</span>
                    <span className="text-[10px] opacity-60">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(241,245,249,0.3)' }} />
                <input type="email" placeholder="Email address" defaultValue={`${selectedRole}@school.pk`} className="glass-input pl-10" />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(241,245,249,0.3)' }} />
                <input type="password" placeholder="Password" defaultValue="demo123" className="glass-input pl-10" />
              </div>
              <button type="submit" className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 text-white transition-all hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, #639922, #4d7a18)', boxShadow: '0 4px 20px rgba(99,153,34,0.4)' }}>
                Sign In <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <p className="text-center text-xs mt-4" style={{ color: 'rgba(241,245,249,0.35)' }}>
              Demo mode — no real credentials needed
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
