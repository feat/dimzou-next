import React from 'react';
import PropTypes from 'prop-types';
import Loader from './Loader';

function MaskLoader(props) {
  return (
    <div className="ft-MaskLoader">
      <Loader size={props.loaderSize}>{props.loaderLabel}</Loader>
    </div>
  );
}

MaskLoader.propTypes = {
  loaderSize: PropTypes.string,
  loaderLabel: PropTypes.node,
};

export default MaskLoader;
