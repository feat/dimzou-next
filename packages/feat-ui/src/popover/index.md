---
category: Component
subtitle: Popover
type: Data Display
title: 气泡卡片
---

气泡卡片。

## 何时使用

当目标元素有进一步的描述和相关操作时，可以收纳到卡片中，根据用户的操作行为进行展现。
和 Tooltip 的区别是，用户可以对浮层上的元素进行操作，因此它可以承载更复杂的内容，比如链接或按钮等。

## API

### Popover


| 参数      | 说明             | 类型      | 默认值  |
|----------|------------------|----------|--------|
| placement | 气泡卡片出现的地方 | enum{'top', 'right', 'left', 'bottom'}  | `top` |
| content | 气泡卡片的内容 | element／node  | - |
| children | 触发气泡卡片的元素 | element／node  | - |


<!-- | offsetY | 距离children的纵向距离 | number  | `4` |
| offsetX | 距离children的横向距离 | number  | `4` | -->
