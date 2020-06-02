import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import Block from '@feat/feat-ui/lib/block';
import notification from '@feat/feat-ui/lib/notification';
import MaskLoader from '@feat/feat-ui/lib/loader/MaskLoader';

import AvatarStamp from '@/containers/AvatarStamp';
import { getAvatar } from '@/utils/user';

import MostItem from './MostItem';

import './style.scss';

export default function MostBlock(props) {
  const { title, subHeader, data, loading, onceFetched, prefix } = props;

  useEffect(() => {
    if (!onceFetched && !loading) {
      props.loader().catch((err) => {
        notification.error({
          message: 'Error',
          description: err.message,
        });
      });
    }
  });

  return (
    <Block title={title} subHeader={subHeader}>
      {data ? (
        <ul className="mostItemList">
          {prefix !== 'mostTrack' ? (
            <>
              {data.map((record, i) => (
                <MostItem prefix={prefix} {...record} number={i + 1} />
              ))}
            </>
          ) : (
            <>
              {data.map((record) => (
                <div key={record.uid} className="mostItem withoutTitle">
                  <div className="mostItem__info">
                    <div className="mostItem__author">
                      <AvatarStamp
                        uid={record.uid}
                        username={record.username}
                        avatar={getAvatar(record, 'md')}
                        uiMeta={['expertise']}
                        uiExtraMeta={['location']}
                        expertise={record.expertise}
                        location={record.location}
                        size="md"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </ul>
      ) : (
        <div style={{ height: 120, position: 'relative' }}>
          <MaskLoader />
        </div>
      )}
    </Block>
  );
}

MostBlock.propTypes = {
  loader: PropTypes.func.isRequired,
  title: PropTypes.node,
  subHeader: PropTypes.node,
  data: PropTypes.array,
  onceFetched: PropTypes.bool,
  loading: PropTypes.bool,
  prefix: PropTypes.string,
};
