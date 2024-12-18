import React from 'react';

export function Avatar({ className = '', children, ...props }) {
  return (
    <div className={`relative inline-block rounded-full ${className}`} {...props}>
      {children}
    </div>
  );
}

export function AvatarImage({ src, alt, className = '', ...props }) {
  return (
    <img
      src={src}
      alt={alt}
      className={`w-full h-full object-cover rounded-full ${className}`}
      {...props}
    />
  );
}

export function AvatarFallback({ className = '', children, ...props }) {
  return (
    <div 
      className={`flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
} 