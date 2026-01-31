import React from 'react';

interface IconProps {
  name: string;
  className?: string;
  filled?: boolean;
  size?: number;
  style?: React.CSSProperties;
}

const Icon: React.FC<IconProps> = ({ name, className = '', filled = false, size = 24, style }) => {
  return (
    <span 
      className={`material-symbols-outlined select-none ${className}`}
      style={{
        fontSize: `${size}px`,
        fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0",
        ...style
      }}
    >
      {name}
    </span>
  );
};

export default Icon;