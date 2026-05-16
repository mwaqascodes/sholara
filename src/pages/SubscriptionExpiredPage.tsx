import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, Phone, Mail, RefreshCw } from 'lucide-react';

export default function SubscriptionExpiredPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', sans-serif", padding: 24,
    }}>
      {/* Lock Icon */}
      <div style={{ width: 80, height: 80, borderRadius: 24, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
        <Lock size={36} color="#ef4444" />
      </div>

      <h1 style={{ margin: '0 0 12px', fontSize: 36, fontWeight: 900, color: '#fff', textAlign: 'center', letterSpacing: '-0.02em' }}>
        Subscription Expired
      </h1>
      <p style={{ margin: '0 0 32px', fontSize: 16, color: '#94a3b8', textAlign: 'center', maxWidth: 420, lineHeight: 1.7 }}>
        Your Scholara subscription has expired. Your data is safe — renew your plan to regain full access immediately.
      </p>

      {/* Status Card */}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 28, marginBottom: 32, width: '100%', maxWidth: 420 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: 'Plan', value: 'Standard (Expired)' },
            { label: 'Expiry Date', value: 'April 1, 2026' },
            { label: 'Data Status', value: '✓ Fully preserved' },
            { label: 'Grace Period', value: '7 days remaining' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#64748b' }}>{item.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: item.label === 'Data Status' ? '#10b981' : '#e2e8f0' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 420 }}>
        <button
          onClick={() => navigate('/subscription')}
          style={{ padding: '14px 32px', borderRadius: 12, border: 'none', cursor: 'pointer', background: '#f59e0b', color: '#0f172a', fontSize: 15, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          Renew Subscription <ArrowRight size={16} />
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          style={{ padding: '12px 32px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', background: 'transparent', color: '#94a3b8', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <RefreshCw size={14} /> Continue (Limited Access)
        </button>
      </div>

      {/* Contact */}
      <div style={{ marginTop: 40, display: 'flex', gap: 24, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#475569', fontSize: 13 }}>
          <Phone size={14} /> +92 51 1234567
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#475569', fontSize: 13 }}>
          <Mail size={14} /> support@scholara.edu.pk
        </div>
      </div>
      <p style={{ marginTop: 12, fontSize: 11, color: '#334155' }}>Need help? Our team is available Mon–Sat, 9 AM – 6 PM PKT</p>
    </div>
  );
}
