/**
 *
 * FeedCard
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import AvatarStamp from '@/containers/AvatarStamp';

import FeedCardTemp from './template';

const FeedCard = (props) => {
  const { data, className, onClick, typeLabel } = props;
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

      <FeedCardTemp.TypeLabel>{typeLabel || data.kind}</FeedCardTemp.TypeLabel>
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
