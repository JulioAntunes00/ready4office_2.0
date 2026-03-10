"use client";

import React from 'react';
import Link from 'next/link';
import Card from '../ui/Card';
import Button from '../ui/Button';

const ToolCard = ({ 
  title, 
  description, 
  icon, 
  href, 
  color = 'primary',
  disabled = false,
  buttonText = 'Abrir'
}) => {
  const colorClasses = {
    primary: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
    secondary: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    success: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    indigo: 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
    gray: 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
  };

  const buttonVariants = {
    primary: 'primary',
    secondary: 'secondary', 
    success: 'success',
    purple: 'purple',
    indigo: 'indigo',
    gray: 'gray'
  };

  return (
    <Card className="flex flex-col items-center text-center opacity-100">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors ${colorClasses[color]}`}>
        {icon}
      </div>
      
      <div className="flex-1 w-full">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {title}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm leading-relaxed">
          {description}
        </p>
      </div>

      {disabled ? (
        <Button 
          variant="gray" 
          size="full"
          disabled
          className="cursor-not-allowed"
        >
          Em breve
        </Button>
      ) : (
        <Link href={href} className="w-full">
          <Button variant={buttonVariants[color]} size="full">
            {buttonText}
          </Button>
        </Link>
      )}
    </Card>
  );
};

export default ToolCard;
