import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const TemplateIII = React.forwardRef((props, ref) => {
  const {
    className,
    sidebarFirst,
    titleSection,
    content,
    sidebarSecond,
    cover,
    sidebarThird,
    ...htmlProps
  } = props;
  return (
    <div
      className={classNames('dz-TemplateIII', className)}
      {...htmlProps}
      ref={ref}
    >
      <div className="dz-TemplateIII__header">
        <div className="dz-TemplateIII__titleSection">{titleSection}</div>
        <div className="dz-TemplateIII__cover">{cover}</div>
      </div>
      <div className="dz-TemplateIII__mainContainer">
        <div className="dz-TemplateIII__mainWrap">
          <div className="dz-TemplateIII__sidebarFirst">{sidebarFirst}</div>
          <div className="dz-TemplateIII__main">{content}</div>
          <div className="dz-TemplateIII__sidebarSecond">{sidebarSecond}</div>
        </div>
        <div className="dz-TemplateIII__sidebarThird">{sidebarThird}</div>
      </div>
    </div>
  );
});


TemplateIII.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  cover: PropTypes.node,
  titleSection: PropTypes.node,
  content: PropTypes.node,
  sidebarFirst: PropTypes.node,
  sidebarSecond: PropTypes.node,
  sidebarThird: PropTypes.node,
};

export default TemplateIII;