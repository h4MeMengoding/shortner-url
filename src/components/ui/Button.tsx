import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-navy-700 hover:bg-navy-600 text-gray-100',
      outline: 'border border-gray-700 hover:bg-navy-800 text-gray-100',
      ghost: 'hover:bg-navy-800 text-gray-100',
      danger: 'bg-red-600 hover:bg-red-700 text-white',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-navy-950',
          'active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
