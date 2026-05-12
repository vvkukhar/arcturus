import { AssignmentTable } from '@/components/admin/assignment-table';
import { CollaborationPanel } from '@/components/admin/collaboration-panel';
import { CollaborativeAssignmentPanel } from '@/components/admin/collaborative-assignment-panel';
import { UserManagement } from '@/components/admin/user-management';

export default function CollaborationPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 hardware-accelerated">
      <div className="bg-[var(--card)] border border-[var(--border)] p-6 md:p-8 rounded-[2rem] shadow-sm">
        <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Collaboration Center</h1>
        <p className="mt-1 text-sm text-slate-500">Manage operators, assign tasks, and track workflow progress.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <UserManagement />
        <CollaborationPanel />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <CollaborativeAssignmentPanel />
        <AssignmentTable />
      </div>
    </div>
  );
}