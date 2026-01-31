import React, { useEffect, useState } from 'react';

interface PageOverlayProps {
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const PageOverlay: React.FC<PageOverlayProps> = ({ children, onClose, className = '' }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300); // Match animation duration
  };

  // Expose a way for children to trigger close animation if needed, 
  // currently we rely on the parent checking isClosing or the child calling a passed callback wrapper.
  // For simplicity in this architecture, we usually pass a wrapped onBack to the child.
  
  return (
    <div 
      className={`absolute inset-0 z-[60] flex flex-col bg-background-light dark:bg-background-dark overflow-hidden shadow-2xl ${
        isClosing ? 'animate-slide-out-right' : 'animate-slide-in-right'
      } ${className}`}
    >
      {/* 
        We clone the children to inject the handleClose method if the child is a component that accepts onBack.
        However, specifically for simple usage, we expect the parent to pass the logic.
        Here we just provide the container and animation frame.
      */}
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          // @ts-ignore - We are enhancing the child with a closing animation handler
          return React.cloneElement(child, { onBack: handleClose });
        }
        return child;
      })}
    </div>
  );
};

export default PageOverlay;