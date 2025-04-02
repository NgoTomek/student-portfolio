import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  animate?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  borderRadius = '0.25rem',
  animate = true,
}) => {
  const style: React.CSSProperties = {
    width: width,
    height: height,
    borderRadius,
  };

  return (
    <div
      className={`bg-gray-200 ${animate ? 'animate-pulse' : ''} ${className}`}
      style={style}
      aria-hidden="true"
    ></div>
  );
};

interface SkeletonTextProps {
  lines?: number;
  className?: string;
  lineHeight?: string | number;
  spacing?: string | number;
  lastLineWidth?: string | number;
  animate?: boolean;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 3,
  className = '',
  lineHeight = '1rem',
  spacing = '0.5rem',
  lastLineWidth = '75%',
  animate = true,
}) => {
  return (
    <div className={`space-y-${typeof spacing === 'string' ? spacing : `[${spacing}]`} ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 && lastLineWidth ? lastLineWidth : '100%'}
          height={lineHeight}
          animate={animate}
        />
      ))}
    </div>
  );
};

interface SkeletonCircleProps {
  size?: string | number;
  className?: string;
  animate?: boolean;
}

export const SkeletonCircle: React.FC<SkeletonCircleProps> = ({
  size = '3rem',
  className = '',
  animate = true,
}) => {
  return (
    <Skeleton
      width={size}
      height={size}
      borderRadius="50%"
      className={className}
      animate={animate}
    />
  );
};

interface SkeletonAvatarProps {
  size?: string | number;
  className?: string;
  animate?: boolean;
}

export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({
  size = '3rem',
  className = '',
  animate = true,
}) => {
  return <SkeletonCircle size={size} className={className} animate={animate} />;
};

interface SkeletonCardProps {
  className?: string;
  height?: string | number;
  hasImage?: boolean;
  imageHeight?: string | number;
  hasAction?: boolean;
  lines?: number;
  animate?: boolean;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  className = '',
  height,
  hasImage = true,
  imageHeight = '12rem',
  hasAction = true,
  lines = 3,
  animate = true,
}) => {
  return (
    <div
      className={`overflow-hidden rounded-lg border border-gray-200 bg-white ${className}`}
      style={{ height }}
    >
      {hasImage && (
        <Skeleton
          width="100%"
          height={imageHeight}
          borderRadius="0"
          animate={animate}
        />
      )}
      <div className="p-4 space-y-4">
        <Skeleton width="60%" height="1.5rem" animate={animate} />
        <SkeletonText
          lines={lines}
          lineHeight="0.875rem"
          spacing="0.75rem"
          animate={animate}
        />
        {hasAction && (
          <div className="pt-2">
            <Skeleton width="8rem" height="2rem" animate={animate} />
          </div>
        )}
      </div>
    </div>
  );
};

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
  animate?: boolean;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 5,
  columns = 4,
  className = '',
  animate = true,
}) => {
  return (
    <div className={`overflow-hidden rounded-lg border border-gray-200 ${className}`}>
      <div className="divide-y divide-gray-200">
        {/* Header */}
        <div className="bg-gray-50 px-4 py-3 grid grid-cols-12 gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton
              key={`header-${i}`}
              className={`col-span-${Math.max(1, Math.floor(12 / columns))}`}
              height="1.5rem"
              animate={animate}
            />
          ))}
        </div>
        
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="px-4 py-4 grid grid-cols-12 gap-4"
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton
                key={`cell-${rowIndex}-${colIndex}`}
                className={`col-span-${Math.max(1, Math.floor(12 / columns))}`}
                height="1.25rem"
                animate={animate}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
