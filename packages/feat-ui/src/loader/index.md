---
category: Feedback
subtitle: Loader
type: Feedback
title: 加载圈
---

加载圈。

## 何时使用

- 异步加载时使用，自动置中， 父容器position必须为relative 或 absolute；

## API

### Loader

可输入div所有的参数

| 参数      | 说明             | 类型      | 默认值  |
|----------|------------------|----------|--------|
| size | 加载圈的大小 | Enum{"xxs", "xs", "sm", "md", "lg", "xl"}  | `sm` |
| speed | 加载圈旋转的速度, 单位为 x s 或 ms 转 1圈 | string  | `1s` |
| content | 加载的内容 | string  | - |
