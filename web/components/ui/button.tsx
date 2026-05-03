import Link from 'next/link';
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react';
import { cn } from '@/lib/utils';

type CommonProps = {
  variant?: 'default' | 'secondary';
  className?: string;
  children: ReactNode;
};

type NativeButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type LinkButtonProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    href: string;
  };

export function Button(props: NativeButtonProps | LinkButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition hover:opacity-90 disabled:pointer-events-none disabled:opacity-50';

  const styles =
    props.variant === 'secondary'
      ? 'border border-border bg-white text-foreground'
      : 'bg-primary text-white';

  if (props.href !== undefined) {
    const { className, children, href, variant: _variant, ...rest } = props;

    return (
      <Link href={href} className={cn(base, styles, className)} {...rest}>
        {children}
      </Link>
    );
  }

  const { className, children, variant: _variant, type, ...rest } = props;

  return (
    <button
      type={type ?? 'button'}
      className={cn(base, styles, className)}
      {...rest}
    >
      {children}
    </button>
  );
}