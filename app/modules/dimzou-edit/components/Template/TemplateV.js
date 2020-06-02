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
        <div className="dz-TemplateV__cover">{cover}</div>
      </div>
      <div className="dz-TemplateV__mainContainer">
        <div className="dz-TemplateV__mainWrap">
          <div className="dz-TemplateV__sidebarFirst">{sidebarFirst}</div>
          <div className="dz-TemplateV__main">{main}</div>
          <div className="dz-TemplateV__sidebarSecond">{sidebarSecond}</div>
        </div>
        <div className="dz-TemplateV__sidebarThird">{sidebarThird}</div>
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