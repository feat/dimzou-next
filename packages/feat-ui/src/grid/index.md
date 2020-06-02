---
category: Layout
subtitle:  栅格系统
type: grid
title: grid
---
布局的栅格化系统，我们是基于行（row）和列（col）来定义信息区块的外部框架，以保证页面的每个区域能够稳健地排布起来。下面简单介绍一下它的工作原理：
通过row在水平方向建立一组column（简写col）
你的内容应当放置于col内，并且，只有col可以作为row的直接元素
栅格系统中的列是指1到24的值来表示其跨越的范围。例如，三个等宽的列可以使用.col-8来创建
如果一个row中的col总和超过 24，那么多余的col会作为一个整体另起一行排列

默认24等分的栅格系统, 还有5等分可选。


## API

### Row

| 参数      | 说明             | 类型      | 默认值  |
|----------|------------------|----------|--------|
| divisionBy | 栅格多少等分 | Enum{5, 24}  | `24` |
| wrap | flex布局时可用，是否包裹，对应属性`flex-wrap` | boolean | `false` |
| flex | 是否为flex布局 | boolean | `false` |
| align | 垂直布局, 只有在flex布局时可用， 对应属性`align-items` | Enum{'top', 'middle', 'bottom'} | - |
| justify | flex布局时可用，对应属性`justify-content` | Enum{'space-between', 'space-around', 'center'} | - |
| children| 内容 | any | - |
| gutter | `col`之间的间隔 | Enum{6, 12, 24, 36} | `0` |
| className | 类名 | string | - |
| style | 样式 | object | - |

### Col

| 参数      | 说明             | 类型      | 默认值  |
|----------|------------------|----------|--------|
| span| 所占栅格份数 | number(1 - divisionBy) | - |
| offset | 列偏移。使用 offset 可以将列向右侧偏。例如，offset={4} 将元素向右侧偏移了 4 个列（column）的宽度。 | number | `0` |
