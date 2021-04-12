import React, { useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import get from 'lodash/get';

import LazyLoad from '@feat/feat-ui/lib/lazy-load';

import Block from '@/components/Block';
import TranslatableMessage from '@/modules/language/containers/TranslatableMessage';

import cMessages from '@/messages/common';
import { REDUCER_KEY, initialSectionState } from '../../reducer';
import { provider } from '../../helpers';
import { asyncFetchCategoryFeed, setSectionTemplates } from '../../actions';
import CategoryFeed from './CategoryFeed';

function CategoryFeedBlock(props) {
  const { category, onItemClick } = props;
  const blockState = useSelector(
    (state) => state[REDUCER_KEY].sections[category.id] || initialSectionState,
  );
  const dispatch = useDispatch();
  const maxItemCount = useMemo(
    () => {
      if (category.children) {
        return category.children.reduce(
          (sum, sub) => sum + get(sub, 'meta.feeds_count', 0),
          get(category, 'meta.feeds_count', 0),
        );
      }
      return get(category, 'meta.feeds_count', 0);
    },
    [category],
  );

  useEffect(
    () => {
      if (!blockState.templates) {
        const templates = provider.getTemplates(
          maxItemCount ? Math.min(7, maxItemCount) : 0,
        );
        dispatch(
          setSectionTemplates({
            categoryId: category.id,
            templates,
          }),
        );
      }
    },
    [maxItemCount],
  );

  const loader = useCallback(
    () => {
      dispatch(
        asyncFetchCategoryFeed({
          categoryId: category.id,
          maxItemCount,
          templates: blockState.templates,
        }),
      );
    },
    [category.id, blockState.templates],
  );

  return (
    <Block
      className="margin_b_24"
      title={
        <TranslatableMessage
          message={{
            id: `category.${category.slug}`,
            defaultMessage: category.name,
          }}
        />
      }
      subHeader={
        <Link
          href={{
            pathname: '/dimzou-category-feed',
            query: {
              id: category.id,
            },
          }}
          as={`/category/${category.id}`}
        >
          <a className="ft-Block__readMore pull-right">
            <TranslatableMessage message={cMessages.readMore} />
          </a>
        </Link>
      }
    >
      <LazyLoad
        height={500}
        once
        offset={props.lazyOffset}
        visibleByDefault={blockState.onceFetched}
      >
        <CategoryFeed
          blockState={blockState}
          shouldFetch
          loader={loader}
          onItemClick={onItemClick}
        />
      </LazyLoad>
    </Block>
  );
}

CategoryFeedBlock.propTypes = {
  category: PropTypes.object.isRequired,
  onItemClick: PropTypes.func.isRequired,
  lazyOffset: PropTypes.any,
};

export default CategoryFeedBlock;
