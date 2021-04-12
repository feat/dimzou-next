import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Editor from '@feat/feat-editor/lib/components/Editor';
import {
  createFromRawData as _createFromRawData,
  contentStateToHTML,
  contentStateFromHTML,
  createWithContent,
} from '@feat/feat-editor';
import {
  EditorState,
  convertToRaw as _convertToRaw,
  Modifier,
} from '@feat/draft-js';

import stateToHTMLConfig from '@feat/feat-editor/lib/plugins/Annotation/helpers/stateToHTMLConfig';
import stateFromHTMLConfig from '@feat/feat-editor/lib/plugins/Annotation/helpers/stateFromHTMLConfig';
import { applyDeleteAnnotation } from '@feat/feat-editor/lib/plugins/Annotation/AnnotationUtils';

import handleBeforeCut from '@feat/feat-editor/lib/plugins/Annotation/handlers/handleBeforeCut';
import handleBeforeInput from '@feat/feat-editor/lib/plugins/Annotation/handlers/handleBeforeInput';
import handleKeyCommand from '@feat/feat-editor/lib/plugins/Annotation/handlers/handleKeyCommand';
import handlePastedText from '@feat/feat-editor/lib/plugins/Annotation/handlers/handlePastedText';
import handleReturn from '@feat/feat-editor/lib/plugins/Annotation/handlers/handleReturn';
import handleToggleBlockType from '@feat/feat-editor/lib/plugins/Annotation/handlers/handleToggleBlockType';
import handleToggleInlineStyle from '@feat/feat-editor/lib/plugins/Annotation/handlers/handleToggleInlineStyle';

import { handlePastedText as _defaultHandlePastedText } from '@/utils/editor';

import decorator from './decorator';
import emptyRaw from './emptyRaw';
import { MAX_TITLE_LENGTH } from '../../constants';
import { getConfirmedText } from '../../utils/content';

const dimzouStyleMap = {
  LIGHT: { fontWeight: 300, fontFamily: 'Garamond,serif' },
  BOLD: {
    fontWeight: 'bold',
    fontSize: '1.1em',
    WebkitFontSmoothing: 'antialiased',
  },
  CODE: {
    fontFamily: 'monospace',
    overflowWrap: 'break-word',
    backgroundColor: 'rgba(237, 237, 237, 0.5)',
    display: 'inline-block',
    lineHeight: 1.3,
    borderRadius: 4,
    paddingLeft: 3,
    paddingRight: 3,
  },
};
class DimzouEditor extends Component {
  componentDidCatch(err) {
    // Fix: Failed to execute 'removeChild' on 'Node'
    logging.debug(err);
    this.forceUpdate();
  }

  focus = () => {
    this.editor.focus();
  };

  handleTitleInsert = (editorState, onChange, text) => {
    let textToInsert = text.replace(/[\r\n]/g, ' ');
    const currentText = editorState.getCurrentContent().getPlainText();
    if (currentText.length + textToInsert.length > MAX_TITLE_LENGTH) {
      textToInsert = textToInsert.slice(
        0,
        MAX_TITLE_LENGTH - currentText.length,
      );
      // MAY pop message here
    }

    const newContentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      textToInsert,
    );
    onChange(EditorState.push(editorState, newContentState, 'insert-fragment'));
    return 'handled';
  };

  handleTitleUpdateInsert = (editorState, onChange, text) => {
    let textToInsert = text.replace(/[\r\n]/g, ' ');
    const currentText = getConfirmedText(
      getHTML(editorState.getCurrentContent()),
    );
    if (currentText.length + textToInsert.length > MAX_TITLE_LENGTH) {
      textToInsert = textToInsert.slice(
        0,
        MAX_TITLE_LENGTH - currentText.length,
      );
      // MAY pop message here
    }
    return handleBeforeInput(editorState, onChange, textToInsert);
  };

  handleBeforeCut = (...args) => {
    const { mode } = this.props;
    if (mode === 'update') {
      return handleBeforeCut(...args);
    }
    return false;
  };

  handleBeforeInput = (editorState, onChange, text) => {
    const { mode, structure } = this.props;
    if (mode === 'update') {
      if (structure === 'title') {
        return this.handleTitleUpdateInsert(editorState, onChange, text);
      }
      return handleBeforeInput(editorState, onChange, text);
    }
    if (structure === 'title') {
      return this.handleTitleInsert(editorState, onChange, text);
    }
    return false;
  };

  handlePastedText = (...args) => {
    const { mode, structure } = this.props;
    if (mode === 'update') {
      if (structure === 'title') {
        return this.handleTitleUpdateInsert(...args);
      }
      return handlePastedText(...args);
    }
    if (this.props.structure === 'title') {
      return this.handleTitleInsert(...args);
    }
    return _defaultHandlePastedText(...args);
  };

  handleReturn = (...args) => {
    const { structure, mode } = this.props;
    if (structure === 'title' || structure === 'summary') {
      // TO_ENHANCE: may add message...
      return 'handled';
    }
    if (mode === 'update') {
      return handleReturn(...args);
    }
    return false;
  };

  handleKeyCommand = (...args) => {
    const { mode } = this.props;
    if (mode === 'update') {
      return handleKeyCommand(...args);
    }
    return undefined;
  };

  handleToggleBlockType = (...args) => {
    const { mode } = this.props;
    if (mode === 'update') {
      return handleToggleBlockType(...args);
    }
    return undefined;
  };

  handleToggleInlineStyle = (...args) => {
    const { mode } = this.props;
    if (mode === 'update') {
      return handleToggleInlineStyle(...args);
    }
    return undefined;
  };

  renderMaxLegthHint() {
    const { editorState } = this.props;
    const currentText = getConfirmedText(
      getHTML(editorState.getCurrentContent()),
    ).length;

    if (MAX_TITLE_LENGTH - currentText < 10) {
      return (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            color: MAX_TITLE_LENGTH === currentText ? '#cc0000' : '#da9d00',
            paddingTop: 6,
          }}
        >
          {currentText} / {MAX_TITLE_LENGTH}
        </div>
      );
    }
    return null;
  }

  render() {
    const { mode, className, currentUser, structure, ...props } = this.props;
    return (
      <>
        <Editor
          className={classNames('DimzouEditor', className)}
          ref={(n) => {
            this.editor = n;
          }}
          handleBeforeCut={this.handleBeforeCut}
          handleBeforeInput={this.handleBeforeInput}
          handlePastedText={this.handlePastedText}
          handleReturn={this.handleReturn}
          handleKeyCommand={this.handleKeyCommand}
          handleToggleBlockType={this.handleToggleBlockType}
          handleToggleInlineStyle={this.handleToggleInlineStyle}
          customStyleMap={dimzouStyleMap}
          stripPastedStyles={structure !== 'content'}
          {...props}
        />
        {structure === 'title' && this.renderMaxLegthHint()}
      </>
    );
  }
}

