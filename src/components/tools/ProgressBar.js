"use client";

import React from 'react';

const ProgressBar = ({ 
  progress = 0, 
  showPercentage = true, 
  color = 'orange',
  size = 'medium',
  className = '',
  label = ''
}) => {
  const colorClasses = {
    orange: 'bg-orange-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500',
    red: 'bg-red-500'
  };

  const sizeClasses = {
    small: 'h-1',
    medium: 'h-2',
    large: 'h-3'
  };

  const containerClasses = 'w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden';
  const barClasses = `h-full transition-all duration-300 ease-out ${colorClasses[color]} ${sizeClasses[size]}`;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>{label}</span>
          {showPercentage && <span>{progress}%</span>}
        </div>
      )}
      <div className={containerClasses}>
        <div 
          className={barClasses}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
