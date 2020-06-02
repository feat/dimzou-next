import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Annotation extends Component {
  render() {
    const { entityKey, offsetKey, contentState, children } = this.props;
    const type = contentState.getEntity(entityKey).getType();
    return (
      <span
        data-entity-type={type}
        data-offset-key={offsetKey}
        ref={(node) => { this.dom = node; }}
      >
        {children}
      </span>
    );
  }
}

Annotation.propTypes = {
  children: PropTypes.node,
};

export default Annotation;
