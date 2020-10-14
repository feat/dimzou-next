import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import IconButton from '@feat/feat-ui/lib/button/IconButton';
import Avatar from '@feat/feat-ui/lib/avatar/Avatar';
// import SvgIcon from '@feat/feat-ui/lib/svg-icon';

import { formatMessage } from '@/services/intl';
import { getAvatar, getUsername } from '@/utils/user';

import {
  EDIT_MODE_ORIGIN,
  EDIT_MODE_TRANSLATION,
  BLOCK_EXPANDED_SECTION_COMMENTS,
  BLOCK_EXPANDED_SECTION_VERSIONS,
  // BLOCK_STATUS_DELETED,
  REWORDING_STATUS_DELETED,
  BLOCK_STATUS_PENDING,
  // BLOCK_STATUS_ACCEPTED,
} from '../../constants';

import DraggableBlockContent from '../DraggableBlockContent';
import BlockSectionFooter from '../BlockSectionFooter';
import DimzouEditor from '../DimzouEditor';
import PubDate from '../PubDate';
import RewordingList from './RewordingList';
// import BlockTailingWidget from '../BlockTailingWidget';
import RewordingCommentBundle from '../RewordingCommentBundle';
import { useMeasure } from '../../context';

import intlMessages from '../../messages';

import './style.scss';

