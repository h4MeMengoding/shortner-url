import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-100 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <input
            className={cn(
              'flex h-11 w-full rounded-lg border px-3 py-2 text-sm',
              'bg-navy-800 border-gray-700 text-gray-100 placeholder:text-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              'disabled:cursor-not-allowed disabled:opacity-50',
              icon && 'pl-10',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
