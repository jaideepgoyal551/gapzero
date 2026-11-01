import React from 'react';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'outline';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  const variantStyles = {
    default: 'bg-navy-100 text-navy-800 border-navy-300',
    success: 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60',
    warning: 'bg-amber-950/40 text-amber-300 border-amber-800/60',
    danger: 'bg-rose-950/40 text-rose-300 border-rose-800/60',
    info: 'bg-blue-950/40 text-blue-300 border-blue-800/60',
    purple: 'bg-brand-50 text-brand-400 border-brand-300/60',
    outline: 'bg-transparent text-navy-700 border-navy-300',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
