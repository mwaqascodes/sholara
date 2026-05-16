import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GraduationCap, Users, BarChart3, Calendar, DollarSign, Shield, BookOpen, Bell, ArrowRight, Star, CheckCircle2, Menu, X, Sparkles, Bot, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import BackgroundOrbs from '@/components/BackgroundOrbs';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const features = [
  { icon: Bot, title: '🤖 AI School Assistant', desc: 'Natural language commands to manage your entire school effortlessly.' },
  { icon: Users, title: '👨‍🎓 Student Management', desc: 'Complete student records with profiles, attendance, and academic history.' },
  { icon: Calendar, title: '📋 Smart Attendance', desc: 'One-click attendance marking with automatic parent alerts.' },
  { icon: DollarSign, title: '💰 Fee Automation', desc: 'Multiple payment methods, auto receipts, and defaulter tracking.' },
  { icon: BarChart3, title: '📝 Exam & Results', desc: 'Auto report cards, rank lists, and performance analytics.' },
  { icon: BookOpen, title: '💼 Payroll System', desc: 'Teacher salaries, payslips, deductions, and bonuses management.' },
];

const testimonials = [
  { name: 'Principal, Model Grammar School', text: "Learnique-Vista reduced our administrative workload by 80%", city: 'Lahore' },
  { name: 'Admin, Knowledge Academy', text: "The AI assistant understands our needs perfectly", city: 'Karachi' },
  { name: 'Manager, City Academy', text: "Fee collection is now 3x faster and more efficient", city: 'Islamabad' },
];

const plans = [
  { name: 'Basic', price: 'PKR 2,000', features: ['200 students', 'Core features', 'Email support', '1 campus'], popular: false },
  { name: 'Professional', price: 'PKR 5,000', features: ['800 students', 'All features + AI', 'WhatsApp alerts', '3 campuses', 'Priority support'], popular: true },
  { name: 'Enterprise', price: 'PKR 12,000', features: ['Unlimited students', 'White-label', 'API access', 'Unlimited campuses', 'Dedicated manager'], popular: false },
];

