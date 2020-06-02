import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Trigger from 'rc-trigger';
import { placements } from '../align/placements';

class Tooltip extends Component {
  static propTypes = {
    trigger: PropTypes.any,
    children: PropTypes.any,
    defaultVisible: PropTypes.bool,
    visible: PropTypes.bool,
    placement: PropTypes.string,
    transitionName: PropTypes.string,
    animation: PropTypes.any,
    onVisibleChange: PropTypes.func,
    afterVisibleChange: PropTypes.func,
    overlay: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
    overlayStyle: PropTypes.object,
    overlayClassName: PropTypes.string,
    prefixCls: PropTypes.string,
    mouseEnterDelay: PropTypes.number,
    mouseLeaveDelay: PropTypes.number,
    getTooltipContainer: PropTypes.func,
    destroyTooltipOnHide: PropTypes.bool,
    align: PropTypes.object,
    arrowContent: PropTypes.any,
  };

  static defaultProps = {
    prefixCls: 'ft-Tooltip',
    mouseEnterDelay: 0,
    destroyTooltipOnHide: true,
    mouseLeaveDelay: 0.1,
    align: {},
    placement: 'right',
    trigger: ['hover'],
    arrowContent: null,
  };

  getPopupElement = () => {
    const { arrowContent, overlay, prefixCls } = this.props;
    return [
      <div className={`${prefixCls}__arrow`} key="arrow">
        {arrowContent}
      </div>,
      <div className={`${prefixCls}__inner`} key="content">
        {typeof overlay === 'function' ? overlay() : overlay}
      </div>,
    ];
  };

  getPopupDomNode() {
    return this.trigger.getPopupDomNode();
  }

  render() {
    const {
      overlayClassName,
      trigger,
      mouseEnterDelay,
      mouseLeaveDelay,
      overlayStyle,
      prefixCls,
      children,
      onVisibleChange,
      afterVisibleChange,
      transitionName,
      animation,
      placement,
      align,
      destroyTooltipOnHide,
      defaultVisible,
      getTooltipContainer,
      ...restProps
    } = this.props;
    const extraProps = { ...restProps };
    if ('visible' in this.props) {
      extraProps.popupVisible = this.props.visible;
    }
    return (
      <Trigger
        popupClassName={overlayClassName}
        ref={(c) => {
          if (c) this.trigger = c;
        }}
        prefixCls={prefixCls}
        popup={this.getPopupElement}
        action={trigger}
        builtinPlacements={placements}
        popupPlacement={placement}
        popupAlign={align}
        getPopupContainer={getTooltipContainer}
        onPopupVisibleChange={onVisibleChange}
        afterPopupVisibleChange={afterVisibleChange}
        popupTransitionName={transitionName}
        popupAnimation={animation}
        defaultPopupVisible={defaultVisible}
        destroyPopupOnHide={destroyTooltipOnHide}
        mouseLeaveDelay={mouseLeaveDelay}
        popupStyle={overlayStyle}
        mouseEnterDelay={mouseEnterDelay}
        {...extraProps}
      >
        {children}
      </Trigger>
    );
  }
}

export default Tooltip;
