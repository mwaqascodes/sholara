import { useState } from 'react';
import { Check, Zap, Star, Crown, ArrowRight, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Plan {
  id: 'basic' | 'standard' | 'premium';
  name: string;
  price: number;
  icon: any;
  color: string;
  tagline: string;
  features: string[];
  limits: string;
  recommended?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'basic', name: 'Basic', price: 2000, icon: Zap, color: '#f59e0b',
    tagline: 'Perfect for small schools',
    limits: 'Up to 200 students · 10 teachers',
    features: [
      'Student & Teacher Management',
      'Attendance Tracking',
      'Basic Fee Management',
      'Class & Subject Setup',
      'SMS Notifications (50/mo)',
      'Standard Support',
    ],
  },
  {
    id: 'standard', name: 'Standard', price: 5000, icon: Star, color: '#3b82f6',
    tagline: 'Most popular choice',
    limits: 'Up to 500 students · 30 teachers',
    recommended: true,
    features: [
      'Everything in Basic',
      'Exam & Result Management',
      'PDF Report Cards',
      'Fee Invoices & Receipts',
      'Notice Board & Messages',
      'Admin Reports & Charts',
      'SMS Notifications (200/mo)',
      'Priority Support',
    ],
  },
  {
    id: 'premium', name: 'Premium', price: 10000, icon: Crown, color: '#8b5cf6',
    tagline: 'Full-featured institutional suite',
    limits: 'Unlimited students & teachers',
    features: [
      'Everything in Standard',
      'Multi-Branch Support',
      'Advanced Analytics Dashboard',
      'WhatsApp Integration',
      'Payroll Management',
      'Custom Certificates',
      'API Access',
      'Unlimited SMS',
      'Dedicated Account Manager',
      '24/7 Support',
    ],
  },
];

