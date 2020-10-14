import React from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { createStructuredSelector } from 'reselect';
import { formatMessage } from '@/services/intl';

import message from '@feat/feat-ui/lib/message';

import {
  // electBlock,
  // rejectBlock,
  removeRewording,
  electRewording,
  rejectRewording,
  updateRewording,
  commitRewording,
  submitRewording,
  // ui
  openCommentPanel,
  closeCommentPanel,
  initRewordingEdit,
  exitRewordingEdit,
  updateRewordingEditor,
} from '../../actions';

import {
  selectRewordingState,
  selectRewordingCommentsCount,
  selectRewordingLikesCount,
} from '../../selectors';

import {
  BLOCK_STATUS_PENDING,
  REWORDING_STATUS_PENDING,
  REWORDING_WIDGET_IMAGE,
} from '../../constants';

import {
  createFromHTML,
  getHTML,
  convertToRaw,
  tryToSyncFocus,
} from '../DimzouEditor';

import {
  getConfirmedHTML,
  getConfirmedText,
  getBaseHTML,
} from '../../utils/content';

import Rewording from '../Rewording';
import { extractWidgetInfo, noInteration } from '../../utils/rewordings';
import { getNodeCache, rewordingKey } from '../../utils/cache';
import intlMessages from '../../messages';
import { MeasureContext } from '../../context';

class RewordingWrap extends React.PureComponent {
  componentDidUpdate(prevProps) {
    if (this.context && this.props.uiState !== prevProps.uiState) {
      this.context();
    }
  }

  handleElect = () => {
    // const creator =
    //   this.props.blockStatus === BLOCK_STATUS_PENDING
    //     ? electBlock
    //     : electRewording;
    const creator = electRewording;
    this.props.dispatch(
      creator({
        bundleId: this.props.bundleId,
        nodeId: this.props.nodeId,
        structure: this.props.structure,
        blockId: this.props.blockId,
        rewordingId: this.props.rewordingId,
      }),
    );
  };

  handleReject = () => {
    // const creator =
    //   this.props.blockStatus === BLOCK_STATUS_PENDING
    //     ? rejectBlock
    //     : rejectRewording;
    const creator = rejectRewording;
    this.props.dispatch(
      creator({
        bundleId: this.props.bundleId,
        nodeId: this.props.nodeId,
        structure: this.props.structure,
        blockId: this.props.blockId,
        rewordingId: this.props.rewordingId,
      }),
    );
  };

  openCommentPanel = () => {
    this.props.dispatch(
      openCommentPanel({
        rewordingId: this.props.rewordingId,
      }),
    );
  };

  closeCommentPanel = () => {
    this.props.dispatch(
      closeCommentPanel({
        rewordingId: this.props.rewordingId,
      }),
    );
  };

  toggleCommentPanel = () => {
    const { uiState = {} } = this.props;
    if (uiState.isCommentPanelOpened) {
      this.closeCommentPanel();
    } else {
      this.openCommentPanel();
    }
  };

  tryToEnterEditMode = () => {
    const {
      data,
      blockStatus,
      currentUser,
      dispatch,
      userHasPendingRewording,
      userCapabilities: { canEdit },
    } = this.props;

    if (!canEdit) {
      return;
    }

    const widgetInfo = extractWidgetInfo(data);

    if (data.status === REWORDING_STATUS_PENDING) {
      const recordUserId = data.user_id || get(data, 'user.uid');
      if (!noInteration(data)) {
        message.error({
          content: formatMessage(intlMessages.hasInteration),
        });
        return;
      }
      if (recordUserId === currentUser.uid) {
        if (widgetInfo.type === REWORDING_WIDGET_IMAGE) {
          message.info({
            content: formatMessage(intlMessages.imageRewordMethodHintForAdmin),
          });
        } else {
          const cache = getNodeCache(this.props.nodeId);
          const blockCache = cache.get(rewordingKey(this.props));
          const initialHTML = data.html_content;

          dispatch(
            initRewordingEdit({
              bundleId: this.props.bundleId,
              nodeId: this.props.nodeId,
              rewordingId: this.props.rewordingId,
              structure: this.props.structure,
              editorState: tryToSyncFocus(
                createFromHTML(get(blockCache, 'html', initialHTML)),
              ),
              updateBaseHTML: initialHTML,
              rewordBaseHTML: getBaseHTML(initialHTML),
              editorMode:
                blockStatus === BLOCK_STATUS_PENDING ? 'create' : 'update',
            }),
          );
        }
        return;
      }
      this.tryCount = (this.tryCount || 0) + 1;
      if (this.tryCount > 5) {
        message.info({
          content: formatMessage(intlMessages.canNotEditPendingRewording),
        });
      }
      return;
    }
    if (userHasPendingRewording) {
      message.error({
        content: formatMessage(intlMessages.hasPendingRewordForBlock),
      });
      return;
    }

    if (widgetInfo.type === REWORDING_WIDGET_IMAGE) {
      message.info({
        content: formatMessage(intlMessages.imageRewordMethodHint),
      });
    } else {
      const cache = getNodeCache(this.props.nodeId);
      const blockCache = cache.get(rewordingKey(this.props));
      const userUpdate =
        data.user.uid === currentUser.uid && noInteration(data);
      const initialHTML = userUpdate
        ? data.html_content
        : getConfirmedHTML(data.html_content);
      const editorState = tryToSyncFocus(
        createFromHTML(get(blockCache, 'html', initialHTML)),
      );
      dispatch(
        initRewordingEdit({
          bundleId: this.props.bundleId,
          nodeId: this.props.nodeId,
          rewordingId: this.props.rewordingId,
          baseId: userUpdate ? data.base_on : this.props.rewordingId,
          structure: this.props.structure,
          editorState,
          updateBaseHTML: initialHTML,
          rewordBaseHTML: getBaseHTML(initialHTML),
          editorMode: 'update',
        }),
      );
    }
  };

