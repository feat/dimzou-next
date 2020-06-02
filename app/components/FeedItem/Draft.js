import React from 'react';
import PropTypes from 'prop-types';

import { maxTextContent } from '@/utils/content';

import Clamp from '@feat/feat-ui/lib/clamp';
import LazyImage from '@feat/feat-ui/lib/lazy-image';
import AvatarStamp from '@/containers/AvatarStamp';

import Card from './Card';

const DraftItem = (props) => {
  const {
    title,
    content,
    cover_image: coverImage,
    className,
    author,
    onClick,
  } = props;

  return (
    <Card modifier="draft" onClick={onClick} className={className}>
      <Card.Image className="margin_t_12">
        <LazyImage ratio={16 / 9} src={coverImage} />
      </Card.Image>
      <Card.Title>
        <Clamp lines={2} ellipsis>
          {maxTextContent(title)}
        </Clamp>
      </Card.Title>
      <Card.Content>
        <AvatarStamp className="margin_b_12" {...author} />
        <Clamp lines={3} ellipsis>
          {maxTextContent(content)}
        </Clamp>
      </Card.Content>
    </Card>
  );
};

DraftItem.propTypes = {
  title: PropTypes.string,
  author: PropTypes.object,
  cover_image: PropTypes.string,
  content: PropTypes.string,
};

export default DraftItem;
