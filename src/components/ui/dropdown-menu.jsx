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
        if (!React.isValidElement(child)) return child;
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

// asChild: if true, clones the single child and passes the onClick to it
export function DropdownMenuTrigger({ children, asChild, onClick, ...props }) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { onClick, ...props });
  }
  return <button onClick={onClick} {...props}>{children}</button>;
}

// forceMount is a Radix UI concept — we just ignore it here
export function DropdownMenuContent({ children, align = 'end', className = '', forceMount, ...props }) {
  return (
    <div
      className={`absolute z-50 ${align === 'end' ? 'right-0' : 'left-0'} mt-2 w-56 rounded-xl bg-background border border-white/10 shadow-2xl backdrop-blur-xl focus:outline-none ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// asChild: if true, renders the child element with merged styles instead of a wrapper div
export function DropdownMenuItem({ children, className = '', asChild, ...props }) {
  const itemClass = `px-3 py-2 text-sm text-foreground hover:bg-white/10 hover:text-white cursor-pointer rounded-md transition-colors ${className}`;
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: `${itemClass} ${children.props.className || ''}`.trim(),
      ...props
    });
  }
  return (
    <div className={itemClass} {...props}>
      {children}
    </div>
  );
}

export function DropdownMenuLabel({ children, className = '', ...props }) {
  return (
    <div
      className={`px-2 py-1.5 text-sm font-semibold text-foreground ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuSeparator() {
  return <div className="border-t border-white/10 my-1" />;
}