import type { TextareaHTMLAttributes } from 'react';

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function Textarea({ label, error, id, className = '', ...props }: Props) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-sans font-medium text-espresso/80">
        {label}
      </label>
      <textarea
        id={inputId}
        {...props}
        className={`w-full bg-warm border border-espresso/20 px-4 py-3 text-sm text-espresso placeholder:text-espresso/40 focus:outline-none focus:border-rose transition-colors resize-none ${error ? 'border-red-400' : ''} ${className}`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
