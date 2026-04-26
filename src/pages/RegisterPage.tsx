import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ArrowLeft, Check, GraduationCap, School, MapPin, Phone, Mail, User, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const CITIES = ['Lahore', 'Karachi', 'Islamabad', 'Peshawar', 'Quetta', 'Multan', 'Faisalabad', 'Rawalpindi', 'Sialkot', 'Hyderabad'];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    schoolName: '', city: 'Lahore', address: '', phone: '', email: '',
    principalName: '', principalCnic: '', principalPhone: '',
    plan: 'professional',
  });

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    toast.success('School registered! Your 30-day free trial starts now.');
    navigate('/dashboard');
  };

  const steps = [
    { title: 'School', icon: School },
    { title: 'Principal', icon: User },
    { title: 'Plan', icon: Shield },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden app-bg">
      {/* Background Objects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="bg-orb bg-orb-1 opacity-30" />
        <div className="bg-orb bg-orb-2 opacity-20" />
        <div className="bg-orb bg-orb-3 opacity-10" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-xl p-0 relative z-10 overflow-hidden border-white/10 bg-white/[0.03] backdrop-blur-2xl"
      >
        {/* Header Decor */}
        <div className="bg-gradient-to-r from-yellow-400 to-amber-600 h-2 w-full" />
        
        <div className="p-8 sm:p-10">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                <GraduationCap className="w-6 h-6 text-[#0f1b3d]" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">Register Your School</span>
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Step {step} of 3</div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-8">
            {steps.map((s, i) => {
              const active = step >= i + 1;
              return (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                      active ? 'bg-yellow-400 text-[#0f1b3d] shadow-lg shadow-yellow-500/20' : 'bg-white/5 text-white/30 border border-white/10'
                    }`}>
                      {step > i + 1 ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${active ? 'text-yellow-400' : 'text-white/20'}`}>
                      {s.title}
                    </span>
                  </div>
                  {i < 2 && <div className={`flex-1 h-[2px] transition-all duration-500 mb-5 ${step > i + 1 ? 'bg-yellow-400' : 'bg-white/5'}`} />}
                </React.Fragment>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1.5 block ml-1">School Official Name</Label>
                      <div className="relative">
                        <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input value={form.schoolName} onChange={e => update('schoolName', e.target.value)} placeholder="e.g. City Public School" className="glass-input bg-white/5 border-white/10 w-full pl-10 pr-4 py-3 text-sm rounded-xl text-white placeholder:text-white/20 focus:ring-yellow-400/30" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1.5 block ml-1">Select City</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <select value={form.city} onChange={e => update('city', e.target.value)} className="glass-input bg-white/5 border-white/10 w-full pl-10 pr-4 py-3 text-sm rounded-xl text-white appearance-none cursor-pointer">
                          {CITIES.map(c => <option key={c} value={c} className="bg-[#0f1b3d] text-white">{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1.5 block ml-1">Contact Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="042-1234567" className="glass-input bg-white/5 border-white/10 w-full pl-10 pr-4 py-3 text-sm rounded-xl text-white placeholder:text-white/20" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1.5 block ml-1">Primary Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input value={form.email} onChange={e => update('email', e.target.value)} placeholder="office@school.edu.pk" type="email" className="glass-input bg-white/5 border-white/10 w-full pl-10 pr-4 py-3 text-sm rounded-xl text-white placeholder:text-white/20" />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1.5 block ml-1">Principal / Administrator Name</Label>
                    <input value={form.principalName} onChange={e => update('principalName', e.target.value)} placeholder="Full Name" className="glass-input bg-white/5 border-white/10 w-full px-4 py-3 text-sm rounded-xl text-white placeholder:text-white/20" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1.5 block ml-1">CNIC Number</Label>
                      <input value={form.principalCnic} onChange={e => update('principalCnic', e.target.value)} placeholder="35201-XXXXXXX-X" className="glass-input bg-white/5 border-white/10 w-full px-4 py-3 text-sm rounded-xl text-white placeholder:text-white/20" />
                    </div>
                    <div>
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1.5 block ml-1">Personal Phone</Label>
                      <input value={form.principalPhone} onChange={e => update('principalPhone', e.target.value)} placeholder="0300-XXXXXXX" className="glass-input bg-white/5 border-white/10 w-full px-4 py-3 text-sm rounded-xl text-white placeholder:text-white/20" />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40 mb-2">Select Your Operations Plan</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { key: 'basic', name: 'Basic Tier', price: '₨ 2,000', desc: 'Up to 200 students' },
                      { key: 'professional', name: 'Professional Tier', price: '₨ 5,000', desc: 'Up to 800 students + AI Tools' },
                      { key: 'enterprise', name: 'Enterprise', price: '₨ 12,000', desc: 'Unlimited students + Custom Portal' },
                    ].map(p => {
                      const selected = form.plan === p.key;
                      return (
                        <button
                          key={p.key}
                          onClick={() => update('plan', p.key)}
                          className={`group w-full rounded-2xl p-4 flex items-center justify-between text-left transition-all border ${
                            selected 
                              ? 'bg-yellow-400 border-yellow-400 shadow-xl shadow-yellow-500/10' 
                              : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                          }`}
                        >
                          <div>
                            <p className={`font-black uppercase tracking-widest text-xs ${selected ? 'text-[#0f1b3d]' : 'text-white'}`}>{p.name}</p>
                            <p className={`text-[10px] font-medium mt-1 ${selected ? 'text-[#0f1b3d]/60' : 'text-white/40'}`}>{p.desc}</p>
                          </div>
                          <p className={`text-sm font-black ${selected ? 'text-[#0f1b3d]' : 'text-yellow-400'}`}>{p.price}<span className={`text-[10px] font-bold opacity-60`}>/mo</span></p>
                        </button>
                      );
                    })}
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <p className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest flex items-center justify-center gap-2">
                       <Sparkles className="w-3 h-3" /> 30-day premium free trial included
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-10 gap-4">
            {step > 1 ? (
              <button 
                onClick={() => setStep(s => s - 1)} 
                className="h-12 flex-1 rounded-xl bg-white/5 text-white/60 text-xs font-black uppercase tracking-widest border border-white/5 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <button 
                onClick={() => navigate('/')} 
                className="h-12 flex-1 rounded-xl bg-white/5 text-white/30 text-xs font-black uppercase tracking-widest border border-white/5 hover:bg-white/10 hover:text-white transition-all"
              >
                Cancel
              </button>
            )}
            
            {step < 3 ? (
              <button 
                onClick={() => setStep(s => s + 1)} 
                className="h-12 flex-1 rounded-xl bg-yellow-400 text-[#0f1b3d] text-xs font-black uppercase tracking-widest hover:bg-yellow-300 shadow-lg shadow-yellow-500/10 transition-all flex items-center justify-center gap-2"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={handleSubmit} 
                className="h-12 flex-1 rounded-xl bg-yellow-400 text-[#0f1b3d] text-xs font-black uppercase tracking-widest hover:bg-yellow-300 shadow-lg shadow-yellow-500/10 transition-all flex items-center justify-center gap-2 animate-pulse-glow"
              >
                <Sparkles className="w-4 h-4" /> Finalize Setup
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
