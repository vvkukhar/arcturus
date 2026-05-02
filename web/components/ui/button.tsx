import Link from 'next/link';
import { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type CommonProps = {
  variant?: 'default' | 'secondary';
  className?: string;
  children: React.ReactNode;
};

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type LinkProps = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export function Button(props: ButtonProps | LinkProps) {
  const base =
    'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition hover:opacity-90';

  const variant =
    props.variant === 'secondary'
      ? 'bg-white border border-border text-foreground'
      : 'bg-primary text-white';

  if ('href' in props && props.href) {
    const { className, children, href, variant: _variant, ...rest } = props;
    return (
      <Link href={href} className={cn(base, variant, className)} {...rest}>
        {children}
      </Link>
    );
  }

  const { className, children, variant: _variant, ...rest } = props;
  return (
    <button className={cn(base, variant, className)} {...rest}>
      {children}
    </button>
  );
}