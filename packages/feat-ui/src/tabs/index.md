---
category: Component
subtitle: Tabs
type: 其他
title: 标签页
---

占位符。

## 何时使用

- 提供平级的区域将大块内容进行收纳和展现，保持界面整洁。

## API

### Tabs


| 参数      | 说明             | 类型      | 默认值  |
|----------|------------------|----------|--------|
| activeKey | 当前激活 tab 面板的 key | string  | 默认第一个key |
| onChange | 切换面板的回调 | Function(activeKey)  | - |
| type | tab的风格样式 | enum{"feat", "normal"}  | `feat` |



### Tabs.TabPane

| 参数      | 说明             | 类型      | 默认值  |
|----------|------------------|----------|--------|
| key | 对应 activeKey | string  | - |
| tab | 选项卡头显示文字 | string/element  | - |
