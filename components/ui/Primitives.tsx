import React from 'react';
import { BadgeType } from '../../types';
import { CheckIcon, TildeIcon, XIcon } from './Icons';

// --- Badge ---
interface BadgeProps {
  type: BadgeType;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ type, children, className = '' }) => {
  const styles = {
    leader: 'bg-status-success/20 text-status-success',
    popular: 'bg-brand-blue/20 text-brand-blue',
    rising: 'bg-status-warning/20 text-status-warning',
    custom: 'bg-brand-blueSec/20 text-text-secondary',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide ${styles[type]} ${className}`}>
      {children}
    </span>
  );
};

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  children, 
  ...props 
}) => {
  const base = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-brand-blue hover:bg-brand-blueHover text-white shadow-glow",
    secondary: "bg-bg-elevated hover:bg-bg-hover text-text-primary border border-border",
    ghost: "text-text-muted hover:text-text-primary hover:bg-bg-hover",
    danger: "bg-status-error/10 text-status-error hover:bg-status-error/20"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// --- RatingBar ---
interface RatingBarProps {
  label: string;
  value: number;
  maxValue?: number;
  color?: string; // Hex color override or use variant logic
}

export const RatingBar: React.FC<RatingBarProps> = ({ label, value, maxValue = 5, color }) => {
  const percentage = (value / maxValue) * 100;
  
  // Determine color based on value if no color provided
  const getColor = (val: number) => {
    if (color) return color;
    if (val >= 4.5) return '#448361'; // Success
    if (val >= 3.5) return '#407EC9'; // Blue
    if (val >= 2.5) return '#D9730D'; // Warning
    return '#D44E49'; // Error
  };

  const barColor = getColor(value);

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-1">
        <span className="text-xs font-medium text-text-muted uppercase tracking-wider">{label}</span>
        <span className="text-sm font-bold text-text-primary">{value}</span>
      </div>
      <div className="h-1.5 w-full bg-bg-hover rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: barColor,
            boxShadow: `0 0 10px ${barColor}40` // Glow effect
          }}
        />
      </div>
    </div>
  );
};

// --- FeatureIcon ---
export const FeatureIcon: React.FC<{ status: boolean | 'partial', size?: number }> = ({ status, size = 18 }) => {
  const containerClass = "flex items-center justify-center rounded-full w-6 h-6";
  
  if (status === true) {
    return (
      <div className={`${containerClass} bg-status-success/10`}>
        <CheckIcon className="text-status-success" />
      </div>
    );
  }
  if (status === 'partial') {
    return (
      <div className={`${containerClass} bg-status-warning/10`}>
        <TildeIcon className="text-status-warning" />
      </div>
    );
  }
  return (
    <div className={`${containerClass} bg-bg-hover`}>
      <XIcon className="text-text-muted" />
    </div>
  );
};
