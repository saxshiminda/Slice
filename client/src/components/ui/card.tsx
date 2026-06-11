import type { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card({ hoverable = false, children, className = '', ...props }: Props) {
  return (
    <div
      {...props}
      className={`bg-cream rounded-sm overflow-hidden ${hoverable ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-xl' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
