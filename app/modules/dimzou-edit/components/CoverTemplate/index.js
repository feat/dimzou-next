import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './style.scss';

function CoverTemplate(props) {
  const {
    title,
    summary,
    cover,
    extra,
    author,
    copyright,
    className,
    ...domProps
  } = props;
  return (
    <div className={classNames('dz-BundleCover', className)} {...domProps}>
      <div className="dz-BundleCover__inner">
        <div className="dz-BundleCover__cover">{cover}</div>
        <div className="dz-BundleCover__title">{title}</div>
        <div className="dz-BundleCover__summary">{summary}</div>
        <div className="dz-BundleCover__author">{author}</div>
        <div className="dz-BundleCover__copyright">{copyright}</div>
      </div>
      {extra}
    </div>
  );
}

CoverTemplate.propTypes = {
  title: PropTypes.node,
  cover: PropTypes.node,
  summary: PropTypes.node,
  author: PropTypes.node,
  copyright: PropTypes.node,
  extra: PropTypes.node,
};

export default CoverTemplate;
