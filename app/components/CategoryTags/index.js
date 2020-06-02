import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import classNames from 'classnames';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import './style.scss';

export default function CategoryTags(props) {
  const { data, className } = props;
  return (
    <div className={classNames(className, 'ft-CategoryTags')}>
      {data.map((cat) => (
        <span key={cat.id} className="ft-CategoryTags__item">
          <Link 
            href={{
              pathname: '/category-feed',
              query: {
                id: cat.id,
              },
            }}
            as={`/category/${cat.id}`}
          >
            <a className="ft-CategoryTag" >
              <TranslatableMessage
                message={{
                  id: `category.${cat.slug}`,
                  defaultMessage: cat.name,
                }}
              />
            </a>
          </Link>
        </span>
      ))}
    </div>
  );
}

export const CategoryTagReverse = (props) => {
  const { data, className, stopPropagation } = props;
  const categoryTags = [...data];
  categoryTags.reverse();
  return (
    <div 
      className={classNames(className, 'ft-CategoryTags')}
      onClick={stopPropagation ? (e) => {
        e.stopPropagation();
      } : undefined}
    >
      {categoryTags.map((cat) => (
        <span key={cat.id} className="ft-CategoryTags__reverseItem">
          <Link 
            href={{
              pathname: '/category-feed',
              query: {
                id: cat.id,
              },
            }}
            as={`/category/${cat.id}`} 
          >
            <a
              className="ft-ReverseCategoryTag"
            >
              <TranslatableMessage
                message={{ id: `category.${cat.slug}`, defaultMessage: cat.name }}
              />
            </a>
          </Link>
        </span>
      ))}
    </div>
  );
};

CategoryTags.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array,
};

CategoryTagReverse.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array,
  stopPropagation: PropTypes.bool,
};
