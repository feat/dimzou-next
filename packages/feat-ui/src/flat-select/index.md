---
category: Components
subtitle:  栅格选择框
type: Data Entry
title: flat-select
---

栅格单选框。

## 何时使用

- 存在多个有规律性的选择时， 例如选择日期，时间或语言时；

## API

### flat-select

| 参数      | 说明             | 类型      | 默认值  |
|----------|------------------|----------|--------|
| gridSpan | 栅格系统默认为24等分，girdSpan决定每个选项的大小 | number(1 - divisionBy)  | - |
| gutter | 选项之间的间隔 | number | `0` |
| divisionBy | 栅格多少等分 | number | `24` |
| flex | 是否为flex布局 | boolean | `false` |
| value | 选项的值, 值的类型由是否为多选决定 | string or array | - |
| defaultValue | 默认值 | string or array | - |
| multiple | 是否为多选 | boolean | `false` |
| onChange | 变化时回调函数 | Function(value) | - |
| disabled | 是否禁用 | boolean | false |
| notAllowed | 不可选的值 | array | - |
