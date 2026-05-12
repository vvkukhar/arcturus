'use client';

import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  allow: boolean;
};

export function RoleGate({ children, allow }: Props) {
  if (!allow) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-900/50 p-6 text-sm text-red-700 dark:text-red-400">
        Access denied
      </div>
    );
  }

  return <>{children}</>;
}