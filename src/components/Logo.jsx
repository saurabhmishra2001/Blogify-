// Desc: Logo component
import PropTypes from 'prop-types';
import logo from "../assets/logo.png"

function Logo({width = '100px', className = ''}){
    return(
        <img 
            src={logo} 
            alt="Logo Image" 
            width={width} 
            className={`rounded-full animate-mymove ${className}`}
        />
    )
}

Logo.propTypes = {
    width: PropTypes.string,
    className: PropTypes.string
};

export default Logo;