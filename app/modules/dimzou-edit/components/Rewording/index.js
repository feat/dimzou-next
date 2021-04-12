import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import { getAvatar, getUsername } from '@/modules/user/utils';
import commonMessages from '@/messages/common';

import Avatar from '@feat/feat-ui/lib/avatar/Avatar';

import ActionButton from '@/components/ActionButton';
import RewordingCommentBundle from '../RewordingCommentBundle';
import DimzouEditor from '../DimzouEditor';
import RewordingLikeWidget from '../RewordingLike';
import RewordingCommentTrigger from '../RewordingCommentTrigger';
import RewordingVersion from '../RewordingVersion';
import InvitationTrigger from '../InvitationTrigger';
import PubDate from '../PubDate';

import { REWORDING_STATUS_PENDING } from '../../constants';
import RewordingPreviewWidget from '../RewordingPreviewWidget';
import intlMessages from '../../messages';

import './style.scss';

class Rewording extends React.Component {
  renderEditMode() {
    const { currentUser, showAvatar, uiState = {} } = this.props;
    return (
      <div
        className={classNames(
          'dz-RewordingSection dz-RewordingSection_pending',
        )}
      >
        <div className={classNames('dz-Rewording dz-Rewording_pending')}>
          <div className="dz-Rewording__para">
            {/* 修改序号(版本) */}
            {/* {this.props.count - this.props.index} */}
          </div>
          <div className="dz-Rewording__main">
            <div className="dz-Rewording__flexbox">
              <div className="dz-Rewording__flexbox_item">
                <div className="dz-Rewording__userInfo">
                  {showAvatar && (
                    <div className="">
                      <Avatar
                        round
                        size="xxs"
                        avatar={getAvatar(currentUser, 'md')}
                      />
                    </div>
                  )}
                  <span className="dz-Rewording__username">
                    {getUsername(currentUser) || (
                      <FormattedMessage {...commonMessages.anonymous} />
                    )}
                  </span>
                  <span className="margin_l_12 dz-Rewording__expertise">
                    {currentUser.expertise}
                  </span>
                  <span className="margin_l_12">
                    <FormattedMessage {...intlMessages.editing} />
                  </span>
                </div>
                <div className="dz-Rewording__content">
                  <DimzouEditor
                    className="dz-Typo dz-ContentEditRegion"
                    editorState={uiState.editorState}
                    mode={uiState.editorMode}
                    onChange={this.props.onEditorChange}
                    currentUser={currentUser}
                  />
                </div>
              </div>
            </div>
            <div className="dz-Rewording__footer dz-RewordingFooter">
              <div className="dz-RewordingFooter__right">
                <ActionButton
                  className="dz-RewordingFooter__action"
                  type="no"
                  onClick={this.props.exitEditMode}
                  disabled={uiState.submitting}
                />
                <ActionButton
                  className="dz-RewordingFooter__action"
                  type="ok"
                  onClick={this.props.onSubmit}
                  disabled={uiState.submitting}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderDisplayMode() {
    const {
      currentUser,
      bundleId,
      nodeId,
      structure,
      blockId,
      data,
      modifier,
      userCapabilities,
      onDrop,
      renderLevel,
      showAvatar,
      uiState,
      isElecting,
    } = this.props;
    const isCommentOpen = false;
    const { user } = data;
    const canElect =
      data.status === REWORDING_STATUS_PENDING && userCapabilities.canElect;
    return (
      <div
        className={classNames(
          `dz-RewordingSection dz-RewordingSection_${modifier}`,
        )}
      >
        <div className={classNames(`dz-Rewording dz-Rewording_${modifier}`)}>
          <div className="dz-Rewording__main">
            <div className="dz-Rewording__flexbox">
              <div className="dz-Rewording__flexbox_item">
                <div className="dz-Rewording__userInfo">
                  {showAvatar && (
                    <div className="dz-Rewording__userAvatar">
                      <Avatar round size="xxs" avatar={getAvatar(user, 'md')} />
                    </div>
                  )}
                  <span className="dz-Rewording__username">
                    {user.username || user.uid}
                  </span>
                  <span className="margin_l_12 dz-Rewording__expertise">
                    {user.expertise}
                  </span>
                  <span className="margin_l_12 dz-Rewording__date">
                    <PubDate
                      date={data.last_modified || data.create_time}
                      format="yy MM dd HH:mm"
                    />
                  </span>
                </div>
                <div className="dz-Rewording__content">
                  <RewordingPreviewWidget
                    className="dz-ContentPreviewRegion"
                    data={data}
                    onDrop={onDrop}
                    onRemove={this.props.onRemove}
                    onClick={this.props.tryToEnterEditMode}
                    isSubmittingFile={uiState.isSubmittingFile}
                    fileSubmitting={uiState.fileSubmitting}
                    renderLevel={renderLevel}
                    canElect={userCapabilities.canElect}
                    onElect={this.props.onElect}
                    currentUser={this.props.currentUser}
                  />
                </div>
              </div>
            </div>
            <div className="dz-Rewording__footer dz-RewordingFooter">
              <div className="dz-RewordingFooter__left">
                {data.submit_version && (
                  <span className="dz-RewordingFooter__action">
                    <RewordingVersion version={data.submit_version - 1} />
                  </span>
                )}
                <span className="dz-RewordingFooter__action">
                  <RewordingCommentTrigger
                    currentUser={currentUser}
                    rewordingId={data.id}
                    initialCount={data.comments_count || 0}
                    isActive={isCommentOpen}
                    onClick={this.props.toggleCommentPanel}
                  />
                </span>
                <span className="dz-RewordingFooter__action">
                  <RewordingLikeWidget
                    bundleId={bundleId}
                    nodeId={nodeId}
                    structure={structure}
                    blockId={blockId}
                    rewordingId={data.id}
                    rewordingLikesCount={data.likes_count}
                  />
                </span>
                {userCapabilities.canInviteCollaborator && (
                  <span className="dz-RewordingFooter__action">
                    <InvitationTrigger
                      bundleId={bundleId}
                      nodeId={nodeId}
                      structure={structure}
                      blockId={blockId}
                      rewordingId={data.id}
                      htmlContent={data.html_content}
                      username={user.username}
                      userExpertise={user.expertise}
                    />
                  </span>
                )}
              </div>
              <div className="dz-RewordingFooter__right">
                {canElect && (
                  <span className="dz-RewordingFooter__action">
                    <ActionButton
                      type="no"
                      onClick={this.props.onReject}
                      disabled={isElecting}
                    />
                  </span>
                )}
                {canElect && (
                  <span className="dz-RewordingFooter__action">
                    <ActionButton
                      type="ok"
                      onClick={this.props.onElect}
                      disabled={isElecting}
                    />
                  </span>
                )}
              </div>
            </div>
            <RewordingCommentBundle
              bundleId={this.props.bundleId}
              nodeId={this.props.nodeId}
              structure={this.props.structure}
              blockId={this.props.blockId}
              rewordingId={data.id}
              rootCount={data.comments_count}
              shouldRender
              isCommentActive={uiState.isCommentPanelOpened}
              initialData={data.comments}
              entityCapabilities={{
                canComment: true,
                commentLimit: 1,
                maxReplyLimit: 1,
              }}
              onCommentFormSubmit={this.props.toggleCommentPanel}
            />
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { uiState } = this.props;
    if (uiState.isEditModeEnabled) {
      return this.renderEditMode();
    }
    return this.renderDisplayMode();
  }
}

Rewording.propTypes = {
  index: PropTypes.number,
  bundleId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  nodeId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  structure: PropTypes.string,
  blockId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  userCapabilities: PropTypes.object,
  data: PropTypes.object,
  currentUser: PropTypes.object,
  modifier: PropTypes.string,
  renderLevel: PropTypes.oneOf(['origin', 'block', 'rewording']),
  onElect: PropTypes.func,
  onReject: PropTypes.func,
  isElecting: PropTypes.bool, // from block state
  uiState: PropTypes.shape({
    editorState: PropTypes.object,
    editorMode: PropTypes.string,
    isCommentPanelOpened: PropTypes.bool,
    isEditModeEnabled: PropTypes.bool,
    submitting: PropTypes.bool,
    isSubmittingFile: PropTypes.bool,
    fileSubmitting: PropTypes.object,
  }),
  onEditorChange: PropTypes.func,
  onDrop: PropTypes.func,
  onSubmit: PropTypes.func,
  exitEditMode: PropTypes.func,
  toggleCommentPanel: PropTypes.func,
  tryToEnterEditMode: PropTypes.func,
  showAvatar: PropTypes.bool,
};

// TEMP hack
Rewording.defaultProps = {
  modifier: 'pending',
  uiState: {
    isCommentPanelOpened: false,
    editorState: null,
    editorInitialContent: undefined,
  },
};

export default Rewording;
