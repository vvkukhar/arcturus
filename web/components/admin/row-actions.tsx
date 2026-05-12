'use client';

import { Button } from '@/components/ui/button';

type Props = {
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
};

export function RowActions({
  primaryLabel = 'Open',
  secondaryLabel,
  onPrimaryAction,
  onSecondaryAction,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {onPrimaryAction && (
        <Button size="sm" onClick={onPrimaryAction}>
          {primaryLabel}
        </Button>
      )}
      {secondaryLabel && onSecondaryAction && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onSecondaryAction}
        >
          {secondaryLabel}
        </Button>
      )}
    </div>
  );
}