  exitEditMode = () => {
    this.props.dispatch(
      exitRewordingEdit({
        bundleId: this.props.bundleId,
        nodeId: this.props.nodeId,
        rewordingId: this.props.rewordingId,
      }),
    );
  };

  updateEditor = (editorState) => {
    this.props.dispatch(
      updateRewordingEditor({
        bundleId: this.props.bundleId,
        nodeId: this.props.nodeId,
        rewordingId: this.props.rewordingId,
        editorState,
      }),
    );
  };

  removeRewording = () => {
    const {
      dispatch,
      bundleId,
      nodeId,
      blockId,
      rewordingId,
      structure,
    } = this.props;
    const payload = {
      bundleId,
      nodeId,
      structure,
      blockId,
      rewordingId,
      trigger: 'rewording',
    };
    dispatch(removeRewording(payload));
  };

  submitRewording = () => {
    const {
      uiState: { editorState, updateBaseHTML, rewordBaseHTML },
      data,
      bundleId,
      nodeId,
      blockId,
      rewordingId,
      structure,
      userCapabilities,
      dispatch,
    } = this.props;
    const contentState = editorState.getCurrentContent();
    const htmlContent = getHTML(contentState);

    if (htmlContent === updateBaseHTML) {
      this.exitEditMode();
      message.info({
        content: formatMessage(intlMessages.nothingToUpdate),
      });
      return;
    }

    if (htmlContent === rewordBaseHTML) {
      message.info('Should have diff info');
      this.exitEditMode();
      return;
    }

    if (structure === 'title' && !getConfirmedText(htmlContent)) {
      message.info(formatMessage(intlMessages.titleTextRequired));
      return;
    }
    const content = convertToRaw(contentState);
    const payload = {
      bundleId,
      nodeId,
      structure,
      blockId,
      content,
      htmlContent,
      rewordingId,
      trigger: 'rewording',
    };
    const shouldUpdateRewording = data.status === REWORDING_STATUS_PENDING;

    if (!shouldUpdateRewording) {
      payload.baseId = data.base_on;
    }
    if (shouldUpdateRewording && !contentState.hasText()) {
      dispatch(removeRewording(payload));
    } else if (shouldUpdateRewording) {
      dispatch(updateRewording(payload));
    } else if (userCapabilities.canElect) {
      dispatch(commitRewording(payload));
    } else {
      dispatch(submitRewording(payload));
    }
  };

  render() {
    return (
      <Rewording
        {...this.props}
        onElect={this.handleElect}
        onReject={this.handleReject}
        tryToEnterEditMode={this.tryToEnterEditMode}
        exitEditMode={this.exitEditMode}
        onEditorChange={this.updateEditor}
        onSubmit={this.submitRewording}
        onRemove={this.removeRewording}
        toggleCommentPanel={this.toggleCommentPanel}
      />
    );
  }
}

RewordingWrap.contextType = MeasureContext;

const mapStateToProps = createStructuredSelector({
  uiState: selectRewordingState,
  rewordingCommentsCount: selectRewordingCommentsCount,
  rewordingLikesCount: selectRewordingLikesCount,
});

export default connect(mapStateToProps)(RewordingWrap);
