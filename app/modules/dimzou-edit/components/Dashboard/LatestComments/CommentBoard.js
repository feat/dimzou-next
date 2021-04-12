import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import { getText } from '@/utils/content';

import CommentBundle from '@/modules/comment/containers/CommentBundle';
import TCommentBoard from '@/modules/comment/components/CommentBoard';
import { COMMENTABLE_TYPE_PUBLICATION } from '@/modules/comment/constants';
import { getAsPath } from '../../../utils/router';

class CommentBoard extends React.PureComponent {
  render() {
    const { entity } = this.props;
    const title = getText(entity.title);
    const href = {
      pathname: '/dimzou-edit',
      query: {
        pageName: 'view',
        bundleId: entity.bundle_id,
      },
    };
    const asPath = getAsPath(href);

    return (
      <TCommentBoard>
        <TCommentBoard.Header>
          <TCommentBoard.Title>
            <Link href={href} as={asPath}>
              <a>{title}</a>
            </Link>
          </TCommentBoard.Title>
        </TCommentBoard.Header>
        <TCommentBoard.Content>
          <CommentBundle
            entityId={entity.id}
            entityType={COMMENTABLE_TYPE_PUBLICATION}
            pageLayout={false}
            fetchOnMount
            initialRootCount={entity.comments_count || 1}
            instanceKey={`dimzou-dash-comment.${entity.id}`}
            channel={`activity-comment-publication-${entity.id}`}
          />
        </TCommentBoard.Content>
      </TCommentBoard>
    );
  }
}

CommentBoard.propTypes = {
  entity: PropTypes.object,
};

export default CommentBoard;
