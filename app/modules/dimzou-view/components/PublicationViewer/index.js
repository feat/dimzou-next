import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import moment from 'moment';

import BackButton from '@/components/BackButton';
import AvatarStamp from '@/containers/AvatarStamp';
import RichContent from '@/components/RichContent';
import { selectCurrentUser } from '@/modules/auth/selectors';
import CommentBundle from '@/modules/comment/containers/CommentBundle';
import CommentCount from '@/modules/comment/containers/CommentCount';
import { COMMENTABLE_TYPE_PUBLICATION } from '@/modules/comment/constants';

import LikeCount from '@/modules/like/containers/LikeCount';
import { LIKABLE_TYPE_DIMZOU_PUBLICATION } from '@/modules/like/constants';

import { maxTextContent } from '@/utils/content';

import {
  selectContentState,
  selectPublicationMetaState,
} from '../../selectors';

import { PUB_TYPE_COLLECTION, PUB_TYPE_WORK } from '../../constants';
import { getRender } from '../Renders';
import WorksBrief from '../WorksBrief';
import CategoryTags from '../CategoryTags';

import { BundleOutline, WorkOutline } from '../Outline';
import intlMessages from '../../messages';
import FloatActions from '../FloatActions';
import HashSpy from '../HashSpy';
import { ScrollContext } from '../../context';

// @NOTE: 浮动定位的内容（FloatActions、BackButton 等）不要放在 sidebarFirst 或者 sidebarSecond， 在 Safari 中可能会被隐藏掉
function PublicationViewer(props) {
  const { formatMessage } = useIntl();
  const { setHash } = useContext(ScrollContext);
  const metaState = useSelector((state) =>
    selectPublicationMetaState(state, props),
  );
  const contentState = useSelector((state) =>
    selectContentState(state, {
      bundleId: props.bundleId,
      nodeId: props.nodeId || metaState?.data?.node_id,
    }),
  );
  const currentUser = useSelector(selectCurrentUser);

  const meta = metaState?.data;
  const publication = contentState?.data?.publication;
  const categories = contentState?.data?.categories;

  const Render = getRender(publication);

  const title = publication && (
    <h1 className="dz-Typo__title">{maxTextContent(publication.title)}</h1>
  );
  const summary = publication && (
    <RichContent className="dz-Typo__summary" html={publication.summary} />
  );
  const content = publication && (
    <HashSpy
      selector="h2"
      onChange={(el) => {
        if (el) {
          const anchor = el.querySelector('[data-anchor]');
          if (anchor) {
            setHash(`#${anchor.getAttribute('id')}`);
          }
        } else {
          setHash('');
        }
        // setHash(el.getAttribute('id'));
      }}
    >
      {(ref) => <RichContent ref={ref} html={publication.content} />}
    </HashSpy>
  );

  let outline;
  if (!meta) {
    outline = null;
  } else if (meta.pub_type === PUB_TYPE_COLLECTION) {
    outline = <BundleOutline meta={meta} publication={publication} />;
  } else {
    outline = <WorkOutline publication={publication} />;
  }

  const author = publication &&
    publication.author && (
      <div className="dz-Typo__avatar">
        <AvatarStamp style={{ minWidth: 0 }} {...publication.author} />
      </div>
    );

  const commentCapabilities = {
    canComment: currentUser && publication?.author?.uid !== currentUser,
    maxReplyLimit: 1,
    commentLimit: 1,
  };

  const stats = publication && (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        paddingTop: 24,
        paddingBottom: 36,
        borderTop: '1px solid #ededed',
      }}
    >
      <div style={{ marginRight: 16 }}>
        <span className="padding_r_5">
          {formatMessage(intlMessages.updateTime)}
        </span>
        <span>{moment(publication.updated_at).format('YYYY-MM-DD')}</span>
      </div>
      <div style={{ marginRight: 16 }}>
        <span className="padding_r_5">
          {formatMessage(intlMessages.likesCount)}
        </span>
        <span>
          <LikeCount
            entityType={LIKABLE_TYPE_DIMZOU_PUBLICATION}
            entityId={publication.id}
          />
        </span>
      </div>
      <div style={{ marginRight: 16 }}>
        <span className="padding_r_5">
          {formatMessage(intlMessages.reviewsCount)}
        </span>
        <span>
          <CommentCount
            entityType={COMMENTABLE_TYPE_PUBLICATION}
            entityId={publication.id}
          />
        </span>
      </div>
    </div>
  );

  const comment = publication && (
    <CommentBundle
      entityCapabilities={commentCapabilities}
      entityType={COMMENTABLE_TYPE_PUBLICATION}
      entityId={publication.id}
      instanceKey={`dimzou-publication-detail.${publication.id}`}
      initialData={publication.comments}
      initialRootCount={publication.comments_count}
      channel={`activity-comment-publication-${publication.id}`}
      wrapper={(state, blockContent) => {
        if (
          state &&
          state.isInitialized &&
          !commentCapabilities.canComment &&
          state.rootCount === 0
        ) {
          return null;
        }
        return (
          <div className="dz-ViewWork__section dz-ViewWork__comment">
            {blockContent}
          </div>
        );
      }}
    />
  );

  const related = meta?.pub_type === PUB_TYPE_WORK &&
    publication &&
    meta?.related && (
      <div>
        {meta.related.map((item) => (
          <WorksBrief publication={item} key={item.id} />
        ))}
      </div>
    );

  return (
    <Render
      title={title}
      summary={summary}
      content={content}
      author={author}
      meta={
        categories && (
          <div>
            <CategoryTags data={categories} />
          </div>
        )
      }
      footer={
        <>
          {stats}
          {comment}
          {related}
          <BackButton />
          {publication && (
            <FloatActions
              publication={publication}
              currentUser={currentUser}
              commentCapabilities={commentCapabilities}
            />
          )}
        </>
      }
      cover={publication?.cover}
      sidebarFirst={outline}
      sidebarSecond={null}
    />
  );
}

PublicationViewer.propTypes = {
  bundleId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  nodeId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default PublicationViewer;
