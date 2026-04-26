import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, ShieldCheck, ChevronRight, Sparkles, Bot, Wallet, Award,
  CalendarCheck, Globe, Bell, Star, PlayCircle,
  BarChart3, Users, CreditCard, Check, Plus, Minus, Menu, X,
  Mail, Phone, MapPin
} from 'lucide-react';
import { useState } from 'react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

type NavLink = { label: string; href: string; internal?: boolean };

const NAV_LINKS: NavLink[] = [
  { label: 'Ecosystem', href: '#ecosystem' },
  { label: 'AI Assistant', href: '#ai' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'About', href: '/about', internal: true },
  { label: 'Contact', href: '/contact', internal: true },
];

const STATS = [
  { value: '500+',  label: 'Schools Nationwide', color: 'text-amber-400' },
  { value: '99.9%', label: 'System Uptime',      color: 'text-blue-400' },
  { value: '3.2ms', label: 'Response Time',      color: 'text-purple-400' },
  { value: 'E2E',   label: 'Data Encrypted',     color: 'text-emerald-400' },
];

const FEATURES = [
  { icon: Bot,           title: 'AI Command Center', desc: 'Run any task with a single instruction. Add students, generate reports, send notices — the assistant handles the rest, in Urdu or English.' },
  { icon: Wallet,        title: 'Fees & Finance',    desc: 'Centralized collection, automated reminders, and live revenue forecasting — built around the way Pakistani schools actually run their books.' },
  { icon: Award,         title: 'Academic Insight',  desc: 'Exam results, merit lists, and growth analytics across every grade — turning marks into the decisions that move outcomes.' },
  { icon: CalendarCheck, title: 'Attendance, Automated', desc: 'Mark, track, and report attendance in seconds. Parents are notified instantly — no spreadsheets, no follow-ups.' },
  { icon: Bell,          title: 'Parent & Staff Comms',  desc: 'Announcements, SMS, and push notifications reach every stakeholder from a single, audited workspace.' },
  { icon: Globe,         title: 'Built Bilingual',       desc: 'First-class Urdu and English across every module — engineered for the people who actually use the system, not just IT.' },
];

const AI_CHAT = [
  { role: 'user', text: 'Add new student: Ahmed Ali, Class 9A, father contact 0300-1234567' },
  { role: 'ai',   text: '✓ Student Added!\nAhmed Ali — Class 9A, Roll# 48\nParent notified via SMS.' },
  { role: 'user', text: 'Who hasn\'t paid fees this month?' },
  { role: 'ai',   text: '183 students have pending fees totaling PKR 19.4L. Send reminder SMS to all parents?' },
  { role: 'user', text: 'Yes, send it' },
  { role: 'ai',   text: '✓ Done! SMS sent to 183 parents. You\'ll see responses in the notification center.' },
];

const TESTIMONIALS = [
  {
    text: '"Fee collection that used to take three days now closes itself overnight. The AI assistant has become the most reliable member of our admin team."',
    name: 'Muhammad Aslam',
    role: 'Principal, Lahore Grammar School',
    initials: 'MA',
    gradient: 'from-amber-400 to-amber-600',
  },
  {
    text: '"We run 800 students with a team of three. Attendance, fees, results — everything that used to be manual is now ambient. Staff focus on teaching again."',
    name: 'Sara Khurshid',
    role: 'Director, Beacon House Karachi',
    initials: 'SK',
    gradient: 'from-blue-400 to-blue-600',
  },
  {
    text: '"The Urdu interface alone made the decision for us. Our team writes in Urdu, the system responds correctly — it feels purpose-built for Pakistani schools."',
    name: 'Imran Hussain',
    role: 'Owner, Al-Huda Academy, Islamabad',
    initials: 'IH',
    gradient: 'from-purple-400 to-purple-600',
  },
];