DimzouEditor.propTypes = {
  className: PropTypes.string,
  mode: PropTypes.oneOf(['create', 'update']),
  currentUser: PropTypes.object.isRequired,
  structure: PropTypes.oneOf(['title', 'summary', 'content']),
};

export default DimzouEditor;

export const createFromRawData = (raw) => _createFromRawData(raw, decorator);
export const createEmpty = () => createFromRawData(emptyRaw);
export const createEmptyWithFocus = () => {
  const editorState = createEmpty();
  return EditorState.moveFocusToEnd(editorState);
};
export const createFromHTML = (html) =>
  createWithContent(contentStateFromHTML(html, stateFromHTMLConfig), decorator);
export const createFromHTMLWithFocus = (html) => {
  const editorState = createFromHTML(html);
  return EditorState.moveFocusToEnd(editorState);
};

export const getHTML = (contentState) =>
  contentStateToHTML(contentState, stateToHTMLConfig);

export const getTextContent = (contentState) => contentState.getPlainText();

export const tryToSyncFocus = (editorState) => {
  const selObj = window.getSelection();
  const { anchorNode, anchorOffset } = selObj;
  if (!anchorNode) {
    return editorState;
  }
  const anchorText = anchorNode.nodeValue;

  const text = editorState
    .getCurrentContent()
    .getFirstBlock()
    .getText();
  let i = 0;
  let blockNode = anchorNode;
  while (i < 5) {
    if (!blockNode) {
      break;
    }
    if (blockNode.innerText === text) {
      break;
    } else {
      blockNode = blockNode.parentElement;
    }
    i += 1;
  }
  let anchorNodeOffset = 0;
  if (blockNode && anchorNode !== blockNode) {
    anchorNodeOffset = blockNode.innerText.indexOf(anchorText);
    const offset = anchorNodeOffset + anchorOffset;

    return EditorState.forceSelection(
      editorState,
      editorState.getSelection().merge({
        anchorOffset: offset,
        focusOffset: offset,
      }),
    );
  }
  return editorState;
};

export function applyRemoveAnnotation(html) {
  // TODO: handle empty html
  const editorState = createFromHTML(html);
  const contentState = editorState.getCurrentContent();
  const blocks = contentState.getBlockMap();
  const selection = editorState.getSelection();
  const nextContentState = blocks.reduce((state, block) => {
    const fullSelection = selection.merge({
      anchorKey: block.getKey(),
      focusKey: block.getKey(),
      anchorOffset: 0,
      focusOffset: block.getText().length,
    });
    return applyDeleteAnnotation(state, fullSelection);
  }, contentState);

  const content = convertToRaw(nextContentState);
  const htmlContent = getHTML(nextContentState);
  return {
    content,
    htmlContent,
  };
}

export const convertToRaw = _convertToRaw;

function getExternalRootWrap(node) {
  const parent = node.parentNode;
  if (parent.childNodes.length > 1) {
    return node;
  }
  return getExternalRootWrap(parent);
}

export const clearHTML = (html, replaceH1 = false) => {
  if (!html) {
    return html;
  }
  const dom = document.createElement('div');
  dom.innerHTML = html;

  // clear anchor;
  const anchors = dom.querySelectorAll('a');
  Array.prototype.forEach.call(anchors, (anchor) => {
    const span = document.createElement('span');
    span.innerHTML = anchor.innerHTML;
    anchor.replaceWith(span);
  });

  // clear image;
  const externals = dom.querySelectorAll('img,video,iframe');
  Array.prototype.forEach.call(externals, (el) => {
    const node = getExternalRootWrap(el);
    node.parentNode.removeChild(node);
  });

  // replace header-one
  if (replaceH1) {
    // replace title;
    const h1s = dom.querySelectorAll('h1');
    Array.prototype.forEach.call(h1s, (title) => {
      // eslint-disable-next-line no-param-reassign
      const h2 = document.createElement('h2');
      h2.innerHTML = title.innerHTML;
      title.replaceWith(h2);
    });
  }

  // replace title;
  const h4 = dom.querySelectorAll('h4');
  Array.prototype.forEach.call(h4, (title) => {
    // eslint-disable-next-line no-param-reassign
    const strong = document.createElement('strong');
    strong.innerHTML = title.innerHTML;
    title.replaceWith(strong);
  });

  return dom.innerHTML;
};
