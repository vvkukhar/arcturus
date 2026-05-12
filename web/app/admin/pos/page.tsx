import { PosTerminal } from '@/components/admin/pos-terminal';

export const metadata = {
  title: 'POS Terminal | Arcturus Admin',
};

export default function PosPage() {
  return (
    <div className="h-[calc(100vh-6rem)] animate-in fade-in duration-500">
      <PosTerminal />
    </div>
  );
}