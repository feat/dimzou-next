import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import notification from '@feat/feat-ui/lib/notification';
import Button from '@feat/feat-ui/lib/button';

import BlockErrorHint from '@/components/BlockErrorHint';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import intlMessages from '../messages';
import { selectReaderCommented } from '../../../selectors';
import { asyncFetchReaderCommented } from '../../../actions';
import StickyHeaderBlock from '../../StickyHeaderBlock';
import CommentBoard from './CommentBoard';

function LatestComments() {
  const state = useSelector(selectReaderCommented);
  const dispatch = useDispatch();
  const loadData = useCallback(() => {
    dispatch(asyncFetchReaderCommented()).catch((err) => {
      notification.error({
        message: 'Error',
        description: err.message,
      });
    });
  }, []);
  useEffect(() => {
    if (!state.onceFetched) {
      loadData();
    }
  }, []);
  let content;
  if (state.fetchError) {
    content = <BlockErrorHint error={state.fetchError} onRetry={loadData} />;
  } else if (state.loading || !state.data) {
    content = (
      <Button type="merge" disabled block>
        <TranslatableMessage message={intlMessages.loadingHint} />
      </Button>
    );
  } else {
    content = (
      <div className="dz-LatestComment__content">
        {state.data.map((publication) => (
          <CommentBoard key={publication.id} entity={publication} />
        ))}
      </div>
    );
  }

  return (
    <StickyHeaderBlock
      title={<TranslatableMessage message={intlMessages.latestComments} />}
      stickyTop="#header"
      className="dz-LatestComment"
    >
      {content}
    </StickyHeaderBlock>
  );
}

export default LatestComments;
