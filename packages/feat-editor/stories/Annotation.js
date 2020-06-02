import React, { Component } from 'react';
import { EditorState } from 'draft-js';

import stateToHTMLConfig from '@feat/feat-editor/lib/plugins/Annotation/helpers/stateToHTMLConfig';
import stateFromHTMLConfig from '@feat/feat-editor/lib/plugins/Annotation/helpers/stateFromHTMLConfig';

import contentStateFromHTML from '@feat/feat-editor/lib/helpers/contentStateFromHTML';
import contentStateToHTML from '@feat/feat-editor/lib/helpers/contentStateToHTML';
import contentStateToRaw from '@feat/feat-editor/lib/helpers/contentStateToRaw';

import MultiDecorator from '@feat/feat-editor/lib/libs/MultiDecorator';
import CodeLineDecorator from '@feat/feat-editor/lib/plugins/CodeLineDecorator';
import AnnotationDecorator from '@feat/feat-editor/lib/plugins/Annotation/AnnotationDecorator';
import handleToggleInlineStyle from '@feat/feat-editor/lib/plugins/Annotation/handlers/handleToggleInlineStyle';
import handleToggleBlockType from '@feat/feat-editor/lib/plugins/Annotation/handlers/handleToggleBlockType';
import Toolbar from '@feat/feat-editor/lib/components/Toolbar/Toolbar';

import AuditEditor from './AuditEditor';

const userInfo = { userId: '123123', username: 'kongkx' };

const decorator = new MultiDecorator([new CodeLineDecorator({ defaultSyntax: 'javascript' }), new AnnotationDecorator()]);

class Annotation extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    if (props.html) {
      const contentState = contentStateFromHTML(props.html, stateFromHTMLConfig);
      this.state = {
        editorState: EditorState.createWithContent(
          contentState,
          decorator,
        ),
      };
    }
  }

  onChange= (editorState) => {
    this.setState({
      editorState,
    });
  }

  export = () => {
    const editorState = this.state.editorState;
    const content = editorState.getCurrentContent();
    console.log(contentStateToRaw(content));
    const html = contentStateToHTML(content, stateToHTMLConfig);
    console.log(html);
    this.setState({ html });
  }

  render() {
    return (
      <div className="demo">
        <div className="buttons">
          <button onClick={this.export}>export</button>
        </div>
        <Toolbar
          handleToggleInlineStyle={(editorState, onChange, inlineStyle) => {
            handleToggleInlineStyle(editorState, onChange, inlineStyle, userInfo);
          }}
          handleToggleBlockType={(editorState, onChange, blockType) => {
            handleToggleBlockType(editorState, onChange, blockType, userInfo);
          }}
          editorState={this.state.editorState}
          onChange={this.onChange}
        />
        <AuditEditor
          placeholder="Title"
          customStyleMap={{
            LIGHT: { fontWeight: 300 },
          }}
          editorState={this.state.editorState}
          onChange={this.onChange}
          userInfo={userInfo}
        />
        {this.state.html && (
          <div dangerouslySetInnerHTML={{ __html: this.state.html }} />
        )}
      </div>
    );
  }
}

export default Annotation;
