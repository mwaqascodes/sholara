import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, User, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { motion } from 'framer-motion';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import { toast } from 'sonner';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<string>('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { signUpWithEmail, signInWithGoogle, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const getStrength = () => {
    let s = 0;
    if (password.length >= 6) s++;
    if (password.length >= 8) s++;
    if (/\d/.test(password)) s++;
    if (/[^a-zA-Z0-9]/.test(password)) s++;
    return s;
  };

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][getStrength()];
  const strengthColors = ['', '#ef4444', '#f59e0b', '#eab308', '#22c55e'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) { setError('Please fill in all required fields.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    const { error: err } = await signUpWithEmail(email, password, name, role);
    setLoading(false);
    if (err) {
      setError(err.message || 'Signup failed.');
    } else {
      setSuccess(true);
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    try { await signInWithGoogle(); } catch { setError('Google sign-up failed.'); setGoogleLoading(false); }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center app-bg relative">
        <BackgroundOrbs />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md p-10 rounded-3xl z-10" style={{ background: '#0f1e35', border: '1px solid rgba(255,255,255,0.12)' }}>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.15)' }}>
              <span className="text-3xl">✓</span>
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: '#f1f5f9' }}>Verification Email Sent!</h2>
            <p className="text-sm mb-6" style={{ color: 'rgba(241,245,249,0.5)' }}>
              We've sent a verification link to <strong style={{ color: '#86c94a' }}>{email}</strong>. Click the link in your email to activate your account.
            </p>
            <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white" style={{ background: 'linear-gradient(135deg, #639922, #4d7a18)' }}>
              Back to Login <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center app-bg relative p-4">
      <BackgroundOrbs />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[440px] p-10 rounded-3xl relative z-10" style={{
        background: '#0f1e35',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 25px 80px rgba(0,0,0,0.6)'
      }}>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #639922, #4d7a18)' }}>
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-xl font-bold">
            <span style={{ color: '#f1f5f9' }}>Learnique</span><span style={{ color: '#86c94a' }}>-Vista</span>
          </span>
        </div>

        <h2 className="font-display text-2xl font-bold mb-1" style={{ color: '#f1f5f9' }}>Create Your Account</h2>
        <p className="text-sm mb-5" style={{ color: 'rgba(241,245,249,0.45)' }}>Join and manage your school smarter</p>

        <button onClick={handleGoogleSignup} disabled={googleLoading} className="w-full flex items-center justify-center gap-3 py-3 px-5 rounded-xl font-semibold text-sm transition-all hover:shadow-lg disabled:opacity-60" style={{ background: '#fff', color: '#1f2937' }}>
          {googleLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
          )}
          {googleLoading ? 'Signing up...' : 'Sign up with Google'}
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
          <span className="text-xs" style={{ color: 'rgba(241,245,249,0.35)' }}>or with email</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wide block mb-1" style={{ color: 'rgba(241,245,249,0.5)' }}>Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(241,245,249,0.3)' }} />
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" className="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm outline-none" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)', color: '#f1f5f9' }} />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wide block mb-1" style={{ color: 'rgba(241,245,249,0.5)' }}>Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(241,245,249,0.3)' }} />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@school.com" className="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm outline-none" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)', color: '#f1f5f9' }} />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wide block mb-1" style={{ color: 'rgba(241,245,249,0.5)' }}>Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(241,245,249,0.3)' }} />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" className="w-full pl-11 pr-11 py-2.5 rounded-xl text-sm outline-none" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)', color: '#f1f5f9' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2">
                {showPassword ? <EyeOff className="w-4 h-4" style={{ color: 'rgba(241,245,249,0.4)' }} /> : <Eye className="w-4 h-4" style={{ color: 'rgba(241,245,249,0.4)' }} />}
              </button>
            </div>
            {password && (
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex gap-1 flex-1">{[1,2,3,4].map(i => (<div key={i} className="h-1 flex-1 rounded-full" style={{ background: i <= getStrength() ? strengthColors[getStrength()] : 'rgba(255,255,255,0.1)' }} />))}</div>
                <span className="text-[10px] font-medium" style={{ color: strengthColors[getStrength()] }}>{strengthLabel}</span>
              </div>
            )}
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wide block mb-1" style={{ color: 'rgba(241,245,249,0.5)' }}>Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(241,245,249,0.3)' }} />
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat password" className="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm outline-none" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)', color: '#f1f5f9' }} />
            </div>
            {confirmPassword && (
              <p className="text-[11px] mt-1" style={{ color: password === confirmPassword ? '#22c55e' : '#ef4444' }}>
                {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
              </p>
            )}
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wide block mb-1.5" style={{ color: 'rgba(241,245,249,0.5)' }}>I am a...</label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { v: 'admin', icon: '🏫', label: 'Admin' },
                { v: 'teacher', icon: '👩‍🏫', label: 'Teacher' },
                { v: 'student', icon: '👨‍🎓', label: 'Student' },
              ] as const).map(r => (
                <button key={r.v} type="button" onClick={() => setRole(r.v)}
                  className="flex flex-col items-center gap-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={role === r.v
                    ? { background: 'rgba(99,153,34,0.2)', border: '2px solid #639922', color: '#86c94a' }
                    : { background: 'rgba(255,255,255,0.04)', border: '2px solid transparent', color: 'rgba(241,245,249,0.6)' }
                  }>
                  <span className="text-xl">{r.icon}</span>
                  <span className="text-xs">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl text-[13px]" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)', color: '#f87171' }}>{error}</div>
          )}

          <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 text-white transition-all hover:-translate-y-0.5 disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #639922, #4d7a18)', boxShadow: '0 4px 20px rgba(99,153,34,0.4)' }}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm mt-4" style={{ color: 'rgba(241,245,249,0.45)' }}>
          Already have an account? <Link to="/login" className="font-medium hover:underline" style={{ color: '#86c94a' }}>Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
