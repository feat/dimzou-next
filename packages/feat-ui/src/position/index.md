---
category: Components
subtitle: Position
type: Other
title: 定位器
---


## 何时使用

将内容投送到目标元素的旁边，必需搭配portal使用或手动操作。

## API

### Position Props

| 成员        | 说明           | 类型               | 默认值       |
|-------------|----------------|--------------------|--------------|
| prefixCls | 包裹层的类名 | stirng | - |
| children | 投送的内容 | node | - |
| offsetY | 离目标元素的纵向距离，单位px | number | `4` |
| offsetX | 离目标元素的横向距离，单位px | number | `4` |
| direction | 内容出现的位置, 使用auto时内容会根据视口的位置调整，horizontal则出现在目标的水平方向 | enum{"horizontal", "auto"} | `auto` |
| getTarget | 可以返回目标元素的函数 | Function: element | - |
