import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap, ChevronRight, Mail, MessageCircle, MapPin,
  Menu, X, Sparkles, Clock, Send
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const EMAIL = 'mwaqas5491@gmail.com';
const WA_NUMBER = '923045491795';
const WA_DISPLAY = '+92 304 549 1795';
const ADDRESS_LINE = 'Bajaur, Khyber Pakhtunkhwa, Pakistan';

export default function ContactPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in your name, email, and message.');
      return;
    }
    const body = `Name: ${form.name}%0D%0AEmail: ${form.email}%0D%0A%0D%0A${encodeURIComponent(form.message)}`;
    const subject = encodeURIComponent(form.subject || 'Scholara Enquiry');
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    toast.success('Opening your email app…');
  };

  return (
    <div className="min-h-screen bg-[#060d1a] text-white overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-200" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] bg-amber-500/8 blur-[160px] rounded-full" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[50%] bg-indigo-500/8 blur-[160px] rounded-full" />
      </div>

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#060d1a]/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <GraduationCap size={18} className="text-slate-900" />
            </div>
            <span className="text-xl font-black tracking-tight">Schol<span className="text-amber-500">ara</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-9">
            <Link to="/" className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors">Home</Link>
            <Link to="/about" className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors">About</Link>
            <Link to="/contact" className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-400">Contact</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden sm:block text-[11px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors">Portal Login</Link>
            <Link to="/login" className="hidden sm:inline-flex px-6 py-2.5 bg-amber-500 text-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 active:scale-95">Free Demo →</Link>
            <button type="button" onClick={() => setMobileMenuOpen(v => !v)} className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-white/70" aria-label="Toggle menu">
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 bg-[#060d1a]/95 backdrop-blur-xl px-6 py-5 flex flex-col gap-4">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-sm font-black uppercase tracking-[0.2em] text-white/60">Home</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-sm font-black uppercase tracking-[0.2em] text-white/60">About</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-sm font-black uppercase tracking-[0.2em] text-amber-400">Contact</Link>
            <div className="pt-3 border-t border-white/5 flex gap-3">
              <Link to="/login" className="flex-1 text-center px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white">Login</Link>
              <Link to="/login" className="flex-1 text-center px-4 py-3 rounded-xl bg-amber-500 text-slate-900 text-[10px] font-black uppercase tracking-widest">Free Demo →</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 pt-40 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm"
          >
            <Sparkles size={11} className="text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.35em] text-amber-400">Get in Touch</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-black leading-[0.95] tracking-[-2px] mb-6"
          >
            Let's talk about <br />
            <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">your school.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-base sm:text-lg text-white/55 max-w-xl mx-auto leading-relaxed"
          >
            Questions, demo requests, partnerships — we read every message.
            Fastest response: WhatsApp. Typical reply time under 2 hours.
          </motion.p>
        </div>
      </section>

      {/* ── CONTACT CARDS ── */}
      <section className="relative z-10 pb-12 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-5">
          {/* Email */}
          <motion.a
            href={`mailto:${EMAIL}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0 }}
            className="group p-7 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-amber-500/25 hover:-translate-y-1 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-5 group-hover:bg-amber-500/15 transition-colors">
              <Mail size={19} className="text-amber-500" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40 mb-2">Email</p>
            <p className="text-sm sm:text-base font-bold text-white mb-1 break-all">{EMAIL}</p>
            <p className="text-xs text-white/40">Reply within 24 hours</p>
          </motion.a>

          {/* WhatsApp */}
          <motion.a
            href={`https://wa.me/${WA_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="group p-7 rounded-2xl bg-gradient-to-b from-emerald-500/10 to-emerald-500/5 border border-emerald-500/25 hover:border-emerald-500/50 hover:-translate-y-1 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-5">
              <MessageCircle size={19} className="text-emerald-400" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400 mb-2">WhatsApp · Fastest</p>
            <p className="text-sm sm:text-base font-bold text-white mb-1">{WA_DISPLAY}</p>
            <p className="text-xs text-white/50">Tap to chat now</p>
          </motion.a>

          {/* Address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.16 }}
            className="p-7 rounded-2xl bg-white/[0.02] border border-white/5"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-5">
              <MapPin size={19} className="text-amber-500" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40 mb-2">Office</p>
            <p className="text-sm sm:text-base font-bold text-white mb-1">Bajaur</p>
            <p className="text-xs text-white/40">{ADDRESS_LINE}</p>
          </motion.div>
        </div>
      </section>

      {/* ── FORM ── */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="p-px rounded-[2rem] bg-gradient-to-br from-white/10 via-white/5 to-amber-500/10">
            <div className="bg-[#0a1020] rounded-[2rem] p-8 sm:p-10">
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-black tracking-[-1px] mb-2">Send us a message</h2>
                <p className="text-white/45 text-sm">We'll get back to you shortly. For faster replies, use WhatsApp above.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-white/50 mb-2">Your Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.07] transition-colors"
                      placeholder="Abdullah Khan"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-white/50 mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.07] transition-colors"
                      placeholder="you@school.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-white/50 mb-2">Subject</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.07] transition-colors"
                    placeholder="Demo request for Grammar School, Peshawar"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-white/50 mb-2">Message</label>
                  <textarea
                    required
                    rows={6}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-amber-500/50 focus:bg-white/[0.07] transition-colors resize-none"
                    placeholder="Tell us about your school — number of students, what you're currently using, and what you'd like Scholara to help with."
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between pt-3">
                  <p className="flex items-center gap-2 text-xs text-white/40">
                    <Clock size={12} className="text-amber-500" /> Typical response: under 2 hours
                  </p>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-amber-500/25 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Send size={14} /> Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ── */}
      <section className="relative z-10 py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-black tracking-[-1px] mb-4">Ready to see it in action?</h3>
          <p className="text-white/45 mb-8">Start a free 30-day demo — no credit card required.</p>
          <Link
            to="/login"
            className="inline-flex px-10 py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-amber-500/30 hover:-translate-y-1 transition-all active:scale-[0.98] items-center gap-3"
          >
            Start Free Demo <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 py-10 px-6 border-t border-white/5 bg-black/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <GraduationCap size={15} className="text-slate-900" />
            </div>
            <span className="text-lg font-black tracking-tight">Schol<span className="text-amber-500">ara</span></span>
          </Link>
          <p className="text-white/25 text-[10px] font-black uppercase tracking-[0.4em] text-center">
            Scholara · School Management System © 2026
          </p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="text-[11px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">About</Link>
            <Link to="/contact" className="text-[11px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
