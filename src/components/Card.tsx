import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footer?: React.ReactNode;
  footerClassName?: string;
}

export function Card({
  children,
  title,
  subtitle,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footer,
  footerClassName = '',
}: CardProps) {
  return (
    <div className={`bg-white shadow rounded-lg overflow-hidden ${className}`} role="article">
      {(title || subtitle) && (
        <div className={`px-4 py-5 sm:px-6 ${headerClassName}`}>
          {title && <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>}
          {subtitle && <p className="mt-1 max-w-2xl text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      <div className={`px-4 py-5 sm:p-6 ${bodyClassName}`}>{children}</div>
      {footer && (
        <div className={`px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
}

interface CardGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4;
}

const gridCols = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
};

export function CardGrid({ children, className = '', cols = 3 }: CardGridProps) {
  return (
    <div className={`grid gap-6 ${gridCols[cols]} ${className}`} role="grid">
      {children}
    </div>
  );
}
