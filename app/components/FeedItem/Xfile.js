import React from 'react';
import PropTypes from 'prop-types';

import Router from 'next/router';

// import Clamp from '@feat/feat-ui/lib/clamp';
import LazyImage from '@feat/feat-ui/lib/lazy-image';
import AvatarStamp from '@/containers/AvatarStamp';
import defaultAvatar from '@/images/default-avatar.png';

import Card from './Card';

const XfileItem = (props) => {
  const {
    id,
    title,
    content,
    plates,
    className,
    author_avatar: authorAvatar,
    author_name: authorName,
    author,
  } = props;
  return (
    <Card
      className={className}
      modifier="xfile"
      onClick={() => {
        Router.push({
          pathname: '/filex-detail',
          query: { 
            userId: author,
            id, 
          },
        }, `/profile/${author}/file-x/${id}`);
        // dispatch(push());
      }}
    >
      <Card.Title modifier="xfile">
        {/* <Clamp lines={2} ellipsis> */}
        {title}
        {/* </Clamp> */}
      </Card.Title>
      {plates &&
        Boolean(plates.length) && (
        <Card.Image className="margin_t_12">
          <LazyImage ratio={16 / 9} src={plates[0].photo} />
        </Card.Image>
      )}
      <Card.Content>
        <Card.Avatar>
          <AvatarStamp
            username={authorName}
            avatar={authorAvatar || defaultAvatar}
          />
        </Card.Avatar>
        <Card.Body modifier="xfile">{content}</Card.Body>
      </Card.Content>
    </Card>
  );
};

XfileItem.propTypes = {
  id: PropTypes.number,
  author: PropTypes.number,
  author_name: PropTypes.string,
  author_avatar: PropTypes.string,
  title: PropTypes.string,
  content: PropTypes.string,
  plates: PropTypes.array,
  className: PropTypes.string,
};

export default XfileItem;
