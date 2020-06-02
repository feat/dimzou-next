import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import notification from '@feat/feat-ui/lib/notification';
import Button from '@feat/feat-ui/lib/button';

import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';
import intlMessages from '../messages';
import { selectReaderCommented } from '../../../selectors';
import  {asyncFetchReaderCommented } from '../../../actions'
import StickyHeaderBlock from '../../StickyHeaderBlock';
import CommentBoard from './CommentBoard';

function LatestComments() {
  const state = useSelector(selectReaderCommented)
  const dispatch = useDispatch();
  useEffect(() => {
    if (!state.onceFetched) {
      dispatch(asyncFetchReaderCommented()).catch((err) => {
        notification.error({
          message: 'Error',
          description: err.message,
        }); 
      });;
    }
  }, [])
  let content; 
  if (state.fetchError) {
    content = (
      <div>
            Error: {state.fetchError.message}
      </div>
    )
  } else if (state.loading || !state.data) {
    content = (
      <Button type="merge" disabled block>
        <TranslatableMessage message={intlMessages.loadingHint} />
      </Button>
    )
  } else {
    content = state.data.map((publication) => (
      <CommentBoard key={publication.id} entity={publication} />
    ))
  }

  return (
    <StickyHeaderBlock
      title={<TranslatableMessage message={intlMessages.latestComments} />}
      stickyTop="#header"
    >
      {content}
    </StickyHeaderBlock>
  )
}

export default LatestComments;