---
category: Components
type: Others
noinstant: true
title: Password Strength Meter
subtitle: 密码强度控件
---


设置密码时显示密码强度，一共有5个得分（0～4）


## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 密码 | string | |
| getBarStyle | 根据密码强度返回进度条样式 | function | |
| getDescription | 根据密码强度返回描述 | function | |
| namespace | 样式命名空间 | string | `ft` |
