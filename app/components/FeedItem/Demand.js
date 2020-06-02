import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import Clamp from '@feat/feat-ui/lib/clamp';
import LazyImage from '@feat/feat-ui/lib/lazy-image';
import AvatarStamp from '@/containers/AvatarStamp';

import Card from './Card';

const DemandItem = (props) => {
  const {
    title,
    description,
    images,
    auto_cover,
    author,
    className,
    onClick,
  } = props;

  useEffect(() => {
    const HomeCard = document.querySelectorAll('.ft-HomeCard');
    HomeCard.forEach((card, index) => {
      if (card.className.indexOf('ft-HomeCard_awesome') === -1) {
        // eslint-disable-next-line no-param-reassign
        card.dataset.adDropbox = 'DropBox';
        // eslint-disable-next-line no-param-reassign
        card.dataset.adIndex = index;
      }
    });
  });

  return (
    <Card onClick={onClick} className={className}>
      <Card.Image className="margin_t_12">
        <LazyImage
          ratio={16 / 9}
          src={images.length !== 0 ? images[0].detail.url : auto_cover}
        />
      </Card.Image>
      <Card.Title>
        <Clamp lines={2} ellipsis>
          {`需求：${title}`}
        </Clamp>
      </Card.Title>
      <Card.Content>
        <Clamp lines={3} ellipsis>
          {description}
        </Clamp>
        {author && <AvatarStamp className="margin_t_5" {...author} />}
      </Card.Content>
    </Card>
  );
};

DemandItem.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  className: PropTypes.string,
  author: PropTypes.object,
  onClick: PropTypes.func,
};

export default DemandItem;
