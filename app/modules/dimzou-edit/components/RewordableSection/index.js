import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';

import get from 'lodash/get';

import { formatMessage } from '@/services/intl';
import message from '@feat/feat-ui/lib/message';

import {
  classifyRewordings,
  extractWidgetInfo,
  noInteration,
  hasLockedRewording,
} from '../../utils/rewordings';
import {
  EDIT_MODE_ORIGIN,
  EDIT_MODE_TRANSLATION,
  REWORDING_STATUS_PENDING,
  REWORDING_WIDGET_IMAGE,
} from '../../constants';

import {
  commitRewording,
  submitRewording,
  updateRewording,
  submitMediaRewording,
  commitMediaRewording,
  updateMediaRewording,
  removeBlock,
  initBlockEdit,
  exitBlockEdit,
  updateBlockEditor,
  toggleBlockExpanded,
  initBlockEditWithTranslation,
  updateBlockState,
} from '../../actions';
import { selectBlockState } from '../../selectors';
import {
  createFromHTML,
  tryToSyncFocus,
  convertToRaw,
  getHTML,
  applyRemoveAnnotation,
} from '../DimzouEditor';
import {
  getConfirmedHTML,
  getConfirmedText,
  getBaseHTML,
} from '../../utils/content';

import preparePreview from '../../utils/preparePreview';
import intlMessages from '../../messages';
import { getNodeCache, blockKey } from '../../utils/cache';

class RewordableSection extends React.Component {
  componentDidUpdate(prevProps) {
    Object.entries(this.props).forEach(
      ([key, val]) =>
        prevProps[key] !== val &&
        logging.debug(`BlockId: ${this.props.blockId}, Prop '${key}' changed`),
    );
  }

  shouldComponentUpdate(prevProps) {
    const diffProps = [];
    Object.entries(this.props).forEach(
      ([key, val]) => prevProps[key] !== val && diffProps.push(key),
    );
    if (diffProps.length === 1 && diffProps[0] === 'sort') {
      return false;
    }
    if (diffProps.length === 1 && diffProps[0] === 'editorPlaceholder') {
      return false;
    }
    return !!diffProps.length;
  }

  initBlockEdit = (data) => {
    const { dispatch } = this.props;
    dispatch(initBlockEdit(data));
  };

  initBlockEditWithTranslation = (data) => {
    const { dispatch } = this.props;
    dispatch(initBlockEditWithTranslation(data));
  };

  exitBlockEdit = () => {
    const { dispatch } = this.props;
    dispatch(
      exitBlockEdit({
        nodeId: this.props.nodeId,
        blockId: this.props.blockId,
        structure: this.props.structure,
      }),
    );
  };

  updateBlockEditor = (editorState) => {
    const { dispatch } = this.props;
    dispatch(
      updateBlockEditor({
        nodeId: this.props.nodeId,
        blockId: this.props.blockId,
        structure: this.props.structure,
        editorState,
      }),
    );
  };

  updateBlockState = (data) => {
    const { dispatch } = this.props;
    dispatch(
      updateBlockState({
        bundleId: this.props.bundleId,
        nodeId: this.props.nodeId,
        structure: this.props.structure,
        blockId: this.props.blockId,
        ...data,
      }),
    );
  };

  toggleExpanded = (data) => {
    const { dispatch } = this.props;
    dispatch(
      toggleBlockExpanded({
        nodeId: this.props.nodeId,
        blockId: this.props.blockId,
        structure: this.props.structure,
        expandedType: data,
      }),
    );
  };

  postRewording = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { blockState, structure } = this.props;
    const {
      editorState,
      editorBaseId,
      updateBaseHTML,
      rewordBaseHTML,
      editorInitWithTranslation,
    } = blockState;

    const contentState = editorState.getCurrentContent();
    const htmlContent = getHTML(contentState);

