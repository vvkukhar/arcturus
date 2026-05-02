import { LiveNotificationsPanel } from '@/components/admin/live-notifications-panel';
import { NotificationsCenter } from '@/components/admin/notifications-center';

export default function NotificationsPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <LiveNotificationsPanel />
      <NotificationsCenter />
    </div>
  );
}