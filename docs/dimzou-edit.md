# Dimzou Edit

## reducer store design

```
{
  bundles: {
    data: null,
    cached: null, // requesting_info
    release: null, // release flow related
    invitation: null, // invitation related
    creation: null, // chapter creation related
    common: {
      isReady: false,
      isFetchingEditInfo: false,
      isCreatingNode: false,
      mode: undefined,
      isReleasePanledOpened: false,
    }, // some common status/ui info
  },
  nodes: {},
  blocks: {},
  rewordings: {},
  comments: {},
  likes: {},
  appendings: {},
  requests: {},
  creation: {}
}
```

## 技术要点

- 使用内部状态控制控制url，即根据内部状态更新url

## User story

### 初始化封面编辑/章节编辑 以及取消
1. 点击 `Title`，打开封面编辑页面，编辑器聚焦到输入框，必要时滚动页面
2. 点击关闭时，恢复到打开前的 `offsetY`

## TODO

- [ ] 优化错误提示，
  - [ ] 使用 React 错误 Capture 的形式？