    // should have update
    if (htmlContent === updateBaseHTML && !editorInitWithTranslation) {
      message.info({
        content:
          blockState.editorMode === 'create'
            ? formatMessage(intlMessages.nothingToSubmit)
            : formatMessage(intlMessages.nothingToUpdate),
      });
      if (!blockState.isEditModeForced) {
        this.exitBlockEdit();
      }
      return undefined;
    }

    // should has diff
    if (rewordBaseHTML === htmlContent) {
      message.info(formatMessage(intlMessages.diffFromRewordBase));
      if (!blockState.isEditModeForced) {
        this.exitBlockEdit();
      }
      return undefined;
    }

    //
    if (structure === 'title' && !getConfirmedText(htmlContent)) {
      message.info(formatMessage(intlMessages.titleTextRequired));
      return undefined;
    }

    if (structure === 'summary' && !getConfirmedText(htmlContent)) {
      message.info(formatMessage(intlMessages.summaryTextRequired));
      return undefined;
    }

    const content = convertToRaw(contentState);

    if (
      blockState.editorMode === 'create' &&
      !contentState.getPlainText().trim()
    ) {
      return this.removeFreeBlock();
    }

    return this.postEditorRewording({
      baseId: editorBaseId,
      updateRewording: blockState.updateRewording,
      content,
      htmlContent,
    });
  };

  postMediaRewording = ({ rewording, files, trigger }) => {
    const {
      dispatch,
      userCapabilities,
      classifiedRewordings,
      currentUser,
      userCapabilities: { canEdit },
    } = this.props;
    const file = files[0];

    if (!canEdit) {
      return;
    }

    preparePreview(file).then(() => {
      const payload = {
        bundleId: this.props.bundleId,
        nodeId: this.props.nodeId,
        structure: this.props.structure,
        blockId: this.props.blockId,
        baseId: get(classifiedRewordings, 'currentVersion.id', 0),
        file,
        trigger,
      };
      let creator;
      if (
        rewording.status === REWORDING_STATUS_PENDING &&
        rewording.user_id === currentUser.uid
      ) {
        creator = updateMediaRewording;
        payload.rewordingId = rewording.id;
      } else if (userCapabilities.canElect) {
        creator = commitMediaRewording;
        payload.rewordingId = rewording.id;
      } else {
        creator = submitMediaRewording;
        payload.rewordingId = rewording.id;
      }
      dispatch(creator(payload));
    });
  };

  postCoverRewording = (payload) => {
    const { blockState, dispatch, userCapabilities } = this.props;
    if (userCapabilities.canElect) {
      dispatch(
        commitRewording({
          bundleId: this.props.bundleId,
          nodeId: this.props.nodeId,
          structure: this.props.structure,
          blockId: this.props.blockId,
          baseId: blockState.cropperBaseId,
          ...payload,
          trigger: 'block',
        }),
      );
    } else if (blockState.updateRewording) {
      dispatch(
        updateRewording({
          bundleId: this.props.bundleId,
          nodeId: this.props.nodeId,
          structure: this.props.structure,
          blockId: this.props.blockId,
          rewordingId: blockState.cropperBaseId,
          ...payload,
          trigger: 'block', // for ui update
        }),
      );
    } else {
      dispatch(
        submitRewording({
          bundleId: this.props.bundleId,
          nodeId: this.props.nodeId,
          structure: this.props.structure,
          blockId: this.props.blockId,
          baseId: blockState.cropperBaseId,
          ...payload,
          trigger: 'block', // for ui update
        }),
      );
    }
  };

  postEditorRewording = (data) => {
    const { dispatch, userCapabilities } = this.props;
    const {
      content,
      htmlContent,
      baseId,
      updateRewording: isUpdatingRewording,
    } = data;
    if (userCapabilities.canElect) {
      dispatch(
        commitRewording({
          bundleId: this.props.bundleId,
          nodeId: this.props.nodeId,
          structure: this.props.structure,
          blockId: this.props.blockId,
          baseId,
          content,
          htmlContent,
          trigger: 'block', // for ui update
          cacheKey: blockKey(this.props),
        }),
      );
    } else if (isUpdatingRewording) {
      dispatch(
        updateRewording({
          bundleId: this.props.bundleId,
          nodeId: this.props.nodeId,
          structure: this.props.structure,
          blockId: this.props.blockId,
          rewordingId: baseId,
          content,
          htmlContent,
          trigger: 'block', // for ui update
          cacheKey: blockKey(this.props),
        }),
      );
    } else {
      dispatch(
        submitRewording({
          bundleId: this.props.bundleId,
          nodeId: this.props.nodeId,
          structure: this.props.structure,
          blockId: this.props.blockId,
          baseId,
          content,
          htmlContent,
          trigger: 'block', // for ui update
          cacheKey: blockKey(this.props),
        }),
      );
    }
  };

  removeFreeBlock() {
    const { structure, dispatch } = this.props;
    if (structure === 'title' || structure === 'summary') {
      message.error(formatMessage(intlMessages.shouldNotBeEmpty));
      return;
    }
    dispatch(
      removeBlock({
        bundleId: this.props.bundleId,
        nodeId: this.props.nodeId,
        structure: this.props.structure,
        blockId: this.props.blockId,
        trigger: 'block',
        // rewordingId: data.rewordingId,
      }),
    );
  }

  enterEditMode = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const {
      blockId,
      mode,
      info,
      blockState,
      blockUserMeta,
      currentUser,
      // rewordings,
      userCapabilities: { canEdit },
      classifiedRewordings: { currentVersion },
    } = this.props;
    if (!canEdit) {
      return;
    }
    if (blockState.isEditModeEnabled) {
      return;
    }
    if (blockUserMeta.pendingRewording) {
      if (noInteration(blockUserMeta.pendingRewording)) {
        this.initBlockEdit({
          nodeId: this.props.nodeId,
          structure: this.props.structure,
          blockId: this.props.blockId,
          basedOn: blockUserMeta.pendingRewording.base_on,
          updateRewording: true,
          editorState: createFromHTML(
            blockUserMeta.pendingRewording.html_content,
          ),
          rewordBaseHTML: getBaseHTML(
            blockUserMeta.pendingRewording.html_content,
          ),
          updateBaseHTML: blockUserMeta.pendingRewording.html_content,
          editorMode: !blockUserMeta.pendingRewording.base_on
            ? 'create'
            : 'update',
        });
      } else {
        message.error({
          content: formatMessage(intlMessages.hasInteration),
        });
      }
    } else if (currentVersion) {
      const cache = getNodeCache(this.props.nodeId);
      const blockCache = cache && cache.get(blockKey(this.props));
      // const hasNoInteration = noInteration(currentVersion) && !rewordings.some((r) => r.base_on === currentVersion.id);
      const hasNoInteration = noInteration(currentVersion);
      const isRewordAuthor = currentVersion.user.uid === currentUser.uid;
      const canUpdate = hasNoInteration && isRewordAuthor;

      const initialHTML = canUpdate
        ? currentVersion.html_content
        : getConfirmedHTML(currentVersion.html_content);
      const editorState = tryToSyncFocus(
        createFromHTML(get(blockCache, 'html', initialHTML)),
      );

      let editorMode = 'update';
      if (canUpdate && currentVersion.version === 1) {
        editorMode = 'create';
      }
      this.initBlockEdit({
        nodeId: this.props.nodeId,
        structure: this.props.structure,
        blockId: this.props.blockId,
        basedOn: canUpdate ? currentVersion.base_on : currentVersion.id,
        editorState,
        rewordBaseHTML: canUpdate
          ? getBaseHTML(currentVersion.html_content)
          : getConfirmedHTML(currentVersion.html_content),
        updateBaseHTML: initialHTML,
        editorMode,
      });
    } else if (mode === EDIT_MODE_TRANSLATION) {
      // Block is already initialized
      this.initBlockEditWithTranslation({
        nodeId: this.props.nodeId,
        translation: info.translation,
        blockId,
        structure: this.props.structure,
        editorMode: 'create',
        basedOn: 0,
      });
    }
  };

  exitBlockEditMode = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.exitBlockEdit();
  };

  removeBlock = (rewording) => {
    const widgetInfo = extractWidgetInfo(rewording);
    const { currentUser } = this.props;
    if (
      !hasLockedRewording(this.props.rewordings) &&
      rewording.user.uid === currentUser.uid
    ) {
      this.removeFreeBlock();
    } else if (widgetInfo.type === REWORDING_WIDGET_IMAGE) {
      this.props.dispatch(
        removeBlock({
          bundleId: this.props.bundleId,
          nodeId: this.props.nodeId,
          structure: 'content',
          blockId: this.props.blockId,
          rewordingId: rewording.id,
        }),
      );
    } else {
      const confirmed = getConfirmedHTML(rewording.html_content);
      const contentData = applyRemoveAnnotation(confirmed, {
        userId: this.props.currentUser.uid,
        username: this.props.currentUser.username,
      });
      contentData.baseId = rewording.id;
      this.postEditorRewording(contentData);
    }
  };

  render() {
    const { render: Render, ...props } = this.props;
    if (!this.props.blockState) {
      return null;
    }
    if (props.structure === 'cover') {
      return (
        <Render
          {...props}
          initBlockEdit={this.initBlockEdit}
          exitBlockEdit={this.exitBlockEdit}
          postCoverRewording={this.postCoverRewording}
          updateBlockState={this.updateBlockState}
        />
      );
    }

    return (
      <Render
        {...props}
        enterEditMode={this.enterEditMode}
        exitEditMode={this.exitBlockEditMode}
        removeBlock={this.removeBlock}
        updateEditor={this.updateBlockEditor}
        toggleExpanded={this.toggleExpanded}
        postRewording={this.postRewording}
        postMediaRewording={this.postMediaRewording}
      />
    );
  }
}

