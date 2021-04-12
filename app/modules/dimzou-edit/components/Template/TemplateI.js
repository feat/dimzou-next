/**
 * Dimzou App 页面渲染骨架
 * 命名策略：
 * 1. 基本页面区域使用 dz-App 作为前缀
 *   - 左侧栏： .dz-App__sidebarFirst
 *   - 右侧栏： .dz-App__sidebarSecond
 *   - 封面编辑区域： .dz-App__cover
 *   - ....
 * 2. 模版外部有一个命名类，如 dz-TemmplateI
 *   - 针对模版定义样式时，使用: .dz-TemplateI .dz-App__sidebarFirst
 */

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
      <div className="dz-App__sidebarFirst">{sidebarFirst}</div>
      <div className="dz-App__mainContainer">
        <div className="dz-App__cover">{cover}</div>
        <div className="dz-App__mainWrap">
          <div className="dz-App__main">{main}</div>
          <div className="dz-App__sidebarSecond">{sidebarSecond}</div>
          <div className="dz-App__sidebarThird">{sidebarThird}</div>
        </div>
      </div>
    </div>
  );
});

TemplateI.propTypes = {
  className: PropTypes.string,
  cover: PropTypes.node,
  main: PropTypes.node,
  sidebarFirst: PropTypes.node,
  sidebarSecond: PropTypes.node,
  sidebarThird: PropTypes.node,
};

export default TemplateI;
