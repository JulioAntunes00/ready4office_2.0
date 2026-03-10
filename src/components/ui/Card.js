"use client";

import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hover = true,
  padding = 'medium',
  ...props 
}) => {
  const baseClasses = 'bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 transition-all duration-300';
  
  const hoverClasses = hover ? 'hover:shadow-xl dark:hover:shadow-black/50' : '';
  
  const paddingSizes = {
    small: 'p-4',
    medium: 'p-8',
    large: 'p-12',
    none: ''
  };

  const classes = `${baseClasses} ${hoverClasses} ${paddingSizes[padding]} ${className}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`mb-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '', ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`mt-6 ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
