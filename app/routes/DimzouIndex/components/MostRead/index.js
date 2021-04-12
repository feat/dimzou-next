import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import notification from '@feat/feat-ui/lib/notification';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import intlMessages from '../../messages';
import { REDUCER_KEY } from '../../reducer';
import { asyncFetchMostReadList } from '../../actions';
import MostBlock from '../MostBlock';

function MostRead() {
  // select state,
  const blockState = useSelector((state) => state[REDUCER_KEY].mostRead);
  const dispatch = useDispatch();
  const loader = useMemo(
    () => () => {
      dispatch(asyncFetchMostReadList()).catch((err) => {
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
      title={<TranslatableMessage message={intlMessages.mostRead} />}
      blockState={blockState}
      loader={loader}
      prefix="mRead"
    />
  );
}

export default MostRead;
