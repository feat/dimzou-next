import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const TemplateII = React.forwardRef((props, ref) => {
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
      className={classNames('dz-TemplateII', className)}
      {...htmlProps}
      ref={ref}
    >
      <div className="dz-TemplateII__mainContainer">
        <div className="dz-TemplateII__cover">{cover}</div>
        <div className="dz-TemplateII__mainWrap">
          <div className="dz-TemplateII__sidebarFirst">{sidebarFirst}</div>
          <div className="dz-TemplateII__main">{main}</div>
          <div className="dz-TemplateII__sidebarSecond">{sidebarSecond}</div>
        </div>
      </div>
      <div className="dz-TemplateII__sidebarThird">{sidebarThird}</div>
    </div>
  );
});

TemplateII.propTypes = {
  className: PropTypes.string,
  cover: PropTypes.node,
  main: PropTypes.node,
  sidebarFirst: PropTypes.node,
  sidebarSecond: PropTypes.node,
  sidebarThird: PropTypes.node,
};

export default TemplateII;