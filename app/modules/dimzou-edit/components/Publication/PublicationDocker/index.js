import React, { useContext, useEffect, useState, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import get from 'lodash/get';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/modules/auth/selectors';

import { useDraggable } from '@/services/dnd/hooks';
import CommentBundle from '@/modules/comment/containers/CommentBundle';
import { COMMENTABLE_TYPE_PUBLICATION } from '@/modules/comment/constants';

import TranslateButton from './TranslateButton';
import ModifyButton from './ModifyButton';
import CommentButton from './CommentButton';
import LikeButton from './LikeButton';
import ShareButton from './ShareButton';
import { PublicationContext } from '../../../context';

import './style.scss';

const DELTA = 50;

function PublicationDocker(props) {
  const publicationState = useContext(PublicationContext);
  const bundleId = get(publicationState, 'data.bundle_id');
  const nodeId = get(publicationState, 'data.node_id');
  const publication = get(publicationState, 'data');
  const domRef = useRef(null);
  const lastBottom = useRef(null);
  const [shouldRender, setShouldRender] = useState(true);
  const [showCommentBundle, setShowCommentBundle] = useState(false);
  const currentUser = useSelector(selectCurrentUser);

  const capabilities = useMemo(
    () => {
      const canComment =
        currentUser &&
        publication.author &&
        publication.author.uid !== currentUser.uid;
      return {
        canComment,
        maxReplyLimit: 1,
        commentLimit: 1,
      };
    },
    [publication, currentUser],
  );

  useEffect(() => {
    const watchScroll = () => {
      const container = document.querySelector('.dz-App');
      if (!container || (!domRef.current && !lastBottom.current)) {
        return;
      }
      const containerBox = container.getBoundingClientRect();
      let boxBottom;
      if (domRef.current) {
        const dockerBox = domRef.current.getBoundingClientRect();
        boxBottom = dockerBox.bottom;
      } else {
        boxBottom = lastBottom.current;
      }
      if (boxBottom < containerBox.bottom - DELTA) {
        setShouldRender(true);
      } else {
        lastBottom.current = boxBottom;
        setShouldRender(false);
      }
    };
    window.addEventListener('scroll', watchScroll);
    return () => {
      window.removeEventListener('scroll', watchScroll);
    };
  }, []);

  const [isDragging, position, drag] = useDraggable({
    initialPosition: {
      right: 80,
      bottom: 80,
    },
    handleUpdate: (prev, delta) => ({
      right: prev.right - delta.x,
      bottom: prev.bottom - delta.y,
    }),
    cacheKey: 'PublicationDocker',
  });

  if (shouldRender && publication) {
    return (
      <div
        ref={domRef}
        style={position}
        className={classNames('dz-PublicationDockerWrap', props.className, {
          'is-dragging': isDragging,
        })}
      >
        {showCommentBundle && (
          <CommentBundle
            autoFocus
            pageLayout={false}
            entityCapabilities={capabilities}
            entityType={COMMENTABLE_TYPE_PUBLICATION}
            entityId={publication.id}
            instanceKey={`dimzou-publication-detail-aside.${publication.id}`}
            initialRootCount={publication.comments_count}
            initialData={publication.comments}
            channel={`activity-comment-publication-${publication.id}`}
            wrapper={(state, content) => (
              <div className="dz-FloatCommentBundle">{content}</div>
            )}
          />
        )}
        <div ref={drag} className="dz-PublicationDocker">
          <div className="dz-PublicationDocker__action">
            <CommentButton
              isActive={showCommentBundle}
              key={nodeId}
              onClick={() => {
                setShowCommentBundle(!showCommentBundle);
              }}
            />
          </div>
          <div className="dz-PublicationDocker__action">
            <TranslateButton publication={publication} />
          </div>
          <div className="dz-PublicationDocker__action">
            <ModifyButton bundleId={bundleId} nodeId={nodeId} />
          </div>
          <div className="dz-PublicationDocker__action">
            <LikeButton publication={publication} />
          </div>
          <div className="dz-PublicationDocker__action">
            <ShareButton publication={publication} />
          </div>
        </div>
      </div>
    );
  }
  return null;
}

PublicationDocker.propTypes = {
  className: PropTypes.string,
};

export default PublicationDocker;
