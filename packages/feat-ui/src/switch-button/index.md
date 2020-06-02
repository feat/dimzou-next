---
category: Components
subtitle: Switch Button
type: Data Entry
title: 可切换按钮
---


## 何时使用

在进行单项选择而空间不足时, 功能类似于checkbox。

## API

###  Switch Button Props

| 成员        | 说明           | 类型               | 默认值       |
|-------------|----------------|--------------------|--------------|
| onChange | 当值发生变化时的回调函数 | Function(value, item) | - |
| initialValue | 初始化的值 | string | `必需` |
| options | 选项组 | array, 结构为`[{label: "apple", value: 0}, {label: "banana", value: 1}]` | `必需` |
