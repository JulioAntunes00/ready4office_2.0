"use client";

import React from 'react';

const Input = ({ 
  label, 
  type = 'text', 
  placeholder = '', 
  value, 
  onChange, 
  className = '', 
  error = '',
  required = false,
  disabled = false,
  ...props 
}) => {
  const baseClasses = 'w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300';
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : '';

  const classes = `${baseClasses} ${disabledClasses} ${errorClasses} ${className}`;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={classes}
        disabled={disabled}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export const TextArea = ({ 
  label, 
  placeholder = '', 
  value, 
  onChange, 
  className = '', 
  error = '',
  required = false,
  disabled = false,
  rows = 4,
  ...props 
}) => {
  const baseClasses = 'w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 resize-none';
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : '';

  const classes = `${baseClasses} ${disabledClasses} ${errorClasses} ${className}`;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={classes}
        disabled={disabled}
        rows={rows}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Input;
