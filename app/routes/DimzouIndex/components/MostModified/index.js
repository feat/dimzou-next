import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import notification from '@feat/feat-ui/lib/notification';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import intlMessages from '../../messages';
import { REDUCER_KEY } from '../../reducer';
import { asyncFetchMostModifiedList } from '../../actions';
import MostBlock from '../MostBlock';

function MostModified() {
  // select state,
  const blockState = useSelector((state) => state[REDUCER_KEY].mostModified);
  const dispatch = useDispatch();
  const loader = useMemo(
    () => () => {
      dispatch(asyncFetchMostModifiedList()).catch((err) => {
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
      title={<TranslatableMessage message={intlMessages.mostModified} />}
      blockState={blockState}
      loader={loader}
      prefix="mModified"
    />
  );
}

export default MostModified;
