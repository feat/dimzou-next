---
category: Components
subtitle: 图标
type: General
title: Icon
toc: false
---

语义化的矢量图形。

## 图标的命名规范

TODO

## 如何使用

使用 `<Icon />` 标签声明组件，指定图标对应的 name 属性，示例代码如下:

```html
<Icon name="success" />
```


## 图标列表

TODO

## API

由于图标字体本质上还是文字，可以使用 `style` 和 `className` 设置图标的大小和颜色。

```jsx
<Icon name="success" style={{ fontSize: 16, color: '#08c' }} />
```

| 参数      | 说明             | 类型      | 默认值  |
|----------|------------------|----------|--------|
| type | 图标类型 | string | - |
| style | 设置图标的样式，例如 fontSize 和 color | object | - |