const CURRENT_PLAN_KEY = 'Scholara_subscription';

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const [billing, setBilling] = useState<'monthly'|'annual'>('monthly');
  const [currentPlan] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CURRENT_PLAN_KEY) || '{}').plan || 'trial'; } catch { return 'trial'; }
  });

  const getPrice = (basePrice: number) => billing === 'annual' ? Math.round(basePrice * 0.8) : basePrice;
  const getSavings = (basePrice: number) => Math.round(basePrice * 0.2 * 12);

  const handleSubscribe = (plan: Plan) => {
    localStorage.setItem(CURRENT_PLAN_KEY, JSON.stringify({
      plan: plan.id, startDate: new Date().toISOString(),
      status: 'active',
    }));
    toast.success(`Subscribed to ${plan.name} plan! Features are now active.`);
    setTimeout(() => navigate('/dashboard'), 1500);
  };

  const handleTrial = () => {
    localStorage.setItem(CURRENT_PLAN_KEY, JSON.stringify({
      plan: 'trial', startDate: new Date().toISOString(),
      trialEndsAt: new Date(Date.now() + 14 * 24 * 3600000).toISOString(),
      status: 'trial',
    }));
    toast.success('14-day free trial started!');
    setTimeout(() => navigate('/dashboard'), 1000);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)', fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ textAlign: 'center', padding: '64px 24px 48px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 20, marginBottom: 20 }}>
          <ShieldCheck size={14} color="#f59e0b" />
          <span style={{ fontSize: 12, fontWeight: 800, color: '#f59e0b', letterSpacing: '0.05em' }}>SCHOLARA SAAS PLANS</span>
        </div>
        <h1 style={{ margin: '0 0 16px', fontSize: 48, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          Simple, transparent<br /><span style={{ color: '#f59e0b' }}>pricing</span>
        </h1>
        <p style={{ margin: '0 auto 32px', fontSize: 18, color: '#94a3b8', maxWidth: 500 }}>
          Start with a 14-day free trial. No credit card required.
        </p>

        {/* Billing toggle */}
        <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 4 }}>
          {['monthly','annual'].map(b => (
            <button key={b} onClick={() => setBilling(b as any)} style={{
              padding: '8px 24px', borderRadius: 10, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 700, transition: 'all 0.2s',
              background: billing === b ? '#f59e0b' : 'transparent',
              color: billing === b ? '#0f172a' : '#94a3b8',
            }}>
              {b === 'monthly' ? 'Monthly' : 'Annual'}
              {b === 'annual' && <span style={{ marginLeft: 6, fontSize: 10, background: '#10b981', color: '#fff', padding: '1px 6px', borderRadius: 10, fontWeight: 800 }}>-20%</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
        {PLANS.map(plan => {
          const PlanIcon = plan.icon;
          const isCurrentPlan = currentPlan === plan.id;
          return (
            <div key={plan.id} style={{
              background: plan.recommended ? 'linear-gradient(135deg, #1e40af, #3b82f6)' : 'rgba(255,255,255,0.04)',
              border: plan.recommended ? '2px solid #60a5fa' : '1px solid rgba(255,255,255,0.08)',
              borderRadius: 24, padding: 32, position: 'relative', overflow: 'hidden',
              transform: plan.recommended ? 'scale(1.03)' : 'none',
              boxShadow: plan.recommended ? '0 20px 60px rgba(59,130,246,0.3)' : 'none',
              display: 'flex', flexDirection: 'column',
            }}>
              {plan.recommended && (
                <div style={{ position: 'absolute', top: 16, right: 16, background: '#f59e0b', color: '#0f172a', fontSize: 10, fontWeight: 900, padding: '4px 12px', borderRadius: 20, letterSpacing: '0.05em' }}>
                  MOST POPULAR
                </div>
              )}
              {isCurrentPlan && (
                <div style={{ position: 'absolute', top: 16, left: 16, background: '#10b981', color: '#fff', fontSize: 10, fontWeight: 900, padding: '4px 12px', borderRadius: 20 }}>
                  CURRENT PLAN
                </div>
              )}

              {/* Icon + Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${plan.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PlanIcon size={22} color={plan.color} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#fff' }}>{plan.name}</h2>
                  <p style={{ margin: 0, fontSize: 12, color: plan.recommended ? '#bfdbfe' : '#64748b' }}>{plan.tagline}</p>
                </div>
              </div>

              {/* Price */}
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 14, color: plan.recommended ? '#bfdbfe' : '#64748b' }}>₨ </span>
                <span style={{ fontSize: 42, fontWeight: 900, color: '#fff' }}>{getPrice(plan.price).toLocaleString()}</span>
                <span style={{ fontSize: 14, color: plan.recommended ? '#bfdbfe' : '#64748b' }}>/month</span>
              </div>
              {billing === 'annual' && (
                <p style={{ margin: '0 0 16px', fontSize: 12, color: '#10b981', fontWeight: 700 }}>
                  Save ₨ {getSavings(plan.price).toLocaleString()} per year!
                </p>
              )}

              <p style={{ margin: '0 0 20px', fontSize: 12, color: plan.recommended ? '#93c5fd' : '#64748b', fontWeight: 600 }}>{plan.limits}</p>

              {/* Features */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, marginBottom: 24 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: plan.recommended ? '#60a5fa30' : `${plan.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Check size={11} color={plan.recommended ? '#60a5fa' : plan.color} strokeWidth={3} />
                    </div>
                    <span style={{ fontSize: 13, color: plan.recommended ? '#e0f2fe' : '#94a3b8' }}>{f}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={() => handleSubscribe(plan)}
                disabled={isCurrentPlan}
                style={{
                  width: '100%', padding: '14px', borderRadius: 12, border: 'none', cursor: isCurrentPlan ? 'default' : 'pointer',
                  fontSize: 14, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  background: isCurrentPlan ? 'rgba(255,255,255,0.05)' : plan.recommended ? '#fff' : plan.color,
                  color: isCurrentPlan ? '#475569' : plan.recommended ? '#1e40af' : '#fff',
                  transition: 'all 0.2s',
                  opacity: isCurrentPlan ? 0.7 : 1,
                }}
              >
                {isCurrentPlan ? 'Current Plan' : `Subscribe to ${plan.name}`}
                {!isCurrentPlan && <ArrowRight size={16} />}
              </button>
            </div>
          );
        })}
      </div>

      {/* Trial CTA */}
      <div style={{ textAlign: 'center', paddingBottom: 80 }}>
        <p style={{ fontSize: 16, color: '#64748b', marginBottom: 16 }}>Not ready to subscribe yet?</p>
        <button
          onClick={handleTrial}
          style={{ padding: '14px 36px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, background: 'transparent', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}
        >
          Start 14-Day Free Trial <ArrowRight size={16} />
        </button>
        <p style={{ fontSize: 12, color: '#475569', marginTop: 10 }}>No credit card required · Cancel anytime</p>
      </div>
    </div>
  );
}
