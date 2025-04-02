// src/components/SkillBadge.tsx
import React from 'react';

interface SkillBadgeProps {
  name: string;
  icon?: React.ReactNode;
  level?: number;
  className?: string;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ 
  name, 
  icon, 
  level,
  className = ''
}) => {
  return (
    <div className={`flex items-center bg-gray-100 rounded-full px-4 py-2 text-sm font-medium text-gray-800 ${className}`}>
      {icon && <span className="mr-2">{icon}</span>}
      {name}
      {level && <span className="ml-1 text-gray-500">({level}/5)</span>}
    </div>
  );
};

export default SkillBadge;
