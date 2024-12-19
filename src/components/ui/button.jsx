import PropTypes from 'prop-types';

export function Button({ variant = 'default', size = 'default', className = '', children, ...props }) {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90',
    ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent dark:hover:text-accent-foreground',
    icon: 'h-10 w-10',
  };

  const sizes = {
    default: 'h-10 px-4 py-2',
    icon: 'h-10 w-10',
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

Button.propTypes = {
  variant: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
}; 