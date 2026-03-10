"use client";

import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  className = '', 
  onClick, 
  type = 'button',
  href,
  ...props 
}) => {
  const baseClasses = 'font-semibold rounded-2xl transition-all duration-300 shadow-lg';
  
  const variants = {
    primary: 'bg-[#f9884e] text-white hover:bg-[#e0753e] shadow-orange-100 dark:shadow-none',
    secondary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100 dark:shadow-none',
    success: 'bg-green-600 text-white hover:bg-green-700 shadow-green-100 dark:shadow-none',
    purple: 'bg-purple-600 text-white hover:bg-purple-700 shadow-purple-100 dark:shadow-none',
    indigo: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 dark:shadow-none',
    gray: 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed',
    outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
  };
  
  const sizes = {
    small: 'py-2 px-4 text-sm',
    medium: 'py-3 px-6 text-base',
    large: 'py-4 px-8 text-lg',
    full: 'w-full py-3 text-base'
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href && !disabled) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
