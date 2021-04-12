import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import FeedRenderContextProvider from '@/components/FeedRender/Provider';
import LoadMoreAnchor from '@/components/LoadMoreAnchor';
import { provider } from '@/components/FeedRender/helpers';
import './style.scss';

class TemplateFeedList extends PureComponent {
  render() {
    const {
      templates,
      items,
      hasMore,
      loading,
      loadMore,
      onItemClick,
      showAvatar,
      watchScroll,
      noContentLabel,
      overflow,
    } = this.props;

    const content = [];
    const toSlice = items || [];
    if (items.length) {
      for (let i = 0, j = 0; i < templates.length; i += 1) {
        const T = provider.getTemplate(templates[i]);
        content.push(
          <T
            data={toSlice.slice(j, j + T.count)}
            key={i}
            startIndex={j}
            showAvatar={showAvatar}
            onItemClick={onItemClick}
          />,
        );
        j += T.count;
      }
    }

    return (
      <FeedRenderContextProvider className="TemplateFeed">
        {!!items.length && content}
        {!hasMore && !items.length && <div>{noContentLabel}</div>}
        {hasMore && (
          <LoadMoreAnchor
            className="TemplateFeed__anchor"
            watchScroll={watchScroll}
            loadMore={loadMore}
            loading={loading}
            overflow={overflow}
          />
        )}
      </FeedRenderContextProvider>
    );
  }
}

TemplateFeedList.propTypes = {
  templates: PropTypes.array.isRequired,
  items: PropTypes.array,
  showAvatar: PropTypes.bool,
  onItemClick: PropTypes.func,
  loadMore: PropTypes.func,
  loading: PropTypes.bool,
  hasMore: PropTypes.bool,
  watchScroll: PropTypes.bool,
  noContentLabel: PropTypes.node,
  overflow: PropTypes.bool,
};

export default TemplateFeedList;
