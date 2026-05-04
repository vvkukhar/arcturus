import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

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

export function Button(props: NativeButtonProps | LinkButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-xl font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] origin-center transform-gpu will-change-transform';

  const sizeStyles = {
    default: 'px-5 py-2.5 text-sm',
    sm: 'px-4 py-2 text-xs',
    lg: 'px-8 py-3.5 text-base',
  };

  const variantStyles = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20',
    secondary: 'bg-slate-900 text-white hover:bg-black shadow-md shadow-slate-900/20',
    outline: 'border-2 border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  };

  const { variant = 'default', size = 'default' } = props;
  const combinedClassName = cn(base, sizeStyles[size], variantStyles[variant], props.className);

  if (props.href !== undefined) {
    const { className, children, href, variant: _v, size: _s, ...rest } = props as LinkButtonProps;
    return (
      <Link href={href} className={combinedClassName} {...rest}>
        {children}
      </Link>
    );
  }

  const { className, children, variant: _v, size: _s, type, ...rest } = props as NativeButtonProps;
  return (
    <button type={type ?? 'button'} className={combinedClassName} {...rest}>
      {children}
    </button>
  );
}