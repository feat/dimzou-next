---
category: Components
subtitle: Trigger
type: other
title: 抽象类弹出层
---


## 何时使用

用于封装拥有弹出行为的组件。

## API

###  Props

| 成员        | 说明           | 类型               | 默认值       |
|-------------|----------------|--------------------|--------------|
| popupClassName | 弹出层的类名 | string | - |
| popupStyle | 弹出层的样式 | object | - |
| destroyPopupOnHide | 隐藏后是否销毁弹出层 | bool | `false` |
| getPopupClassNameFromAlign | 根据Align的情况添加到弹出层的类名 | getPopupClassNameFromAlign(align: Object):String | - |
| action | 触发弹出的动作 | `string[]`，enum{"hover","click","focus"} | `["hover"]` |
| mouseEnterDelay | 触发弹出行为后的延迟， 单位s | number | `0` |
| mouseLeaveDelay | 触发隐藏行为后的延迟， 单位s | number | `0.1` |
| prefixCls | 类名前序 | string | `ft-Trigger` |
| popupTransitionName | 弹出层动画类名，参考rc-animate | string | - |
| maskTransitionName | 遮罩层动画类名 | string | - |
| onPopupVisibleChange | 弹出状态改变的回调 | Function(visibility) | - |
| popupVisible | 弹出状态 | bool | - |
| defaultPopupVisible | 默认的弹出状态 | bool | `false` |
| mask | 是否显示遮罩层 | bool | `false` |
| maskClosable | 点击遮罩层是否隐藏 | bool | `true` |
| zIndex | 弹出层的zIndex | number | - |
| popupAlign | 弹出层的定位，详情见[dom-align](https://github.com/yiminghe/dom-align) | object | - |
| onPopupAlign | 弹出并定位后的回调 | Function(popupDomNode, align) | - |
| popup | 弹出的内容 | reactNode | - |
| getPopupContainer | 返回加载弹出层节点的函数 | Function: HTMLElement | `body` |
| popupPlacement | 弹出的位置方向，详情见[dom-align](https://github.com/yiminghe/dom-align) | string | `auto` |
| builtinPlacements | 弹出的位置的配置，详情见[dom-align](https://github.com/yiminghe/dom-align) | object | - |
