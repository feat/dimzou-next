import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { EditorBlock, ContentBlock } from '@feat/draft-js';
import Prism from 'prismjs';
import updateDataOfBlock from '../../../utils/updateDataOfBlock';
import Select from './Select';
import LineNum from './LineNum';

const getSyntaxOptions = () => {
  const languages = Prism.languages;
  const optionArr = [];
  Object.keys(languages).forEach((key) => {
    if (typeof languages[key] === 'object') {
      optionArr.push({ label: key, value: key });
    }
  });
  return optionArr;
};

class CodeBlock extends Component {
  constructor(props) {
    super(props);
    this.changeSyntax = this.changeSyntax.bind(this);
    this.syntaxOptions = getSyntaxOptions();
  }
  getSyntaxOptions() {
    const syntax = this.props.block.getData().get('language');
    const index = this.syntaxOptions.findIndex(option => option.value === syntax);

    if (index > -1 || !syntax) {
      return this.syntaxOptions;
    }
    return [{ label: syntax, value: syntax }, ...this.syntaxOptions];
  }
  changeSyntax(syntax) {
    const { getEditorState, setEditorState } = this.props.blockProps;
    const newState = updateDataOfBlock(getEditorState(), this.props.block, { language: syntax });
    setEditorState(newState);
  }
  render() {
    const syntax = this.props.block.getData().get('language');
    const syntaxOptions = this.getSyntaxOptions();
    const { className, ...resetProps } = this.props;
    return (
      <div className={classNames('public-DraftStyleDefault-codeBlock-inner', className)}>
        <div className="public-DraftStyleDefault-codeBlock-content">
          <LineNum text={this.props.block.getText()} />
          <EditorBlock {...resetProps} />
        </div>
        <div
          tabIndex={-1}
          className={classNames('public-DraftStyleDefault-codeBlock-footer')}
          onMouseDown={(e) => {
            this.props.blockProps.setReadOnly(true);
          }}
          onBlur={(e) => {
            this.props.blockProps.setReadOnly(false);
          }}
        >
          <div contentEditable={false} className="public-DraftStyleDefault-codeBlock-hint">
            Press <kbd>⌘</kbd> + <kbd>Enter</kbd> to exit.
          </div>
          <Select
            className="public-DraftStyleDefault-codeBlock-select"
            name="syntax"
            options={syntaxOptions}
            selected={syntax}
            onChange={this.changeSyntax}
          />
        </div>
      </div>
    );
  }
}

CodeBlock.propTypes = {
  className: PropTypes.string,
  block: PropTypes.instanceOf(ContentBlock).isRequired,
  blockProps: PropTypes.shape({
    getEditorState: PropTypes.func,
    setEditorState: PropTypes.func,
    setReadOnly: PropTypes.func,
  }).isRequired,
};

export default CodeBlock;
