import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import notification from '@feat/feat-ui/lib/notification';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import intlMessages from '../../messages';
import { REDUCER_KEY } from '../../reducer';
import { asyncFetchMostCommentedList } from '../../actions';
import MostBlock from '../MostBlock';

function MostCommented() {
  // select state,
  const blockState = useSelector((state) => state[REDUCER_KEY].mostCommented);
  const dispatch = useDispatch();
  const loader = useMemo(
    () => () => {
      dispatch(asyncFetchMostCommentedList()).catch((err) => {
        notification.error({
          message: 'Error',
          description: err.message,
        });
      });
    },
    [],
  );

  return (
    <MostBlock
      title={<TranslatableMessage message={intlMessages.mostCommented} />}
      blockState={blockState}
      loader={loader}
      prefix="mCommented"
    />
  );
}

export default MostCommented;
