import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { maxTextContent } from '@/utils/content';
import Clamp from '@feat/feat-ui/lib/clamp';
import LazyImage from '@feat/feat-ui/lib/lazy-image';
import AvatarStamp from '@/containers/AvatarStamp';

import { getImage } from '@/utils/pics';

import Card from './Card';

const ArticleItem = (props) => {
  const {
    title,
    content,
    // cover_image,
    cover_images: coverImages,
    className,
    author,
    onClick,
    overflowContainer,
  } = props;

  useEffect(() => {
    const HomeCard = document.querySelectorAll('.ft-HomeCard');
    HomeCard.forEach((card) => {
      if (card.className.indexOf('ft-HomeCard_awesome') === -1) {
        // eslint-disable-next-line no-param-reassign
        card.dataset.adDropbox = 'DropBox';
      }
    });
  });
  return (
    <Card onClick={onClick} className={className}>
      <Card.Image className="margin_t_12">
        <LazyImage
          container={overflowContainer}
          ratio={16 / 9}
          src={getImage(coverImages, 'cover_sm', coverImages.path)}
        />
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

ArticleItem.propTypes = {
  title: PropTypes.string,
  author: PropTypes.object,
  coverImage: PropTypes.string,
  content: PropTypes.string,
  overflowContainer: PropTypes.string,
};

export default ArticleItem;
