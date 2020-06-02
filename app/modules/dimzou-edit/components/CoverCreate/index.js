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
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import SimpleCache from '@/services/cache';
import { formatMessage } from '@/services/intl';
import { getText } from '@/utils/content';

import DimzouEditor, {
  createFromRawData,
  createFromHTML,
  getHTML,
  clearHTML,
} from '../DimzouEditor';
import { copyright as cpMessages, validation as vMessages } from '../../messages';
import './style.scss';
import CoverTemplate from '../CoverTemplate';
import ImageDropzone from '../ImageDropzone';


const initTitleRaw = {
  blocks: [{ type: 'header-one', text: '' }],
  entityMap: {},
};

const initSummaryRaw = {
  blocks: [{ type: 'unstyled', text: '' }],
  entityMap: {},
};

class CoverCreate extends Component {
  constructor(props) {
    super(props);
    this.cache = new SimpleCache({
      cacheKey: props.cacheKey,
      userId: props.currentUser.uid,
    });

    this.state = {
      titleEditorState: this.cache.get('title')
        ? createFromHTML(this.cache.get('title'))
        : createFromRawData(initTitleRaw),
      summaryEditorState: this.cache.get('summary')
        ? createFromHTML(this.cache.get('summary'))
        : createFromRawData(initSummaryRaw),
      cover: null,
      isSubmitting: false,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    if (this.titleEditor) {
      this.titleEditor.focus();
    }
  }

  componentDidCatch() {
    this.forceUpdate();
  }

  handleTitleEditor = (titleEditorState) => {
    this.setState({ titleEditorState });
    this.cache.set('title', getHTML(titleEditorState.getCurrentContent()));
  };

  handleSummaryEditor = (summaryEditorState) => {
    this.setState({ summaryEditorState });
    this.cache.set('summary', getHTML(summaryEditorState.getCurrentContent()));
  };

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
          this.setState({
            summaryEditorState: EditorState.moveFocusToEnd(summaryEditorState),
          });
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
    }
    return 'handled';
  };

  handleSummaryReturn = () => 'handled'

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

  handleImageDropzone = (data) => {
    this.setState({
      cover: data,
    })
  }

  handleCancel = () => {
    this.cache.flush();
    this.props.onCancel();
  };

  handleSubmit = () => {
    const titleContentState = this.state.titleEditorState.getCurrentContent();
    const summaryContentState = this.state.summaryEditorState.getCurrentContent();
    const htmlTitle = getHTML(titleContentState);
    const title = convertToRaw(titleContentState);
    const htmlSummary = getHTML(summaryContentState);
    const summary = convertToRaw(summaryContentState);
    

    const data = {
      title,
      htmlTitle,
      summary,
      htmlSummary,
      cover: this.state.cover,
    };

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

    const { titlePlaceholder, summaryPlaceholder, currentUser } = this.props;
    const { isSubmitting } = this.state;

    return (
      <CoverTemplate 
        title={
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
        }
        cover={
          <ImageDropzone 
            ratio={16/9} 
            data={this.state.cover}
            onConfirm={this.handleImageDropzone}
          />
        }
        summary={
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
        }
        copyright={
          <TranslatableMessage 
            message={cpMessages.year} 
            values={{
              year: new Date().getFullYear(),
            }}
          />
        }
        extra={
          <div
            style={{ position: 'absolute', bottom: 36, right: 44 }}
          >
            <IconButton
              svgIcon="no-btn"
              size="md"
              disabled={isSubmitting}
              onClick={this.handleCancel}
            />
            <IconButton
              svgIcon="ok-btn"
              size="md"
              className="margin_l_24"
              onClick={this.handleSubmit}
              disabled={!isReady || isSubmitting}
            />
          </div>
        }
      />
    )
  }
}

CoverCreate.propTypes = {
  onSubmit: PropTypes.func.isRequired, // Promise
  onCancel: PropTypes.func,
  titlePlaceholder: PropTypes.node,
  summaryPlaceholder: PropTypes.node,
  currentUser: PropTypes.object.isRequired,
  cacheKey: PropTypes.string,
};

CoverCreate.defaultProps = {
  cacheKey: 'dimzou-create',
};

export default CoverCreate;