export default function ContentBlockRender(props) {
  const {
    bundleId,
    nodeId,
    structure,
    blockId,
    name,
    mode,
    blockState,
    classifiedRewordings,
    info,
    currentUser,
    userCapabilities,
    blockUserMeta,
    editorPlaceholder,

    style,

    removeBlock,
    toggleExpanded,
    enterEditMode,
    exitEditMode,
    postRewording,
    postMediaRewording,
    updateEditor,

    contentSuffix,
  } = props;
  const domRef = useRef(null);
  useMeasure([blockState, classifiedRewordings]);

  const {
    currentVersion,
    candidateVersions,
    historicVersions,
    rejectedVersions,
    hasLockedVersion,
  } = classifiedRewordings;
  const { isEditModeEnabled } = blockState;

  const status = !currentVersion ? BLOCK_STATUS_PENDING : undefined;
  const blockIsAccepted =
    currentVersion && currentVersion.status !== REWORDING_STATUS_DELETED;

  const blockIsDeleted =
    currentVersion &&
    currentVersion.status === REWORDING_STATUS_DELETED &&
    !(candidateVersions && candidateVersions.length);
  // const { canEdit, canAppendContent } = userCapabilities;

  const className = classNames(
    'dz-BlockSection',
    `dz-BlockSection_${structure}`,
    {
      'dz-BlockSection_origin': mode === EDIT_MODE_ORIGIN,
      'dz-BlockSection_translation': mode === EDIT_MODE_TRANSLATION,
      'dz-BlockSection_todo': mode === EDIT_MODE_TRANSLATION && !currentVersion,
      'dz-BlockSection_deleted': blockIsDeleted,
      'has-current': currentVersion,
    },
  );

  return (
    <div
      ref={domRef}
      name={name}
      className={className}
      style={style}
      // data-structure={structure}
      // data-id={blockId}
    >
      <div className="dz-BlockSection__anchor" id={name} />
      {(!currentVersion || mode === EDIT_MODE_TRANSLATION) && (
        <div className="dz-BlockSection__paraNum">{props.sort}</div>
      )}
      <div className="dz-BlockSection__wrapper">
        <div className="dz-BlockSection__main">
          {/* origin */}
          {mode === EDIT_MODE_TRANSLATION &&
            info &&
            info.origin && (
            <div className="dz-BlockSection__origin">
              <DraggableBlockContent
                disabled
                rewording={{ html_content: info.origin, is_origin: true }}
                onClick={enterEditMode}
                onDrop={postMediaRewording}
                renderLevel="origin"
                isSubmittingFile={blockState.isSubmittingFileFromOrigin}
                fileSubmitting={blockState.fileSubmitting}
                contentSuffix={contentSuffix}
              />
            </div>
          )}
          {/* main */}
          {isEditModeEnabled &&
            blockState.editorState && (
            <div className="dz-BlockSection__current dz-BlockSectionCurrent">
              <div className="dz-BlockSectionCurrent__avatar">
                <Avatar size="sm" avatar={getAvatar(currentUser, 'md')} />
                {mode === EDIT_MODE_ORIGIN && (
                  <div className="dz-BlockSection__paraNum">{props.sort}</div>
                )}
                {currentVersion &&
                    currentUser.uid !== currentVersion.user.uid && (
                  <div className="dz-BlockSectionCurrent__avatar_origin">
                    {/* <SvgIcon icon="sort" /> */}
                    <Avatar
                      size="sm"
                      avatar={getAvatar(currentVersion.user, 'md')}
                    />
                  </div>
                )}
              </div>
              <div className="dz-BlockSectionCurrent__main">
                <div className="dz-BlockSectionCurrent__userInfo">
                  <span className="dz-BlockSectionCurrent__username">
                    {getUsername(currentUser)}
                  </span>
                  <span className="dz-BlockSectionCurrent__expertise">
                    {currentUser.expertise}
                  </span>
                  <FormattedMessage {...intlMessages.editing} />
                </div>
                <DimzouEditor
                  className="typo-Article"
                  structure={structure}
                  mode={blockState.editorMode}
                  editorState={blockState.editorState}
                  onChange={updateEditor}
                  placeholder={editorPlaceholder}
                  currentUser={currentUser}
                />
              </div>
            </div>
          )}
          {isEditModeEnabled &&
            blockState.isFetchingTranslation && (
            <div className="dz-BlockSection__loadingPlaceholder" />
          )}
          {isEditModeEnabled && (
            <div className="dz-BlockSectionFooter">
              <div className="dz-BlockSectionFooter__left" />
              <div className="dz-BlockSectionFooter__right">
                {!blockState.isEditModeForced && (
                  <IconButton
                    className="dz-BlockSectionFooter__btn"
                    svgIcon="no-btn"
                    size="md"
                    onClick={exitEditMode}
                    disabled={blockState.submitting}
                  />
                )}
                <IconButton
                  className="dz-BlockSectionFooter__btn"
                  svgIcon="ok-btn"
                  size="md"
                  onClick={postRewording}
                  disabled={blockState.submitting}
                />
              </div>
            </div>
          )}
          {!isEditModeEnabled &&
            currentVersion && (
            <div className="dz-BlockSection__current dz-BlockSectionCurrent">
              <div className="dz-BlockSectionCurrent__avatar">
                <Avatar
                  size="sm"
                  uid={currentVersion.user.uid}
                  avatar={getAvatar(currentVersion.user, 'md')}
                />
                {mode === EDIT_MODE_ORIGIN && (
                  <div className="dz-BlockSection__paraNum">{props.sort}</div>
                )}
              </div>
              <div className="dz-BlockSectionCurrent__main">
                <div className="dz-BlockSectionCurrent__userInfo">
                  <span className="dz-BlockSectionCurrent__username">
                    {getUsername(currentVersion.user)}
                  </span>
                  <span className="dz-BlockSectionCurrent__expertise">
                    {currentVersion.user.expertise}
                  </span>
                  <span className="dz-BlockSectionCurrent__date">
                    <PubDate
                      date={
                        currentVersion.last_modified ||
                          currentVersion.create_time
                      }
                      format="yy MM dd HH:mm"
                    />
                  </span>
                </div>
                <DraggableBlockContent
                  blockId={blockId}
                  sort={props.sort}
                  disabled={structure !== 'content' || !userCapabilities.canEdit}
                  rewording={currentVersion}
                  onRemove={removeBlock}
                  onClick={enterEditMode}
                  onDrop={postMediaRewording}
                  renderLevel="block"
                  isSubmittingFile={blockState.isSubmittingFile}
                  fileSubmitting={blockState.fileSubmitting}
                  contentSuffix={contentSuffix}
                />
              </div>
            </div>
          )}
          {!isEditModeEnabled &&
            currentVersion && (
            <BlockSectionFooter
              currentUser={currentUser}
              bundleId={bundleId}
              nodeId={nodeId}
              structure={structure}
              blockId={blockId}
              currentVersion={currentVersion}
              historyCount={historicVersions.length}
              expandedType={blockState.expandedType}
              canInvite={userCapabilities.canInviteCollaborator}
              toggleExpanded={toggleExpanded}
            />
          )}
          {/* footer */}
          {!!candidateVersions.length && (
            <>
              {currentVersion && (
                <div className="dz-BlockSection__sectionTitle">
                  {formatMessage(intlMessages.candidate)}
                </div>
              )}
              <RewordingList
                data={candidateVersions}
                type="pending"
                bundleId={bundleId}
                nodeId={nodeId}
                structure={structure}
                blockId={blockId}
                blockStatus={status}
                currentUser={currentUser}
                userCapabilities={userCapabilities}
                userHasPendingRewording={!!blockUserMeta.pendingRewording}
                isElecting={blockState.electingRewording}
                onItemDrop={postMediaRewording}
                showAvatar={!blockIsAccepted}
                hasLockedVersion={hasLockedVersion}
                contentSuffix={contentSuffix}
              />
            </>
          )}
          {!currentVersion &&
            !!rejectedVersions.length && (
              <>
                <div className="dz-BlockSection__sectionTitle">
                  {formatMessage(intlMessages.abandoned)}
                </div>
                <RewordingList
                  data={rejectedVersions}
                  type="rejected"
                  bundleId={bundleId}
                  nodeId={nodeId}
                  structure={structure}
                  blockId={blockId}
                  blockStatus={status}
                  currentUser={currentUser}
                  userCapabilities={userCapabilities}
                  userHasPendingRewording={!!blockUserMeta.pendingRewording}
                  isElecting={blockState.electingRewording}
                  onItemDrop={postMediaRewording}
                  showAvatar={!blockIsAccepted}
                  hasLockedVersion={hasLockedVersion}
                  contentSuffix={contentSuffix}
                />
              </>
          )}
          {currentVersion && (
            <>
              <div
                className={classNames({
                  'dz-BlockSection__line': currentVersion.comments_count,
                })}
              />
              <RewordingCommentBundle
                key={currentVersion.id}
                bundleId={bundleId}
                nodeId={nodeId}
                structure={structure}
                blockId={blockId}
                rewordingId={currentVersion.id}
                rootCount={currentVersion.comments_count}
                shouldRender
                isCommentActive={
                  blockState.expandedType === BLOCK_EXPANDED_SECTION_COMMENTS
                }
                initialData={currentVersion.comments}
                entityCapabilities={{
                  canComment: true,
                  commentLimit: 1,
                  maxReplyLimit: 1,
                }}
              />
            </>
          )}
          {blockState.expandedType === BLOCK_EXPANDED_SECTION_VERSIONS && (
            <React.Fragment>
              {!!historicVersions.length && (
                <div
                  className={classNames('dz-rewordings', {
                    isHide:
                      blockState.isVersions &&
                      blockState.expandedType !==
                        BLOCK_EXPANDED_SECTION_VERSIONS,
                  })}
                >
                  {/* <div className="dz-BlockSection__sectionTitle">
                    {formatMessage(intlMessages.archived)}
                  </div> */}
                  <RewordingList
                    data={historicVersions}
                    type="history"
                    bundleId={bundleId}
                    nodeId={nodeId}
                    structure={structure}
                    blockId={blockId}
                    blockStatus={status}
                    currentUser={currentUser}
                    userCapabilities={userCapabilities}
                    userHasPendingRewording={!!blockUserMeta.pendingRewording}
                    isElecting={blockState.electingRewording}
                    onItemDrop={postMediaRewording}
                    hasLockedVersion={hasLockedVersion}
                    contentSuffix={contentSuffix}
                    isVersionList
                  />
                </div>
              )}
              {currentVersion &&
                !!rejectedVersions.length && (
                  <>
                    <div className="dz-BlockSection__sectionTitle">
                      {formatMessage(intlMessages.abandoned)}
                    </div>
                    <RewordingList
                      data={rejectedVersions}
                      type="rejected"
                      bundleId={bundleId}
                      nodeId={nodeId}
                      structure={structure}
                      blockId={blockId}
                      blockStatus={status}
                      currentUser={currentUser}
                      userCapabilities={userCapabilities}
                      userHasPendingRewording={!!blockUserMeta.pendingRewording}
                      isElecting={blockState.electingRewording}
                      onItemDrop={postMediaRewording}
                      hasLockedVersion={hasLockedVersion}
                      contentSuffix={contentSuffix}
                    />
                  </>
              )}
            </React.Fragment>
          )}
        </div>
      </div>
      {/* {canEdit && structure === 'content' &&
        canAppendContent &&
        blockIsAccepted && (
          <BlockTailingWidget
            bundleId={props.bundleId}
            nodeId={props.nodeId}
            blockId={props.blockId}
            sort={props.sort}
            userCapabilities={userCapabilities}
          />
        )} */}
    </div>
  );
}

ContentBlockRender.propTypes = {
  bundleId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  nodeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  structure: PropTypes.string,
  blockId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  // status: PropTypes.number, // based on rewroding records.
  sort: PropTypes.number,
  mode: PropTypes.string,
  editorPlaceholder: PropTypes.node,
  blockState: PropTypes.object,
  // rewordings: PropTypes.array,
  classifiedRewordings: PropTypes.object,
  info: PropTypes.object,
  currentUser: PropTypes.object,
  userCapabilities: PropTypes.object,
  blockUserMeta: PropTypes.object,

  removeBlock: PropTypes.func,
  toggleExpanded: PropTypes.func,
  enterEditMode: PropTypes.func,
  exitEditMode: PropTypes.func,
  postRewording: PropTypes.func,
  postMediaRewording: PropTypes.func,
  updateEditor: PropTypes.func,
  name: PropTypes.string,
  contentSuffix: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  style: PropTypes.object,
};
