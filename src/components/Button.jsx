// This file is a simple button component that can be used in the project.

// A separate Button component is created to make the code more readable and reusable.
import PropTypes from 'prop-types';

function Button({
    children,
    type = 'button',
    bgColor = 'bg-primary',
    textColor = 'text-primary-foreground',
    className = '',
    ...props
}){
    return(
        <button className={`px-4 py-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${bgColor} ${textColor} ${className}`} {...props}>
            {children}
        </button>
    )
}

Button.propTypes = {
    children: PropTypes.node.isRequired,
    type: PropTypes.string,
    bgColor: PropTypes.string,
    textColor: PropTypes.string,
    className: PropTypes.string,
    // ... add validation for other props if needed
};

export default Button;