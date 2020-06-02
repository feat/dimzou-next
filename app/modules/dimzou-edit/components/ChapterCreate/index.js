import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  convertToRaw,
  BlockMapBuilder,
  DefaultDraftBlockRenderMap,
  Modifier,
  SelectionState,
  EditorState,
} from '@feat/draft-js';
import DraftPasteProcessor from '@feat/draft-js/lib/DraftPasteProcessor';
import IconButton from '@feat/feat-ui/lib/button/IconButton';
import notification from '@feat/feat-ui/lib/notification';
import message from '@feat/feat-ui/lib/message';
import DragDropBoard from '@/components/DragDropBoard';

import SimpleCache from '@/services/cache';
import { formatMessage } from '@/services/intl';
import { getText } from '@/utils/content';

import DimzouEditor, {
  createFromRawData,
  createFromHTML,
  getHTML,
  clearHTML,
} from '../DimzouEditor';
import { validation as vMessages } from '../../messages';
import './style.scss';
import DimzouEditorToolbar from '../DimzouEditorToolbar';

const initTitleRaw = {
  blocks: [{ type: 'header-one', text: '' }],
  entityMap: {},
};

const initSummaryRaw = {
  blocks: [{ type: 'unstyled', text: '' }],
  entityMap: {},
};

const initContentRaw = {
  blocks: [{ type: 'unstyled', text: ''}],
  entityMap: {},
}

class ChapterCreate extends Component {
  constructor(props) {
    super(props);
    this.cache = new SimpleCache({
      cacheKey: props.cacheKey,
      userId: props.currentUser.uid,
    });
    this.shouldCache = true;

    this.state = {
      titleEditorState: this.cache.get('title')
        ? createFromHTML(this.cache.get('title'))
        : createFromRawData(initTitleRaw),
      summaryEditorState: this.cache.get('summary')
        ? createFromHTML(this.cache.get('summary'))
        : createFromRawData(initSummaryRaw),
      contentEditorState: this.cache.get('content')
        ? createFromHTML(this.cache.get('content'))
        : createFromRawData(initContentRaw),
      isSubmitting: false,
    };
  }

  componentDidMount() {
    if (this.titleEditor) {
      this.titleEditor.focus();
    }
  }

  componentDidCatch() {
    this.forceUpdate();
  }

  handleTitleEditor = (titleEditorState) => {
    this.setState({ titleEditorState });
    if (this.shouldCache) {
      this.cache.set('title', getHTML(titleEditorState.getCurrentContent()));
    }
  };

  handleSummaryEditor = (summaryEditorState) => {
    this.setState({ summaryEditorState });
    if (this.shouldCache) {
      this.cache.set('summary', getHTML(summaryEditorState.getCurrentContent()));
    }
  };

  handleContentEditor = (contentEditorState) => {
    this.setState({ contentEditorState });
    if (this.shouldCache) {
      this.cache.set('content', getHTML(contentEditorState.getCurrentContent()));
    }
  }

  handleTitleKeyCommand = (editorState, onChange, command) => {
    // block first block type change;
    if (command === 'backspace') {
      const content = editorState.getCurrentContent();
      if (
        content.getBlockMap().size === 1 &&
        content.getFirstBlock().getText().length === 0
      ) {
        return 'handled';
      }
    }
    return 'not-handled';
  };

