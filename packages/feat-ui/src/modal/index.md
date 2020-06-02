---
type: Feedback
category: Components
subtitle: 对话框
title: Modal
---

模态对话框。

## 何时使用

需要用户处理事务，又不希望跳转页面以致打断工作流程时，可以使用 `Modal` 在当前页面正中打开一个浮层，承载相应的操作。

另外当需要一个简洁的确认框询问用户时，可以使用精心封装好的 `Modal.confirm()` 等方法。

## API

| 参数       | 说明           | 类型             | 默认值       |
|------------|----------------|------------------|--------------|
| isOpen | 控制modal开关 | boolean | `false` |
| maskClosable | 点击遮罩层是否可以关闭modal | boolean | `false` |
| onClose | 在关闭modal前的回调 | Function(destory: func) | - |
| onOpen | 在打开modal前的回调 | Function | - |

### Modal.xxx()

包括：

- `Modal.info`
- `Modal.success`
- `Modal.error`
- `Modal.warning`
- `Modal.confirm`

以上均为一个函数，参数为 object，具体属性如下：


| 参数       | 说明           | 类型             | 默认值       |
|------------|----------------|------------------|--------------|
| title | modal的标题 | string | - |
| content | modal的内容 | ReactNode | - |
| maskClosable | 点击遮罩层是否可以关闭modal | boolean | `true` |
| onConfirm | 点击确认的回调 | Function | - |
| onCancel | 点击取消的回调 | Function | - |
| confirmText | 确认按钮的内容 | string | `OK` |
| cancelText | 取消按钮的内容 | string | `NO` |
