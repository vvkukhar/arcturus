import { AssignmentTable } from '@/components/admin/assignment-table';
import { CollaborationPanel } from '@/components/admin/collaboration-panel';
import { CollaborativeAssignmentPanel } from '@/components/admin/collaborative-assignment-panel';
import { UserManagement } from '@/components/admin/user-management';

export default function CollaborationPage() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Collaboration Center</h1>
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