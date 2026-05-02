'use client';

import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  allow: boolean;
};

export function RoleGate({ children, allow }: Props) {
  if (!allow) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        Access denied
      </div>
    );
  }

  return <>{children}</>;
}