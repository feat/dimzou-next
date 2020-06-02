import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { injectIntl } from 'react-intl';
import { withRouter } from 'next/router';
import { compose } from 'redux';

import Link from 'next/link';
import getConfig from 'next/config'
import moment from 'moment';

import { maxTextContent } from '@/utils/content';


import { selectLocales } from '@/modules/language/selectors';
import { selectCurrentUser } from '@/modules/auth/selectors';

import { COMMENTABLE_TYPE_PUBLICATION } from '@/modules/comment/constants';
import { LIKABLE_TYPE_DIMZOU_PUBLICATION } from '@/modules/like/constants';

import { getTemplateCoverRatio } from '@/modules/dimzou-edit/utils/template';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import {
  asyncCreateLocale,
  asyncFetchLocales,
} from '@/modules/language/actions';

import LazyImage from '@feat/feat-ui/lib/lazy-image';
import Modal from '@feat/feat-ui/lib/modal';
import Button from '@feat/feat-ui/lib/button';
import notification from '@feat/feat-ui/lib/notification';
import FeatModal from '@feat/feat-ui/lib/feat-modal';

import CommentBundle from '@/modules/comment/containers/CommentBundle';
import LikeWidget from '@/modules/like/containers/LikeWidget';
import SubscribeButton from '@/modules/subscription/SubscribeButton';
import RichContent from '@/components/RichContent';
import AvatarStamp from '@/containers/AvatarStamp';
import CategoryTags from '@/components/CategoryTags';
import SplashView from '@/components/SplashView';
import LanguageSelectModal from '@/modules/language/components/LanguageSelectModal';
import ShareModal from '@/modules/share/components/ShareModal';

import {
  TemplateI,
  TemplateII,
  TemplateIII,
  TemplateIV,
  TemplateV,
} from '@/modules/dimzou-edit/components/Template';

// import Recommendations from './Recommendations';
import WorksBrief from './WorksBrief';
import DragComment from './DragComment';

import { 
  createTranslationBundle as createTranslationBundleRequest,
  createCopyBundle as createCopyBundleRequest,
} from '../../requests';

import intlMessages from '../../messages';
import { makeSelectPublicationCategories, mapSelectPublication } from '../../selectors';
import { PUB_TYPE_CHAPTER } from '../../constants';
import './style.scss';
import { SUBSCRIPTION_ENTITY_TYPE_DIMZOU } from '../../../subscription/constants';

const canCreateCopy = (data) => !data.bundle_is_multi_chapter || (data.is_binding_publish && data.is_all_chapters_publish);

class ViewWork extends React.Component {
  state = {
    isTranslateLocaleSelectModalOpened: false,
    isShareModalOpened: false,
    isCommentModalOpened: false,
    isHide: true,
    likesCount: null,
  };

