### 2020-04-24 -- 0.1.22

- update AutoMarkdown plugin, disable for bold size transform in header

### 2020-04-24 -- 0.1.21

- handleReturn, reset inlineStyle
- handleToggleBlock, reset header-* inline-style

### 2020-04-10 -- 0.1.20

- update AutoMarkdown inline style

### 2020-04-07 -- 0.1.19

- update toggleBlockStyle, handle unset code block / quote block

### 2020-03-06 -- 0.1.18

- update toggleInlineStyle
- update AnnotationUtils, remove userInfo and timestamp

### 2020-03-06 -- 0.1.17

- update stateFromHTML config

### 2020-03-06 -- 0.1.16

- update toolbar icon

### 2020-02-18 -- 0.1.15

- add `LIGHT` inline style

### 2020-02-14 -- 0.1.13

- disable PrismDecorator

### 2020-02-13 -- 0.1.12

- update code block toggle, auto merge
- add code block line numbers

### 2019-12-26 -- 0.1.11

- update annotation related style

### 2019-11-28 -- 0.1.10

- update `Editor` component, handling `onTab`

### 2019-11-27 -- 0.1.9

- Fix AutoMarkdown plugin, Bug: mis changing inline style

### 2019-10-30 -- 0.1.8

- fix `Image` Component

### Aug 08 2019 -- 0.1.6

- capture handleDrop error

### Aug 06 2019 -- 0.1.5

- Update AnnotationUtils, fix `handlePastedText`

### Feb 21 2019 -- 0.1.3

- Update AnnotationUtils, update `backspace` command handle feature.

### Sep 05 2018 -- 0.0.19

- Update AutoMarkdown, check inline code regex before other style regex.
- Update AutoMarkdown, Do not auto update style if is inside code element

### Aug 28 2018 -- 0.0.18

- Fix Annotation StateToHTML config for code block

### Jul 30 2018 -- 0.0.17

- update annotation `handleTextInsert` fix quote insert

### Jun 08 2018 -- 0.0.16

- add `uploadManager`
- add `HTMLExport` to work with `uploadManager`
- add `IMAGE_UPLOADER` entity
- update Atomic behavior
- add CodeBlock hint

### May 29 2018 -- 0.0.15

- Update `AnnotationUtils`
- fix `handleTextInsert`
- fix `stateToHTML`

### May 25 2018 -- 0.0.14

- Update `_handleDroppedFiles` on `Editor` component, store extra info in entity:
  ```json
  ["id", "src", "mimeType"]
  ```

### Mar 23 2018 -- 0.0.13

- Update HTML transform, 默认添加 block data 转换。

### Mar 09 2018 -- 0.0.12

- Update CodeBlock and PrismDecorator

### Mar 08 2018 -- 0.0.11

- fix Toolbar Button,
- fix DragHint
- update handleReturn behavior

### Feb 10 2018 -- 0.0.10

- fix Annotation Util, toggleInlineStyle and toggleBlockType

### Dec 11 2017 -- 0.0.9

- add `onBlur` to Editor component

### Oct 30 2017 -- 0.0.8

- fix `constants`, add `ENTITY_TYPE.IMAGE` 

### 2017-10-19

- 为兼容 `draft-js >= 0.10` 使用第三方库 `draft-js-import-html` 与 `draft-js-export-html` 替换原定制版本
- 原定制版本的输入输出方式使用，“默认 import，export 配置” 的方式进行。进一步自定义可参考： `/lib/config`
- 更新默认输出方法，移除`createWithHTML`，添加`createWithContent`, `contentStateFromHTML`;
