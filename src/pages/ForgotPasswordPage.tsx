import { useState } from "react"
import { Link } from "react-router-dom"
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { motion } from "framer-motion"

import { C } from "@/lib/design-system"

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await resetPassword(email)
      if (error) throw error
      setSuccess(true)
    } catch (err: any) {
      setError("No institutional account identified with this ID.")
    } finally {
      setLoading(false)
    }
  }

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
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-800 opacity-50" />
          
          <Link to="/login" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 text-[10px] font-black uppercase tracking-widest group">
             <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Auth Portal
          </Link>

          {!success ? (
             <>
                 <div className="mb-10 text-left">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 border border-amber-500/20">
                      <ShieldCheck className="w-7 h-7 text-amber-500" />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tighter mb-3">Credential Reset</h2>
                    <p className="text-white/40 text-sm font-medium leading-relaxed">System-wide diagnostic: provide your registration ID for secure key dispatch.</p>
                 </div>

                 {error && (
                    <div className="mb-8 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-4 text-red-400">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <p className="text-sm font-bold leading-tight">{error}</p>
                    </div>
                 )}

                 <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 pl-1">Institutional ID (Email)</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-amber-500 transition-colors" />
                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="id@scholara.com"
                          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl h-[56px] pl-[48px] pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.06] transition-all font-medium"
                          required
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={loading || !email}
                      className="w-full h-[56px] rounded-2xl bg-gradient-to-r from-amber-600 to-amber-800 text-white text-[13px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-amber-900/40 hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-50"
                    >
                      {loading ? "DISPATCHING KEY..." : "TRANSMIT RESET KEY"}
                    </button>
                 </form>
              </>
           ) : (
              <div className="text-center py-6 animate-in fade-in zoom-in duration-500">
                 <div className="w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-amber-500/20 shadow-2xl">
                    <CheckCircle2 className="w-10 h-10 text-amber-400" />
                 </div>
                <h3 className="text-3xl font-black text-white mb-4 tracking-tighter">Key Dispatched</h3>
                <p className="text-white/50 text-sm font-medium leading-relaxed mb-10">
                   Secure reset protocol initiated. Please inspect <span className="text-white font-black">{email}</span> for authorization.
                </p>
                <Link to="/login" className="block w-full py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white font-black uppercase tracking-widest text-xs hover:bg-white/[0.08] transition-all">
                   Return to Portal
                </Link>
             </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
