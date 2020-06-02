---
category: Components
subtitle: Countdown Button
type: Data Entry
title: 倒数按钮
---


## 何时使用
需要发送验证码时。

## API

###  Props

| 成员        | 说明           | 类型               | 默认值       |
|-------------|----------------|--------------------|--------------|
| count | 倒数总时间, 单位s | number | `0` |
| left | 正处于倒数状态,left设置为剩余时间，单位s | number／bool | `false` |
| renderCountDown | 自定义倒数按钮 | Function(left):ReactNode | - |
| onStart | 开始倒数的回调 | Function | - |
| onEnd | 结束倒数的回调 | Function | - |
