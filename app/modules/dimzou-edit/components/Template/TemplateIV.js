import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const TemplateIV = React.forwardRef((props, ref) => {
  const {
    className,
    cover,
    main,
    sidebarFirst,
    sidebarSecond,
    sidebarThird,
    ...htmlProps
  } = props;
  return (
    <div
      className={classNames('dz-TemplateIV', className)}
      {...htmlProps}
      ref={ref}
    >
      <div className="dz-TemplateIV__mainContainer">
        <div className="dz-TemplateIV__sidebarFirst">{sidebarFirst}</div>
        <div className="dz-TemplateIV__main">
          {cover}
          {main}
        </div>
        <div className="dz-TemplateIV__sidebarSecond">{sidebarSecond}</div>
      </div>
      <div className="dz-TemplateIV__sidebarThird">{sidebarThird}</div>
    </div>
  );
});

TemplateIV.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  cover: PropTypes.node,
  main: PropTypes.node,
  sidebarFirst: PropTypes.node,
  sidebarSecond: PropTypes.node,
  sidebarThird: PropTypes.node,
};

export default TemplateIV;