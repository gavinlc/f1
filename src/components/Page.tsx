import type { ReactNode } from 'react';

interface PageProps {
  children: ReactNode;
  className?: string;
}

export function Page({ children, className = '' }: PageProps) {
  return (
    <article className={`container mx-auto px-6 ${className}`}>
      {children}
    </article>
  );
}
