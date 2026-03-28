import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GraduationCap, Users, BarChart3, Calendar, DollarSign, Shield, BookOpen, Bell, ArrowRight, Star, CheckCircle2, Menu, X } from 'lucide-react';
import { useState } from 'react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const features = [
  { icon: Users, title: 'Student Management', desc: 'Complete student profiles, enrollment tracking, and parent linking.' },
  { icon: Calendar, title: 'Attendance Tracking', desc: 'Daily digital attendance with real-time reports and absence alerts.' },
  { icon: BarChart3, title: 'Results & Grading', desc: 'Automated report cards with GPA calculations and analytics.' },
  { icon: DollarSign, title: 'Fee Management', desc: 'Fee collection, pending tracking, and receipt generation.' },
  { icon: BookOpen, title: 'Timetable Builder', desc: 'Visual schedule creation for classes and teachers.' },
  { icon: Bell, title: 'Notifications', desc: 'Instant alerts for fees, exams, events, and announcements.' },
];

const testimonials = [
  { name: 'Dr. Amara Osei', role: 'Principal, Lincoln Academy', text: 'EduFlow transformed how we manage 1,200+ students. Everything is streamlined.', rating: 5 },
  { name: 'Michael Torres', role: 'IT Director, Sunrise Schools', text: 'The glassmorphism UI is stunning and our staff actually enjoys using the system.', rating: 5 },
  { name: 'Sarah Kim', role: 'Parent', text: 'I can track my child\'s attendance, grades and fees all in one place. Amazing!', rating: 5 },
];

const plans = [
  { name: 'Basic', price: '$29', period: '/month', features: ['Up to 200 students', 'Attendance & Results', 'Fee management', 'Email support'], cta: 'Start Free Trial', popular: false },
  { name: 'Pro', price: '$79', period: '/month', features: ['Up to 1,000 students', 'Everything in Basic', 'Payroll & Expenses', 'Parent portal', 'Priority support'], cta: 'Start Free Trial', popular: true },
  { name: 'Enterprise', price: '$199', period: '/month', features: ['Unlimited students', 'Everything in Pro', 'Multi-school support', 'Custom integrations', 'Dedicated manager'], cta: 'Contact Sales', popular: false },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 glass-strong">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold">EduFlow</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
            <Link to="/login" className="text-sm font-medium text-foreground">Log in</Link>
            <Link to="/login" className="px-4 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
              Start Free Demo
            </Link>
          </div>
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden glass-strong border-t border-border p-4 flex flex-col gap-3">
            <a href="#features" className="text-sm py-2" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#pricing" className="text-sm py-2" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
            <Link to="/login" className="text-sm py-2 font-medium">Log in</Link>
            <Link to="/login" className="px-4 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium text-center">
              Start Free Demo
            </Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6 text-sm font-medium text-muted-foreground">
              <Shield className="w-4 h-4 text-primary" />
              Trusted by 500+ schools worldwide
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6">
              The Modern{' '}
              <span className="gradient-text">School Management</span>{' '}
              Platform
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Streamline academics, administration, and communication — all in one beautiful, intuitive platform built for the future of education.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login"
                className="px-8 py-3.5 rounded-xl gradient-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg shadow-primary/25"
              >
                Start Free Demo <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#features"
                className="px-8 py-3.5 rounded-xl glass text-foreground font-semibold text-lg hover:shadow-lg transition-shadow"
              >
                Explore Features
              </a>
            </div>
          </motion.div>

          {/* Dashboard preview */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 max-w-5xl mx-auto"
          >
            <div className="glass-strong rounded-2xl p-2 shadow-2xl shadow-primary/10">
              <div className="rounded-xl bg-background/80 p-6 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-warning/60" />
                  <div className="w-3 h-3 rounded-full bg-success/60" />
                  <span className="text-xs text-muted-foreground ml-2">EduFlow — Admin Dashboard</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Students', value: '1,247', color: 'from-primary to-secondary' },
                    { label: 'Teachers', value: '68', color: 'from-secondary to-accent' },
                    { label: 'Attendance', value: '94.2%', color: 'from-accent to-primary' },
                    { label: 'Revenue', value: '$48.5K', color: 'from-success to-accent' },
                  ].map(s => (
                    <div key={s.label} className="glass-card p-4">
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                      <p className={`text-2xl font-bold font-display bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>{s.value}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="glass-card p-4 h-32 flex items-center justify-center text-muted-foreground text-sm">
                    📊 Attendance Trends Chart
                  </div>
                  <div className="glass-card p-4 h-32 flex items-center justify-center text-muted-foreground text-sm">
                    📈 Performance Overview
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="font-display text-4xl font-bold mb-4">
              Everything You Need to <span className="gradient-text">Run Your School</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From student enrollment to fee collection, attendance to report cards — we've got it all covered.
            </motion.p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="glass-card-hover group"
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 gradient-bg">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl font-bold text-center mb-16">
            Loved by <span className="gradient-text">Educators Worldwide</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glass-card">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-foreground mb-4">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl font-bold text-center mb-4">
            Simple, <span className="gradient-text">Transparent Pricing</span>
          </h2>
          <p className="text-muted-foreground text-center mb-16 text-lg">Start free, scale as you grow.</p>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((p, i) => (
              <motion.div
                key={p.name}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className={`glass-card relative ${p.popular ? 'ring-2 ring-primary shadow-xl shadow-primary/15' : ''}`}
              >
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full gradient-primary text-primary-foreground text-xs font-semibold">
                    Most Popular
                  </div>
                )}
                <h3 className="font-display text-xl font-bold mb-2">{p.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold font-display">{p.price}</span>
                  <span className="text-muted-foreground">{p.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {p.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/login"
                  className={`block text-center py-2.5 rounded-lg font-semibold text-sm transition-opacity ${
                    p.popular
                      ? 'gradient-primary text-primary-foreground hover:opacity-90'
                      : 'border border-border hover:bg-muted'
                  }`}
                >
                  {p.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-display text-xl font-bold">EduFlow</span>
              </div>
              <p className="text-sm text-muted-foreground">The modern school management platform for the future of education.</p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Demo', 'Updates'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'GDPR'] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="font-semibold text-sm mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map(l => (
                    <li key={l}><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-6 border-t border-border text-center text-sm text-muted-foreground">
            © 2026 EduFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
