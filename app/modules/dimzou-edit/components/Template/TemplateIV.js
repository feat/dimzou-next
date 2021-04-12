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
      <div className="dz-App__mainContainer">
        <div className="dz-App__sidebarFirst">{sidebarFirst}</div>
        <div className="dz-App__mainWrap">
          {cover}
          <div className="dz-App__main">{main}</div>
        </div>
        <div className="dz-App__sidebarSecond">{sidebarSecond}</div>
      </div>
      <div className="dz-App__sidebarThird">{sidebarThird}</div>
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