RewordableSection.propTypes = {
  render: PropTypes.func.isRequired,
  bundleId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  nodeId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  blockId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  structure: PropTypes.oneOf(['title', 'summary', 'content', 'cover']),
  status: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  info: PropTypes.object,
  userCapabilities: PropTypes.object,
  mode: PropTypes.oneOf([EDIT_MODE_ORIGIN, EDIT_MODE_TRANSLATION]),
  sort: PropTypes.number,
  rewordings: PropTypes.array,
  blockState: PropTypes.object,
  currentUser: PropTypes.object,
  // calc
  blockUserMeta: PropTypes.object,
  classifiedRewordings: PropTypes.object,

  dispatch: PropTypes.func,
};

RewordableSection.defaultProps = {
  rewordings: [],
};

const makeClassifiedRewordingsSelector = () =>
  createSelector(
    (_, props) => props.rewordings,
    (rewordings) => classifyRewordings(rewordings),
  );

const makeSelectUserMeta = (selector) =>
  createSelector(
    selector,
    (_, props) => props.currentUser.uid,
    (classifiedRewordings, currentUserId) => {
      // logging.debug('calc block user meta');
      const userPendingRewording =
        currentUserId &&
        classifiedRewordings.candidateVersions.find(
          (record) =>
            record.user_id === currentUserId ||
            (record.user && record.user.uid === currentUserId),
        );
      return {
        pendingRewording: userPendingRewording,
      };
    },
  );

const mapStateToProps = () => {
  const classifiedRewordingsSelector = makeClassifiedRewordingsSelector();
  const userMetaSelector = makeSelectUserMeta(classifiedRewordingsSelector);
  return createStructuredSelector({
    classifiedRewordings: classifiedRewordingsSelector,
    blockState: selectBlockState,
    blockUserMeta: userMetaSelector,
  });
};

export default connect(mapStateToProps)(RewordableSection);
