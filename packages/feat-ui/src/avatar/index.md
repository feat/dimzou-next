---
category: Components
subtitle: 头像
type: Data Display
title: avatar
---

## API
显示用户头像
### Avatar
| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | --- | ----- |
| size | 头像大小 | Enum{"xxs", "xs", "sm", "md", "lg", "xl"} | `sm` |
| round | 头像是否为圆形 | boolean | `false` |
| avatar | 头像的路径 | string | defaultAvatarSrc |

### AvatarStamp
显示用户名称以及额外信息
包含`Avatar`的所有参数

| 参数 | 说明 | 类型 | 默认值 |
| ---- | ---- | --- | ----- |
| meta | 额外信息 | string | `null` |
