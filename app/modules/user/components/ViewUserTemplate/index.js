import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';

function ViewUserTemplate({ header, sidebar, main }) {
  return (
    <div className="p-ViewUser">
      <div className="p-ViewUser__header">
        {header}
      </div>
      <div className="p-ViewUser__content">
        <div className="p-ViewUser__sidebar">
          {sidebar}
        </div>
        <div className="p-ViewUser__main">
          {main}
        </div>
      </div>
    </div>
  )
}

ViewUserTemplate.propTypes = {
  header: PropTypes.node,
  sidebar: PropTypes.node,
  main: PropTypes.node,
}

export default ViewUserTemplate;