const faqs = [
  { q: 'Is there a free trial?', a: 'Yes! Every plan includes a 30-day free trial. No credit card required.' },
  { q: 'Does it support multiple languages?', a: 'Absolutely. Full bilingual interface with English and Urdu support.' },
  { q: 'Can I import existing student data?', a: 'Yes, you can import students via Excel/CSV with our bulk import tool.' },
  { q: 'Is it mobile-friendly?', a: 'Yes, Learnique-Vista works perfectly on phones, tablets, and desktops.' },
  { q: 'How does the AI assistant work?', a: 'Just type commands like "Show fee defaulters" and the AI handles it.' },
  { q: 'Can parents access the portal?', a: 'Yes, parents get read-only access to results, attendance, and fees.' },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="app-bg min-h-screen relative">
      <BackgroundOrbs />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass-navbar">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2 relative z-10">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #639922, #4d7a18)' }}>
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-xl font-bold" style={{ color: '#f1f5f9' }}>Learnique<span style={{ color: '#86c94a' }}>-Vista</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Pricing', 'About', 'Contact'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="text-sm transition-colors hover:text-white/80" style={{ color: 'rgba(241,245,249,0.6)' }}>{l}</a>
            ))}
            <Link to="/login" className="text-sm font-medium" style={{ color: '#f1f5f9' }}>Login</Link>
            <Link to="/login" className="glass-btn-primary text-sm">Start Free Trial</Link>
          </div>
          <button className="md:hidden relative z-10" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" style={{ color: '#f1f5f9' }} /> : <Menu className="w-6 h-6" style={{ color: '#f1f5f9' }} />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden glass-card mx-4 mb-4 p-4 flex flex-col gap-3" style={{ borderRadius: 16 }}>
            {['Features', 'Pricing'].map(l => <a key={l} href={`#${l.toLowerCase()}`} className="text-sm py-2" style={{ color: '#f1f5f9' }} onClick={() => setMobileMenuOpen(false)}>{l}</a>)}
            <Link to="/login" className="glass-btn-primary text-center text-sm">Start Free Trial</Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 relative">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-sm font-medium" style={{ background: 'rgba(99,153,34,0.15)', color: '#86c94a', border: '1px solid rgba(99,153,34,0.3)' }}>
              <Sparkles className="w-4 h-4" /> Where Education Meets Intelligence
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6" style={{ color: '#f1f5f9' }}>
              Professional <span style={{ color: '#86c94a' }}>AI-Powered</span> School Management
            </h1>
            <p className="text-lg mb-10 max-w-2xl mx-auto" style={{ color: 'rgba(241,245,249,0.55)' }}>
              Complete school ecosystem — manage students, results, fees, attendance, payroll and more with intelligent automation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login" className="glass-btn-primary px-8 py-3.5 text-lg flex items-center gap-2">
                Start Free 30-Day Trial <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#features" className="glass-btn-secondary px-8 py-3.5 text-lg">Explore Features</a>
            </div>
            <div className="flex items-center justify-center gap-8 mt-10">
              {[{ n: '500+', l: 'Schools' }, { n: '50,000+', l: 'Students' }, { n: '99.9%', l: 'Uptime' }].map(s => (
                <div key={s.l} className="text-center">
                  <p className="text-xl font-bold font-display" style={{ color: '#f1f5f9' }}>{s.n}</p>
                  <p className="text-xs" style={{ color: 'rgba(241,245,249,0.4)' }}>{s.l}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Dashboard preview */}
          <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="mt-16 max-w-5xl mx-auto">
            <div className="glass-card overflow-hidden" style={{ padding: 0 }}>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full" style={{ background: '#ef4444' }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: '#f59e0b' }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: '#22c55e' }} />
                  <span className="text-xs ml-2" style={{ color: 'rgba(241,245,249,0.4)' }}>Learnique-Vista — Admin Dashboard</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[{ l: 'Students', v: '847' }, { l: 'Teachers', v: '42' }, { l: 'Attendance', v: '91.2%' }, { l: 'Revenue', v: '₨ 4.2L' }].map(s => (
                    <div key={s.l} className="glass-card" style={{ padding: '1rem' }}>
                      <p className="text-xs" style={{ color: 'rgba(241,245,249,0.4)' }}>{s.l}</p>
                      <p className="text-2xl font-bold font-display" style={{ color: '#86c94a' }}>{s.v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="font-display text-4xl font-bold mb-4" style={{ color: '#f1f5f9' }}>
              Everything You Need to <span style={{ color: '#86c94a' }}>Run Your School</span>
            </motion.h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glass-card-hover group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: 'rgba(99,153,34,0.15)' }}>
                  <f.icon className="w-6 h-6" style={{ color: '#86c94a' }} />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2" style={{ color: '#f1f5f9' }}>{f.title}</h3>
                <p className="text-sm" style={{ color: 'rgba(241,245,249,0.5)' }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-4xl font-bold mb-16" style={{ color: '#f1f5f9' }}>
            Get Started in <span style={{ color: '#86c94a' }}>3 Simple Steps</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { step: '1', title: 'Register Your School', desc: 'Takes just 2 minutes' },
              { step: '2', title: 'Add Students & Teachers', desc: 'Import from Excel or add manually' },
              { step: '3', title: 'Manage with AI', desc: 'Everything automated intelligently' },
            ].map((s, i) => (
              <motion.div key={s.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} viewport={{ once: true }} className="text-center">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl font-bold" style={{ background: 'rgba(99,153,34,0.15)', color: '#86c94a', border: '1px solid rgba(99,153,34,0.3)' }}>
                  {s.step}
                </div>
                <h3 className="font-display font-semibold mb-1" style={{ color: '#f1f5f9' }}>{s.title}</h3>
                <p className="text-sm" style={{ color: 'rgba(241,245,249,0.45)' }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl font-bold text-center mb-4" style={{ color: '#f1f5f9' }}>
            Simple, <span style={{ color: '#86c94a' }}>Affordable Pricing</span>
          </h2>
          <p className="text-center mb-2 text-sm" style={{ color: 'rgba(241,245,249,0.5)' }}>30-day free trial · No credit card required</p>
          <p className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(99,153,34,0.15)', color: '#86c94a', border: '1px solid rgba(99,153,34,0.3)' }}>Save 20% with annual plan</span>
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((p, i) => (
              <motion.div key={p.name} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className={`glass-card relative ${p.popular ? 'ring-2' : ''}`} style={p.popular ? { borderColor: '#639922', boxShadow: '0 0 40px rgba(99,153,34,0.2)' } : {}}>
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'linear-gradient(135deg, #639922, #4d7a18)', color: 'white' }}>
                    Most Popular
                  </div>
                )}
                <h3 className="font-display text-xl font-bold mb-2" style={{ color: '#f1f5f9' }}>{p.name}</h3>
                <div className="mb-6">
                  <span className="text-3xl font-bold font-display" style={{ color: '#86c94a' }}>{p.price}</span>
                  <span className="text-sm" style={{ color: 'rgba(241,245,249,0.4)' }}>/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {p.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(241,245,249,0.7)' }}>
                      <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: '#86c94a' }} /> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/login" className={`block text-center py-2.5 rounded-xl font-semibold text-sm transition-all ${p.popular ? 'glass-btn-primary w-full' : 'glass-btn-secondary w-full'}`}>
                  Start Free Trial
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl font-bold text-center mb-16" style={{ color: '#f1f5f9' }}>
            Trusted by <span style={{ color: '#86c94a' }}>Schools Across Pakistan</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glass-card">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4" style={{ fill: '#f59e0b', color: '#f59e0b' }} />
                  ))}
                </div>
                <p className="mb-4 text-sm" style={{ color: 'rgba(241,245,249,0.8)' }}>"{t.text}"</p>
                <p className="text-xs font-semibold" style={{ color: '#f1f5f9' }}>{t.name}</p>
                <p className="text-xs" style={{ color: 'rgba(241,245,249,0.4)' }}>{t.city}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="about" className="py-24 relative z-10">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-display text-4xl font-bold text-center mb-12" style={{ color: '#f1f5f9' }}>
            Frequently Asked <span style={{ color: '#86c94a' }}>Questions</span>
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-card cursor-pointer" style={{ padding: 0 }} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className="flex items-center justify-between px-5 py-4">
                  <p className="font-medium text-sm" style={{ color: '#f1f5f9' }}>{faq.q}</p>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} style={{ color: 'rgba(241,245,249,0.4)' }} />
                </div>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm" style={{ color: 'rgba(241,245,249,0.6)' }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 relative z-10" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #639922, #4d7a18)' }}>
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
                <span className="font-display text-xl font-bold" style={{ color: '#f1f5f9' }}>Learnique<span style={{ color: '#86c94a' }}>-Vista</span></span>
              </div>
              <p className="text-sm" style={{ color: 'rgba(241,245,249,0.4)' }}>Professional AI-powered school management platform. Where education meets intelligence.</p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Demo', 'Updates'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Security'] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="font-semibold text-sm mb-3" style={{ color: '#f1f5f9' }}>{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map(l => (
                    <li key={l}><a href="#" className="text-sm transition-colors hover:text-white/60" style={{ color: 'rgba(241,245,249,0.4)' }}>{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-6 text-center text-sm" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(241,245,249,0.35)' }}>
            Made with ❤️ for Education · © 2026 Learnique-Vista
          </div>
        </div>
      </footer>
    </div>
  );
}
