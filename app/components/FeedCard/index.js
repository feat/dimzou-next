/**
 *
 * FeedCard
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';

import AvatarStamp from '@/containers/AvatarStamp';
import AwesomeCard from '@/components/AwesomeCard';

import FeedCardTemp from './template';

const openRangeTime = (timeStart, timeEnd) => {
  const tStart = Moment.utc(timeStart)
    .local()
    .format('HH:mm');
  const tEnd = Moment.utc(timeEnd)
    .local()
    .format('HH:mm');
  return `${tStart}--${tEnd}`;
};
const FeedCard = (props) => {
  const { data, className, onClick, typeLabel } = props;
  if (data.kind !== 'awesome') {
    return (
      <FeedCardTemp // eslint-disable-line
        className={className}
        onClick={() => onClick(data)}
      >
        {/* <LazyImage ratio={16 / 9} src={data.cover_image} /> */}
        <FeedCardTemp.Title dangerouslySetInnerHTML={{ __html: data.title }} />
        <FeedCardTemp.Avatar>
          <AvatarStamp {...data.author} />
        </FeedCardTemp.Avatar>
        <FeedCardTemp.Content
          dangerouslySetInnerHTML={{ __html: data.content }}
        />

        <FeedCardTemp.TypeLabel>
          {typeLabel || data.kind}
        </FeedCardTemp.TypeLabel>
      </FeedCardTemp>
    );
  }
  
  return (
    <FeedCardTemp onClick={() => onClick(data)}>
      <AwesomeCard
        style={{ boxShadow: 'none', backgroundColor: 'initial' }}
        commercialSign={data.commercial_sign}
        promoteWords={data.promote_words}
        username={data.username}
        avatar={data.avatar}
        expertise={data.expertise}
        location={data.city}
        // localTime="22:00"
        openRange={openRangeTime(data.open_range_start, data.open_range_end)}
        // nightTheme
      />
      <FeedCardTemp.TypeLabel>{data.kind}</FeedCardTemp.TypeLabel>
    </FeedCardTemp>
  );
};

FeedCard.propTypes = {
  data: PropTypes.shape({
    kind: PropTypes.string,
  }),
  className: PropTypes.string,
  typeLabel: PropTypes.node,
  onClick: PropTypes.func,
};

export default FeedCard;
