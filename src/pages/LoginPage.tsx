import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, ArrowRight, Globe, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useI18n } from '@/lib/i18n-context';
import type { UserRole } from '@/lib/demo-data';
import { motion } from 'framer-motion';
import BackgroundOrbs from '@/components/BackgroundOrbs';

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const { login } = useAuth();
  const { t, lang, setLang } = useI18n();
  const navigate = useNavigate();

  const roles: { value: UserRole; label: string; labelUr: string; icon: string }[] = [
    { value: 'admin', label: 'Admin', labelUr: 'ایڈمن', icon: '👨‍💼' },
    { value: 'teacher', label: 'Teacher', labelUr: 'استاد', icon: '👩‍🏫' },
    { value: 'student', label: 'Student', labelUr: 'طالبعلم', icon: '👨‍🎓' },
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
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-2xl font-bold" style={{ color: '#f1f5f9' }}>PakEducate</span>
          </Link>
          <h2 className="font-display text-4xl font-bold mb-4" style={{ color: '#f1f5f9' }}>
            {lang === 'ur' ? 'پاکستان کا جدید اسکول مینجمنٹ سسٹم' : "Pakistan's AI-Powered School Management"}
          </h2>
          <p className="text-lg" style={{ color: 'rgba(241,245,249,0.5)' }}>
            {lang === 'ur' ? 'طلباء، اساتذہ، حاضری، فیس، نتائج — سب ایک جگہ' : 'Manage students, teachers, attendance, fees, results — all in one platform.'}
          </p>
          <div className="mt-12 grid grid-cols-2 gap-4">
            {[
              { n: '500+', l: lang === 'ur' ? 'اسکولز' : 'Schools' },
              { n: '50K+', l: lang === 'ur' ? 'طلباء' : 'Students' },
              { n: '99.9%', l: lang === 'ur' ? 'اپ ٹائم' : 'Uptime' },
              { n: '4.9★', l: lang === 'ur' ? 'ریٹنگ' : 'Rating' },
            ].map(s => (
              <div key={s.l} className="glass-card" style={{ padding: '1rem' }}>
                <p className="text-2xl font-bold font-display" style={{ color: '#22c55e' }}>{s.n}</p>
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
            <div className="flex justify-end mb-4">
              <button onClick={() => setLang(lang === 'en' ? 'ur' : 'en')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(241,245,249,0.7)' }}>
                <Globe className="w-4 h-4" /> {t('common.language')}
              </button>
            </div>

            <div className="lg:hidden flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-display text-xl font-bold" style={{ color: '#f1f5f9' }}>PakEducate</span>
            </div>

            <h2 className="font-display text-2xl font-bold mb-1" style={{ color: '#f1f5f9' }}>{t('login.title')}</h2>
            <p className="text-sm mb-6" style={{ color: 'rgba(241,245,249,0.45)' }}>{t('login.subtitle')}</p>

            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block" style={{ color: 'rgba(241,245,249,0.6)' }}>{t('login.role')}</label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map(r => (
                  <button key={r.value} type="button" onClick={() => setSelectedRole(r.value)}
                    className="flex flex-col items-center gap-1 p-3 rounded-xl text-sm font-medium transition-all"
                    style={selectedRole === r.value
                      ? { background: 'rgba(22,163,74,0.2)', border: '2px solid #22c55e', color: '#22c55e' }
                      : { background: 'rgba(255,255,255,0.04)', border: '2px solid transparent', color: 'rgba(241,245,249,0.6)' }
                    }>
                    <span className="text-2xl">{r.icon}</span>
                    <span>{lang === 'ur' ? r.labelUr : r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(241,245,249,0.3)' }} />
                <input type="email" placeholder={t('login.email')} defaultValue={`${selectedRole}@school.pk`} className="glass-input pl-10" />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(241,245,249,0.3)' }} />
                <input type="password" placeholder={t('login.password')} defaultValue="demo123" className="glass-input pl-10" />
              </div>
              <button type="submit" className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 text-white" style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', boxShadow: '0 4px 20px rgba(22,163,74,0.4)' }}>
                {t('login.signin')} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
