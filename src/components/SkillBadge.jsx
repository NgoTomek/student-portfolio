import React from 'react';

const SkillBadge = ({ name, icon }) => {
  return (
    <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 text-sm font-medium text-gray-800">
      {icon && <span className="mr-2">{icon}</span>}
      {name}
    </div>
  );
};

export default SkillBadge;
