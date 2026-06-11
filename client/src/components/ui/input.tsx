import type { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, id, className = '', ...props }: Props) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-sans font-medium text-espresso/80">
        {label}
      </label>
      <input
        id={inputId}
        {...props}
        className={`w-full bg-warm border border-espresso/20 px-4 py-3 text-sm text-espresso placeholder:text-espresso/40 focus:outline-none focus:border-rose transition-colors ${error ? 'border-red-400' : ''} ${className}`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
