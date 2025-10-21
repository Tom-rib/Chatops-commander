import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  padding = true,
}) => {
  return (
    <div
      className={`
        bg-slate-gray rounded-lg border border-gray-700
        ${padding ? 'p-6' : ''}
        ${hover ? 'hover:border-cyber-cyan hover:shadow-cyber transition-all duration-200 cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;