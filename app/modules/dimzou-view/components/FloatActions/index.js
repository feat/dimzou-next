import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import getConfig from 'next/config';
import { useRouter } from 'next/router';

import { useDraggable } from '@/services/dnd/hooks';
import Loader from '@feat/feat-ui/lib/loader';
import Button from '@feat/feat-ui/lib/button';
import Modal from '@feat/feat-ui/lib/modal';
import notification from '@feat/feat-ui/lib/notification';
import { getMessageInstance } from '@feat/feat-ui/lib/message';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import CommentBundle from '@/modules/comment/containers/CommentBundle';
import { COMMENTABLE_TYPE_PUBLICATION } from '@/modules/comment/constants';
import LikeWidget from '@/modules/like/containers/LikeWidget';
import { LIKABLE_TYPE_DIMZOU_PUBLICATION } from '@/modules/like/constants';
import ShareModal from '@/modules/share/components/ShareModal';
import { getAsPath } from '@/modules/dimzou-edit/utils/router';
import LanguageSelectModal from '@/modules/language/containers/LanguageSelectModal';

import { maxTextContent } from '@/utils/content';

import { useIntl } from 'react-intl';
import styles from './index.module.scss';
import intlMessages from '../../messages';

import {
  createTranslationBundle as createTranslationBundleRequest,
  createCopyBundle as createCopyBundleRequest,
} from '../../requests';

const canCreateCopy = (data) =>
  !data.bundle_is_multi_chapter ||
  (data.is_binding_publish && data.is_all_chapters_publish);

function FloatActions(props) {
  const { style, publication, currentUser, commentCapabilities } = props;
  const { formatMessage } = useIntl();
  const router = useRouter();
  const [isDragging, position, drag] = useDraggable({
    initialPosition: { bottom: 80, right: 80 },
    handleUpdate: (prePosition, delta) => ({
      bottom: prePosition.bottom - delta.y,
      right: prePosition.right - delta.x,
    }),
  });

  const computedStyle = useMemo(
    () => ({
      ...(style || {}),
      position: 'fixed',
      ...position,
      opacity: isDragging ? 0 : 1,
    }),
    [position, isDragging],
  );

  const [showCommentBoard, setShowCommentBoard] = useState(false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [isCreatingCopy, setIsCreatingCopy] = useState(false);
  const [showLocaleSelectModal, setShowLocaleSelectModal] = useState(false);
  const [isCreatingTranslation, setIsCreatingTranslation] = useState(false);

  const shareInfo = useMemo(
    () => {
      if (typeof window === 'undefined') {
        return {};
      }
      const { publicRuntimeConfig } = getConfig();
      const link = window.location.href;
      const source = publicRuntimeConfig.share.siteName;
      const summary = maxTextContent(publication.summary);
      const title = maxTextContent(publication.title);
      return {
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
    },
    [publication],
  );

  const handleCreateCopy = useCallback(async () => {
    setIsCreatingCopy(true);
    getMessageInstance().then((instance) => {
      instance.notice({
        key: 'dimzou-create-copy-hint',
        duration: 10,
        content: (
          <>
            <Loader size="xs" className="margin_r_12" />
            {formatMessage(intlMessages.creatingCopyHint)}
          </>
        ),
      });
    });
    try {
      const { data } = await createCopyBundleRequest(publication.bundle_id);
      const href = {
        pathname: '/dimzou-edit',
        query: {
          pageName: 'draft',
          bundleId: data.id,
        },
      };
      router.push(href, getAsPath(href)).then(() => {
        window.scrollTo(0, 0);
      });
    } catch (err) {
      notification.error({
        message: 'Error',
        description: err.message,
      });
      setIsCreatingCopy(false);
    } finally {
      getMessageInstance().then((instance) => {
        instance.removeNotice('dimzou-create-copy-hint');
      });
    }
  }, []);

  const handleCreateTranslation = useCallback(async (locale) => {
    setShowLocaleSelectModal(false);
    setIsCreatingTranslation(true);
    getMessageInstance().then((instance) => {
      instance.notice({
        key: 'dimzou-create-translation-hint',
        duration: null,
        content: (
          <>
            <Loader size="xs" className="margin_r_12" />
            formatMessage(intlMessages.creatingTranslationHint)
          </>
        ),
      });
    });
    try {
      const { data } = await createTranslationBundleRequest({
        source_type: 'dimzou_bundle',
        bundle_id: publication.bundle_id,
        node_id: publication.node_id,
        language: locale,
      });
      const href = {
        pathname: '/dimzou-edit',
        query: {
          pageName: 'draft',
          bundleId: data.id,
        },
      };
      router.push(href, getAsPath(href)).then(() => {
        window.scrollTo(0, 0);
      });
    } catch (err) {
      notification.error({
        message: 'Error',
        description: err.message,
      });
      setIsCreatingTranslation(false);
    } finally {
      getMessageInstance().then((instance) => {
        instance.removeNotice('dimzou-create-translation-hint');
      });
    }
  });

  return (
    <div style={computedStyle} className={styles.container}>
      <Modal
        isOpen={openShareModal}
        onClose={() => {
          setOpenShareModal(false);
        }}
        maskClosable
      >
        <ShareModal shareInfo={shareInfo} />
      </Modal>

      <LanguageSelectModal
        isOpen={showLocaleSelectModal}
        shouldDisable={(lang) => lang === publication.language}
        onClose={() => {
          setShowLocaleSelectModal(false);
        }}
        onConfirm={handleCreateTranslation}
      />

      {showCommentBoard && (
        <div className={styles.commentBoard}>
          <CommentBundle
            autoFocus
            pageLayout={false}
            entityCapabilities={commentCapabilities}
            entityType={COMMENTABLE_TYPE_PUBLICATION}
            entityId={publication.id}
            instanceKey={`float-publication-detail.${publication.id}`}
            initialData={publication.comments}
            initialRootCount={publication.comments_count}
            channel={`activity-comment-publication-${publication.id}`}
          />
        </div>
      )}

      <div ref={drag} className={styles.actions}>
        <Button
          className={classNames(styles.actionBtn, {
            [styles.isActive]: showCommentBoard,
          })}
          onClick={() => {
            setShowCommentBoard(!showCommentBoard);
          }}
        >
          <TranslatableMessage message={intlMessages.commentLabel} />
        </Button>
        {canCreateCopy(publication) && (
          <Button
            className={styles.actionBtn}
            disabled={isCreatingCopy}
            onClick={handleCreateCopy}
          >
            <TranslatableMessage message={intlMessages.modifyLabel} />
          </Button>
        )}
        <Button
          className={styles.actionBtn}
          disabled={isCreatingTranslation}
          onClick={() => {
            setShowLocaleSelectModal(true);
          }}
        >
          <TranslatableMessage message={intlMessages.translateLabel} />
        </Button>
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
        >
          {({ canLike, userHasLiked, onClick }) => (
            <Button
              type="merge"
              className={classNames(styles.actionBtn, {
                [styles.hasLiked]: userHasLiked,
              })}
              onClick={onClick}
              disabled={!canLike}
            >
              <TranslatableMessage message={intlMessages.likeLabel} />
            </Button>
          )}
        </LikeWidget>
        <Button
          className={styles.actionBtn}
          onClick={() => {
            setOpenShareModal(true);
          }}
        >
          <TranslatableMessage message={intlMessages.shareLabel} />
        </Button>
      </div>
    </div>
  );
}

export default FloatActions;
