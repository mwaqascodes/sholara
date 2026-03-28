export default function ClassesPage() {
  const classes = [
    { name: '10-A', students: 30, teacher: 'Dr. Sarah Mitchell', subjects: 6 },
    { name: '10-B', students: 28, teacher: 'Mr. David Park', subjects: 6 },
    { name: '9-A', students: 32, teacher: 'Ms. Priya Reddy', subjects: 6 },
    { name: '9-B', students: 29, teacher: 'Ms. Elena Rodriguez', subjects: 6 },
    { name: '11-A', students: 25, teacher: 'Prof. James Wilson', subjects: 7 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Classes</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map(c => (
          <div key={c.name} className="glass-card-hover">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 opacity-80">
              <span className="text-primary-foreground font-bold">{c.name}</span>
            </div>
            <h3 className="font-display font-semibold text-lg mb-2">Class {c.name}</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>👩‍🏫 {c.teacher}</p>
              <p>👨‍🎓 {c.students} students</p>
              <p>📚 {c.subjects} subjects</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
