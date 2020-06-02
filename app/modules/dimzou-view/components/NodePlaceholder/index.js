import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

function NodePlaceholder({ title, summary, action, status, ...htmlProps }) {
  return (
    <div className="dz-BookNodePlaceholder" {...htmlProps}>
      <div className="dz-BookNodePlaceholder__inner typo-Article">
        <h1 className="dz-BookNodePlaceholder__title typo-Article__title">{title}</h1>
        <div className="dz-BookNodePlaceholder__summary typo-Article__summary">
          {summary}
        </div>
        {action && (
          <div className="dz-BookNodePlaceholder__action">
            {action}
          </div>
        )}
        {status && (
          <div className="dz-BookNodePlaceholder__action">
            {status}
          </div>
        )}
      </div>
    </div>
  );
}

NodePlaceholder.propTypes = {
  title: PropTypes.node,
  summary: PropTypes.node,
  action: PropTypes.node,
  status: PropTypes.node,
};

export default NodePlaceholder;