  handleTitlePastedText = (editorState, onChange, text, html) => {
    if (html) {
      const htmlFragment = DraftPasteProcessor.processHTML(
        clearHTML(html),
        DefaultDraftBlockRenderMap,
      );
      if (htmlFragment) {
        const { contentBlocks, entityMap } = htmlFragment;
        if (contentBlocks.length === 1) {
          return 'not-handled';
        }
        const headerContentMap = BlockMapBuilder.createFromArray(
          contentBlocks.slice(0, 1),
        );
        let newContentState = Modifier.replaceWithFragment(
          editorState.getCurrentContent(),
          editorState.getSelection(),
          headerContentMap,
        );
        newContentState = newContentState.set('entityMap', entityMap);
        const firstBlock = newContentState.getFirstBlock();
        if (firstBlock.getType() !== 'header-one') {
          newContentState = Modifier.setBlockType(
            newContentState,
            new SelectionState({
              focusKey: firstBlock.getKey(),
              anchorKey: firstBlock.getKey(),
              anchorOffset: 0,
              focusOffset: 0,
            }),
            'header-one',
          );
        }
        const newEditorState = EditorState.push(
          editorState,
          newContentState,
          'insert-fragment',
        );
        this.setState({
          titleEditorState: newEditorState,
        });

        if (!this.state.summaryEditorState.getCurrentContent().hasText()) {
          const summaryContentMap = BlockMapBuilder.createFromArray(
            contentBlocks.slice(1, 2),
          );
          const newSummaryContent = Modifier.replaceWithFragment(
            this.state.summaryEditorState.getCurrentContent(),
            this.state.summaryEditorState.getSelection(),
            summaryContentMap,
          );
          const summaryEditorState = EditorState.push(
            this.state.summaryEditorState,
            newSummaryContent,
            'insert-fragment',
          );
          if (contentBlocks.length <= 2) {
            this.setState({
              summaryEditorState: EditorState.moveFocusToEnd(summaryEditorState),
            });
          } else {
            this.setState({ summaryEditorState });
            if (!this.state.contentEditorState.getCurrentContent().hasText()) {
              const contentMap = BlockMapBuilder.createFromArray(
                contentBlocks.slice(2),
              );
              const content = Modifier.replaceWithFragment(
                this.state.contentEditorState.getCurrentContent(),
                this.state.contentEditorState.getSelection(),
                contentMap,
              )
              const contentEditorState = EditorState.push(
                this.state.contentEditorState,
                content,
                'insert-fragment',
              );
              this.setState({
                contentEditorState: EditorState.moveFocusToEnd(contentEditorState),
              });
            }
          }
        }

        return 'handled';
      }
    }
    return 'not-handled';
  };

  handleTitleReturn = () => {
    const contentState = this.state.titleEditorState.getCurrentContent();
    if (contentState.hasText()) {
      this.summaryEditor.focus();
      return 'handled';
    }
    return 'not-handled';
  };

  handleSummaryReturn = () => {
    const contentState = this.state.summaryEditorState.getCurrentContent();
    if (contentState.hasText()) {
      this.contentEditor.focus();
      return 'handled';
    }
    return 'not-handled';
  }

  handleSummaryKeyCommand = (editorState, onChange, command) => {
    if (command === 'backspace') {
      const content = editorState.getCurrentContent();
      if (
        content.getBlockMap().size === 1 &&
        content.getFirstBlock().getText().length === 0
      ) {
        if (content.getFirstBlock().getType() !== 'unstyled') {
          const summaryEditorState =  EditorState.push(editorState, Modifier.setBlockType(content, editorState.getSelection(), 'unstyled'));
          this.setState({
            summaryEditorState,
          })
        } else {
          const titleEditorState = EditorState.moveFocusToEnd(this.state.titleEditorState);
          this.setState({ titleEditorState });
        }
        // this.titleEditor.focus();
        return 'handled';
      }
    }
    return 'not-handled';
  };

  handleContentKeyCommand = (editorState, onChange, command) => {
    if (command === 'backspace') {
      const content = editorState.getCurrentContent();
      if (
        content.getBlockMap().size === 1 &&
        content.getFirstBlock().getText().length === 0
      ) {
        if (content.getFirstBlock().getType() !== 'unstyled') {
          const contentEditorState =  EditorState.push(editorState, Modifier.setBlockType(content, editorState.getSelection(), 'unstyled'));
          this.setState({
            contentEditorState,
          })
        } else {
          const summaryEditorState = EditorState.moveFocusToEnd(this.state.summaryEditorState);
          this.setState({ summaryEditorState });
        }
        return 'handled';
      }
    }
    return 'not-handled';
  }


  resetEditor = () => {
    this.cache.flush();
    if (this.props.onCancel) {
      this.props.onCancel();
    } else {
      this.setState(
        {
          titleEditorState: EditorState.moveFocusToEnd(createFromRawData(initTitleRaw)),
          summaryEditorState: createFromRawData(initSummaryRaw),
          contentEditorState: createFromRawData(initContentRaw),
        }
      );
    }
  };

  handleSubmit = () => {
    const titleContentState = this.state.titleEditorState.getCurrentContent();
    const summaryContentState = this.state.summaryEditorState.getCurrentContent();
    const contentContentState = this.state.contentEditorState.getCurrentContent();
    const htmlTitle = getHTML(titleContentState);
    const title = convertToRaw(titleContentState);
    const htmlSummary = getHTML(summaryContentState);
    const summary = convertToRaw(summaryContentState);
    
    const data = {
      title,
      htmlTitle,
      summary,
      htmlSummary,
    };

    const textContent = contentContentState.getPlainText().trim();
    if (textContent) {
      data.content = convertToRaw(contentContentState);
      data.htmlContent = getHTML(contentContentState);
      data.textContent = textContent;
    }

    // validation
    const textTitle = getText(htmlTitle).trim();
    if (!textTitle) {
      message.error(formatMessage(vMessages.titleRequired));
      return;
    }
    const textSummary = getText(htmlSummary).trim();
    if (!textSummary) {
      message.error(formatMessage(vMessages.summaryRequired));
      return;
    }

    this.setState({
      isSubmitting: true,
    });
    this.props
      .onSubmit(data)
      .then(() => {
        logging.debug('flush cache');
        this.shouldCache = false; //
        this.cache.flush();
      })
      .catch((err) => {
        logging.debug(err);
        this.setState({
          isSubmitting: false,
        });
        notification.error({
          title: 'Error',
          message: err.message,
        });
      });
  };

