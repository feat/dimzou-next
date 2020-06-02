---
category: Components
subtitle: 按钮
type: Data Entry
title: button
---


## API
用来按的
### Button
| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | --- | ----- |
| blockName | 区块名称， 用于控制样式 | string | 'Button' |
| type | 按钮状态 | Enum{"primary", "dashed", "danger", "default", "link", "merge"} | `default` |
| htmlType | 按钮类型 | Enum{'submit', ''} | `null` |
| size | 按钮大小 | Enum{"sm", "md", "lg"} | `sm` |
| onClick | 回调时间 | function | `null` |
| disabled | 禁用按钮 | boolean | `false` |
| block | 是否为`display`: block | boolean | `false` |
| invisible | 隐藏按钮 | boolean | `false` |

### ButtonGroup
包裹多个按钮

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | --- | ----- |
| block | 按钮组布局变为flex， 且Button占满所有空间 | boolean | `false` |
