import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const TemplateI = React.forwardRef((props, ref) => {
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
      className={classNames('dz-TemplateI', className)}
      {...htmlProps}
      ref={ref}
    >
      <div className="dz-TemplateI__sidebarFirst">{sidebarFirst}</div>
      <div className="dz-TemplateI__mainContainer">
        <div className="dz-TemplateI__cover">{cover}</div>
        <div className="dz-TemplateI__mainWrap">
          <div className="dz-TemplateI__main">{main}</div>
          <div className="dz-TemplateI__sidebarSecond">{sidebarSecond}</div>
          <div className="dz-TemplateI__sidebarThird">{sidebarThird}</div>
        </div>
      </div>
    </div>
  );
})

TemplateI.propTypes = {
  className: PropTypes.string,
  cover: PropTypes.node,
  main: PropTypes.node,
  sidebarFirst: PropTypes.node,
  sidebarSecond: PropTypes.node,
  sidebarThird: PropTypes.node,
};

export default TemplateI;