import { motion } from 'framer-motion';
import { Trophy, Star, Medal, Award } from 'lucide-react';

const leaderboard = [
  { rank: 1, name: 'Fatima Zahra', class: 'Class 10', points: 285, academic: 180, sports: 45, discipline: 40, extra: 20 },
  { rank: 2, name: 'Zainab Malik', class: 'Class 10', points: 260, academic: 170, sports: 30, discipline: 35, extra: 25 },
  { rank: 3, name: 'Ali Hassan', class: 'Class 10', points: 240, academic: 160, sports: 40, discipline: 25, extra: 15 },
  { rank: 4, name: 'Ayesha Siddiqui', class: 'Class 9', points: 215, academic: 145, sports: 25, discipline: 30, extra: 15 },
  { rank: 5, name: 'Bilal Ahmed', class: 'Class 7', points: 190, academic: 130, sports: 30, discipline: 20, extra: 10 },
];

const trophyColors = ['#f59e0b', '#94a3b8', '#cd7f32'];

export default function MeritPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold" style={{ color: '#f1f5f9' }}>Merit System</h2>
        <button className="glass-btn-primary flex items-center gap-2 text-sm"><Star className="w-4 h-4" /> Award Points</button>
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
        {[1, 0, 2].map(idx => {
          const s = leaderboard[idx];
          const isFirst = idx === 0;
          return (
            <motion.div key={s.rank} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.15 }}
              className={`glass-card text-center ${isFirst ? 'transform -translate-y-4' : ''}`}>
              <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ background: `${trophyColors[idx]}22` }}>
                <Trophy className="w-6 h-6" style={{ color: trophyColors[idx] }} />
              </div>
              <span className="text-2xl font-bold font-display" style={{ color: trophyColors[idx] }}>#{s.rank}</span>
              <p className="font-semibold text-sm mt-1" style={{ color: '#f1f5f9' }}>{s.name}</p>
              <p className="text-xs" style={{ color: 'rgba(241,245,249,0.4)' }}>{s.class}</p>
              <p className="text-lg font-bold mt-2" style={{ color: '#22c55e' }}>{s.points} pts</p>
            </motion.div>
          );
        })}
      </div>

      {/* Full leaderboard */}
      <div className="glass-card overflow-x-auto">
        <h3 className="font-display font-semibold mb-4" style={{ color: '#f1f5f9' }}>Full Leaderboard</h3>
        <table className="glass-table w-full">
          <thead>
            <tr>
              <th>Rank</th><th>Student</th><th>Class</th>
              <th className="text-center">Academic</th><th className="text-center">Sports</th>
              <th className="text-center">Discipline</th><th className="text-center">Extra</th>
              <th className="text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map(s => (
              <tr key={s.rank}>
                <td className="font-bold" style={{ color: s.rank <= 3 ? trophyColors[s.rank - 1] : '#f1f5f9' }}>
                  {s.rank <= 3 ? ['🥇', '🥈', '🥉'][s.rank - 1] : `#${s.rank}`}
                </td>
                <td className="font-medium">{s.name}</td>
                <td style={{ color: 'rgba(241,245,249,0.5)' }}>{s.class}</td>
                <td className="text-center">{s.academic}</td>
                <td className="text-center">{s.sports}</td>
                <td className="text-center">{s.discipline}</td>
                <td className="text-center">{s.extra}</td>
                <td className="text-center font-bold" style={{ color: '#22c55e' }}>{s.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
