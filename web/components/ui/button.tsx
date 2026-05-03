import Link from 'next/link';
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react';
import { cn } from '@/lib/utils';

type CommonProps = {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
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
    'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

  const sizeStyles = {
    default: 'px-5 py-2.5 text-sm',
    sm: 'px-3 py-2 text-xs',
    lg: 'px-6 py-3 text-base',
  };

  const variantStyles = {
    default: 'bg-slate-900 text-white hover:bg-slate-800 shadow-md hover:shadow-lg',
    secondary: 'bg-white text-slate-900 border border-border hover:bg-slate-50 hover:border-slate-300 shadow-sm',
    outline: 'border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900',
  };

  const { variant = 'default', size = 'default' } = props;
  const combinedClassName = cn(base, sizeStyles[size], variantStyles[variant], props.className);

  if (props.href !== undefined) {
    const { className, children, href, variant: _v, size: _s, ...rest } = props;
    return (
      <Link href={href} className={combinedClassName} {...rest}>
        {children}
      </Link>
    );
  }

  const { className, children, variant: _v, size: _s, type, ...rest } = props;
  return (
    <button
      type={type ?? 'button'}
      className={combinedClassName}
      {...rest}
    >
      {children}
    </button>
  );
}