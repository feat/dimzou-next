import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import notification from '@feat/feat-ui/lib/notification';
import MaskLoader from '@feat/feat-ui/lib/loader/MaskLoader';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import Block from '@/components/Block';
import AvatarStamp from '@/containers/AvatarStamp';
import { getAvatar } from '@/modules/user/utils';
import BlockErrorHint from '@/components/BlockErrorHint';

import intlMessages from '../../messages';
import { REDUCER_KEY } from '../../reducer';
import { asyncFetchMostTrackList } from '../../actions';
import { shouldShowLoading } from '../../utils';

function MostTrack() {
  // select state,
  const blockState = useSelector((state) => state[REDUCER_KEY].mostTrack);
  const dispatch = useDispatch();
  const loader = useMemo(
    () => () => {
      dispatch(asyncFetchMostTrackList()).catch((err) => {
        notification.error({
          message: 'Error',
          description: err.message,
        });
      });
    },
    [],
  );

  useEffect(() => {
    if (!blockState.onceFetched) {
      loader();
    }
  }, []);

  return (
    <Block title={<TranslatableMessage message={intlMessages.mostTrack} />}>
      {blockState.error && (
        <BlockErrorHint error={blockState.error} onRetry={loader} />
      )}
      {blockState.data &&
        blockState.data.map((record) => (
          <div key={record.uid} className="mostItem withoutTitle">
            <div
              style={{
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              <AvatarStamp
                uid={record.uid}
                username={record.username}
                avatar={getAvatar(record, 'md')}
                uiMeta={['expertise']}
                uiExtraMeta={['location']}
                expertise={record.expertise}
                location={record.location}
                size="sm"
              />
            </div>
          </div>
        ))}
      {shouldShowLoading(blockState) && (
        <div style={{ height: 300, position: 'relative' }}>
          <MaskLoader />
        </div>
      )}
    </Block>
  );
}

export default MostTrack;