  render() {
    const titleHasText = this.state.titleEditorState.getCurrentContent().getPlainText().trim();
    const summaryHasText = this.state.summaryEditorState.getCurrentContent().getPlainText().trim();

    const isReady = titleHasText && summaryHasText;

    const { titlePlaceholder, summaryPlaceholder, contentPlaceholder, currentUser, canCancel } = this.props;
    const { isSubmitting } = this.state;
    const footerStyle = !canCancel && !isReady ? { opacity: 0 } : undefined;

    let structure;
    let currentEditor;
    if (this.state.titleEditorState.getSelection().getHasFocus()) {
      structure = 'title';
      currentEditor = 'titleEditorState';
    } else if (this.state.summaryEditorState.getSelection().getHasFocus()) {
      structure = 'summary';
      currentEditor = 'summaryEditorState'
    } else if (this.state.contentEditorState.getSelection().getHasFocus()) {
      structure = 'content';
      currentEditor = 'contentEditorState';
    }

    return (
      <div className="typo-Article">
        <div className="dz-BlockSection dz-BlockSection_title">
          <DimzouEditor
            mode="create"
            ref={(c) => {
              this.titleEditor = c;
            }}
            placeholder={
              <div className="typo-Article__titlePlaceholder">
                {titlePlaceholder}
              </div>
            }
            handleKeyCommand={this.handleTitleKeyCommand}
            handleReturn={this.handleTitleReturn}
            editorState={this.state.titleEditorState}
            onChange={this.handleTitleEditor}
            currentUser={currentUser}
            handlePastedText={this.handleTitlePastedText}
          />
        </div>
        <div className="dz-BlockSection dz-BlockSection_summary">
          <div className="typo-Article">
            <DimzouEditor
              mode="create"
              ref={(c) => {
                this.summaryEditor = c;
              }}
              placeholder={summaryPlaceholder}
              handleKeyCommand={this.handleSummaryKeyCommand}
              handleReturn={this.handleSummaryReturn}
              editorState={this.state.summaryEditorState}
              onChange={this.handleSummaryEditor}
              currentUser={currentUser}
            />
          </div>
        </div>
        <div className="dz-BlockSection">
          <DimzouEditor
            mode="create"
            ref={(n) => {
              this.contentEditor = n;
            }}
            placeholder={contentPlaceholder}
            handleKeyCommand={this.handleContentKeyCommand}
            editorState={this.state.contentEditorState}
            onChange={this.handleContentEditor}
            currentUser={currentUser}
          />
        </div>
        <div
          className="dz-DimzouCreation__footer"
          style={footerStyle}
        >
          <IconButton
            svgIcon="no-btn"
            size="md"
            disabled={canCancel ? isSubmitting : (!isReady || isSubmitting)}
            onClick={this.resetEditor}
          />
          <IconButton
            svgIcon="ok-btn"
            size="md"
            className="margin_l_24"
            onClick={this.handleSubmit}
            disabled={!isReady || isSubmitting}
          />
        </div>
        <DragDropBoard>
          <div className="dz-EditDocker">
            <DimzouEditorToolbar 
              className="dz-EditDocker__section"
              structure={structure}
              editorState={this.state[currentEditor]}
              onChange={(editorState) => {
                this.setState({
                  [currentEditor]: editorState,
                })
              }}
              mode="create"
            />
          </div>
        </DragDropBoard>
      </div>
    );
  }
}

ChapterCreate.propTypes = {
  onSubmit: PropTypes.func.isRequired, // Promise
  onCancel: PropTypes.func,
  titlePlaceholder: PropTypes.node,
  summaryPlaceholder: PropTypes.node,
  contentPlaceholder: PropTypes.node,
  currentUser: PropTypes.object,
  canCancel: PropTypes.bool,
  cacheKey: PropTypes.string,
};

ChapterCreate.defaultProps = {
  cacheKey: 'dimzou-create',
};

export default ChapterCreate;
