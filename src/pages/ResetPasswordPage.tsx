import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ShieldCheck, Sparkles } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { motion } from "framer-motion"

import { C } from "@/lib/design-system"

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      
      setSuccess(true)
      setTimeout(() => {
        navigate('/dashboard')
      }, 2500)
    } catch (err: any) {
      setError("Authorization timeout or expired reset token.")
    } finally {
      setLoading(false)
    }
  }

  let strengthScore = 0
  if (password.length >= 6) strengthScore += 1
  if (password.length >= 8 && /\d/.test(password)) strengthScore += 1
  if (password.length >= 8 && /[!@#$%^&*]/.test(password)) strengthScore += 1
  if (password.length >= 10 && /[A-Z]/.test(password) && /\d/.test(password) && /[!@#$%^&*]/.test(password)) strengthScore += 1

  return (
    <div className="min-h-screen flex app-bg relative overflow-hidden font-sans items-center justify-center p-6 selection:bg-amber-500/30 selection:text-amber-200">

      
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-500/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-[460px] relative z-10"
      >
        <div className="bg-[#0b1222]/80 backdrop-blur-3xl rounded-[32px] p-10 md:p-12 border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 opacity-50" />
          
          {!success ? (
              <>
                 <div className="mb-10 text-left">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 border border-amber-500/20">
                      <Lock className="w-7 h-7 text-amber-500" />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tighter mb-3">Initialize Key</h2>
                    <p className="text-white/40 text-sm font-medium leading-relaxed">Secure reset protocol active. Choose a high-entropy key to restore institutional access.</p>
                 </div>

                 {error && (
                    <div className="mb-8 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-4 text-red-400">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <p className="text-sm font-bold leading-tight">{error}</p>
                    </div>
                 )}

                 <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 pl-1">New Security Key</label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-amber-500 transition-colors" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder="Minimum 8 characters highly recommended"
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl h-[56px] pl-[48px] pr-14 text-white placeholder:text-white/10 focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.06] transition-all font-medium"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {password.length > 0 && (
                         <div className="pt-2 px-1">
                           <div className="flex gap-1.5 h-1.5 mb-2">
                              <div className={`flex-1 rounded-full transition-all duration-500 ${strengthScore >= 1 ? (strengthScore === 1 ? 'bg-red-500' : strengthScore === 2 ? 'bg-orange-500' : 'bg-amber-500') : 'bg-white/5'}`} />
                              <div className={`flex-1 rounded-full transition-all duration-500 ${strengthScore >= 2 ? (strengthScore === 2 ? 'bg-orange-500' : 'bg-amber-500') : 'bg-white/5'}`} />
                              <div className={`flex-1 rounded-full transition-all duration-500 ${strengthScore >= 3 ? 'bg-amber-500' : 'bg-white/5'}`} />
                              <div className={`flex-1 rounded-full transition-all duration-500 ${strengthScore >= 4 ? 'bg-amber-500 shadow-[0_0_10px_#f59e0b]' : 'bg-white/5'}`} />
                           </div>
                           <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${strengthScore <= 1 ? 'text-red-500' : strengthScore === 2 ? 'text-orange-500' : 'text-amber-500'}`}>
                              Entropy Level: {strengthScore <= 1 ? 'Critical' : strengthScore === 2 ? 'Basic' : 'Master'}
                           </p>
                         </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 pl-1">Verify Security Key</label>
                      <div className="relative group">
                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-amber-500 transition-colors" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          placeholder="Re-authenticate key"
                          className={`w-full bg-white/[0.03] border rounded-2xl h-[56px] pl-[48px] pr-4 text-white placeholder:text-white/10 focus:outline-none transition-all font-medium ${
                            confirmPassword.length > 0
                              ? confirmPassword === password
                                ? 'border-amber-500/50'
                                : 'border-red-500/50'
                              : 'border-white/10'
                          }`}
                          required
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={loading || (confirmPassword.length > 0 && confirmPassword !== password) || password.length < 6}
                      className="w-full h-[56px] rounded-2xl bg-gradient-to-r from-amber-600 to-amber-800 text-white text-[13px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-amber-900/40 hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-50"
                    >
                      {loading ? "SYNCHRONIZING..." : "STORE NEW KEY"}
                    </button>
                 </form>
              </>
           ) : (
              <div className="text-center py-8 animate-in fade-in zoom-in duration-500">
                 <div className="w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-amber-500/20 shadow-2xl">
                    <CheckCircle2 className="w-10 h-10 text-amber-400" />
                 </div>
                 <h3 className="text-3xl font-black text-white mb-4 tracking-tighter">Identity Restored</h3>
                 <p className="text-white/50 text-sm font-medium leading-relaxed mb-10">
                    Your security credentials have been successfully updated. Provisioning dashboard environment...
                 </p>
                 <div className="flex items-center justify-center gap-4 text-amber-400 font-black text-[10px] uppercase tracking-[0.4em]">
                    <div className="w-4 h-4 border-2 border-amber-400/20 border-t-amber-400 rounded-full animate-spin" />
                    Redirecting
                 </div>
              </div>
           )}
        </div>
        
        <div className="mt-10 flex items-center justify-center gap-10 opacity-30">
            <Sparkles size={16} color="#fff" />
            <div className="h-px w-20 bg-white/20" />
            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white">Secure Core</p>
            <div className="h-px w-20 bg-white/20" />
            <Sparkles size={16} color="#fff" />
        </div>
      </motion.div>
    </div>
  )
}
