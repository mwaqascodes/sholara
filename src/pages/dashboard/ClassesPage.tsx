import { allClasses } from '@/lib/demo-data';

export default function ClassesPage() {
  const classes = [
    { name: 'Class 1', students: 35, teacher: 'Amna Rashid', subjects: 5 },
    { name: 'Class 2', students: 32, teacher: 'Amna Rashid', subjects: 5 },
    { name: 'Class 3', students: 30, teacher: 'Sara Batool', subjects: 5 },
    { name: 'Class 4', students: 28, teacher: 'Sara Batool', subjects: 6 },
    { name: 'Class 5', students: 33, teacher: 'Muhammad Aslam', subjects: 6 },
    { name: 'Class 6', students: 30, teacher: 'Muhammad Aslam', subjects: 7 },
    { name: 'Class 7', students: 28, teacher: 'Kashif Ali', subjects: 7 },
    { name: 'Class 8', students: 30, teacher: 'Umar Farooq', subjects: 7 },
    { name: 'Class 9', students: 30, teacher: 'Fatima Noor', subjects: 7 },
    { name: 'Class 10', students: 31, teacher: 'Fatima Noor', subjects: 7 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Classes</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {classes.map(c => (
          <div key={c.name} className="card-white-hover">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-4">
              <span className="text-primary-foreground font-bold text-xs">{c.name.replace('Class ', '')}</span>
            </div>
            <h3 className="font-display font-semibold text-lg mb-2">{c.name}</h3>
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
