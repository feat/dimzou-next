import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { compose } from 'redux';
import { withRouter } from 'next/router';

import { selectCurrentUser } from '@/modules/auth/selectors';
import notification from '@feat/feat-ui/lib/notification';

import { mapFeedTemplateFields } from '@/modules/dimzou-view/containers/UserDimzouList/utils';
import TemplateFeedList from '@/components/TemplateFeedList';
import configTemplates from '@/components/FeedTemplate/configTemplates';

import { fetchSubscribedDimzou } from '../requests';

function DimzouSubscription(props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    hasMore: true,
  });
  const [templates, setTemplate] = useState([]);

  const handleLoadMore = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    fetchSubscribedDimzou(data.next || { page_size: 10 })
      .then((res) => {
        const template = configTemplates(
          [],
          res.data.length,
          res.pagination.total_count,
        );
        setData({
          items: [...(data.items || []), ...res.data],
          next: res.pagination.next
            ? {
              page: res.pagination.next,
              page_size: res.pagination.page_size,
            }
            : null,
          hasMore: !!res.pagination.next,
        });
        setTemplate([...templates, ...template]);
      })
      .catch((err) => {
        notification.error({
          message: 'Error',
          description: err.message,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    handleLoadMore();
  }, [])

  const handleItemClick = (item) => {
    if (props.onItemClick) {
      props.onItemClick(item);
      return;
    }
    const href = {
      pathname: item.isDraft ? '/dimzou-edit' : '/dimzou-view',
      query: {
        bundleId: item.id,
      },
    };
    const as = item.isDraft ? `/draft/${item.id}` : `/dimzou/${item.id}`;
    props.router.push(href, as).then(() => {
      window.scrollTo(0, 0);
    });
  };

  return (
    <TemplateFeedList
      items={data.items ? data.items.map(mapFeedTemplateFields) : []}
      templates={templates}
      loading={loading}
      hasMore={data.hasMore}
      loadMore={handleLoadMore}
      noContentLabel={<div>no content</div>}
      itemProps={{
        showAvatar: true,
        onClick: handleItemClick,
      }}
      watchScroll
    />
  );
}

DimzouSubscription.propTypes = {
  router: PropTypes.object,
  onItemClick: PropTypes.func,
};

const withConnect = connect((state, props) => ({
  currentUser: selectCurrentUser(state, props),
}));

export default compose(
  withRouter,
  withConnect,
)(DimzouSubscription);
