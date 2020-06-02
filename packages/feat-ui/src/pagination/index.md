---
category: Components
type: Feedback
title: Pagination
subtitle: 分页器
---

采用分页的形式分隔长列表，每次只加载一个页面。

## 何时使用

- 当加载/渲染所有数据将花费很多时间时；
- 可切换页码浏览数据

## API

| 参数       | 说明           | 类型             | 默认值       |
|------------|----------------|------------------|--------------|
| current    | 目前的页码 | number          | -           |
| defaultCurrent | 初始化的页码 | number    | `1`           |
| total    | 所有的items数 | number          | -           |
| pageSize | 一页显示多少个item | number    | `10`           |
| marginPagesDisplayed      | 当前页码较大时，左右两边显示的页码标签数量           | number | `2`           |
| previousLabel   | 去上一页的标签 | node/string    | `<`        |
| nextLabel       | 去下一页的标签       | node/string     | `>`           |
| breakLabel   | 中断标签 | node/string    | `...`        |
| onChange   | 改变页码时的回调函数 | Function(pageNumber)    | -        |
| showQuickJumper   | 显示输入框 | bool    | false        |
| displayNum       | 最多显示多少个页码标签(页码较大时，不包含左右两边)       | number     | 5           |
