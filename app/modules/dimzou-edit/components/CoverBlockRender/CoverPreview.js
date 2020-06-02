import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import get from 'lodash/get';

import IconButton from '@feat/feat-ui/lib/button/IconButton';

import RewordingLikeWidget from '../RewordingLike';
import RewordingCommentBundle from '../RewordingCommentBundle';
import RewordingCommentTrigger from '../RewordingCommentTrigger';

import { getTemplateCoverRatio } from '../../utils/template';
import { isPendingRecord, isRejectedRecord } from '../../utils/rewordings';
import { electRewording, rejectRewording } from '../../actions';

class CoverPreview extends React.PureComponent {
  state = {
    isCommentPanelOpened: false,
  };

  handleNavigationToggle = () => {
    const { isNavigatePanelOpened, toggleNavigatePanel } = this.props;
    toggleNavigatePanel(!isNavigatePanelOpened);
  };

  handleCommentPanelToggle = () => {
    const { isNavigatePanelOpened, toggleNavigatePanel } = this.props;
    if (isNavigatePanelOpened) {
      toggleNavigatePanel(false);
    }
    this.setState({
      isCommentPanelOpened: !this.state.isCommentPanelOpened,
    });
  };

  handleReject = () => {
    this.props.dispatch(
      rejectRewording({
        bundleId: this.props.bundleId,
        nodeId: this.props.nodeId,
        structure: this.props.structure,
        blockId: this.props.blockId,
        rewordingId: this.props.data.id,
      }),
    );
  };

  handleElect = () => {
    this.props.dispatch(
      electRewording({
        bundleId: this.props.bundleId,
        nodeId: this.props.nodeId,
        structure: this.props.structure,
        blockId: this.props.blockId,
        rewordingId: this.props.data.id,
      }),
    );
  };

  render() {
    const {
      data,
      template,
      canElect,
      candidateCount,
      historyCount,
      rejectedCount,
      isNavigatePanelOpened,
      isSelected,
      currentUser,
    } = this.props;

    const { crop_img: croppedImage, img } = data;
    const ratio = getTemplateCoverRatio(template);
    const templateData = get(data, ['template_config', template]);

    let style;
    if (templateData) {
      style = {
        width: '100%',
        paddingTop: `${100 / ratio}%`,
        backgroundImage: `url("${croppedImage}")`,
        backgroundSize: 'contain',
      };
    } else {
      style = {
        width: '100%',
        paddingTop: `${100 / ratio}%`,
        backgroundImage: `url("${img}")`,
      };
    }

    return (
      <div className="dz-CoverPreview" data-is-selected={isSelected}>
        <div
          className={classNames('dz-CoverPreview__image', {
            'dz-CoverPreview__image_cropped': Boolean(templateData),
            'dz-CoverPreview__image_pending': isPendingRecord(data),
            'dz-CoverPreview__image_rejected': isRejectedRecord(data),
          })}
          onClick={this.props.initEdit}
          style={style}
        />
        <div className="dz-CoverPreview__footer">
          <span className="margin_r_36">
            <IconButton
              className="margin_r_5"
              svgIcon="edition"
              isActive={isNavigatePanelOpened}
              onClick={this.handleNavigationToggle}
            />
            {[candidateCount, historyCount, rejectedCount].join(' | ')}
          </span>
          <span className="margin_r_36">
            <RewordingCommentTrigger
              currentUser={currentUser}
              rewordingId={data.id}
              initialCount={data.comments_count || 0}
              isActive={this.state.isCommentPanelOpened}
              onClick={this.handleCommentPanelToggle}
              userLimit={0}
            />
          </span>
          <span className="">
            <RewordingLikeWidget
              bundleId={this.props.bundleId}
              nodeId={this.props.nodeId}
              structure={this.props.structure}
              blockId={this.props.blockId}
              rewordingId={data.id}
              rewordingLikesCount={data.likes_count}
            />
          </span>
          {isPendingRecord(this.props.data) &&
            canElect && (
            <IconButton
              className="margin_l_36"
              svgIcon="no-btn"
              disabled={this.props.electingRewording}
              onClick={this.handleReject}
            />
          )}
          {isPendingRecord(this.props.data) &&
            canElect && (
            <IconButton
              className="margin_l_24"
              svgIcon="ok-btn"
              disabled={this.props.electingRewording}
              onClick={this.handleElect}
            />
          )}
          {this.state.isCommentPanelOpened && (
            <div 
              className="dz-CoverPreview__commentBundle"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <RewordingCommentBundle
                bundleId={this.props.bundleId}
                nodeId={this.props.nodeId}
                structure={this.props.structure}
                blockId={this.props.blockId}
                rewordingId={data.id}
                rootCount={data.comments_count}
                shouldRender
                pageLayout={false}
                isCommentActive={this.state.isCommentPanelOpened}
                initialData={data.comments}
                entityCapabilities={{ canComment: true, commentLimit: 1, maxReplyLimit: 1 }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

CoverPreview.propTypes = {
  bundleId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  nodeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  blockId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  structure: PropTypes.string,

  data: PropTypes.object,
  currentUser: PropTypes.object,
  canElect: PropTypes.bool,
  template: PropTypes.string,
  isSelected: PropTypes.bool, // ui targetd.

  candidateCount: PropTypes.number,
  historyCount: PropTypes.number,
  rejectedCount: PropTypes.number,

  isNavigatePanelOpened: PropTypes.bool,
  // isCommentPanelOpened: PropTypes.bool,
  electingRewording: PropTypes.bool,

  initEdit: PropTypes.func,
  toggleNavigatePanel: PropTypes.func,

  dispatch: PropTypes.func,
};

export default connect(null)(CoverPreview);
