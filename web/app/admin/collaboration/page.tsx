import { AssignmentTable } from '@/components/admin/assignment-table';
import { CollaborationPanel } from '@/components/admin/collaboration-panel';
import { CollaborativeAssignmentPanel } from '@/components/admin/collaborativeassignment-panel';
import { UserManagement } from '@/components/admin/user-management';

export default function CollaborationPage() {
  return (
    <div className="space-y-6">
      <div className="text-2xl font-black">Collaboration</div>

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