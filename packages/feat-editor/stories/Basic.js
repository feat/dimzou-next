import React from 'react';
import { EditorState } from 'draft-js';

import Editor from '@feat/feat-editor/lib/components/Editor';
import Toolbar from '@feat/feat-editor/lib/components/Toolbar';
import createFromRawData from '@feat/feat-editor/lib/helpers/createFromRawData';

import contentStateFromHTML from '@feat/feat-editor/lib/helpers/contentStateFromHTML';
import contentStateToHTML from '@feat/feat-editor/lib/helpers/contentStateToHTML';
import contentStateToRaw from '@feat/feat-editor/lib/helpers/contentStateToRaw';
import decorator from '@feat/feat-editor/lib/model/defaultDecorators';
import '@feat/feat-editor/lib/components/Toolbar/index.scss';


export default class Basis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    if (props.data) {
      this.state = {
        editorState: createFromRawData(props.data),
      };
    } else if (props.html) {
      const contentState = contentStateFromHTML(props.html);
      this.state = {
        editorState: EditorState.createWithContent(contentState, decorator),
      };
    } else {
      this.state = {
        editorState: EditorState.createEmpty(decorator),
      };
    }
  }

  onChange = editorState => this.setState({
    editorState,
  })

  export = () => {
    const editorState = this.state.editorState;
    const content = editorState.getCurrentContent();
    console.log(contentStateToRaw(content));
    const html = contentStateToHTML(content);
    console.log(html);
    this.setState({ html });
  }

  render() {
    return (
      <div className="demo">
        <div className="buttons">
          <button onClick={this.export}>export</button>
        </div>
        <Toolbar editorState={this.state.editorState} onChange={this.onChange} />
        <Editor
          editorState={this.state.editorState}
          customStyleMap={{
            LIGHT: {
              fontWeight: 300,
            },
          }}
          onChange={this.onChange}
        />
        {this.state.html && (
          <div dangerouslySetInnerHTML={{ __html: this.state.html }} />
        )}
      </div>
    );
  }
}
