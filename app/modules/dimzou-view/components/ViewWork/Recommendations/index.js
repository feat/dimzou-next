import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import DimzouCardIII from '@feat/feat-ui/lib/dimzou-card/DimzouCardIII';
import AvatarStamp from '@/containers/AvatarStamp';

import './style.scss';

export default function Recommendations(props) {
  const { items, className, onItemClick } = props;
  // const count = items.length;
  return (
    <div className={classNames(className, 'dz-Recommendations')}>
      {items.map((item) => (
        <div className="dz-Recommendations__item" key={item.id}>
          <DimzouCardIII
            title={item.title}
            body={item.content}
            author={item.author}
            cover={item.coverImage}
            titleLines={2}
            bodyLines={2}
            renderAvatar={(author) => <AvatarStamp {...author} />}
            onClick={() => onItemClick(item)}
          />
        </div>
      ))}
    </div>
  );
}

Recommendations.propTypes = {
  items: PropTypes.array,
  className: PropTypes.string,
  onItemClick: PropTypes.func.isRequired,
};
