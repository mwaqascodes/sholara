import { useState } from 'react';
import { TrendingUp, Users, DollarSign, Award, ArrowUpRight, ArrowDownRight, Calendar, BarChart3, PieChart as PieChartIcon, Zap, Target, Activity } from 'lucide-react';
import { C, PageHeader, StatCard, Badge, Btn, Select } from '@/lib/design-system';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip as ChartTooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { attendanceChartData, feeChartData } from '@/lib/demo-data';

export default function AnalyticsPage() {
  const [range, setRange] = useState('Last 30 Days');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PageHeader title="Intelligence & Analytics" sub="Deep-dive metrics and predictive insights for institutional performance optimization.">
        <div style={{ display: 'flex', gap: 10 }}>
            <Select value={range} onChange={(e: any) => setRange(e.target.value)} style={{ width: 160 }}>
                {['Today', 'Last 7 Days', 'Last 30 Days', 'This Term', 'This Year'].map(r => <option key={r} value={r}>{r}</option>)}
            </Select>
            <Btn variant="primary" icon={BarChart3}>Export Intelligence</Btn>
        </div>
      </PageHeader>

      {/* Primary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        <StatCard label="Enrollment Velocity" value="+12.4%" icon={Users} color="#3b82f6" trend={{ type:'up', val: 'Target: 15%' }} />
        <StatCard label="Revenue Realization" value="88.2%" icon={DollarSign} color="#22c55e" trend={{ type:'up', val: '+2.1%' }} />
        <StatCard label="Academic Engagement" value="92.4%" icon={Activity} color="#f59e0b" trend={{ type:'down', val: '-0.8%' }} />
        <StatCard label="Institution Rating" value="4.8/5" icon={Award} color="#a855f7" sub="Market Leader" />
      </div>

      {/* Main Insights Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20 }}>
          {/* Attendance Analytics */}
          <div style={{ ...C.glass, padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#1e293b' }}>Attendance Dynamics</h3>
                    <p style={{ margin: 0, fontSize: 11, color: C.sub }}>Year-to-date participation variance</p>
                  </div>
                  <Badge label="High Precision" variant="success" />
              </div>
              <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={attendanceChartData}>
                      <defs>
                          <linearGradient id="colorPres" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                          </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="date" tick={{ fill: C.muted, fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: C.muted, fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <ChartTooltip contentStyle={{ background: '#0a0f1e', border: `1px solid ${C.border}`, borderRadius: 12, color: '#1e293b' }} />
                      <Area type="monotone" dataKey="present" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorPres)" dot={{ fill: '#22c55e', r: 4 }} />
                  </AreaChart>
              </ResponsiveContainer>
          </div>

          {/* Revenue Analytics */}
          <div style={{ ...C.glass, padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#1e293b' }}>Revenue Liquidity</h3>
                    <p style={{ margin: 0, fontSize: 11, color: C.sub }}>Collected vs. Outstanding liabilities</p>
                  </div>
                  <Btn variant="secondary" style={{ padding: '4px 10px', fontSize: 11 }}>Details</Btn>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={feeChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: C.muted, fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false}/>
                      <YAxis tick={{ fill: C.muted, fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false}/>
                      <ChartTooltip contentStyle={{ background: '#0a0f1e', border: `1px solid ${C.border}`, borderRadius: 12, color: '#1e293b' }} />
                      <Bar dataKey="collected" fill="#22c55e" radius={[6, 6, 0, 0]} barSize={24} />
                      <Bar dataKey="pending" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={24} />
                  </BarChart>
              </ResponsiveContainer>
          </div>
      </div>

      {/* Cohort Performance Hierarchy */}
      <div style={{ ...C.glass, padding: 24, background: 'rgba(255,255,255,0.015)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(168,85,247,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Target size={20} color="#a855f7" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#1e293b' }}>Academic Excellence Leaderboard</h3>
                <p style={{ margin: 0, fontSize: 12, color: C.sub }}>Inter-class competitive metrics and GPA benchmarks</p>
              </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12 }}>
              {[
                  { class: 'Grade 10-A (Science)', score: 94, gpa: 3.88, trend: 4.2 },
                  { class: 'Grade 8-C (Linguistics)', score: 88, gpa: 3.65, trend: 2.1 },
                  { class: 'Grade 5-B (Arts)', score: 85, gpa: 3.42, trend: -1.4 },
                  { class: 'Grade 2-A (Foundation)', score: 91, gpa: 3.75, trend: 3.8 },
              ].map(item => (
                  <div key={item.class} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px', background: '#f8fafc', borderRadius: 16, border: `1px solid rgba(255,255,255,0.05)`, transition: 'transform 0.2s', cursor: 'pointer' }}>
                      <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#1e293b' }}>{item.class}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                              <div style={{ flex: 1, height: 6, borderRadius: 10, background: '#f1f5f9' }}>
                                  <div style={{ height: '100%', width: `${item.score}%`, background: `linear-gradient(90deg, ${C.amber}, #f59e0b)`, borderRadius: 10 }} />
                              </div>
                              <span style={{ fontSize: 11, color: C.sub, fontWeight: 700 }}>{item.score}% Efficiency</span>
                          </div>
                      </div>
                      <div style={{ textAlign: 'right', borderLeft: `1px solid ${C.border}`, paddingLeft: 16 }}>
                          <p style={{ margin: 0, fontSize: 15, fontWeight: 900, color: '#1e293b' }}>{item.gpa}</p>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, color: item.trend >= 0 ? '#22c55e' : '#ef4444', fontSize: 10, fontWeight: 800 }}>
                              {item.trend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                              {Math.abs(item.trend).toFixed(1)}%
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      </div>

      {/* Strategic Intelligence Footer */}
      <div style={{ padding: '24px', background: 'rgba(59,130,246,0.05)', borderRadius: 16, border: '1px solid rgba(59,130,246,0.1)', display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={22} color="#3b82f6" />
          </div>
          <div>
              <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#1e293b' }}>Predictive Performance Analysis</h4>
              <p style={{ margin: 0, fontSize: 12, color: C.sub }}>Machine learning models suggest a probable 4% increase in institutional GPA by the end of the next academic cycle based on current trends.</p>
          </div>
      </div>
    </div>
  );
}
