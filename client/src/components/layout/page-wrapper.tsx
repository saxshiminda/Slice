import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export function PageWrapper({ children, className = '' }: Props) {
  return <main className={`min-h-screen pt-16 lg:pt-20 ${className}`}>{children}</main>;
}
