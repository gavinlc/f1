import type { ReactNode } from 'react';

interface PageProps {
  children: ReactNode;
  className?: string;
}

export function Page({ children, className = '' }: PageProps) {
  return (
    <div className={`container mx-auto px-6 ${className}`}>{children}</div>
  );
}
