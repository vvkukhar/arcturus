'use client';

import { Button } from '@/components/ui/button';

type Props = {
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
};

export function RowActions({
  primaryLabel = 'Open',
  secondaryLabel,
  onPrimary,
  onSecondary,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button className="px-3 py-2 text-xs" onClick={onPrimary}>
        {primaryLabel}
      </Button>
      {secondaryLabel && onSecondary ? (
        <Button
          variant="secondary"
          className="px-3 py-2 text-xs"
          onClick={onSecondary}
        >
          {secondaryLabel}
        </Button>
      ) : null}
    </div>
  );
}