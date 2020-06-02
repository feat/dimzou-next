import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import LazyLoad from '@feat/feat-ui/lib/lazy-load';
import LoadMoreAnchor from '@/components/LoadMoreAnchor';

import * as Templates from '../FeedTemplate';

class TemplateFeedList extends PureComponent {
  static propTypes = {
    templates: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        count: PropTypes.number,
      }),
    ).isRequired,
    items: PropTypes.array,
    itemProps: PropTypes.object,
    loadMore: PropTypes.func,
    loading: PropTypes.bool,
    hasMore: PropTypes.bool,
    watchScroll: PropTypes.bool,
    noContentLabel: PropTypes.node,
    overflow: PropTypes.bool,
  };

  render() {
    const {
      templates,
      items,
      hasMore,
      loading,
      loadMore,
      itemProps,
      watchScroll,
      noContentLabel,
      overflow,
    } = this.props;
    let renderCount = 0;
    return (
      <div className="usr-Works">
        {!!items.length &&
          templates.map((item, index) => {
            const Template = Templates[item.name];
            renderCount += item.count;
            return (
              <LazyLoad key={index} height={500}>
                <Template
                  items={items.slice(renderCount - item.count, renderCount)}
                  itemProps={itemProps}
                />
              </LazyLoad>
            );
          })}
        {!hasMore && !items.length && <div>{noContentLabel}</div>}
        {hasMore && (
          <LoadMoreAnchor
            watchScroll={watchScroll}
            loadMore={loadMore}
            loading={loading}
            overflow={overflow}
          />
        )}
      </div>
    );
  }
}

export default TemplateFeedList;
