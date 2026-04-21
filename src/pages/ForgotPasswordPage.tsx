import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, ArrowLeft, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { motion } from 'framer-motion';
import BackgroundOrbs from '@/components/BackgroundOrbs';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError('Please enter your email.'); return; }
    setError('');
    setLoading(true);
    const { error: err } = await resetPassword(email);
    setLoading(false);
    if (err) { setError(err.message || 'Failed to send reset email.'); }
    else { setSent(true); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center app-bg relative p-4">
      <BackgroundOrbs />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md p-10 rounded-3xl relative z-10" style={{
        background: '#0f1e35', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 25px 80px rgba(0,0,0,0.6)'
      }}>
        <Link to="/login" className="flex items-center gap-1.5 text-sm mb-6 hover:underline" style={{ color: '#86c94a' }}>
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>

        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.15)' }}>
              <Mail className="w-7 h-7" style={{ color: '#22c55e' }} />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: '#f1f5f9' }}>Reset Link Sent!</h2>
            <p className="text-sm mb-6" style={{ color: 'rgba(241,245,249,0.5)' }}>Check your email <strong style={{ color: '#86c94a' }}>{email}</strong> for a password reset link. It expires in 1 hour.</p>
            <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white" style={{ background: 'linear-gradient(135deg, #639922, #4d7a18)' }}>
              Back to Login <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-1" style={{ color: '#f1f5f9' }}>Reset Password</h2>
            <p className="text-sm mb-6" style={{ color: 'rgba(241,245,249,0.45)' }}>Enter your email and we'll send a reset link</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wide block mb-1.5" style={{ color: 'rgba(241,245,249,0.5)' }}>Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(241,245,249,0.3)' }} />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@school.com" className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)', color: '#f1f5f9' }} />
                </div>
              </div>
              {error && <div className="px-4 py-3 rounded-xl text-[13px]" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)', color: '#f87171' }}>{error}</div>}
              <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 text-white disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #639922, #4d7a18)', boxShadow: '0 4px 20px rgba(99,153,34,0.4)' }}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
