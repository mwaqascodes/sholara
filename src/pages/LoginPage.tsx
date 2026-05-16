import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { motion } from 'framer-motion';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const { signInWithEmail, signInWithGoogle, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect
  if (isAuthenticated) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    const { error: err } = await signInWithEmail(email, password);
    setLoading(false);
    if (err) {
      if (err.message?.includes('Invalid login')) {
        setError('Incorrect email or password. Try again or use Google login.');
      } else if (err.message?.includes('Email not confirmed')) {
        setError('Please verify your email before signing in. Check your inbox.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } else {
      toast.success('Welcome back!');
      navigate('/dashboard');
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError('Google sign-in failed. Please try again.');
      setGoogleLoading(false);
    }
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
            <span className="font-display text-2xl font-bold">
              <span style={{ color: '#f1f5f9' }}>Learnique</span>
              <span style={{ color: '#86c94a' }}>-Vista</span>
            </span>
          </Link>
          <h2 className="font-display text-4xl font-bold mb-4" style={{ color: '#f1f5f9' }}>
            Manage Your School Smarter
          </h2>
          <p className="text-lg mb-8" style={{ color: 'rgba(241,245,249,0.5)' }}>
            Attendance, fees, results — all in one AI-powered platform.
          </p>
          <div className="space-y-3">
            {['AI-Powered Assistant', 'Real-time Analytics', 'Works on Any Device'].map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'rgba(99,153,34,0.2)' }}>
                  <span className="text-xs" style={{ color: '#86c94a' }}>✓</span>
                </div>
                <span className="text-sm" style={{ color: 'rgba(241,245,249,0.7)' }}>{f}</span>
              </div>
            ))}
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4">
            {[{ n: '500+', l: 'Schools' }, { n: '50K+', l: 'Students' }, { n: '99.9%', l: 'Uptime' }, { n: '4.9★', l: 'Rating' }].map(s => (
              <div key={s.l} className="glass-card p-4">
                <p className="text-2xl font-bold font-display" style={{ color: '#86c94a' }}>{s.n}</p>
                <p className="text-sm" style={{ color: 'rgba(241,245,249,0.5)' }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-[420px]">
          <div className="p-10 rounded-3xl" style={{
            background: '#0f1e35',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 25px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)'
          }}>
            {/* Logo mobile */}
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #639922, #4d7a18)' }}>
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="font-display text-xl font-bold">
                <span style={{ color: '#f1f5f9' }}>Learnique</span>
                <span style={{ color: '#86c94a' }}>-Vista</span>
              </span>
            </div>

            <h2 className="font-display text-2xl font-bold mb-1" style={{ color: '#f1f5f9' }}>Welcome Back</h2>
            <p className="text-sm mb-6" style={{ color: 'rgba(241,245,249,0.45)' }}>Sign in to your school management dashboard</p>

            {/* Google Sign In */}
            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-5 rounded-xl font-semibold text-[15px] transition-all hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60"
              style={{ background: '#ffffff', color: '#1f2937' }}
            >
              {googleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
              )}
              {googleLoading ? 'Signing in...' : 'Continue with Google'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
              <span className="text-xs" style={{ color: 'rgba(241,245,249,0.35)' }}>or continue with email</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
            </div>

            {/* Email form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wide block mb-1.5" style={{ color: 'rgba(241,245,249,0.5)' }}>Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(241,245,249,0.3)' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@school.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)', color: '#f1f5f9' }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'rgba(241,245,249,0.5)' }}>Password</label>
                  <Link to="/forgot-password" className="text-[11px] font-medium hover:underline" style={{ color: '#86c94a' }}>Forgot Password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(241,245,249,0.3)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-11 pr-11 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)', color: '#f1f5f9' }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    {showPassword ? <EyeOff className="w-4 h-4" style={{ color: 'rgba(241,245,249,0.4)' }} /> : <Eye className="w-4 h-4" style={{ color: 'rgba(241,245,249,0.4)' }} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="px-4 py-3 rounded-xl text-[13px]" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)', color: '#f87171' }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 text-white transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0"
                style={{ background: 'linear-gradient(135deg, #639922, #4d7a18)', boxShadow: '0 4px 20px rgba(99,153,34,0.4)' }}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Signing in...' : 'Sign In'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <p className="text-center text-sm mt-5" style={{ color: 'rgba(241,245,249,0.45)' }}>
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium hover:underline" style={{ color: '#86c94a' }}>Sign up</Link>
            </p>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-4 mt-6 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {['🔒 Secure', '🌐 Google OAuth', '✅ Encrypted'].map(b => (
                <span key={b} className="text-[11px]" style={{ color: 'rgba(241,245,249,0.3)' }}>{b}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
