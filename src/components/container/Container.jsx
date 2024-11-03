import PropTypes from 'prop-types'

function Container({ children, className = "" }) {
    return (
        <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 ${className}`}>
            {children}
        </div>
    )
}

Container.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
}

Container.defaultProps = {
    className: ""
}

export default Container