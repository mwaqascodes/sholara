import { notifications } from '@/lib/demo-data';
import { AlertTriangle, CheckCircle, Calendar, Bell } from 'lucide-react';

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Notifications</h2>

      <div className="space-y-3">
        {notifications.map(n => (
          <div key={n.id} className={`glass-card flex items-start gap-4 ${n.read ? 'opacity-70' : ''}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              n.type === 'warning' ? 'bg-warning/10 text-warning' :
              n.type === 'success' ? 'bg-success/10 text-success' :
              'bg-info/10 text-info'
            }`}>
              {n.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> :
               n.type === 'success' ? <CheckCircle className="w-5 h-5" /> :
               <Bell className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">{n.title}</p>
                <span className="text-xs text-muted-foreground">{n.time}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
            </div>
            {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />}
          </div>
        ))}
      </div>
    </div>
  );
}
