import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, ArrowRight, Globe } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useI18n } from '@/lib/i18n-context';
import type { UserRole } from '@/lib/demo-data';
import { motion } from 'framer-motion';

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
    <div className="min-h-screen flex bg-background">
      {/* Left panel - green branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary">
        <div className="relative z-10 flex flex-col justify-center p-16 text-primary-foreground">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 backdrop-blur flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="font-display text-2xl font-bold">PakEducate</span>
          </Link>
          <h2 className="font-display text-4xl font-bold mb-4">
            {lang === 'ur' ? 'پاکستان کا جدید اسکول مینجمنٹ سسٹم' : "Pakistan's AI-Powered School Management"}
          </h2>
          <p className="text-primary-foreground/80 text-lg">
            {lang === 'ur' ? 'طلباء، اساتذہ، حاضری، فیس، نتائج — سب ایک جگہ' : 'Manage students, teachers, attendance, fees, results — all in one platform.'}
          </p>
          <div className="mt-12 grid grid-cols-2 gap-4">
            {[
              { n: '500+', l: lang === 'ur' ? 'اسکولز' : 'Schools' },
              { n: '2 لاکھ+', l: lang === 'ur' ? 'طلباء' : 'Students' },
              { n: '99.9%', l: lang === 'ur' ? 'اپ ٹائم' : 'Uptime' },
              { n: '4.9★', l: lang === 'ur' ? 'ریٹنگ' : 'Rating' },
            ].map(s => (
              <div key={s.l} className="bg-primary-foreground/10 backdrop-blur rounded-xl p-4">
                <p className="text-2xl font-bold font-display">{s.n}</p>
                <p className="text-sm text-primary-foreground/70">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <div className="card-white rounded-2xl p-8">
            {/* Language toggle */}
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-sm font-medium hover:bg-muted/80 transition-colors"
              >
                <Globe className="w-4 h-4" />
                {t('common.language')}
              </button>
            </div>

            <div className="lg:hidden flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold">PakEducate</span>
            </div>

            <h2 className="font-display text-2xl font-bold mb-1">
              {t('login.title')}
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              {t('login.subtitle')}
            </p>

            {/* Role selector */}
            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block">{t('login.role')}</label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map(r => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setSelectedRole(r.value)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-lg text-sm font-medium transition-all border-2 ${
                      selectedRole === r.value
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-muted border-transparent hover:border-border'
                    }`}
                  >
                    <span className="text-2xl">{r.icon}</span>
                    <span>{lang === 'ur' ? r.labelUr : r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="email" placeholder={t('login.email')} defaultValue={`${selectedRole}@school.pk`} className="input-field pl-10" />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="password" placeholder={t('login.password')} defaultValue="demo123" className="input-field pl-10" />
              </div>
              <button type="submit" className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
                {t('login.signin')} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
