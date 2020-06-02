## NOTE:

在项目中引入时，可能需要添加alias，将第三方库引用的`draft-js`指向`@feat/draft-js`;  webpack配置示例：

```javascript
// webpack.config.js
{
  // entry ...
  // plugins ...
  resolve: {
    alias: {
      'draft-js': '@feat/draft-js'
    }
  }
}
```

## 使用

```javascript
import React from 'react';
import { Editor, Toolbar, createFromRawData } from '@feat/feat-editor';

import 'draft-js/dist/Draft.css';
import '@feat/feat-editor/dist/FeatEditor.css';

const raw = {
    blocks: [{type: 'unstyled', text: 'Demo Content'}],
    entityMap: {}
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: createFromRawData(raw),
    };
  }
  onChange = (editorState) => {
    this.setState({
      editorState,
    });
  }
  render() {
    return (
      <div className="demo">
        <Toolbar
          editorState={this.state.editorState}
          onChange={this.onChange}
        />
        <Editor
          placeholder="Title"
          editorState={this.state.editorState}
          onChange={this.onChange}
          />
      </div>
    )
  }
}
```

### 处理文件上传

设置 props `uploadFiles`， 激活处理上传功能，需要 `uploadFiles` 方法返回`promise`，resolve 的数据格式为: `{ url: 'path/to/image'}`


## Annotation

1. 使用 Annotation 相关的handler

```javascript
import React, { Component } from "react";
import PropTypes from "prop-types";
import Editor from "@feat/feat-editor/lib/components/Editor";
import handleBeforeCut from "@feat/feat-editor/lib/plugins/Annotation/handlers/handleBeforeCut";
import handleBeforeInput from "@feat/feat-editor/lib/plugins/Annotation/handlers/handleBeforeInput";
import handleKeyCommand from "@feat/feat-editor/lib/plugins/Annotation/handlers/handleKeyCommand";
import handlePastedText from "@feat/feat-editor/lib/plugins/Annotation/handlers/handlePastedText";
import handleReturn from
"@feat/feat-editor/lib/plugins/Annotation/handlers/handleReturn";
import handleToggleBlockType from
"@feat/feat-editor/lib/plugins/Annotation/handlers/handleToggleBlockType";
import handleToggleInlineStyle from
"@feat/feat-editor/lib/plugins/Annotation/handlers/handleToggleInlineStyle";

const AuditEditor = ({ userInfo, ...props }) => (
  <Editor
    {...props}
    handleBeforeCut={(...args) => handleBeforeCut(...args, userInfo)}
    handleBeforeInput={(...args) => handleBeforeInput(...args, userInfo)}
    handlePastedText={(...args) => handlePastedText(...args, userInfo)}
    handleKeyCommand={(...args) => handleKeyCommand(...args, userInfo)}
    handleReturn={(...args) => handleReturn(...args, userInfo)}
    handleToggleBlockType={(...args) => handleToggleBlockType(...args, userInfo)}
    handleToggleInlineStyle={(...args) => handleToggleInlineStyle(...args, userInfo)}
  />
);

AuditEditor.propTypes = {
  userInfo: PropTypes.shape({
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    username: PropTypes.string
  }).isRequired
};

export default AuditEditor;

```

2. 使用 Annotation 的配置导出 HTML

```javascript
import stateToHTMLConfig from '@feat/feat-editor/lib/plugins/Annotation/helpers/stateToHTMLConfig';
import contentStateToHTML from '@feat/feat-editor/lib/helpers/contentStateToHTML';

const annotationHTML = (contentState) => contentStateToHTML(contentState, stateToHTMLConfig)
```

3. 使用 Annotation 的配置生成

```javascript
import stateFromHTMLConfig from '@feat/feat-editor/lib/plugins/Annotation/helpers/stateFromHTMLConfig';
import contentStateFromHTML from '@feat/feat-editor/lib/helpers/contentStateFromHTML';
import { EditorState } from "@feat/draft-js";

import MultiDecorator from '@feat/feat-editor/lib/libs/MultiDecorator';
import PrismDecorator from '@feat/feat-editor/lib/plugins/PrismDecorator';
import AnnotationDecorator from '@feat/feat-editor/lib/plugins/Annotation/AnnotationDecorator';

// decorator
const decorator = new MultiDecorator([
  new PrismDecorator(),
  new AnnotationDecorator(),
]);

// content state
const contentState = stateFromHTML(html, stateFromHTMLConfig);
const editorState = EditorState.createWithContent(contentState, decorator);
```


## TODOs

- [x] CodeBlock Syntax highlight
    - 需要自行引入 prismjs 样式
- [x] Export HTML
    - [x] CodeBlock syntax data
