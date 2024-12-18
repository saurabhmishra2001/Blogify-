import React, { useState, useRef, useEffect } from 'react';

export function DropdownMenu({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      {React.Children.map(children, child => {
        if (child.type === DropdownMenuTrigger) {
          return React.cloneElement(child, { onClick: () => setIsOpen(!isOpen) });
        }
        if (child.type === DropdownMenuContent) {
          return isOpen ? child : null;
        }
        return child;
      })}
    </div>
  );
}

export function DropdownMenuTrigger({ children, asChild, ...props }) {
  if (asChild) {
    return React.cloneElement(children, props);
  }
  return <button {...props}>{children}</button>;
}

export function DropdownMenuContent({ children, align = 'end', className = '', ...props }) {
  return (
    <div 
      className={`absolute ${align === 'end' ? 'right-0' : 'left-0'} mt-2 w-56 rounded-md bg-background border shadow-lg dark:bg-popover dark:border-border focus:outline-none ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({ children, className = '', ...props }) {
  return (
    <div 
      className={`px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuLabel({ children, className = '', ...props }) {
  return (
    <div 
      className={`px-4 py-2 text-sm font-semibold text-foreground ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuSeparator() {
  return <div className="border-t border-border my-1" />;
} 