---
category: Components
subtitle: 验证码输入框
type: Data Entry
title: DigiInput
---

验证码输入框。

## 何时使用

- 在输入验证码或者支付密码时；

## API

### DigiInput

| 参数      | 说明             | 类型      | 默认值  |
|----------|------------------|----------|--------|
| type | 输入框的类型 | Enum{'text', 'password'}  | text |
| digitCount | 限定输入多少位数字 | number | 4 |
| onChange | 变化时回调函数 | Function(e:Event) | - |
| value | 值 | string | - |
