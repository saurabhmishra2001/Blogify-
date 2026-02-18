import React from 'react';
import PropTypes from 'prop-types';

const Skeleton = ({ className }) => {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-lg ${className}`}
    />
  );
};

Skeleton.propTypes = {
  className: PropTypes.string,
};

Skeleton.defaultProps = {
  className: '',
};

export default Skeleton;
