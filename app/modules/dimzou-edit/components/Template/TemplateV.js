import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const TemplateV = React.forwardRef((props, ref) => {
  const {
    className,
    sidebarFirst,
    main,
    sidebarSecond,
    cover,
    sidebarThird,
    ...htmlProps
  } = props;
  return (
    <div
      className={classNames('dz-TemplateV', className)}
      {...htmlProps}
      ref={ref}
    >
      <div className="dz-TemplateV__header">
        <div className="dz-App__cover">{cover}</div>
      </div>
      <div className="dz-App__mainContainer">
        <div className="dz-App__mainWrap">
          <div className="dz-App__sidebarFirst">{sidebarFirst}</div>
          <div className="dz-App__main">{main}</div>
          <div className="dz-App__sidebarSecond">{sidebarSecond}</div>
        </div>
        <div className="dz-App__sidebarThird">{sidebarThird}</div>
      </div>
    </div>
  );
});

TemplateV.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  cover: PropTypes.node,
  main: PropTypes.node,
  sidebarFirst: PropTypes.node,
  sidebarSecond: PropTypes.node,
  sidebarThird: PropTypes.node,
};

export default TemplateV;
