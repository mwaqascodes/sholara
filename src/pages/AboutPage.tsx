import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap, ShieldCheck, ChevronRight, Sparkles, Target, Rocket, Heart,
  Menu, X, Check
} from 'lucide-react';
import { useState } from 'react';

const VALUES = [
  { icon: Target,  title: 'Mission-Driven',    desc: 'Every feature we ship is designed to save Pakistani school administrators time so they can focus on what matters — students.' },
  { icon: Rocket,  title: 'Built for Speed',   desc: 'From onboarding to daily operations, everything is optimized to run in seconds, not hours. Our median response time is 3.2ms.' },
  { icon: Heart,   title: 'Made Locally',      desc: 'A Pakistani team building for Pakistani schools. We understand the context — from Urdu admin staff to rural connectivity.' },
  { icon: ShieldCheck, title: 'Secure by Default', desc: 'End-to-end encryption, hourly backups, and full data export any time. Your school\'s data is yours — always.' },
];

const MILESTONES = [
  { year: '2024', title: 'Founded',            desc: 'Started with one pilot school in Bajaur.' },
  { year: '2025', title: '100 Schools',        desc: 'First 100 schools onboarded across KP and Punjab.' },
  { year: '2026', title: '500+ Schools',       desc: 'Trusted by 500+ elite institutions nationwide.' },
  { year: 'Next', title: 'Regional Expansion', desc: 'Rolling out bilingual support across South Asia.' },
];

const STATS = [
  { value: '500+',  label: 'Partner Schools',   color: 'text-amber-400' },
  { value: '250K+', label: 'Students Managed',  color: 'text-blue-400' },
  { value: '99.9%', label: 'Platform Uptime',   color: 'text-emerald-400' },
  { value: '24/7',  label: 'Support Coverage',  color: 'text-purple-400' },
];

export default function AboutPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <Link to="/about" className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-400">About</Link>
            <Link to="/contact" className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors">Contact</Link>
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
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-sm font-black uppercase tracking-[0.2em] text-amber-400">About</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-sm font-black uppercase tracking-[0.2em] text-white/60">Contact</Link>
            <div className="pt-3 border-t border-white/5 flex gap-3">
              <Link to="/login" className="flex-1 text-center px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white">Login</Link>
              <Link to="/login" className="flex-1 text-center px-4 py-3 rounded-xl bg-amber-500 text-slate-900 text-[10px] font-black uppercase tracking-widest">Free Demo →</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 pt-40 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm"
          >
            <Sparkles size={11} className="text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.35em] text-amber-400">About Scholara</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-black leading-[0.95] tracking-[-2px] mb-8"
          >
            Empowering Pakistani <br />
            <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">schools, one click at a time.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-base sm:text-lg text-white/55 max-w-2xl mx-auto leading-relaxed"
          >
            We build the software Pakistani schools deserve — fast, bilingual, affordable,
            and driven by AI. From Bajaur to Karachi, our mission is to give every school
            admin the tools of a modern enterprise.
          </motion.p>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="relative z-10 py-14 bg-black/25 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <p className={`${s.color} text-3xl md:text-4xl font-black tracking-tight mb-2`}>{s.value}</p>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/25">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── STORY ── */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/8 border border-amber-500/20 mb-6">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400">Our Story</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-[-1.5px] leading-[1.05] mb-6">
              Born in Bajaur. Built for every Pakistani school.
            </h2>
            <div className="space-y-4 text-white/55 text-sm sm:text-base leading-relaxed">
              <p>
                Scholara started with a simple observation: Pakistani schools were spending hours each day on paperwork — admissions, fees, attendance, reports — when software could handle it all in seconds.
              </p>
              <p>
                We started small, with one school in <span className="text-amber-400 font-bold">Bajaur</span>, helping them digitize fee collection. Within months, word spread. Today we serve 500+ schools across Pakistan, from single-campus academies to nationwide networks.
              </p>
              <p>
                Our AI-first approach means anyone on staff — regardless of technical skill — can run the entire school operation just by typing what they need in Urdu or English.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {MILESTONES.map((m, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-amber-500/20 transition-colors">
                <div className="w-14 flex-shrink-0 text-center">
                  <p className="text-amber-400 text-sm font-black tracking-widest">{m.year}</p>
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-black text-white mb-1">{m.title}</h4>
                  <p className="text-white/45 text-sm">{m.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="relative z-10 py-24 px-6 bg-black/20 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Our Values</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-[-2px] mb-4">
              What we <span className="text-amber-500">stand for.</span>
            </h2>
            <p className="text-white/45 max-w-xl mx-auto">Four principles that guide every product decision.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="p-7 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-amber-500/15 hover:-translate-y-1 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-5">
                  <v.icon size={19} className="text-amber-500" />
                </div>
                <h3 className="text-base font-black mb-3">{v.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-5xl font-black tracking-[-2px] mb-4">
              Why schools <span className="text-amber-500">choose Scholara.</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              'Full Urdu & English interface — no translation needed',
              'Works on any phone, tablet, or desktop browser',
              'AI assistant that takes real actions, not just chats',
              'Free migration from your existing software',
              'No setup fees, no per-student charges',
              'Offline-friendly for low-connectivity areas',
              '30-day free trial with zero commitments',
              'Dedicated support in Urdu and English',
            ].map(item => (
              <div key={item} className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="w-6 h-6 rounded-md bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center flex-shrink-0">
                  <Check size={12} className="text-emerald-400" />
                </div>
                <span className="text-white/70 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 py-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[700px] h-[400px] bg-amber-500/8 blur-[120px] rounded-full" />
        </div>
        <div className="relative max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-[-2px] leading-[0.95] mb-6">
            Join <span className="text-amber-500">500+</span> schools already growing.
          </h2>
          <p className="text-white/45 text-base sm:text-lg mb-10">
            Try Scholara free for 30 days. No credit card, no setup fee.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="px-10 py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-amber-500/30 hover:-translate-y-1 transition-all active:scale-[0.98] flex items-center justify-center gap-3">
              Start Free Demo <ChevronRight size={16} />
            </Link>
            <Link to="/contact" className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all flex items-center justify-center gap-3">
              Contact Us
            </Link>
          </div>
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