  componentDidMount() {
    if (!this.props.publication && this.props.loader) {
      this.props.loader();
    }
    window.addEventListener('scroll', this.footerListen);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.footerListen);
  }

  footerListen = () => {
    if (this.contentFooter) {
      const footerRect = this.contentFooter.getBoundingClientRect();
      const commentDragBox = document.querySelector('.comment__DragBox');
      if (this.props.isBook) {
        // eslint-disable-next-line no-restricted-globals
        const nodeId = location.pathname.split('/').reverse()[0];
        if (nodeId === String(this.props.publication.node_id)) {
          this.setState({
            isHide: true,
          });
        } else {
          this.setState({
            isHide: false,
          });
        }
      }
      if (commentDragBox && !this.props.isBook) {
        if (footerRect.bottom < window.innerHeight) {
          commentDragBox.style.display = 'none';
        } else {
          commentDragBox.style.display = 'block';
        }
      }
    }
  };

  handleCreateTranslation = (language) => {
    this.setState({
      isTranslateLocaleSelectModalOpened: false,
      isCreatingTranslation: true,
    });
    const { publication } = this.props;
    createTranslationBundleRequest({
      source_type: 'dimzou_bundle',
      bundle_id: publication.bundle_id,
      node_id: publication.node_id,
      language,
    })
      .then(({ data }) => {
        // TODO: may redirect to subNode;
        this.setState({
          isCreatingTranslation: false,
        });
        this.props.router.push(
          {
            pathname: '/dimzou-edit',
            query: { bundleId: data.id },
          },
          `/draft/${data.id}`,
        );
      })
      .catch((err) => {
        notification.error({
          message: 'Error',
          description: err.message,
        });
        this.setState({
          isCreatingTranslation: false,
        });
      });
  };

  handleCreateCopy = async () => {
    this.setState({
      isCreatingCopy: true,
    });
    const { publication } = this.props;
    try {
      const { data } =  await createCopyBundleRequest(publication.bundle_id);
      this.props.router.push(
        {
          pathname: '/dimzou-edit',
          query: { bundleId: data.id },
        },
        `/draft/${data.id}`,
      );
    } catch (err) {
      notification.error({
        message: 'Error',
        description: err.message,
      });
      this.setState({
        isCreatingCopy: false,
      });
    }
  }

  openShareModal = () => {
    this.setState({
      isShareModalOpened: true,
    });
  };

  closeShareModal = () => {
    this.setState({
      isShareModalOpened: false,
    });
  };

  getShareInfo = () => {
    const {
      publication,
      intl: { formatMessage },
    } = this.props;
    const { publicRuntimeConfig } = getConfig();
    const link = window.location.href;
    const source = publicRuntimeConfig.share.siteName;
    const summary = maxTextContent(publication.summary);
    const title = maxTextContent(publication.title);
    if (!this.shareInfo) {
      this.shareInfo = {
        link,
        source,
        sourceUrl: window.location.origin,
        twitterVia: publicRuntimeConfig.share.twitter.via,
        emailSubject: formatMessage(intlMessages.emailSubject, {
          title,
        }),
        emailBody: formatMessage(intlMessages.emailBody, {
          title,
          summary: summary.length > 60 ? `${summary.slice(0, 60)}...` : summary,
          source,
          link,
        }),
        shareText: formatMessage(intlMessages.shareText, {
          title,
          summary: summary.length > 60 ? `${summary.slice(0, 60)}...` : summary,
          source,
          link,
          author: publication.author.username,
          authorExpertise: publication.author.expertise,
        }),
      };
    }

    return this.shareInfo;
  };

  getInSitePath() {
    const {
      publication: { bundle_id: bundleId, pub_type: pubType, node_id: nodeId },
    } = this.props;
    if (pubType === PUB_TYPE_CHAPTER) {
      return `/dimzou/${bundleId}/${nodeId}`;
    }
    return `/dimzou/${bundleId}`;
  }

  renderTitle() {
    const { publication } = this.props;
    return (
      <h1 className="typo-Article__title">
        {maxTextContent(publication.title)}
      </h1>
    );
  }

  renderSummary() {
    const { publication } = this.props;
    return (
      <RichContent
        className="typo-Article__summary"
        html={publication.summary}
      />
    );
  }

  renderMeta() {
    const { publicationCategories } = this.props;
    return (
      <div className="typo-Article__meta">
        <CategoryTags className="pull-left" data={publicationCategories} />
      </div>
    );
  }

  handleReadFull = () => {
    this.props.clickReadFull(this.props.index);
    setTimeout(() => {
      document
        .querySelectorAll('[data-link]')
        [this.props.index].scrollIntoView();
    }, 0);
  };

  renderContent() {
    const { publication } = this.props;
    return (
      <div>
        <RichContent
          className="typo-Article__content"
          html={publication.content}
        />
      </div>
    );
  }

  renderReading() {
    const {
      publication,
      intl: { formatMessage },
    } = this.props;
    if (!publication.content) {
      return (
        <Link
          href={{
            pathname: '/dimzou-view',
            query: { bundleId: publication.bundle_id },
          }}
          as={`/dimzou/${publication.bundle_id}`}
        >
          <a className="dz-ViewWork__reading">
            {`>> ${formatMessage(intlMessages.continueReading)}`}
          </a>
        </Link>
      );
    }
    return null;
  }

  renderCover(template) {
    const { publication } = this.props;
    const ratio = getTemplateCoverRatio(template);
    const url = publication.cover;
    return <LazyImage className="dz-ViewWork__cover" ratio={ratio} src={url} />;
  }

  renderAvatar() {
    const { publication } = this.props;
    return (
      <div className="typo-Article__avatar" style={{ display: 'flex', alignItems: 'center' }}>
        <AvatarStamp
          {...publication.author}
          uiMeta={['expertise']}
          uiExtraMeta={['followButton', 'location']}
        />
        <SubscribeButton
          style={{ marginLeft: 10, borderRadius: 15, paddingLeft: 12, paddingRight: 12 }}
          type="user"
          targetId={publication.author.uid}
          entityType={SUBSCRIPTION_ENTITY_TYPE_DIMZOU}
          className='dz-ViewWork__subscribeBtn'
        />
      </div>
    );
  }

  renderRecommendations() {
    const {
      publication: { related },
      isBook,
    } = this.props;

    if (!related || !related.length || isBook) {
      return null;
    }
    return (
      <div className="dz-ViewWork__recommendations">
        {related.map((item) => (
          <WorksBrief publication={item} key={item.id} />
        ))}
      </div>
    );
  }

  openCommentBoard = () => {
    this.setState({
      isCommentModalOpened: !this.state.isCommentModalOpened,
    });
  };

  
  renderInfoFooter = () => {
    const {
      publication,
      intl: { formatMessage },
    } = this.props;
    const { comments_count, updated_at, likes_count } = publication;
    const { likesCount } = this.state;
    return (
      <div className="dz-ViewWork__footer">
        <div className="dz-ViewWork__infoFooter">
          <div className="dz-ViewWork__infoFooter_option">
            <span className="dz-ViewWork__infoFooter_label padding_r_5">
              {formatMessage(intlMessages.updateTime)}
            </span>
            <span className="dz-ViewWork__infoFooter_value">
              {moment(updated_at).format('YYYY-MM-DD')}
            </span>
          </div>
          <div className="dz-ViewWork__infoFooter_option">
            <span className="dz-ViewWork__infoFooter_label padding_r_5">
              {formatMessage(intlMessages.likesCount)}
            </span>
            <span className="dz-ViewWork__infoFooter_value">
              {likesCount !== null ? likesCount : likes_count}
            </span>
          </div>
          <div className="dz-ViewWork__infoFooter_option">
            <span className="dz-ViewWork__infoFooter_label padding_r_5">
              {formatMessage(intlMessages.reviewsCount)}
            </span>
            <span className="dz-ViewWork__infoFooter_value">
              {comments_count}
            </span>
          </div>
        </div>
      </div>
    );
  };

  
  renderFooter(isDraggable) {
    const {
      publication,
      locales,
      currentUser,
      // nodeSort,
      intl: { formatMessage },
    } = this.props;

    return (
      <div className="dz-ViewWork__footer">
        <div
          ref={(n) => {
            if (!isDraggable) {
              this.contentFooter = n;
            }
          }}
          className="dz-ViewWork__contentWrap dz-ViewWork__contentWrap_footer"
        >
          {isDraggable && (
            <div className="dz-ViewWork__toolBtn dz-ViewWork__commitBtn">
              <Button
                type={this.state.isCommentModalOpened ? 'primary' : 'merge'}
                onClick={this.openCommentBoard}
              >
                评论
              </Button>
            </div>
          )}
          {canCreateCopy(publication) && (
            <div className="dz-ViewWork__toolBtn">
              <Button type="merge" onClick={this.handleCreateCopy}>
                <TranslatableMessage message={intlMessages.modifyLabel} />
              </Button>
            </div>
          )}

          {/* Draft */}
          {/* <div className="dz-ViewWork__toolBtn">
            <Button
              type="merge"
              onClick={() => {
                const { bundle_id: bundleId } = publication;
                if (publication.pub_type === PUB_TYPE_CHAPTER) {
                  this.props.push(
                    {
                      pathname: '/dimzou-edit',
                      query: {
                        bundleId,
                        nodeSort,
                      },
                    },
                    `/draft/${bundleId}/${nodeSort}`,
                  );
                } else {
                  this.props.push(
                    {
                      pathname: '/dimzou-edit',
                      query: {
                        bundleId,
                      },
                    },
                    `/draft/${bundleId}`,
                  );
                }
              }}
            >
              <TranslatableMessage message={intlMessages.draftLabel} />
            </Button>
          </div> */}
          {currentUser && (
            <div className="dz-ViewWork__toolBtn">
              {/* <Tooltip
                placement="top"
                trigger="hover"
                title={formatMessage(intlMessages.translateLabel)}
                overlayStyle={{ zIndex: 9 }}
              >
                <IconButton
                  svgIcon="translate-v2"
                  onClick={() => {
                    this.setState({
                      isTranslateLocaleSelectModalOpened: true,
                    });
                  }}
                />
              </Tooltip> */}
              <Button
                type="merge"
                onClick={() => {
                  this.setState({
                    isTranslateLocaleSelectModalOpened: true,
                  });
                }}
              >
                {formatMessage(intlMessages.translateLabel)}
              </Button>
              <LanguageSelectModal
                isOpen={this.state.isTranslateLocaleSelectModalOpened}
                onClose={() => {
                  this.setState({
                    isTranslateLocaleSelectModalOpened: false,
                  });
                }}
                fetchLocales={this.props.fetchLocales}
                locales={locales}
                onConfirm={this.handleCreateTranslation}
              />
              <Modal isOpen={this.state.isCreatingTranslation}>
                <FeatModal>
                  <FeatModal.Header>
                    <FeatModal.Title>
                      <TranslatableMessage
                        message={intlMessages.creatingTranslationHint}
                      />
                    </FeatModal.Title>
                  </FeatModal.Header>
                </FeatModal>
              </Modal>
              <Modal isOpen={this.state.isCreatingCopy}>
                <FeatModal>
                  <FeatModal.Header>
                    <FeatModal.Title>
                      <TranslatableMessage
                        message={intlMessages.creatingCopyHint}
                      />
                    </FeatModal.Title>
                  </FeatModal.Header>
                </FeatModal>
              </Modal>
            </div>
          )}
          {/* --点赞-- */}
          {/* <Tooltip
            placement="topLeft"
            title={formatMessage(intlMessages.likeLabel)}
            trigger="hover"
            overlayStyle={{ zIndex: 9 }}
          > */}
          <div className="dz-ViewWork__toolBtn">
            <LikeWidget
              entityType={LIKABLE_TYPE_DIMZOU_PUBLICATION}
              entityId={publication.id}
              capabilities={{
                canLike:
                  currentUser &&
                  publication.author &&
                  currentUser.uid !== publication.author.uid,
              }}
              initialData={{
                userHasLiked: publication.current_user_has_liked,
                likes: publication.likes
                  ? publication.likes.map((item) => item.id)
                  : [],
                likesCount: publication.likes_count || 0,
              }}
              // type="withDetail"
              type="textBtn"
              returnLikesCount={this.handleCount}
            />
          </div>
          {/* </Tooltip> */}

          {/* --分享-- */}
          <div className="dz-ViewWork__toolBtn">
            {/* <Tooltip
              placement="top"
              title={formatMessage(intlMessages.shareLabel)}
              trigger="hover"
              overlayStyle={{ zIndex: 9 }}
            >
              <IconButton svgIcon="share" onClick={this.openShareModal} />
            </Tooltip> */}
            <Button type="merge" onClick={this.openShareModal}>
              {formatMessage(intlMessages.shareLabel)}
            </Button>
            {this.state.isShareModalOpened && (
              <Modal
                isOpen={this.state.isShareModalOpened}
                onClose={this.closeShareModal}
                maskClosable
              >
                <ShareModal shareInfo={this.getShareInfo()} />
              </Modal>
            )}
          </div>
        </div>
      </div>
    );
  }

  handleCount = (count) => {
    if (count !== undefined) {
      this.setState({
        likesCount: count,
      });
    }
  };

  renderCommentBundle() {
    const { publication, currentUser } = this.props;
    const canComment =
      currentUser &&
      publication.author &&
      publication.author.uid !== currentUser.uid;
    const isDraggable = true;
    const capabilities = {
      canComment,
      maxReplyLimit: 1,
      commentLimit: 1,
    };
    return (
      <div>
        <CommentBundle
          autoFocus
          entityCapabilities={capabilities}
          entityType={COMMENTABLE_TYPE_PUBLICATION}
          entityId={publication.id}
          instanceKey={`dimzou-publication-detail.${publication.id}`}
          initialData={publication.comments}
          initialRootCount={publication.comments_count}
          channel={`activity-comment-publication-${publication.id}`}
          wrapper={(state, content) => {
            if (
              state &&
              state.isInitialized &&
              !canComment &&
              state.rootCount === 0
            ) {
              return null;
            }
            return (
              <div className="dz-ViewWork__section dz-ViewWork__comment">
                {content}
              </div>
            );
          }}
        />
        {this.state.isHide && (
          <DragComment>
            {this.renderFooter(isDraggable)}
            {this.state.isCommentModalOpened && (
              <CommentBundle
                autoFocus
                entityCapabilities={capabilities}
                entityType={COMMENTABLE_TYPE_PUBLICATION}
                entityId={publication.id}
                instanceKey={`dimzou-publication-detail-aside.${publication.id}`}
                initialRootCount={publication.comments_count}
                initialData={publication.comments}
                channel={`activity-comment-publication-${publication.id}`}
                wrapper={(state, content) => {
                  if (
                    state &&
                    state.isInitialized &&
                    !canComment &&
                    state.rootCount === 0
                  ) {
                    return null;
                  }
                  return (
                    <div className="dz-ViewWork__section dz-ViewWork__comment">
                      {content}
                    </div>
                  );
                }}
              />
            )}
          </DragComment>
        )}
      </div>
    );
  }

  renderI() {
    return (
      <TemplateI
        data-link={this.getInSitePath()}
        cover={this.renderCover('I')}
        sidebarFirst={this.props.sidebarFirst}
        main={
          <div className="dz-ViewWork__main">
            <div className="dz-ViewWork__contentWrap typo-Article">
              {this.renderTitle()}
              {this.renderAvatar()}
              {this.renderMeta()}
              {this.renderSummary()}
              {this.renderContent()}
              {this.renderReading()}
            </div>
            {this.renderInfoFooter()}
            {this.renderCommentBundle()}
            {this.renderRecommendations()}
          </div>
        }
      />
    );
  }

  renderII() {
    return (
      <TemplateII
        data-link={this.getInSitePath()}
        cover={this.renderCover('II')}
        sidebarFirst={this.props.sidebarFirst}
        main={
          <div className="dz-ViewWork__main">
            <div className="dz-ViewWork__contentWrap typo-Article">
              {this.renderTitle()}
              {this.renderAvatar()}
              {this.renderMeta()}
              {this.renderSummary()}
              {this.renderContent()}
              {this.renderReading()}
            </div>

            {this.renderInfoFooter()}
            {this.renderCommentBundle()}
            {this.renderRecommendations()}
          </div>
        }
      />
    );
  }

  renderIII() {
    return (
      <TemplateIII
        data-link={this.getInSitePath()}
        cover={this.renderCover('III')}
        sidebarFirst={this.props.sidebarFirst}
        content={
          <div className="dz-ViewWork__main">
            <div className="dz-ViewWork__contentWrap typo-Article">
              {this.renderContent()}
            </div>
            {this.renderInfoFooter()}
            {this.renderCommentBundle()}
            {this.renderRecommendations()}
          </div>
        }
        titleSection={
          <div className="dz-ViewWork__titleSection typo-Article">
            {this.renderTitle()}
            {this.renderAvatar()}
            {this.renderMeta()}
            {this.renderSummary()}
            {this.renderReading()}
          </div>
        }
      />
    );
  }

  renderIV() {
    return (
      <TemplateIV
        data-link={this.getInSitePath()}
        cover={this.renderCover('IV')}
        sidebarFirst={this.props.sidebarFirst}
        main={
          <div className="dz-ViewWork__main">
            <div className="dz-ViewWork__contentWrap typo-Article">
              {this.renderTitle()}
              {this.renderAvatar()}
              {this.renderMeta()}
              {this.renderSummary()}
              {this.renderContent()}
              {this.renderReading()}
            </div>
            {this.renderInfoFooter()}
            {this.renderCommentBundle()}
            {this.renderRecommendations()}
          </div>
        }
      />
    );
  }

  renderV() {
    return (
      <TemplateV
        data-link={this.getInSitePath()}
        cover={this.renderCover('V')}
        sidebarFirst={this.props.sidebarFirst}
        main={
          <div className="dz-ViewWork__main">
            <div className="dz-ViewWork__contentWrap typo-Article">
              {this.renderTitle()}
              {this.renderAvatar()}
              {this.renderMeta()}
              {this.renderSummary()}
              {this.renderContent()}
              {this.renderReading()}
            </div>
            {this.renderInfoFooter()}
            {this.renderCommentBundle()}
            {this.renderRecommendations()}
          </div>
        }
      />
    );
  }

  render() {
    const { publication } = this.props;
    if (!publication) {
      if (!this.props.loader) {
        return <div>No Data To Render</div>;
      }
      if (this.props.loading) {
        return this.props.loading;
      }
      return <SplashView />;
    }

    return this[`render${publication.template || 'I'}`]();
  }
}

ViewWork.propTypes = {
  nodeSort: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  sidebarFirst: PropTypes.node,
  currentUser: PropTypes.object,
  publication: PropTypes.object,
  locales: PropTypes.array,
  fetchLocales: PropTypes.func,
  loader: PropTypes.func,
  loading: PropTypes.node,
  intl: PropTypes.object,
  onlyContent: PropTypes.func,
  router: PropTypes.object,
};

const mapStateToProps = () => {
  const selectPublication = mapSelectPublication();
  const selectPublicationCategories = makeSelectPublicationCategories(
    selectPublication,
  );

  return createStructuredSelector({
    currentUser: selectCurrentUser,
    publication: selectPublication,
    locales: selectLocales,
    publicationCategories: selectPublicationCategories,
  });
};

const withConnect = connect(
  mapStateToProps,
  {
    createLocale: asyncCreateLocale,
    fetchLocales: asyncFetchLocales,
  },
);



export default compose(
  injectIntl,
  withConnect,
  withRouter
)(ViewWork);
