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
      {onPrimary && (
        <Button size="sm" onClick={onPrimary}>
          {primaryLabel}
        </Button>
      )}
      {secondaryLabel && onSecondary && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onSecondary}
        >
          {secondaryLabel}
        </Button>
      )}
    </div>
  );
}