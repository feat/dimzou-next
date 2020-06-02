import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector } from 'react-redux'

import { selectCurrentUser } from '@/modules/auth/selectors';

import Button from '@feat/feat-ui/lib/button';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import CommentBundle from '@/modules/comment/containers/CommentBundle';
import {
  COMMENTABLE_TYPE_PUBLICATION,
} from '@/modules/comment/constants';
import intlMessages from '../messages';

function CommentButton(props) {
  const [isOpened, setIsOpened] = useState(false)
  const currentUser = useSelector(selectCurrentUser);
  const { publication } = props;
  const capabilities = useMemo(() => {
    const canComment =
    currentUser &&
    publication.author &&
    publication.author.uid !== currentUser.uid;
    return ({
      canComment,
      maxReplyLimit: 1,
      commentLimit: 1,
    })
  }, [publication, currentUser]);
  
  
  return (
    <>
        <Button
          type='merge'
          className={classNames({
            'is-active': isOpened,
          })}
          onClick={() => {
            setIsOpened(!isOpened);
          }}
        >
          <TranslatableMessage message={intlMessages.commentLabel} />
        </Button>
        {isOpened && (
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
              <div className="dz-FloatCommentBundle">
                {content}
              </div>
            )}
          />
        )}
    </>
  )
}

CommentButton.propTypes = {
  publication: PropTypes.object,
}

export default CommentButton;