import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

type CommonProps = {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  children: ReactNode;
};

type NativeButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: undefined;
};

type LinkButtonProps = CommonProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
};

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, NativeButtonProps | LinkButtonProps>((props, ref) => {
  const base = 'inline-flex items-center justify-center rounded-xl font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] origin-center transform-gpu will-change-transform cursor-pointer';

  const sizeStyles = {
    default: 'px-5 py-2.5 text-sm',
    sm: 'px-4 py-2 text-xs',
    lg: 'px-8 py-3.5 text-base',
  };

  const variantStyles = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20 border border-transparent',
    secondary: 'bg-slate-900 text-white hover:bg-black dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 shadow-md shadow-slate-900/20 border border-transparent',
    outline: 'border-2 border-[var(--border)] bg-transparent text-[var(--foreground)] hover:border-slate-400 hover:bg-[var(--background)]',
    ghost: 'bg-transparent text-slate-500 hover:bg-[var(--background)] hover:text-[var(--foreground)] border border-transparent shadow-none',
  };

  const { variant = 'default', size = 'default' } = props;
  const combinedClassName = cn(base, sizeStyles[size], variantStyles[variant], props.className);

  if (props.href !== undefined) {
    const { className, children, href, variant: _v, size: _s, ...rest } = props as LinkButtonProps;
    return (
      <Link href={href} className={combinedClassName} ref={ref as any} {...rest}>
        {children}
      </Link>
    );
  }

  const { className, children, variant: _v, size: _s, type, ...rest } = props as NativeButtonProps;
  return (
    <button type={type ?? 'button'} className={combinedClassName} ref={ref as any} {...rest}>
      {children}
    </button>
  );
});

Button.displayName = 'Button';