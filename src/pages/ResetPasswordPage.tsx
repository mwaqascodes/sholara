import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setError('');
    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) { setError(err.message); }
    else {
      toast.success('Password updated successfully!');
      setTimeout(() => navigate('/dashboard'), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center app-bg relative p-4">
      <BackgroundOrbs />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md p-10 rounded-3xl relative z-10" style={{
        background: '#0f1e35', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 25px 80px rgba(0,0,0,0.6)'
      }}>
        <h2 className="text-2xl font-bold mb-1" style={{ color: '#f1f5f9' }}>Set New Password</h2>
        <p className="text-sm mb-6" style={{ color: 'rgba(241,245,249,0.45)' }}>Enter your new password below</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wide block mb-1.5" style={{ color: 'rgba(241,245,249,0.5)' }}>New Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(241,245,249,0.3)' }} />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" className="w-full pl-11 pr-11 py-3 rounded-xl text-sm outline-none" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)', color: '#f1f5f9' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2">
                {showPassword ? <EyeOff className="w-4 h-4" style={{ color: 'rgba(241,245,249,0.4)' }} /> : <Eye className="w-4 h-4" style={{ color: 'rgba(241,245,249,0.4)' }} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wide block mb-1.5" style={{ color: 'rgba(241,245,249,0.5)' }}>Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(241,245,249,0.3)' }} />
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat password" className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)', color: '#f1f5f9' }} />
            </div>
          </div>
          {error && <div className="px-4 py-3 rounded-xl text-[13px]" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)', color: '#f87171' }}>{error}</div>}
          <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 text-white disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #639922, #4d7a18)', boxShadow: '0 4px 20px rgba(99,153,34,0.4)' }}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
