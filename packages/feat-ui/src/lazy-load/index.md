---
category: Components
subtitle: lazy-load
type: other
title: 延迟加载
---
引用自 [react-lazyload](https://github.com/jasonslyvia/react-lazyload)

**基于 `react-lazyload@2.3` 修改**

添加`setVisibleCheck`，全局开启／禁止`visibleCheck`

## 何时使用
需要延迟加载图片以节省网络资源和提升表现时。

## API

###  Props

| 成员        | 说明           | 类型               | 默认值       |
|-------------|----------------|--------------------|--------------|
| height | 占位符的高度，可提高性能，单位px或使用百分比 | number／number | - |
| once | 一旦加载后就解绑事件 | bool | `false` |
| offset | 距离视窗多少px时加载组件，可令到使用者察觉不到延迟加载,单位px，输入数组时，如[100,100]时，会分别设置top和bottom的值 | number／number[] | `0` |
| scroll | 监听滚动事件 | bool | `true` |
| resize | 监听视窗变化事件 | bool | `false` |
| debounce | 使用debounce模式，单位ms | number/bool | `true` |
| throttle | 使用节流模式，单位ms | number/bool | `false` |
| placeholder | 使用自定义的占位符 | ReactNode | - |
| unmountIfInvisible | 当组件不再视窗范围内时，变为占位符 | bool | `false` |