const PRICING = [
  {
    name: 'Starter',
    priceMonthly: 4999,
    tagline: 'For schools moving from paper to digital.',
    features: [
      'Up to 300 students',
      'Fees, attendance & results',
      'Parent SMS (1,000 per month)',
      'Standard reports & exports',
      'Email support',
    ],
    cta: 'Start free trial',
    highlight: false,
  },
  {
    name: 'Growth',
    priceMonthly: 12999,
    tagline: 'For mid-sized campuses scaling operations.',
    features: [
      'Up to 1,500 students',
      'Everything in Starter',
      'AI Assistant (Urdu & English)',
      'Certificates & report cards',
      'Parent SMS (10,000 per month)',
      'Priority response support',
    ],
    cta: 'Start free trial',
    highlight: true,
  },
  {
    name: 'Enterprise',
    priceMonthly: null,
    tagline: 'For multi-campus networks and large trusts.',
    features: [
      'Unlimited students',
      'Everything in Growth',
      'Multi-campus consolidation',
      'Dedicated success manager',
      'Custom integrations & SSO',
      'On-site training & rollout',
    ],
    cta: 'Contact sales',
    highlight: false,
  },
];

const FAQS = [
  {
    q: 'How long is the free trial?',
    a: 'Thirty days, with every feature unlocked and no credit card required. Need longer to evaluate? Email support and we will extend it.',
  },
  {
    q: 'How is our school data protected?',
    a: 'All data is encrypted end-to-end, in transit and at rest. We run hourly backups, support full CSV export at any time, and never share or resell your records.',
  },
  {
    q: 'Will our staff need technical training?',
    a: 'No. The AI assistant accepts plain Urdu or English — staff who can use WhatsApp can run the entire platform, from admissions to report cards.',
  },
  {
    q: 'Can we migrate from our existing software?',
    a: 'Yes. Migration is included free on Growth and Enterprise plans. Send your student and fee records in any common format; we will import them into your dashboard within 48 hours.',
  },
  {
    q: 'Does the platform work on mobile?',
    a: 'Fully. Scholara runs on any phone, tablet, or desktop browser. No app install, no downloads — just sign in.',
  },
  {
    q: 'What happens when the trial ends?',
    a: 'Your data is preserved for 60 days. Upgrade to a paid plan and continue exactly where you left off, or export everything and leave with no obligations.',
  },
];

const fmtPkr = (n: number) => `₨${n.toLocaleString('en-PK')}`;

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#060d1a] text-white font-sans overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-200 scroll-smooth antialiased" style={{ fontFeatureSettings: "'ss01', 'ss02', 'cv11'" }}>

      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] bg-amber-500/8 blur-[160px] rounded-full" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[50%] bg-indigo-500/8 blur-[160px] rounded-full" />
      </div>

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#060d1a]/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          {/* Logo */}
          <a href="#top" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:shadow-amber-500/40 transition-shadow">
              <GraduationCap size={18} className="text-slate-900" />
            </div>
            <span className="font-display font-semibold text-[19px] tracking-[-0.025em] text-white">Scholara</span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(l => (
              l.internal ? (
                <Link
                  key={l.label}
                  to={l.href}
                  className="text-[14px] font-medium tracking-tight text-white/55 hover:text-white transition-colors"
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.label}
                  href={l.href}
                  className="text-[14px] font-medium tracking-tight text-white/55 hover:text-white transition-colors"
                >
                  {l.label}
                </a>
              )
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="hidden sm:block text-[14px] font-medium tracking-tight text-white/55 hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/login"
              className="hidden sm:inline-flex px-5 py-2.5 bg-gradient-to-b from-amber-400 to-amber-600 text-slate-950 rounded-full text-[13.5px] font-semibold tracking-tight hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/30 transition-all active:scale-95 items-center gap-1.5"
            >
              Get started <ChevronRight size={14} />
            </Link>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(v => !v)}
              className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-white/70"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-white/5 bg-[#060d1a]/95 backdrop-blur-xl overflow-hidden"
            >
              <div className="px-6 py-5 flex flex-col gap-3.5">
                {NAV_LINKS.map(l => (
                  l.internal ? (
                    <Link
                      key={l.label}
                      to={l.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-[15px] font-medium tracking-tight text-white/70 hover:text-amber-300 transition-colors"
                    >
                      {l.label}
                    </Link>
                  ) : (
                    <a
                      key={l.label}
                      href={l.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-[15px] font-medium tracking-tight text-white/70 hover:text-amber-300 transition-colors"
                    >
                      {l.label}
                    </a>
                  )
                ))}
                <div className="pt-3 border-t border-white/5 flex gap-3">
                  <Link
                    to="/login"
                    className="flex-1 text-center px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-[14px] font-medium text-white"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/login"
                    className="flex-1 text-center px-4 py-3 rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 text-slate-950 text-[14px] font-semibold"
                  >
                    Get started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <div id="top" />

      {/* ── HERO ── */}
      <section className="relative z-10 pt-40 pb-20 px-6 flex flex-col items-center text-center">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 mb-10 backdrop-blur-sm"
        >
          <span className="relative flex w-1.5 h-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 animate-ping" />
            <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-amber-400" />
          </span>
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.32em] text-amber-300/90">
            Introducing Scholara · The Intelligent School OS
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          className="font-display font-semibold mb-7 max-w-[18ch] text-balance"
          style={{
            fontSize: 'clamp(3.25rem, 9.5vw, 8rem)',
            lineHeight: 0.95,
            letterSpacing: '-0.045em',
          }}
        >
          <span className="block text-white">School</span>
          <span className="block bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 bg-clip-text text-transparent">
            Management
          </span>
          <span className="block bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 bg-clip-text text-transparent">
            System<span className="font-serif italic font-normal text-amber-400">.</span>
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-white/65 max-w-[46ch] mb-14 text-pretty"
          style={{
            fontSize: 'clamp(1.0625rem, 1.6vw, 1.25rem)',
            lineHeight: 1.65,
            letterSpacing: '-0.005em',
            fontWeight: 400,
          }}
        >
          The complete operating system for modern schools — admissions, fees, attendance, and
          academics, <span className="text-white/85 font-medium">unified by AI</span> in a single, calm interface.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 mb-7"
        >
          <Link
            to="/login"
            className="group px-8 py-4 bg-gradient-to-b from-amber-400 to-amber-600 text-slate-950 rounded-2xl font-semibold tracking-tight text-[15px] shadow-[0_18px_50px_-12px_rgba(245,158,11,0.55)] hover:-translate-y-0.5 hover:shadow-[0_22px_60px_-10px_rgba(245,158,11,0.7)] transition-all active:scale-[0.98] inline-flex items-center justify-center gap-2"
          >
            Start free trial
            <ChevronRight size={17} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href="#ai"
            className="group px-8 py-4 bg-white/[0.04] border border-white/10 backdrop-blur-md text-white/85 rounded-2xl font-medium tracking-tight text-[15px] hover:bg-white/[0.08] hover:text-white transition-all inline-flex items-center justify-center gap-2"
          >
            <PlayCircle size={17} className="text-amber-400" />
            Watch AI demo
          </a>
        </motion.div>

        {/* Trust row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2.5 mb-20 text-[13px] text-white/45 font-normal"
        >
          <span className="inline-flex items-center gap-1.5"><Check size={13} strokeWidth={2.5} className="text-emerald-400" /> 30-day free trial</span>
          <span className="hidden sm:inline w-1 h-1 rounded-full bg-white/20" />
          <span className="inline-flex items-center gap-1.5"><Check size={13} strokeWidth={2.5} className="text-emerald-400" /> No credit card required</span>
          <span className="hidden sm:inline w-1 h-1 rounded-full bg-white/20" />
          <span className="inline-flex items-center gap-1.5"><Check size={13} strokeWidth={2.5} className="text-emerald-400" /> Bilingual by design</span>
        </motion.div>

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.23, 1, 0.32, 1] }}
          className="w-full max-w-5xl"
        >
          <div className="p-px rounded-[2rem] bg-gradient-to-br from-white/10 via-white/5 to-amber-500/10 shadow-[0_60px_120px_-20px_rgba(0,0,0,0.9)]">
            <div className="bg-[#0d1525] rounded-[2rem] overflow-hidden">
              {/* Browser bar */}
              <div className="bg-white/[0.03] border-b border-white/5 px-5 py-3 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <div className="flex-1 bg-white/5 rounded-md py-1.5 px-4 text-center text-[10px] text-white/20">
                  app.scholara.com/dashboard
                </div>
              </div>

              {/* Dashboard mockup */}
              <div className="flex h-[280px] md:h-[340px]">
                {/* Sidebar */}
                <div className="w-14 bg-white/[0.015] border-r border-white/5 flex flex-col items-center py-4 gap-3 flex-shrink-0">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                    <GraduationCap size={15} className="text-slate-900" />
                  </div>
                  {[BarChart3, Users, CreditCard, CalendarCheck].map((Icon, i) => (
                    <div key={i} className={`w-7 h-7 rounded-lg flex items-center justify-center ${i === 0 ? 'bg-amber-500/15' : 'bg-white/5'}`}>
                      <Icon size={13} className={i === 0 ? 'text-amber-400' : 'text-white/30'} />
                    </div>
                  ))}
                </div>

                {/* Main content */}
                <div className="flex-1 p-5 overflow-hidden">
                  <p className="text-xs font-black text-white/60 mb-4">Good Morning, Principal Ahmed 👋</p>
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { val: '1,247', lbl: 'Students', c: 'text-amber-400' },
                      { val: '94%',   lbl: 'Present',  c: 'text-emerald-400' },
                      { val: '₨19.4L',lbl: 'Fees',     c: 'text-blue-400' },
                    ].map(s => (
                      <div key={s.lbl} className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
                        <p className={`text-base font-black ${s.c}`}>{s.val}</p>
                        <p className="text-[9px] text-white/30 mt-0.5">{s.lbl}</p>
                      </div>
                    ))}
                  </div>
                  {/* Chart bars */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 flex items-end gap-2 h-[100px] md:h-[130px]">
                    {[40, 65, 50, 80, 60, 90, 70, 55, 75, 85].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm rounded-t-md"
                        style={{
                          height: `${h}%`,
                          background: i === 9 ? 'rgba(245,158,11,0.85)' : 'rgba(245,158,11,0.3)',
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* AI panel */}
                <div className="w-[160px] md:w-[200px] bg-[#0a1020] border-l border-amber-500/15 flex flex-col flex-shrink-0">
                  <div className="px-4 py-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <Sparkles size={12} className="text-amber-400" />
                      <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">AI Assistant</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[9px] text-white/30">Online</span>
                    </div>
                  </div>
                  <div className="flex-1 px-3 py-3 flex flex-col gap-2 overflow-hidden">
                    <div className="bg-amber-500/10 border border-amber-500/15 rounded-lg p-2 text-[9px] text-white/60">
                      Add Sara Khan to Class 9A
                    </div>
                    <div className="bg-white/[0.03] border border-white/5 rounded-lg p-2 text-[9px] text-emerald-400">
                      ✓ Done! Sara added, Roll# 49
                    </div>
                    <div className="bg-amber-500/10 border border-amber-500/15 rounded-lg p-2 text-[9px] text-white/60">
                      Show fee defaulters
                    </div>
                    <div className="bg-white/[0.03] border border-white/5 rounded-lg p-2 text-[9px] text-white/50">
                      183 pending. <span className="text-emerald-400">Send SMS?</span>
                    </div>
                  </div>
                  <div className="px-3 pb-3">
                    <div className="bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-[9px] text-white/20">
                      Type command... ✨
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust strip */}
              <div className="border-t border-white/5 px-6 py-4 flex items-center justify-center">
                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/8 rounded-2xl px-6 py-3">
                  <div className="flex -space-x-2">
                    {['MA', 'SK', 'IH', 'AR'].map((i, idx) => (
                      <div key={idx} className="w-7 h-7 rounded-full bg-slate-800 border-2 border-amber-500 flex items-center justify-center text-[8px] text-white font-black">{i}</div>
                    ))}
                  </div>
                  <p className="text-[11px] font-black text-white/80">
                    Trusted by <span className="text-amber-400">500+</span> Elite Schools in Pakistan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="relative z-10 py-16 bg-black/25 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-0">
          {STATS.map((s, i) => (
            <div key={i} className={`text-center px-4 sm:px-8 py-4 md:py-0 ${i < 3 ? 'md:border-r md:border-white/5' : ''}`}>
              <p
                className={`${s.color} font-display font-semibold mb-2`}
                style={{ fontSize: 'clamp(2rem, 3vw, 2.75rem)', letterSpacing: '-0.04em', lineHeight: 1 }}
              >
                {s.value}
              </p>
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/40">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="ecosystem" className="relative z-10 py-32 px-6 scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="mb-16"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/[0.08] border border-amber-500/20 mb-6">
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.3em] text-amber-300/90">The Platform</span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="font-display font-semibold text-white mb-6 max-w-[18ch]"
              style={{ fontSize: 'clamp(2.25rem, 5.5vw, 4.5rem)', lineHeight: 0.98, letterSpacing: '-0.04em' }}
            >
              Built for scale.<br />
              <span className="bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 bg-clip-text text-transparent">
                Designed for clarity<span className="font-serif italic font-normal text-amber-400">.</span>
              </span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-white/55 max-w-[54ch] text-pretty"
              style={{ fontSize: 'clamp(1rem, 1.4vw, 1.1875rem)', lineHeight: 1.65, fontWeight: 400 }}
            >
              Every workflow your school runs — admissions, finance, academics, and communication — under one
              cohesive system. From a single campus to a national network.
            </motion.p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="p-8 rounded-[1.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-amber-500/15 hover:-translate-y-1 transition-all group cursor-default"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-7 group-hover:bg-amber-500/15 transition-colors">
                  <f.icon size={20} className="text-amber-400" />
                </div>
                <h3 className="font-display font-semibold text-white mb-3" style={{ fontSize: '1.25rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}>{f.title}</h3>
                <p className="text-white/55 text-[14.5px] leading-[1.65]">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI SECTION ── */}
      <section id="ai" className="relative z-10 py-28 px-6 bg-black/30 border-y border-white/5 scroll-mt-24">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center">

          {/* Left text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/[0.08] border border-amber-500/20 mb-7">
              <Sparkles size={12} className="text-amber-300" />
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.3em] text-amber-300/90">AI Assistant</span>
            </div>
            <h2
              className="font-display font-semibold text-white mb-7"
              style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)', lineHeight: 0.98, letterSpacing: '-0.04em' }}
            >
              Less admin.<br />
              <span className="bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 bg-clip-text text-transparent">
                More <span className="font-serif italic font-normal">teaching</span>.
              </span>
            </h2>
            <p className="text-white/60 text-[17px] leading-[1.7] mb-8 max-w-[52ch]">
              Describe what you need; the assistant takes care of it. Adding students, recording payments,
              marking attendance, sending parent notices — handled with a single instruction.
            </p>
            <div className="space-y-3">
              {[
                'Understands plain Urdu and English',
                'Takes real actions across every module',
                'Always on, always auditable',
              ].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-md bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center flex-shrink-0">
                    <Check className="text-emerald-400" size={11} strokeWidth={2.5} />
                  </div>
                  <span className="text-white/70 text-[14.5px]">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right AI chat demo */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="bg-[#0a1020] border border-amber-500/20 rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
              {/* Chat header */}
              <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3 bg-amber-500/5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                  <Sparkles size={15} className="text-slate-900" />
                </div>
                <div>
                  <p className="text-sm font-black text-white">Scholara AI</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Online · Actions enabled</span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="p-5 space-y-4">
                {AI_CHAT.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl text-xs leading-relaxed whitespace-pre-line font-medium
                        ${msg.role === 'user'
                          ? 'bg-amber-500/15 border border-amber-500/20 text-white/80 rounded-tr-sm'
                          : 'bg-white/5 border border-white/8 text-white/60 rounded-tl-sm'
                        }`}
                    >
                      {msg.role === 'ai' && msg.text.startsWith('✓') && (
                        <span className="text-emerald-400 font-black">{msg.text.split('\n')[0]}</span>
                      )}
                      {msg.role === 'ai' && msg.text.startsWith('✓')
                        ? '\n' + msg.text.split('\n').slice(1).join('\n')
                        : msg.text
                      }
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="px-5 pb-5 flex gap-3">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white/25">
                  Ask anything or give a command...
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0 text-slate-900">→</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="relative z-10 py-28 px-6 scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/[0.08] border border-amber-500/20 mb-6">
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.3em] text-amber-300/90">Pricing</span>
            </div>
            <h2
              className="font-display font-semibold text-white mb-6 mx-auto max-w-[16ch]"
              style={{ fontSize: 'clamp(2.25rem, 5.5vw, 4.5rem)', lineHeight: 0.98, letterSpacing: '-0.04em' }}
            >
              Predictable pricing.<br />
              <span className="bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 bg-clip-text text-transparent">
                Built to <span className="font-serif italic font-normal">scale</span>.
              </span>
            </h2>
            <p className="text-white/55 max-w-[50ch] mx-auto text-[17px] leading-[1.65]">
              Flat monthly billing. No setup fees, no per-student charges, no long-term contracts.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {PRICING.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`relative p-8 rounded-[1.5rem] flex flex-col
                  ${tier.highlight
                    ? 'bg-gradient-to-b from-amber-500/10 to-amber-500/5 border-2 border-amber-500/40 shadow-[0_30px_80px_-20px_rgba(245,158,11,0.3)] md:-translate-y-4'
                    : 'bg-white/[0.02] border border-white/5'}`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-500 text-slate-900 text-[10.5px] font-semibold uppercase tracking-[0.18em]">
                    Most Popular
                  </div>
                )}

                <h3 className="font-display font-semibold text-white mb-1.5" style={{ fontSize: '1.5rem', letterSpacing: '-0.025em' }}>{tier.name}</h3>
                <p className="text-white/45 text-[14px] leading-[1.55] mb-7">{tier.tagline}</p>

                <div className="mb-8">
                  {tier.priceMonthly !== null ? (
                    <div className="flex items-baseline gap-2">
                      <span className="font-display font-semibold text-white" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.25rem)', letterSpacing: '-0.04em', lineHeight: 1 }}>{fmtPkr(tier.priceMonthly)}</span>
                      <span className="text-white/40 text-[14px] font-medium">/ month</span>
                    </div>
                  ) : (
                    <div className="font-display font-semibold text-white" style={{ fontSize: 'clamp(2rem, 3.2vw, 2.5rem)', letterSpacing: '-0.03em' }}>Custom</div>
                  )}
                </div>

                <ul className="flex-1 space-y-3 mb-8">
                  {tier.features.map(f => (
                    <li key={f} className="flex items-start gap-3 text-[14.5px] leading-[1.5] text-white/70">
                      <div className="w-5 h-5 rounded-md bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={11} strokeWidth={2.5} className="text-emerald-400" />
                      </div>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/login"
                  className={`block text-center px-6 py-3.5 rounded-xl font-semibold tracking-tight text-[14px] transition-all active:scale-95
                    ${tier.highlight
                      ? 'bg-gradient-to-b from-amber-400 to-amber-600 text-slate-950 hover:-translate-y-0.5 shadow-lg shadow-amber-500/30'
                      : 'bg-white/[0.04] border border-white/10 text-white/90 hover:bg-white/[0.08] hover:text-white'}`}
                >
                  {tier.cta} →
                </Link>
              </motion.div>
            ))}
          </div>

          <p className="text-center mt-10 text-white/45 text-[14px]">
            Every plan includes a <span className="text-amber-300 font-semibold">30-day free trial</span>. No credit card required.
          </p>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="relative z-10 py-28 px-6 text-center bg-black/20 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 mb-6">
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.3em] text-white/55">Customers</span>
          </div>
          <h2
            className="font-display font-semibold text-white mb-16 mx-auto max-w-[22ch]"
            style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)', lineHeight: 1, letterSpacing: '-0.04em' }}
          >
            Trusted by school <span className="font-serif italic font-normal text-amber-300">leaders</span> across the country.
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/[0.02] border border-white/5 rounded-2xl p-7 text-left hover:border-white/10 transition-colors"
              >
                <div className="flex gap-0.5 mb-5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-white/70 text-[15px] leading-[1.65] mb-6 text-pretty">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-[12px] font-semibold text-white flex-shrink-0`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-white tracking-tight">{t.name}</p>
                    <p className="text-[12px] text-white/40 mt-0.5">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="relative z-10 py-28 px-6 scroll-mt-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 mb-6">
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.3em] text-white/55">FAQ</span>
            </div>
            <h2
              className="font-display font-semibold text-white mb-5"
              style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)', lineHeight: 1, letterSpacing: '-0.04em' }}
            >
              Common questions, <span className="font-serif italic font-normal text-amber-300">clear</span> answers.
            </h2>
            <p className="text-white/55 text-[17px] leading-[1.6] max-w-[48ch] mx-auto">
              The details schools ask about most before moving to Scholara.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((item, i) => {
              const open = openFaq === i;
              return (
                <div
                  key={item.q}
                  className={`rounded-2xl border overflow-hidden transition-colors ${open ? 'bg-white/[0.04] border-amber-500/20' : 'bg-white/[0.02] border-white/5'}`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-[15px] sm:text-base font-medium text-white tracking-tight">{item.q}</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${open ? 'bg-amber-500/15 text-amber-300' : 'bg-white/5 text-white/40'}`}>
                      {open ? <Minus size={14} /> : <Plus size={14} />}
                    </div>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-5 text-white/65 text-[14.5px] leading-[1.7] text-pretty">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="contact" className="relative z-10 py-28 px-6 text-center overflow-hidden scroll-mt-24">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[700px] h-[400px] bg-amber-500/8 blur-[120px] rounded-full" />
        </div>
        <div className="relative max-w-3xl mx-auto">
          <h2
            className="font-display font-semibold text-white mb-6 mx-auto max-w-[16ch]"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', lineHeight: 0.98, letterSpacing: '-0.045em' }}
          >
            Bring your school<br />
            <span className="bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 bg-clip-text text-transparent">
              into the <span className="font-serif italic font-normal">AI era</span>.
            </span>
          </h2>
          <p className="text-white/55 text-[18px] leading-[1.6] mb-12 max-w-[48ch] mx-auto">
            Join 500+ institutions already running on Scholara. Start your 30-day trial today — no credit card, no setup fees.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/login"
              className="group px-8 py-4 bg-gradient-to-b from-amber-400 to-amber-600 text-slate-950 rounded-2xl font-semibold tracking-tight text-[15px] shadow-[0_18px_50px_-12px_rgba(245,158,11,0.55)] hover:-translate-y-0.5 transition-all active:scale-[0.98] inline-flex items-center justify-center gap-2"
            >
              Start free trial <ChevronRight size={17} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 bg-white/[0.04] border border-white/10 text-white/85 rounded-2xl font-medium tracking-tight text-[15px] hover:bg-white/[0.08] hover:text-white transition-all inline-flex items-center justify-center gap-2"
            >
              <Mail size={16} className="text-amber-400" /> Contact us
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-7 gap-y-2.5 text-[13px] text-white/45">
            <a href="https://wa.me/923045491795" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-amber-300 transition-colors">
              <Phone size={13} className="text-amber-400" /> +92 304 549 1795
            </a>
            <span className="hidden sm:inline w-1 h-1 rounded-full bg-white/20" />
            <a href="mailto:mwaqas5491@gmail.com" className="inline-flex items-center gap-1.5 hover:text-amber-300 transition-colors">
              <Mail size={13} className="text-amber-400" /> mwaqas5491@gmail.com
            </a>
            <span className="hidden sm:inline w-1 h-1 rounded-full bg-white/20" />
            <span className="inline-flex items-center gap-1.5"><MapPin size={13} className="text-amber-400" /> Bajaur, Pakistan</span>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 pt-16 pb-10 px-6 border-t border-white/5 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">

            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                  <GraduationCap size={16} className="text-slate-900" />
                </div>
                <span className="font-display font-semibold text-[19px] tracking-[-0.025em] text-white">Scholara</span>
              </div>
              <p className="text-white/45 text-[14px] leading-[1.65] max-w-xs">
                The intelligent school OS. AI-driven management for elite institutions, trusted by 500+ schools.
              </p>
            </div>

            {/* Product */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40 mb-5">Product</p>
              <ul className="space-y-2.5 text-[14px]">
                <li><a href="#ecosystem" className="text-white/65 hover:text-amber-300 transition-colors">Ecosystem</a></li>
                <li><a href="#ai" className="text-white/65 hover:text-amber-300 transition-colors">AI Assistant</a></li>
                <li><a href="#pricing" className="text-white/65 hover:text-amber-300 transition-colors">Pricing</a></li>
                <li><a href="#faq" className="text-white/65 hover:text-amber-300 transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40 mb-5">Company</p>
              <ul className="space-y-2.5 text-[14px]">
                <li><Link to="/about" className="text-white/65 hover:text-amber-300 transition-colors">About</Link></li>
                <li><Link to="/contact" className="text-white/65 hover:text-amber-300 transition-colors">Contact</Link></li>
                <li><Link to="/login" className="text-white/65 hover:text-amber-300 transition-colors">Sign in</Link></li>
                <li><Link to="/signup" className="text-white/65 hover:text-amber-300 transition-colors">Create account</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40 mb-5">Reach Us</p>
              <ul className="space-y-2.5 text-[14px] text-white/65">
                <li><a href="mailto:mwaqas5491@gmail.com" className="flex items-center gap-2 hover:text-amber-300 transition-colors"><Mail size={13} className="text-amber-400" /> mwaqas5491@gmail.com</a></li>
                <li><a href="https://wa.me/923045491795" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-amber-300 transition-colors"><Phone size={13} className="text-amber-400" /> +92 304 549 1795</a></li>
                <li className="flex items-center gap-2"><MapPin size={13} className="text-amber-400" /> Bajaur, Pakistan</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/35 text-[13px] font-normal text-center md:text-left">
              © 2026 Scholara — The intelligent school OS.
            </p>
            <div className="flex items-center gap-7">
              <Link to="/about" className="text-[13px] font-medium tracking-tight text-white/45 hover:text-white transition-colors">About</Link>
              <Link to="/contact" className="text-[13px] font-medium tracking-tight text-white/45 hover:text-white transition-colors">Contact</Link>
              <a href="#faq" className="text-[13px] font-medium tracking-tight text-white/45 hover:text-white transition-colors">FAQ</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
